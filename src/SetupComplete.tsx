import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const SetupComplete: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Fade in over the first 1.5 seconds, then hold.
  const opacity = interpolate(frame, [0, fps * 1.5], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#000', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{opacity, color: '#fff', fontSize: 120, fontWeight: 800, fontFamily: 'sans-serif'}}>
        Setup complete
      </div>
    </AbsoluteFill>
  );
};
