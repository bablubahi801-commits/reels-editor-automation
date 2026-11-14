import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { PillowArt } from '@/components/PillowArt'
import { categories, products } from '@/data/products'
import { useStore } from '@/context/store'

export function searchProducts(q: string) {
  const t = q.trim().toLowerCase()
  if (!t) return products
  const words = t.split(/\s+/)
  return products.filter((p) => {
    const hay = `${p.name} ${p.tagline} ${p.category} ${p.tags.join(' ')} ${p.short}`.toLowerCase()
    return words.every((w) => hay.includes(w))
  })
}

export function SearchDialog() {
  const { searchOpen, setSearchOpen, priceOf } = useStore()
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const results = useMemo(() => searchProducts(q).slice(0, 6), [q])

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [setSearchOpen])

  const go = (to: string) => { setSearchOpen(false); setQ(''); nav(to) }

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="top-[18%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl" showCloseButton={false}>
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <DialogDescription className="sr-only">Search pillows by name, category or feature</DialogDescription>
        <form onSubmit={(e) => { e.preventDefault(); go(`/shop?q=${encodeURIComponent(q)}`) }} className="flex items-center gap-3 border-b px-4">
          <Search className="size-4 text-muted-foreground" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pillows, e.g. “cooling” or “neck pain”" aria-label="Search"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground" />
          <kbd className="hidden rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">ESC</kbd>
        </form>
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {!q && (
            <div className="flex flex-wrap gap-2 p-2">
              {categories.map((c) => (
                <button key={c.slug} onClick={() => go(`/shop?cat=${c.slug}`)} className="rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-accent">{c.name}</button>
              ))}
            </div>
          )}
          {results.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No pillows match “{q}”.</p>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <button onClick={() => go(`/product/${p.slug}`)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-accent">
                    <span className="size-14 shrink-0 rounded-lg bg-sand p-1"><PillowArt kind={p.category} color={p.colors[0].hex} className="size-full" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display">{p.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{p.tagline}</span>
                    </span>
                    <span className="text-sm">{priceOf(p).now}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {q && results.length > 0 && (
            <button onClick={() => go(`/shop?q=${encodeURIComponent(q)}`)} className="mt-1 w-full rounded-xl p-3 text-center text-sm text-muted-foreground hover:bg-accent">See all results for “{q}”</button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
