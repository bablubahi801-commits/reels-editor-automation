import {AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import data from './edit-data.json';

type W = {w: string; s: number; e: number};
type Cap = {start: number; end: number; words: W[]};

export const CaptionedReel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  // Zoom: alternate 1.00 / 1.12 per segment (hides jump cuts) + slow drift within the segment.
  const bounds: number[] = data.bounds;
  let seg = 0;
  for (let i = 0; i < bounds.length; i++) if (t >= bounds[i]) seg = i;
  const segStart = bounds[seg];
  const segEnd = bounds[seg + 1] ?? segStart + 5;
  const base = seg % 2 === 0 ? 1.0 : 1.12;
  const drift = interpolate(t, [segStart, segEnd], [0, 0.04], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = base + drift;

  const caps = data.captions as Cap[];
  const cap = caps.find((c) => t >= c.start - 0.05 && t <= c.end + 0.15);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`}}>
        <OffthreadVideo src={staticFile('talking-head-cut.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {cap && (
        <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 120}}>
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 14px', maxWidth: 620,
            fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 60, textTransform: 'uppercase',
            textAlign: 'center', WebkitTextStroke: '3px #000', paintOrder: 'stroke fill'}}>
            {cap.words.map((w, i) => {
              // Highlight only the most recently started word (Whisper word ends can overlap).
              const lastStarted = cap.words.reduce((a, x, j) => (t >= x.s ? j : a), -1);
              const on = i === lastStarted;
              return <span key={i} style={{color: on ? '#FFE600' : '#fff'}}>{w.w.replace(/[.,]$/, '')}</span>;
            })}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
