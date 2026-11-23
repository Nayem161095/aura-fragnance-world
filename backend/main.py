from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from jose import JWTError, jwt

import models, auth
from database import engine, get_db

# ডাটাবেসে টেবিল তৈরি করা
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Aura Fragrance World - Auth & RBAC API")

# ফ্রন্টএন্ডের (Next.js) সাথে কানেক্ট করার জন্য CORS সেটআপ
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# --- ইনপুট ভ্যালিডেশন স্কিমা (Pydantic) ---
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    address: Optional[str] = None
    role: str = "customer"  # 'customer' অথবা 'admin'

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

# --- Authentication: টোকেন যাচাই করে বর্তমান ইউজার বের করা ---
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# --- Authorization: শুধু Admin রোল থাকলে অনুমতি দেওয়া ---
def get_admin_user(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied: Admins only")
    return current_user

# ================= API ENDPOINTS =================

# ১. রেজিস্ট্রেশন (Registration)
@app.post("/register", tags=["Authentication"])
def register(user: UserRegister, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=auth.get_password_hash(user.password),
        phone=user.phone,
        address=user.address,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Registration successful", "user_id": new_user.id, "role": new_user.role}

# ২. লগইন ও টোকেন জেনারেট (Login & Authentication)
@app.post("/login", tags=["Authentication"])
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    token = auth.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role, "name": user.name}

# ৩. কাস্টমার প্রোফাইল দেখা (Login Required)
@app.get("/profile", tags=["Customer Authorization"])
def get_profile(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "address": current_user.address,
        "role": current_user.role
    }

# ৪. কাস্টমার প্রোফাইল আপডেট (Login Required)
@app.put("/profile", tags=["Customer Authorization"])
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if data.name is not None:
        current_user.name = data.name
    if data.phone is not None:
        current_user.phone = data.phone
    if data.address is not None:
        current_user.address = data.address
    db.commit()
    return {"message": "Profile updated successfully"}

# ৫. অ্যাডমিন প্যানেল - সব কাস্টমার দেখা (Admin Role Required)
@app.get("/admin/customers", tags=["Admin Authorization"])
def all_customers(db: Session = Depends(get_db), admin: models.User = Depends(get_admin_user)):
    customers = db.query(models.User).filter(models.User.role == "customer").all()
    return [{"id": c.id, "name": c.name, "email": c.email, "phone": c.phone, "address": c.address} for c in customers]
