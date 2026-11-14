import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Check, Globe2, Leaf, Moon, RotateCcw, ShieldCheck, Snowflake, Truck, Wind } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PillowArt } from '@/components/PillowArt'
import { ProductCard, Stars } from '@/components/ProductCard'
import { categories, featuredReviews, products, getProduct } from '@/data/products'
import { useStore } from '@/context/store'

const ease = [0.22, 1, 0.36, 1] as const

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay, ease }} className={className}>
      {children}
    </motion.div>
  )
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const rot = useTransform(scrollYProgress, [0, 1], [-4, 8])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const hero = getProduct('aura-cervical-contour-pillow')!
  const { priceOf } = useStore()

  return (
    <section ref={ref} className="relative overflow-hidden bg-sand grain">
      <div className="absolute -right-40 -top-40 size-[34rem] rounded-full bg-gold/20 blur-3xl" aria-hidden />
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 pt-10 sm:px-6 lg:min-h-[44rem] lg:grid-cols-2 lg:gap-4 lg:py-16">
        <motion.div style={{ y: textY }} className="relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-foreground/15 px-3 py-1 text-[11px] uppercase tracking-[0.22em]">
            <Moon className="size-3" /> Designed in India · Shipped worldwide
          </motion.p>
          <h1 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {['Sleep', 'deeper.', 'Wake', 'better.'].map((w, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease }}
                className={`mr-3 inline-block ${i % 2 ? 'italic text-gold' : ''}`}>
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Orthopedic memory foam, cooling gel and luxury fills — engineered to support your neck and quiet your nights.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.8 }} className="mt-8 flex flex-wrap items-center gap-3">
            <Button render={<Link to="/shop" />} className="h-12 rounded-full px-7 text-base">Shop pillows <ArrowRight className="size-4" /></Button>
            <Button render={<Link to={`/product/${hero.slug}`} />} variant="outline" className="h-12 rounded-full bg-transparent px-7 text-base">Meet Aura · from {priceOf(hero).now}</Button>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {['100-night trial', '2-year warranty', 'Free returns in India'].map((t) => (
              <li key={t} className="flex items-center gap-1.5"><Check className="size-4 text-gold" /> {t}</li>
            ))}
          </motion.ul>
        </motion.div>

        <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
          <motion.div style={{ y, rotate: rot }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease }} className="absolute inset-0">
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="size-full">
              <PillowArt kind="cervical" color="#E8DCC8" className="size-full drop-shadow-2xl" label="Aura cervical memory foam pillow" />
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="absolute bottom-6 right-0 rounded-2xl bg-background/90 p-4 shadow-xl backdrop-blur sm:right-6">
            <Stars rating={5} />
            <p className="mt-1 font-display text-2xl leading-none">4.8<span className="text-sm text-muted-foreground"> / 5</span></p>
            <p className="text-xs text-muted-foreground">Over 6,000 happy sleepers</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.35 }} className="absolute left-0 top-10 rounded-2xl bg-background/90 px-4 py-3 shadow-xl backdrop-blur sm:left-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Contour</p>
            <p className="font-display text-lg">Dual-curve support</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Marquee() {
  const items = ['Orthopedic memory foam', 'Cooling gel', 'Breathable bamboo covers', 'Hypoallergenic', 'Ships to 8+ regions', 'Cash on delivery in India', '100-night sleep trial']
  return (
    <div className="overflow-hidden border-y bg-background py-4" aria-hidden>
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-display text-lg text-muted-foreground">
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-12">{t}<span className="text-gold">✦</span></span>
        ))}
      </div>
    </div>
  )
}

function Categories() {
  const colors: Record<string, string> = { cervical: '#E8DCC8', luxury: '#F1EADB', cooling: '#BFD9E4', travel: '#D9B5AE' }
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">Collections</p>
          <h2 className="font-display text-4xl sm:text-5xl">Find your fit</h2>
        </div>
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline">View all <ArrowRight className="size-4" /></Link>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.08}>
            <Link to={`/shop?cat=${c.slug}`} className="group relative block overflow-hidden rounded-3xl bg-sand p-6 transition-shadow hover:shadow-xl">
              <div className="aspect-[4/3] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
                <PillowArt kind={c.slug} color={colors[c.slug]} className="size-full" />
              </div>
              <h3 className="mt-3 font-display text-xl">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Bestsellers() {
  const list = products.filter((p) => p.badge).slice(0, 4)
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      <Reveal className="mb-10 text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">Most loved</p>
        <h2 className="font-display text-4xl sm:text-5xl">Bestsellers</h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  )
}

