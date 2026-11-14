import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, Search, ShoppingBag, Heart, Globe, Truck } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { regions, useStore } from '@/context/store'
import { CartDrawer } from '@/components/CartDrawer'
import { SearchDialog } from '@/components/SearchDialog'
import { categories } from '@/data/products'

const nav = [
  { to: '/shop', label: 'Shop all' },
  { to: '/shop?cat=cervical', label: 'Cervical' },
  { to: '/shop?cat=luxury', label: 'Luxury' },
  { to: '/shop?cat=cooling', label: 'Cooling' },
  { to: '/shop?cat=travel', label: 'Travel' },
  { to: '/about', label: 'Our story' },
]

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`font-display text-[1.35rem] tracking-[0.32em] ${className}`} aria-label="ZENVORA home">
      ZENVORA
    </Link>
  )
}

function RegionSelect() {
  const { region, setRegion } = useStore()
  return (
    <Select value={region.code} onValueChange={(v) => v && setRegion(v)}>
      <SelectTrigger size="sm" className="h-8 w-auto gap-1.5 border-none bg-transparent px-2 text-xs shadow-none" aria-label="Choose country and currency">
        <Globe className="size-3.5" />
        <SelectValue>{region.flag} {region.currency}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {regions.map((r) => (
          <SelectItem key={r.code} value={r.code}>
            {r.flag} {r.label} · {r.currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function Header() {
  const { count, setCartOpen, setSearchOpen, wishlist, region, fmt } = useStore()
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setMenu(false), [loc.pathname, loc.search])

  return (
    <>
      <div className="bg-ink text-primary-foreground">
        <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[11px] tracking-wide sm:text-xs">
          <Truck className="size-3.5 shrink-0" />
          Free shipping to {region.label} over {fmt(region.freeShippingAt)}<span className="max-sm:hidden"> · 100-night sleep trial</span> · Code <b className="font-semibold">ZEN10</b> for 10% off
        </p>
      </div>
      <header className={`sticky top-0 z-40 border-b transition-all ${scrolled ? 'border-border bg-background/85 backdrop-blur-xl' : 'border-transparent bg-background'}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setMenu(true)}><Menu className="size-5" /></Button>
          </div>
          <Wordmark className="max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2" />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-0.5">
            <span className="hidden sm:block"><RegionSelect /></span>
            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setSearchOpen(true)}><Search className="size-[18px]" /></Button>
            <Button variant="ghost" size="icon" aria-label="Wishlist" className="relative hidden sm:inline-flex" render={<Link to="/shop?wish=1" />}>
              <Heart className="size-[18px]" />
              {wishlist.length > 0 && <span className="absolute right-0.5 top-0.5 size-2 rounded-full bg-gold" />}
            </Button>
            <Button variant="ghost" size="icon" aria-label={`Open cart, ${count} items`} className="relative" onClick={() => setCartOpen(true)}>
              <ShoppingBag className="size-[18px]" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span key={count} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}
                    className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-[85%] max-w-sm bg-background">
          <SheetHeader><SheetTitle className="font-display tracking-[0.3em]">ZENVORA</SheetTitle></SheetHeader>
          <nav className="flex flex-col px-4" aria-label="Mobile">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="border-b py-4 font-display text-2xl">{n.label}</Link>
            ))}
          </nav>
          <div className="mt-auto flex items-center justify-between border-t p-4 text-sm">
            <span className="text-muted-foreground">Country / currency</span>
            <RegionSelect />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function Footer() {
  const { region } = useStore()
  const [email, setEmail] = useState('')
  return (
    <footer className="mt-24 bg-ink text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <Wordmark className="text-primary-foreground" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/60">
            Considered sleep, designed in India and shipped worldwide. Orthopedic, cooling and travel pillows built to help you wake up better.
          </p>
          <form
            className="mt-6 flex max-w-sm gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error('Please enter a valid email address')
              toast.success('Welcome to ZENVORA — check your inbox for 10% off.')
              setEmail('')
            }}
          >
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" aria-label="Email address" className="h-10 border-white/15 bg-white/5 text-primary-foreground placeholder:text-primary-foreground/40" />
            <Button type="submit" className="h-10 bg-gold px-4 text-ink hover:bg-gold/90">Join</Button>
          </form>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-primary-foreground/50">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {categories.map((c) => <li key={c.slug}><Link className="text-primary-foreground/80 hover:text-gold" to={`/shop?cat=${c.slug}`}>{c.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-primary-foreground/50">Help</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link className="text-primary-foreground/80 hover:text-gold" to="/shipping">Shipping & returns</Link></li>
              <li><Link className="text-primary-foreground/80 hover:text-gold" to="/shipping#faq">FAQ</Link></li>
              <li><Link className="text-primary-foreground/80 hover:text-gold" to="/about">Our story</Link></li>
              <li><a className="text-primary-foreground/80 hover:text-gold" href="mailto:hello@zenvora.example">Contact us</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-primary-foreground/50">Shipping to</h4>
            <p className="text-sm text-primary-foreground/80">{region.flag} {region.label}</p>
            <p className="mt-1 text-xs text-primary-foreground/50">{region.eta}</p>
            <div className="mt-5 flex gap-4 text-xs text-primary-foreground/60">
              {['Instagram', 'X', 'YouTube'].map((n) => <a key={n} href="#" className="hover:text-gold">{n}</a>)}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-primary-foreground/45 sm:px-6">
          © {new Date().getFullYear()} ZENVORA. All rights reserved. Demo storefront — no real payments are processed.
        </p>
      </div>
    </footer>
  )
}

export function Layout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0 }) }, [pathname])
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
      <SearchDialog />
      <Toaster position="bottom-center" />
    </div>
  )
}
