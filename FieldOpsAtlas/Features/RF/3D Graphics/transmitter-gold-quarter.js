/* FieldOps Atlas — reference transmitter replacement
 * Version: 1.6.36-installed-reference-transmitter
 *
 * - full geometry; no quarter mirroring
 * - continuous base-to-apex outer legs
 * - dense front lattice with shallow 3D depth
 * - upper deck only slightly smaller than the deck below
 * - white lamps fixed to visible surround ends
 * - compact collar, beacon stalk and white beacon
 */
(()=>{
  "use strict";

  const VERSION="1.6.36-installed-reference-transmitter";
  const ASSET_ID="transmitter-gold-quarter";

  const positions=[];
  const indices=[];
  const faceColours=[];
  const lampPositions=[];

  const STRUCTURE=3;
  const WHITE_LIGHT=5;
  const WHITE_BEACON=6;

  const vertex=(x,y,z)=>{
    positions.push(x,y,z);
    return positions.length/3-1;
  };

  const tri=(a,b,c,colour)=>{
    indices.push(a,b,c);
    faceColours.push(colour);
  };

  const quad=(a,b,c,d,colour)=>{
    tri(a,b,c,colour);
    tri(a,c,d,colour);
  };

  function box(cx,cy,cz,sx,sy,sz,colour=STRUCTURE){
    const x0=cx-sx/2,x1=cx+sx/2;
    const y0=cy-sy/2,y1=cy+sy/2;
    const z0=cz-sz/2,z1=cz+sz/2;
    const v=[
      vertex(x0,y0,z0),vertex(x1,y0,z0),
      vertex(x1,y1,z0),vertex(x0,y1,z0),
      vertex(x0,y0,z1),vertex(x1,y0,z1),
      vertex(x1,y1,z1),vertex(x0,y1,z1)
    ];

    quad(v[0],v[1],v[2],v[3],colour);
    quad(v[5],v[4],v[7],v[6],colour);
    quad(v[4],v[0],v[3],v[7],colour);
    quad(v[1],v[5],v[6],v[2],colour);
    quad(v[3],v[2],v[6],v[7],colour);
    quad(v[4],v[5],v[1],v[0],colour);
  }

  function beam(a,b,halfWidth=0.04,colour=STRUCTURE){
    const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2];
    const length=Math.hypot(dx,dy,dz)||1;
    const direction=[dx/length,dy/length,dz/length];
    const reference=Math.abs(direction[1])<0.88?[0,1,0]:[1,0,0];

    let ux=direction[1]*reference[2]-direction[2]*reference[1];
    let uy=direction[2]*reference[0]-direction[0]*reference[2];
    let uz=direction[0]*reference[1]-direction[1]*reference[0];
    const uLength=Math.hypot(ux,uy,uz)||1;
    ux/=uLength;uy/=uLength;uz/=uLength;

    const vx=direction[1]*uz-direction[2]*uy;
    const vy=direction[2]*ux-direction[0]*uz;
    const vz=direction[0]*uy-direction[1]*ux;
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

  function sphere(
    cx,cy,cz,radius,
    segments=16,rings=9,
    colour=WHITE_LIGHT,
    recordLight=false
  ){
    if(recordLight)lampPositions.push([cx,cy,cz,radius]);

    const top=vertex(cx,cy+radius,cz);
    const rows=[];

    for(let ringIndex=1;ringIndex<rings;ringIndex+=1){
      const phi=Math.PI*ringIndex/rings;
      const ringRadius=Math.sin(phi)*radius;
      const y=cy+Math.cos(phi)*radius;
      const row=[];

      for(let segment=0;segment<segments;segment+=1){
        const theta=Math.PI*2*segment/segments;
        row.push(vertex(
          cx+Math.cos(theta)*ringRadius,
          y,
          cz+Math.sin(theta)*ringRadius
        ));
      }
      rows.push(row);
    }

    const bottom=vertex(cx,cy-radius,cz);

    for(let segment=0;segment<segments;segment+=1){
      tri(top,rows[0][segment],rows[0][(segment+1)%segments],colour);
    }

    for(let ringIndex=0;ringIndex<rows.length-1;ringIndex+=1){
      const a=rows[ringIndex];
      const b=rows[ringIndex+1];

      for(let segment=0;segment<segments;segment+=1){
        quad(
          a[segment],
          b[segment],
          b[(segment+1)%segments],
          a[(segment+1)%segments],
          colour
        );
      }
    }

    const last=rows[rows.length-1];

    for(let segment=0;segment<segments;segment+=1){
      tri(bottom,last[(segment+1)%segments],last[segment],colour);
    }
  }

  function rectangularSurround(
    y,halfX,halfZ,
    frontWidth,sideWidth,rearWidth
  ){
    beam([-halfX,y, halfZ],[ halfX,y, halfZ],frontWidth);
    beam([ halfX,y, halfZ],[ halfX,y,-halfZ],sideWidth);
    beam([ halfX,y,-halfZ],[-halfX,y,-halfZ],rearWidth);
    beam([-halfX,y,-halfZ],[-halfX,y, halfZ],sideWidth);
  }

  const BASE_Y=0.72;
  const APEX_Y=16.10;
  const BASE_X=2.86;
  const BASE_Z=0.92;
  const APEX=[0,APEX_Y,0];

  const remainingFraction=y=>(APEX_Y-y)/(APEX_Y-BASE_Y);
  const legX=y=>BASE_X*remainingFraction(y);
  const legZ=y=>BASE_Z*remainingFraction(y);

  // Four uninterrupted outer legs.
  for(const [sx,sz] of [[-1,1],[1,1],[-1,-1],[1,-1]]){
    beam([sx*BASE_X,BASE_Y,sz*BASE_Z],APEX,0.062);
  }

  const LEVELS=[BASE_Y,4.15,7.75,11.05,13.68,APEX_Y];

  // Dense, front-dominant lattice with shallow rear depth.
  for(let bayIndex=0;bayIndex<LEVELS.length-1;bayIndex+=1){
    const y0=LEVELS[bayIndex];
    const y1=LEVELS[bayIndex+1];
    const x0=legX(y0),x1=legX(y1);
    const z0=legZ(y0),z1=legZ(y1);
    const width=bayIndex<3?0.030:0.024;

    beam([-x0,y0,z0],[ x1,y1,z1],width);
    beam([ x0,y0,z0],[-x1,y1,z1],width);

    beam([-x0,y0,-z0],[ x1,y1,-z1],width*0.48);
    beam([ x0,y0,-z0],[-x1,y1,-z1],width*0.48);

    beam([-x0,y0, z0],[-x1,y1,-z1],width*0.62);
    beam([ x0,y0,-z0],[ x1,y1, z1],width*0.62);
  }

  // Extra lower and middle lattice.
  for(const bayIndex of [0,1,2]){
    const y0=LEVELS[bayIndex];
    const y1=LEVELS[bayIndex+1];
    const middleY=(y0+y1)/2;
    const x0=legX(y0),xm=legX(middleY);
    const z0=legZ(y0),zm=legZ(middleY);

    beam([-x0,y0,z0],[ xm,middleY,zm],0.018);
    beam([ x0,y0,z0],[-xm,middleY,zm],0.018);
  }

  // Two slim front rails plus a subdued central mast.
  for(const sx of [-1,1]){
    beam(
      [sx*0.72,1.0,legZ(1.0)+0.012],
      [sx*0.10,15.80,legZ(15.80)+0.006],
      0.019
    );
  }
  beam([0,1.0,BASE_Z*0.42],[0,15.88,0.02],0.022);

  // Main surrounds.
  for(const y of [4.15,7.75,11.05]){
    rectangularSurround(y,legX(y),legZ(y),0.042,0.026,0.020);
  }

  // Upper outer clamp deck: only slightly smaller than the deck below.
  const CLAMP_Y=13.68;
  const CLAMP_X=0.88;
  const CLAMP_Z=0.29;

  rectangularSurround(CLAMP_Y,CLAMP_X,CLAMP_Z,0.075,0.046,0.042);

  for(const [sx,sz] of [[-1,1],[1,1],[-1,-1],[1,-1]]){
    beam(
      [sx*legX(CLAMP_Y),CLAMP_Y,sz*legZ(CLAMP_Y)],
      [sx*CLAMP_X,CLAMP_Y,sz*CLAMP_Z],
      0.023
    );
    box(sx*CLAMP_X,CLAMP_Y,sz*CLAMP_Z,0.13,0.12,0.13);
  }

  // Compact upper deck inside the joined top.
  const UPPER_RING_Y=14.90;
  rectangularSurround(
    UPPER_RING_Y,
    legX(UPPER_RING_Y),
    legZ(UPPER_RING_Y),
    0.026,0.016,0.013
  );

  beam(
    [-legX(CLAMP_Y),CLAMP_Y,legZ(CLAMP_Y)],
    [ legX(UPPER_RING_Y),UPPER_RING_Y,legZ(UPPER_RING_Y)],
    0.017
  );
  beam(
    [ legX(CLAMP_Y),CLAMP_Y,legZ(CLAMP_Y)],
    [-legX(UPPER_RING_Y),UPPER_RING_Y,legZ(UPPER_RING_Y)],
    0.017
  );
  beam(
    [-legX(UPPER_RING_Y),UPPER_RING_Y,legZ(UPPER_RING_Y)],
    APEX,
    0.015
  );
  beam(
    [ legX(UPPER_RING_Y),UPPER_RING_Y,legZ(UPPER_RING_Y)],
    APEX,
    0.015
  );

  // Collar, short beacon stalk and beacon.
  box(0,APEX_Y+0.10,0,0.32,0.14,0.24);
  beam([0,APEX_Y+0.17,0],[0,16.98,0],0.038);
  sphere(0,17.40,0,0.40,20,11,WHITE_BEACON,false);

  // Deeper open equipment base.
  const BASE_FRAME_X=3.04;
  const BASE_FRAME_Z=1.24;

  for(const [y,width] of [[0.16,0.065],[0.54,0.090]]){
    rectangularSurround(
      y,BASE_FRAME_X,BASE_FRAME_Z,
      width,width*0.82,width*0.76
    );
  }

  for(const [sx,sz] of [[-1,1],[1,1],[-1,-1],[1,-1]]){
    beam(
      [sx*BASE_FRAME_X,0.16,sz*BASE_FRAME_Z],
      [sx*BASE_FRAME_X,0.54,sz*BASE_FRAME_Z],
      0.070
    );
  }

  beam([-BASE_FRAME_X,0.36,0],[BASE_FRAME_X,0.36,0],0.040);
  beam([0,0.36,-BASE_FRAME_Z],[0,0.36,BASE_FRAME_Z],0.040);

  for(const item of [
    [-1.35, 0.48,0.66,0.74,0.56],
    [-0.35, 0.54,0.82,0.90,0.62],
    [ 0.72, 0.42,0.70,0.70,0.54],
    [ 1.45, 0.34,0.54,0.60,0.48],
    [-0.88,-0.45,0.56,0.54,0.46],
    [ 0.12,-0.48,0.64,0.60,0.50],
    [ 1.06,-0.38,0.52,0.50,0.44]
  ]){
    const [cx,cz,sx,sy,sz]=item;
    box(cx,0.56+sy/2,cz,sx,sy,sz);
  }

  // Small white lamps fixed to visible surround ends.
  for(const [y,radius] of [[4.15,0.082],[7.75,0.080],[11.05,0.078]]){
    const x=legX(y),z=legZ(y);
    sphere(-x,y,z,radius,14,8,WHITE_LIGHT,true);
    sphere( x,y,z,radius,14,8,WHITE_LIGHT,true);
  }

  sphere(-CLAMP_X,CLAMP_Y,CLAMP_Z,0.086,14,8,WHITE_LIGHT,true);
  sphere( CLAMP_X,CLAMP_Y,CLAMP_Z,0.086,14,8,WHITE_LIGHT,true);
  sphere(-BASE_FRAME_X,0.56,BASE_FRAME_Z,0.105,14,8,WHITE_LIGHT,true);
  sphere( BASE_FRAME_X,0.56,BASE_FRAME_Z,0.105,14,8,WHITE_LIGHT,true);

  const asset={
    centre:[0,0],
    mirror:false,
    view:{
      size:[6.7,18.6,2.8],
      target:[0,9.05,0],
      lift:2.12,
      fov:31,
      yaw:-0.31,
      pitch:-0.025,
      distance:29.2
    },
    palettes:{
      shell:["2C0A00","6B2200","B13F00","FF9300","FFCB55","FFFFFF","FFFFFF"],
      ridge:["B13F00","FF9300","FFCB55","FFFFFF","FFFFFF"]
    },
    effects:{
      emissive:true,
      bloom:{threshold:0.045,strength:2.4,radius:1.0},
      glow:{colour:"FF6A00",strength:1.9,spread:0.82},
      lights:lampPositions.map(item=>({
        position:item.slice(0,3),
        radius:item[3],
        colour:"FFFFFF",
        intensity:4.1,
        haloColour:"FF7D00",
        haloRadius:item[3]*10
      })),
      beacon:{
        position:[0,17.40,0],
        colour:"FFFFFF",
        intensity:5.3,
        haloColour:"FF8500",
        haloRadius:1.55
      }
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
