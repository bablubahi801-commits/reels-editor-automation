export type Kind = 'cervical' | 'luxury' | 'cooling' | 'travel'

export interface ColorOption { name: string; hex: string }
export interface SizeOption { label: string; dims: string; extraInr: number; extraUsd: number }
export interface Review { name: string; place: string; rating: number; title: string; body: string; date: string }
export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  category: Kind
  price: { inr: number; usd: number }
  compareAt: { inr: number; usd: number }
  rating: number
  reviewCount: number
  badge?: string
  colors: ColorOption[]
  sizes: SizeOption[]
  firmness: string
  short: string
  description: string
  features: { title: string; desc: string }[]
  specs: [string, string][]
  tags: string[]
  reviews: Review[]
}

export interface Category { slug: Kind; name: string; blurb: string }

export const categories: Category[] = [
  { slug: 'cervical', name: 'Cervical Memory Foam', blurb: 'Contoured support that keeps your spine in line' },
  { slug: 'luxury', name: 'Luxury Sleeping', blurb: 'Hotel-suite softness, engineered for deep rest' },
  { slug: 'cooling', name: 'Cooling Gel', blurb: 'Stay cool from the first minute to sunrise' },
  { slug: 'travel', name: 'Travel Neck', blurb: 'Compact comfort for flights, trains and road trips' },
]

// Sample review content for demonstration purposes — replace with real customer reviews before launch.
const reviewPool: Review[] = [
  { name: 'Ananya R.', place: 'Bengaluru, India', rating: 5, title: 'Neck pain gone in a week', body: 'I work long desk hours and used to wake up stiff. The contour sits exactly where it should. Genuinely life-changing sleep.', date: '2026-09-12' },
  { name: 'James T.', place: 'London, UK', rating: 5, title: 'Better than my hotel pillows', body: 'Beautiful finish, sturdy stitching and it holds its shape. Ships fast and the packaging is lovely.', date: '2026-08-30' },
  { name: 'Priya & Karan', place: 'Mumbai, India', rating: 4, title: 'Great value for the quality', body: 'Took two nights to adjust, then we were sold. The cover is breathable even in the humid Mumbai summers.', date: '2026-10-02' },
  { name: 'Sofia M.', place: 'Dubai, UAE', rating: 5, title: 'Cool and comfortable', body: 'Stays cool through the night even with the AC low. Worth every dirham.', date: '2026-07-19' },
  { name: 'Daniel K.', place: 'Toronto, Canada', rating: 5, title: 'Perfect for long-haul flights', body: 'Took it on a 14-hour flight and slept properly for the first time. Packs down small, too.', date: '2026-10-21' },
  { name: 'Meera S.', place: 'Delhi, India', rating: 4, title: 'Firm but forgiving', body: 'Exactly the support my physiotherapist recommended. Delivery arrived in three days.', date: '2026-09-28' },
]
const pick = (...i: number[]) => i.map((n) => reviewPool[n])
export const featuredReviews = reviewPool

const cervicalSizes: SizeOption[] = [
  { label: 'Standard', dims: '60 × 36 × 12 cm', extraInr: 0, extraUsd: 0 },
  { label: 'King', dims: '70 × 40 × 13 cm', extraInr: 600, extraUsd: 10 },
]
const luxSizes: SizeOption[] = [
  { label: 'Standard', dims: '66 × 41 cm', extraInr: 0, extraUsd: 0 },
  { label: 'King', dims: '76 × 51 cm', extraInr: 700, extraUsd: 12 },
]
const travelSizes: SizeOption[] = [{ label: 'One size', dims: '30 × 28 × 11 cm', extraInr: 0, extraUsd: 0 }]

