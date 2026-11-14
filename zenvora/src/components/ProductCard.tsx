import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Heart, Plus, Star } from 'lucide-react'
import { toast } from 'sonner'
import { PillowArt } from '@/components/PillowArt'
import { useStore } from '@/context/store'
import type { Product } from '@/data/products'

export function Stars({ rating, className = 'size-3.5' }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${className} ${i <= Math.round(rating) ? 'fill-gold text-gold' : 'text-border'}`} />
      ))}
    </span>
  )
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { priceOf, addItem, wishlist, toggleWish } = useStore()
  const [ci, setCi] = useState(0)
  const color = product.colors[ci]
  const price = priceOf(product)
  const wished = wishlist.includes(product.id)

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-sand">
        <Link to={`/product/${product.slug}`} aria-label={product.name} className="block">
          <motion.div whileHover={{ scale: 1.05, rotate: -1 }} transition={{ type: 'spring', stiffness: 160, damping: 16 }} className="aspect-square p-4">
            <PillowArt kind={product.category} color={color.hex} className="size-full" label={`${product.name} in ${color.name}`} />
          </motion.div>
        </Link>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest backdrop-blur">{product.badge}</span>
        )}
        <button
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          onClick={() => { toggleWish(product.id); toast(wished ? 'Removed from wishlist' : 'Saved to wishlist') }}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-background/90 backdrop-blur transition-transform hover:scale-110"
        >
          <Heart className={`size-4 ${wished ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
        <button
          onClick={() => { addItem(product.id, product.sizes[0].label, color.name) }}
          className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-xs font-medium text-primary-foreground opacity-0 transition-all duration-300 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100"
        >
          <Plus className="size-3.5" /> Quick add
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg leading-snug"><Link to={`/product/${product.slug}`}>{product.name}</Link></h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{product.short}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-medium">{price.now}</p>
          <p className="text-xs text-muted-foreground line-through">{price.was}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Stars rating={product.rating} /> <span>{product.rating} ({product.reviewCount.toLocaleString()})</span>
        </div>
        <div className="flex gap-1.5">
          {product.colors.map((c, i) => (
            <button key={c.name} aria-label={`Colour ${c.name}`} aria-pressed={i === ci} onClick={() => setCi(i)}
              style={{ background: c.hex }} className={`size-4 rounded-full border border-black/10 ring-offset-2 ring-offset-background transition ${i === ci ? 'ring-2 ring-foreground' : ''}`} />
          ))}
        </div>
      </div>
    </motion.article>
  )
}
