import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, ShoppingBag, Tag, Trash2, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PillowArt } from '@/components/PillowArt'
import { useStore } from '@/context/store'

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, count, setQty, removeItem, subtotal, subtotalNum, discountNum, shippingNum, totalNum, fmt, region, coupon, applyCoupon, lineTotal } = useStore()
  const [code, setCode] = useState('')
  const remaining = Math.max(0, region.freeShippingAt - (subtotalNum - discountNum))
  const progress = Math.min(100, ((subtotalNum - discountNum) / region.freeShippingAt) * 100)

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="w-full bg-background data-[side=right]:sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="font-display text-xl">Your bag <span className="text-muted-foreground">({count})</span></SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-sand"><ShoppingBag className="size-7 text-muted-foreground" /></div>
            <p className="font-display text-xl">Your bag is empty</p>
            <p className="text-sm text-muted-foreground">Discover pillows designed for better sleep.</p>
            <Button render={<Link to="/shop" />} onClick={() => setCartOpen(false)} className="h-10 rounded-full px-6">Shop pillows</Button>
          </div>
        ) : (
          <>
            <div className="border-b px-4 pb-4">
              <p className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="size-3.5" />
                {remaining > 0 ? <>Add <b className="text-foreground">{fmt(remaining)}</b> more for free shipping</> : <b className="text-foreground">You've unlocked free shipping 🎉</b>}
              </p>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <motion.div className="h-full rounded-full bg-gold" initial={false} animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
              </div>
            </div>
            <ul className="flex-1 space-y-5 overflow-y-auto px-4">
              <AnimatePresence initial={false}>
                {lines.map((l) => {
                  const hex = l.product.colors.find((c) => c.name === l.color)?.hex ?? l.product.colors[0].hex
                  return (
                    <motion.li key={l.key} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0 }} className="flex gap-4">
                      <Link to={`/product/${l.product.slug}`} onClick={() => setCartOpen(false)} className="size-24 shrink-0 rounded-xl bg-sand p-1.5">
                        <PillowArt kind={l.product.category} color={hex} className="size-full" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <Link to={`/product/${l.product.slug}`} onClick={() => setCartOpen(false)} className="font-display leading-snug">{l.product.name}</Link>
                          <button aria-label={`Remove ${l.product.name}`} onClick={() => { removeItem(l.key); toast('Removed from bag') }} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                        </div>
                        <p className="text-xs text-muted-foreground">{l.color} · {l.size}</p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="inline-flex items-center rounded-full border">
                            <button aria-label="Decrease quantity" className="grid size-8 place-items-center" onClick={() => setQty(l.key, l.qty - 1)}><Minus className="size-3.5" /></button>
                            <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">{l.qty}</span>
                            <button aria-label="Increase quantity" className="grid size-8 place-items-center" onClick={() => setQty(l.key, l.qty + 1)}><Plus className="size-3.5" /></button>
                          </div>
                          <p className="text-sm font-medium">{fmt(lineTotal(l))}</p>
                        </div>
                      </div>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ul>
            <SheetFooter className="border-t bg-card">
              {coupon ? (
                <p className="flex items-center gap-2 text-sm text-emerald-700"><Tag className="size-4" /> {coupon} applied — 10% off</p>
              ) : (
                <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (applyCoupon(code)) { toast.success('Coupon applied'); setCode('') } else toast.error('Invalid code. Try ZEN10') }}>
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" aria-label="Discount code" className="h-10" />
                  <Button type="submit" variant="outline" className="h-10">Apply</Button>
                </form>
              )}
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{subtotal}</dd></div>
                {discountNum > 0 && <div className="flex justify-between text-emerald-700"><dt>Discount</dt><dd>−{fmt(discountNum)}</dd></div>}
                <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shippingNum === 0 ? 'Free' : fmt(shippingNum)}</dd></div>
                <div className="flex justify-between border-t pt-2 text-base font-medium"><dt>Total</dt><dd>{fmt(totalNum)}</dd></div>
              </dl>
              <Button render={<Link to="/checkout" />} onClick={() => setCartOpen(false)} className="h-12 w-full rounded-full text-base">Checkout</Button>
              <p className="text-center text-xs text-muted-foreground">{region.note}</p>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
