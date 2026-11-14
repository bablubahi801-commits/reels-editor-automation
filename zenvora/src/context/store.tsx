import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getProductById, type Product } from '@/data/products'

/* ───────── Regions & currency (India + international) ───────── */
export interface Region {
  code: string
  label: string
  flag: string
  currency: string
  locale: string
  /** multiplier applied to the USD base price */
  rate: number
  freeShippingAt: number
  shippingFee: number
  eta: string
  note: string
}

export const regions: Region[] = [
  { code: 'IN', label: 'India', flag: '🇮🇳', currency: 'INR', locale: 'en-IN', rate: 0, freeShippingAt: 999, shippingFee: 79, eta: '3–6 business days', note: 'Inclusive of GST · Cash on Delivery available' },
  { code: 'US', label: 'United States', flag: '🇺🇸', currency: 'USD', locale: 'en-US', rate: 1, freeShippingAt: 99, shippingFee: 12, eta: '7–12 business days', note: 'Duties may apply at delivery' },
  { code: 'GB', label: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', locale: 'en-GB', rate: 0.79, freeShippingAt: 79, shippingFee: 9, eta: '7–12 business days', note: 'Import VAT collected at checkout' },
  { code: 'EU', label: 'Europe', flag: '🇪🇺', currency: 'EUR', locale: 'de-DE', rate: 0.93, freeShippingAt: 89, shippingFee: 10, eta: '8–14 business days', note: 'Import VAT collected at checkout' },
  { code: 'AE', label: 'UAE', flag: '🇦🇪', currency: 'AED', locale: 'en-AE', rate: 3.67, freeShippingAt: 350, shippingFee: 35, eta: '5–9 business days', note: 'Cash on Delivery available' },
  { code: 'CA', label: 'Canada', flag: '🇨🇦', currency: 'CAD', locale: 'en-CA', rate: 1.38, freeShippingAt: 130, shippingFee: 16, eta: '8–14 business days', note: 'Duties may apply at delivery' },
  { code: 'AU', label: 'Australia', flag: '🇦🇺', currency: 'AUD', locale: 'en-AU', rate: 1.52, freeShippingAt: 150, shippingFee: 18, eta: '9–15 business days', note: 'Duties may apply at delivery' },
  { code: 'SG', label: 'Singapore', flag: '🇸🇬', currency: 'SGD', locale: 'en-SG', rate: 1.34, freeShippingAt: 120, shippingFee: 14, eta: '5–9 business days', note: 'GST applied at checkout' },
]

/* ───────── Cart types ───────── */
export interface CartItem { key: string; productId: string; size: string; color: string; qty: number }
export interface CartLine extends CartItem { product: Product; unitUsd: number; unitInr: number }

interface Store {
  region: Region
  setRegion: (code: string) => void
  money: (usd: number, inr: number) => string
  priceOf: (p: Product, sizeLabel?: string) => { now: string; was: string; nowNum: number; wasNum: number }
  lines: CartLine[]
  count: number
  subtotalNum: number
  subtotal: string
  addItem: (productId: string, size: string, color: string, qty?: number) => void
  setQty: (key: string, qty: number) => void
  removeItem: (key: string) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  wishlist: string[]
  toggleWish: (id: string) => void
  coupon: string | null
  applyCoupon: (code: string) => boolean
  discountNum: number
  shippingNum: number
  totalNum: number
  fmt: (n: number) => string
  lineTotal: (l: CartLine) => number
}

const Ctx = createContext<Store | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
}

