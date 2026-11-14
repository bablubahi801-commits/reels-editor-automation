import { useId } from 'react'
import type { Kind } from '@/data/products'

export type View = 'hero' | 'room' | 'detail' | 'size'

function shade(hex: string, amt: number) {
  const n = parseInt(hex.replace('#', ''), 16)
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)))
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255)
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

const SHAPES: Record<Kind, string> = {
  cervical:
    'M38 262 C36 220 62 186 112 178 C152 172 174 200 200 204 C226 200 248 172 288 178 C338 186 364 220 362 262 C360 306 330 326 200 326 C70 326 40 306 38 262Z',
  luxury:
    'M56 150 C130 128 270 128 344 150 C358 205 358 255 344 306 C270 328 130 328 56 306 C42 255 42 205 56 150Z',
  cooling:
    'M52 158 C128 134 272 134 348 158 C362 208 362 252 348 302 C272 324 128 324 52 302 C38 252 38 208 52 158Z',
  travel:
    'M66 238 C56 126 138 82 200 82 C262 82 344 126 334 238 C331 284 300 306 274 290 C252 276 262 232 258 196 C255 170 236 160 200 160 C164 160 145 170 142 196 C138 232 148 276 126 290 C100 306 69 284 66 238Z',
}

interface Props {
  kind: Kind
  color: string
  view?: View
  dims?: string
  className?: string
  label?: string
}

