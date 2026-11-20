import Link from "next/link";

const COLLECTIONS = [
  {
    name: "Signature",
    subtitle: "Timeless scents that define elegance and individuality.",
    note: "Amber · Vanilla · Musk",
  },
  {
    name: "Oud",
    subtitle: "Deep, rich, and mysterious fragrances for the connoisseur.",
    note: "Agarwood · Saffron · Leather",
  },
  {
    name: "Amber",
    subtitle: "Radiant and captivating blends that leave a lasting impression.",
    note: "Warm Resin · Spices · Tonka",
  },
  {
    name: "Fresh",
    subtitle: "Vibrant and refreshing scents inspired by crisp botanicals.",
    note: "Bergamot · Citrus · White Tea",
  },
];

const SCENT_FAMILIES = ["Floral", "Woody", "Amber", "Citrus"];

export default function Home() {
  return (
    <main className="flex-1 bg-obsidian text-parchment flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-champagne/15 px-6 py-20 md:py-28">
        {/* Subtle warm amber ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[12%] -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-champagne/10 blur-[120px]"
        />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-7 animate-fade-slide-up">
            <p className="text-[11px] uppercase tracking-[0.28em] text-champagne mb-4">
              Beyond Scent, An Experience
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.1] text-parchment mb-6">
              Timeless Luxury, <br />
              Uniquely <em className="text-champagne font-normal">Yours</em>
            </h1>

            <p className="max-w-lg text-sm md:text-base text-parchment/70 leading-relaxed mb-8">
              Discover artisan perfumes curated by Aura Fragrance World. Explore
              signature oud, amber, and evening fragrances crafted to linger.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 border border-champagne/60 text-parchment px-7 py-3 rounded-full text-xs uppercase tracking-[0.18em] hover:bg-champagne hover:text-obsidian transition"
              >
                Discover Collection <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-champagne hover:text-parchment px-4 py-3 transition"
              >
                Sign In to Order
              </Link>
            </div>

            {/* Scent Family Pill Tags */}
            <div className="flex flex-wrap gap-2.5">
              {SCENT_FAMILIES.map((family) => (
                <Link
                  key={family}
                  href="/products"
                  className="border border-champagne/25 bg-espresso/80 text-parchment/80 hover:border-champagne hover:text-champagne text-[11px] uppercase tracking-[0.18em] px-4 py-1.5 rounded-full transition"
                >
                  {family}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Featured Showcase Card (Ready for your bottle photography) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl bg-espresso border border-champagne/25 p-6 shadow-2xl">
              <p className="text-[10px] uppercase tracking-[0.25em] text-champagne mb-1">
                Featured Extrait
              </p>
              <h2 className="font-serif text-2xl text-parchment mb-4">
                Royal Amber Noir
              </h2>

              {/* Clean placeholder frame until you add real bottle images in public/images/ */}
              <div className="aspect-[4/5] w-full rounded-xl bg-gradient-to-b from-[#241B14] to-obsidian border border-champagne/20 flex flex-col items-center justify-center p-6 text-center mb-5">
                <span className="text-[10px] uppercase tracking-[0.3em] text-champagne/80 mb-2">
                  Aura Fragrance World
                </span>
                <p className="font-serif text-xl text-parchment/90 mb-1">
                  Extrait de Parfum
                </p>
                <p className="text-xs text-parchment/50">
                  Product photo slot (public/images/)
                </p>
              </div>

              <p className="text-xs text-parchment/70 mb-4">
                Intense. Elegant. Unforgettable.
              </p>

              <Link
                href="/products"
                className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-champagne hover:text-parchment border-t border-champagne/20 pt-3 transition"
              >
                <span>Explore</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED COLLECTIONS SECTION */}
      <section
        id="collections"
        className="border-b border-champagne/15 px-6 py-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[11px] uppercase tracking-[0.28em] text-champagne mb-3">
              Explore the World of Aura
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-parchment mb-3">
              Curated Collections,{" "}
              <em className="text-champagne font-normal">Timeless Scents</em>
            </h2>
            <p className="text-sm text-parchment/65">
              Each fragrance family is curated to evoke emotion, inspire
              memories, and define your signature presence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTIONS.map((item) => (
              <Link
                key={item.name}
                href="/products"
                className="group rounded-xl bg-espresso border border-champagne/20 hover:border-champagne/60 p-5 flex flex-col justify-between transition"
              >
                <div>
                  <div className="aspect-[4/5] rounded-lg bg-gradient-to-b from-[#231A12] to-obsidian border border-champagne/15 flex items-center justify-center p-4 text-center mb-5">
                    <span className="font-serif text-lg tracking-wide text-champagne/90">
                      {item.name}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-parchment mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-champagne/80 mb-2">
                    {item.note}
                  </p>
                  <p className="text-xs text-parchment/65 leading-relaxed mb-5">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-champagne group-hover:text-parchment border-t border-champagne/15 pt-3 transition">
                  <span>Collection</span>
                  <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CRAFTSMANSHIP STRIP (01) */}
      <section id="craft" className="border-b border-champagne/15 px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5">
            <p className="font-serif text-lg text-champagne/70 mb-2">(01)</p>
            <h2 className="font-serif text-3xl text-parchment leading-snug">
              Ethically Crafted, <br />
              <em className="text-champagne font-normal">
                Exquisitely Sourced
              </em>
            </h2>
          </div>

          <div className="md:col-span-7 md:border-l md:border-champagne/20 md:pl-10">
            <p className="text-sm text-parchment/70 leading-relaxed mb-6">
              We partner with trusted fragrance houses to bring authentic,
              long-lasting oud, amber, and botanical blends directly to
              customers across Bangladesh.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-3 border border-champagne/50 text-parchment px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.18em] hover:bg-champagne hover:text-obsidian transition"
            >
              Create Your Profile <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* DARK LUXURY FOOTER */}
      <footer className="bg-espresso/70 px-6 py-14">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-champagne/15">
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl text-parchment mb-2">
              Find Your Signature <br />
              <em className="text-champagne font-normal">Scent Today</em>
            </h3>
            <p className="text-xs text-parchment/60 max-w-sm mb-5">
              Browse freely and sign in when you are ready to order.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 border border-champagne/50 text-parchment px-5 py-2 rounded-full text-xs uppercase tracking-[0.18em] hover:bg-champagne hover:text-obsidian transition"
            >
              Discover Now <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-champagne mb-4">
              Shop
            </p>
            <ul className="space-y-2.5 text-xs text-parchment/70">
              <li>
                <Link href="/products" className="hover:text-champagne">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/#collections" className="hover:text-champagne">
                  Oud Collection
                </Link>
              </li>
              <li>
                <Link href="/#collections" className="hover:text-champagne">
                  Amber Collection
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-champagne mb-4">
              Account
            </p>
            <ul className="space-y-2.5 text-xs text-parchment/70">
              <li>
                <Link href="/login" className="hover:text-champagne">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-champagne">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-champagne">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-parchment/50">
          <p>© 2026 Aura Fragrance World. All rights reserved.</p>
          <p>Dhaka, Bangladesh</p>
        </div>
      </footer>
    </main>
  );
}