/* FieldOps Atlas — balanced scene transmitter with visible lights
 * Version: 1.6.39-extra-bold-production
 *
 * - full geometry; no quarter mirroring
 * - continuous base-to-apex outer legs
 * - dense front lattice with shallow 3D depth
 * - upper deck only slightly smaller than the deck below
 * - white lamps fixed to visible surround ends
 * - compact collar, beacon stalk and white beacon
 * - live scene aspect correction prevents vertical stretching
 * - unshaded ridge flares keep white lamps visible at mountain scale
 * - thicker structural members and bright ridge highlights restore boldness
 * - balanced scene scale is enlarged slightly without reintroducing stretching
 * - extra-bold production tuning for distant readability in the mountain scene
 */
(()=>{
  "use strict";

  const VERSION="1.6.39-extra-bold-production";
  const ASSET_ID="transmitter-gold-quarter";

  const positions=[];
  const indices=[];
  const faceColours=[];
  const ridgePositions=[];
  const ridgeIndices=[];
  const ridgeFaceColours=[];
  const lampPositions=[];

  const STRUCTURE=3;
  const WHITE_LIGHT=5;
  const WHITE_BEACON=6;
  const BOLDNESS=1.52;

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
    halfWidth*=BOLDNESS;
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


  const ridgeVertex=(x,y,z)=>{
    ridgePositions.push(x,y,z);
    return ridgePositions.length/3-1;
  };

  const ridgeTri=(a,b,c,colour)=>{
    ridgeIndices.push(a,b,c);
    ridgeFaceColours.push(colour);
  };


  function ridgeBeam(a,b,halfWidth=0.012,colour=3){
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
          corners.push(ridgeVertex(
            point[0]+(ux*su+vx*sv)*halfWidth,
            point[1]+(uy*su+vy*sv)*halfWidth,
            point[2]+(uz*su+vz*sv)*halfWidth
          ));
        }
      }
    }

    ridgeTri(corners[0],corners[1],corners[3],colour);
    ridgeTri(corners[0],corners[3],corners[2],colour);
    ridgeTri(corners[4],corners[6],corners[7],colour);
    ridgeTri(corners[4],corners[7],corners[5],colour);
    ridgeTri(corners[0],corners[4],corners[5],colour);
    ridgeTri(corners[0],corners[5],corners[1],colour);
    ridgeTri(corners[2],corners[3],corners[7],colour);
    ridgeTri(corners[2],corners[7],corners[6],colour);
  }

  function ridgeDiamondXY(cx,cy,cz,radius,colour){
    const left=ridgeVertex(cx-radius,cy,cz);
    const top=ridgeVertex(cx,cy+radius,cz);
    const right=ridgeVertex(cx+radius,cy,cz);
    const bottom=ridgeVertex(cx,cy-radius,cz);
    ridgeTri(left,top,right,colour);
    ridgeTri(left,right,bottom,colour);
  }

  function ridgeDiamondYZ(cx,cy,cz,radius,colour){
    const back=ridgeVertex(cx,cy,cz-radius);
    const top=ridgeVertex(cx,cy+radius,cz);
    const front=ridgeVertex(cx,cy,cz+radius);
    const bottom=ridgeVertex(cx,cy-radius,cz);
    ridgeTri(back,top,front,colour);
    ridgeTri(back,front,bottom,colour);
  }

  function visibleLamp(cx,cy,cz,coreRadius){
    sphere(cx,cy,cz,coreRadius,14,8,WHITE_LIGHT,true);

    // The production renderer has no bloom pass. These unshaded ridge diamonds
    // create a small gold halo and a white-hot core that remain visible after
    // the transmitter is scaled down onto the mountain.
    const outer=coreRadius*4.85;
    const middle=coreRadius*2.72;
    const core=coreRadius*1.18;

    ridgeDiamondXY(cx,cy,cz+0.010,outer,0);
    ridgeDiamondYZ(cx,cy,cz,middle,1);
    ridgeDiamondXY(cx,cy,cz+0.018,core,2);
  }

  function visibleBeacon(cx,cy,cz,radius){
    sphere(cx,cy,cz,radius,20,11,WHITE_BEACON,false);
    ridgeDiamondXY(cx,cy,cz+0.012,radius*2.55,0);
    ridgeDiamondYZ(cx,cy,cz,radius*1.92,1);
    ridgeDiamondXY(cx,cy,cz+0.024,radius*1.18,2);
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
  visibleBeacon(0,17.40,0,0.44);

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


  // Bright unshaded structural highlights. The production shell shader darkens
  // thin beams at mountain scale, so these smaller ridge overlays preserve the
  // main silhouette, front lattice and deck edges without turning the tower flat.
  for(const sx of [-1,1]){
    ridgeBeam([sx*BASE_X,BASE_Y,BASE_Z],APEX,0.024,3);
  }

  for(let bayIndex=0;bayIndex<LEVELS.length-1;bayIndex+=1){
    const y0=LEVELS[bayIndex];
    const y1=LEVELS[bayIndex+1];
    const x0=legX(y0),x1=legX(y1);
    const z0=legZ(y0),z1=legZ(y1);
    const width=bayIndex<3?0.0118:0.0102;
    ridgeBeam([-x0,y0,z0],[ x1,y1,z1],width*1.28,3);
    ridgeBeam([ x0,y0,z0],[-x1,y1,z1],width*1.28,3);
  }

  for(const y of [4.15,7.75,11.05]){
    const x=legX(y),z=legZ(y);
    ridgeBeam([-x,y,z],[x,y,z],0.017,3);
  }

  ridgeBeam([-CLAMP_X,CLAMP_Y,CLAMP_Z],[CLAMP_X,CLAMP_Y,CLAMP_Z],0.024,3);
  ridgeBeam(
    [-legX(UPPER_RING_Y),UPPER_RING_Y,legZ(UPPER_RING_Y)],
    [ legX(UPPER_RING_Y),UPPER_RING_Y,legZ(UPPER_RING_Y)],
    0.012,3
  );
  ridgeBeam([0,APEX_Y+0.17,0],[0,16.98,0],0.014,3);
  ridgeBeam(
    [-BASE_FRAME_X,0.54,BASE_FRAME_Z],
    [ BASE_FRAME_X,0.54,BASE_FRAME_Z],
    0.018,3
  );

  // Small white lamps fixed to visible surround ends.
  for(const [y,radius] of [[4.15,0.082],[7.75,0.080],[11.05,0.078]]){
    const x=legX(y),z=legZ(y);
    visibleLamp(-x,y,z,radius*1.74);
    visibleLamp( x,y,z,radius*1.74);
  }

  visibleLamp(-CLAMP_X,CLAMP_Y,CLAMP_Z,0.168);
  visibleLamp( CLAMP_X,CLAMP_Y,CLAMP_Z,0.168);
  visibleLamp(-BASE_FRAME_X,0.56,BASE_FRAME_Z,0.182);
  visibleLamp( BASE_FRAME_X,0.56,BASE_FRAME_Z,0.182);

  let ASSET_MIN_Y=Infinity;
  for(let index=1;index<positions.length;index+=3){
    ASSET_MIN_Y=Math.min(ASSET_MIN_Y,positions[index]);
  }

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
      shell:["431500","8C3100","DB5600","FFBA22","FFE79A","FFFFFF","FFFFFF"],
      ridge:["FF9200","FFDD78","FFFFFF","FFD057"]
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
      },
      ridge:{
        format:"raw-indexed",
        normals:false,
        positions:new Float32Array(ridgePositions),
        indices:new Uint32Array(ridgeIndices),
        faceColours:new Uint8Array(ridgeFaceColours)
      }
    }
  };

  if(globalThis.FieldOps3DAssets?.register){
    globalThis.FieldOps3DAssets.register(ASSET_ID,asset);
  }else{
    (globalThis.FieldOps3DAssetQueue||=[]).push({id:ASSET_ID,...asset});
  }


  // river-scene.js currently applies a narrow footprint scale and a much larger
  // height scale. Balance those values before the production renderer builds
  // its model matrices, so the transmitter remains one rigid proportioned object.
  const renderer=globalThis.FieldOps3DRenderer;
  if(renderer?.create&&!renderer.__fieldOpsBalancedTransmitterScale){
    const originalCreate=renderer.create.bind(renderer);

    renderer.create=(root,scene)=>{
      const objects=(scene?.objects||[]).map(definition=>{
        if(definition?.asset!==ASSET_ID||!Array.isArray(definition.scale)){
          return definition;
        }

        const [sx=1,sy=1,sz=1]=definition.scale;
        const horizontal=(Math.abs(sx)+Math.abs(sz))*0.5;
        const vertical=Math.abs(sy);

        // Standalone and already-uniform scenes pass through unchanged.
        if(!Number.isFinite(horizontal)||!Number.isFinite(vertical)||
           Math.abs(horizontal-vertical)<0.001){
          return definition;
        }

        // Geometric mean gives the tower more width and less height than the
        // stretched version while preserving its visual prominence.
        const uniform=Math.min(
          vertical,
          Math.sqrt(Math.max(0.000001,horizontal*vertical))*1.22
        );
        const position=[...(definition.position||[0,0,0])];

        // Keep the feet on the exact same mountain mounting plane.
        position[1]+=ASSET_MIN_Y*(sy-uniform);

        return {
          ...definition,
          position,
          scale:[
            (Math.sign(sx)||1)*uniform,
            (Math.sign(sy)||1)*uniform,
            (Math.sign(sz)||1)*uniform
          ]
        };
      });

      return originalCreate(root,{...scene,objects});
    };

    renderer.__fieldOpsBalancedTransmitterScale=VERSION;
  }

  globalThis.FieldOpsGoldTransmitterQuarter=Object.freeze({VERSION,ASSET_ID});
})();