function unitPrices(p: Product, size: string) {
  const s = p.sizes.find((x) => x.label === size) ?? p.sizes[0]
  return { usd: p.price.usd + s.extraUsd, inr: p.price.inr + s.extraInr, wasUsd: p.compareAt.usd + s.extraUsd, wasInr: p.compareAt.inr + s.extraInr }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [regionCode, setRegionCode] = useState<string>(() => load('zv-region', 'IN'))
  const [items, setItems] = useState<CartItem[]>(() => load('zv-cart', []))
  const [wishlist, setWishlist] = useState<string[]>(() => load('zv-wish', []))
  const [coupon, setCoupon] = useState<string | null>(() => load('zv-coupon', null))
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => save('zv-region', regionCode), [regionCode])
  useEffect(() => save('zv-cart', items), [items])
  useEffect(() => save('zv-wish', wishlist), [wishlist])
  useEffect(() => save('zv-coupon', coupon), [coupon])

  const region = regions.find((r) => r.code === regionCode) ?? regions[0]

  const fmt = useCallback(
    (n: number) =>
      new Intl.NumberFormat(region.locale, { style: 'currency', currency: region.currency, maximumFractionDigits: region.currency === 'INR' || region.currency === 'AED' ? 0 : 2, minimumFractionDigits: 0 }).format(n),
    [region],
  )

  const convert = useCallback(
    (usd: number, inr: number) => {
      if (region.currency === 'INR') return inr
      const v = usd * region.rate
      return region.rate >= 3 ? Math.round(v / 5) * 5 : Math.round(v)
    },
    [region],
  )

  const money = useCallback((usd: number, inr: number) => fmt(convert(usd, inr)), [fmt, convert])

  const priceOf = useCallback(
    (p: Product, sizeLabel?: string) => {
      const u = unitPrices(p, sizeLabel ?? p.sizes[0].label)
      const nowNum = convert(u.usd, u.inr)
      const wasNum = convert(u.wasUsd, u.wasInr)
      return { now: fmt(nowNum), was: fmt(wasNum), nowNum, wasNum }
    },
    [convert, fmt],
  )

  const lines = useMemo<CartLine[]>(
    () =>
      items.flatMap((it) => {
        const product = getProductById(it.productId)
        if (!product) return []
        const u = unitPrices(product, it.size)
        return [{ ...it, product, unitUsd: u.usd, unitInr: u.inr }]
      }),
    [items],
  )

  const subtotalNum = lines.reduce((s, l) => s + convert(l.unitUsd, l.unitInr) * l.qty, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const discountNum = coupon === 'ZEN10' ? Math.round(subtotalNum * 0.1 * 100) / 100 : 0
  const afterDiscount = subtotalNum - discountNum
  // freeShippingAt / shippingFee are expressed in the region's local currency
  const shippingNum = lines.length === 0 || afterDiscount >= region.freeShippingAt ? 0 : region.shippingFee
  const totalNum = afterDiscount + shippingNum

  const addItem = useCallback((productId: string, size: string, color: string, qty = 1) => {
    const key = `${productId}|${size}|${color}`
    setItems((prev) => {
      const found = prev.find((i) => i.key === key)
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(10, i.qty + qty) } : i))
      return [...prev, { key, productId, size, color, qty }]
    })
    setCartOpen(true)
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty: Math.min(10, qty) } : i))))
  }, [])
  const removeItem = useCallback((key: string) => setItems((p) => p.filter((i) => i.key !== key)), [])
  const clearCart = useCallback(() => { setItems([]); setCoupon(null) }, [])
  const toggleWish = useCallback((id: string) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])), [])
  const applyCoupon = useCallback((code: string) => {
    const c = code.trim().toUpperCase()
    if (c === 'ZEN10') { setCoupon(c); return true }
    return false
  }, [])

  const value: Store = {
    region, setRegion: setRegionCode, money, priceOf, lines, count, subtotalNum, subtotal: fmt(subtotalNum),
    addItem, setQty, removeItem, clearCart, cartOpen, setCartOpen, searchOpen, setSearchOpen,
    wishlist, toggleWish, coupon, applyCoupon, discountNum, shippingNum, totalNum, fmt,
    lineTotal: (l) => convert(l.unitUsd, l.unitInr) * l.qty,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useStore must be used within StoreProvider')
  return c
}
