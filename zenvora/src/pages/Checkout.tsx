import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { CheckCircle2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PillowArt } from '@/components/PillowArt'
import { useStore } from '@/context/store'

interface Form { email: string; name: string; phone: string; address: string; city: string; state: string; zip: string }
const empty: Form = { email: '', name: '', phone: '', address: '', city: '', state: '', zip: '' }

export default function Checkout() {
  const { lines, region, subtotal, discountNum, shippingNum, totalNum, fmt, coupon, clearCart, lineTotal } = useStore()
  const [f, setF] = useState<Form>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [pay, setPay] = useState<'card' | 'upi' | 'cod'>(region.code === 'IN' ? 'upi' : 'card')
  const [order, setOrder] = useState<{ id: string; total: string } | null>(null)
  const cod = region.code === 'IN' || region.code === 'AE'
  const method = pay === 'cod' && !cod ? 'card' : pay === 'upi' && region.code !== 'IN' ? 'card' : pay

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setF((v) => ({ ...v, [k]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const er: typeof errors = {}
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email'
    if (f.name.trim().length < 2) er.name = 'Enter your full name'
    if (!/^[+\d][\d\s-]{6,}$/.test(f.phone)) er.phone = 'Enter a valid phone number'
    if (f.address.trim().length < 5) er.address = 'Enter your address'
    if (!f.city.trim()) er.city = 'Required'
    if (!f.state.trim()) er.state = 'Required'
    if (region.code === 'IN' ? !/^\d{6}$/.test(f.zip) : f.zip.trim().length < 3) er.zip = region.code === 'IN' ? 'Enter a 6-digit PIN code' : 'Enter a postal code'
    setErrors(er)
    if (Object.keys(er).length) return
    // Demo only: no payment is processed. Plug in Razorpay (India) / Stripe (international) here.
    setOrder({ id: `ZV-${Date.now().toString().slice(-7)}`, total: fmt(totalNum) })
    clearCart()
  }

  if (order) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-xl px-4 py-24 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.15 }}><CheckCircle2 className="mx-auto size-16 text-emerald-600" /></motion.div>
        <h1 className="mt-6 font-display text-4xl sm:text-5xl">Thank you, {f.name.split(' ')[0]}!</h1>
        <p className="mt-3 text-muted-foreground">Order <b className="text-foreground">{order.id}</b> for {order.total} is confirmed. A confirmation would be emailed to {f.email}.</p>
        <p className="mt-6 rounded-2xl bg-sand p-4 text-sm text-muted-foreground">This is a demo storefront — no payment was taken and no order was placed.</p>
        <Button render={<Link to="/shop" />} className="mt-8 h-12 rounded-full px-8">Continue shopping</Button>
      </motion.div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="font-display text-4xl">Your bag is empty</h1>
        <Button render={<Link to="/shop" />} className="mt-8 h-12 rounded-full px-8">Shop pillows</Button>
      </div>
    )
  }

  const field = (k: keyof Form, label: string, props: React.ComponentProps<'input'> = {}) => (
    <div>
      <label htmlFor={k} className="mb-1.5 block text-sm font-medium">{label}</label>
      <Input id={k} value={f[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `${k}-err` : undefined} className="h-11" {...props} />
      {errors[k] && <p id={`${k}-err`} role="alert" className="mt-1 text-xs text-destructive">{errors[k]}</p>}
    </div>
  )

  const methods = [
    ...(region.code === 'IN' ? [{ v: 'upi' as const, l: 'UPI / Netbanking', d: 'GPay, PhonePe, Paytm and more' }] : []),
    { v: 'card' as const, l: 'Credit / Debit card', d: 'Visa, Mastercard, RuPay, Amex' },
    ...(cod ? [{ v: 'cod' as const, l: 'Cash on delivery', d: 'Pay when your pillow arrives' }] : []),
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl sm:text-5xl">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">Shipping to {region.flag} {region.label} · {region.eta}</p>
      <form onSubmit={submit} noValidate className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="font-display text-2xl">Contact</h2>
            {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl">Delivery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {field('name', 'Full name', { autoComplete: 'name' })}
              {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel' })}
            </div>
            {field('address', 'Address', { autoComplete: 'street-address' })}
            <div className="grid gap-4 sm:grid-cols-3">
              {field('city', 'City', { autoComplete: 'address-level2' })}
              {field('state', region.code === 'IN' ? 'State' : 'State / region', { autoComplete: 'address-level1' })}
              {field('zip', region.code === 'IN' ? 'PIN code' : 'Postal code', { autoComplete: 'postal-code', inputMode: region.code === 'IN' ? 'numeric' : 'text' })}
            </div>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-2xl">Payment</h2>
            <div role="radiogroup" aria-label="Payment method" className="space-y-2">
              {methods.map((m) => (
                <label key={m.v} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${method === m.v ? 'border-primary bg-sand' : 'hover:bg-accent'}`}>
                  <input type="radio" name="pay" checked={method === m.v} onChange={() => setPay(m.v)} className="accent-[var(--primary)]" />
                  <span><span className="block font-medium">{m.l}</span><span className="text-sm text-muted-foreground">{m.d}</span></span>
                </label>
              ))}
            </div>
            <p className="flex items-center gap-2 text-xs text-muted-foreground"><Lock className="size-3.5" /> Demo checkout — no payment details are collected or charged. A live gateway (Razorpay / Stripe) can be connected later.</p>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Order summary</h2>
          <ul className="mt-5 space-y-4">
            {lines.map((l) => (
              <li key={l.key} className="flex items-center gap-3">
                <span className="relative size-16 shrink-0 rounded-xl bg-sand p-1">
                  <PillowArt kind={l.product.category} color={l.product.colors.find((c) => c.name === l.color)?.hex ?? '#ddd'} className="size-full" />
                  <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{l.qty}</span>
                </span>
                <span className="min-w-0 flex-1 text-sm"><span className="block truncate font-medium">{l.product.name}</span><span className="text-muted-foreground">{l.color} · {l.size}</span></span>
                <span className="text-sm">{fmt(lineTotal(l))}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{subtotal}</dd></div>
            {discountNum > 0 && <div className="flex justify-between text-emerald-700"><dt>Discount ({coupon})</dt><dd>−{fmt(discountNum)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shippingNum === 0 ? 'Free' : fmt(shippingNum)}</dd></div>
            <div className="flex justify-between border-t pt-3 text-lg font-medium"><dt>Total</dt><dd>{fmt(totalNum)}</dd></div>
          </dl>
          <p className="mt-2 text-xs text-muted-foreground">{region.note}</p>
          <Button type="submit" className="mt-6 h-12 w-full rounded-full text-base">{method === 'cod' ? 'Place order' : `Pay ${fmt(totalNum)}`}</Button>
        </aside>
      </form>
    </div>
  )
}
