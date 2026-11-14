import {
  AbsoluteFill, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';

export type Caption = {text: string; startMs: number; endMs: number};
export type ReelEditProps = {
  videoSrc: string | null;
  title: string;
  zoomTo: number;
  captions: Caption[];
};

export const ReelEdit: React.FC<ReelEditProps> = ({videoSrc, title, zoomTo, captions}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Slow push-in zoom across the whole clip.
  const scale = interpolate(frame, [0, durationInFrames], [1, zoomTo], {
    extrapolateRight: 'clamp',
  });

  const nowMs = (frame / fps) * 1000;
  const active = captions.find((c) => nowMs >= c.startMs && nowMs < c.endMs);

  // Animated title pop-in (motion graphic).
  const pop = spring({frame, fps, config: {damping: 12}});

  return (
    <AbsoluteFill style={{backgroundColor: '#111'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`}}>
        {videoSrc && <OffthreadVideo src={staticFile(videoSrc)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
      </AbsoluteFill>

      <Sequence durationInFrames={fps * 2}>
        <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 160}}>
          <div style={{transform: `scale(${pop})`, fontSize: 90, fontWeight: 800, color: '#fff',
            fontFamily: 'sans-serif', textShadow: '0 4px 20px rgba(0,0,0,.6)'}}>
            {title}
          </div>
        </AbsoluteFill>
      </Sequence>

      {active && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 260}}>
          <div style={{fontSize: 72, fontWeight: 800, color: '#fff', background: 'rgba(0,0,0,.55)',
            padding: '16px 32px', borderRadius: 24, fontFamily: 'sans-serif', textAlign: 'center', maxWidth: 900}}>
            {active.text}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
