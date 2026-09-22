import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';

export const palette = {paper:'#e9e3d7', ink:'#20282d', red:'#b3261e', ocean:'#243847', muted:'#aaa99f'};
export const clamp = {extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const ease = Easing.bezier(.22,.75,.12,1);
export const progress = (f:number,start:number,end:number)=>interpolate(f,[start,end],[0,1],{...clamp,easing:ease});

const grain = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".78" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" opacity=".42" filter="url(#n)"/></svg>')}`;
export const TextureOverlay:React.FC=()=> <AbsoluteFill style={{pointerEvents:'none',backgroundImage:`url("${grain}")`,opacity:.13,mixBlendMode:'multiply'}}/>;
export const Paper:React.FC<{dark?:boolean;children?:React.ReactNode}>=({dark,children})=><AbsoluteFill style={{background:dark?palette.ink:palette.paper,color:dark?palette.paper:palette.ink}}>{children}<TextureOverlay/></AbsoluteFill>;
export const Label:React.FC<{children:React.ReactNode;x?:number;y?:number;light?:boolean}>=({children,x=130,y=110,light=false})=><div style={{position:'absolute',left:x,top:y,fontFamily:'Oswald',fontSize:29,letterSpacing:4,textTransform:'uppercase',color:light?palette.paper:palette.ink}}>{children}</div>;
export const PaperCutout:React.FC<{src:string;x:number;y:number;w:number;h:number;angle?:number;delay?:number;fit?:'cover'|'contain'}>=({src,x,y,w,h,angle=0,delay=0,fit='cover'})=>{
const f=useCurrentFrame();const p=progress(f,delay,delay+22);
return <div style={{position:'absolute',left:x,top:y,width:w,height:h,rotate:`${angle+(1-p)*3}deg`,translate:`0px ${(1-p)*90}px`,opacity:p,filter:'drop-shadow(0px 16px 14px #00000024)'}}><div style={{position:'absolute',inset:-12,background:palette.paper,clipPath:'polygon(0 1%,15% 0,29% 1%,41% 0,59% 1%,75% 0,100% 1%,99% 27%,100% 48%,99% 72%,100% 99%,79% 100%,62% 99%,44% 100%,29% 99%,0 100%,1% 73%,0 54%,1% 31%)'}}/><Img src={staticFile(src)} style={{position:'absolute',width:'100%',height:'100%',objectFit:fit}}/></div>;
};
export const DocumentaryPhoto:React.FC<{src:string;focus?:string;children?:React.ReactNode}>=({src,focus='50% 50%',children})=>{
const f=useCurrentFrame();return <AbsoluteFill style={{overflow:'hidden',background:palette.ink}}><Img src={staticFile(src)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:focus,scale:interpolate(f,[0,450],[1.05,1.12],clamp),translate:`${interpolate(f,[0,450],[-15,15],clamp)}px 0px`}}/><AbsoluteFill style={{background:'linear-gradient(0deg,rgba(15,22,26,.72),transparent 48%)'}}/>{children}<TextureOverlay/></AbsoluteFill>;
};
export const Camera:React.FC<{children:React.ReactNode;duration?:number;to?:number}>=({children,duration=300,to=1.08})=>{const f=useCurrentFrame();return <AbsoluteFill style={{scale:interpolate(f,[0,duration],[1,to],clamp)}}>{children}</AbsoluteFill>};