export function PillowArt({ kind, color, view = 'hero', dims, className, label }: Props) {
  const id = useId().replace(/:/g, '')
  const light = shade(color, 0.35)
  const mid = color
  const dark = shade(color, -0.22)
  const deep = shade(color, -0.4)
  const path = SHAPES[kind]
  const cool = kind === 'cooling'

  const pillow = (
    <g>
      {/* ground shadow */}
      <ellipse cx="200" cy={kind === 'travel' ? 320 : 338} rx={kind === 'travel' ? 132 : 150} ry="14" fill="#2b2118" opacity=".14" filter={`url(#blur${id})`} />
      {/* underside / thickness */}
      <path d={path} transform="translate(0 9)" fill={deep} opacity=".55" />
      <path d={path} fill={`url(#body${id})`} />
      {/* soft highlight */}
      <path d={path} fill={`url(#shine${id})`} />
      <path d={path} fill="none" stroke={dark} strokeOpacity=".35" strokeWidth="1.5" />
      {kind === 'cervical' && (
        <g fill="none" stroke={dark} strokeOpacity=".4" strokeWidth="1.4" strokeLinecap="round">
          <path d="M96 232 C130 220 170 230 200 238 C230 230 270 220 304 232" strokeDasharray="2 7" />
          <path d="M82 262 C130 252 168 258 200 264 C232 258 270 252 318 262" strokeDasharray="2 7" />
          <path d="M200 206 C200 240 200 280 200 322" opacity=".35" />
        </g>
      )}
      {kind === 'luxury' && (
        <g fill="none" stroke={dark} strokeOpacity=".4" strokeWidth="1.4">
          <path d="M70 166 C140 146 260 146 330 166 C342 208 342 250 330 292 C260 312 140 312 70 292 C58 250 58 208 70 166Z" strokeDasharray="3 6" />
          <path d="M88 188 C150 172 250 172 312 188" opacity=".25" />
          <circle cx="200" cy="228" r="3" fill={dark} fillOpacity=".5" stroke="none" />
          {[[60, 150], [340, 150], [60, 306], [340, 306]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.6" fill={dark} fillOpacity=".45" stroke="none" />
          ))}
        </g>
      )}
      {cool && (
        <g>
          <clipPath id={`clip${id}`}><path d={path} /></clipPath>
          <g clipPath={`url(#clip${id})`} opacity=".55">
            <rect x="30" y="120" width="340" height="220" fill={`url(#hex${id})`} />
          </g>
          <g transform="translate(200 232)" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".9">
            {[0, 60, 120].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <path d="M0 -20 L0 20" />
                <path d="M-5 -14 L0 -19 L5 -14 M-5 14 L0 19 L5 14" fill="none" />
              </g>
            ))}
          </g>
        </g>
      )}
      {kind === 'travel' && (
        <g>
          <path d="M104 262 C112 276 128 268 130 252" fill="none" stroke={dark} strokeOpacity=".4" strokeWidth="1.4" />
          <path d="M296 262 C288 276 272 268 270 252" fill="none" stroke={dark} strokeOpacity=".4" strokeWidth="1.4" />
          <rect x="188" y="168" width="24" height="9" rx="4.5" fill={deep} opacity=".55" />
          <path d="M84 190 C88 150 126 112 200 112 C274 112 312 150 316 190" fill="none" stroke={dark} strokeOpacity=".3" strokeWidth="1.4" strokeDasharray="2 7" />
        </g>
      )}
    </g>
  )

  const defs = (
    <defs>
      <linearGradient id={`body${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={light} />
        <stop offset=".55" stopColor={mid} />
        <stop offset="1" stopColor={dark} />
      </linearGradient>
      <radialGradient id={`shine${id}`} cx=".3" cy=".2" r=".7">
        <stop offset="0" stopColor="#fff" stopOpacity=".55" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <filter id={`blur${id}`}><feGaussianBlur stdDeviation="7" /></filter>
      <pattern id={`hex${id}`} width="22" height="19" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
        <path d="M11 1 L20 5.5 L20 14.5 L11 19 L2 14.5 L2 5.5Z" fill="none" stroke="#ffffff" strokeWidth="1.2" />
      </pattern>
      <linearGradient id={`wall${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f3ece0" />
        <stop offset="1" stopColor="#e6dac6" />
      </linearGradient>
      <linearGradient id={`sheet${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fbf8f2" />
        <stop offset="1" stopColor="#ece4d4" />
      </linearGradient>
    </defs>
  )

  const bg = view === 'room' ? null : (
    <>
      <rect width="400" height="400" fill="transparent" />
      <circle cx="200" cy="200" r="168" fill={shade(color, 0.7)} opacity=".35" />
    </>
  )

  return (
    <svg viewBox="0 0 400 400" role="img" aria-label={label ?? `${kind} pillow`} className={className}>
      {defs}
      {bg}
      {view === 'hero' && pillow}
      {view === 'room' && (
        <g>
          <rect width="400" height="400" fill={`url(#wall${id})`} />
          <rect x="40" y="40" width="320" height="170" rx="6" fill="#d8c9ae" opacity=".55" />
          <rect x="52" y="52" width="296" height="146" rx="3" fill="#cdbd9f" opacity=".5" />
          <circle cx="330" cy="86" r="22" fill="#f4e7c8" opacity=".9" />
          <path d="M0 262 C90 246 310 246 400 262 L400 400 L0 400Z" fill={`url(#sheet${id})`} />
          <path d="M0 292 C100 280 300 280 400 292" stroke="#d4c7b0" strokeWidth="2" fill="none" />
          <path d="M0 340 C120 326 280 326 400 340" stroke="#d4c7b0" strokeWidth="2" fill="none" opacity=".7" />
          <g transform={kind === 'travel' ? 'translate(48 40) scale(.76)' : 'translate(40 56) scale(.8)'}>{pillow}</g>
        </g>
      )}
      {view === 'detail' && (
        <g>
          <rect width="400" height="400" fill={shade(color, 0.55)} />
          <g transform="translate(-110 -190) scale(1.55)">{pillow}</g>
          <rect width="400" height="400" fill={`url(#shine${id})`} opacity=".5" />
        </g>
      )}
      {view === 'size' && (
        <g>
          <g transform="translate(30 10) scale(.85)">{pillow}</g>
          <g stroke="#2b2118" strokeOpacity=".55" strokeWidth="1.3" fill="none" strokeDasharray="4 4">
            <path d="M40 360 H360" />
            <path d="M40 354 V366 M360 354 V366" strokeDasharray="0" />
          </g>
          <text x="200" y="384" textAnchor="middle" fontSize="15" fill="#2b2118" opacity=".75" fontFamily="Geist Variable, sans-serif">{dims ?? ''}</text>
        </g>
      )}
    </svg>
  )
}
