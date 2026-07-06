/* FieldOps Atlas — simplified heavy compressed transmitter, quarter geometry mirrored four ways
 * Version: 1.6.7-gold-transmitter-clean-heavy-quarter
 */
(()=>{
  "use strict";
  const VERSION="1.6.7-gold-transmitter-clean-heavy-quarter";
  const ASSET_ID="transmitter-gold-quarter";
  const positions=[];
  const indices=[];
  const faceColours=[];

  const vertex=(x,y,z)=>{positions.push(x,y,z);return positions.length/3-1;};
  const tri=(a,b,c,colour)=>{indices.push(a,b,c);faceColours.push(colour);};
  const quad=(a,b,c,d,colour)=>{tri(a,b,c,colour);tri(a,c,d,colour);};

  function box(cx,cy,cz,sx,sy,sz,colour=1){
    const x0=cx-sx/2,x1=cx+sx/2,y0=cy-sy/2,y1=cy+sy/2,z0=cz-sz/2,z1=cz+sz/2;
    const v=[
      vertex(x0,y0,z0),vertex(x1,y0,z0),vertex(x1,y1,z0),vertex(x0,y1,z0),
      vertex(x0,y0,z1),vertex(x1,y0,z1),vertex(x1,y1,z1),vertex(x0,y1,z1)
    ];
    quad(v[0],v[1],v[2],v[3],colour);
    quad(v[5],v[4],v[7],v[6],colour);
    quad(v[4],v[0],v[3],v[7],colour);
    quad(v[1],v[5],v[6],v[2],colour);
    quad(v[3],v[2],v[6],v[7],colour);
    quad(v[4],v[5],v[1],v[0],colour);
  }

  function beam(a,b,halfWidth=0.12,colour=1){
    const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2];
    const length=Math.hypot(dx,dy,dz)||1;
    const d=[dx/length,dy/length,dz/length];
    const ref=Math.abs(d[1])<0.88?[0,1,0]:[1,0,0];

    let ux=d[1]*ref[2]-d[2]*ref[1];
    let uy=d[2]*ref[0]-d[0]*ref[2];
    let uz=d[0]*ref[1]-d[1]*ref[0];
    const uLength=Math.hypot(ux,uy,uz)||1;
    ux/=uLength;uy/=uLength;uz/=uLength;

    const vx=d[1]*uz-d[2]*uy;
    const vy=d[2]*ux-d[0]*uz;
    const vz=d[0]*uy-d[1]*ux;
    const corners=[];

    for(const point of [a,b]){
      for(const su of [-1,1]){
        for(const sv of [-1,1]){
          corners.push(vertex(
            point[0]+(ux*su+vx*sv)*halfWidth,
            point[1]+(uy*su+vy*sv)*halfWidth,
            point[2]+(uz*su+vz*sv)*halfWidth
          ));
        }
      }
    }

    quad(corners[0],corners[1],corners[3],corners[2],colour);
    quad(corners[4],corners[6],corners[7],corners[5],colour);
    quad(corners[0],corners[4],corners[5],corners[1],colour);
    quad(corners[2],corners[3],corners[7],corners[6],colour);
    quad(corners[0],corners[2],corners[6],corners[4],colour);
    quad(corners[1],corners[5],corners[7],corners[3],colour);
  }

  function radius(y){
    return 3.25-(2.55*Math.min(y,14.4)/14.4);
  }

  const levels=[0,2.4,4.8,7.2,9.6,12.0,14.4];

  for(let i=0;i<levels.length-1;i+=1){
    const y0=levels[i];
    const y1=levels[i+1];
    const r0=radius(y0);
    const r1=radius(y1);

    // Primary corner pole. This is deliberately much heavier than the old mesh.
    beam([r0,y0,r0],[r1,y1,r1],0.28,3);

    // One horizontal member on each half-face.
    beam([0,y0,r0],[r0,y0,r0],0.15,2);
    beam([r0,y0,0],[r0,y0,r0],0.15,2);

    // One alternating diagonal per half-face instead of the previous stacked
    // diagonal network. This keeps the silhouette readable and removes clutter.
    if(i%2===0){
      beam([0,y0,r0],[r1,y1,r1],0.14,1);
      beam([r0,y0,0],[r1,y1,r1],0.14,1);
    }else{
      beam([r0,y0,r0],[0,y1,r1],0.14,1);
      beam([r0,y0,r0],[r1,y1,0],0.14,1);
    }
  }

  // Finish the upper lattice with a single heavy collar.
  {
    const y=levels[levels.length-1];
    const r=radius(y);
    beam([0,y,r],[r,y,r],0.15,2);
    beam([r,y,0],[r,y,r],0.15,2);
  }

  // Heavy foot and base plate.
  beam([3.72,0,3.72],[radius(2.4),2.4,radius(2.4)],0.36,3);
  box(1.75,0.20,1.75,3.5,0.40,3.5,0);

  // Clean central mast: two collars and four simple panel antennas.
  beam([0,13.9,0],[0,18.6,0],0.42,4);
  box(0,15.15,0,1.35,0.18,1.35,2);
  box(0,16.95,0,1.18,0.18,1.18,2);
  box(0.76,16.0,0,0.28,1.34,0.48,4);
  box(0,16.0,0.76,0.48,1.34,0.28,4);

  // Beacon.
  box(0,18.72,0,0.44,0.44,0.44,5);
  beam([0,18.62,0],[0,19.25,0],0.18,5);

  const asset={
    centre:[0,0],
    mirror:true,
    view:{size:[8.4,19.5,8.4],target:[0,9.15,0],lift:2.2,fov:38},
    palettes:{
      shell:["321700","6A3000","A94E00","F28A00","FFC640","FFF0A6"],
      ridge:["A94E00","F28A00","FFC640","FFF0A6"]
    },
    layers:{
      shell:{
        format:"raw-indexed",
        normals:true,
        positions:new Float32Array(positions),
        indices:new Uint32Array(indices),
        faceColours:new Uint8Array(faceColours)
      }
    }
  };

  if(globalThis.FieldOps3DAssets?.register){
    globalThis.FieldOps3DAssets.register(ASSET_ID,asset);
  }else{
    (globalThis.FieldOps3DAssetQueue||=[]).push({id:ASSET_ID,...asset});
  }

  globalThis.FieldOpsGoldTransmitterQuarter=Object.freeze({VERSION,ASSET_ID});
})();
