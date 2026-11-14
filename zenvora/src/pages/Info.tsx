import { Link } from 'react-router-dom'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { PillowArt } from '@/components/PillowArt'
import { faqs } from '@/pages/Home'
import { regions, useStore } from '@/context/store'

export function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">Our story</p>
      <h1 className="font-display text-5xl leading-tight sm:text-7xl">Sleep is the <span className="italic text-gold">original</span> luxury.</h1>
      <div className="mt-12 grid items-center gap-12 md:grid-cols-2">
        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>ZENVORA began with a simple frustration: too many people wake up with a stiff neck on a pillow that was never designed for them.</p>
          <p>We design every pillow around how people actually sleep — on their backs, sides and on the move — and pair orthopedic engineering with materials that feel as good as they perform.</p>
          <p>Designed in India. Tested by sleepers everywhere.</p>
          <Button render={<Link to="/shop" />} className="h-12 rounded-full px-7 text-base">Shop the collection</Button>
        </div>
        <div className="aspect-square rounded-[2rem] bg-sand p-8"><PillowArt kind="luxury" color="#F1EADB" view="room" className="size-full" /></div>
      </div>
    </div>
  )
}

export function Shipping() {
  const { region, setRegion, fmt } = useStore()
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">Help</p>
      <h1 className="font-display text-5xl sm:text-6xl">Shipping & returns</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">We ship from India to 8 regions with local-currency pricing. Select your region to see rates and delivery times.</p>

      <div className="mt-10 overflow-x-auto rounded-3xl border bg-card">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead><tr className="border-b text-xs uppercase tracking-widest text-muted-foreground">
            <th className="p-4">Region</th><th className="p-4">Currency</th><th className="p-4">Delivery</th><th className="p-4">Free over</th><th className="p-4">Otherwise</th>
          </tr></thead>
          <tbody>
            {regions.map((r) => (
              <tr key={r.code} onClick={() => setRegion(r.code)} className={`cursor-pointer border-b transition-colors last:border-0 hover:bg-accent ${r.code === region.code ? 'bg-sand' : ''}`}>
                <td className="p-4 font-medium">{r.flag} {r.label}</td>
                <td className="p-4">{r.currency}</td>
                <td className="p-4">{r.eta}</td>
                <td className="p-4">{new Intl.NumberFormat(r.locale, { style: 'currency', currency: r.currency, maximumFractionDigits: 0 }).format(r.freeShippingAt)}</td>
                <td className="p-4">{new Intl.NumberFormat(r.locale, { style: 'currency', currency: r.currency, maximumFractionDigits: 0 }).format(r.shippingFee)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Currently viewing {region.flag} {region.label}: free shipping over {fmt(region.freeShippingAt)}. {region.note}.</p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-sand p-7">
          <h2 className="font-display text-2xl">Returns</h2>
          <p className="mt-3 text-muted-foreground">Try any pillow for 100 nights. Free returns within India; international returns are accepted with a prepaid label. Pillows must be returned in their original packaging.</p>
        </div>
        <div className="rounded-3xl bg-sand p-7">
          <h2 className="font-display text-2xl">Duties & taxes</h2>
          <p className="mt-3 text-muted-foreground">Prices in India include GST. International orders may be subject to import duties or VAT, which are the responsibility of the recipient unless stated at checkout.</p>
        </div>
      </div>

      <h2 id="faq" className="mt-16 font-display text-3xl">FAQ</h2>
      <Accordion className="mt-4 rounded-3xl border bg-card px-6">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`f${i}`}>
            <AccordionTrigger className="py-5 text-base font-medium">{f.q}</AccordionTrigger>
            <AccordionContent className="pb-5 text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
