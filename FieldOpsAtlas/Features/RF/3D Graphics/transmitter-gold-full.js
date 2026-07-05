/* FieldOps Atlas — detailed gold transmitter, full four-sided geometry
 * Version: 1.5.1-gold-transmitter-full
 */
(()=>{
  "use strict";
  const VERSION="1.5.1-gold-transmitter-full";
  const ASSET_ID="transmitter-gold-full";
  const positions=[];
  const indices=[];
  const faceColours=[];

  const vertex=(x,y,z)=>{positions.push(x,y,z);return positions.length/3-1;};
  const tri=(a,b,c,colour)=>{indices.push(a,b,c);faceColours.push(colour);};
  const quad=(a,b,c,d,colour)=>{tri(a,b,c,colour);tri(a,c,d,colour);};

  function box(cx,cy,cz,sx,sy,sz,colour=1){
    const x0=cx-sx/2,x1=cx+sx/2,y0=cy-sy/2,y1=cy+sy/2,z0=cz-sz/2,z1=cz+sz/2;
    const v=[vertex(x0,y0,z0),vertex(x1,y0,z0),vertex(x1,y1,z0),vertex(x0,y1,z0),vertex(x0,y0,z1),vertex(x1,y0,z1),vertex(x1,y1,z1),vertex(x0,y1,z1)];
    quad(v[0],v[1],v[2],v[3],colour);quad(v[5],v[4],v[7],v[6],colour);
    quad(v[4],v[0],v[3],v[7],colour);quad(v[1],v[5],v[6],v[2],colour);
    quad(v[3],v[2],v[6],v[7],colour);quad(v[4],v[5],v[1],v[0],colour);
  }

  function beam(a,b,width=0.09,colour=1){
    const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2];
    const len=Math.hypot(dx,dy,dz)||1;
    const d=[dx/len,dy/len,dz/len];
    let ref=Math.abs(d[1])<0.88?[0,1,0]:[1,0,0];
    let ux=d[1]*ref[2]-d[2]*ref[1],uy=d[2]*ref[0]-d[0]*ref[2],uz=d[0]*ref[1]-d[1]*ref[0];
    let ul=Math.hypot(ux,uy,uz)||1;ux/=ul;uy/=ul;uz/=ul;
    const vx=d[1]*uz-d[2]*uy,vy=d[2]*ux-d[0]*uz,vz=d[0]*uy-d[1]*ux;
    const w=width/2;
    const corners=[];
    for(const p of [a,b]) for(const su of [-1,1]) for(const sv of [-1,1]) corners.push(vertex(p[0]+(ux*su+vx*sv)*w,p[1]+(uy*su+vy*sv)*w,p[2]+(uz*su+vz*sv)*w));
    quad(corners[0],corners[1],corners[3],corners[2],colour);
    quad(corners[4],corners[6],corners[7],corners[5],colour);
    quad(corners[0],corners[4],corners[5],corners[1],colour);
    quad(corners[2],corners[3],corners[7],corners[6],colour);
    quad(corners[0],corners[2],corners[6],corners[4],colour);
    quad(corners[1],corners[5],corners[7],corners[3],colour);
  }

  function radius(y){return 3.25-(2.55*Math.min(y,14.8)/14.8);}
  const quadrants=[[1,1],[-1,1],[1,-1],[-1,-1]];
  const levels=[0,1.25,2.7,4.15,5.7,7.3,8.9,10.5,12.0,13.35,14.6];

  for(const [sx,sz] of quadrants){
    for(let i=0;i<levels.length-1;i++){
      const y0=levels[i],y1=levels[i+1],r0=radius(y0),r1=radius(y1);
      beam([sx*r0,y0,sz*r0],[sx*r1,y1,sz*r1],0.15,i%3===0?2:1);
      beam([0,y0,sz*r0],[sx*r0,y0,sz*r0],0.075,0);
      beam([sx*r0,y0,0],[sx*r0,y0,sz*r0],0.075,0);
      beam([0,y0,sz*r0],[sx*r1,y1,sz*r1],0.075,2);
      beam([sx*r0,y0,0],[sx*r1,y1,sz*r1],0.075,2);
      if(i%2===1){
        beam([sx*r0,y0,sz*r0],[0,y1,sz*r1],0.065,3);
        beam([sx*r0,y0,sz*r0],[sx*r1,y1,0],0.065,3);
      }
    }

    // Wide foot, service platforms and hand rails.
    beam([sx*3.7,0,sz*3.7],[sx*radius(2.7),2.7,sz*radius(2.7)],0.22,1);
    box(sx*1.75,0.18,sz*1.75,3.5,0.28,3.5,0);
    for(const y of [5.7,9.0,12.05]){
      const r=radius(y)+0.48;
      box(sx*r/2,y,sz*r/2,r,0.14,r,1);
      beam([0,y+0.75,sz*r],[sx*r,y+0.75,sz*r],0.055,3);
      beam([sx*r,y+0.75,0],[sx*r,y+0.75,sz*r],0.055,3);
      beam([sx*r,y,sz*r],[sx*r,y+0.75,sz*r],0.055,3);
    }

    // Detailed panel antennas on two visible faces of each quarter.
    for(const spec of [[6.6,0.48,1.55],[9.7,0.42,1.35],[12.65,0.34,1.12]]){
      const y=spec[0],r=radius(y)+0.68,w=spec[1],h=spec[2];
      box(sx*r,y,sz*(r*0.55),0.18,h,w,4);
      box(sx*(r*0.55),y,sz*r,w,h,0.18,4);
      beam([sx*radius(y),y-0.35,sz*radius(y)],[sx*r,y,sz*(r*0.55)],0.045,3);
      beam([sx*radius(y),y-0.35,sz*radius(y)],[sx*(r*0.55),y,sz*r],0.045,3);
    }
  }

  // Axis mast, upper cage and beacon are emitted once for the full asset and
  // once in the quarter asset; overlapping mirrored copies are depth-identical.
  beam([0,13.5,0],[0,18.4,0],0.20,2);
  for(const y of [14.8,15.8,16.8]){
    box(0,y,0,1.05,0.10,1.05,1);
    for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
      const x=Math.cos(a)*0.72,z=Math.sin(a)*0.72;
      box(x,y+0.42,z,0.18,0.86,0.34,4);
      beam([0,y,0],[x,y+0.42,z],0.045,3);
    }
  }
  box(0,18.55,0,0.34,0.34,0.34,5);
  beam([0,18.45,0],[0,19.15,0],0.08,5);

  const asset={
    centre:[0,0],
    mirror:false,
    view:{size:[8.4,19.4,8.4],target:[0,9.1,0],lift:2.2,fov:38},
    palettes:{
      shell:["4B2500","8A4900","C87800","F0A800","FFCA36","FFE38A"],
      ridge:["C87800","F0A800","FFCA36","FFE38A"]
    },
    layers:{
      shell:{
        format:"raw-indexed",normals:true,
        positions:new Float32Array(positions),
        indices:new Uint32Array(indices),
        faceColours:new Uint8Array(faceColours)
      }
    }
  };

  if(globalThis.FieldOps3DAssets?.register) globalThis.FieldOps3DAssets.register(ASSET_ID,asset);
  else (globalThis.FieldOps3DAssetQueue||=[]).push({id:ASSET_ID,...asset});
  globalThis.FieldOpsGoldTransmitterFull=Object.freeze({VERSION,ASSET_ID});
})();
