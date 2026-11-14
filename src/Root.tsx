import {Composition} from 'remotion';
import {ReelEdit, ReelEditProps} from './ReelEdit';

const defaultProps: ReelEditProps = {
  videoSrc: null, // e.g. 'input.mp4' (file placed in public/)
  title: 'Your Title Here',
  zoomTo: 1.25,
  captions: [
    {text: 'Hello and welcome', startMs: 500, endMs: 2000},
    {text: 'Captions render as React', startMs: 2000, endMs: 4000},
  ],
};

export const Root: React.FC = () => (
  <Composition
    id="ReelEdit"
    component={ReelEdit}
    durationInFrames={30 * 10}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
  />
);
