import './index.css';
import {Composition} from 'remotion';
import {Documentary} from './Documentary';
import {DocumentaryMap} from './components/DocumentaryMap';
export const RemotionRoot:React.FC=()=> <><Composition id="TyphoonVsRafaleIntro" component={Documentary} durationInFrames={5605} fps={30} width={1920} height={1080}/><Composition id="MapReview" component={DocumentaryMap} durationInFrames={330} fps={30} width={1920} height={1080} defaultProps={{highlights:[{country:'France',at:15}]}}/></>;
