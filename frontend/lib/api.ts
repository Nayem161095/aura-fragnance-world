const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role: string;
}

// ১. রেজিস্ট্রেশন (Frontend এর full_name কে Backend এর name এ রূপান্তর করে পাঠাবে)
export async function registerUser(payload: {
  full_name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.full_name,
      email: payload.email,
      password: payload.password,
      role: "customer",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Registration failed");
  }
  return data;
}

// ২. লগইন (Backend এর OAuth2PasswordRequestForm অনুযায়ী x-www-form-urlencoded ফরম্যাটে পাঠাবে)
export async function loginUser(payload: { email: string; password: string }) {
  const formBody = new URLSearchParams();
  formBody.append("username", payload.email);
  formBody.append("password", payload.password);

  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody.toString(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Invalid email or password");
  }

  // টোকেন ব্রাউজারে সেভ করা
  if (typeof window !== "undefined" && data.access_token) {
    localStorage.setItem("access_token", data.access_token);
  }

  // AuthSlider যেন data.user.role চেক করতে পারে তাই user অবজেক্ট রিটার্ন করা
  return {
    ...data,
    user: {
      name: data.name,
      email: payload.email,
      role: data.role,
    },
  };
}

// ৩. বর্তমান লগইন করা ইউজারের তথ্য আনা (/profile এন্ডপয়েন্ট থেকে)
export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      localStorage.removeItem("access_token");
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}

// ৪. লগআউট
export async function logoutUser(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
}