export const products: Product[] = [
  {
    id: 'zv-001', slug: 'aura-cervical-contour-pillow', name: 'Aura Cervical Contour Pillow',
    tagline: 'Orthopedic memory foam that cradles your neck.', category: 'cervical',
    price: { inr: 3499, usd: 59 }, compareAt: { inr: 4999, usd: 84 },
    rating: 4.8, reviewCount: 1284, badge: 'Bestseller',
    colors: [{ name: 'Oat', hex: '#E8DCC8' }, { name: 'Slate', hex: '#8B94A0' }, { name: 'Sage', hex: '#A9B8A0' }],
    sizes: cervicalSizes, firmness: 'Medium-firm',
    short: 'Dual-curve contour in slow-recovery memory foam.',
    description: "Aura's dual-curve design supports the natural arch of your cervical spine whether you sleep on your back or side. Our slow-recovery memory foam responds to body heat and pressure, relieving tension points while keeping your head level all night.",
    features: [
      { title: 'Dual-curve contour', desc: 'A high curve for side sleeping, a low curve for back sleeping.' },
      { title: 'Slow-recovery memory foam', desc: 'Adapts to your shape, then returns slowly to keep support consistent.' },
      { title: 'Breathable bamboo cover', desc: 'Removable and machine washable at 30°C.' },
      { title: '100-night sleep trial', desc: 'Sleep on it. If it is not right, return it.' },
    ],
    specs: [['Fill', 'High-density memory foam (50 D)'], ['Cover', 'Bamboo-viscose blend, zippered'], ['Firmness', 'Medium-firm'], ['Weight', '1.2 kg'], ['Care', 'Spot-clean foam, wash cover'], ['Warranty', '2 years']],
    tags: ['neck pain', 'orthopedic', 'side sleeper', 'back sleeper', 'memory foam'], reviews: pick(0, 2, 5),
  },
  {
    id: 'zv-002', slug: 'aura-pro-adjustable-cervical', name: 'Aura Pro Adjustable Cervical',
    tagline: 'Customise the height. Perfect the posture.', category: 'cervical',
    price: { inr: 4299, usd: 74 }, compareAt: { inr: 5999, usd: 99 },
    rating: 4.7, reviewCount: 642, badge: 'New',
    colors: [{ name: 'Slate', hex: '#8B94A0' }, { name: 'Sand', hex: '#D8C7AA' }],
    sizes: cervicalSizes, firmness: 'Firm · adjustable',
    short: 'Removable foam layers to dial in your height.',
    description: 'Aura Pro adds removable memory-foam layers so you can dial in the exact loft your neck needs. Ideal if you are between sizes, share a bed, or want to adjust as your posture improves.',
    features: [
      { title: 'Adjustable loft', desc: 'Add or remove foam layers from 9 to 13 cm.' },
      { title: 'Ergonomic neck ridge', desc: 'Firm cervical roll maintains neutral alignment.' },
      { title: 'Pressure relief', desc: 'Open-cell foam reduces pressure on shoulders and jaw.' },
      { title: 'Hypoallergenic', desc: 'Naturally resistant to dust mites and mould.' },
    ],
    specs: [['Fill', 'Memory foam, 3 removable layers'], ['Cover', 'Knit jacquard, zippered'], ['Firmness', 'Firm (adjustable)'], ['Weight', '1.5 kg'], ['Care', 'Wash cover, air-dry foam'], ['Warranty', '2 years']],
    tags: ['adjustable', 'orthopedic', 'firm', 'neck pain', 'memory foam'], reviews: pick(2, 5, 0),
  },
  {
    id: 'zv-003', slug: 'regal-luxury-sleeping-pillow', name: 'Regal Luxury Sleeping Pillow',
    tagline: 'Five-star hotel softness at home.', category: 'luxury',
    price: { inr: 4999, usd: 89 }, compareAt: { inr: 6999, usd: 119 },
    rating: 4.9, reviewCount: 957, badge: 'Signature',
    colors: [{ name: 'Ivory', hex: '#F1EADB' }, { name: 'Champagne', hex: '#D9C29A' }],
    sizes: luxSizes, firmness: 'Plush-medium',
    short: 'Down-alternative cloud fill in a 400-thread-count cotton shell.',
    description: 'Regal is filled with ultra-fine down-alternative microfibre clusters that feel like a cloud yet bounce back every morning. Wrapped in a 400-thread-count cotton sateen shell with hand-finished piping.',
    features: [
      { title: 'Cloud-cluster fill', desc: 'Silky microfibre that stays plump night after night.' },
      { title: '400TC cotton sateen', desc: 'Smooth, breathable and long-lasting.' },
      { title: 'Hand-finished piping', desc: 'Reinforced edges that stay crisp wash after wash.' },
      { title: 'Allergen-friendly', desc: 'Vegan, hypoallergenic and cruelty-free.' },
    ],
    specs: [['Fill', 'Down-alternative microfibre'], ['Cover', '100% cotton sateen, 400TC'], ['Firmness', 'Plush-medium'], ['Weight', '0.9 kg'], ['Care', 'Machine washable, 40°C'], ['Warranty', '2 years']],
    tags: ['luxury', 'soft', 'hotel', 'down alternative', 'hypoallergenic'], reviews: pick(1, 3, 2),
  },
  {
    id: 'zv-004', slug: 'suite-hybrid-luxury-pillow', name: 'Suite Hybrid Luxury Pillow',
    tagline: 'Memory foam core. Cloud-soft surround.', category: 'luxury',
    price: { inr: 3999, usd: 69 }, compareAt: { inr: 5499, usd: 94 },
    rating: 4.7, reviewCount: 411,
    colors: [{ name: 'Ivory', hex: '#F1EADB' }, { name: 'Mist', hex: '#C9D2D6' }],
    sizes: luxSizes, firmness: 'Medium',
    short: 'A hybrid of supportive foam and plush fibre.',
    description: 'The Suite pairs a supportive memory-foam core with a soft fibre surround, giving you hotel-like plushness with just enough support for any sleeping position.',
    features: [
      { title: 'Hybrid construction', desc: 'Foam core for support, fibre surround for softness.' },
      { title: 'Silk-touch cover', desc: 'Luxuriously smooth against the skin.' },
      { title: 'Position-friendly', desc: 'Medium loft suits back and side sleepers alike.' },
      { title: 'Gift-ready packaging', desc: 'Arrives in a reusable linen dust bag.' },
    ],
    specs: [['Fill', 'Memory foam core + microfibre'], ['Cover', 'Cotton-modal blend'], ['Firmness', 'Medium'], ['Weight', '1.1 kg'], ['Care', 'Machine-washable cover'], ['Warranty', '2 years']],
    tags: ['hybrid', 'luxury', 'gift', 'medium'], reviews: pick(1, 4, 0),
  },
  {
    id: 'zv-005', slug: 'glacier-cooling-gel-pillow', name: 'Glacier Cooling Gel Pillow',
    tagline: 'Cool-to-the-touch comfort, all night.', category: 'cooling',
    price: { inr: 3799, usd: 64 }, compareAt: { inr: 5299, usd: 89 },
    rating: 4.8, reviewCount: 1032, badge: 'Cooling',
    colors: [{ name: 'Glacier', hex: '#BFD9E4' }, { name: 'Cloud', hex: '#E7EEF1' }],
    sizes: cervicalSizes, firmness: 'Medium',
    short: 'Gel-infused foam with an airflow lattice for hot sleepers.',
    description: 'Glacier pairs gel-infused memory foam with an open airflow lattice that pulls heat away from your head and neck. Ideal for warm climates and hot sleepers.',
    features: [
      { title: 'Cooling gel infusion', desc: 'Draws heat away from your body for a cooler surface.' },
      { title: 'Airflow lattice', desc: 'Open channels keep air moving through the pillow.' },
      { title: 'Cool-touch cover', desc: 'Fabric that feels fresh on contact.' },
      { title: 'Climate-proof', desc: 'Designed for humid and tropical climates.' },
    ],
    specs: [['Fill', 'Gel-infused memory foam'], ['Cover', 'Cool-touch knit, zippered'], ['Firmness', 'Medium'], ['Weight', '1.3 kg'], ['Care', 'Wash cover, air-dry foam'], ['Warranty', '2 years']],
    tags: ['cooling', 'gel', 'hot sleeper', 'summer', 'memory foam'], reviews: pick(3, 0, 2),
  },
  {
    id: 'zv-006', slug: 'glacier-max-dual-side-cooling', name: 'Glacier Max Dual-Side Cooling',
    tagline: 'Cool side for summer. Soft side for winter.', category: 'cooling',
    price: { inr: 4499, usd: 79 }, compareAt: { inr: 6299, usd: 105 },
    rating: 4.6, reviewCount: 288, badge: 'New',
    colors: [{ name: 'Glacier', hex: '#BFD9E4' }, { name: 'Slate', hex: '#8B94A0' }],
    sizes: cervicalSizes, firmness: 'Medium-firm',
    short: 'Reversible: ice-silk cooling on one side, soft knit on the other.',
    description: 'Flip it for the season. One side is woven from ice-silk for instant cooling; the other is a soft brushed knit. The gel-memory foam core provides all-night support.',
    features: [
      { title: 'Reversible cover', desc: 'Ice-silk for summer, brushed knit for winter.' },
      { title: 'Gel-memory core', desc: 'Dense, supportive, and thermally balanced.' },
      { title: 'Edge-to-edge support', desc: 'No slumping, even on the edges.' },
      { title: 'Odour-resistant', desc: 'Treated cover stays fresh longer.' },
    ],
    specs: [['Fill', 'Gel-memory foam'], ['Cover', 'Ice-silk / brushed knit (reversible)'], ['Firmness', 'Medium-firm'], ['Weight', '1.4 kg'], ['Care', 'Wash cover, air-dry foam'], ['Warranty', '2 years']],
    tags: ['cooling', 'reversible', 'ice silk', 'hot sleeper'], reviews: pick(3, 5, 4),
  },
  {
    id: 'zv-007', slug: 'nomad-travel-neck-pillow', name: 'Nomad Travel Neck Pillow',
    tagline: 'Sleep anywhere. Arrive rested.', category: 'travel',
    price: { inr: 1799, usd: 29 }, compareAt: { inr: 2499, usd: 42 },
    rating: 4.7, reviewCount: 2210, badge: 'Travel favourite',
    colors: [{ name: 'Charcoal', hex: '#4A4F57' }, { name: 'Oat', hex: '#E8DCC8' }, { name: 'Rose', hex: '#D9B5AE' }],
    sizes: travelSizes, firmness: 'Medium',
    short: 'U-shaped memory foam with a snap closure and carry pouch.',
    description: "Nomad's U-shaped memory foam supports your head from every angle, so you can sleep upright on flights, trains and long drives. It clips shut, folds down small, and comes with a carry pouch.",
    features: [
      { title: 'Full-wrap support', desc: 'Raised sides stop your head from falling forward.' },
      { title: 'Snap closure', desc: 'Adjustable fit that stays put around your neck.' },
      { title: 'Compact carry', desc: 'Compresses into a pouch that clips to your bag.' },
      { title: 'Washable velour cover', desc: 'Soft on the skin, easy to clean.' },
    ],
    specs: [['Fill', 'Memory foam'], ['Cover', 'Velour, removable'], ['Firmness', 'Medium'], ['Weight', '0.35 kg'], ['Care', 'Wash cover cold'], ['Includes', 'Carry pouch']],
    tags: ['travel', 'flight', 'portable', 'u-shaped', 'neck'], reviews: pick(4, 1, 0),
  },
  {
    id: 'zv-008', slug: 'nomad-wrap-travel-pillow', name: 'Nomad Wrap Travel Pillow',
    tagline: 'A scarf by day. A pillow on the plane.', category: 'travel',
    price: { inr: 2299, usd: 38 }, compareAt: { inr: 3199, usd: 54 },
    rating: 4.5, reviewCount: 506,
    colors: [{ name: 'Charcoal', hex: '#4A4F57' }, { name: 'Sage', hex: '#A9B8A0' }],
    sizes: travelSizes, firmness: 'Soft-medium',
    short: 'Adjustable wrap-around design with a built-in hood.',
    description: 'Nomad Wrap is a multi-use travel pillow that can wrap around your neck, hold your chin, or support you against a window. A removable hood blocks light and noise on busy journeys.',
    features: [
      { title: 'Adjustable wrap', desc: 'Fasten tight or loose, front or side.' },
      { title: 'Light-blocking hood', desc: 'Pulls over your head for privacy.' },
      { title: 'Chin support', desc: 'Keeps your head from tilting forward.' },
      { title: 'Ultra-packable', desc: 'Rolls into a small pouch.' },
    ],
    specs: [['Fill', 'Memory foam + microbeads'], ['Cover', 'Soft-touch jersey'], ['Firmness', 'Soft-medium'], ['Weight', '0.4 kg'], ['Care', 'Hand wash'], ['Includes', 'Pouch & hood']],
    tags: ['travel', 'wrap', 'hood', 'portable'], reviews: pick(4, 2, 1),
  },
]

export const getProduct = (slug: string) => products.find((p) => p.slug === slug)
export const getProductById = (id: string) => products.find((p) => p.id === id)