const showcase = [
  { slug: 'aura-cervical-contour-pillow', icon: Leaf, label: 'Cervical', title: 'Spinal alignment, sculpted.', body: 'Two curves. One for back sleepers, one for side sleepers. Slow-recovery foam that remembers you.', color: '#E8DCC8' },
  { slug: 'regal-luxury-sleeping-pillow', icon: Moon, label: 'Luxury', title: 'Five-star, every night.', body: 'Cloud-soft cluster fill wrapped in cotton sateen with hand-finished piping.', color: '#F1EADB' },
  { slug: 'glacier-cooling-gel-pillow', icon: Snowflake, label: 'Cooling', title: 'Stay cool until sunrise.', body: 'Gel-infused foam and an airflow lattice pull heat away from your head and neck.', color: '#BFD9E4' },
  { slug: 'nomad-travel-neck-pillow', icon: Wind, label: 'Travel', title: 'Sleep anywhere you land.', body: 'A U-shaped wrap that clips shut, folds small and keeps your head supported at 35,000 feet.', color: '#D9B5AE' },
]

function Showcase() {
  const [active, setActive] = useState(0)
  const s = showcase[active]
  const p = getProduct(s.slug)!
  const { priceOf, addItem } = useStore()
  return (
    <section className="mt-24 bg-ink py-24 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-12 max-w-xl">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">The collection</p>
          <h2 className="font-display text-4xl sm:text-5xl">Four ways to rest better</h2>
        </Reveal>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-square max-h-[34rem] overflow-hidden rounded-[2rem]" style={{ background: `radial-gradient(circle at 50% 40%, ${s.color}55, transparent 70%)` }}>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, scale: 0.85, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.1, rotate: 8 }} transition={{ duration: 0.5, ease }} className="absolute inset-0 p-8">
                <PillowArt kind={p.category} color={s.color} className="size-full drop-shadow-2xl" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div>
            <div role="tablist" aria-label="Collections" className="mb-8 flex flex-wrap gap-2">
              {showcase.map((x, i) => (
                <button key={x.slug} role="tab" aria-selected={i === active} onClick={() => setActive(i)}
                  className={`relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${i === active ? 'border-transparent text-ink' : 'border-white/20 text-primary-foreground/70 hover:border-white/50'}`}>
                  {i === active && <motion.span layoutId="show-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <x.icon className="relative size-4" /><span className="relative">{x.label}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                <h3 className="font-display text-4xl leading-tight sm:text-5xl">{s.title}</h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-primary-foreground/65">{s.body}</p>
                <ul className="mt-6 space-y-2 text-sm text-primary-foreground/80">
                  {p.features.slice(0, 3).map((f) => <li key={f.title} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-gold" />{f.title}</li>)}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button onClick={() => addItem(p.id, p.sizes[0].label, p.colors[0].name)} className="h-12 rounded-full bg-gold px-7 text-base text-ink hover:bg-gold/90">Add to bag · {priceOf(p).now}</Button>
                  <Button render={<Link to={`/product/${p.slug}`} />} variant="ghost" className="h-12 rounded-full px-6 text-base text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">Details <ArrowRight className="size-4" /></Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  const items = [
    { i: ShieldCheck, t: '100-night trial', d: 'Sleep on it for 100 nights. Not in love? Send it back.' },
    { i: Globe2, t: 'India + worldwide', d: 'Prices in INR, USD, GBP, EUR, AED and more.' },
    { i: Truck, t: 'Fast, tracked delivery', d: '3–6 days in India, 5–15 days internationally.' },
    { i: RotateCcw, t: 'Easy returns', d: 'Free returns in India. Hassle-free worldwide.' },
  ]
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      <div className="grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {items.map((b, i) => (
          <Reveal key={b.t} delay={i * 0.07} className="bg-card p-7">
            <b.i className="size-6 text-gold" />
            <h3 className="mt-4 font-display text-lg">{b.t}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{b.d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Compare() {
  const rows: [string, string[]][] = [
    ['Best for', ['Neck & spine support', 'Plush hotel feel', 'Hot sleepers', 'Flights & road trips']],
    ['Fill', ['Memory foam', 'Cloud microfibre', 'Gel memory foam', 'Memory foam']],
    ['Firmness', ['Medium-firm', 'Plush-medium', 'Medium', 'Medium']],
    ['Cooling', ['●●○', '●●○', '●●●', '●○○']],
    ['Portable', ['●○○', '●○○', '●○○', '●●●']],
  ]
  const heads = ['Cervical', 'Luxury', 'Cooling', 'Travel']
  return (
    <section className="mx-auto max-w-5xl px-4 pt-24 sm:px-6">
      <Reveal className="mb-8 text-center">
        <h2 className="font-display text-4xl sm:text-5xl">Which pillow is for you?</h2>
      </Reveal>
      <Reveal className="overflow-x-auto rounded-3xl border bg-card">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-4" />
              {heads.map((h) => <th key={h} className="p-4 font-display text-lg font-normal">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, cells]) => (
              <tr key={label} className="border-b last:border-0">
                <th scope="row" className="p-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</th>
                {cells.map((c, i) => <td key={i} className="p-4">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </section>
  )
}

function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      <Reveal className="mb-10 text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">Loved worldwide</p>
        <h2 className="font-display text-4xl sm:text-5xl">Wake up happier</h2>
      </Reveal>
      <div className="grid gap-4 md:grid-cols-3">
        {featuredReviews.slice(0, 3).map((r, i) => (
          <Reveal key={r.name} delay={i * 0.1} className="rounded-3xl border bg-card p-7">
            <Stars rating={r.rating} />
            <h3 className="mt-4 font-display text-xl">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
            <p className="mt-5 text-sm font-medium">{r.name} <span className="font-normal text-muted-foreground">· {r.place}</span></p>
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">Sample reviews shown for demonstration.</p>
    </section>
  )
}

export const faqs = [
  { q: 'How do I choose the right pillow height?', a: 'Side sleepers generally need a higher loft, back sleepers a medium loft and stomach sleepers a low one. Aura Pro lets you adjust the height yourself with removable foam layers.' },
  { q: 'Do you ship internationally?', a: 'Yes. We ship from India to the US, UK, Europe, UAE, Canada, Australia and Singapore. Choose your country at the top of the page to see local pricing, delivery estimates and any import duties.' },
  { q: 'Is Cash on Delivery available?', a: 'Cash on Delivery is available for orders within India and the UAE.' },
  { q: 'What is the 100-night sleep trial?', a: 'Try any ZENVORA pillow for up to 100 nights. If it is not right, contact us for a return and refund.' },
  { q: 'How do I care for my pillow?', a: 'Remove the cover and wash it per the care label. Memory foam should be spot-cleaned and air-dried, never machine-washed or tumble-dried.' },
]

function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 pt-24 sm:px-6">
      <Reveal className="mb-8 text-center"><h2 className="font-display text-4xl sm:text-5xl">Questions, answered</h2></Reveal>
      <Reveal>
        <Accordion className="rounded-3xl border bg-card px-6">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="py-5 text-base font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="pb-5 text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  )
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-sand px-6 py-16 text-center grain sm:py-20">
        <h2 className="mx-auto max-w-2xl font-display text-4xl sm:text-6xl">Your best night's sleep is <span className="italic text-gold">one pillow away.</span></h2>
        <p className="mx-auto mt-5 max-w-md text-muted-foreground">Use code <b className="text-foreground">ZEN10</b> for 10% off your first order.</p>
        <Button render={<Link to="/shop" />} className="mt-8 h-12 rounded-full px-8 text-base">Shop the collection</Button>
      </Reveal>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Categories />
      <Bestsellers />
      <Showcase />
      <Benefits />
      <Compare />
      <Reviews />
      <FAQ />
      <CTA />
    </>
  )
}
