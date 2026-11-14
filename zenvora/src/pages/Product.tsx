import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronRight, Heart, Minus, Plus, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PillowArt, type View } from '@/components/PillowArt'
import { ProductCard, Stars } from '@/components/ProductCard'
import { categories, getProduct, products } from '@/data/products'
import { useStore } from '@/context/store'

const views: { v: View; label: string }[] = [
  { v: 'hero', label: 'Product' },
  { v: 'room', label: 'In bed' },
  { v: 'detail', label: 'Close-up' },
  { v: 'size', label: 'Dimensions' },
]

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug ?? '')
  if (!product) return <NotFound />
  return <Detail key={product.id} slug={product.slug} />
}

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <h1 className="font-display text-5xl">Pillow not found</h1>
      <p className="mt-3 text-muted-foreground">That product doesn't exist or has moved.</p>
      <Button render={<Link to="/shop" />} className="mt-8 h-11 rounded-full px-6">Back to shop</Button>
    </div>
  )
}

function Detail({ slug }: { slug: string }) {
  const p = getProduct(slug)!
  const { priceOf, addItem, wishlist, toggleWish, region, fmt } = useStore()
  const [ci, setCi] = useState(0)
  const [si, setSi] = useState(0)
  const [qty, setQty] = useState(1)
  const [vi, setVi] = useState(0)
  const color = p.colors[ci]
  const size = p.sizes[si]
  const price = priceOf(p, size.label)
  const cat = categories.find((c) => c.slug === p.category)!
  const wished = wishlist.includes(p.id)
  const savePct = Math.round((1 - price.nowNum / price.wasNum) * 100)
  const related = products.filter((x) => x.id !== p.id && x.category !== p.category).slice(0, 4)

  const add = () => {
    addItem(p.id, size.label, color.name, qty)
    toast.success(`${p.name} added to bag`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link><ChevronRight className="size-3" />
        <Link to={`/shop?cat=${p.category}`} className="hover:text-foreground">{cat.name}</Link><ChevronRight className="size-3" />
        <span className="text-foreground">{p.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-sand">
            <AnimatePresence mode="wait">
              <motion.div key={`${views[vi].v}-${color.hex}-${size.label}`} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0 p-4">
                <PillowArt kind={p.category} color={color.hex} view={views[vi].v} dims={size.dims} className="size-full" label={`${p.name}, ${color.name}, ${views[vi].label} view`} />
              </motion.div>
            </AnimatePresence>
            {p.badge && <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] font-medium uppercase tracking-widest backdrop-blur">{p.badge}</span>}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {views.map((v, i) => (
              <button key={v.v} onClick={() => setVi(i)} aria-label={`${v.label} view`} aria-pressed={i === vi}
                className={`aspect-square overflow-hidden rounded-2xl bg-sand p-1 ring-offset-2 ring-offset-background transition ${i === vi ? 'ring-2 ring-foreground' : 'opacity-70 hover:opacity-100'}`}>
                <PillowArt kind={p.category} color={color.hex} view={v.v} dims={size.dims} className="size-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">{cat.name}</p>
          <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">{p.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{p.tagline}</p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Stars rating={p.rating} className="size-4" /> <span>{p.rating}</span>
            <a href="#reviews" className="text-muted-foreground underline-offset-4 hover:underline">({p.reviewCount.toLocaleString()} reviews)</a>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <motion.span key={price.now} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl">{price.now}</motion.span>
            <span className="text-lg text-muted-foreground line-through">{price.was}</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Save {savePct}%</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{region.currency === 'INR' ? 'Inclusive of all taxes.' : 'Taxes and duties calculated at checkout.'} Prices shown in {region.currency}.</p>

          <p className="mt-6 leading-relaxed text-muted-foreground">{p.description}</p>

          <div className="mt-8">
            <p className="mb-3 text-sm font-medium">Colour: <span className="font-normal text-muted-foreground">{color.name}</span></p>
            <div className="flex gap-3" role="radiogroup" aria-label="Colour">
              {p.colors.map((c, i) => (
                <button key={c.name} role="radio" aria-checked={i === ci} aria-label={c.name} onClick={() => setCi(i)} style={{ background: c.hex }}
                  className={`size-10 rounded-full border border-black/10 ring-offset-2 ring-offset-background transition hover:scale-110 ${i === ci ? 'ring-2 ring-foreground' : ''}`} />
              ))}
            </div>
          </div>

          {p.sizes.length > 1 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium">Size: <span className="font-normal text-muted-foreground">{size.label} · {size.dims}</span></p>
              <div className="flex gap-2" role="radiogroup" aria-label="Size">
                {p.sizes.map((s, i) => (
                  <button key={s.label} role="radio" aria-checked={i === si} onClick={() => setSi(i)}
                    className={`rounded-full border px-5 py-2 text-sm transition-colors ${i === si ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>{s.label}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <div className="inline-flex h-12 items-center rounded-full border">
              <button aria-label="Decrease quantity" className="grid size-12 place-items-center" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="size-4" /></button>
              <span className="w-8 text-center tabular-nums" aria-live="polite">{qty}</span>
              <button aria-label="Increase quantity" className="grid size-12 place-items-center" onClick={() => setQty((q) => Math.min(10, q + 1))}><Plus className="size-4" /></button>
            </div>
            <Button onClick={add} className="h-12 flex-1 rounded-full text-base">Add to bag · {priceOf(p, size.label).now}</Button>
            <Button variant="outline" aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={wished} className="size-12 rounded-full" onClick={() => { toggleWish(p.id); toast(wished ? 'Removed from wishlist' : 'Saved to wishlist') }}>
              <Heart className={`size-5 ${wished ? 'fill-rose-500 text-rose-500' : ''}`} />
            </Button>
          </div>

          <ul className="mt-8 grid gap-3 rounded-2xl bg-sand p-5 text-sm sm:grid-cols-3">
            <li className="flex items-center gap-2"><Truck className="size-4 shrink-0 text-gold" /> {region.eta}</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4 shrink-0 text-gold" /> 2-year warranty</li>
            <li className="flex items-center gap-2"><RotateCcw className="size-4 shrink-0 text-gold" /> 100-night trial</li>
          </ul>

          <Tabs defaultValue="features" className="mt-10">
            <TabsList variant="line" className="w-full justify-start">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specs">Specs</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="pt-5">
              <ul className="space-y-4">
                {p.features.map((f) => (
                  <li key={f.title} className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-gold" /><div><p className="font-medium">{f.title}</p><p className="text-sm text-muted-foreground">{f.desc}</p></div></li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="specs" className="pt-5">
              <dl className="divide-y text-sm">
                {p.specs.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right">{v}</dd></div>)}
                <div className="flex justify-between gap-4 py-3"><dt className="text-muted-foreground">Dimensions</dt><dd className="text-right">{size.dims}</dd></div>
              </dl>
            </TabsContent>
            <TabsContent value="shipping" className="space-y-2 pt-5 text-sm text-muted-foreground">
              <p>Shipping to <b className="text-foreground">{region.flag} {region.label}</b>: {region.eta}.</p>
              <p>Free shipping on orders over {fmt(region.freeShippingAt)}. {region.note}.</p>
              <p><Link to="/shipping" className="underline underline-offset-4">Full shipping & returns policy</Link></p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <section id="reviews" className="mt-24">
        <h2 className="font-display text-3xl sm:text-4xl">Customer reviews</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {p.reviews.map((r) => (
            <article key={r.title} className="rounded-3xl border bg-card p-6">
              <Stars rating={r.rating} />
              <h3 className="mt-3 font-display text-lg">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              <p className="mt-4 text-sm font-medium">{r.name} <span className="font-normal text-muted-foreground">· {r.place}</span></p>
            </article>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Sample reviews shown for demonstration.</p>
      </section>

      <section className="mt-24">
        <h2 className="mb-8 font-display text-3xl sm:text-4xl">Complete your sleep</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((r, i) => <ProductCard key={r.id} product={r} index={i} />)}
        </div>
      </section>
    </div>
  )
}
