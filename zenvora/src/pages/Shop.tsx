import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Heart, Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ProductCard } from '@/components/ProductCard'
import { searchProducts } from '@/components/SearchDialog'
import { categories } from '@/data/products'
import { useStore } from '@/context/store'

const sorts = [
  { v: 'featured', l: 'Featured' },
  { v: 'price-asc', l: 'Price: low to high' },
  { v: 'price-desc', l: 'Price: high to low' },
  { v: 'rating', l: 'Top rated' },
  { v: 'reviews', l: 'Most reviewed' },
]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const { priceOf, wishlist, region, fmt } = useStore()
  const cat = params.get('cat') ?? 'all'
  const q = params.get('q') ?? ''
  const wish = params.get('wish') === '1'
  const [sort, setSort] = useState('featured')
  const [filters, setFilters] = useState(false)

  const prices = useMemo(() => searchProducts('').map((p) => priceOf(p).nowNum), [priceOf])
  const min = Math.floor(Math.min(...prices)), max = Math.ceil(Math.max(...prices))
  const [range, setRange] = useState<[number, number] | null>(null)
  const [lo, hi] = range && range[0] >= min && range[1] <= max ? range : [min, max]

  const list = useMemo(() => {
    let l = searchProducts(q)
    if (cat !== 'all') l = l.filter((p) => p.category === cat)
    if (wish) l = l.filter((p) => wishlist.includes(p.id))
    l = l.filter((p) => { const n = priceOf(p).nowNum; return n >= lo && n <= hi })
    const by = {
      'price-asc': (a: typeof l[0], b: typeof l[0]) => priceOf(a).nowNum - priceOf(b).nowNum,
      'price-desc': (a: typeof l[0], b: typeof l[0]) => priceOf(b).nowNum - priceOf(a).nowNum,
      rating: (a: typeof l[0], b: typeof l[0]) => b.rating - a.rating,
      reviews: (a: typeof l[0], b: typeof l[0]) => b.reviewCount - a.reviewCount,
    }[sort]
    return by ? [...l].sort(by) : l
  }, [q, cat, wish, wishlist, lo, hi, sort, priceOf])

  const setParam = (k: string, v: string | null) => {
    const n = new URLSearchParams(params)
    if (v) n.set(k, v); else n.delete(k)
    setParams(n, { replace: true })
  }
  const clear = () => { setParams({}, { replace: true }); setRange(null) }
  const active = categories.find((c) => c.slug === cat)
  const dirty = cat !== 'all' || q || wish || lo !== min || hi !== max

  const FilterPanel = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Category</h3>
        <div className="flex flex-col items-start gap-1">
          {[{ slug: 'all', name: 'All pillows' }, ...categories].map((c) => (
            <button key={c.slug} onClick={() => setParam('cat', c.slug === 'all' ? null : c.slug)} aria-pressed={cat === c.slug}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${cat === c.slug ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Price</h3>
        <Slider min={min} max={max} step={region.currency === 'INR' ? 100 : 1} value={[lo, hi]} onValueChange={(v) => Array.isArray(v) && setRange([v[0], v[1]])} aria-label="Price range" />
        <div className="mt-3 flex justify-between text-sm text-muted-foreground"><span>{fmt(lo)}</span><span>{fmt(hi)}</span></div>
      </div>
      <button onClick={() => setParam('wish', wish ? null : '1')} aria-pressed={wish} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${wish ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
        <Heart className="size-4" /> Wishlist only
      </button>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">{q ? 'Search results' : 'Shop'}</p>
        <h1 className="font-display text-4xl sm:text-6xl">{q ? `“${q}”` : wish ? 'Your wishlist' : active?.name ?? 'All pillows'}</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">{active?.blurb ?? 'Orthopedic, luxury, cooling and travel pillows — designed for better sleep.'}</p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setParam('q', e.target.value || null)} placeholder="Search pillows" aria-label="Search pillows" className="h-10 rounded-full pl-9" />
        </div>
        <div className="flex gap-2 overflow-x-auto max-lg:hidden">
          {categories.map((c) => (
            <button key={c.slug} onClick={() => setParam('cat', cat === c.slug ? null : c.slug)} aria-pressed={cat === c.slug}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${cat === c.slug ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>{c.name}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="h-10 rounded-full lg:hidden" onClick={() => setFilters(true)}><SlidersHorizontal className="size-4" /> Filters</Button>
          <Select value={sort} onValueChange={(v) => v && setSort(v)}>
            <SelectTrigger className="h-10 w-48 rounded-full" aria-label="Sort products"><SelectValue>{sorts.find((s) => s.v === sort)?.l}</SelectValue></SelectTrigger>
            <SelectContent align="end">{sorts.map((s) => <SelectItem key={s.v} value={s.v}>{s.l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-24">{FilterPanel}</div></aside>
        <div>
          <p className="mb-5 flex items-center gap-3 text-sm text-muted-foreground" aria-live="polite">
            {list.length} {list.length === 1 ? 'pillow' : 'pillows'}
            {dirty && <button onClick={clear} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground"><X className="size-3" /> Clear filters</button>}
          </p>
          <AnimatePresence mode="popLayout">
            {list.length ? (
              <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-3">
                {list.map((p, i) => (
                  <motion.div layout key={p.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
                    <ProductCard product={p} index={i} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border border-dashed py-24 text-center">
                <p className="font-display text-2xl">No pillows found</p>
                <p className="mt-2 text-sm text-muted-foreground">Try a different search or clear your filters.</p>
                <Button onClick={clear} variant="outline" className="mt-6 rounded-full">Clear filters</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Sheet open={filters} onOpenChange={setFilters}>
        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-3xl bg-background">
          <SheetHeader><SheetTitle className="font-display text-xl">Filters</SheetTitle></SheetHeader>
          <div className="overflow-y-auto px-6 pb-6">{FilterPanel}
            <Button className="mt-8 h-11 w-full rounded-full" onClick={() => setFilters(false)}>Show {list.length} results</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
