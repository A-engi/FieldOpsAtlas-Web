/*!
 * FieldOpsAtlas RF Builder 3 — self-contained v1.1.341
 * Embedded tree-shaken Three.js r160 runtime.
 * Three.js is Copyright 2010-2023 Three.js Authors, SPDX-License-Identifier: MIT.
 * Builder/core source derived from current main v1.1.307 baseline.
 */
(()=>{var Gr="160";var qo=0,ea=1,jo=2;var Ro=1,$o=2,jt=3,pn=0,Ct=1,bt=2;var Gt=0,qn=1,ta=2,na=3,ia=4,ec=5,wn=100,tc=101,nc=102,sa=103,ra=104,ic=200,sc=201,rc=202,ac=203,tr=204,nr=205,oc=206,cc=207,lc=208,hc=209,uc=210,dc=211,fc=212,pc=213,Ec=214,gc=0,mc=1,Dc=2,zi=3,Ac=4,xc=5,Cc=6,Mc=7,wo=0,Rc=1,wc=2,dn=0,Bc=1,vc=2,Fc=3,Nr=4,Sc=5,yc=6;var Bo=300,ei=301,ti=302,ir=303,sr=304,gs=306,rr=1e3,Qt=1001,ar=1002,mt=1003,aa=1004;var ws=1005;var yt=1006,bc=1007;var gi=1008;var fn=1009,Uc=1010,Tc=1011,Lr=1012,vo=1013,hn=1014,un=1015,mi=1016,Fo=1017,So=1018,vn=1020,_c=1021,Ht=1023,Ic=1024,Pc=1025,Fn=1026,ni=1027,Qc=1028,yo=1029,Hc=1030,bo=1031,Uo=1033,Bs=33776,vs=33777,Fs=33778,Ss=33779,oa=35840,ca=35841,la=35842,ha=35843,To=36196,ua=37492,da=37496,fa=37808,pa=37809,Ea=37810,ga=37811,ma=37812,Da=37813,Aa=37814,xa=37815,Ca=37816,Ma=37817,Ra=37818,wa=37819,Ba=37820,va=37821,ys=36492,Fa=36494,Sa=36495,Gc=36283,ya=36284,ba=36285,Ua=36286;var Ji=2300,Ki=2301,bs=2302,Ta=2400,_a=2401,Ia=2402;var _o=3e3,Sn=3001,Nc=3200,Lc=3201,Oc=0,Vc=1,Ut="",it="srgb",tn="srgb-linear",Or="display-p3",ms="display-p3-linear",qi="linear",qe="srgb",ji="rec709",$i="p3";var Un=7680;var Pa=519,kc=512,Yc=513,Wc=514,Io=515,Zc=516,Xc=517,zc=518,Jc=519,Qa=35044;var Ha="300 es",or=1035,en=2e3,es=2001,En=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},ut=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Us=Math.PI/180,cr=180/Math.PI;function Mi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ut[i&255]+ut[i>>8&255]+ut[i>>16&255]+ut[i>>24&255]+"-"+ut[e&255]+ut[e>>8&255]+"-"+ut[e>>16&15|64]+ut[e>>24&255]+"-"+ut[t&63|128]+ut[t>>8&255]+"-"+ut[t>>16&255]+ut[t>>24&255]+ut[n&255]+ut[n>>8&255]+ut[n>>16&255]+ut[n>>24&255]).toLowerCase()}function xt(i,e,t){return Math.max(e,Math.min(t,i))}function Kc(i,e){return(i%e+e)%e}function Ts(i,e,t){return(1-t)*i+t*e}function Ga(i){return(i&i-1)===0&&i!==0}function lr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function li(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function At(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Ze=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(xt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ke=class i{constructor(e,t,n,s,r,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],d=n[7],f=n[2],E=n[5],m=n[8],D=s[0],p=s[3],u=s[6],w=s[1],C=s[4],S=s[7],T=s[2],y=s[5],F=s[8];return r[0]=o*D+a*w+c*T,r[3]=o*p+a*C+c*y,r[6]=o*u+a*S+c*F,r[1]=l*D+h*w+d*T,r[4]=l*p+h*C+d*y,r[7]=l*u+h*S+d*F,r[2]=f*D+E*w+m*T,r[5]=f*p+E*C+m*y,r[8]=f*u+E*S+m*F,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=h*o-a*l,f=a*c-h*r,E=l*r-o*c,m=t*d+n*f+s*E;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let D=1/m;return e[0]=d*D,e[1]=(s*l-h*n)*D,e[2]=(a*n-s*o)*D,e[3]=f*D,e[4]=(h*t-s*c)*D,e[5]=(s*r-a*t)*D,e[6]=E*D,e[7]=(n*c-l*t)*D,e[8]=(o*t-n*r)*D,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(_s.makeScale(e,t)),this}rotate(e){return this.premultiply(_s.makeRotation(-e)),this}translate(e,t){return this.premultiply(_s.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},_s=new ke;function Po(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ts(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function qc(){let i=ts("canvas");return i.style.display="block",i}var Na={};function pi(i){i in Na||(Na[i]=!0,console.warn(i))}var La=new ke().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Oa=new ke().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Bi={[tn]:{transfer:qi,primaries:ji,toReference:i=>i,fromReference:i=>i},[it]:{transfer:qe,primaries:ji,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[ms]:{transfer:qi,primaries:$i,toReference:i=>i.applyMatrix3(Oa),fromReference:i=>i.applyMatrix3(La)},[Or]:{transfer:qe,primaries:$i,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Oa),fromReference:i=>i.applyMatrix3(La).convertLinearToSRGB()}},jc=new Set([tn,ms]),Xe={enabled:!0,_workingColorSpace:tn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!jc.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;let n=Bi[e].toReference,s=Bi[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Bi[i].primaries},getTransfer:function(i){return i===Ut?qi:Bi[i].transfer}};function jn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Is(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Tn,ns=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Tn===void 0&&(Tn=ts("canvas")),Tn.width=e.width,Tn.height=e.height;let n=Tn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Tn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=ts("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=jn(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(jn(t[n]/255)*255):t[n]=jn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},$c=0,is=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:$c++}),this.uuid=Mi(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ps(s[o].image)):r.push(Ps(s[o]))}else r=Ps(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Ps(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ns.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var el=0,Nt=class i extends En{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Qt,s=Qt,r=yt,o=gi,a=Ht,c=fn,l=i.DEFAULT_ANISOTROPY,h=Ut){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:el++}),this.uuid=Mi(),this.name="",this.source=new is(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Ze(0,0),this.repeat=new Ze(1,1),this.center=new Ze(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(pi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Sn?it:Ut),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Bo)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case rr:e.x=e.x-Math.floor(e.x);break;case Qt:e.x=e.x<0?0:1;break;case ar:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case rr:e.y=e.y-Math.floor(e.y);break;case Qt:e.y=e.y<0?0:1;break;case ar:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return pi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===it?Sn:_o}set encoding(e){pi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===Sn?it:Ut}};Nt.DEFAULT_IMAGE=null;Nt.DEFAULT_MAPPING=Bo;Nt.DEFAULT_ANISOTROPY=1;var lt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],h=c[4],d=c[8],f=c[1],E=c[5],m=c[9],D=c[2],p=c[6],u=c[10];if(Math.abs(h-f)<.01&&Math.abs(d-D)<.01&&Math.abs(m-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+D)<.1&&Math.abs(m+p)<.1&&Math.abs(l+E+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let C=(l+1)/2,S=(E+1)/2,T=(u+1)/2,y=(h+f)/4,F=(d+D)/4,$=(m+p)/4;return C>S&&C>T?C<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(C),s=y/n,r=F/n):S>T?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=y/s,r=$/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=F/r,s=$/r),this.set(n,s,r,t),this}let w=Math.sqrt((p-m)*(p-m)+(d-D)*(d-D)+(f-h)*(f-h));return Math.abs(w)<.001&&(w=1),this.x=(p-m)/w,this.y=(d-D)/w,this.z=(f-h)/w,this.w=Math.acos((l+E+u-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},hr=class extends En{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new lt(0,0,e,t),this.scissorTest=!1,this.viewport=new lt(0,0,e,t);let s={width:e,height:t,depth:1};n.encoding!==void 0&&(pi("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Sn?it:Ut),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:yt,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Nt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new is(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},nn=class extends hr{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ss=class extends Nt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=mt,this.minFilter=mt,this.wrapR=Qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ur=class extends Nt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=mt,this.minFilter=mt,this.wrapR=Qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var gn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3],f=r[o+0],E=r[o+1],m=r[o+2],D=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d;return}if(a===1){e[t+0]=f,e[t+1]=E,e[t+2]=m,e[t+3]=D;return}if(d!==D||c!==f||l!==E||h!==m){let p=1-a,u=c*f+l*E+h*m+d*D,w=u>=0?1:-1,C=1-u*u;if(C>Number.EPSILON){let T=Math.sqrt(C),y=Math.atan2(T,u*w);p=Math.sin(p*y)/T,a=Math.sin(a*y)/T}let S=a*w;if(c=c*p+f*S,l=l*p+E*S,h=h*p+m*S,d=d*p+D*S,p===1-a){let T=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=T,l*=T,h*=T,d*=T}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=r[o],f=r[o+1],E=r[o+2],m=r[o+3];return e[t]=a*m+h*d+c*E-l*f,e[t+1]=c*m+h*f+l*d-a*E,e[t+2]=l*m+h*E+a*f-c*d,e[t+3]=h*m-a*d-c*f-l*E,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),d=a(r/2),f=c(n/2),E=c(s/2),m=c(r/2);switch(o){case"XYZ":this._x=f*h*d+l*E*m,this._y=l*E*d-f*h*m,this._z=l*h*m+f*E*d,this._w=l*h*d-f*E*m;break;case"YXZ":this._x=f*h*d+l*E*m,this._y=l*E*d-f*h*m,this._z=l*h*m-f*E*d,this._w=l*h*d+f*E*m;break;case"ZXY":this._x=f*h*d-l*E*m,this._y=l*E*d+f*h*m,this._z=l*h*m+f*E*d,this._w=l*h*d-f*E*m;break;case"ZYX":this._x=f*h*d-l*E*m,this._y=l*E*d+f*h*m,this._z=l*h*m-f*E*d,this._w=l*h*d+f*E*m;break;case"YZX":this._x=f*h*d+l*E*m,this._y=l*E*d+f*h*m,this._z=l*h*m-f*E*d,this._w=l*h*d-f*E*m;break;case"XZY":this._x=f*h*d-l*E*m,this._y=l*E*d-f*h*m,this._z=l*h*m+f*E*d,this._w=l*h*d+f*E*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],d=t[10],f=n+a+d;if(f>0){let E=.5/Math.sqrt(f+1);this._w=.25/E,this._x=(h-c)*E,this._y=(r-l)*E,this._z=(o-s)*E}else if(n>a&&n>d){let E=2*Math.sqrt(1+n-a-d);this._w=(h-c)/E,this._x=.25*E,this._y=(s+o)/E,this._z=(r+l)/E}else if(a>d){let E=2*Math.sqrt(1+a-n-d);this._w=(r-l)/E,this._x=(s+o)/E,this._y=.25*E,this._z=(c+h)/E}else{let E=2*Math.sqrt(1+d-n-a);this._w=(o-s)/E,this._x=(r+l)/E,this._y=(c+h)/E,this._z=.25*E}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(xt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let E=1-t;return this._w=E*o+t*this._w,this._x=E*n+t*this._x,this._y=E*s+t*this._y,this._z=E*r+t*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),d=Math.sin((1-t)*h)/l,f=Math.sin(t*h)/l;return this._w=o*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(s),n*Math.sin(r),n*Math.cos(r),t*Math.sin(s))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},H=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Va.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Va.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),h=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+c*l+o*d-a*h,this.y=n+c*h+a*l-r*d,this.z=s+c*d+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Qs.copy(this).projectOnVector(e),this.sub(Qs)}reflect(e){return this.sub(Qs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(xt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Qs=new H,Va=new gn,sn=class{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(_t.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(_t.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=_t.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,_t):_t.fromBufferAttribute(r,o),_t.applyMatrix4(e.matrixWorld),this.expandByPoint(_t);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),vi.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),vi.copy(n.boundingBox)),vi.applyMatrix4(e.matrixWorld),this.union(vi)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,_t),_t.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(hi),Fi.subVectors(this.max,hi),_n.subVectors(e.a,hi),In.subVectors(e.b,hi),Pn.subVectors(e.c,hi),rn.subVectors(In,_n),an.subVectors(Pn,In),An.subVectors(_n,Pn);let t=[0,-rn.z,rn.y,0,-an.z,an.y,0,-An.z,An.y,rn.z,0,-rn.x,an.z,0,-an.x,An.z,0,-An.x,-rn.y,rn.x,0,-an.y,an.x,0,-An.y,An.x,0];return!Hs(t,_n,In,Pn,Fi)||(t=[1,0,0,0,1,0,0,0,1],!Hs(t,_n,In,Pn,Fi))?!1:(Si.crossVectors(rn,an),t=[Si.x,Si.y,Si.z],Hs(t,_n,In,Pn,Fi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,_t).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(_t).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Xt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Xt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Xt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Xt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Xt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Xt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Xt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Xt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Xt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Xt=[new H,new H,new H,new H,new H,new H,new H,new H],_t=new H,vi=new sn,_n=new H,In=new H,Pn=new H,rn=new H,an=new H,An=new H,hi=new H,Fi=new H,Si=new H,xn=new H;function Hs(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){xn.fromArray(i,r);let a=s.x*Math.abs(xn.x)+s.y*Math.abs(xn.y)+s.z*Math.abs(xn.z),c=e.dot(xn),l=t.dot(xn),h=n.dot(xn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var tl=new sn,ui=new H,Gs=new H,Di=class{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):tl.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ui.subVectors(e,this.center);let t=ui.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ui,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Gs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ui.copy(e.center).add(Gs)),this.expandByPoint(ui.copy(e.center).sub(Gs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},zt=new H,Ns=new H,yi=new H,on=new H,Ls=new H,bi=new H,Os=new H,dr=class{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,zt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=zt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(zt.copy(this.origin).addScaledVector(this.direction,t),zt.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Ns.copy(e).add(t).multiplyScalar(.5),yi.copy(t).sub(e).normalize(),on.copy(this.origin).sub(Ns);let r=e.distanceTo(t)*.5,o=-this.direction.dot(yi),a=on.dot(this.direction),c=-on.dot(yi),l=on.lengthSq(),h=Math.abs(1-o*o),d,f,E,m;if(h>0)if(d=o*c-a,f=o*a-c,m=r*h,d>=0)if(f>=-m)if(f<=m){let D=1/h;d*=D,f*=D,E=d*(d+o*f+2*a)+f*(o*d+f+2*c)+l}else f=r,d=Math.max(0,-(o*f+a)),E=-d*d+f*(f+2*c)+l;else f=-r,d=Math.max(0,-(o*f+a)),E=-d*d+f*(f+2*c)+l;else f<=-m?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-c),r),E=-d*d+f*(f+2*c)+l):f<=m?(d=0,f=Math.min(Math.max(-r,-c),r),E=f*(f+2*c)+l):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-c),r),E=-d*d+f*(f+2*c)+l);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),E=-d*d+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Ns).addScaledVector(yi,f),E}intersectSphere(e,t){zt.subVectors(e.center,this.origin);let n=zt.dot(this.direction),s=zt.dot(zt)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),h>=0?(r=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-f.z)*d,c=(e.max.z-f.z)*d):(a=(e.max.z-f.z)*d,c=(e.min.z-f.z)*d),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,zt)!==null}intersectTriangle(e,t,n,s,r){Ls.subVectors(t,e),bi.subVectors(n,e),Os.crossVectors(Ls,bi);let o=this.direction.dot(Os),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;on.subVectors(this.origin,e);let c=a*this.direction.dot(bi.crossVectors(on,bi));if(c<0)return null;let l=a*this.direction.dot(Ls.cross(on));if(l<0||c+l>o)return null;let h=-a*on.dot(Os);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ft=class i{constructor(e,t,n,s,r,o,a,c,l,h,d,f,E,m,D,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,h,d,f,E,m,D,p)}set(e,t,n,s,r,o,a,c,l,h,d,f,E,m,D,p){let u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=s,u[1]=r,u[5]=o,u[9]=a,u[13]=c,u[2]=l,u[6]=h,u[10]=d,u[14]=f,u[3]=E,u[7]=m,u[11]=D,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Qn.setFromMatrixColumn(e,0).length(),r=1/Qn.setFromMatrixColumn(e,1).length(),o=1/Qn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let f=o*h,E=o*d,m=a*h,D=a*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=E+m*l,t[5]=f-D*l,t[9]=-a*c,t[2]=D-f*l,t[6]=m+E*l,t[10]=o*c}else if(e.order==="YXZ"){let f=c*h,E=c*d,m=l*h,D=l*d;t[0]=f+D*a,t[4]=m*a-E,t[8]=o*l,t[1]=o*d,t[5]=o*h,t[9]=-a,t[2]=E*a-m,t[6]=D+f*a,t[10]=o*c}else if(e.order==="ZXY"){let f=c*h,E=c*d,m=l*h,D=l*d;t[0]=f-D*a,t[4]=-o*d,t[8]=m+E*a,t[1]=E+m*a,t[5]=o*h,t[9]=D-f*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let f=o*h,E=o*d,m=a*h,D=a*d;t[0]=c*h,t[4]=m*l-E,t[8]=f*l+D,t[1]=c*d,t[5]=D*l+f,t[9]=E*l-m,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let f=o*c,E=o*l,m=a*c,D=a*l;t[0]=c*h,t[4]=D-f*d,t[8]=m*d+E,t[1]=d,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=E*d+m,t[10]=f-D*d}else if(e.order==="XZY"){let f=o*c,E=o*l,m=a*c,D=a*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=f*d+D,t[5]=o*h,t[9]=E*d-m,t[2]=m*d-E,t[6]=a*h,t[10]=D*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(nl,e,il)}lookAt(e,t,n){let s=this.elements;return wt.subVectors(e,t),wt.lengthSq()===0&&(wt.z=1),wt.normalize(),cn.crossVectors(n,wt),cn.lengthSq()===0&&(Math.abs(n.z)===1?wt.x+=1e-4:wt.z+=1e-4,wt.normalize(),cn.crossVectors(n,wt)),cn.normalize(),Ui.crossVectors(wt,cn),s[0]=cn.x,s[4]=Ui.x,s[8]=wt.x,s[1]=cn.y,s[5]=Ui.y,s[9]=wt.y,s[2]=cn.z,s[6]=Ui.z,s[10]=wt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],d=n[5],f=n[9],E=n[13],m=n[2],D=n[6],p=n[10],u=n[14],w=n[3],C=n[7],S=n[11],T=n[15],y=s[0],F=s[4],$=s[8],M=s[12],R=s[1],L=s[5],ee=s[9],le=s[13],b=s[2],G=s[6],V=s[10],J=s[14],W=s[3],k=s[7],te=s[11],se=s[15];return r[0]=o*y+a*R+c*b+l*W,r[4]=o*F+a*L+c*G+l*k,r[8]=o*$+a*ee+c*V+l*te,r[12]=o*M+a*le+c*J+l*se,r[1]=h*y+d*R+f*b+E*W,r[5]=h*F+d*L+f*G+E*k,r[9]=h*$+d*ee+f*V+E*te,r[13]=h*M+d*le+f*J+E*se,r[2]=m*y+D*R+p*b+u*W,r[6]=m*F+D*L+p*G+u*k,r[10]=m*$+D*ee+p*V+u*te,r[14]=m*M+D*le+p*J+u*se,r[3]=w*y+C*R+S*b+T*W,r[7]=w*F+C*L+S*G+T*k,r[11]=w*$+C*ee+S*V+T*te,r[15]=w*M+C*le+S*J+T*se,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],d=e[6],f=e[10],E=e[14],m=e[3],D=e[7],p=e[11],u=e[15];return m*(+r*c*d-s*l*d-r*a*f+n*l*f+s*a*E-n*c*E)+D*(+t*c*E-t*l*f+r*o*f-s*o*E+s*l*h-r*c*h)+p*(+t*l*d-t*a*E-r*o*d+n*o*E+r*a*h-n*l*h)+u*(-s*a*h-t*c*d+t*a*f+s*o*d-n*o*f+n*c*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=e[9],f=e[10],E=e[11],m=e[12],D=e[13],p=e[14],u=e[15],w=d*p*l-D*f*l+D*c*E-a*p*E-d*c*u+a*f*u,C=m*f*l-h*p*l-m*c*E+o*p*E+h*c*u-o*f*u,S=h*D*l-m*d*l+m*a*E-o*D*E-h*a*u+o*d*u,T=m*d*c-h*D*c-m*a*f+o*D*f+h*a*p-o*d*p,y=t*w+n*C+s*S+r*T;if(y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/y;return e[0]=w*F,e[1]=(D*f*r-d*p*r-D*s*E+n*p*E+d*s*u-n*f*u)*F,e[2]=(a*p*r-D*c*r+D*s*l-n*p*l-a*s*u+n*c*u)*F,e[3]=(d*c*r-a*f*r-d*s*l+n*f*l+a*s*E-n*c*E)*F,e[4]=C*F,e[5]=(h*p*r-m*f*r+m*s*E-t*p*E-h*s*u+t*f*u)*F,e[6]=(m*c*r-o*p*r-m*s*l+t*p*l+o*s*u-t*c*u)*F,e[7]=(o*f*r-h*c*r+h*s*l-t*f*l-o*s*E+t*c*E)*F,e[8]=S*F,e[9]=(m*d*r-h*D*r-m*n*E+t*D*E+h*n*u-t*d*u)*F,e[10]=(o*D*r-m*a*r+m*n*l-t*D*l-o*n*u+t*a*u)*F,e[11]=(h*a*r-o*d*r-h*n*l+t*d*l+o*n*E-t*a*E)*F,e[12]=T*F,e[13]=(h*D*s-m*d*s+m*n*f-t*D*f-h*n*p+t*d*p)*F,e[14]=(m*a*s-o*D*s-m*n*c+t*D*c+o*n*p-t*a*p)*F,e[15]=(o*d*s-h*a*s+h*n*c-t*d*c-o*n*f+t*a*f)*F,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,d=a+a,f=r*l,E=r*h,m=r*d,D=o*h,p=o*d,u=a*d,w=c*l,C=c*h,S=c*d,T=n.x,y=n.y,F=n.z;return s[0]=(1-(D+u))*T,s[1]=(E+S)*T,s[2]=(m-C)*T,s[3]=0,s[4]=(E-S)*y,s[5]=(1-(f+u))*y,s[6]=(p+w)*y,s[7]=0,s[8]=(m+C)*F,s[9]=(p-w)*F,s[10]=(1-(f+D))*F,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Qn.set(s[0],s[1],s[2]).length(),o=Qn.set(s[4],s[5],s[6]).length(),a=Qn.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],It.copy(this);let l=1/r,h=1/o,d=1/a;return It.elements[0]*=l,It.elements[1]*=l,It.elements[2]*=l,It.elements[4]*=h,It.elements[5]*=h,It.elements[6]*=h,It.elements[8]*=d,It.elements[9]*=d,It.elements[10]*=d,t.setFromRotationMatrix(It),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=en){let c=this.elements,l=2*r/(t-e),h=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),E,m;if(a===en)E=-(o+r)/(o-r),m=-2*o*r/(o-r);else if(a===es)E=-o/(o-r),m=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=E,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=en){let c=this.elements,l=1/(t-e),h=1/(n-s),d=1/(o-r),f=(t+e)*l,E=(n+s)*h,m,D;if(a===en)m=(o+r)*d,D=-2*d;else if(a===es)m=r*d,D=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-E,c[2]=0,c[6]=0,c[10]=D,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Qn=new H,It=new ft,nl=new H(0,0,0),il=new H(1,1,1),cn=new H,Ui=new H,wt=new H,ka=new ft,Ya=new gn,rs=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],d=s[2],f=s[6],E=s[10];switch(t){case"XYZ":this._y=Math.asin(xt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,E),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-xt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,E),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(xt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,E),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-xt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,E),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(xt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,E));break;case"XZY":this._z=Math.asin(-xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,E),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ka.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ka,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ya.setFromEuler(this),this.setFromQuaternion(Ya,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};rs.DEFAULT_ORDER="XYZ";var as=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},sl=0,Wa=new H,Hn=new gn,Jt=new ft,Ti=new H,di=new H,rl=new H,al=new gn,Za=new H(1,0,0),Xa=new H(0,1,0),za=new H(0,0,1),ol={type:"added"},cl={type:"removed"},Lt=class i extends En{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sl++}),this.uuid=Mi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new H,t=new rs,n=new gn,s=new H(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ft},normalMatrix:{value:new ke}}),this.matrix=new ft,this.matrixWorld=new ft,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new as,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Hn.setFromAxisAngle(e,t),this.quaternion.multiply(Hn),this}rotateOnWorldAxis(e,t){return Hn.setFromAxisAngle(e,t),this.quaternion.premultiply(Hn),this}rotateX(e){return this.rotateOnAxis(Za,e)}rotateY(e){return this.rotateOnAxis(Xa,e)}rotateZ(e){return this.rotateOnAxis(za,e)}translateOnAxis(e,t){return Wa.copy(e).applyQuaternion(this.quaternion),this.position.add(Wa.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Za,e)}translateY(e){return this.translateOnAxis(Xa,e)}translateZ(e){return this.translateOnAxis(za,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Jt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ti.copy(e):Ti.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),di.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Jt.lookAt(di,Ti,this.up):Jt.lookAt(Ti,di,this.up),this.quaternion.setFromRotationMatrix(Jt),s&&(Jt.extractRotation(s.matrixWorld),Hn.setFromRotationMatrix(Jt),this.quaternion.premultiply(Hn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(ol)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(cl)),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Jt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Jt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Jt),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(di,e,rl),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(di,al,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++){let r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++){let a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),d=o(e.shapes),f=o(e.skeletons),E=o(e.animations),m=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),E.length>0&&(n.animations=E),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Lt.DEFAULT_UP=new H(0,1,0);Lt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Pt=new H,Kt=new H,Vs=new H,qt=new H,Gn=new H,Nn=new H,Ja=new H,ks=new H,Ys=new H,Ws=new H,_i=!1,Xn=class i{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Pt.subVectors(e,t),s.cross(Pt);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Pt.subVectors(s,t),Kt.subVectors(n,t),Vs.subVectors(e,t);let o=Pt.dot(Pt),a=Pt.dot(Kt),c=Pt.dot(Vs),l=Kt.dot(Kt),h=Kt.dot(Vs),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;let f=1/d,E=(l*c-a*h)*f,m=(o*h-a*c)*f;return r.set(1-E-m,m,E)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,qt)===null?!1:qt.x>=0&&qt.y>=0&&qt.x+qt.y<=1}static getUV(e,t,n,s,r,o,a,c){return _i===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),_i=!0),this.getInterpolation(e,t,n,s,r,o,a,c)}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,qt)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,qt.x),c.addScaledVector(o,qt.y),c.addScaledVector(a,qt.z),c)}static isFrontFacing(e,t,n,s){return Pt.subVectors(n,t),Kt.subVectors(e,t),Pt.cross(Kt).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Pt.subVectors(this.c,this.b),Kt.subVectors(this.a,this.b),Pt.cross(Kt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,s,r){return _i===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),_i=!0),i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Gn.subVectors(s,n),Nn.subVectors(r,n),ks.subVectors(e,n);let c=Gn.dot(ks),l=Nn.dot(ks);if(c<=0&&l<=0)return t.copy(n);Ys.subVectors(e,s);let h=Gn.dot(Ys),d=Nn.dot(Ys);if(h>=0&&d<=h)return t.copy(s);let f=c*d-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(Gn,o);Ws.subVectors(e,r);let E=Gn.dot(Ws),m=Nn.dot(Ws);if(m>=0&&E<=m)return t.copy(r);let D=E*l-c*m;if(D<=0&&l>=0&&m<=0)return a=l/(l-m),t.copy(n).addScaledVector(Nn,a);let p=h*m-E*d;if(p<=0&&d-h>=0&&E-m>=0)return Ja.subVectors(r,s),a=(d-h)/(d-h+(E-m)),t.copy(s).addScaledVector(Ja,a);let u=1/(p+D+f);return o=D*u,a=f*u,t.copy(n).addScaledVector(Gn,o).addScaledVector(Nn,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Qo={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ln={h:0,s:0,l:0},Ii={h:0,s:0,l:0};function Zs(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var We=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=it){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=Xe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Xe.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=Xe.workingColorSpace){if(e=Kc(e,1),t=xt(t,0,1),n=xt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Zs(o,r,e+1/3),this.g=Zs(o,r,e),this.b=Zs(o,r,e-1/3)}return Xe.toWorkingColorSpace(this,s),this}setStyle(e,t=it){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=it){let n=Qo[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=jn(e.r),this.g=jn(e.g),this.b=jn(e.b),this}copyLinearToSRGB(e){return this.r=Is(e.r),this.g=Is(e.g),this.b=Is(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=it){return Xe.fromWorkingColorSpace(dt.copy(this),e),Math.round(xt(dt.r*255,0,255))*65536+Math.round(xt(dt.g*255,0,255))*256+Math.round(xt(dt.b*255,0,255))}getHexString(e=it){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Xe.workingColorSpace){Xe.fromWorkingColorSpace(dt.copy(this),t);let n=dt.r,s=dt.g,r=dt.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let d=o-a;switch(l=h<=.5?d/(o+a):d/(2-o-a),o){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=Xe.workingColorSpace){return Xe.fromWorkingColorSpace(dt.copy(this),t),e.r=dt.r,e.g=dt.g,e.b=dt.b,e}getStyle(e=it){Xe.fromWorkingColorSpace(dt.copy(this),e);let t=dt.r,n=dt.g,s=dt.b;return e!==it?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ln),this.setHSL(ln.h+e,ln.s+t,ln.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ln),e.getHSL(Ii);let n=Ts(ln.h,Ii.h,t),s=Ts(ln.s,Ii.s,t),r=Ts(ln.l,Ii.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},dt=new We;We.NAMES=Qo;var ll=0,ii=class extends En{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ll++}),this.uuid=Mi(),this.name="",this.type="Material",this.blending=qn,this.side=pn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tr,this.blendDst=nr,this.blendEquation=wn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new We(0,0,0),this.blendAlpha=0,this.depthFunc=zi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Pa,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Un,this.stencilZFail=Un,this.stencilZPass=Un,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==qn&&(n.blending=this.blending),this.side!==pn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==tr&&(n.blendSrc=this.blendSrc),this.blendDst!==nr&&(n.blendDst=this.blendDst),this.blendEquation!==wn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==zi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Pa&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Un&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Un&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Un&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},si=class extends ii{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new We(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=wo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var nt=new H,Pi=new Ze,Mt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Qa,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=un,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Pi.fromBufferAttribute(this,t),Pi.applyMatrix3(e),this.setXY(t,Pi.x,Pi.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)nt.fromBufferAttribute(this,t),nt.applyMatrix3(e),this.setXYZ(t,nt.x,nt.y,nt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)nt.fromBufferAttribute(this,t),nt.applyMatrix4(e),this.setXYZ(t,nt.x,nt.y,nt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)nt.fromBufferAttribute(this,t),nt.applyNormalMatrix(e),this.setXYZ(t,nt.x,nt.y,nt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)nt.fromBufferAttribute(this,t),nt.transformDirection(e),this.setXYZ(t,nt.x,nt.y,nt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=li(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=At(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=li(t,this.array)),t}setX(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=li(t,this.array)),t}setY(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=li(t,this.array)),t}setZ(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=li(t,this.array)),t}setW(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),n=At(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),n=At(n,this.array),s=At(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),n=At(n,this.array),s=At(s,this.array),r=At(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Qa&&(e.usage=this.usage),e}};var os=class extends Mt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var cs=class extends Mt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Tt=class extends Mt{constructor(e,t,n){super(new Float32Array(e),t,n)}};var hl=0,St=new ft,Xs=new Lt,Ln=new H,Bt=new sn,fi=new sn,ct=new H,Wt=class i extends En{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hl++}),this.uuid=Mi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Po(e)?cs:os)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return St.makeRotationFromQuaternion(e),this.applyMatrix4(St),this}rotateX(e){return St.makeRotationX(e),this.applyMatrix4(St),this}rotateY(e){return St.makeRotationY(e),this.applyMatrix4(St),this}rotateZ(e){return St.makeRotationZ(e),this.applyMatrix4(St),this}translate(e,t,n){return St.makeTranslation(e,t,n),this.applyMatrix4(St),this}scale(e,t,n){return St.makeScale(e,t,n),this.applyMatrix4(St),this}lookAt(e){return Xs.lookAt(e),Xs.updateMatrix(),this.applyMatrix4(Xs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ln).negate(),this.translate(Ln.x,Ln.y,Ln.z),this}setFromPoints(e){let t=[];for(let n=0,s=e.length;n<s;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Tt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new sn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Bt.setFromBufferAttribute(r),this.morphTargetsRelative?(ct.addVectors(this.boundingBox.min,Bt.min),this.boundingBox.expandByPoint(ct),ct.addVectors(this.boundingBox.max,Bt.max),this.boundingBox.expandByPoint(ct)):(this.boundingBox.expandByPoint(Bt.min),this.boundingBox.expandByPoint(Bt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Di);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new H,1/0);return}if(e){let n=this.boundingSphere.center;if(Bt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];fi.setFromBufferAttribute(a),this.morphTargetsRelative?(ct.addVectors(Bt.min,fi.min),Bt.expandByPoint(ct),ct.addVectors(Bt.max,fi.max),Bt.expandByPoint(ct)):(Bt.expandByPoint(fi.min),Bt.expandByPoint(fi.max))}Bt.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)ct.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(ct));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)ct.fromBufferAttribute(a,l),c&&(Ln.fromBufferAttribute(e,l),ct.add(Ln)),s=Math.max(s,n.distanceToSquared(ct))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.array,s=t.position.array,r=t.normal.array,o=t.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Mt(new Float32Array(4*a),4));let c=this.getAttribute("tangent").array,l=[],h=[];for(let R=0;R<a;R++)l[R]=new H,h[R]=new H;let d=new H,f=new H,E=new H,m=new Ze,D=new Ze,p=new Ze,u=new H,w=new H;function C(R,L,ee){d.fromArray(s,R*3),f.fromArray(s,L*3),E.fromArray(s,ee*3),m.fromArray(o,R*2),D.fromArray(o,L*2),p.fromArray(o,ee*2),f.sub(d),E.sub(d),D.sub(m),p.sub(m);let le=1/(D.x*p.y-p.x*D.y);isFinite(le)&&(u.copy(f).multiplyScalar(p.y).addScaledVector(E,-D.y).multiplyScalar(le),w.copy(E).multiplyScalar(D.x).addScaledVector(f,-p.x).multiplyScalar(le),l[R].add(u),l[L].add(u),l[ee].add(u),h[R].add(w),h[L].add(w),h[ee].add(w))}let S=this.groups;S.length===0&&(S=[{start:0,count:n.length}]);for(let R=0,L=S.length;R<L;++R){let ee=S[R],le=ee.start,b=ee.count;for(let G=le,V=le+b;G<V;G+=3)C(n[G+0],n[G+1],n[G+2])}let T=new H,y=new H,F=new H,$=new H;function M(R){F.fromArray(r,R*3),$.copy(F);let L=l[R];T.copy(L),T.sub(F.multiplyScalar(F.dot(L))).normalize(),y.crossVectors($,L);let le=y.dot(h[R])<0?-1:1;c[R*4]=T.x,c[R*4+1]=T.y,c[R*4+2]=T.z,c[R*4+3]=le}for(let R=0,L=S.length;R<L;++R){let ee=S[R],le=ee.start,b=ee.count;for(let G=le,V=le+b;G<V;G+=3)M(n[G+0]),M(n[G+1]),M(n[G+2])}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Mt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,E=n.count;f<E;f++)n.setXYZ(f,0,0,0);let s=new H,r=new H,o=new H,a=new H,c=new H,l=new H,h=new H,d=new H;if(e)for(let f=0,E=e.count;f<E;f+=3){let m=e.getX(f+0),D=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,D),o.fromBufferAttribute(t,p),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,m),c.fromBufferAttribute(n,D),l.fromBufferAttribute(n,p),a.add(h),c.add(h),l.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(D,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,E=t.count;f<E;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ct.fromBufferAttribute(e,t),ct.normalize(),e.setXYZ(t,ct.x,ct.y,ct.z)}toNonIndexed(){function e(a,c){let l=a.array,h=a.itemSize,d=a.normalized,f=new l.constructor(c.length*h),E=0,m=0;for(let D=0,p=c.length;D<p;D++){a.isInterleavedBufferAttribute?E=c[D]*a.data.stride+a.offset:E=c[D]*h;for(let u=0;u<h;u++)f[m++]=l[E++]}return new Mt(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,n);t.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,d=l.length;h<d;h++){let f=l[h],E=e(f,n);c.push(E)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let d=0,f=l.length;d<f;d++){let E=l[d];h.push(E.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let r=e.morphAttributes;for(let l in r){let h=[],d=r[l];for(let f=0,E=d.length;f<E;f++)h.push(d[f].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,h=o.length;l<h;l++){let d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ka=new ft,Cn=new dr,Qi=new Di,qa=new H,On=new H,Vn=new H,kn=new H,zs=new H,Hi=new H,Gi=new Ze,Ni=new Ze,Li=new Ze,ja=new H,$a=new H,eo=new H,Oi=new H,Vi=new H,vt=class extends Lt{constructor(e=new Wt,t=new si){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Hi.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],d=r[c];h!==0&&(zs.fromBufferAttribute(d,e),o?Hi.addScaledVector(zs,h):Hi.addScaledVector(zs.sub(t),h))}t.add(Hi)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Qi.copy(n.boundingSphere),Qi.applyMatrix4(r),Cn.copy(e.ray).recast(e.near),!(Qi.containsPoint(Cn.origin)===!1&&(Cn.intersectSphere(Qi,qa)===null||Cn.origin.distanceToSquared(qa)>(e.far-e.near)**2))&&(Ka.copy(r).invert(),Cn.copy(e.ray).applyMatrix4(Ka),!(n.boundingBox!==null&&Cn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Cn)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,E=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,D=f.length;m<D;m++){let p=f[m],u=o[p.materialIndex],w=Math.max(p.start,E.start),C=Math.min(a.count,Math.min(p.start+p.count,E.start+E.count));for(let S=w,T=C;S<T;S+=3){let y=a.getX(S),F=a.getX(S+1),$=a.getX(S+2);s=ki(this,u,e,n,l,h,d,y,F,$),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let m=Math.max(0,E.start),D=Math.min(a.count,E.start+E.count);for(let p=m,u=D;p<u;p+=3){let w=a.getX(p),C=a.getX(p+1),S=a.getX(p+2);s=ki(this,o,e,n,l,h,d,w,C,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,D=f.length;m<D;m++){let p=f[m],u=o[p.materialIndex],w=Math.max(p.start,E.start),C=Math.min(c.count,Math.min(p.start+p.count,E.start+E.count));for(let S=w,T=C;S<T;S+=3){let y=S,F=S+1,$=S+2;s=ki(this,u,e,n,l,h,d,y,F,$),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let m=Math.max(0,E.start),D=Math.min(c.count,E.start+E.count);for(let p=m,u=D;p<u;p+=3){let w=p,C=p+1,S=p+2;s=ki(this,o,e,n,l,h,d,w,C,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}};function ul(i,e,t,n,s,r,o,a){let c;if(e.side===Ct?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===pn,a),c===null)return null;Vi.copy(a),Vi.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Vi);return l<t.near||l>t.far?null:{distance:l,point:Vi.clone(),object:i}}function ki(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,On),i.getVertexPosition(c,Vn),i.getVertexPosition(l,kn);let h=ul(i,e,t,n,On,Vn,kn,Oi);if(h){s&&(Gi.fromBufferAttribute(s,a),Ni.fromBufferAttribute(s,c),Li.fromBufferAttribute(s,l),h.uv=Xn.getInterpolation(Oi,On,Vn,kn,Gi,Ni,Li,new Ze)),r&&(Gi.fromBufferAttribute(r,a),Ni.fromBufferAttribute(r,c),Li.fromBufferAttribute(r,l),h.uv1=Xn.getInterpolation(Oi,On,Vn,kn,Gi,Ni,Li,new Ze),h.uv2=h.uv1),o&&(ja.fromBufferAttribute(o,a),$a.fromBufferAttribute(o,c),eo.fromBufferAttribute(o,l),h.normal=Xn.getInterpolation(Oi,On,Vn,kn,ja,$a,eo,new H),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new H,materialIndex:0};Xn.getNormal(On,Vn,kn,d.normal),h.face=d}return h}var Ai=class i extends Wt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],d=[],f=0,E=0;m("z","y","x",-1,-1,n,t,e,o,r,0),m("z","y","x",1,-1,n,t,-e,o,r,1),m("x","z","y",1,1,e,n,t,s,o,2),m("x","z","y",1,-1,e,n,-t,s,o,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Tt(l,3)),this.setAttribute("normal",new Tt(h,3)),this.setAttribute("uv",new Tt(d,2));function m(D,p,u,w,C,S,T,y,F,$,M){let R=S/F,L=T/$,ee=S/2,le=T/2,b=y/2,G=F+1,V=$+1,J=0,W=0,k=new H;for(let te=0;te<V;te++){let se=te*L-le;for(let fe=0;fe<G;fe++){let O=fe*R-ee;k[D]=O*w,k[p]=se*C,k[u]=b,l.push(k.x,k.y,k.z),k[D]=0,k[p]=0,k[u]=y>0?1:-1,h.push(k.x,k.y,k.z),d.push(fe/F),d.push(1-te/$),J+=1}}for(let te=0;te<$;te++)for(let se=0;se<F;se++){let fe=f+se+G*te,O=f+se+G*(te+1),j=f+(se+1)+G*(te+1),pe=f+(se+1)+G*te;c.push(fe,O,pe),c.push(O,j,pe),W+=6}a.addGroup(E,W,M),E+=W,f+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function ri(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function gt(i){let e={};for(let t=0;t<i.length;t++){let n=ri(i[t]);for(let s in n)e[s]=n[s]}return e}function dl(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Ho(i){return i.getRenderTarget()===null?i.outputColorSpace:Xe.workingColorSpace}var fl={clone:ri,merge:gt},pl=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,El=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ot=class extends ii{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pl,this.fragmentShader=El,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ri(e.uniforms),this.uniformsGroups=dl(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ls=class extends Lt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ft,this.projectionMatrix=new ft,this.projectionMatrixInverse=new ft,this.coordinateSystem=en}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Dt=class extends ls{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=cr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Us*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return cr*2*Math.atan(Math.tan(Us*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Us*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Yn=-90,Wn=1,fr=class extends Lt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Dt(Yn,Wn,e,t);s.layers=this.layers,this.add(s);let r=new Dt(Yn,Wn,e,t);r.layers=this.layers,this.add(r);let o=new Dt(Yn,Wn,e,t);o.layers=this.layers,this.add(o);let a=new Dt(Yn,Wn,e,t);a.layers=this.layers,this.add(a);let c=new Dt(Yn,Wn,e,t);c.layers=this.layers,this.add(c);let l=new Dt(Yn,Wn,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===en)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===es)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),E=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let D=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=D,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(d,f,E),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},hs=class extends Nt{constructor(e,t,n,s,r,o,a,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:ei,super(e,t,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},pr=class extends nn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];t.encoding!==void 0&&(pi("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===Sn?it:Ut),this.texture=new hs(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:yt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ai(5,5,5),r=new Ot({name:"CubemapFromEquirect",uniforms:ri(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ct,blending:Gt});r.uniforms.tEquirect.value=t;let o=new vt(s,r),a=t.minFilter;return t.minFilter===gi&&(t.minFilter=yt),new fr(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},Js=new H,gl=new H,ml=new ke,$t=class{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Js.subVectors(n,t).cross(gl.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Js),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||ml.getNormalMatrix(e),s=this.coplanarPoint(Js).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Mn=new Di,Yi=new H,us=class{constructor(e=new $t,t=new $t,n=new $t,s=new $t,r=new $t,o=new $t){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=en){let n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],d=s[6],f=s[7],E=s[8],m=s[9],D=s[10],p=s[11],u=s[12],w=s[13],C=s[14],S=s[15];if(n[0].setComponents(c-r,f-l,p-E,S-u).normalize(),n[1].setComponents(c+r,f+l,p+E,S+u).normalize(),n[2].setComponents(c+o,f+h,p+m,S+w).normalize(),n[3].setComponents(c-o,f-h,p-m,S-w).normalize(),n[4].setComponents(c-a,f-d,p-D,S-C).normalize(),t===en)n[5].setComponents(c+a,f+d,p+D,S+C).normalize();else if(t===es)n[5].setComponents(a,d,D,C).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Mn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Mn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Mn)}intersectsSprite(e){return Mn.center.set(0,0,0),Mn.radius=.7071067811865476,Mn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Mn)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Yi.x=s.normal.x>0?e.max.x:e.min.x,Yi.y=s.normal.y>0?e.max.y:e.min.y,Yi.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Yi)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Go(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Dl(i,e){let t=e.isWebGL2,n=new WeakMap;function s(l,h){let d=l.array,f=l.usage,E=d.byteLength,m=i.createBuffer();i.bindBuffer(h,m),i.bufferData(h,d,f),l.onUploadCallback();let D;if(d instanceof Float32Array)D=i.FLOAT;else if(d instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(t)D=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else D=i.UNSIGNED_SHORT;else if(d instanceof Int16Array)D=i.SHORT;else if(d instanceof Uint32Array)D=i.UNSIGNED_INT;else if(d instanceof Int32Array)D=i.INT;else if(d instanceof Int8Array)D=i.BYTE;else if(d instanceof Uint8Array)D=i.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)D=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:m,type:D,bytesPerElement:d.BYTES_PER_ELEMENT,version:l.version,size:E}}function r(l,h,d){let f=h.array,E=h._updateRange,m=h.updateRanges;if(i.bindBuffer(d,l),E.count===-1&&m.length===0&&i.bufferSubData(d,0,f),m.length!==0){for(let D=0,p=m.length;D<p;D++){let u=m[D];t?i.bufferSubData(d,u.start*f.BYTES_PER_ELEMENT,f,u.start,u.count):i.bufferSubData(d,u.start*f.BYTES_PER_ELEMENT,f.subarray(u.start,u.start+u.count))}h.clearUpdateRanges()}E.count!==-1&&(t?i.bufferSubData(d,E.offset*f.BYTES_PER_ELEMENT,f,E.offset,E.count):i.bufferSubData(d,E.offset*f.BYTES_PER_ELEMENT,f.subarray(E.offset,E.offset+E.count)),E.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);let h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){let f=n.get(l);(!f||f.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);let d=n.get(l);if(d===void 0)n.set(l,s(l,h));else if(d.version<l.version){if(d.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(d.buffer,l,h),d.version=l.version}}return{get:o,remove:a,update:c}}var Er=class i extends Wt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,d=e/a,f=t/c,E=[],m=[],D=[],p=[];for(let u=0;u<h;u++){let w=u*f-o;for(let C=0;C<l;C++){let S=C*d-r;m.push(S,-w,0),D.push(0,0,1),p.push(C/a),p.push(1-u/c)}}for(let u=0;u<c;u++)for(let w=0;w<a;w++){let C=w+l*u,S=w+l*(u+1),T=w+1+l*(u+1),y=w+1+l*u;E.push(C,S,y),E.push(S,T,y)}this.setIndex(E),this.setAttribute("position",new Tt(m,3)),this.setAttribute("normal",new Tt(D,3)),this.setAttribute("uv",new Tt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Al=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,xl=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Cl=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ml=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Rl=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,wl=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Bl=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT )
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN )
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,vl=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Fl=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Sl=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,yl=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,bl=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ul=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Tl=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,_l=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Il=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Pl=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ql=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Hl=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gl=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Nl=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ll=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Ol=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Vl=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,kl=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Yl=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Wl=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Zl=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Xl=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,zl=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Jl="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kl=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,ql=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,jl=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif

#endif`,$l=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,eh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,th=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,nh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ih=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,sh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,rh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ah=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,oh=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,ch=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hh=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,uh=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,dh=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,fh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ph=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Eh=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gh=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,mh=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Dh=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ah=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,xh=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ch=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Mh=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Rh=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wh=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Bh=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,vh=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );

	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Fh=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Sh=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,yh=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bh=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Uh=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Th=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,_h=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Ih=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Ph=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Qh=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Hh=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Gh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Nh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lh=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Oh=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Vh=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,kh=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Yh=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Wh=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Zh=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Xh=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,zh=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Jh=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Kh=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,qh=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,jh=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,$h=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,eu=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,tu=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,nu=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,iu=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,su=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ru=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,au=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ou=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,cu=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,lu=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hu=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,uu=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,du=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,fu=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,pu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Eu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,mu=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Du=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Au=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cu=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ru=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wu=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Bu=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,vu=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Fu=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Su=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yu=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bu=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Uu=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Tu=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,_u=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Iu=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Pu=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qu=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Hu=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gu=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Nu=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Lu=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ou=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vu=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ku=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yu=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wu=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zu=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Xu=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zu=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ju=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ku=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,qu=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ne={alphahash_fragment:Al,alphahash_pars_fragment:xl,alphamap_fragment:Cl,alphamap_pars_fragment:Ml,alphatest_fragment:Rl,alphatest_pars_fragment:wl,aomap_fragment:Bl,aomap_pars_fragment:vl,batching_pars_vertex:Fl,batching_vertex:Sl,begin_vertex:yl,beginnormal_vertex:bl,bsdfs:Ul,iridescence_fragment:Tl,bumpmap_pars_fragment:_l,clipping_planes_fragment:Il,clipping_planes_pars_fragment:Pl,clipping_planes_pars_vertex:Ql,clipping_planes_vertex:Hl,color_fragment:Gl,color_pars_fragment:Nl,color_pars_vertex:Ll,color_vertex:Ol,common:Vl,cube_uv_reflection_fragment:kl,defaultnormal_vertex:Yl,displacementmap_pars_vertex:Wl,displacementmap_vertex:Zl,emissivemap_fragment:Xl,emissivemap_pars_fragment:zl,colorspace_fragment:Jl,colorspace_pars_fragment:Kl,envmap_fragment:ql,envmap_common_pars_fragment:jl,envmap_pars_fragment:$l,envmap_pars_vertex:eh,envmap_physical_pars_fragment:dh,envmap_vertex:th,fog_vertex:nh,fog_pars_vertex:ih,fog_fragment:sh,fog_pars_fragment:rh,gradientmap_pars_fragment:ah,lightmap_fragment:oh,lightmap_pars_fragment:ch,lights_lambert_fragment:lh,lights_lambert_pars_fragment:hh,lights_pars_begin:uh,lights_toon_fragment:fh,lights_toon_pars_fragment:ph,lights_phong_fragment:Eh,lights_phong_pars_fragment:gh,lights_physical_fragment:mh,lights_physical_pars_fragment:Dh,lights_fragment_begin:Ah,lights_fragment_maps:xh,lights_fragment_end:Ch,logdepthbuf_fragment:Mh,logdepthbuf_pars_fragment:Rh,logdepthbuf_pars_vertex:wh,logdepthbuf_vertex:Bh,map_fragment:vh,map_pars_fragment:Fh,map_particle_fragment:Sh,map_particle_pars_fragment:yh,metalnessmap_fragment:bh,metalnessmap_pars_fragment:Uh,morphcolor_vertex:Th,morphnormal_vertex:_h,morphtarget_pars_vertex:Ih,morphtarget_vertex:Ph,normal_fragment_begin:Qh,normal_fragment_maps:Hh,normal_pars_fragment:Gh,normal_pars_vertex:Nh,normal_vertex:Lh,normalmap_pars_fragment:Oh,clearcoat_normal_fragment_begin:Vh,clearcoat_normal_fragment_maps:kh,clearcoat_pars_fragment:Yh,iridescence_pars_fragment:Wh,opaque_fragment:Zh,packing:Xh,premultiplied_alpha_fragment:zh,project_vertex:Jh,dithering_fragment:Kh,dithering_pars_fragment:qh,roughnessmap_fragment:jh,roughnessmap_pars_fragment:$h,shadowmap_pars_fragment:eu,shadowmap_pars_vertex:tu,shadowmap_vertex:nu,shadowmask_pars_fragment:iu,skinbase_vertex:su,skinning_pars_vertex:ru,skinning_vertex:au,skinnormal_vertex:ou,specularmap_fragment:cu,specularmap_pars_fragment:lu,tonemapping_fragment:hu,tonemapping_pars_fragment:uu,transmission_fragment:du,transmission_pars_fragment:fu,uv_pars_fragment:pu,uv_pars_vertex:Eu,uv_vertex:gu,worldpos_vertex:mu,background_vert:Du,background_frag:Au,backgroundCube_vert:xu,backgroundCube_frag:Cu,cube_vert:Mu,cube_frag:Ru,depth_vert:wu,depth_frag:Bu,distanceRGBA_vert:vu,distanceRGBA_frag:Fu,equirect_vert:Su,equirect_frag:yu,linedashed_vert:bu,linedashed_frag:Uu,meshbasic_vert:Tu,meshbasic_frag:_u,meshlambert_vert:Iu,meshlambert_frag:Pu,meshmatcap_vert:Qu,meshmatcap_frag:Hu,meshnormal_vert:Gu,meshnormal_frag:Nu,meshphong_vert:Lu,meshphong_frag:Ou,meshphysical_vert:Vu,meshphysical_frag:ku,meshtoon_vert:Yu,meshtoon_frag:Wu,points_vert:Zu,points_frag:Xu,shadow_vert:zu,shadow_frag:Ju,sprite_vert:Ku,sprite_frag:qu},ce={common:{diffuse:{value:new We(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new Ze(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new We(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new We(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new We(16777215)},opacity:{value:1},center:{value:new Ze(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},Yt={basic:{uniforms:gt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Ne.meshbasic_vert,fragmentShader:Ne.meshbasic_frag},lambert:{uniforms:gt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new We(0)}}]),vertexShader:Ne.meshlambert_vert,fragmentShader:Ne.meshlambert_frag},phong:{uniforms:gt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new We(0)},specular:{value:new We(1118481)},shininess:{value:30}}]),vertexShader:Ne.meshphong_vert,fragmentShader:Ne.meshphong_frag},standard:{uniforms:gt([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new We(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag},toon:{uniforms:gt([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new We(0)}}]),vertexShader:Ne.meshtoon_vert,fragmentShader:Ne.meshtoon_frag},matcap:{uniforms:gt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Ne.meshmatcap_vert,fragmentShader:Ne.meshmatcap_frag},points:{uniforms:gt([ce.points,ce.fog]),vertexShader:Ne.points_vert,fragmentShader:Ne.points_frag},dashed:{uniforms:gt([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ne.linedashed_vert,fragmentShader:Ne.linedashed_frag},depth:{uniforms:gt([ce.common,ce.displacementmap]),vertexShader:Ne.depth_vert,fragmentShader:Ne.depth_frag},normal:{uniforms:gt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Ne.meshnormal_vert,fragmentShader:Ne.meshnormal_frag},sprite:{uniforms:gt([ce.sprite,ce.fog]),vertexShader:Ne.sprite_vert,fragmentShader:Ne.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ne.background_vert,fragmentShader:Ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ne.backgroundCube_vert,fragmentShader:Ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ne.cube_vert,fragmentShader:Ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ne.equirect_vert,fragmentShader:Ne.equirect_frag},distanceRGBA:{uniforms:gt([ce.common,ce.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ne.distanceRGBA_vert,fragmentShader:Ne.distanceRGBA_frag},shadow:{uniforms:gt([ce.lights,ce.fog,{color:{value:new We(0)},opacity:{value:1}}]),vertexShader:Ne.shadow_vert,fragmentShader:Ne.shadow_frag}};Yt.physical={uniforms:gt([Yt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new Ze(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new We(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new Ze},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new We(0)},specularColor:{value:new We(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new Ze},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag};var Wi={r:0,b:0,g:0};function ju(i,e,t,n,s,r,o){let a=new We(0),c=r===!0?0:1,l,h,d=null,f=0,E=null;function m(p,u){let w=!1,C=u.isScene===!0?u.background:null;C&&C.isTexture&&(C=(u.backgroundBlurriness>0?t:e).get(C)),C===null?D(a,c):C&&C.isColor&&(D(C,1),w=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||w)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),C&&(C.isCubeTexture||C.mapping===gs)?(h===void 0&&(h=new vt(new Ai(1,1,1),new Ot({name:"BackgroundCubeMaterial",uniforms:ri(Yt.backgroundCube.uniforms),vertexShader:Yt.backgroundCube.vertexShader,fragmentShader:Yt.backgroundCube.fragmentShader,side:Ct,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,y,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=C,h.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=Xe.getTransfer(C.colorSpace)!==qe,(d!==C||f!==C.version||E!==i.toneMapping)&&(h.material.needsUpdate=!0,d=C,f=C.version,E=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):C&&C.isTexture&&(l===void 0&&(l=new vt(new Er(2,2),new Ot({name:"BackgroundMaterial",uniforms:ri(Yt.background.uniforms),vertexShader:Yt.background.vertexShader,fragmentShader:Yt.background.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=C,l.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,l.material.toneMapped=Xe.getTransfer(C.colorSpace)!==qe,C.matrixAutoUpdate===!0&&C.updateMatrix(),l.material.uniforms.uvTransform.value.copy(C.matrix),(d!==C||f!==C.version||E!==i.toneMapping)&&(l.material.needsUpdate=!0,d=C,f=C.version,E=i.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null))}function D(p,u){p.getRGB(Wi,Ho(i)),n.buffers.color.setClear(Wi.r,Wi.g,Wi.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(p,u=1){a.set(p),c=u,D(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,D(a,c)},render:m}}function $u(i,e,t,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=p(null),l=c,h=!1;function d(b,G,V,J,W){let k=!1;if(o){let te=D(J,V,G);l!==te&&(l=te,E(l.object)),k=u(b,J,V,W),k&&w(b,J,V,W)}else{let te=G.wireframe===!0;(l.geometry!==J.id||l.program!==V.id||l.wireframe!==te)&&(l.geometry=J.id,l.program=V.id,l.wireframe=te,k=!0)}W!==null&&t.update(W,i.ELEMENT_ARRAY_BUFFER),(k||h)&&(h=!1,$(b,G,V,J),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function E(b){return n.isWebGL2?i.bindVertexArray(b):r.bindVertexArrayOES(b)}function m(b){return n.isWebGL2?i.deleteVertexArray(b):r.deleteVertexArrayOES(b)}function D(b,G,V){let J=V.wireframe===!0,W=a[b.id];W===void 0&&(W={},a[b.id]=W);let k=W[G.id];k===void 0&&(k={},W[G.id]=k);let te=k[J];return te===void 0&&(te=p(f()),k[J]=te),te}function p(b){let G=[],V=[],J=[];for(let W=0;W<s;W++)G[W]=0,V[W]=0,J[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:G,enabledAttributes:V,attributeDivisors:J,object:b,attributes:{},index:null}}function u(b,G,V,J){let W=l.attributes,k=G.attributes,te=0,se=V.getAttributes();for(let fe in se)if(se[fe].location>=0){let j=W[fe],pe=k[fe];if(pe===void 0&&(fe==="instanceMatrix"&&b.instanceMatrix&&(pe=b.instanceMatrix),fe==="instanceColor"&&b.instanceColor&&(pe=b.instanceColor)),j===void 0||j.attribute!==pe||pe&&j.data!==pe.data)return!0;te++}return l.attributesNum!==te||l.index!==J}function w(b,G,V,J){let W={},k=G.attributes,te=0,se=V.getAttributes();for(let fe in se)if(se[fe].location>=0){let j=k[fe];j===void 0&&(fe==="instanceMatrix"&&b.instanceMatrix&&(j=b.instanceMatrix),fe==="instanceColor"&&b.instanceColor&&(j=b.instanceColor));let pe={};pe.attribute=j,j&&j.data&&(pe.data=j.data),W[fe]=pe,te++}l.attributes=W,l.attributesNum=te,l.index=J}function C(){let b=l.newAttributes;for(let G=0,V=b.length;G<V;G++)b[G]=0}function S(b){T(b,0)}function T(b,G){let V=l.newAttributes,J=l.enabledAttributes,W=l.attributeDivisors;V[b]=1,J[b]===0&&(i.enableVertexAttribArray(b),J[b]=1),W[b]!==G&&((n.isWebGL2?i:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](b,G),W[b]=G)}function y(){let b=l.newAttributes,G=l.enabledAttributes;for(let V=0,J=G.length;V<J;V++)G[V]!==b[V]&&(i.disableVertexAttribArray(V),G[V]=0)}function F(b,G,V,J,W,k,te){te===!0?i.vertexAttribIPointer(b,G,V,W,k):i.vertexAttribPointer(b,G,V,J,W,k)}function $(b,G,V,J){if(n.isWebGL2===!1&&(b.isInstancedMesh||J.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;C();let W=J.attributes,k=V.getAttributes(),te=G.defaultAttributeValues;for(let se in k){let fe=k[se];if(fe.location>=0){let O=W[se];if(O===void 0&&(se==="instanceMatrix"&&b.instanceMatrix&&(O=b.instanceMatrix),se==="instanceColor"&&b.instanceColor&&(O=b.instanceColor)),O!==void 0){let j=O.normalized,pe=O.itemSize,Ce=t.get(O);if(Ce===void 0)continue;let xe=Ce.buffer,Ie=Ce.type,Pe=Ce.bytesPerElement,Fe=n.isWebGL2===!0&&(Ie===i.INT||Ie===i.UNSIGNED_INT||O.gpuType===vo);if(O.isInterleavedBufferAttribute){let P=O.data,B=P.stride,z=O.offset;if(P.isInstancedInterleavedBuffer){for(let Z=0;Z<fe.locationSize;Z++)T(fe.location+Z,P.meshPerAttribute);b.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=P.meshPerAttribute*P.count)}else for(let Z=0;Z<fe.locationSize;Z++)S(fe.location+Z);i.bindBuffer(i.ARRAY_BUFFER,xe);for(let Z=0;Z<fe.locationSize;Z++)F(fe.location+Z,pe/fe.locationSize,Ie,j,B*Pe,(z+pe/fe.locationSize*Z)*Pe,Fe)}else{if(O.isInstancedBufferAttribute){for(let P=0;P<fe.locationSize;P++)T(fe.location+P,O.meshPerAttribute);b.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let P=0;P<fe.locationSize;P++)S(fe.location+P);i.bindBuffer(i.ARRAY_BUFFER,xe);for(let P=0;P<fe.locationSize;P++)F(fe.location+P,pe/fe.locationSize,Ie,j,pe*Pe,pe/fe.locationSize*P*Pe,Fe)}}else if(te!==void 0){let j=te[se];if(j!==void 0)switch(j.length){case 2:i.vertexAttrib2fv(fe.location,j);break;case 3:i.vertexAttrib3fv(fe.location,j);break;case 4:i.vertexAttrib4fv(fe.location,j);break;default:i.vertexAttrib1fv(fe.location,j)}}}}y()}function M(){ee();for(let b in a){let G=a[b];for(let V in G){let J=G[V];for(let W in J)m(J[W].object),delete J[W];delete G[V]}delete a[b]}}function R(b){if(a[b.id]===void 0)return;let G=a[b.id];for(let V in G){let J=G[V];for(let W in J)m(J[W].object),delete J[W];delete G[V]}delete a[b.id]}function L(b){for(let G in a){let V=a[G];if(V[b.id]===void 0)continue;let J=V[b.id];for(let W in J)m(J[W].object),delete J[W];delete V[b.id]}}function ee(){le(),h=!0,l!==c&&(l=c,E(l.object))}function le(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:d,reset:ee,resetDefaultState:le,dispose:M,releaseStatesOfGeometry:R,releaseStatesOfProgram:L,initAttributes:C,enableAttribute:S,disableUnusedAttributes:y}}function ed(i,e,t,n){let s=n.isWebGL2,r;function o(h){r=h}function a(h,d){i.drawArrays(r,h,d),t.update(d,r,1)}function c(h,d,f){if(f===0)return;let E,m;if(s)E=i,m="drawArraysInstanced";else if(E=e.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",E===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}E[m](r,h,d,f),t.update(d,r,f)}function l(h,d,f){if(f===0)return;let E=e.get("WEBGL_multi_draw");if(E===null)for(let m=0;m<f;m++)this.render(h[m],d[m]);else{E.multiDrawArraysWEBGL(r,h,0,d,0,f);let m=0;for(let D=0;D<f;D++)m+=d[D];t.update(m,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function td(i,e,t){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){let F=e.get("EXT_texture_filter_anisotropic");n=i.getParameter(F.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(F){if(F==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";F="mediump"}return F==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",a=t.precision!==void 0?t.precision:"highp",c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);let l=o||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),D=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),u=i.getParameter(i.MAX_VARYING_VECTORS),w=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=f>0,S=o||e.has("OES_texture_float"),T=C&&S,y=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:f,maxTextureSize:E,maxCubemapSize:m,maxAttributes:D,maxVertexUniforms:p,maxVaryings:u,maxFragmentUniforms:w,vertexTextures:C,floatFragmentTextures:S,floatVertexTextures:T,maxSamples:y}}function nd(i){let e=this,t=null,n=0,s=!1,r=!1,o=new $t,a=new ke,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let E=d.length!==0||f||n!==0||s;return s=f,n=d.length,E},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){t=h(d,f,0)},this.setState=function(d,f,E){let m=d.clippingPlanes,D=d.clipIntersection,p=d.clipShadows,u=i.get(d);if(!s||m===null||m.length===0||r&&!p)r?h(null):l();else{let w=r?0:n,C=w*4,S=u.clippingState||null;c.value=S,S=h(m,f,C,E);for(let T=0;T!==C;++T)S[T]=t[T];u.clippingState=S,this.numIntersection=D?this.numPlanes:0,this.numPlanes+=w}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,f,E,m){let D=d!==null?d.length:0,p=null;if(D!==0){if(p=c.value,m!==!0||p===null){let u=E+D*4,w=f.matrixWorldInverse;a.getNormalMatrix(w),(p===null||p.length<u)&&(p=new Float32Array(u));for(let C=0,S=E;C!==D;++C,S+=4)o.copy(d[C]).applyMatrix4(w,a),o.normal.toArray(p,S),p[S+3]=o.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=D,e.numIntersection=0,p}}function id(i){let e=new WeakMap;function t(o,a){return a===ir?o.mapping=ei:a===sr&&(o.mapping=ti),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===ir||a===sr)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new pr(c.height/2);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",s),t(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var gr=class extends ls{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},zn=4,to=[.125,.215,.35,.446,.526,.582],Bn=20,Ks=new gr,no=new We,qs=null,js=0,$s=0,Rn=(1+Math.sqrt(5))/2,Zn=1/Rn,io=[new H(1,1,1),new H(-1,1,1),new H(1,1,-1),new H(-1,1,-1),new H(0,Rn,Zn),new H(0,Rn,-Zn),new H(Zn,0,Rn),new H(-Zn,0,Rn),new H(Rn,Zn,0),new H(-Rn,Zn,0)],ds=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){qs=this._renderer.getRenderTarget(),js=this._renderer.getActiveCubeFace(),$s=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ao(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ro(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(qs,js,$s),e.scissorTest=!1,Zi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ei||e.mapping===ti?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),qs=this._renderer.getRenderTarget(),js=this._renderer.getActiveCubeFace(),$s=this._renderer.getActiveMipmapLevel();let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:yt,minFilter:yt,generateMipmaps:!1,type:mi,format:Ht,colorSpace:tn,depthBuffer:!1},s=so(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=so(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=sd(r)),this._blurMaterial=rd(r,e,t)}return s}_compileMaterial(e){let t=new vt(this._lodPlanes[0],e);this._renderer.compile(t,Ks)}_sceneToCubeUV(e,t,n,s){let a=new Dt(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(no),h.toneMapping=dn,h.autoClear=!1;let E=new si({name:"PMREM.Background",side:Ct,depthWrite:!1,depthTest:!1}),m=new vt(new Ai,E),D=!1,p=e.background;p?p.isColor&&(E.color.copy(p),e.background=null,D=!0):(E.color.copy(no),D=!0);for(let u=0;u<6;u++){let w=u%3;w===0?(a.up.set(0,c[u],0),a.lookAt(l[u],0,0)):w===1?(a.up.set(0,0,c[u]),a.lookAt(0,l[u],0)):(a.up.set(0,c[u],0),a.lookAt(0,0,l[u]));let C=this._cubeSize;Zi(s,w*C,u>2?C:0,C,C),h.setRenderTarget(s),D&&h.render(m,a),h.render(e,a)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=p}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===ei||e.mapping===ti;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ao()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ro());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new vt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;Zi(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,Ks)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=io[(s-1)%io.length];this._blur(e,s-1,s,r,o)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new vt(this._lodPlanes[s],l),f=l.uniforms,E=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*E):2*Math.PI/(2*Bn-1),D=r/m,p=isFinite(r)?1+Math.floor(h*D):Bn;p>Bn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Bn}`);let u=[],w=0;for(let F=0;F<Bn;++F){let $=F/D,M=Math.exp(-$*$/2);u.push(M),F===0?w+=M:F<p&&(w+=2*M)}for(let F=0;F<u.length;F++)u[F]=u[F]/w;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=u,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:C}=this;f.dTheta.value=m,f.mipInt.value=C-n;let S=this._sizeLods[s],T=3*S*(s>C-zn?s-C+zn:0),y=4*(this._cubeSize-S);Zi(t,T,y,3*S,2*S),c.setRenderTarget(t),c.render(d,Ks)}};function sd(i){let e=[],t=[],n=[],s=i,r=i-zn+1+to.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let c=1/a;o>i-zn?c=to[o-i+zn-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,d=1+l,f=[h,h,d,h,d,d,h,h,d,d,h,d],E=6,m=6,D=3,p=2,u=1,w=new Float32Array(D*m*E),C=new Float32Array(p*m*E),S=new Float32Array(u*m*E);for(let y=0;y<E;y++){let F=y%3*2/3-1,$=y>2?0:-1,M=[F,$,0,F+2/3,$,0,F+2/3,$+1,0,F,$,0,F+2/3,$+1,0,F,$+1,0];w.set(M,D*m*y),C.set(f,p*m*y);let R=[y,y,y,y,y,y];S.set(R,u*m*y)}let T=new Wt;T.setAttribute("position",new Mt(w,D)),T.setAttribute("uv",new Mt(C,p)),T.setAttribute("faceIndex",new Mt(S,u)),e.push(T),s>zn&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function so(i,e,t){let n=new nn(i,e,t);return n.texture.mapping=gs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Zi(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function rd(i,e,t){let n=new Float32Array(Bn),s=new H(0,1,0);return new Ot({name:"SphericalGaussianBlur",defines:{n:Bn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Vr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Gt,depthTest:!1,depthWrite:!1})}function ro(){return new Ot({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Gt,depthTest:!1,depthWrite:!1})}function ao(){return new Ot({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Gt,depthTest:!1,depthWrite:!1})}function Vr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ad(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===ir||c===sr,h=c===ei||c===ti;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let d=e.get(a);return t===null&&(t=new ds(i)),d=l?t.fromEquirectangular(a,d):t.fromCubemap(a,d),e.set(a,d),d.texture}else{if(e.has(a))return e.get(a).texture;{let d=a.image;if(l&&d&&d.height>0||h&&d&&s(d)){t===null&&(t=new ds(i));let f=l?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function s(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function od(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){let s=t(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function cd(i,e,t,n){let s={},r=new WeakMap;function o(d){let f=d.target;f.index!==null&&e.remove(f.index);for(let m in f.attributes)e.remove(f.attributes[m]);for(let m in f.morphAttributes){let D=f.morphAttributes[m];for(let p=0,u=D.length;p<u;p++)e.remove(D[p])}f.removeEventListener("dispose",o),delete s[f.id];let E=r.get(f);E&&(e.remove(E),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(d,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function c(d){let f=d.attributes;for(let m in f)e.update(f[m],i.ARRAY_BUFFER);let E=d.morphAttributes;for(let m in E){let D=E[m];for(let p=0,u=D.length;p<u;p++)e.update(D[p],i.ARRAY_BUFFER)}}function l(d){let f=[],E=d.index,m=d.attributes.position,D=0;if(E!==null){let w=E.array;D=E.version;for(let C=0,S=w.length;C<S;C+=3){let T=w[C+0],y=w[C+1],F=w[C+2];f.push(T,y,y,F,F,T)}}else if(m!==void 0){let w=m.array;D=m.version;for(let C=0,S=w.length/3-1;C<S;C+=3){let T=C+0,y=C+1,F=C+2;f.push(T,y,y,F,F,T)}}else return;let p=new(Po(f)?cs:os)(f,1);p.version=D;let u=r.get(d);u&&e.remove(u),r.set(d,p)}function h(d){let f=r.get(d);if(f){let E=d.index;E!==null&&f.version<E.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:h}}function ld(i,e,t,n){let s=n.isWebGL2,r;function o(E){r=E}let a,c;function l(E){a=E.type,c=E.bytesPerElement}function h(E,m){i.drawElements(r,m,a,E*c),t.update(m,r,1)}function d(E,m,D){if(D===0)return;let p,u;if(s)p=i,u="drawElementsInstanced";else if(p=e.get("ANGLE_instanced_arrays"),u="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[u](r,m,a,E*c,D),t.update(m,r,D)}function f(E,m,D){if(D===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let u=0;u<D;u++)this.render(E[u]/c,m[u]);else{p.multiDrawElementsWEBGL(r,m,0,a,E,0,D);let u=0;for(let w=0;w<D;w++)u+=m[w];t.update(u,r,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=d,this.renderMultiDraw=f}function hd(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function ud(i,e){return i[0]-e[0]}function dd(i,e){return Math.abs(e[1])-Math.abs(i[1])}function fd(i,e,t){let n={},s=new Float32Array(8),r=new WeakMap,o=new lt,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,d){let f=l.morphTargetInfluences;if(e.isWebGL2===!0){let E=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,m=E!==void 0?E.length:0,D=r.get(h);if(D===void 0||D.count!==m){let b=function(){ee.dispose(),r.delete(h),h.removeEventListener("dispose",b)};D!==void 0&&D.texture.dispose();let w=h.morphAttributes.position!==void 0,C=h.morphAttributes.normal!==void 0,S=h.morphAttributes.color!==void 0,T=h.morphAttributes.position||[],y=h.morphAttributes.normal||[],F=h.morphAttributes.color||[],$=0;w===!0&&($=1),C===!0&&($=2),S===!0&&($=3);let M=h.attributes.position.count*$,R=1;M>e.maxTextureSize&&(R=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);let L=new Float32Array(M*R*4*m),ee=new ss(L,M,R,m);ee.type=un,ee.needsUpdate=!0;let le=$*4;for(let G=0;G<m;G++){let V=T[G],J=y[G],W=F[G],k=M*R*4*G;for(let te=0;te<V.count;te++){let se=te*le;w===!0&&(o.fromBufferAttribute(V,te),L[k+se+0]=o.x,L[k+se+1]=o.y,L[k+se+2]=o.z,L[k+se+3]=0),C===!0&&(o.fromBufferAttribute(J,te),L[k+se+4]=o.x,L[k+se+5]=o.y,L[k+se+6]=o.z,L[k+se+7]=0),S===!0&&(o.fromBufferAttribute(W,te),L[k+se+8]=o.x,L[k+se+9]=o.y,L[k+se+10]=o.z,L[k+se+11]=W.itemSize===4?o.w:1)}}D={count:m,texture:ee,size:new Ze(M,R)},r.set(h,D),h.addEventListener("dispose",b)}let p=0;for(let w=0;w<f.length;w++)p+=f[w];let u=h.morphTargetsRelative?1:1-p;d.getUniforms().setValue(i,"morphTargetBaseInfluence",u),d.getUniforms().setValue(i,"morphTargetInfluences",f),d.getUniforms().setValue(i,"morphTargetsTexture",D.texture,t),d.getUniforms().setValue(i,"morphTargetsTextureSize",D.size)}else{let E=f===void 0?0:f.length,m=n[h.id];if(m===void 0||m.length!==E){m=[];for(let C=0;C<E;C++)m[C]=[C,0];n[h.id]=m}for(let C=0;C<E;C++){let S=m[C];S[0]=C,S[1]=f[C]}m.sort(dd);for(let C=0;C<8;C++)C<E&&m[C][1]?(a[C][0]=m[C][0],a[C][1]=m[C][1]):(a[C][0]=Number.MAX_SAFE_INTEGER,a[C][1]=0);a.sort(ud);let D=h.morphAttributes.position,p=h.morphAttributes.normal,u=0;for(let C=0;C<8;C++){let S=a[C],T=S[0],y=S[1];T!==Number.MAX_SAFE_INTEGER&&y?(D&&h.getAttribute("morphTarget"+C)!==D[T]&&h.setAttribute("morphTarget"+C,D[T]),p&&h.getAttribute("morphNormal"+C)!==p[T]&&h.setAttribute("morphNormal"+C,p[T]),s[C]=y,u+=y):(D&&h.hasAttribute("morphTarget"+C)===!0&&h.deleteAttribute("morphTarget"+C),p&&h.hasAttribute("morphNormal"+C)===!0&&h.deleteAttribute("morphNormal"+C),s[C]=0)}let w=h.morphTargetsRelative?1:1-u;d.getUniforms().setValue(i,"morphTargetBaseInfluence",w),d.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function pd(i,e,t,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,d=e.get(c,h);if(s.get(d)!==l&&(e.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return d}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}var fs=class extends Nt{constructor(e,t,n,s,r,o,a,c,l,h){if(h=h!==void 0?h:Fn,h!==Fn&&h!==ni)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Fn&&(n=hn),n===void 0&&h===ni&&(n=vn),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:mt,this.minFilter=c!==void 0?c:mt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},No=new Nt,Lo=new fs(1,1);Lo.compareFunction=Io;var Oo=new ss,Vo=new ur,ko=new hs,oo=[],co=[],lo=new Float32Array(16),ho=new Float32Array(9),uo=new Float32Array(4);function oi(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=oo[s];if(r===void 0&&(r=new Float32Array(s),oo[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function st(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function rt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ds(i,e){let t=co[e];t===void 0&&(t=new Int32Array(e),co[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Ed(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function gd(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(st(t,e))return;i.uniform2fv(this.addr,e),rt(t,e)}}function md(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(st(t,e))return;i.uniform3fv(this.addr,e),rt(t,e)}}function Dd(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(st(t,e))return;i.uniform4fv(this.addr,e),rt(t,e)}}function Ad(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(st(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),rt(t,e)}else{if(st(t,n))return;uo.set(n),i.uniformMatrix2fv(this.addr,!1,uo),rt(t,n)}}function xd(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(st(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),rt(t,e)}else{if(st(t,n))return;ho.set(n),i.uniformMatrix3fv(this.addr,!1,ho),rt(t,n)}}function Cd(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(st(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),rt(t,e)}else{if(st(t,n))return;lo.set(n),i.uniformMatrix4fv(this.addr,!1,lo),rt(t,n)}}function Md(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Rd(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(st(t,e))return;i.uniform2iv(this.addr,e),rt(t,e)}}function wd(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(st(t,e))return;i.uniform3iv(this.addr,e),rt(t,e)}}function Bd(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(st(t,e))return;i.uniform4iv(this.addr,e),rt(t,e)}}function vd(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Fd(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(st(t,e))return;i.uniform2uiv(this.addr,e),rt(t,e)}}function Sd(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(st(t,e))return;i.uniform3uiv(this.addr,e),rt(t,e)}}function yd(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(st(t,e))return;i.uniform4uiv(this.addr,e),rt(t,e)}}function bd(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?Lo:No;t.setTexture2D(e||r,s)}function Ud(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Vo,s)}function Td(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||ko,s)}function _d(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Oo,s)}function Id(i){switch(i){case 5126:return Ed;case 35664:return gd;case 35665:return md;case 35666:return Dd;case 35674:return Ad;case 35675:return xd;case 35676:return Cd;case 5124:case 35670:return Md;case 35667:case 35671:return Rd;case 35668:case 35672:return wd;case 35669:case 35673:return Bd;case 5125:return vd;case 36294:return Fd;case 36295:return Sd;case 36296:return yd;case 35678:case 36198:case 36298:case 36306:case 35682:return bd;case 35679:case 36299:case 36307:return Ud;case 35680:case 36300:case 36308:case 36293:return Td;case 36289:case 36303:case 36311:case 36292:return _d}}function Pd(i,e){i.uniform1fv(this.addr,e)}function Qd(i,e){let t=oi(e,this.size,2);i.uniform2fv(this.addr,t)}function Hd(i,e){let t=oi(e,this.size,3);i.uniform3fv(this.addr,t)}function Gd(i,e){let t=oi(e,this.size,4);i.uniform4fv(this.addr,t)}function Nd(i,e){let t=oi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Ld(i,e){let t=oi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Od(i,e){let t=oi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Vd(i,e){i.uniform1iv(this.addr,e)}function kd(i,e){i.uniform2iv(this.addr,e)}function Yd(i,e){i.uniform3iv(this.addr,e)}function Wd(i,e){i.uniform4iv(this.addr,e)}function Zd(i,e){i.uniform1uiv(this.addr,e)}function Xd(i,e){i.uniform2uiv(this.addr,e)}function zd(i,e){i.uniform3uiv(this.addr,e)}function Jd(i,e){i.uniform4uiv(this.addr,e)}function Kd(i,e,t){let n=this.cache,s=e.length,r=Ds(t,s);st(n,r)||(i.uniform1iv(this.addr,r),rt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||No,r[o])}function qd(i,e,t){let n=this.cache,s=e.length,r=Ds(t,s);st(n,r)||(i.uniform1iv(this.addr,r),rt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Vo,r[o])}function jd(i,e,t){let n=this.cache,s=e.length,r=Ds(t,s);st(n,r)||(i.uniform1iv(this.addr,r),rt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||ko,r[o])}function $d(i,e,t){let n=this.cache,s=e.length,r=Ds(t,s);st(n,r)||(i.uniform1iv(this.addr,r),rt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Oo,r[o])}function ef(i){switch(i){case 5126:return Pd;case 35664:return Qd;case 35665:return Hd;case 35666:return Gd;case 35674:return Nd;case 35675:return Ld;case 35676:return Od;case 5124:case 35670:return Vd;case 35667:case 35671:return kd;case 35668:case 35672:return Yd;case 35669:case 35673:return Wd;case 5125:return Zd;case 36294:return Xd;case 36295:return zd;case 36296:return Jd;case 35678:case 36198:case 36298:case 36306:case 35682:return Kd;case 35679:case 36299:case 36307:return qd;case 35680:case 36300:case 36308:case 36293:return jd;case 36289:case 36303:case 36311:case 36292:return $d}}var mr=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Id(t.type)}},Dr=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ef(t.type)}},Ar=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},er=/(\w+)(\])?(\[|\.)?/g;function fo(i,e){i.seq.push(e),i.map[e.id]=e}function tf(i,e,t){let n=i.name,s=n.length;for(er.lastIndex=0;;){let r=er.exec(n),o=er.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){fo(t,l===void 0?new mr(a,i,e):new Dr(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new Ar(a),fo(t,d)),t=d}}}var $n=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);tf(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function po(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var nf=37297,sf=0;function rf(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function af(i){let e=Xe.getPrimaries(Xe.workingColorSpace),t=Xe.getPrimaries(i),n;switch(e===t?n="":e===$i&&t===ji?n="LinearDisplayP3ToLinearSRGB":e===ji&&t===$i&&(n="LinearSRGBToLinearDisplayP3"),i){case tn:case ms:return[n,"LinearTransferOETF"];case it:case Or:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Eo(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+rf(i.getShaderSource(e),o)}else return s}function of(i,e){let t=af(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function cf(i,e){let t;switch(e){case Bc:t="Linear";break;case vc:t="Reinhard";break;case Fc:t="OptimizedCineon";break;case Nr:t="ACESFilmic";break;case yc:t="AgX";break;case Sc:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function lf(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Jn).join(`
`)}function hf(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Jn).join(`
`)}function uf(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function df(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Jn(i){return i!==""}function go(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function mo(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var ff=/^[ \t]*#include +<([\w\d./]+)>/gm;function xr(i){return i.replace(ff,Ef)}var pf=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Ef(i,e){let t=Ne[e];if(t===void 0){let n=pf.get(e);if(n!==void 0)t=Ne[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return xr(t)}var gf=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Do(i){return i.replace(gf,mf)}function mf(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ao(i){let e="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Df(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ro?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===$o?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===jt&&(e="SHADOWMAP_TYPE_VSM"),e}function Af(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ei:case ti:e="ENVMAP_TYPE_CUBE";break;case gs:e="ENVMAP_TYPE_CUBE_UV";break}return e}function xf(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ti:e="ENVMAP_MODE_REFRACTION";break}return e}function Cf(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case wo:e="ENVMAP_BLENDING_MULTIPLY";break;case Rc:e="ENVMAP_BLENDING_MIX";break;case wc:e="ENVMAP_BLENDING_ADD";break}return e}function Mf(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Rf(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=Df(t),l=Af(t),h=xf(t),d=Cf(t),f=Mf(t),E=t.isWebGL2?"":lf(t),m=hf(t),D=uf(r),p=s.createProgram(),u,w,C=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,D].filter(Jn).join(`
`),u.length>0&&(u+=`
`),w=[E,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,D].filter(Jn).join(`
`),w.length>0&&(w+=`
`)):(u=[Ao(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,D,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Jn).join(`
`),w=[E,Ao(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,D,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==dn?"#define TONE_MAPPING":"",t.toneMapping!==dn?Ne.tonemapping_pars_fragment:"",t.toneMapping!==dn?cf("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ne.colorspace_pars_fragment,of("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Jn).join(`
`)),o=xr(o),o=go(o,t),o=mo(o,t),a=xr(a),a=go(a,t),a=mo(a,t),o=Do(o),a=Do(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(C=`#version 300 es
`,u=[m,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+u,w=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===Ha?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ha?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+w);let S=C+u+o,T=C+w+a,y=po(s,s.VERTEX_SHADER,S),F=po(s,s.FRAGMENT_SHADER,T);s.attachShader(p,y),s.attachShader(p,F),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function $(ee){if(i.debug.checkShaderErrors){let le=s.getProgramInfoLog(p).trim(),b=s.getShaderInfoLog(y).trim(),G=s.getShaderInfoLog(F).trim(),V=!0,J=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,y,F);else{let W=Eo(s,y,"vertex"),k=Eo(s,F,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+le+`
`+W+`
`+k)}else le!==""?console.warn("THREE.WebGLProgram: Program Info Log:",le):(b===""||G==="")&&(J=!1);J&&(ee.diagnostics={runnable:V,programLog:le,vertexShader:{log:b,prefix:u},fragmentShader:{log:G,prefix:w}})}s.deleteShader(y),s.deleteShader(F),M=new $n(s,p),R=df(s,p)}let M;this.getUniforms=function(){return M===void 0&&$(this),M};let R;this.getAttributes=function(){return R===void 0&&$(this),R};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(p,nf)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=sf++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=y,this.fragmentShader=F,this}var wf=0,Cr=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Mr(e),t.set(e,n)),n}},Mr=class{constructor(e){this.id=wf++,this.code=e,this.usedTimes=0}};function Bf(i,e,t,n,s,r,o){let a=new as,c=new Cr,l=[],h=s.isWebGL2,d=s.logarithmicDepthBuffer,f=s.vertexTextures,E=s.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function D(M){return M===0?"uv":`uv${M}`}function p(M,R,L,ee,le){let b=ee.fog,G=le.geometry,V=M.isMeshStandardMaterial?ee.environment:null,J=(M.isMeshStandardMaterial?t:e).get(M.envMap||V),W=J&&J.mapping===gs?J.image.height:null,k=m[M.type];M.precision!==null&&(E=s.getMaxPrecision(M.precision),E!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",E,"instead."));let te=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,se=te!==void 0?te.length:0,fe=0;G.morphAttributes.position!==void 0&&(fe=1),G.morphAttributes.normal!==void 0&&(fe=2),G.morphAttributes.color!==void 0&&(fe=3);let O,j,pe,Ce;if(k){let pt=Yt[k];O=pt.vertexShader,j=pt.fragmentShader}else O=M.vertexShader,j=M.fragmentShader,c.update(M),pe=c.getVertexShaderID(M),Ce=c.getFragmentShaderID(M);let xe=i.getRenderTarget(),Ie=le.isInstancedMesh===!0,Pe=le.isBatchedMesh===!0,Fe=!!M.map,P=!!M.matcap,B=!!J,z=!!M.aoMap,Z=!!M.lightMap,ne=!!M.bumpMap,ie=!!M.normalMap,Be=!!M.displacementMap,Me=!!M.emissiveMap,A=!!M.metalnessMap,g=!!M.roughnessMap,_=M.anisotropy>0,K=M.clearcoat>0,X=M.iridescence>0,Y=M.sheen>0,Ee=M.transmission>0,ae=_&&!!M.anisotropyMap,de=K&&!!M.clearcoatMap,Re=K&&!!M.clearcoatNormalMap,oe=K&&!!M.clearcoatRoughnessMap,q=X&&!!M.iridescenceMap,Ye=X&&!!M.iridescenceThicknessMap,Qe=Y&&!!M.sheenColorMap,ye=Y&&!!M.sheenRoughnessMap,Ae=!!M.specularMap,me=!!M.specularColorMap,Ue=!!M.specularIntensityMap,De=Ee&&!!M.transmissionMap,Oe=Ee&&!!M.thicknessMap,ve=!!M.gradientMap,re=!!M.alphaMap,v=M.alphaTest>0,ue=!!M.alphaHash,he=!!M.extensions,Te=!!G.attributes.uv1,Se=!!G.attributes.uv2,ze=!!G.attributes.uv3,Je=dn;return M.toneMapped&&(xe===null||xe.isXRRenderTarget===!0)&&(Je=i.toneMapping),{isWebGL2:h,shaderID:k,shaderType:M.type,shaderName:M.name,vertexShader:O,fragmentShader:j,defines:M.defines,customVertexShaderID:pe,customFragmentShaderID:Ce,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:E,batching:Pe,instancing:Ie,instancingColor:Ie&&le.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:xe===null?i.outputColorSpace:xe.isXRRenderTarget===!0?xe.texture.colorSpace:tn,map:Fe,matcap:P,envMap:B,envMapMode:B&&J.mapping,envMapCubeUVHeight:W,aoMap:z,lightMap:Z,bumpMap:ne,normalMap:ie,displacementMap:f&&Be,emissiveMap:Me,normalMapObjectSpace:ie&&M.normalMapType===Vc,normalMapTangentSpace:ie&&M.normalMapType===Oc,metalnessMap:A,roughnessMap:g,anisotropy:_,anisotropyMap:ae,clearcoat:K,clearcoatMap:de,clearcoatNormalMap:Re,clearcoatRoughnessMap:oe,iridescence:X,iridescenceMap:q,iridescenceThicknessMap:Ye,sheen:Y,sheenColorMap:Qe,sheenRoughnessMap:ye,specularMap:Ae,specularColorMap:me,specularIntensityMap:Ue,transmission:Ee,transmissionMap:De,thicknessMap:Oe,gradientMap:ve,opaque:M.transparent===!1&&M.blending===qn,alphaMap:re,alphaTest:v,alphaHash:ue,combine:M.combine,mapUv:Fe&&D(M.map.channel),aoMapUv:z&&D(M.aoMap.channel),lightMapUv:Z&&D(M.lightMap.channel),bumpMapUv:ne&&D(M.bumpMap.channel),normalMapUv:ie&&D(M.normalMap.channel),displacementMapUv:Be&&D(M.displacementMap.channel),emissiveMapUv:Me&&D(M.emissiveMap.channel),metalnessMapUv:A&&D(M.metalnessMap.channel),roughnessMapUv:g&&D(M.roughnessMap.channel),anisotropyMapUv:ae&&D(M.anisotropyMap.channel),clearcoatMapUv:de&&D(M.clearcoatMap.channel),clearcoatNormalMapUv:Re&&D(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:oe&&D(M.clearcoatRoughnessMap.channel),iridescenceMapUv:q&&D(M.iridescenceMap.channel),iridescenceThicknessMapUv:Ye&&D(M.iridescenceThicknessMap.channel),sheenColorMapUv:Qe&&D(M.sheenColorMap.channel),sheenRoughnessMapUv:ye&&D(M.sheenRoughnessMap.channel),specularMapUv:Ae&&D(M.specularMap.channel),specularColorMapUv:me&&D(M.specularColorMap.channel),specularIntensityMapUv:Ue&&D(M.specularIntensityMap.channel),transmissionMapUv:De&&D(M.transmissionMap.channel),thicknessMapUv:Oe&&D(M.thicknessMap.channel),alphaMapUv:re&&D(M.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(ie||_),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,vertexUv1s:Te,vertexUv2s:Se,vertexUv3s:ze,pointsUvs:le.isPoints===!0&&!!G.attributes.uv&&(Fe||re),fog:!!b,useFog:M.fog===!0,fogExp2:b&&b.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:le.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:fe,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Je,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Fe&&M.map.isVideoTexture===!0&&Xe.getTransfer(M.map.colorSpace)===qe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===bt,flipSided:M.side===Ct,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:he&&M.extensions.derivatives===!0,extensionFragDepth:he&&M.extensions.fragDepth===!0,extensionDrawBuffers:he&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:he&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:he&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function u(M){let R=[];if(M.shaderID?R.push(M.shaderID):(R.push(M.customVertexShaderID),R.push(M.customFragmentShaderID)),M.defines!==void 0)for(let L in M.defines)R.push(L),R.push(M.defines[L]);return M.isRawShaderMaterial===!1&&(w(R,M),C(R,M),R.push(i.outputColorSpace)),R.push(M.customProgramCacheKey),R.join()}function w(M,R){M.push(R.precision),M.push(R.outputColorSpace),M.push(R.envMapMode),M.push(R.envMapCubeUVHeight),M.push(R.mapUv),M.push(R.alphaMapUv),M.push(R.lightMapUv),M.push(R.aoMapUv),M.push(R.bumpMapUv),M.push(R.normalMapUv),M.push(R.displacementMapUv),M.push(R.emissiveMapUv),M.push(R.metalnessMapUv),M.push(R.roughnessMapUv),M.push(R.anisotropyMapUv),M.push(R.clearcoatMapUv),M.push(R.clearcoatNormalMapUv),M.push(R.clearcoatRoughnessMapUv),M.push(R.iridescenceMapUv),M.push(R.iridescenceThicknessMapUv),M.push(R.sheenColorMapUv),M.push(R.sheenRoughnessMapUv),M.push(R.specularMapUv),M.push(R.specularColorMapUv),M.push(R.specularIntensityMapUv),M.push(R.transmissionMapUv),M.push(R.thicknessMapUv),M.push(R.combine),M.push(R.fogExp2),M.push(R.sizeAttenuation),M.push(R.morphTargetsCount),M.push(R.morphAttributeCount),M.push(R.numDirLights),M.push(R.numPointLights),M.push(R.numSpotLights),M.push(R.numSpotLightMaps),M.push(R.numHemiLights),M.push(R.numRectAreaLights),M.push(R.numDirLightShadows),M.push(R.numPointLightShadows),M.push(R.numSpotLightShadows),M.push(R.numSpotLightShadowsWithMaps),M.push(R.numLightProbes),M.push(R.shadowMapType),M.push(R.toneMapping),M.push(R.numClippingPlanes),M.push(R.numClipIntersection),M.push(R.depthPacking)}function C(M,R){a.disableAll(),R.isWebGL2&&a.enable(0),R.supportsVertexTextures&&a.enable(1),R.instancing&&a.enable(2),R.instancingColor&&a.enable(3),R.matcap&&a.enable(4),R.envMap&&a.enable(5),R.normalMapObjectSpace&&a.enable(6),R.normalMapTangentSpace&&a.enable(7),R.clearcoat&&a.enable(8),R.iridescence&&a.enable(9),R.alphaTest&&a.enable(10),R.vertexColors&&a.enable(11),R.vertexAlphas&&a.enable(12),R.vertexUv1s&&a.enable(13),R.vertexUv2s&&a.enable(14),R.vertexUv3s&&a.enable(15),R.vertexTangents&&a.enable(16),R.anisotropy&&a.enable(17),R.alphaHash&&a.enable(18),R.batching&&a.enable(19),M.push(a.mask),a.disableAll(),R.fog&&a.enable(0),R.useFog&&a.enable(1),R.flatShading&&a.enable(2),R.logarithmicDepthBuffer&&a.enable(3),R.skinning&&a.enable(4),R.morphTargets&&a.enable(5),R.morphNormals&&a.enable(6),R.morphColors&&a.enable(7),R.premultipliedAlpha&&a.enable(8),R.shadowMapEnabled&&a.enable(9),R.useLegacyLights&&a.enable(10),R.doubleSided&&a.enable(11),R.flipSided&&a.enable(12),R.useDepthPacking&&a.enable(13),R.dithering&&a.enable(14),R.transmission&&a.enable(15),R.sheen&&a.enable(16),R.opaque&&a.enable(17),R.pointsUvs&&a.enable(18),R.decodeVideoTexture&&a.enable(19),M.push(a.mask)}function S(M){let R=m[M.type],L;if(R){let ee=Yt[R];L=fl.clone(ee.uniforms)}else L=M.uniforms;return L}function T(M,R){let L;for(let ee=0,le=l.length;ee<le;ee++){let b=l[ee];if(b.cacheKey===R){L=b,++L.usedTimes;break}}return L===void 0&&(L=new Rf(i,R,M,r),l.push(L)),L}function y(M){if(--M.usedTimes===0){let R=l.indexOf(M);l[R]=l[l.length-1],l.pop(),M.destroy()}}function F(M){c.remove(M)}function $(){c.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:S,acquireProgram:T,releaseProgram:y,releaseShaderCache:F,programs:l,dispose:$}}function vf(){let i=new WeakMap;function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function t(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:s}}function Ff(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function xo(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Co(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(d,f,E,m,D,p){let u=i[e];return u===void 0?(u={id:d.id,object:d,geometry:f,material:E,groupOrder:m,renderOrder:d.renderOrder,z:D,group:p},i[e]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=E,u.groupOrder=m,u.renderOrder=d.renderOrder,u.z=D,u.group=p),e++,u}function a(d,f,E,m,D,p){let u=o(d,f,E,m,D,p);E.transmission>0?n.push(u):E.transparent===!0?s.push(u):t.push(u)}function c(d,f,E,m,D,p){let u=o(d,f,E,m,D,p);E.transmission>0?n.unshift(u):E.transparent===!0?s.unshift(u):t.unshift(u)}function l(d,f){t.length>1&&t.sort(d||Ff),n.length>1&&n.sort(f||xo),s.length>1&&s.sort(f||xo)}function h(){for(let d=e,f=i.length;d<f;d++){let E=i[d];if(E.id===null)break;E.id=null,E.object=null,E.geometry=null,E.material=null,E.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function Sf(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Co,i.set(n,[o])):s>=r.length?(o=new Co,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function yf(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new H,color:new We};break;case"SpotLight":t={position:new H,direction:new H,color:new We,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new We,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new We,groundColor:new We};break;case"RectAreaLight":t={color:new We,position:new H,halfWidth:new H,halfHeight:new H};break}return i[e.id]=t,t}}}function bf(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Uf=0;function Tf(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function _f(i,e){let t=new yf,n=bf(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new H);let r=new H,o=new ft,a=new ft;function c(h,d){let f=0,E=0,m=0;for(let ee=0;ee<9;ee++)s.probe[ee].set(0,0,0);let D=0,p=0,u=0,w=0,C=0,S=0,T=0,y=0,F=0,$=0,M=0;h.sort(Tf);let R=d===!0?Math.PI:1;for(let ee=0,le=h.length;ee<le;ee++){let b=h[ee],G=b.color,V=b.intensity,J=b.distance,W=b.shadow&&b.shadow.map?b.shadow.map.texture:null;if(b.isAmbientLight)f+=G.r*V*R,E+=G.g*V*R,m+=G.b*V*R;else if(b.isLightProbe){for(let k=0;k<9;k++)s.probe[k].addScaledVector(b.sh.coefficients[k],V);M++}else if(b.isDirectionalLight){let k=t.get(b);if(k.color.copy(b.color).multiplyScalar(b.intensity*R),b.castShadow){let te=b.shadow,se=n.get(b);se.shadowBias=te.bias,se.shadowNormalBias=te.normalBias,se.shadowRadius=te.radius,se.shadowMapSize=te.mapSize,s.directionalShadow[D]=se,s.directionalShadowMap[D]=W,s.directionalShadowMatrix[D]=b.shadow.matrix,S++}s.directional[D]=k,D++}else if(b.isSpotLight){let k=t.get(b);k.position.setFromMatrixPosition(b.matrixWorld),k.color.copy(G).multiplyScalar(V*R),k.distance=J,k.coneCos=Math.cos(b.angle),k.penumbraCos=Math.cos(b.angle*(1-b.penumbra)),k.decay=b.decay,s.spot[u]=k;let te=b.shadow;if(b.map&&(s.spotLightMap[F]=b.map,F++,te.updateMatrices(b),b.castShadow&&$++),s.spotLightMatrix[u]=te.matrix,b.castShadow){let se=n.get(b);se.shadowBias=te.bias,se.shadowNormalBias=te.normalBias,se.shadowRadius=te.radius,se.shadowMapSize=te.mapSize,s.spotShadow[u]=se,s.spotShadowMap[u]=W,y++}u++}else if(b.isRectAreaLight){let k=t.get(b);k.color.copy(G).multiplyScalar(V),k.halfWidth.set(b.width*.5,0,0),k.halfHeight.set(0,b.height*.5,0),s.rectArea[w]=k,w++}else if(b.isPointLight){let k=t.get(b);if(k.color.copy(b.color).multiplyScalar(b.intensity*R),k.distance=b.distance,k.decay=b.decay,b.castShadow){let te=b.shadow,se=n.get(b);se.shadowBias=te.bias,se.shadowNormalBias=te.normalBias,se.shadowRadius=te.radius,se.shadowMapSize=te.mapSize,se.shadowCameraNear=te.camera.near,se.shadowCameraFar=te.camera.far,s.pointShadow[p]=se,s.pointShadowMap[p]=W,s.pointShadowMatrix[p]=b.shadow.matrix,T++}s.point[p]=k,p++}else if(b.isHemisphereLight){let k=t.get(b);k.skyColor.copy(b.color).multiplyScalar(V*R),k.groundColor.copy(b.groundColor).multiplyScalar(V*R),s.hemi[C]=k,C++}}w>0&&(e.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ce.LTC_FLOAT_1,s.rectAreaLTC2=ce.LTC_FLOAT_2):(s.rectAreaLTC1=ce.LTC_HALF_1,s.rectAreaLTC2=ce.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ce.LTC_FLOAT_1,s.rectAreaLTC2=ce.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=ce.LTC_HALF_1,s.rectAreaLTC2=ce.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=E,s.ambient[2]=m;let L=s.hash;(L.directionalLength!==D||L.pointLength!==p||L.spotLength!==u||L.rectAreaLength!==w||L.hemiLength!==C||L.numDirectionalShadows!==S||L.numPointShadows!==T||L.numSpotShadows!==y||L.numSpotMaps!==F||L.numLightProbes!==M)&&(s.directional.length=D,s.spot.length=u,s.rectArea.length=w,s.point.length=p,s.hemi.length=C,s.directionalShadow.length=S,s.directionalShadowMap.length=S,s.pointShadow.length=T,s.pointShadowMap.length=T,s.spotShadow.length=y,s.spotShadowMap.length=y,s.directionalShadowMatrix.length=S,s.pointShadowMatrix.length=T,s.spotLightMatrix.length=y+F-$,s.spotLightMap.length=F,s.numSpotLightShadowsWithMaps=$,s.numLightProbes=M,L.directionalLength=D,L.pointLength=p,L.spotLength=u,L.rectAreaLength=w,L.hemiLength=C,L.numDirectionalShadows=S,L.numPointShadows=T,L.numSpotShadows=y,L.numSpotMaps=F,L.numLightProbes=M,s.version=Uf++)}function l(h,d){let f=0,E=0,m=0,D=0,p=0,u=d.matrixWorldInverse;for(let w=0,C=h.length;w<C;w++){let S=h[w];if(S.isDirectionalLight){let T=s.directional[f];T.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(u),f++}else if(S.isSpotLight){let T=s.spot[m];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(u),T.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(u),m++}else if(S.isRectAreaLight){let T=s.rectArea[D];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(u),a.identity(),o.copy(S.matrixWorld),o.premultiply(u),a.extractRotation(o),T.halfWidth.set(S.width*.5,0,0),T.halfHeight.set(0,S.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),D++}else if(S.isPointLight){let T=s.point[E];T.position.setFromMatrixPosition(S.matrixWorld),T.position.applyMatrix4(u),E++}else if(S.isHemisphereLight){let T=s.hemi[p];T.direction.setFromMatrixPosition(S.matrixWorld),T.direction.transformDirection(u),p++}}}return{setup:c,setupView:l,state:s}}function Mo(i,e){let t=new _f(i,e),n=[],s=[];function r(){n.length=0,s.length=0}function o(d){n.push(d)}function a(d){s.push(d)}function c(d){t.setup(n,d)}function l(d){t.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:t},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function If(i,e){let t=new WeakMap;function n(r,o=0){let a=t.get(r),c;return a===void 0?(c=new Mo(i,e),t.set(r,[c])):o>=a.length?(c=new Mo(i,e),a.push(c)):c=a[o],c}function s(){t=new WeakMap}return{get:n,dispose:s}}var Rr=class extends ii{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Nc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},wr=class extends ii{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},Pf=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Qf=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Hf(i,e,t){let n=new us,s=new Ze,r=new Ze,o=new lt,a=new Rr({depthPacking:Lc}),c=new wr,l={},h=t.maxTextureSize,d={[pn]:Ct,[Ct]:pn,[bt]:bt},f=new Ot({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ze},radius:{value:4}},vertexShader:Pf,fragmentShader:Qf}),E=f.clone();E.defines.HORIZONTAL_PASS=1;let m=new Wt;m.setAttribute("position",new Mt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let D=new vt(m,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ro;let u=this.type;this.render=function(y,F,$){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||y.length===0)return;let M=i.getRenderTarget(),R=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),ee=i.state;ee.setBlending(Gt),ee.buffers.color.setClear(1,1,1,1),ee.buffers.depth.setTest(!0),ee.setScissorTest(!1);let le=u!==jt&&this.type===jt,b=u===jt&&this.type!==jt;for(let G=0,V=y.length;G<V;G++){let J=y[G],W=J.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);let k=W.getFrameExtents();if(s.multiply(k),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/k.x),s.x=r.x*k.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/k.y),s.y=r.y*k.y,W.mapSize.y=r.y)),W.map===null||le===!0||b===!0){let se=this.type!==jt?{minFilter:mt,magFilter:mt}:{};W.map!==null&&W.map.dispose(),W.map=new nn(s.x,s.y,se),W.map.texture.name=J.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();let te=W.getViewportCount();for(let se=0;se<te;se++){let fe=W.getViewport(se);o.set(r.x*fe.x,r.y*fe.y,r.x*fe.z,r.y*fe.w),ee.viewport(o),W.updateMatrices(J,se),n=W.getFrustum(),S(F,$,W.camera,J,this.type)}W.isPointLightShadow!==!0&&this.type===jt&&w(W,$),W.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(M,R,L)};function w(y,F){let $=e.update(D);f.defines.VSM_SAMPLES!==y.blurSamples&&(f.defines.VSM_SAMPLES=y.blurSamples,E.defines.VSM_SAMPLES=y.blurSamples,f.needsUpdate=!0,E.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new nn(s.x,s.y)),f.uniforms.shadow_pass.value=y.map.texture,f.uniforms.resolution.value=y.mapSize,f.uniforms.radius.value=y.radius,i.setRenderTarget(y.mapPass),i.clear(),i.renderBufferDirect(F,null,$,f,D,null),E.uniforms.shadow_pass.value=y.mapPass.texture,E.uniforms.resolution.value=y.mapSize,E.uniforms.radius.value=y.radius,i.setRenderTarget(y.map),i.clear(),i.renderBufferDirect(F,null,$,E,D,null)}function C(y,F,$,M){let R=null,L=$.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(L!==void 0)R=L;else if(R=$.isPointLight===!0?c:a,i.localClippingEnabled&&F.clipShadows===!0&&Array.isArray(F.clippingPlanes)&&F.clippingPlanes.length!==0||F.displacementMap&&F.displacementScale!==0||F.alphaMap&&F.alphaTest>0||F.map&&F.alphaTest>0){let ee=R.uuid,le=F.uuid,b=l[ee];b===void 0&&(b={},l[ee]=b);let G=b[le];G===void 0&&(G=R.clone(),b[le]=G,F.addEventListener("dispose",T)),R=G}if(R.visible=F.visible,R.wireframe=F.wireframe,M===jt?R.side=F.shadowSide!==null?F.shadowSide:F.side:R.side=F.shadowSide!==null?F.shadowSide:d[F.side],R.alphaMap=F.alphaMap,R.alphaTest=F.alphaTest,R.map=F.map,R.clipShadows=F.clipShadows,R.clippingPlanes=F.clippingPlanes,R.clipIntersection=F.clipIntersection,R.displacementMap=F.displacementMap,R.displacementScale=F.displacementScale,R.displacementBias=F.displacementBias,R.wireframeLinewidth=F.wireframeLinewidth,R.linewidth=F.linewidth,$.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let ee=i.properties.get(R);ee.light=$}return R}function S(y,F,$,M,R){if(y.visible===!1)return;if(y.layers.test(F.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&R===jt)&&(!y.frustumCulled||n.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,y.matrixWorld);let le=e.update(y),b=y.material;if(Array.isArray(b)){let G=le.groups;for(let V=0,J=G.length;V<J;V++){let W=G[V],k=b[W.materialIndex];if(k&&k.visible){let te=C(y,k,M,R);y.onBeforeShadow(i,y,F,$,le,te,W),i.renderBufferDirect($,null,le,te,y,W),y.onAfterShadow(i,y,F,$,le,te,W)}}}else if(b.visible){let G=C(y,b,M,R);y.onBeforeShadow(i,y,F,$,le,G,null),i.renderBufferDirect($,null,le,G,y,null),y.onAfterShadow(i,y,F,$,le,G,null)}}let ee=y.children;for(let le=0,b=ee.length;le<b;le++)S(ee[le],F,$,M,R)}function T(y){y.target.removeEventListener("dispose",T);for(let $ in l){let M=l[$],R=y.target.uuid;R in M&&(M[R].dispose(),delete M[R])}}}function Gf(i,e,t){let n=t.isWebGL2;function s(){let v=!1,ue=new lt,he=null,Te=new lt(0,0,0,0);return{setMask:function(Se){he!==Se&&!v&&(i.colorMask(Se,Se,Se,Se),he=Se)},setLocked:function(Se){v=Se},setClear:function(Se,ze,Je,at,pt){pt===!0&&(Se*=at,ze*=at,Je*=at),ue.set(Se,ze,Je,at),Te.equals(ue)===!1&&(i.clearColor(Se,ze,Je,at),Te.copy(ue))},reset:function(){v=!1,he=null,Te.set(-1,0,0,0)}}}function r(){let v=!1,ue=null,he=null,Te=null;return{setTest:function(Se){Se?Pe(i.DEPTH_TEST):Fe(i.DEPTH_TEST)},setMask:function(Se){ue!==Se&&!v&&(i.depthMask(Se),ue=Se)},setFunc:function(Se){if(he!==Se){switch(Se){case gc:i.depthFunc(i.NEVER);break;case mc:i.depthFunc(i.ALWAYS);break;case Dc:i.depthFunc(i.LESS);break;case zi:i.depthFunc(i.LEQUAL);break;case Ac:i.depthFunc(i.EQUAL);break;case xc:i.depthFunc(i.GEQUAL);break;case Cc:i.depthFunc(i.GREATER);break;case Mc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}he=Se}},setLocked:function(Se){v=Se},setClear:function(Se){Te!==Se&&(i.clearDepth(Se),Te=Se)},reset:function(){v=!1,ue=null,he=null,Te=null}}}function o(){let v=!1,ue=null,he=null,Te=null,Se=null,ze=null,Je=null,at=null,pt=null;return{setTest:function(Ke){v||(Ke?Pe(i.STENCIL_TEST):Fe(i.STENCIL_TEST))},setMask:function(Ke){ue!==Ke&&!v&&(i.stencilMask(Ke),ue=Ke)},setFunc:function(Ke,Et,kt){(he!==Ke||Te!==Et||Se!==kt)&&(i.stencilFunc(Ke,Et,kt),he=Ke,Te=Et,Se=kt)},setOp:function(Ke,Et,kt){(ze!==Ke||Je!==Et||at!==kt)&&(i.stencilOp(Ke,Et,kt),ze=Ke,Je=Et,at=kt)},setLocked:function(Ke){v=Ke},setClear:function(Ke){pt!==Ke&&(i.clearStencil(Ke),pt=Ke)},reset:function(){v=!1,ue=null,he=null,Te=null,Se=null,ze=null,Je=null,at=null,pt=null}}}let a=new s,c=new r,l=new o,h=new WeakMap,d=new WeakMap,f={},E={},m=new WeakMap,D=[],p=null,u=!1,w=null,C=null,S=null,T=null,y=null,F=null,$=null,M=new We(0,0,0),R=0,L=!1,ee=null,le=null,b=null,G=null,V=null,J=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),W=!1,k=0,te=i.getParameter(i.VERSION);te.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec(te)[1]),W=k>=1):te.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),W=k>=2);let se=null,fe={},O=i.getParameter(i.SCISSOR_BOX),j=i.getParameter(i.VIEWPORT),pe=new lt().fromArray(O),Ce=new lt().fromArray(j);function xe(v,ue,he,Te){let Se=new Uint8Array(4),ze=i.createTexture();i.bindTexture(v,ze),i.texParameteri(v,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(v,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Je=0;Je<he;Je++)n&&(v===i.TEXTURE_3D||v===i.TEXTURE_2D_ARRAY)?i.texImage3D(ue,0,i.RGBA,1,1,Te,0,i.RGBA,i.UNSIGNED_BYTE,Se):i.texImage2D(ue+Je,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Se);return ze}let Ie={};Ie[i.TEXTURE_2D]=xe(i.TEXTURE_2D,i.TEXTURE_2D,1),Ie[i.TEXTURE_CUBE_MAP]=xe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Ie[i.TEXTURE_2D_ARRAY]=xe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ie[i.TEXTURE_3D]=xe(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Pe(i.DEPTH_TEST),c.setFunc(zi),Me(!1),A(ea),Pe(i.CULL_FACE),ie(Gt);function Pe(v){f[v]!==!0&&(i.enable(v),f[v]=!0)}function Fe(v){f[v]!==!1&&(i.disable(v),f[v]=!1)}function P(v,ue){return E[v]!==ue?(i.bindFramebuffer(v,ue),E[v]=ue,n&&(v===i.DRAW_FRAMEBUFFER&&(E[i.FRAMEBUFFER]=ue),v===i.FRAMEBUFFER&&(E[i.DRAW_FRAMEBUFFER]=ue)),!0):!1}function B(v,ue){let he=D,Te=!1;if(v)if(he=m.get(ue),he===void 0&&(he=[],m.set(ue,he)),v.isWebGLMultipleRenderTargets){let Se=v.texture;if(he.length!==Se.length||he[0]!==i.COLOR_ATTACHMENT0){for(let ze=0,Je=Se.length;ze<Je;ze++)he[ze]=i.COLOR_ATTACHMENT0+ze;he.length=Se.length,Te=!0}}else he[0]!==i.COLOR_ATTACHMENT0&&(he[0]=i.COLOR_ATTACHMENT0,Te=!0);else he[0]!==i.BACK&&(he[0]=i.BACK,Te=!0);Te&&(t.isWebGL2?i.drawBuffers(he):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(he))}function z(v){return p!==v?(i.useProgram(v),p=v,!0):!1}let Z={[wn]:i.FUNC_ADD,[tc]:i.FUNC_SUBTRACT,[nc]:i.FUNC_REVERSE_SUBTRACT};if(n)Z[sa]=i.MIN,Z[ra]=i.MAX;else{let v=e.get("EXT_blend_minmax");v!==null&&(Z[sa]=v.MIN_EXT,Z[ra]=v.MAX_EXT)}let ne={[ic]:i.ZERO,[sc]:i.ONE,[rc]:i.SRC_COLOR,[tr]:i.SRC_ALPHA,[uc]:i.SRC_ALPHA_SATURATE,[lc]:i.DST_COLOR,[oc]:i.DST_ALPHA,[ac]:i.ONE_MINUS_SRC_COLOR,[nr]:i.ONE_MINUS_SRC_ALPHA,[hc]:i.ONE_MINUS_DST_COLOR,[cc]:i.ONE_MINUS_DST_ALPHA,[dc]:i.CONSTANT_COLOR,[fc]:i.ONE_MINUS_CONSTANT_COLOR,[pc]:i.CONSTANT_ALPHA,[Ec]:i.ONE_MINUS_CONSTANT_ALPHA};function ie(v,ue,he,Te,Se,ze,Je,at,pt,Ke){if(v===Gt){u===!0&&(Fe(i.BLEND),u=!1);return}if(u===!1&&(Pe(i.BLEND),u=!0),v!==ec){if(v!==w||Ke!==L){if((C!==wn||y!==wn)&&(i.blendEquation(i.FUNC_ADD),C=wn,y=wn),Ke)switch(v){case qn:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ta:i.blendFunc(i.ONE,i.ONE);break;case na:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ia:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",v);break}else switch(v){case qn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ta:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case na:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ia:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",v);break}S=null,T=null,F=null,$=null,M.set(0,0,0),R=0,w=v,L=Ke}return}Se=Se||ue,ze=ze||he,Je=Je||Te,(ue!==C||Se!==y)&&(i.blendEquationSeparate(Z[ue],Z[Se]),C=ue,y=Se),(he!==S||Te!==T||ze!==F||Je!==$)&&(i.blendFuncSeparate(ne[he],ne[Te],ne[ze],ne[Je]),S=he,T=Te,F=ze,$=Je),(at.equals(M)===!1||pt!==R)&&(i.blendColor(at.r,at.g,at.b,pt),M.copy(at),R=pt),w=v,L=!1}function Be(v,ue){v.side===bt?Fe(i.CULL_FACE):Pe(i.CULL_FACE);let he=v.side===Ct;ue&&(he=!he),Me(he),v.blending===qn&&v.transparent===!1?ie(Gt):ie(v.blending,v.blendEquation,v.blendSrc,v.blendDst,v.blendEquationAlpha,v.blendSrcAlpha,v.blendDstAlpha,v.blendColor,v.blendAlpha,v.premultipliedAlpha),c.setFunc(v.depthFunc),c.setTest(v.depthTest),c.setMask(v.depthWrite),a.setMask(v.colorWrite);let Te=v.stencilWrite;l.setTest(Te),Te&&(l.setMask(v.stencilWriteMask),l.setFunc(v.stencilFunc,v.stencilRef,v.stencilFuncMask),l.setOp(v.stencilFail,v.stencilZFail,v.stencilZPass)),_(v.polygonOffset,v.polygonOffsetFactor,v.polygonOffsetUnits),v.alphaToCoverage===!0?Pe(i.SAMPLE_ALPHA_TO_COVERAGE):Fe(i.SAMPLE_ALPHA_TO_COVERAGE)}function Me(v){ee!==v&&(v?i.frontFace(i.CW):i.frontFace(i.CCW),ee=v)}function A(v){v!==qo?(Pe(i.CULL_FACE),v!==le&&(v===ea?i.cullFace(i.BACK):v===jo?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Fe(i.CULL_FACE),le=v}function g(v){v!==b&&(W&&i.lineWidth(v),b=v)}function _(v,ue,he){v?(Pe(i.POLYGON_OFFSET_FILL),(G!==ue||V!==he)&&(i.polygonOffset(ue,he),G=ue,V=he)):Fe(i.POLYGON_OFFSET_FILL)}function K(v){v?Pe(i.SCISSOR_TEST):Fe(i.SCISSOR_TEST)}function X(v){v===void 0&&(v=i.TEXTURE0+J-1),se!==v&&(i.activeTexture(v),se=v)}function Y(v,ue,he){he===void 0&&(se===null?he=i.TEXTURE0+J-1:he=se);let Te=fe[he];Te===void 0&&(Te={type:void 0,texture:void 0},fe[he]=Te),(Te.type!==v||Te.texture!==ue)&&(se!==he&&(i.activeTexture(he),se=he),i.bindTexture(v,ue||Ie[v]),Te.type=v,Te.texture=ue)}function Ee(){let v=fe[se];v!==void 0&&v.type!==void 0&&(i.bindTexture(v.type,null),v.type=void 0,v.texture=void 0)}function ae(){try{i.compressedTexImage2D.apply(i,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function de(){try{i.compressedTexImage3D.apply(i,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function Re(){try{i.texSubImage2D.apply(i,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function oe(){try{i.texSubImage3D.apply(i,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function q(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function Ye(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function Qe(){try{i.texStorage2D.apply(i,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function ye(){try{i.texStorage3D.apply(i,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function Ae(){try{i.texImage2D.apply(i,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function me(){try{i.texImage3D.apply(i,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function Ue(v){pe.equals(v)===!1&&(i.scissor(v.x,v.y,v.z,v.w),pe.copy(v))}function De(v){Ce.equals(v)===!1&&(i.viewport(v.x,v.y,v.z,v.w),Ce.copy(v))}function Oe(v,ue){let he=d.get(ue);he===void 0&&(he=new WeakMap,d.set(ue,he));let Te=he.get(v);Te===void 0&&(Te=i.getUniformBlockIndex(ue,v.name),he.set(v,Te))}function ve(v,ue){let Te=d.get(ue).get(v);h.get(ue)!==Te&&(i.uniformBlockBinding(ue,Te,v.__bindingPointIndex),h.set(ue,Te))}function re(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},se=null,fe={},E={},m=new WeakMap,D=[],p=null,u=!1,w=null,C=null,S=null,T=null,y=null,F=null,$=null,M=new We(0,0,0),R=0,L=!1,ee=null,le=null,b=null,G=null,V=null,pe.set(0,0,i.canvas.width,i.canvas.height),Ce.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:Pe,disable:Fe,bindFramebuffer:P,drawBuffers:B,useProgram:z,setBlending:ie,setMaterial:Be,setFlipSided:Me,setCullFace:A,setLineWidth:g,setPolygonOffset:_,setScissorTest:K,activeTexture:X,bindTexture:Y,unbindTexture:Ee,compressedTexImage2D:ae,compressedTexImage3D:de,texImage2D:Ae,texImage3D:me,updateUBOMapping:Oe,uniformBlockBinding:ve,texStorage2D:Qe,texStorage3D:ye,texSubImage2D:Re,texSubImage3D:oe,compressedTexSubImage2D:q,compressedTexSubImage3D:Ye,scissor:Ue,viewport:De,reset:re}}function Nf(i,e,t,n,s,r,o){let a=s.isWebGL2,c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,d,f=new WeakMap,E=!1;try{E=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(A,g){return E?new OffscreenCanvas(A,g):ts("canvas")}function D(A,g,_,K){let X=1;if((A.width>K||A.height>K)&&(X=K/Math.max(A.width,A.height)),X<1||g===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){let Y=g?lr:Math.floor,Ee=Y(X*A.width),ae=Y(X*A.height);d===void 0&&(d=m(Ee,ae));let de=_?m(Ee,ae):d;return de.width=Ee,de.height=ae,de.getContext("2d").drawImage(A,0,0,Ee,ae),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+Ee+"x"+ae+")."),de}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function p(A){return Ga(A.width)&&Ga(A.height)}function u(A){return a?!1:A.wrapS!==Qt||A.wrapT!==Qt||A.minFilter!==mt&&A.minFilter!==yt}function w(A,g){return A.generateMipmaps&&g&&A.minFilter!==mt&&A.minFilter!==yt}function C(A){i.generateMipmap(A)}function S(A,g,_,K,X=!1){if(a===!1)return g;if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let Y=g;if(g===i.RED&&(_===i.FLOAT&&(Y=i.R32F),_===i.HALF_FLOAT&&(Y=i.R16F),_===i.UNSIGNED_BYTE&&(Y=i.R8)),g===i.RED_INTEGER&&(_===i.UNSIGNED_BYTE&&(Y=i.R8UI),_===i.UNSIGNED_SHORT&&(Y=i.R16UI),_===i.UNSIGNED_INT&&(Y=i.R32UI),_===i.BYTE&&(Y=i.R8I),_===i.SHORT&&(Y=i.R16I),_===i.INT&&(Y=i.R32I)),g===i.RG&&(_===i.FLOAT&&(Y=i.RG32F),_===i.HALF_FLOAT&&(Y=i.RG16F),_===i.UNSIGNED_BYTE&&(Y=i.RG8)),g===i.RGBA){let Ee=X?qi:Xe.getTransfer(K);_===i.FLOAT&&(Y=i.RGBA32F),_===i.HALF_FLOAT&&(Y=i.RGBA16F),_===i.UNSIGNED_BYTE&&(Y=Ee===qe?i.SRGB8_ALPHA8:i.RGBA8),_===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),_===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function T(A,g,_){return w(A,_)===!0||A.isFramebufferTexture&&A.minFilter!==mt&&A.minFilter!==yt?Math.log2(Math.max(g.width,g.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?g.mipmaps.length:1}function y(A){return A===mt||A===aa||A===ws?i.NEAREST:i.LINEAR}function F(A){let g=A.target;g.removeEventListener("dispose",F),M(g),g.isVideoTexture&&h.delete(g)}function $(A){let g=A.target;g.removeEventListener("dispose",$),L(g)}function M(A){let g=n.get(A);if(g.__webglInit===void 0)return;let _=A.source,K=f.get(_);if(K){let X=K[g.__cacheKey];X.usedTimes--,X.usedTimes===0&&R(A),Object.keys(K).length===0&&f.delete(_)}n.remove(A)}function R(A){let g=n.get(A);i.deleteTexture(g.__webglTexture);let _=A.source,K=f.get(_);delete K[g.__cacheKey],o.memory.textures--}function L(A){let g=A.texture,_=n.get(A),K=n.get(g);if(K.__webglTexture!==void 0&&(i.deleteTexture(K.__webglTexture),o.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(_.__webglFramebuffer[X]))for(let Y=0;Y<_.__webglFramebuffer[X].length;Y++)i.deleteFramebuffer(_.__webglFramebuffer[X][Y]);else i.deleteFramebuffer(_.__webglFramebuffer[X]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[X])}else{if(Array.isArray(_.__webglFramebuffer))for(let X=0;X<_.__webglFramebuffer.length;X++)i.deleteFramebuffer(_.__webglFramebuffer[X]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let X=0;X<_.__webglColorRenderbuffer.length;X++)_.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[X]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}if(A.isWebGLMultipleRenderTargets)for(let X=0,Y=g.length;X<Y;X++){let Ee=n.get(g[X]);Ee.__webglTexture&&(i.deleteTexture(Ee.__webglTexture),o.memory.textures--),n.remove(g[X])}n.remove(g),n.remove(A)}let ee=0;function le(){ee=0}function b(){let A=ee;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),ee+=1,A}function G(A){let g=[];return g.push(A.wrapS),g.push(A.wrapT),g.push(A.wrapR||0),g.push(A.magFilter),g.push(A.minFilter),g.push(A.anisotropy),g.push(A.internalFormat),g.push(A.format),g.push(A.type),g.push(A.generateMipmaps),g.push(A.premultiplyAlpha),g.push(A.flipY),g.push(A.unpackAlignment),g.push(A.colorSpace),g.join()}function V(A,g){let _=n.get(A);if(A.isVideoTexture&&Be(A),A.isRenderTargetTexture===!1&&A.version>0&&_.__version!==A.version){let K=A.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{pe(_,A,g);return}}t.bindTexture(i.TEXTURE_2D,_.__webglTexture,i.TEXTURE0+g)}function J(A,g){let _=n.get(A);if(A.version>0&&_.__version!==A.version){pe(_,A,g);return}t.bindTexture(i.TEXTURE_2D_ARRAY,_.__webglTexture,i.TEXTURE0+g)}function W(A,g){let _=n.get(A);if(A.version>0&&_.__version!==A.version){pe(_,A,g);return}t.bindTexture(i.TEXTURE_3D,_.__webglTexture,i.TEXTURE0+g)}function k(A,g){let _=n.get(A);if(A.version>0&&_.__version!==A.version){Ce(_,A,g);return}t.bindTexture(i.TEXTURE_CUBE_MAP,_.__webglTexture,i.TEXTURE0+g)}let te={[rr]:i.REPEAT,[Qt]:i.CLAMP_TO_EDGE,[ar]:i.MIRRORED_REPEAT},se={[mt]:i.NEAREST,[aa]:i.NEAREST_MIPMAP_NEAREST,[ws]:i.NEAREST_MIPMAP_LINEAR,[yt]:i.LINEAR,[bc]:i.LINEAR_MIPMAP_NEAREST,[gi]:i.LINEAR_MIPMAP_LINEAR},fe={[kc]:i.NEVER,[Jc]:i.ALWAYS,[Yc]:i.LESS,[Io]:i.LEQUAL,[Wc]:i.EQUAL,[zc]:i.GEQUAL,[Zc]:i.GREATER,[Xc]:i.NOTEQUAL};function O(A,g,_){if(_?(i.texParameteri(A,i.TEXTURE_WRAP_S,te[g.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,te[g.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,te[g.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,se[g.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,se[g.minFilter])):(i.texParameteri(A,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(A,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(g.wrapS!==Qt||g.wrapT!==Qt)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(A,i.TEXTURE_MAG_FILTER,y(g.magFilter)),i.texParameteri(A,i.TEXTURE_MIN_FILTER,y(g.minFilter)),g.minFilter!==mt&&g.minFilter!==yt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),g.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,fe[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){let K=e.get("EXT_texture_filter_anisotropic");if(g.magFilter===mt||g.minFilter!==ws&&g.minFilter!==gi||g.type===un&&e.has("OES_texture_float_linear")===!1||a===!1&&g.type===mi&&e.has("OES_texture_half_float_linear")===!1)return;(g.anisotropy>1||n.get(g).__currentAnisotropy)&&(i.texParameterf(A,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy)}}function j(A,g){let _=!1;A.__webglInit===void 0&&(A.__webglInit=!0,g.addEventListener("dispose",F));let K=g.source,X=f.get(K);X===void 0&&(X={},f.set(K,X));let Y=G(g);if(Y!==A.__cacheKey){X[Y]===void 0&&(X[Y]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,_=!0),X[Y].usedTimes++;let Ee=X[A.__cacheKey];Ee!==void 0&&(X[A.__cacheKey].usedTimes--,Ee.usedTimes===0&&R(g)),A.__cacheKey=Y,A.__webglTexture=X[Y].texture}return _}function pe(A,g,_){let K=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(K=i.TEXTURE_3D);let X=j(A,g),Y=g.source;t.bindTexture(K,A.__webglTexture,i.TEXTURE0+_);let Ee=n.get(Y);if(Y.version!==Ee.__version||X===!0){t.activeTexture(i.TEXTURE0+_);let ae=Xe.getPrimaries(Xe.workingColorSpace),de=g.colorSpace===Ut?null:Xe.getPrimaries(g.colorSpace),Re=g.colorSpace===Ut||ae===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re);let oe=u(g)&&p(g.image)===!1,q=D(g.image,oe,!1,s.maxTextureSize);q=Me(g,q);let Ye=p(q)||a,Qe=r.convert(g.format,g.colorSpace),ye=r.convert(g.type),Ae=S(g.internalFormat,Qe,ye,g.colorSpace,g.isVideoTexture);O(K,g,Ye);let me,Ue=g.mipmaps,De=a&&g.isVideoTexture!==!0&&Ae!==To,Oe=Ee.__version===void 0||X===!0,ve=T(g,q,Ye);if(g.isDepthTexture)Ae=i.DEPTH_COMPONENT,a?g.type===un?Ae=i.DEPTH_COMPONENT32F:g.type===hn?Ae=i.DEPTH_COMPONENT24:g.type===vn?Ae=i.DEPTH24_STENCIL8:Ae=i.DEPTH_COMPONENT16:g.type===un&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),g.format===Fn&&Ae===i.DEPTH_COMPONENT&&g.type!==Lr&&g.type!==hn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),g.type=hn,ye=r.convert(g.type)),g.format===ni&&Ae===i.DEPTH_COMPONENT&&(Ae=i.DEPTH_STENCIL,g.type!==vn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),g.type=vn,ye=r.convert(g.type))),Oe&&(De?t.texStorage2D(i.TEXTURE_2D,1,Ae,q.width,q.height):t.texImage2D(i.TEXTURE_2D,0,Ae,q.width,q.height,0,Qe,ye,null));else if(g.isDataTexture)if(Ue.length>0&&Ye){De&&Oe&&t.texStorage2D(i.TEXTURE_2D,ve,Ae,Ue[0].width,Ue[0].height);for(let re=0,v=Ue.length;re<v;re++)me=Ue[re],De?t.texSubImage2D(i.TEXTURE_2D,re,0,0,me.width,me.height,Qe,ye,me.data):t.texImage2D(i.TEXTURE_2D,re,Ae,me.width,me.height,0,Qe,ye,me.data);g.generateMipmaps=!1}else De?(Oe&&t.texStorage2D(i.TEXTURE_2D,ve,Ae,q.width,q.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,q.width,q.height,Qe,ye,q.data)):t.texImage2D(i.TEXTURE_2D,0,Ae,q.width,q.height,0,Qe,ye,q.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){De&&Oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ve,Ae,Ue[0].width,Ue[0].height,q.depth);for(let re=0,v=Ue.length;re<v;re++)me=Ue[re],g.format!==Ht?Qe!==null?De?t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,me.width,me.height,q.depth,Qe,me.data,0,0):t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,re,Ae,me.width,me.height,q.depth,0,me.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?t.texSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,me.width,me.height,q.depth,Qe,ye,me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,re,Ae,me.width,me.height,q.depth,0,Qe,ye,me.data)}else{De&&Oe&&t.texStorage2D(i.TEXTURE_2D,ve,Ae,Ue[0].width,Ue[0].height);for(let re=0,v=Ue.length;re<v;re++)me=Ue[re],g.format!==Ht?Qe!==null?De?t.compressedTexSubImage2D(i.TEXTURE_2D,re,0,0,me.width,me.height,Qe,me.data):t.compressedTexImage2D(i.TEXTURE_2D,re,Ae,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?t.texSubImage2D(i.TEXTURE_2D,re,0,0,me.width,me.height,Qe,ye,me.data):t.texImage2D(i.TEXTURE_2D,re,Ae,me.width,me.height,0,Qe,ye,me.data)}else if(g.isDataArrayTexture)De?(Oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ve,Ae,q.width,q.height,q.depth),t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,q.width,q.height,q.depth,Qe,ye,q.data)):t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ae,q.width,q.height,q.depth,0,Qe,ye,q.data);else if(g.isData3DTexture)De?(Oe&&t.texStorage3D(i.TEXTURE_3D,ve,Ae,q.width,q.height,q.depth),t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,q.width,q.height,q.depth,Qe,ye,q.data)):t.texImage3D(i.TEXTURE_3D,0,Ae,q.width,q.height,q.depth,0,Qe,ye,q.data);else if(g.isFramebufferTexture){if(Oe)if(De)t.texStorage2D(i.TEXTURE_2D,ve,Ae,q.width,q.height);else{let re=q.width,v=q.height;for(let ue=0;ue<ve;ue++)t.texImage2D(i.TEXTURE_2D,ue,Ae,re,v,0,Qe,ye,null),re>>=1,v>>=1}}else if(Ue.length>0&&Ye){De&&Oe&&t.texStorage2D(i.TEXTURE_2D,ve,Ae,Ue[0].width,Ue[0].height);for(let re=0,v=Ue.length;re<v;re++)me=Ue[re],De?t.texSubImage2D(i.TEXTURE_2D,re,0,0,Qe,ye,me):t.texImage2D(i.TEXTURE_2D,re,Ae,Qe,ye,me);g.generateMipmaps=!1}else De?(Oe&&t.texStorage2D(i.TEXTURE_2D,ve,Ae,q.width,q.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,Qe,ye,q)):t.texImage2D(i.TEXTURE_2D,0,Ae,Qe,ye,q);w(g,Ye)&&C(K),Ee.__version=Y.version,g.onUpdate&&g.onUpdate(g)}A.__version=g.version}function Ce(A,g,_){if(g.image.length!==6)return;let K=j(A,g),X=g.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+_);let Y=n.get(X);if(X.version!==Y.__version||K===!0){t.activeTexture(i.TEXTURE0+_);let Ee=Xe.getPrimaries(Xe.workingColorSpace),ae=g.colorSpace===Ut?null:Xe.getPrimaries(g.colorSpace),de=g.colorSpace===Ut||Ee===ae?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,de);let Re=g.isCompressedTexture||g.image[0].isCompressedTexture,oe=g.image[0]&&g.image[0].isDataTexture,q=[];for(let re=0;re<6;re++)!Re&&!oe?q[re]=D(g.image[re],!1,!0,s.maxCubemapSize):q[re]=oe?g.image[re].image:g.image[re],q[re]=Me(g,q[re]);let Ye=q[0],Qe=p(Ye)||a,ye=r.convert(g.format,g.colorSpace),Ae=r.convert(g.type),me=S(g.internalFormat,ye,Ae,g.colorSpace),Ue=a&&g.isVideoTexture!==!0,De=Y.__version===void 0||K===!0,Oe=T(g,Ye,Qe);O(i.TEXTURE_CUBE_MAP,g,Qe);let ve;if(Re){Ue&&De&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Oe,me,Ye.width,Ye.height);for(let re=0;re<6;re++){ve=q[re].mipmaps;for(let v=0;v<ve.length;v++){let ue=ve[v];g.format!==Ht?ye!==null?Ue?t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,v,0,0,ue.width,ue.height,ye,ue.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,v,me,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,v,0,0,ue.width,ue.height,ye,Ae,ue.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,v,me,ue.width,ue.height,0,ye,Ae,ue.data)}}}else{ve=g.mipmaps,Ue&&De&&(ve.length>0&&Oe++,t.texStorage2D(i.TEXTURE_CUBE_MAP,Oe,me,q[0].width,q[0].height));for(let re=0;re<6;re++)if(oe){Ue?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,q[re].width,q[re].height,ye,Ae,q[re].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,me,q[re].width,q[re].height,0,ye,Ae,q[re].data);for(let v=0;v<ve.length;v++){let he=ve[v].image[re].image;Ue?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,v+1,0,0,he.width,he.height,ye,Ae,he.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,v+1,me,he.width,he.height,0,ye,Ae,he.data)}}else{Ue?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,ye,Ae,q[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,me,ye,Ae,q[re]);for(let v=0;v<ve.length;v++){let ue=ve[v];Ue?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,v+1,0,0,ye,Ae,ue.image[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,v+1,me,ye,Ae,ue.image[re])}}}w(g,Qe)&&C(i.TEXTURE_CUBE_MAP),Y.__version=X.version,g.onUpdate&&g.onUpdate(g)}A.__version=g.version}function xe(A,g,_,K,X,Y){let Ee=r.convert(_.format,_.colorSpace),ae=r.convert(_.type),de=S(_.internalFormat,Ee,ae,_.colorSpace);if(!n.get(g).__hasExternalTextures){let oe=Math.max(1,g.width>>Y),q=Math.max(1,g.height>>Y);X===i.TEXTURE_3D||X===i.TEXTURE_2D_ARRAY?t.texImage3D(X,Y,de,oe,q,g.depth,0,Ee,ae,null):t.texImage2D(X,Y,de,oe,q,0,Ee,ae,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),ie(g)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,X,n.get(_).__webglTexture,0,ne(g)):(X===i.TEXTURE_2D||X>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&X<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,X,n.get(_).__webglTexture,Y),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ie(A,g,_){if(i.bindRenderbuffer(i.RENDERBUFFER,A),g.depthBuffer&&!g.stencilBuffer){let K=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(_||ie(g)){let X=g.depthTexture;X&&X.isDepthTexture&&(X.type===un?K=i.DEPTH_COMPONENT32F:X.type===hn&&(K=i.DEPTH_COMPONENT24));let Y=ne(g);ie(g)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Y,K,g.width,g.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,Y,K,g.width,g.height)}else i.renderbufferStorage(i.RENDERBUFFER,K,g.width,g.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,A)}else if(g.depthBuffer&&g.stencilBuffer){let K=ne(g);_&&ie(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,K,i.DEPTH24_STENCIL8,g.width,g.height):ie(g)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,K,i.DEPTH24_STENCIL8,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,A)}else{let K=g.isWebGLMultipleRenderTargets===!0?g.texture:[g.texture];for(let X=0;X<K.length;X++){let Y=K[X],Ee=r.convert(Y.format,Y.colorSpace),ae=r.convert(Y.type),de=S(Y.internalFormat,Ee,ae,Y.colorSpace),Re=ne(g);_&&ie(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Re,de,g.width,g.height):ie(g)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Re,de,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,de,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Pe(A,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(g.depthTexture).__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),V(g.depthTexture,0);let K=n.get(g.depthTexture).__webglTexture,X=ne(g);if(g.depthTexture.format===Fn)ie(g)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0);else if(g.depthTexture.format===ni)ie(g)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function Fe(A){let g=n.get(A),_=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!g.__autoAllocateDepthBuffer){if(_)throw new Error("target.depthTexture not supported in Cube render targets");Pe(g.__webglFramebuffer,A)}else if(_){g.__webglDepthbuffer=[];for(let K=0;K<6;K++)t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[K]),g.__webglDepthbuffer[K]=i.createRenderbuffer(),Ie(g.__webglDepthbuffer[K],A,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer=i.createRenderbuffer(),Ie(g.__webglDepthbuffer,A,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function P(A,g,_){let K=n.get(A);g!==void 0&&xe(K.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),_!==void 0&&Fe(A)}function B(A){let g=A.texture,_=n.get(A),K=n.get(g);A.addEventListener("dispose",$),A.isWebGLMultipleRenderTargets!==!0&&(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=g.version,o.memory.textures++);let X=A.isWebGLCubeRenderTarget===!0,Y=A.isWebGLMultipleRenderTargets===!0,Ee=p(A)||a;if(X){_.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(a&&g.mipmaps&&g.mipmaps.length>0){_.__webglFramebuffer[ae]=[];for(let de=0;de<g.mipmaps.length;de++)_.__webglFramebuffer[ae][de]=i.createFramebuffer()}else _.__webglFramebuffer[ae]=i.createFramebuffer()}else{if(a&&g.mipmaps&&g.mipmaps.length>0){_.__webglFramebuffer=[];for(let ae=0;ae<g.mipmaps.length;ae++)_.__webglFramebuffer[ae]=i.createFramebuffer()}else _.__webglFramebuffer=i.createFramebuffer();if(Y)if(s.drawBuffers){let ae=A.texture;for(let de=0,Re=ae.length;de<Re;de++){let oe=n.get(ae[de]);oe.__webglTexture===void 0&&(oe.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&A.samples>0&&ie(A)===!1){let ae=Y?g:[g];_.__webglMultisampledFramebuffer=i.createFramebuffer(),_.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,_.__webglMultisampledFramebuffer);for(let de=0;de<ae.length;de++){let Re=ae[de];_.__webglColorRenderbuffer[de]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,_.__webglColorRenderbuffer[de]);let oe=r.convert(Re.format,Re.colorSpace),q=r.convert(Re.type),Ye=S(Re.internalFormat,oe,q,Re.colorSpace,A.isXRRenderTarget===!0),Qe=ne(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Qe,Ye,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.RENDERBUFFER,_.__webglColorRenderbuffer[de])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(_.__webglDepthRenderbuffer=i.createRenderbuffer(),Ie(_.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(X){t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),O(i.TEXTURE_CUBE_MAP,g,Ee);for(let ae=0;ae<6;ae++)if(a&&g.mipmaps&&g.mipmaps.length>0)for(let de=0;de<g.mipmaps.length;de++)xe(_.__webglFramebuffer[ae][de],A,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,de);else xe(_.__webglFramebuffer[ae],A,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);w(g,Ee)&&C(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Y){let ae=A.texture;for(let de=0,Re=ae.length;de<Re;de++){let oe=ae[de],q=n.get(oe);t.bindTexture(i.TEXTURE_2D,q.__webglTexture),O(i.TEXTURE_2D,oe,Ee),xe(_.__webglFramebuffer,A,oe,i.COLOR_ATTACHMENT0+de,i.TEXTURE_2D,0),w(oe,Ee)&&C(i.TEXTURE_2D)}t.unbindTexture()}else{let ae=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(a?ae=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(ae,K.__webglTexture),O(ae,g,Ee),a&&g.mipmaps&&g.mipmaps.length>0)for(let de=0;de<g.mipmaps.length;de++)xe(_.__webglFramebuffer[de],A,g,i.COLOR_ATTACHMENT0,ae,de);else xe(_.__webglFramebuffer,A,g,i.COLOR_ATTACHMENT0,ae,0);w(g,Ee)&&C(ae),t.unbindTexture()}A.depthBuffer&&Fe(A)}function z(A){let g=p(A)||a,_=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let K=0,X=_.length;K<X;K++){let Y=_[K];if(w(Y,g)){let Ee=A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,ae=n.get(Y).__webglTexture;t.bindTexture(Ee,ae),C(Ee),t.unbindTexture()}}}function Z(A){if(a&&A.samples>0&&ie(A)===!1){let g=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],_=A.width,K=A.height,X=i.COLOR_BUFFER_BIT,Y=[],Ee=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=n.get(A),de=A.isWebGLMultipleRenderTargets===!0;if(de)for(let Re=0;Re<g.length;Re++)t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ae.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ae.__webglFramebuffer);for(let Re=0;Re<g.length;Re++){Y.push(i.COLOR_ATTACHMENT0+Re),A.depthBuffer&&Y.push(Ee);let oe=ae.__ignoreDepthValues!==void 0?ae.__ignoreDepthValues:!1;if(oe===!1&&(A.depthBuffer&&(X|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&(X|=i.STENCIL_BUFFER_BIT)),de&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ae.__webglColorRenderbuffer[Re]),oe===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Ee]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Ee])),de){let q=n.get(g[Re]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,q,0)}i.blitFramebuffer(0,0,_,K,0,0,_,K,X,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Y)}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),de)for(let Re=0;Re<g.length;Re++){t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.RENDERBUFFER,ae.__webglColorRenderbuffer[Re]);let oe=n.get(g[Re]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ae.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.TEXTURE_2D,oe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ae.__webglMultisampledFramebuffer)}}function ne(A){return Math.min(s.maxSamples,A.samples)}function ie(A){let g=n.get(A);return a&&A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Be(A){let g=o.render.frame;h.get(A)!==g&&(h.set(A,g),A.update())}function Me(A,g){let _=A.colorSpace,K=A.format,X=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===or||_!==tn&&_!==Ut&&(Xe.getTransfer(_)===qe?a===!1?e.has("EXT_sRGB")===!0&&K===Ht?(A.format=or,A.minFilter=yt,A.generateMipmaps=!1):g=ns.sRGBToLinear(g):(K!==Ht||X!==fn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",_)),g}this.allocateTextureUnit=b,this.resetTextureUnits=le,this.setTexture2D=V,this.setTexture2DArray=J,this.setTexture3D=W,this.setTextureCube=k,this.rebindTextures=P,this.setupRenderTarget=B,this.updateRenderTargetMipmap=z,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=Fe,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=ie}function Lf(i,e,t){let n=t.isWebGL2;function s(r,o=Ut){let a,c=Xe.getTransfer(o);if(r===fn)return i.UNSIGNED_BYTE;if(r===Fo)return i.UNSIGNED_SHORT_4_4_4_4;if(r===So)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Uc)return i.BYTE;if(r===Tc)return i.SHORT;if(r===Lr)return i.UNSIGNED_SHORT;if(r===vo)return i.INT;if(r===hn)return i.UNSIGNED_INT;if(r===un)return i.FLOAT;if(r===mi)return n?i.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===_c)return i.ALPHA;if(r===Ht)return i.RGBA;if(r===Ic)return i.LUMINANCE;if(r===Pc)return i.LUMINANCE_ALPHA;if(r===Fn)return i.DEPTH_COMPONENT;if(r===ni)return i.DEPTH_STENCIL;if(r===or)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Qc)return i.RED;if(r===yo)return i.RED_INTEGER;if(r===Hc)return i.RG;if(r===bo)return i.RG_INTEGER;if(r===Uo)return i.RGBA_INTEGER;if(r===Bs||r===vs||r===Fs||r===Ss)if(c===qe)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Bs)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===vs)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Fs)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Ss)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Bs)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===vs)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Fs)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Ss)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===oa||r===ca||r===la||r===ha)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===oa)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===ca)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===la)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===ha)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===To)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===ua||r===da)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(r===ua)return c===qe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===da)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===fa||r===pa||r===Ea||r===ga||r===ma||r===Da||r===Aa||r===xa||r===Ca||r===Ma||r===Ra||r===wa||r===Ba||r===va)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(r===fa)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===pa)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Ea)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===ga)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===ma)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Da)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Aa)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===xa)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Ca)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Ma)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ra)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===wa)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Ba)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===va)return c===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ys||r===Fa||r===Sa)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(r===ys)return c===qe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Fa)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Sa)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Gc||r===ya||r===ba||r===Ua)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(r===ys)return a.COMPRESSED_RED_RGTC1_EXT;if(r===ya)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===ba)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Ua)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===vn?n?i.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Br=class extends Dt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Kn=class extends Lt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Of={type:"move"},Ei=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Kn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Kn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Kn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let D of e.hand.values()){let p=t.getJointPose(D,n),u=this._getHandJoint(l,D);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}let h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=h.position.distanceTo(d.position),E=.02,m=.005;l.inputState.pinching&&f>E+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=E-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Of)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Kn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},vr=class extends En{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,d=null,f=null,E=null,m=null,D=t.getContextAttributes(),p=null,u=null,w=[],C=[],S=new Ze,T=null,y=new Dt;y.layers.enable(1),y.viewport=new lt;let F=new Dt;F.layers.enable(2),F.viewport=new lt;let $=[y,F],M=new Br;M.layers.enable(1),M.layers.enable(2);let R=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let j=w[O];return j===void 0&&(j=new Ei,w[O]=j),j.getTargetRaySpace()},this.getControllerGrip=function(O){let j=w[O];return j===void 0&&(j=new Ei,w[O]=j),j.getGripSpace()},this.getHand=function(O){let j=w[O];return j===void 0&&(j=new Ei,w[O]=j),j.getHandSpace()};function ee(O){let j=C.indexOf(O.inputSource);if(j===-1)return;let pe=w[j];pe!==void 0&&(pe.update(O.inputSource,O.frame,l||o),pe.dispatchEvent({type:O.type,data:O.inputSource}))}function le(){s.removeEventListener("select",ee),s.removeEventListener("selectstart",ee),s.removeEventListener("selectend",ee),s.removeEventListener("squeeze",ee),s.removeEventListener("squeezestart",ee),s.removeEventListener("squeezeend",ee),s.removeEventListener("end",le),s.removeEventListener("inputsourceschange",b);for(let O=0;O<w.length;O++){let j=C[O];j!==null&&(C[O]=null,w[O].disconnect(j))}R=null,L=null,e.setRenderTarget(p),E=null,f=null,d=null,s=null,u=null,fe.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(S.width,S.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(O){r=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){a=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(O){l=O},this.getBaseLayer=function(){return f!==null?f:E},this.getBinding=function(){return d},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(O){if(s=O,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",ee),s.addEventListener("selectstart",ee),s.addEventListener("selectend",ee),s.addEventListener("squeeze",ee),s.addEventListener("squeezestart",ee),s.addEventListener("squeezeend",ee),s.addEventListener("end",le),s.addEventListener("inputsourceschange",b),D.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(S),s.renderState.layers===void 0||e.capabilities.isWebGL2===!1){let j={antialias:s.renderState.layers===void 0?D.antialias:!0,alpha:!0,depth:D.depth,stencil:D.stencil,framebufferScaleFactor:r};E=new XRWebGLLayer(s,t,j),s.updateRenderState({baseLayer:E}),e.setPixelRatio(1),e.setSize(E.framebufferWidth,E.framebufferHeight,!1),u=new nn(E.framebufferWidth,E.framebufferHeight,{format:Ht,type:fn,colorSpace:e.outputColorSpace,stencilBuffer:D.stencil})}else{let j=null,pe=null,Ce=null;D.depth&&(Ce=D.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,j=D.stencil?ni:Fn,pe=D.stencil?vn:hn);let xe={colorFormat:t.RGBA8,depthFormat:Ce,scaleFactor:r};d=new XRWebGLBinding(s,t),f=d.createProjectionLayer(xe),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),u=new nn(f.textureWidth,f.textureHeight,{format:Ht,type:fn,depthTexture:new fs(f.textureWidth,f.textureHeight,pe,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:D.stencil,colorSpace:e.outputColorSpace,samples:D.antialias?4:0});let Ie=e.properties.get(u);Ie.__ignoreDepthValues=f.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),fe.setContext(s),fe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function b(O){for(let j=0;j<O.removed.length;j++){let pe=O.removed[j],Ce=C.indexOf(pe);Ce>=0&&(C[Ce]=null,w[Ce].disconnect(pe))}for(let j=0;j<O.added.length;j++){let pe=O.added[j],Ce=C.indexOf(pe);if(Ce===-1){for(let Ie=0;Ie<w.length;Ie++)if(Ie>=C.length){C.push(pe),Ce=Ie;break}else if(C[Ie]===null){C[Ie]=pe,Ce=Ie;break}if(Ce===-1)break}let xe=w[Ce];xe&&xe.connect(pe)}}let G=new H,V=new H;function J(O,j,pe){G.setFromMatrixPosition(j.matrixWorld),V.setFromMatrixPosition(pe.matrixWorld);let Ce=G.distanceTo(V),xe=j.projectionMatrix.elements,Ie=pe.projectionMatrix.elements,Pe=xe[14]/(xe[10]-1),Fe=xe[14]/(xe[10]+1),P=(xe[9]+1)/xe[5],B=(xe[9]-1)/xe[5],z=(xe[8]-1)/xe[0],Z=(Ie[8]+1)/Ie[0],ne=Pe*z,ie=Pe*Z,Be=Ce/(-z+Z),Me=Be*-z;j.matrixWorld.decompose(O.position,O.quaternion,O.scale),O.translateX(Me),O.translateZ(Be),O.matrixWorld.compose(O.position,O.quaternion,O.scale),O.matrixWorldInverse.copy(O.matrixWorld).invert();let A=Pe+Be,g=Fe+Be,_=ne-Me,K=ie+(Ce-Me),X=P*Fe/g*A,Y=B*Fe/g*A;O.projectionMatrix.makePerspective(_,K,X,Y,A,g),O.projectionMatrixInverse.copy(O.projectionMatrix).invert()}function W(O,j){j===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices(j.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(s===null)return;M.near=F.near=y.near=O.near,M.far=F.far=y.far=O.far,(R!==M.near||L!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),R=M.near,L=M.far);let j=O.parent,pe=M.cameras;W(M,j);for(let Ce=0;Ce<pe.length;Ce++)W(pe[Ce],j);pe.length===2?J(M,y,F):M.projectionMatrix.copy(y.projectionMatrix),k(O,M,j)};function k(O,j,pe){pe===null?O.matrix.copy(j.matrixWorld):(O.matrix.copy(pe.matrixWorld),O.matrix.invert(),O.matrix.multiply(j.matrixWorld)),O.matrix.decompose(O.position,O.quaternion,O.scale),O.updateMatrixWorld(!0),O.projectionMatrix.copy(j.projectionMatrix),O.projectionMatrixInverse.copy(j.projectionMatrixInverse),O.isPerspectiveCamera&&(O.fov=cr*2*Math.atan(1/O.projectionMatrix.elements[5]),O.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&E===null))return c},this.setFoveation=function(O){c=O,f!==null&&(f.fixedFoveation=O),E!==null&&E.fixedFoveation!==void 0&&(E.fixedFoveation=O)};let te=null;function se(O,j){if(h=j.getViewerPose(l||o),m=j,h!==null){let pe=h.views;E!==null&&(e.setRenderTargetFramebuffer(u,E.framebuffer),e.setRenderTarget(u));let Ce=!1;pe.length!==M.cameras.length&&(M.cameras.length=0,Ce=!0);for(let xe=0;xe<pe.length;xe++){let Ie=pe[xe],Pe=null;if(E!==null)Pe=E.getViewport(Ie);else{let P=d.getViewSubImage(f,Ie);Pe=P.viewport,xe===0&&(e.setRenderTargetTextures(u,P.colorTexture,f.ignoreDepthValues?void 0:P.depthStencilTexture),e.setRenderTarget(u))}let Fe=$[xe];Fe===void 0&&(Fe=new Dt,Fe.layers.enable(xe),Fe.viewport=new lt,$[xe]=Fe),Fe.matrix.fromArray(Ie.transform.matrix),Fe.matrix.decompose(Fe.position,Fe.quaternion,Fe.scale),Fe.projectionMatrix.fromArray(Ie.projectionMatrix),Fe.projectionMatrixInverse.copy(Fe.projectionMatrix).invert(),Fe.viewport.set(Pe.x,Pe.y,Pe.width,Pe.height),xe===0&&(M.matrix.copy(Fe.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),Ce===!0&&M.cameras.push(Fe)}}for(let pe=0;pe<w.length;pe++){let Ce=C[pe],xe=w[pe];Ce!==null&&xe!==void 0&&xe.update(Ce,j,l||o)}te&&te(O,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),m=null}let fe=new Go;fe.setAnimationLoop(se),this.setAnimationLoop=function(O){te=O},this.dispose=function(){}}};function Vf(i,e){function t(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,Ho(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,w,C,S){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),d(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),f(p,u),u.isMeshPhysicalMaterial&&E(p,u,S)):u.isMeshMatcapMaterial?(r(p,u),m(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),D(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(o(p,u),u.isLineDashedMaterial&&a(p,u)):u.isPointsMaterial?c(p,u,w,C):u.isSpriteMaterial?l(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,t(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===Ct&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,t(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===Ct&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,t(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,t(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);let w=e.get(u).envMap;if(w&&(p.envMap.value=w,p.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap){p.lightMap.value=u.lightMap;let C=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=u.lightMapIntensity*C,t(u.lightMap,p.lightMapTransform)}u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,p.aoMapTransform))}function o(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform))}function a(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function c(p,u,w,C){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*w,p.scale.value=C*.5,u.map&&(p.map.value=u.map,t(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function l(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function d(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function f(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,p.roughnessMapTransform)),e.get(u).envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function E(p,u,w){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Ct&&p.clearcoatNormalScale.value.negate())),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=w.texture,p.transmissionSamplerSize.value.set(w.width,w.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,u){u.matcap&&(p.matcap.value=u.matcap)}function D(p,u){let w=e.get(u).light;p.referencePosition.value.setFromMatrixPosition(w.matrixWorld),p.nearDistance.value=w.shadow.camera.near,p.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function kf(i,e,t,n){let s={},r={},o=[],a=t.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(w,C){let S=C.program;n.uniformBlockBinding(w,S)}function l(w,C){let S=s[w.id];S===void 0&&(m(w),S=h(w),s[w.id]=S,w.addEventListener("dispose",p));let T=C.program;n.updateUBOMapping(w,T);let y=e.render.frame;r[w.id]!==y&&(f(w),r[w.id]=y)}function h(w){let C=d();w.__bindingPointIndex=C;let S=i.createBuffer(),T=w.__size,y=w.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,T,y),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,C,S),S}function d(){for(let w=0;w<a;w++)if(o.indexOf(w)===-1)return o.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(w){let C=s[w.id],S=w.uniforms,T=w.__cache;i.bindBuffer(i.UNIFORM_BUFFER,C);for(let y=0,F=S.length;y<F;y++){let $=Array.isArray(S[y])?S[y]:[S[y]];for(let M=0,R=$.length;M<R;M++){let L=$[M];if(E(L,y,M,T)===!0){let ee=L.__offset,le=Array.isArray(L.value)?L.value:[L.value],b=0;for(let G=0;G<le.length;G++){let V=le[G],J=D(V);typeof V=="number"||typeof V=="boolean"?(L.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,ee+b,L.__data)):V.isMatrix3?(L.__data[0]=V.elements[0],L.__data[1]=V.elements[1],L.__data[2]=V.elements[2],L.__data[3]=0,L.__data[4]=V.elements[3],L.__data[5]=V.elements[4],L.__data[6]=V.elements[5],L.__data[7]=0,L.__data[8]=V.elements[6],L.__data[9]=V.elements[7],L.__data[10]=V.elements[8],L.__data[11]=0):(V.toArray(L.__data,b),b+=J.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,ee,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function E(w,C,S,T){let y=w.value,F=C+"_"+S;if(T[F]===void 0)return typeof y=="number"||typeof y=="boolean"?T[F]=y:T[F]=y.clone(),!0;{let $=T[F];if(typeof y=="number"||typeof y=="boolean"){if($!==y)return T[F]=y,!0}else if($.equals(y)===!1)return $.copy(y),!0}return!1}function m(w){let C=w.uniforms,S=0,T=16;for(let F=0,$=C.length;F<$;F++){let M=Array.isArray(C[F])?C[F]:[C[F]];for(let R=0,L=M.length;R<L;R++){let ee=M[R],le=Array.isArray(ee.value)?ee.value:[ee.value];for(let b=0,G=le.length;b<G;b++){let V=le[b],J=D(V),W=S%T;W!==0&&T-W<J.boundary&&(S+=T-W),ee.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),ee.__offset=S,S+=J.storage}}}let y=S%T;return y>0&&(S+=T-y),w.__size=S,w.__cache={},this}function D(w){let C={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(C.boundary=4,C.storage=4):w.isVector2?(C.boundary=8,C.storage=8):w.isVector3||w.isColor?(C.boundary=16,C.storage=12):w.isVector4?(C.boundary=16,C.storage=16):w.isMatrix3?(C.boundary=48,C.storage=48):w.isMatrix4?(C.boundary=64,C.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),C}function p(w){let C=w.target;C.removeEventListener("dispose",p);let S=o.indexOf(C.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(s[C.id]),delete s[C.id],delete r[C.id]}function u(){for(let w in s)i.deleteBuffer(s[w]);o=[],s={},r={}}return{bind:c,update:l,dispose:u}}var xi=class{constructor(e={}){let{canvas:t=qc(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;let E=new Uint32Array(4),m=new Int32Array(4),D=null,p=null,u=[],w=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=it,this._useLegacyLights=!1,this.toneMapping=dn,this.toneMappingExposure=1;let C=this,S=!1,T=0,y=0,F=null,$=-1,M=null,R=new lt,L=new lt,ee=null,le=new We(0),b=0,G=t.width,V=t.height,J=1,W=null,k=null,te=new lt(0,0,G,V),se=new lt(0,0,G,V),fe=!1,O=new us,j=!1,pe=!1,Ce=null,xe=new ft,Ie=new Ze,Pe=new H,Fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function P(){return F===null?J:1}let B=n;function z(x,U){for(let Q=0;Q<x.length;Q++){let N=x[Q],I=t.getContext(N,U);if(I!==null)return I}return null}try{let x={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Gr}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",v,!1),t.addEventListener("webglcontextcreationerror",ue,!1),B===null){let U=["webgl2","webgl","experimental-webgl"];if(C.isWebGL1Renderer===!0&&U.shift(),B=z(U,x),B===null)throw z(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&B instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),B.getShaderPrecisionFormat===void 0&&(B.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let Z,ne,ie,Be,Me,A,g,_,K,X,Y,Ee,ae,de,Re,oe,q,Ye,Qe,ye,Ae,me,Ue,De;function Oe(){Z=new od(B),ne=new td(B,Z,e),Z.init(ne),me=new Lf(B,Z,ne),ie=new Gf(B,Z,ne),Be=new hd(B),Me=new vf,A=new Nf(B,Z,ie,Me,ne,me,Be),g=new id(C),_=new ad(C),K=new Dl(B,ne),Ue=new $u(B,Z,K,ne),X=new cd(B,K,Be,Ue),Y=new pd(B,X,K,Be),Qe=new fd(B,ne,A),oe=new nd(Me),Ee=new Bf(C,g,_,Z,ne,Ue,oe),ae=new Vf(C,Me),de=new Sf,Re=new If(Z,ne),Ye=new ju(C,g,_,ie,Y,f,c),q=new Hf(C,Y,ne),De=new kf(B,Be,ne,ie),ye=new ed(B,Z,Be,ne),Ae=new ld(B,Z,Be,ne),Be.programs=Ee.programs,C.capabilities=ne,C.extensions=Z,C.properties=Me,C.renderLists=de,C.shadowMap=q,C.state=ie,C.info=Be}Oe();let ve=new vr(C,B);this.xr=ve,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let x=Z.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){let x=Z.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(x){x!==void 0&&(J=x,this.setSize(G,V,!1))},this.getSize=function(x){return x.set(G,V)},this.setSize=function(x,U,Q=!0){if(ve.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=x,V=U,t.width=Math.floor(x*J),t.height=Math.floor(U*J),Q===!0&&(t.style.width=x+"px",t.style.height=U+"px"),this.setViewport(0,0,x,U)},this.getDrawingBufferSize=function(x){return x.set(G*J,V*J).floor()},this.setDrawingBufferSize=function(x,U,Q){G=x,V=U,J=Q,t.width=Math.floor(x*Q),t.height=Math.floor(U*Q),this.setViewport(0,0,x,U)},this.getCurrentViewport=function(x){return x.copy(R)},this.getViewport=function(x){return x.copy(te)},this.setViewport=function(x,U,Q,N){x.isVector4?te.set(x.x,x.y,x.z,x.w):te.set(x,U,Q,N),ie.viewport(R.copy(te).multiplyScalar(J).floor())},this.getScissor=function(x){return x.copy(se)},this.setScissor=function(x,U,Q,N){x.isVector4?se.set(x.x,x.y,x.z,x.w):se.set(x,U,Q,N),ie.scissor(L.copy(se).multiplyScalar(J).floor())},this.getScissorTest=function(){return fe},this.setScissorTest=function(x){ie.setScissorTest(fe=x)},this.setOpaqueSort=function(x){W=x},this.setTransparentSort=function(x){k=x},this.getClearColor=function(x){return x.copy(Ye.getClearColor())},this.setClearColor=function(){Ye.setClearColor.apply(Ye,arguments)},this.getClearAlpha=function(){return Ye.getClearAlpha()},this.setClearAlpha=function(){Ye.setClearAlpha.apply(Ye,arguments)},this.clear=function(x=!0,U=!0,Q=!0){let N=0;if(x){let I=!1;if(F!==null){let ge=F.texture.format;I=ge===Uo||ge===bo||ge===yo}if(I){let ge=F.texture.type,we=ge===fn||ge===hn||ge===Lr||ge===vn||ge===Fo||ge===So,be=Ye.getClearColor(),_e=Ye.getClearAlpha(),Le=be.r,He=be.g,Ge=be.b;we?(E[0]=Le,E[1]=He,E[2]=Ge,E[3]=_e,B.clearBufferuiv(B.COLOR,0,E)):(m[0]=Le,m[1]=He,m[2]=Ge,m[3]=_e,B.clearBufferiv(B.COLOR,0,m))}else N|=B.COLOR_BUFFER_BIT}U&&(N|=B.DEPTH_BUFFER_BIT),Q&&(N|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(N)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",v,!1),t.removeEventListener("webglcontextcreationerror",ue,!1),de.dispose(),Re.dispose(),Me.dispose(),g.dispose(),_.dispose(),Y.dispose(),Ue.dispose(),De.dispose(),Ee.dispose(),ve.dispose(),ve.removeEventListener("sessionstart",pt),ve.removeEventListener("sessionend",Ke),Ce&&(Ce.dispose(),Ce=null),Et.stop()};function re(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function v(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;let x=Be.autoReset,U=q.enabled,Q=q.autoUpdate,N=q.needsUpdate,I=q.type;Oe(),Be.autoReset=x,q.enabled=U,q.autoUpdate=Q,q.needsUpdate=N,q.type=I}function ue(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function he(x){let U=x.target;U.removeEventListener("dispose",he),Te(U)}function Te(x){Se(x),Me.remove(x)}function Se(x){let U=Me.get(x).programs;U!==void 0&&(U.forEach(function(Q){Ee.releaseProgram(Q)}),x.isShaderMaterial&&Ee.releaseShaderCache(x))}this.renderBufferDirect=function(x,U,Q,N,I,ge){U===null&&(U=Fe);let we=I.isMesh&&I.matrixWorld.determinant()<0,be=Xo(x,U,Q,N,I);ie.setMaterial(N,we);let _e=Q.index,Le=1;if(N.wireframe===!0){if(_e=X.getWireframeAttribute(Q),_e===void 0)return;Le=2}let He=Q.drawRange,Ge=Q.attributes.position,tt=He.start*Le,Rt=(He.start+He.count)*Le;ge!==null&&(tt=Math.max(tt,ge.start*Le),Rt=Math.min(Rt,(ge.start+ge.count)*Le)),_e!==null?(tt=Math.max(tt,0),Rt=Math.min(Rt,_e.count)):Ge!=null&&(tt=Math.max(tt,0),Rt=Math.min(Rt,Ge.count));let ot=Rt-tt;if(ot<0||ot===1/0)return;Ue.setup(I,N,be,Q,_e);let Zt,$e=ye;if(_e!==null&&(Zt=K.get(_e),$e=Ae,$e.setIndex(Zt)),I.isMesh)N.wireframe===!0?(ie.setLineWidth(N.wireframeLinewidth*P()),$e.setMode(B.LINES)):$e.setMode(B.TRIANGLES);else if(I.isLine){let Ve=N.linewidth;Ve===void 0&&(Ve=1),ie.setLineWidth(Ve*P()),I.isLineSegments?$e.setMode(B.LINES):I.isLineLoop?$e.setMode(B.LINE_LOOP):$e.setMode(B.LINE_STRIP)}else I.isPoints?$e.setMode(B.POINTS):I.isSprite&&$e.setMode(B.TRIANGLES);if(I.isBatchedMesh)$e.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else if(I.isInstancedMesh)$e.renderInstances(tt,ot,I.count);else if(Q.isInstancedBufferGeometry){let Ve=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,xs=Math.min(Q.instanceCount,Ve);$e.renderInstances(tt,ot,xs)}else $e.render(tt,ot)};function ze(x,U,Q){x.transparent===!0&&x.side===bt&&x.forceSinglePass===!1?(x.side=Ct,x.needsUpdate=!0,wi(x,U,Q),x.side=pn,x.needsUpdate=!0,wi(x,U,Q),x.side=bt):wi(x,U,Q)}this.compile=function(x,U,Q=null){Q===null&&(Q=x),p=Re.get(Q),p.init(),w.push(p),Q.traverseVisible(function(I){I.isLight&&I.layers.test(U.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),x!==Q&&x.traverseVisible(function(I){I.isLight&&I.layers.test(U.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),p.setupLights(C._useLegacyLights);let N=new Set;return x.traverse(function(I){let ge=I.material;if(ge)if(Array.isArray(ge))for(let we=0;we<ge.length;we++){let be=ge[we];ze(be,Q,I),N.add(be)}else ze(ge,Q,I),N.add(ge)}),w.pop(),p=null,N},this.compileAsync=function(x,U,Q=null){let N=this.compile(x,U,Q);return new Promise(I=>{function ge(){if(N.forEach(function(we){Me.get(we).currentProgram.isReady()&&N.delete(we)}),N.size===0){I(x);return}setTimeout(ge,10)}Z.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let Je=null;function at(x){Je&&Je(x)}function pt(){Et.stop()}function Ke(){Et.start()}let Et=new Go;Et.setAnimationLoop(at),typeof self<"u"&&Et.setContext(self),this.setAnimationLoop=function(x){Je=x,ve.setAnimationLoop(x),x===null?Et.stop():Et.start()},ve.addEventListener("sessionstart",pt),ve.addEventListener("sessionend",Ke),this.render=function(x,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),ve.enabled===!0&&ve.isPresenting===!0&&(ve.cameraAutoUpdate===!0&&ve.updateCamera(U),U=ve.getCamera()),x.isScene===!0&&x.onBeforeRender(C,x,U,F),p=Re.get(x,w.length),p.init(),w.push(p),xe.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),O.setFromProjectionMatrix(xe),pe=this.localClippingEnabled,j=oe.init(this.clippingPlanes,pe),D=de.get(x,u.length),D.init(),u.push(D),kt(x,U,0,C.sortObjects),D.finish(),C.sortObjects===!0&&D.sort(W,k),this.info.render.frame++,j===!0&&oe.beginShadows();let Q=p.state.shadowsArray;if(q.render(Q,x,U),j===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset(),Ye.render(D,x),p.setupLights(C._useLegacyLights),U.isArrayCamera){let N=U.cameras;for(let I=0,ge=N.length;I<ge;I++){let we=N[I];zr(D,x,we,we.viewport)}}else zr(D,x,U);F!==null&&(A.updateMultisampleRenderTarget(F),A.updateRenderTargetMipmap(F)),x.isScene===!0&&x.onAfterRender(C,x,U),Ue.resetDefaultState(),$=-1,M=null,w.pop(),w.length>0?p=w[w.length-1]:p=null,u.pop(),u.length>0?D=u[u.length-1]:D=null};function kt(x,U,Q,N){if(x.visible===!1)return;if(x.layers.test(U.layers)){if(x.isGroup)Q=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(U);else if(x.isLight)p.pushLight(x),x.castShadow&&p.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||O.intersectsSprite(x)){N&&Pe.setFromMatrixPosition(x.matrixWorld).applyMatrix4(xe);let we=Y.update(x),be=x.material;be.visible&&D.push(x,we,be,Q,Pe.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||O.intersectsObject(x))){let we=Y.update(x),be=x.material;if(N&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),Pe.copy(x.boundingSphere.center)):(we.boundingSphere===null&&we.computeBoundingSphere(),Pe.copy(we.boundingSphere.center)),Pe.applyMatrix4(x.matrixWorld).applyMatrix4(xe)),Array.isArray(be)){let _e=we.groups;for(let Le=0,He=_e.length;Le<He;Le++){let Ge=_e[Le],tt=be[Ge.materialIndex];tt&&tt.visible&&D.push(x,we,tt,Q,Pe.z,Ge)}}else be.visible&&D.push(x,we,be,Q,Pe.z,null)}}let ge=x.children;for(let we=0,be=ge.length;we<be;we++)kt(ge[we],U,Q,N)}function zr(x,U,Q,N){let I=x.opaque,ge=x.transmissive,we=x.transparent;p.setupLightsView(Q),j===!0&&oe.setGlobalState(C.clippingPlanes,Q),ge.length>0&&Zo(I,ge,U,Q),N&&ie.viewport(R.copy(N)),I.length>0&&Ri(I,U,Q),ge.length>0&&Ri(ge,U,Q),we.length>0&&Ri(we,U,Q),ie.buffers.depth.setTest(!0),ie.buffers.depth.setMask(!0),ie.buffers.color.setMask(!0),ie.setPolygonOffset(!1)}function Zo(x,U,Q,N){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;let ge=ne.isWebGL2;Ce===null&&(Ce=new nn(1,1,{generateMipmaps:!0,type:Z.has("EXT_color_buffer_half_float")?mi:fn,minFilter:gi,samples:ge?4:0})),C.getDrawingBufferSize(Ie),ge?Ce.setSize(Ie.x,Ie.y):Ce.setSize(lr(Ie.x),lr(Ie.y));let we=C.getRenderTarget();C.setRenderTarget(Ce),C.getClearColor(le),b=C.getClearAlpha(),b<1&&C.setClearColor(16777215,.5),C.clear();let be=C.toneMapping;C.toneMapping=dn,Ri(x,Q,N),A.updateMultisampleRenderTarget(Ce),A.updateRenderTargetMipmap(Ce);let _e=!1;for(let Le=0,He=U.length;Le<He;Le++){let Ge=U[Le],tt=Ge.object,Rt=Ge.geometry,ot=Ge.material,Zt=Ge.group;if(ot.side===bt&&tt.layers.test(N.layers)){let $e=ot.side;ot.side=Ct,ot.needsUpdate=!0,Jr(tt,Q,N,Rt,ot,Zt),ot.side=$e,ot.needsUpdate=!0,_e=!0}}_e===!0&&(A.updateMultisampleRenderTarget(Ce),A.updateRenderTargetMipmap(Ce)),C.setRenderTarget(we),C.setClearColor(le,b),C.toneMapping=be}function Ri(x,U,Q){let N=U.isScene===!0?U.overrideMaterial:null;for(let I=0,ge=x.length;I<ge;I++){let we=x[I],be=we.object,_e=we.geometry,Le=N===null?we.material:N,He=we.group;be.layers.test(Q.layers)&&Jr(be,U,Q,_e,Le,He)}}function Jr(x,U,Q,N,I,ge){x.onBeforeRender(C,U,Q,N,I,ge),x.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),I.onBeforeRender(C,U,Q,N,x,ge),I.transparent===!0&&I.side===bt&&I.forceSinglePass===!1?(I.side=Ct,I.needsUpdate=!0,C.renderBufferDirect(Q,U,N,I,x,ge),I.side=pn,I.needsUpdate=!0,C.renderBufferDirect(Q,U,N,I,x,ge),I.side=bt):C.renderBufferDirect(Q,U,N,I,x,ge),x.onAfterRender(C,U,Q,N,I,ge)}function wi(x,U,Q){U.isScene!==!0&&(U=Fe);let N=Me.get(x),I=p.state.lights,ge=p.state.shadowsArray,we=I.state.version,be=Ee.getParameters(x,I.state,ge,U,Q),_e=Ee.getProgramCacheKey(be),Le=N.programs;N.environment=x.isMeshStandardMaterial?U.environment:null,N.fog=U.fog,N.envMap=(x.isMeshStandardMaterial?_:g).get(x.envMap||N.environment),Le===void 0&&(x.addEventListener("dispose",he),Le=new Map,N.programs=Le);let He=Le.get(_e);if(He!==void 0){if(N.currentProgram===He&&N.lightsStateVersion===we)return qr(x,be),He}else be.uniforms=Ee.getUniforms(x),x.onBuild(Q,be,C),x.onBeforeCompile(be,C),He=Ee.acquireProgram(be,_e),Le.set(_e,He),N.uniforms=be.uniforms;let Ge=N.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Ge.clippingPlanes=oe.uniform),qr(x,be),N.needsLights=Jo(x),N.lightsStateVersion=we,N.needsLights&&(Ge.ambientLightColor.value=I.state.ambient,Ge.lightProbe.value=I.state.probe,Ge.directionalLights.value=I.state.directional,Ge.directionalLightShadows.value=I.state.directionalShadow,Ge.spotLights.value=I.state.spot,Ge.spotLightShadows.value=I.state.spotShadow,Ge.rectAreaLights.value=I.state.rectArea,Ge.ltc_1.value=I.state.rectAreaLTC1,Ge.ltc_2.value=I.state.rectAreaLTC2,Ge.pointLights.value=I.state.point,Ge.pointLightShadows.value=I.state.pointShadow,Ge.hemisphereLights.value=I.state.hemi,Ge.directionalShadowMap.value=I.state.directionalShadowMap,Ge.directionalShadowMatrix.value=I.state.directionalShadowMatrix,Ge.spotShadowMap.value=I.state.spotShadowMap,Ge.spotLightMatrix.value=I.state.spotLightMatrix,Ge.spotLightMap.value=I.state.spotLightMap,Ge.pointShadowMap.value=I.state.pointShadowMap,Ge.pointShadowMatrix.value=I.state.pointShadowMatrix),N.currentProgram=He,N.uniformsList=null,He}function Kr(x){if(x.uniformsList===null){let U=x.currentProgram.getUniforms();x.uniformsList=$n.seqWithValue(U.seq,x.uniforms)}return x.uniformsList}function qr(x,U){let Q=Me.get(x);Q.outputColorSpace=U.outputColorSpace,Q.batching=U.batching,Q.instancing=U.instancing,Q.instancingColor=U.instancingColor,Q.skinning=U.skinning,Q.morphTargets=U.morphTargets,Q.morphNormals=U.morphNormals,Q.morphColors=U.morphColors,Q.morphTargetsCount=U.morphTargetsCount,Q.numClippingPlanes=U.numClippingPlanes,Q.numIntersection=U.numClipIntersection,Q.vertexAlphas=U.vertexAlphas,Q.vertexTangents=U.vertexTangents,Q.toneMapping=U.toneMapping}function Xo(x,U,Q,N,I){U.isScene!==!0&&(U=Fe),A.resetTextureUnits();let ge=U.fog,we=N.isMeshStandardMaterial?U.environment:null,be=F===null?C.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:tn,_e=(N.isMeshStandardMaterial?_:g).get(N.envMap||we),Le=N.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,He=!!Q.attributes.tangent&&(!!N.normalMap||N.anisotropy>0),Ge=!!Q.morphAttributes.position,tt=!!Q.morphAttributes.normal,Rt=!!Q.morphAttributes.color,ot=dn;N.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(ot=C.toneMapping);let Zt=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,$e=Zt!==void 0?Zt.length:0,Ve=Me.get(N),xs=p.state.lights;if(j===!0&&(pe===!0||x!==M)){let Ft=x===M&&N.id===$;oe.setState(N,x,Ft)}let et=!1;N.version===Ve.__version?(Ve.needsLights&&Ve.lightsStateVersion!==xs.state.version||Ve.outputColorSpace!==be||I.isBatchedMesh&&Ve.batching===!1||!I.isBatchedMesh&&Ve.batching===!0||I.isInstancedMesh&&Ve.instancing===!1||!I.isInstancedMesh&&Ve.instancing===!0||I.isSkinnedMesh&&Ve.skinning===!1||!I.isSkinnedMesh&&Ve.skinning===!0||I.isInstancedMesh&&Ve.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&Ve.instancingColor===!1&&I.instanceColor!==null||Ve.envMap!==_e||N.fog===!0&&Ve.fog!==ge||Ve.numClippingPlanes!==void 0&&(Ve.numClippingPlanes!==oe.numPlanes||Ve.numIntersection!==oe.numIntersection)||Ve.vertexAlphas!==Le||Ve.vertexTangents!==He||Ve.morphTargets!==Ge||Ve.morphNormals!==tt||Ve.morphColors!==Rt||Ve.toneMapping!==ot||ne.isWebGL2===!0&&Ve.morphTargetsCount!==$e)&&(et=!0):(et=!0,Ve.__version=N.version);let mn=Ve.currentProgram;et===!0&&(mn=wi(N,U,I));let jr=!1,ci=!1,Cs=!1,ht=mn.getUniforms(),Dn=Ve.uniforms;if(ie.useProgram(mn.program)&&(jr=!0,ci=!0,Cs=!0),N.id!==$&&($=N.id,ci=!0),jr||M!==x){ht.setValue(B,"projectionMatrix",x.projectionMatrix),ht.setValue(B,"viewMatrix",x.matrixWorldInverse);let Ft=ht.map.cameraPosition;Ft!==void 0&&Ft.setValue(B,Pe.setFromMatrixPosition(x.matrixWorld)),ne.logarithmicDepthBuffer&&ht.setValue(B,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(N.isMeshPhongMaterial||N.isMeshToonMaterial||N.isMeshLambertMaterial||N.isMeshBasicMaterial||N.isMeshStandardMaterial||N.isShaderMaterial)&&ht.setValue(B,"isOrthographic",x.isOrthographicCamera===!0),M!==x&&(M=x,ci=!0,Cs=!0)}if(I.isSkinnedMesh){ht.setOptional(B,I,"bindMatrix"),ht.setOptional(B,I,"bindMatrixInverse");let Ft=I.skeleton;Ft&&(ne.floatVertexTextures?(Ft.boneTexture===null&&Ft.computeBoneTexture(),ht.setValue(B,"boneTexture",Ft.boneTexture,A)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}I.isBatchedMesh&&(ht.setOptional(B,I,"batchingTexture"),ht.setValue(B,"batchingTexture",I._matricesTexture,A));let Ms=Q.morphAttributes;if((Ms.position!==void 0||Ms.normal!==void 0||Ms.color!==void 0&&ne.isWebGL2===!0)&&Qe.update(I,Q,mn),(ci||Ve.receiveShadow!==I.receiveShadow)&&(Ve.receiveShadow=I.receiveShadow,ht.setValue(B,"receiveShadow",I.receiveShadow)),N.isMeshGouraudMaterial&&N.envMap!==null&&(Dn.envMap.value=_e,Dn.flipEnvMap.value=_e.isCubeTexture&&_e.isRenderTargetTexture===!1?-1:1),ci&&(ht.setValue(B,"toneMappingExposure",C.toneMappingExposure),Ve.needsLights&&zo(Dn,Cs),ge&&N.fog===!0&&ae.refreshFogUniforms(Dn,ge),ae.refreshMaterialUniforms(Dn,N,J,V,Ce),$n.upload(B,Kr(Ve),Dn,A)),N.isShaderMaterial&&N.uniformsNeedUpdate===!0&&($n.upload(B,Kr(Ve),Dn,A),N.uniformsNeedUpdate=!1),N.isSpriteMaterial&&ht.setValue(B,"center",I.center),ht.setValue(B,"modelViewMatrix",I.modelViewMatrix),ht.setValue(B,"normalMatrix",I.normalMatrix),ht.setValue(B,"modelMatrix",I.matrixWorld),N.isShaderMaterial||N.isRawShaderMaterial){let Ft=N.uniformsGroups;for(let Rs=0,Ko=Ft.length;Rs<Ko;Rs++)if(ne.isWebGL2){let $r=Ft[Rs];De.update($r,mn),De.bind($r,mn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return mn}function zo(x,U){x.ambientLightColor.needsUpdate=U,x.lightProbe.needsUpdate=U,x.directionalLights.needsUpdate=U,x.directionalLightShadows.needsUpdate=U,x.pointLights.needsUpdate=U,x.pointLightShadows.needsUpdate=U,x.spotLights.needsUpdate=U,x.spotLightShadows.needsUpdate=U,x.rectAreaLights.needsUpdate=U,x.hemisphereLights.needsUpdate=U}function Jo(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return y},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(x,U,Q){Me.get(x.texture).__webglTexture=U,Me.get(x.depthTexture).__webglTexture=Q;let N=Me.get(x);N.__hasExternalTextures=!0,N.__hasExternalTextures&&(N.__autoAllocateDepthBuffer=Q===void 0,N.__autoAllocateDepthBuffer||Z.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),N.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(x,U){let Q=Me.get(x);Q.__webglFramebuffer=U,Q.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(x,U=0,Q=0){F=x,T=U,y=Q;let N=!0,I=null,ge=!1,we=!1;if(x){let _e=Me.get(x);_e.__useDefaultFramebuffer!==void 0?(ie.bindFramebuffer(B.FRAMEBUFFER,null),N=!1):_e.__webglFramebuffer===void 0?A.setupRenderTarget(x):_e.__hasExternalTextures&&A.rebindTextures(x,Me.get(x.texture).__webglTexture,Me.get(x.depthTexture).__webglTexture);let Le=x.texture;(Le.isData3DTexture||Le.isDataArrayTexture||Le.isCompressedArrayTexture)&&(we=!0);let He=Me.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(He[U])?I=He[U][Q]:I=He[U],ge=!0):ne.isWebGL2&&x.samples>0&&A.useMultisampledRTT(x)===!1?I=Me.get(x).__webglMultisampledFramebuffer:Array.isArray(He)?I=He[Q]:I=He,R.copy(x.viewport),L.copy(x.scissor),ee=x.scissorTest}else R.copy(te).multiplyScalar(J).floor(),L.copy(se).multiplyScalar(J).floor(),ee=fe;if(ie.bindFramebuffer(B.FRAMEBUFFER,I)&&ne.drawBuffers&&N&&ie.drawBuffers(x,I),ie.viewport(R),ie.scissor(L),ie.setScissorTest(ee),ge){let _e=Me.get(x.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+U,_e.__webglTexture,Q)}else if(we){let _e=Me.get(x.texture),Le=U||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,_e.__webglTexture,Q||0,Le)}$=-1},this.readRenderTargetPixels=function(x,U,Q,N,I,ge,we){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=Me.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&we!==void 0&&(be=be[we]),be){ie.bindFramebuffer(B.FRAMEBUFFER,be);try{let _e=x.texture,Le=_e.format,He=_e.type;if(Le!==Ht&&me.convert(Le)!==B.getParameter(B.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Ge=He===mi&&(Z.has("EXT_color_buffer_half_float")||ne.isWebGL2&&Z.has("EXT_color_buffer_float"));if(He!==fn&&me.convert(He)!==B.getParameter(B.IMPLEMENTATION_COLOR_READ_TYPE)&&!(He===un&&(ne.isWebGL2||Z.has("OES_texture_float")||Z.has("WEBGL_color_buffer_float")))&&!Ge){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=x.width-N&&Q>=0&&Q<=x.height-I&&B.readPixels(U,Q,N,I,me.convert(Le),me.convert(He),ge)}finally{let _e=F!==null?Me.get(F).__webglFramebuffer:null;ie.bindFramebuffer(B.FRAMEBUFFER,_e)}}},this.copyFramebufferToTexture=function(x,U,Q=0){let N=Math.pow(2,-Q),I=Math.floor(U.image.width*N),ge=Math.floor(U.image.height*N);A.setTexture2D(U,0),B.copyTexSubImage2D(B.TEXTURE_2D,Q,0,0,x.x,x.y,I,ge),ie.unbindTexture()},this.copyTextureToTexture=function(x,U,Q,N=0){let I=U.image.width,ge=U.image.height,we=me.convert(Q.format),be=me.convert(Q.type);A.setTexture2D(Q,0),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,Q.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Q.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,Q.unpackAlignment),U.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,N,x.x,x.y,I,ge,we,be,U.image.data):U.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,N,x.x,x.y,U.mipmaps[0].width,U.mipmaps[0].height,we,U.mipmaps[0].data):B.texSubImage2D(B.TEXTURE_2D,N,x.x,x.y,we,be,U.image),N===0&&Q.generateMipmaps&&B.generateMipmap(B.TEXTURE_2D),ie.unbindTexture()},this.copyTextureToTexture3D=function(x,U,Q,N,I=0){if(C.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let ge=x.max.x-x.min.x+1,we=x.max.y-x.min.y+1,be=x.max.z-x.min.z+1,_e=me.convert(N.format),Le=me.convert(N.type),He;if(N.isData3DTexture)A.setTexture3D(N,0),He=B.TEXTURE_3D;else if(N.isDataArrayTexture||N.isCompressedArrayTexture)A.setTexture2DArray(N,0),He=B.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,N.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,N.unpackAlignment);let Ge=B.getParameter(B.UNPACK_ROW_LENGTH),tt=B.getParameter(B.UNPACK_IMAGE_HEIGHT),Rt=B.getParameter(B.UNPACK_SKIP_PIXELS),ot=B.getParameter(B.UNPACK_SKIP_ROWS),Zt=B.getParameter(B.UNPACK_SKIP_IMAGES),$e=Q.isCompressedTexture?Q.mipmaps[I]:Q.image;B.pixelStorei(B.UNPACK_ROW_LENGTH,$e.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,$e.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,x.min.x),B.pixelStorei(B.UNPACK_SKIP_ROWS,x.min.y),B.pixelStorei(B.UNPACK_SKIP_IMAGES,x.min.z),Q.isDataTexture||Q.isData3DTexture?B.texSubImage3D(He,I,U.x,U.y,U.z,ge,we,be,_e,Le,$e.data):Q.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),B.compressedTexSubImage3D(He,I,U.x,U.y,U.z,ge,we,be,_e,$e.data)):B.texSubImage3D(He,I,U.x,U.y,U.z,ge,we,be,_e,Le,$e),B.pixelStorei(B.UNPACK_ROW_LENGTH,Ge),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,tt),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Rt),B.pixelStorei(B.UNPACK_SKIP_ROWS,ot),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Zt),I===0&&N.generateMipmaps&&B.generateMipmap(He),ie.unbindTexture()},this.initTexture=function(x){x.isCubeTexture?A.setTextureCube(x,0):x.isData3DTexture?A.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?A.setTexture2DArray(x,0):A.setTexture2D(x,0),ie.unbindTexture()},this.resetState=function(){T=0,y=0,F=null,ie.reset(),Ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return en}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=e===Or?"display-p3":"srgb",t.unpackColorSpace=Xe.workingColorSpace===ms?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===it?Sn:_o}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===Sn?it:tn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}},Fr=class extends xi{};Fr.prototype.isWebGL1Renderer=!0;var ps=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new We(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Es=class extends Lt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}};function Xi(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Yf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var ai=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Sr=class extends ai{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ta,endingEnd:Ta}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case _a:r=e,a=2*t-n;break;case Ia:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case _a:o=e,c=2*n-t;break;case Ia:o=1,c=n+s[1]-s[0];break;default:o=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,E=this._weightNext,m=(n-t)/(s-t),D=m*m,p=D*m,u=-f*p+2*f*D-f*m,w=(1+f)*p+(-1.5-2*f)*D+(-.5+f)*m+1,C=(-1-E)*p+(1.5+E)*D+.5*m,S=E*p-E*D;for(let T=0;T!==a;++T)r[T]=u*o[h+T]+w*o[l+T]+C*o[c+T]+S*o[d+T];return r}},yr=class extends ai{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(n-t)/(s-t),d=1-h;for(let f=0;f!==a;++f)r[f]=o[l+f]*d+o[c+f]*h;return r}},br=class extends ai{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Vt=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Xi(t,this.TimeBufferType),this.values=Xi(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Xi(e.times,Array),values:Xi(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new br(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new yr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Sr(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ji:t=this.InterpolantFactoryMethodDiscrete;break;case Ki:t=this.InterpolantFactoryMethodLinear;break;case bs:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ji;case this.InterpolantFactoryMethodLinear:return Ki;case this.InterpolantFactoryMethodSmooth:return bs}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&Yf(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===bs,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(s)c=!0;else{let d=a*n,f=d-n,E=d+n;for(let m=0;m!==n;++m){let D=t[d+m];if(D!==t[f+m]||D!==t[E+m]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let d=a*n,f=o*n;for(let E=0;E!==n;++E)t[f+E]=t[d+E]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Vt.prototype.TimeBufferType=Float32Array;Vt.prototype.ValueBufferType=Float32Array;Vt.prototype.DefaultInterpolation=Ki;var yn=class extends Vt{};yn.prototype.ValueTypeName="bool";yn.prototype.ValueBufferType=Array;yn.prototype.DefaultInterpolation=Ji;yn.prototype.InterpolantFactoryMethodLinear=void 0;yn.prototype.InterpolantFactoryMethodSmooth=void 0;var Ur=class extends Vt{};Ur.prototype.ValueTypeName="color";var Tr=class extends Vt{};Tr.prototype.ValueTypeName="number";var _r=class extends ai{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(s-t),l=e*a;for(let h=l+a;l!==h;l+=4)gn.slerpFlat(r,0,o,l-a,o,l,c);return r}},Ci=class extends Vt{InterpolantFactoryMethodLinear(e){return new _r(this.times,this.values,this.getValueSize(),e)}};Ci.prototype.ValueTypeName="quaternion";Ci.prototype.DefaultInterpolation=Ki;Ci.prototype.InterpolantFactoryMethodSmooth=void 0;var bn=class extends Vt{};bn.prototype.ValueTypeName="string";bn.prototype.ValueBufferType=Array;bn.prototype.DefaultInterpolation=Ji;bn.prototype.InterpolantFactoryMethodLinear=void 0;bn.prototype.InterpolantFactoryMethodSmooth=void 0;var Ir=class extends Vt{};Ir.prototype.ValueTypeName="vector";var Pr=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){let d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=l.length;d<f;d+=2){let E=l[d],m=l[d+1];if(E.global&&(E.lastIndex=0),E.test(h))return m}return null}}},Wf=new Pr,Qr=class{constructor(e){this.manager=e!==void 0?e:Wf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Qr.DEFAULT_MATERIAL_NAME="__DEFAULT";var kr="\\[\\]\\.:\\/",Zf=new RegExp("["+kr+"]","g"),Yr="[^"+kr+"]",Xf="[^"+kr.replace("\\.","")+"]",zf=/((?:WC+[\/:])*)/.source.replace("WC",Yr),Jf=/(WCOD+)?/.source.replace("WCOD",Xf),Kf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Yr),qf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Yr),jf=new RegExp("^"+zf+Jf+Kf+qf+"$"),$f=["material","materials","bones","map"],Hr=class{constructor(e,t,n){let s=n||je.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},je=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Zf,"")}static parseTrackName(e){let t=jf.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);$f.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=n(a.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[s];if(o===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};je.Composite=Hr;je.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};je.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};je.prototype.GetterByBindingType=[je.prototype._getValue_direct,je.prototype._getValue_array,je.prototype._getValue_arrayElement,je.prototype._getValue_toArray];je.prototype.SetterByBindingTypeAndVersioning=[[je.prototype._setValue_direct,je.prototype._setValue_direct_setNeedsUpdate,je.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[je.prototype._setValue_array,je.prototype._setValue_array_setNeedsUpdate,je.prototype._setValue_array_setMatrixWorldNeedsUpdate],[je.prototype._setValue_arrayElement,je.prototype._setValue_arrayElement_setNeedsUpdate,je.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[je.prototype._setValue_fromArray,je.prototype._setValue_fromArray_setNeedsUpdate,je.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var ip=new Float32Array(1);typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Gr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Gr);var As="1.1.304-builder-3-opaque-multishell-core",Wr=398106;
function tp(i,e,t,n,s){
  i.computeBoundingBox();
  let r=i.boundingBox,o=i.getAttribute("position"),a=(r.min.x+r.max.x)*.5,c=(r.min.z+r.max.z)*.5,l=r.min.y,h=Math.max(r.max.y-r.min.y,1e-6),d=Math.cos(s),f=Math.sin(s),E=new Float32Array(o.count*3);
  for(let m=0;m<o.count;m+=1){
    let D=m*3,p=o.getX(m)-a,u=o.getZ(m)-c,w=p*d-u*f,C=p*f+u*d,S=Math.max(0,Math.min(1,(o.getY(m)-l)/h)),T=Math.min(Math.pow(S,1.1)*t,n);
    E[D]=a+w*e;
    E[D+1]=l+T*h;
    E[D+2]=c+C*e;
  }
  let y=new Wt;
  y.setAttribute("position",new Tt(E,3));
  y.computeBoundingBox();
  y.computeBoundingSphere();
  let F=new si({color:Wr,side:bt,depthTest:!0,depthWrite:!0,blending:Gt,toneMapped:!1,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1}),A=new vt(y,F);
  A.name="rf-inset-topology-core";
  A.renderOrder=-1;
  A.userData.rfInsetSolidCore=!0;
  A.userData.rfInsetSolidCoreVersion=As;
  A.userData.rfInsetSolidCoreColour=Wr;
  A.userData.rfInsetSolidCoreMethod="staggered-scaled-source-topology";
  return A;
}
var Xr=class extends vt{
  constructor(e,t){
    super(e,t);
    if(e?.userData?.rfTwoLayerTopologyForks360Mesh!==!0)return;
    t.transparent=!1;
    t.opacity=1;
    t.depthTest=!0;
    t.depthWrite=!0;
    t.blending=Gt;
    t.needsUpdate=!0;
    this.add(
      tp(e,.955,.90,.84,.055),
      tp(e,.91,.82,.76,-.105),
      tp(e,.86,.74,.68,.175)
    );
    this.name="rf-builder-3-single-three-layer-mountain";
    this.userData.rfSolidCoreVersion=As;
    this.userData.rfExteriorGeometryPreserved=!0;
    this.userData.rfOpaqueMultishellCore=!0;
  }
};var np=Object.freeze({ACESFilmicToneMapping:Nr,Box3:sn,BufferAttribute:Mt,BufferGeometry:Wt,Color:We,DoubleSide:bt,Float32BufferAttribute:Tt,Fog:ps,Mesh:Xr,MeshBasicMaterial:si,NoBlending:Gt,PerspectiveCamera:Dt,Scene:Es,ShaderMaterial:Ot,SRGBColorSpace:it,Vector2:Ze,Vector3:H,WebGLRenderer:xi})
;
(async () => {
  "use strict";
  const i = "1.1.354-builder-3-promoted-spiky-opaque-relief-v2";
  const e = np;
  const ED = 0x02131f;
  const INTERNAL_DOT_COLOUR = 0x10c7d6;

  function AD(G) {
    G.computeBoundingBox();

    const Z = G.boundingBox;
    const r = G.getAttribute("position");

    if (!Z || !r || r.count < 3) {
      throw new Error("Builder 3 core source geometry is unavailable.");
    }

    const L = (Z.min.x + Z.max.x) * 0.5;
    const X = (Z.min.z + Z.max.z) * 0.5;
    const H = Z.min.y;
    const m = Math.max(Z.max.y - Z.min.y, 1e-6);
    const segments = 96;
    const rings = 48;
    const topScale = 1.0;
    const bottomLift = m * 0.006;
    const profile = Array.from(
      { length: rings + 1 },
      () => new Float32Array(segments)
    );

    for (let d = 0; d < r.count; d += 1) {
      const q = r.getX(d) - L;
      const y = r.getZ(d) - X;
      const radius = Math.hypot(q, y);

      if (!Number.isFinite(radius) || radius <= 1e-8) {
        continue;
      }

      let angle = Math.atan2(y, q);

      if (angle < 0) {
        angle += Math.PI * 2;
      }

      const bin = Math.min(
        segments - 1,
        Math.floor((angle / (Math.PI * 2)) * segments)
      );
      const height = Math.max(
        0,
        Math.min(1, (r.getY(d) - H) / m)
      );
      const highestLevel = Math.min(
        rings,
        Math.floor(height * rings)
      );

      for (let level = 0; level <= highestLevel; level += 1) {
        if (radius > profile[level][bin]) {
          profile[level][bin] = radius;
        }
      }
    }

    for (let level = 0; level <= rings; level += 1) {
      const row = profile[level];

      for (let pass = 0; pass < 5; pass += 1) {
        const copy = row.slice();

        for (let bin = 0; bin < segments; bin += 1) {
          if (copy[bin] > 0) {
            continue;
          }

          const left = copy[(bin - 1 + segments) % segments];
          const right = copy[(bin + 1) % segments];

          row[bin] = Math.max(left, right);
        }
      }

      for (let pass = 0; pass < 3; pass += 1) {
        const copy = row.slice();

        for (let bin = 0; bin < segments; bin += 1) {
          const left = copy[(bin - 1 + segments) % segments];
          const centre = copy[bin];
          const right = copy[(bin + 1) % segments];

          row[bin] = left * 0.2 + centre * 0.6 + right * 0.2;
        }
      }
    }

    for (let level = 1; level <= rings; level += 1) {
      for (let bin = 0; bin < segments; bin += 1) {
        profile[level][bin] = Math.min(
          profile[level][bin],
          profile[level - 1][bin] * 0.985
        );
      }
    }

    const positions = [];
    const indices = [];
    const bottomCentre = 0;

    positions.push(L, H + bottomLift, X);

    for (let level = 0; level <= rings; level += 1) {
      const levelRatio = level / rings;
      const baseY = H + bottomLift + levelRatio * m * topScale;
      const radialScale = 1.0;
      const stagger = level % 2 === 0 ? 0 : 0.47;

      for (let bin = 0; bin < segments; bin += 1) {
        const noise = Math.sin(bin * 78.233 + level * 12.9898) * 43758.5453;
        const random = noise - Math.floor(noise);
        const angleJitter = (random - 0.5) * 0.24;
        const angle = ((bin + stagger + angleJitter) / segments) * Math.PI * 2;
        const heightJitter = (random - 0.5) * m * 0.0080 * (1 - levelRatio * 0.46);
        const radiusJitter = 1.0 + (random - 0.34) * 0.030 * (0.58 + levelRatio * 0.42);
        const radius = Math.max(
          m * 0.008,
          profile[level][bin] * radialScale * radiusJitter
        );

        positions.push(
          L + Math.cos(angle) * radius,
          baseY + heightJitter,
          X + Math.sin(angle) * radius
        );
      }
    }

    const firstRing = 1;

    for (let bin = 0; bin < segments; bin += 1) {
      const next = (bin + 1) % segments;

      indices.push(
        bottomCentre,
        firstRing + next,
        firstRing + bin
      );
    }

    for (let level = 0; level < rings; level += 1) {
      const current = firstRing + level * segments;
      const nextRing = current + segments;

      for (let bin = 0; bin < segments; bin += 1) {
        const next = (bin + 1) % segments;
        const a = current + bin;
        const b = current + next;
        const c = nextRing + bin;
        const d = nextRing + next;

        if ((level + bin) % 2 === 0) {
          indices.push(a, b, c, b, d, c);
        } else {
          indices.push(a, b, d, a, d, c);
        }
      }
    }

    const topCentre = positions.length / 3;

    positions.push(L, H + bottomLift + m * topScale, X);

    const finalRing = firstRing + rings * segments;

    for (let bin = 0; bin < segments; bin += 1) {
      const next = (bin + 1) % segments;

      indices.push(
        finalRing + bin,
        finalRing + next,
        topCentre
      );
    }

    const W = new e.BufferGeometry();

    W.setAttribute(
      "position",
      new e.Float32BufferAttribute(positions, 3)
    );
    W.setIndex(indices);
    W.computeVertexNormals();
    W.computeBoundingBox();
    W.computeBoundingSphere();

    const faceted = W.toNonIndexed();
    W.dispose();
    faceted.computeBoundingBox();
    faceted.computeBoundingSphere();

    // Per-triangle shell colour: mostly dark teal, with fewer mid and bright
    // triangles toward ridges and height. This avoids a single continuous cyan.
    const shellPosition = faceted.getAttribute("position");
    const shellColours = new Float32Array(shellPosition.count * 3);
    const shellPalette = [0x043b45, 0x075d68, 0x0a838d, 0x16bcc4];
    for (let face = 0; face < shellPosition.count; face += 3) {
      const ax = shellPosition.getX(face), ay = shellPosition.getY(face), az = shellPosition.getZ(face);
      const bx = shellPosition.getX(face + 1), by = shellPosition.getY(face + 1), bz = shellPosition.getZ(face + 1);
      const cx = shellPosition.getX(face + 2), cy = shellPosition.getY(face + 2), cz = shellPosition.getZ(face + 2);
      const centreX = ((ax + bx + cx) / 3) - L;
      const centreZ = ((az + bz + cz) / 3) - X;
      const heightRatio = Math.max(0, Math.min(1, (((ay + by + cy) / 3) - H) / Math.max(m * topScale, 1e-6)));
      const radialExtent = Math.max(Z.max.x - L, L - Z.min.x, Z.max.z - X, X - Z.min.z, 1e-6);
      const radialRatio = Math.max(0, Math.min(1, Math.hypot(centreX, centreZ) / radialExtent));
      const middleBand = Math.max(0, 1 - Math.abs(heightRatio - 0.46) / 0.43);
      const ridgeBand = middleBand * Math.pow(radialRatio, 1.18);
      const seed = Math.sin((ax + bx + cx) * 37.7 + (ay + by + cy) * 21.3 + (az + bz + cz) * 53.1) * 43758.5453;
      const random = seed - Math.floor(seed);
      const highlight = ridgeBand * 0.80 + heightRatio * 0.16 + random * 0.10;
      let tier = 0;
      if (highlight > 0.78) tier = 3;
      else if (highlight > 0.52) tier = 2;
      else if (highlight > 0.27) tier = 1;
      const colour = new e.Color(shellPalette[tier]);
      const inwardDarkening = 0.50 + radialRatio * 0.20;
      const ridgeLift = ridgeBand * 0.30 + heightRatio * 0.06;
      colour.multiplyScalar(Math.max(0.38, Math.min(1.08, inwardDarkening + ridgeLift)));
      for (let corner = 0; corner < 3; corner += 1) {
        const offset = (face + corner) * 3;
        shellColours[offset] = colour.r;
        shellColours[offset + 1] = colour.g;
        shellColours[offset + 2] = colour.b;
      }
    }
    faceted.setAttribute("color", new e.Float32BufferAttribute(shellColours, 3));

    // Separate visual gap network: it is a wire-only shell, not the solid core.
    // The exterior mesh occludes it wherever real surface triangles exist.
    const shellMaterial = new e.ShaderMaterial({
      transparent: false,
      depthTest: true,
      depthWrite: true,
      side: e.DoubleSide,
      toneMapped: false,
      vertexShader: `
        attribute vec3 color;
        varying vec3 vColour;
        varying vec3 vViewPosition;
        void main() {
          vColour = color;
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = viewPosition.xyz;
          gl_Position = projectionMatrix * viewPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColour;
        varying vec3 vViewPosition;
        void main() {
          vec3 faceNormal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
          if (!gl_FrontFacing) faceNormal = -faceNormal;
          vec3 keyDirection = normalize(vec3(-0.36, 0.80, 0.47));
          vec3 fillDirection = normalize(vec3(0.68, 0.24, 0.63));
          float keyLight = max(dot(faceNormal, keyDirection), 0.0);
          float fillLight = max(dot(faceNormal, fillDirection), 0.0);
          float topLight = max(faceNormal.y, 0.0);
          float facetShade = 0.50 + keyLight * 0.34 + fillLight * 0.12 + topLight * 0.10;
          vec3 colour = vColour * facetShade;
          gl_FragColor = vec4(clamp(colour, 0.0, 1.0), 1.0);
          #include <colorspace_fragment>
        }
      `
    });
    const k = new e.Mesh(faceted, shellMaterial);
    k.renderOrder = -0.5;
    k.userData.rfGapNetworkShell = true;
    k.userData.rfGapNetworkPalette = ["#043b45", "#075d68", "#0a838d", "#16bcc4"];

    // The actual internal mountain is smaller and fully opaque. Its base is only
    // slightly bluer than the page background. The reference uses a dense field
    // of tiny surface pinpricks, not one large dot at each triangle centre, so
    // the internal dots are a separate randomly sampled micro-quad cloud.
    const coreGeometry = faceted.clone();
    const corePosition = coreGeometry.getAttribute("position");
    const coreMaterial = new e.MeshBasicMaterial({
      color: ED,
      transparent: false,
      opacity: 1,
      side: e.DoubleSide,
      depthTest: true,
      depthWrite: true,
      toneMapped: false
    });
    coreMaterial.name = "rf-contained-solid-core-blue-base-material";

    const solidCore = new e.Mesh(coreGeometry, coreMaterial);
    solidCore.name = "rf-contained-solid-core-fine-blue-dots";
    solidCore.scale.set(0.92, 0.96, 0.92);
    solidCore.renderOrder = -2;
    solidCore.userData.rfContainedSolidCore = true;
    solidCore.userData.rfContainedSolidCoreDots = true;
    solidCore.userData.rfContainedSolidCoreColour = ED;

    const dotPositions = [];
    const dotUvs = [];
    const dotStrengths = [];
    const dotSizes = [];
    const hash01 = (value) => {
      const noise = Math.sin(value) * 43758.5453123;
      return noise - Math.floor(noise);
    };
    const pushDotQuad = (point, tangent, bitangent, normal, radius, lift, strength) => {
      const centre = [
        point[0] + normal[0] * lift,
        point[1] + normal[1] * lift,
        point[2] + normal[2] * lift
      ];
      const tx = tangent[0] * radius, ty = tangent[1] * radius, tz = tangent[2] * radius;
      const bx = bitangent[0] * radius, by = bitangent[1] * radius, bz = bitangent[2] * radius;
      const corners = [
        [centre[0] - tx - bx, centre[1] - ty - by, centre[2] - tz - bz],
        [centre[0] + tx - bx, centre[1] + ty - by, centre[2] + tz - bz],
        [centre[0] + tx + bx, centre[1] + ty + by, centre[2] + tz + bz],
        [centre[0] - tx + bx, centre[1] - ty + by, centre[2] - tz + bz]
      ];
      const order = [0, 1, 2, 0, 2, 3];
      const uv = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
      order.forEach((index) => {
        dotPositions.push(...corners[index]);
        dotUvs.push(...uv[index]);
        dotStrengths.push(strength);
        dotSizes.push(radius);
      });
    };

    let internalDotCount = 0;
    const coreHeight = Math.max(m * topScale, 1e-6);
    for (let face = 0; face < corePosition.count; face += 3) {
      const a = [corePosition.getX(face), corePosition.getY(face), corePosition.getZ(face)];
      const b = [corePosition.getX(face + 1), corePosition.getY(face + 1), corePosition.getZ(face + 1)];
      const c = [corePosition.getX(face + 2), corePosition.getY(face + 2), corePosition.getZ(face + 2)];
      const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const normal = [
        ab[1] * ac[2] - ab[2] * ac[1],
        ab[2] * ac[0] - ab[0] * ac[2],
        ab[0] * ac[1] - ab[1] * ac[0]
      ];
      const normalLength = Math.hypot(normal[0], normal[1], normal[2]);
      const tangentLength = Math.hypot(ab[0], ab[1], ab[2]);
      if (normalLength <= 1e-10 || tangentLength <= 1e-10) continue;
      normal[0] /= normalLength; normal[1] /= normalLength; normal[2] /= normalLength;
      const faceCentre = [
        (a[0] + b[0] + c[0]) / 3,
        (a[1] + b[1] + c[1]) / 3,
        (a[2] + b[2] + c[2]) / 3
      ];
      const outward = [
        faceCentre[0] - L,
        (faceCentre[1] - (H + m * 0.36)) * 0.35,
        faceCentre[2] - X
      ];
      if (normal[0] * outward[0] + normal[1] * outward[1] + normal[2] * outward[2] < 0) {
        normal[0] *= -1; normal[1] *= -1; normal[2] *= -1;
      }
      const tangent = [ab[0] / tangentLength, ab[1] / tangentLength, ab[2] / tangentLength];
      const bitangent = [
        normal[1] * tangent[2] - normal[2] * tangent[1],
        normal[2] * tangent[0] - normal[0] * tangent[2],
        normal[0] * tangent[1] - normal[1] * tangent[0]
      ];
      const centreY = (a[1] + b[1] + c[1]) / 3;
      const heightRatio = Math.max(0, Math.min(1, (centreY - H) / coreHeight));
      const faceSeed = face * 0.071 + (a[0] + b[0] + c[0]) * 91.7 + (a[2] + b[2] + c[2]) * 57.3;
      const point = [
        (a[0] + b[0] + c[0]) / 3,
        (a[1] + b[1] + c[1]) / 3,
        (a[2] + b[2] + c[2]) / 3
      ];
      const sizeSeed = hash01(faceSeed + 5.9);
      const strengthSeed = hash01(faceSeed + 7.3);
      const radius = (0.00115 + sizeSeed * 0.00020) * 3.0;
      const strength = 0.90 + strengthSeed * 0.10;
      const lift = 0.00110 + radius * 0.12;
      pushDotQuad(point, tangent, bitangent, normal, radius, lift, strength);
      internalDotCount += 1;
    }

    const dotGeometry = new e.BufferGeometry();
    dotGeometry.setAttribute("position", new e.Float32BufferAttribute(dotPositions, 3));
    dotGeometry.setAttribute("dotUv", new e.Float32BufferAttribute(dotUvs, 2));
    dotGeometry.setAttribute("dotStrength", new e.Float32BufferAttribute(dotStrengths, 1));
    dotGeometry.computeBoundingSphere();

    const dotMaterial = new e.ShaderMaterial({
      transparent: true,
      depthTest: true,
      depthWrite: false,
      toneMapped: false,
      side: e.DoubleSide,
      uniforms: {
        uDotDim: { value: new e.Color(INTERNAL_DOT_COLOUR) },
        uDotBright: { value: new e.Color(0x29f1ff) }
      },
      vertexShader: `
        attribute vec2 dotUv;
        attribute float dotStrength;
        varying vec2 vDotUv;
        varying float vDotStrength;

        void main() {
          vDotUv = dotUv;
          vDotStrength = dotStrength;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vDotUv;
        varying float vDotStrength;
        uniform vec3 uDotDim;
        uniform vec3 uDotBright;

        void main() {
          float radius = length(vDotUv);
          if (radius > 1.12) discard;
          float core = 1.0 - smoothstep(0.08, 0.24, radius);
          float innerGlow = 1.0 - smoothstep(0.14, 0.54, radius);
          float outerGlow = 1.0 - smoothstep(0.34, 1.12, radius);
          float alpha = (core * 0.82 + innerGlow * 0.34 + outerGlow * 0.18) * vDotStrength;
          float brightness = clamp(core * 0.34 + innerGlow * 0.20 + outerGlow * 0.08, 0.0, 0.52);
          vec3 colour = mix(uDotDim, uDotBright, brightness);
          gl_FragColor = vec4(colour, alpha);
          #include <colorspace_fragment>
        }
      `
    });
    dotMaterial.name = "rf-contained-core-fine-pinpoint-dot-material";

    const dotCloud = new e.Mesh(dotGeometry, dotMaterial);
    dotCloud.name = "rf-contained-core-fine-pinpoint-dots";
    dotCloud.renderOrder = -1.5;
    dotCloud.frustumCulled = false;
    dotCloud.userData.rfInternalDotCount = internalDotCount;
    dotCloud.userData.rfInternalDotStyle = "one-centre-triple-glow-cyan-dot-per-triangle";
    dotCloud.userData.rfInternalDotColour = INTERNAL_DOT_COLOUR;
    solidCore.userData.rfContainedSolidCoreDotCount = internalDotCount;
    solidCore.userData.rfContainedSolidCoreDotColour = INTERNAL_DOT_COLOUR;
    solidCore.add(dotCloud);
    k.add(solidCore);

    k.name = "rf-closed-envelope-core";
    k.renderOrder = -0.5;
    k.userData.rfInsetSolidCore = true;
    k.userData.rfInsetSolidCoreVersion = i;
    k.userData.rfInsetSolidCoreColour = ED;
    k.userData.rfInsetSolidCoreMethod = "varied-triangle-wire-gap-shell-plus-two-cyan-pinpoints-per-triangle-deep-solid-core";
    k.userData.rfInsetSolidCoreDots = true;
    k.userData.rfInsetSolidCoreDotColour = INTERNAL_DOT_COLOUR;
    k.userData.rfInsetSolidCoreClosed = true;
    k.userData.rfInsetSolidCoreSegments = segments;
    k.userData.rfInsetSolidCoreRings = rings;
    k.userData.rfInsetSolidCoreHeightScale = 0.912;
    k.userData.rfInsetSolidCoreRadialScale = [0.851, 0.837];
    k.userData.rfGapNetworkShellRadialScale = [0.925, 0.91];

    return k;
  }
  class GD extends e.Mesh {
    constructor(Y, t) {
      super(Y, t);

      if (Y?.userData?.rfTwoLayerTopologyForks360Mesh === true) {
        t.transparent = false;
        t.opacity = 1;
        t.depthTest = true;
        t.depthWrite = true;
        t.blending = e.NoBlending;
        t.needsUpdate = true;

        this.clear();
        t.visible = false;
        const promotedExterior = AD(Y);
        promotedExterior.name = "rf-spiky-faceted-opaque-exterior-relief-v2";
        promotedExterior.renderOrder = 0;
        promotedExterior.userData.rfPromotedExterior = true;
        promotedExterior.userData.rfOpaque = true;
        promotedExterior.userData.rfRidgesRestored = true;
        promotedExterior.userData.rfFacetReliefBoosted = true;
        promotedExterior.userData.rfSource = "existing-AD-closed-envelope-shell";
        this.add(promotedExterior);
        this.name = "rf-builder-3-promoted-spiky-opaque-relief-v2";
        this.userData.rfSolidCoreVersion = "1.1.354-builder-3-promoted-spiky-opaque-relief-v2";
        this.userData.rfExteriorGeometryPreserved = false;
        this.userData.rfClosedEnvelopeCore = false;
        this.userData.rfPromotedSpikyExterior = true;
        this.userData.rfRidgesRestored = true;
        this.userData.rfFacetReliefBoosted = true;
      }
    }
  }
  const oD = Object.freeze({ ACESFilmicToneMapping: e.ACESFilmicToneMapping, Box3: e.Box3, BufferAttribute: e.BufferAttribute, BufferGeometry: e.BufferGeometry, Color: e.Color, DoubleSide: e.DoubleSide, Float32BufferAttribute: e.Float32BufferAttribute, Fog: e.Fog, Mesh: GD, PerspectiveCamera: e.PerspectiveCamera, Scene: e.Scene, ShaderMaterial: e.ShaderMaterial, SRGBColorSpace: e.SRGBColorSpace, Vector2: e.Vector2, Vector3: e.Vector3, WebGLRenderer: e.WebGLRenderer });
  globalThis.FieldOpsRFThreeSolidCore = Object.freeze({ VERSION: i, integrated: !0, coreColour: ED, coreDotColour: INTERNAL_DOT_COLOUR, coreShellCount: 1, coreMethod: "varied-gap-network-plus-one-centre-triple-glow-cyan-dot-per-triangle-deep-solid-core", exteriorGeometryPreserved: !0, runtime: "embedded-tree-shaken-three-0.160.0" }), globalThis.FieldOpsRFMountainThreeLayer = Object.freeze({ VERSION: i, layers: Object.freeze(["embedded-three-runtime", "deep-solid-core", "one-centre-triple-glow-cyan-dot-per-triangle-cloud", "separated-gap-network-shell", "builder-3-surface", "fork-gap-blended-mid-lower-exterior-skin"]) }), (() => {
    "use strict";
    let G = "1.1.354-builder-3-promoted-spiky-opaque-relief-v2", Y = "three-faceted-cyan-fork-gap-blended-skin-fine-internal-pinpoints-opaque-360", t = "[data-rf-graph]", b = ".rf-map-paper", f = ".rf-graph-key", Z = "fieldops:rf-graph-rendered", r = "site-1-to-site-2", L = Math.PI / 180, X = 0, H = Object.freeze({ name: "Faceted cyan surface ridges with restored mid-lower exterior skin and contained fine-pinpoint core", version: "1.0.0", builderVersion: "1.1.354-builder-3-promoted-spiky-opaque-relief-v2", vertexCount: 8143, faceCount: 12816, indexCount: 38448, boundsMin: [-0.7897142390143058, -0.4, -0.7853454034795696], quantScale: [23585593790028153e-21, 13865862283148762e-21, 23923212765230006e-21], center: [-0.016873294499558322, 0.054349642363077044, -0.0014415291948953746], majorPeaks: [{ name: "main", role: "layer1-main", centreXZ: [0, -5e-3], baseY: 0.06, peakY: 0.5086992847261541, radiusCore: 0.118, radiusOuter: 0.29, strength: 1 }, { name: "shoulder-left", role: "layer2-shoulder", centreXZ: [-0.08688712966525691, -0.005687899460723678], baseY: -0.055, peakY: 0.3510444305667527, radiusCore: 0.072, radiusOuter: 0.19, strength: 1.02 }, { name: "shoulder-right", role: "layer2-shoulder", centreXZ: [0.07337698013798444, -0.004132890630983765], baseY: -0.055, peakY: 0.36237284005208525, radiusCore: 0.072, radiusOuter: 0.19, strength: 1.02 }, { name: "shoulder-front", role: "layer2-shoulder", centreXZ: [-0.014408599948500411, 0.09120111223845784], baseY: -0.055, peakY: 0.32553124396575894, radiusCore: 0.078, radiusOuter: 0.205, strength: 1 }, { name: "shoulder-rear", role: "layer2-shoulder", centreXZ: [0.0026909555492700132, -0.06296007082068433], baseY: -0.055, peakY: 0.37829084995314, radiusCore: 0.074, radiusOuter: 0.195, strength: 1 }, { name: "fork-front-right", role: "layer2-fork", centreXZ: [0.303053492, 0.302754083], baseY: -0.37, peakY: 0.043471873, radiusCore: 0.055, radiusOuter: 0.78, strength: 1 }, { name: "fork-front-centre", role: "layer2-fork", centreXZ: [-0.011436815, 0.239501108], baseY: -0.37, peakY: 0.081131555, radiusCore: 0.05, radiusOuter: 0.78, strength: 1 }, { name: "fork-front-left", role: "layer2-fork", centreXZ: [-0.302058502, 0.314715689], baseY: -0.37, peakY: 0.034833441, radiusCore: 0.055, radiusOuter: 0.78, strength: 1 }, { name: "fork-rear-left", role: "layer2-fork", centreXZ: [-0.300053726, -0.303388359], baseY: -0.37, peakY: 0.041461323, radiusCore: 0.055, radiusOuter: 0.78, strength: 1 }, { name: "fork-rear-centre", role: "layer2-fork", centreXZ: [-0.025989126, -0.252073068], baseY: -0.37, peakY: 0.027955974, radiusCore: 0.05, radiusOuter: 0.78, strength: 1 }, { name: "fork-rear-right", role: "layer2-fork", centreXZ: [0.295081562, -0.311785407], baseY: -0.37, peakY: 0.043166824, radiusCore: 0.055, radiusOuter: 0.78, strength: 1 }], opaqueSurface: !0, transparent: !1, coreMethod: "varied-gap-network-plus-fine-pinpoint-deep-solid-core", coreShellCount: 1 }), m = ["SX8AAMMAyX7zAhUDf3/DBLMCtn8AAAAAS2oAAO0CZGpTACQDW2oAAA4DnWgAADUDi2hfAFEDm2gAAA8DeEMAAJoDWkM9ALwDk0MAAJgD0UUAAEoFeEX1AEIG",
    "d0UAAFEFA8kFAE4D/skYAroFJsoAAKYFDckAAGIDuK6KAGwFA7A/AY8F8K4AAI4Ebq4AAOAEF7AAAKQEEIDyCawFQa8AAOEEi3B0BCwFh3BxBw0H4HHDB7EG",
    "kndkBiwGXHvRCVcGZHoDBloFd0RpA7oGUnzKCdwHP3zJD0EItHA+DFIJv36oDXEHiID6DToJqK+4AtUI6FYLAu4Hf1MlBO4IB1fbAVYGIrByBhIKb1cxBBYJ",
    "2DGGAyEJAzMyBQcKZTIAANkFPzIAAOoFwsl0CZoKK8oAAOoFeU07BJEHoU0pBJ0IdF3AAWUHrFuTBD4KFl7GAq0HGctVC1kMPMoAAPQF2XHsDjQMvnu0EpgK",
    "6q6SBhAKvHBxDksMLY2xDPoI4I41D4kKwY3cDrgL5K9BCCMNEFf2CDANSVhLB3sKhpW4DBgLgpbsDMUKJJZQDZAMjI1lE/EMZogyFPkMT4gSFowMWYw1FOYL",
    "/VcNChYQzrK4B88MAlitC+sPtMcpCvQLx8TfDHENgsc9DbQMn3GUEyoOlZErE0QNc4CpEmcL5n9qHYYOgYE+F9YMcC7oBIELBy4VCkMQbS5AClwOZVz5Ch0O",
    "M1ybCuYPw0v4C5kOTU4dDcwOvU+HCvQNT4BfGiwPinptF3sN5nv9HXwPe3wqHBEPzVGlClIOf8OGEVYQj8OtDP8MlcscFLcQ/8o3EKoP44f5Hi4PQYi+H2UQ",
    "o4gVGVwOQi4ODzATqE28DXsQh3jkGHYPcH11IbUQ8FuUDx8UvsQWEsYROTxdENIP5DrMFosSljwcFn0SsX8EKOoRIlWFDMUS7tXUCqAO+9WKCwERX9SQD4kQ",
    "r7w9DpwPvL2ZDlcR5brbDJ8QJm/8FQoSrXEfGMQRCG+QE34QPnOqGToRRoDwIY8ReIbTIyESEIQJH88PYoKfJiYTmDL+CbgNJjLLEa0UXjJSDqwPeNRpD24R",
    "fr/xEp4SAdSBENcRh8RbFaISDHY3HOQSTHVnGiYSmoTNIP4RdnwnIXESXC6oDvMUn01WEogTr01FDmsThdSzD4IRDdMQEnMSdtN6ETgSYcOkF+gTWnhOGugS",
    "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",
    "An4mOptdoHvSPYFdNXk9PqJdsJumPTJeNruJPLFd/ldSPlxd5YiiPxpe/kq9QIlfH4X4QXtcl4s7Rl9dP6FrQetcwU+ORNJcxIfSRpRdYZADS21cSpEKR7Nc",
    "D464Rp9d5EbfZSFdOEvmZKxecJz2aJtc+50hZvdbOp29ZJ9eAbKOaQZfsKk3anRdfL6ibWNeyILPll9fxYJnF71fP6RvO6tdL7JVOUhf6IVePp1diaH2O/Bd",
    "nWuiPyNeO4SRPZtd7IuwQt5d2I59QaJdnE25QfteRKhvQaJhZGVlRPNf/GQgQS5f1HMlQmxeJqCFQn5eaoTVRkJetrpfQd9etWTdReFelZHASJhdK5XZR41c",
    "tT7US8xdzELRV3RdiT82SnVec0TyZFleM0tUaP1e3bKeZR9fIkb1bZpeWauRaRFfPUjebYVfNHlMe6xb93iYgo5eDHqPgQRemHpnhRReaYStm8lfpoUWGzRg",
    "CyMoHURcvyKNHfVeOSWZIaBfbLN8N4tfK1whOoxh0Ya0PWxePrgoPhRgFnQBP9teu7DUQylem7MHRj1fwUE8WeVeKEOpWtxbxUMCXt1d6kUSYV1fplaSY41i",
    "kp+5ZcJfV6NXaflf5aPqZPheQb69Z5FeS8DqYaJfFqqhZR9f3LxNaRpfxXhnfVleloPlgddc4oQehaxe1oPHgFBeVon1izlgDIx2gIZdEYF+jy1f04QFkg5f",
    "1bTXObxfxn96OsRe31uNPV1i5buEOnBgLIpDPe5fNl1LQWNgfncRPsBeBKFqPztfkYf+QWBe5IpYQs5fWlGmRQNg8HJfQsFgAz2ASc1eoEM3VwFf8F43ZZZf",
    "cGIRY39fR1C/Z6VhFU/0aS9fZrnkZ71fzLb3Zg9fK2w5bLJdmWw5bvheAm8rcOVfnW85dGNe44tfhutfkxJxD9tdzxGkDM1h+xAcDbhdfOHbIkJfJYIePItg",
    "tbq7PcJfJXeyPE9gI7cNOihfjbj1OUhgE2/ZPCZgxGyROn5gXGSCPFFf7GLLPa5ia7dUQthfLWf0PZRf94R4PwZh2XZ6P4xh34tYQCtgc4xNReJgLqe8Qodh",
    "UU1JQ/pgpq9PRU5eTEB4TzZfZmILZ+9fh6oAZu1gj2iYaIVfv3Fed/5feIvTgdBfBnj8hGtgw4iQiS1hl38alOpgbIGjoOtfC46JIWVlxJTcLrdkUF1JO01i",
    "e59iPChhukkpPP5iYmu6Pmdhj5TDOy5g0pIYP89fZJWtP4xgkpkyPlVgi3MQQFFhlKlKQXhixWvXQZlgK1EuQQFicojVQtJh17IYRTRhDGxpRSFgh2/7Rsdg",
    "kjvMRldgjTgDQilgHYoWRo1hw4NnR9pgioUOSd9ggYVQR9NfKkSqXgZgcmGvZBJh6r+8YmhhD0xwZHRhmb7VaFphhnQcfwtjAna9hF5gO3Rje/hfbXqehTxg",
    "rXt1iV1gxHkeipVhr4ELkH9gwoWemv1gpH34ljdgdBMLD/dh+SVPJldiHSfmIcJg71xyPndiuZtlPA9iypqsPMtfuG52Pk5hL5RkPtZh/EzTQtxi8k98QUFj",
    "GV/ZQpdhsIZNQ/9gEZ6UQ0lhwJ3ERYZfp1l8QetgqXG0RYhhSoP6Qn9icbYKZLlhCqMcZu5hz7LmZGBiIbv9ZLJiCFd4Z4JinIILin9geIG2ho5h1n86i7pg",
    "54aciFVgI39cjdVgCYbNjrdh1YkFkFZh44dllFlgYnmHjVVhPn2mkPph54RElENhqnpyk0RiA37GmqNhDBmUFJ5hJRmyFKdh/hiFFJdhUxnlFLZhJxmzFKhh",
    "iSTwIEhie4AgOR5j3K+oOc9f6613OqJi56/fPVZiV88HPUJgd9DsO3dhw8yfP/BhBWBoPZ9ifGD9PT5gFWSvQX9ipLpPQOdhOYTGP5liXc1PQsxhilu+QQdi",
    "EGw6RbVhPU0fRtZipk2nSGlhZXMcSfJhG3crSvdfqXiiSFVgN3fdSeVh7IaOSGZj18P7UYthW8cCTyFiYMStUKZiqkkCZvFhY4rvitxh5YHCjlhiKIJ1l3xh",
    "U4cvl4ZifYVQoUljgX6wCgxkV3y4EHxjFBmdFKBhdRkKFcJhIRrFFfJhGR6pGmBi5SBiHgVihCJtHeVilyRpJMJis7F1PJ1ixIelPcpjtXikQgZkt4rCQsph",
    "+FhTQBFk8l4BQXhi3LJRQMJiP6UwQ4dhI6b5P1ti88nQPrJiIVLdQsNkoV72RfRic70OZFVjlaoqZM5iTKqlZrRkcHdcg/RiPXrNiphj5n/djy1i74OrkyJj",
    "cIFZoYFiFBUcFPBkBRWrEe1hhxkeFcxhxBpKFmli/hvRF6lhgh5THFZkNLmLOnxj1bpIPc9j9bvNOcVjq3YpPq5loWRVQ39ktnEWQZNjNHsOQ35j9XpFPudj",
    "03M2Qt9kaowOQpVj3sssQjhklYp+Repj4ITcQiFkAIbkRZJi+qfaQopjhFqGYxVjvluaZ5ZhWkiBZOBilkgUZyFke6AkZU5jcaSsZXZlA3eYhD1kc4fKjlti",
    "j4luj8tigXlgjIVjpIask3NiU4LdleZjuIZhmuNjtICGC1Fl15zPPFplF5sdOyRlJILAOihl+VsLQOFjFYlVPS9ma5tUPlhl8ZSvPR5kGJMRP15kmbJdPhNl",
    "4LyRP7tizsoKPoRkmm/KPfhjO3P9PZVkjXaPQhhjhorkQCpksHwFP91jF5dsQQZkBJV9QXZkjqUkQBdlh1HpQrpmD3y+SMVjj323SPxhZn49RzZl8LetRUdl",
    "oH6+SQ1lqsgIS4JjAqQuY9pkiEm4YxlmS1qrZ6NlCpujbjJkQp7Ea5ZkmZ2haWJka5ChgBtkeo4pg89jso/DhgZjd4j3ji1kfoqKkPlj536hlBhkN39+l6ti",
    "eYPkoy9kGYfJFmZlSB5cGsZlduLNIOxnGeLqIupk4eIHITJlD3+5Owtmf4AeOjVnZn8mPy1k8oWhOutlZo2YPclkM42+Quhl0LrbPxRm5pn+QK5j8pkRRUFk",
    "34L8RsxjwoW7RdNk57OYYsxkurFlYxtkX7uHYaFlcLocYdZid0i6YFlnQ1LcZS5jmE/zY6tjUFCOZWNlcWFHZjljtGDHaLVk+WHrZc5kmF7QZv9jjpgmcthj",
    "jpqrc7NlrovOjlxlAogrlipl9oPbmKhjmoDsm9lkUyQIJLFliSaQJ6hlNH/CN55m1JCHPS1ljpBTQBFk/UidPiRmhG9tQP5keYFjQmdnaZ9JQBdlvaFVPrdl",
    "KanvPw1oQI0tQPRmbnYHQo5mzYMWPvRjuIWXP8pl2Jj0QCZmNYOJQ7Nl+KlJRZJmS4ZaShFn3rkZYuZlvJePdTtl25I0fQ9k8ZGJf31lxpOafYhloIG9leJl",
    "T4Q+nQtnKOOaI71o+pHJIVRpfIJhOXtmD9R6OGZlNNTvNXlkc9BbPA5lC0rnPFNnLH3cPo9lkEyeO4Rla39vPmdm4IcHRoxkAopZQulltKFLQhBnO6mIQuVm",
    "aHsxQHxmcYiXQkZm6pHeP+Jm2KwDRbZkvq0kRvBiga/AQchmNM9gQJ1lyc2JQo5mFVVeQotju1XoRW5j6FUeQQhnR4IcSbxlipjhQq5meFV5RKJnjbHtY+9m",
    "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",
    "8Z1gNDVusYe8PhBuJaFEQBRtmqAPPrNuirfWPflvvbbyQPBvh44aQp5sJosPQrluaosCQDpva7fPQUZuq7qEP81v8IkZRtBvgY/DQWpvg5HBQwludXetSfJu",
    "iIHFRttvlIKHR9huMUsESi1veYNRTihuooVTUSNv/YCWULZuo7DLZWVtsa8yZZluj61Ha11uSrBuaUluiKV4bHBsMafBbNpu8aUwazpvZ1ghbGxt/lrdbXJu",
    "1VvAbXJs1qWSckVv+qlXcURv16lWbd9uAGdTdRxv6XCCjNBuvoypmN5uAY7mnVFuk3mRpuhwQn7ZoyZvbnvTpfttU3x3rkRuH4rHrFduA4n5q3FuTIHHtIVu",
    "QoMmuiRvqYKqvdBuWoEFvXJuAP3hCkBwIRi3HOVuthwpILZu6hijGz9uVovxHEVwK5ZsJOJvES/kN1Jwwi5JNrZrFLpXPoNu0ptuQCRvmplVPsdvXYiMQ7du",
    "Pa/0RFFvta/aRShxa69aRgVtU4XxTPRvh7r3TxJtxroXTwZw0bxFSq5uA7XmXMdulbTFYBxvkrdyXFpuybKzYbxu6FULZ9xsTVdBbG9vZGD8bWpsxF/acalu",
    "5WBcc/hwNZXhhbVuQpNgixJvlJQBh25ttZMVk2RvB5GZkM1tSpIOlY9vjpN3lpZv6HTnkuRs4XRflmlvQXaKmeRvc49InxdwEX/2qstvEoFAq8ttmIFmsVFt",
    "dntqrotvSnxGu/NuN4Wgu3Ruk4YLuJZvL35WwGVvoINexa1vyPy6BqRvFX7eEGtwbYi8IJVwUiWJKbttKSerKlVtbibqKkpwTIVmOsdx1X9JO2JwKDOFPf5u",
    "IzFVO+lvnDLRP2Vvq6g4P1tuNLSCQc9tsbHxPydxSKSaPgxuQaQFQRhvtKE6Q4tv8aMXRExwFDmDRZNuKTkbRIlvADcIQjRwDFeIRK5vGleQRNlvFVeNRMpv",
    "0pCdRTFvAJ06QwVwB55ZRZ9xEVeNRLxvd3cBRU9w5Z27RsxueTrhR/VuFT0qSGJuaTyoSNVxDz7CSo9tBIHHTvNvBLmUWVtvzbhPXHZvLXP4lP1wBnpYoMlv",
    "UH3Jsq9v2YijtjBwHoP1r51vxYaks4JwWYhMtypvTYDNtn5wMohVvWpvqnyvwYFvjYC9xJdvj4WZwGJwEoZ1xn9uHYmkv8dvv322xmtu4of3xdpwYA9WE/hs",
    "ag8sFJ5xmA/tD7Bv3+y4Gyptre0VHo9wDu35GwRyEpM+KjVwryvSNbtyY5PDPrZwjKSjPr5x3bl/QhZyWaDGQYJx8aCGP/9x5bNdP+dx7IfeP1NwuJA2Q+Fw",
    "Gaa8QJ1wIp6NPrRxKleWRA5wI1eWRP1vSlevRGNwr3iwRspwK7SfQg9xK1eeRA5wXq/oQSlzt4IfSFNw8YJnSZtxTUwUSlNy8EpPS1RxNb2fSTVyn4IvS/1w",
    "E2ssfQdwh28MjJNwkXEakPZx1JCalONx8HSnlOFwlo3+n/1wzHrbpz5w2IFes2BvcogGrj1wwYEWyCpwZISRyLZwTYjxGZV0RaXHGOd0Iu1oH1R2T6GFMF5w",
    "lJyPNKNxvppNNORwjS8+O1JyqpdSOP1wh7sYOr9xlIC0PuFwCIPPPjFxvqjxPqlxm2MuRJJvw2QFRk9vCGSrQKtxSleyRGtwSVeoRGZw6YXSSh5x6MTrRm1x",
    "zMO9S5Zxn8aPSbBxFknrU/9ze0luWJ9ydpJokwFx7XBOlm9wc5GXl4BwAXRomj9ySXiQoeBygHspp2RyCXxDq1JxB3+RsIxwbIQ/th1xcnxjttlwRn5Yv2Nx",
    "yYF0vblxcYVSub9xXIAEwRhyuoPlwdtxYX9rxxhzn3wCE4FyeoKeE+tytH/FFgpzXZPhJp9y8555IZN1KyunNphzY7wePFlzg4bKQV1x3n5lQBpyeIHTPety",
    "K7DuQFdwVK/fPW5z4IL1QRdydaizQchxZlfPRLRwvVcSRV5x1H8JUJpxR390SuRxN31kTdNy02B6eVRzEmuxe+9w9WmJf59yA2y5gUZxIW6WhN9x4W1CiUly",
    "DXH2kchxVnYum79yHXWtn2dwNo9KnOVxo42EpIFy0YdqrH1yMIaIrvpwfICnsllxF4LTtvFw0YamuFpx8Ya7vItx9X6KwuJyCIbXw2NxroF8zcJx04Id1Ihy",
    "QKekIUp3794SKDVyQN72K9FxooRRORJ87eGPKl5zdjGxO1JyWp0MQgZ09bj4OUFyy7pjP1JyC4mhQhVyZzo4RjxyHGYhRcByNKSLRF50OligRNtyGcrKQgtz",
    "Ds2NRfBwPcyrQQ5zbcujRjty5TYBQ+tyElh8RmxyjXZvSNJ1xajZRmlzbqhNRmVwIag0SUtzV0oGSH5zhoYIT0dyA4TsUfFxukvkWFhzd5SNkX1yS5PomjBz",
    "w3JNnAV0wHSLoRlzyXZ/olpxyosXozNyqnTTpPZzcXm3qc9ywHnerTpyhX7lrJdybH1wsT5yA358sw1yBHwptHdz2oahwopy4oWsxhpyPYNC2/R1Iu7ZHo90",
    "G5kgHSN0Tam2IrB05qP6LkdzFbhJPg10mbHSPltziFwbPvNycV7KPsJzyJCJQ310bZOjTLt4K6ehRplzgE8jR55zo0/tSYVzu1BRSeZyN0zJSpxzU4WTTBx0",
    "y7q+UulyeLysVqRy4rzMUWRzgrqgV45yvJPul11zKnFrmfByLJGTmQtzCHqnoH9yXnj2pFlzaXfVquVyYoNts29z7YZxuFtyXnz7vCZzjYWXvmtzX4mlur1z",
    "CH1awZh0jgooDUZ0UAqbDhtyVgxLETtzGQ/vFLRzpJ8CNlF1jpmIP/d2jH/vO9h1VIYgPOh0IVhbPhNzgFdHQAR1BJ4FPuJ02bQrPiRzrDMCQJFyfTN2QNZ0",
    "aIYORS90pJ18SG51ep5/R2F1fkiASzF0GUnKTEZz8YNDTot0DIulTV90tYyqSolzHoxeSA9zz7r+TJ5zPbPCYtpxM7a6XaBzOrNrY3BzR1LBYVpydlLBZU9z",
    "k1IFZN10PmJ1e9V0QqsPc9txpqnQdyR0GquqdtJygqICd7xyCqT9dy10uaRvdQ5yEpfzkT91RZdWkT1zIXL8l3t0iHRplyZ0i45yngV0MpGWoWp0CJOEn6Zz",
    "oou3pvFzAYs6sV1zRY6bp0Rzf4DqsaNzPn1erl5zMH5PvG10jIldtvVzAYnnxEN054Iax3p0jBZ+HZZyGxfmHv906BTZHCF0OKjMHWx14KmjIeh1X5MCII92",
    "OiSzKIR0/iTeLWh1OiVVLFFyvSiqLqh0Jym0LltygSrQL8d0PlXCPVF0vVCcPWVzKH+TPuV0kbqhPpt0dUpfPKd0sYfdPxZ1xTauPpJ0cFlVPSFzp56pQch1",
    "aVIUQKB0rV8dQMh0R2CqPqlzGKXaQBp1B7PjP3V1MbsDQOB19FoWRsl1vJAuRYRy7I/ISDJzdZGcRtZ1enhgRAh2msjkR21yu8ftRv50cUeAUdR0gkgZUsVy",
    "+01aXdRzU07CXFNygla4azFyvFaIbrB0Vlf1all056qPdT12vXAyoI11l3Iho11203WdnWt0CHrnrE107Yuhsu5zaox7rZh0NoekwfNzA4TyxNRzN32GD/h1",
    "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",
    "DI1RSWF5S6YAR9p6YIfNTOB584X8TsB4CVISZoV5uVftdPB3b6JFh296U51Iiit6zm5hlhR6o5UMmvx7Vpaxm6V4opTwqdR5KpH0qtx5iZKVrT15mpAutdV4",
    "aJK5tE55mnUXtoZ5oXNJteJ5G3qywUx6ZYtZvs55nnhSxG95unuUxoB5K3xOzA9574ezxqd7uogzy315pIJTzO553n7a0nZ4BoAYzZ55/YWr1Gt5dYQQ1Rt5",
    "L4KY13J5RYPv2NJ5sYOY48p6nYIh5mp6ApmiD/B6+KMrEll51BR3I659KNqROx56kaS6OnN6Qs0KOWp5oMo5PCx6UzJpOl18m57GPJN58q4ZQLZ6sruDQF18",
    "9cnAPs95MIbSPMJ6ZmAbP2p5TrAKPK577Lk3PjN6OYvBQ0F675z+RjZ7l3R3Si55HouwRrl5PacNSot6iYcCUdh5iUg6U9J49UorWA96LkxUWWN4a62cdZR6",
    "rq3CcgN5TGIyhkJ7S6pDfk954qgZftN5C6gOhMt50GScheR4+HPPp1h5F3O+sUp6VpSftbV595Q1sOx5t4+yued5uY6juCZ5xI5avo54Eouww/B5b35syQd6",
    "QYVdyWR7S4RNz215eYBz1Hd5lYPA1GJ6VZNfFD19FuGCM9V41+CtMod74N/aM8Z5LM4NOh57xLjaOXR757fePH56+TJKOiB6/ajZPAx7iktbO997tYE/QFZ8",
    "PaQrQEB71EsLQUl7iGhXQod6N6f7P2t7oEEhQUB6bz+UQg97cEIHRhR6UXgVQjJ7doGqRAR7/0xuRf58V6dyQ4R7C7S9RFt7bpkfSLV69VxvSV56Go9wSOl5",
    "2cNySCZ8L1uFfix89lrzghx8u1sWgnR7N1k9ej95o2HtikB7pGMxikh74HAOnvp60pfymJ575m7CnkJ64JRJped74XAMppx6xXEmq0Z6xXQJro16LpH3sIB7",
    "lHHYtNZ6XJFVtMp61XEJved5ppKIu8J68nP3vct6LXXevad6kJPXvsR6go/FwNJ7togLxHB5+3s4xpR62Iw1xsd7oXkIyjB6fok70KV7D38F2Jt4UIWy0dJ6",
    "a4Wf2cF6L4Kl3sF7R4ivCiV9mpvsE7x7ZZ7QE459CBfgJZ182e8HJUt+yyJ2MH155iNONWB+FSQlMGJ5et9DOCJ9kag6N0J78Un7PNt7PCufO896Qy47OyN7",
    "nzMbPLh8pV+mPfJ81H13Pbp+x2AGQll7h7ogQQ98TYTLQHx7x4hHRbV7fLgDRnR8aom9ST172550SaV85KC/R6V7lVWNb6R6Z1h8d9V6SlambiN7Jqv6eyJ6",
    "gKaXhIl7eZv2j117rp6piq96DGlgiiR5i2f5kIp8E2o4k2V8hZVTpBh8PW0NoS56gHAGohd8LW+Gqg97nnFpqo18sm/VrVp8HnddwEN7KZM0xEV67o7lwQt7",
    "43Fzxvd7i3TBx8J8s3j0wvJ6O3ZCxgp9x3tqz0V8532wz996Fn/f2W96K4PI37Z81oFA6Kl81or7C6B8X6TWChZ+Iun/JyR87OHYN+B+vtrgN3x8AIVNPOB8",
    "ndyAPHR90Z5COup7maViPQ9+aKqdPFt8uZv2P0t788m0PVJ8wkcRPjJ78Ek3QJZ7gmjvPyl8uYG9QkZ8X4voR1h8rqIOSWN9qoZLTFB7Jo0FSvx8Xo7qUDmA",
    "/6ZLh8N71GRShyJ7p6Dihx98LqGAh7R5NWJ8j9N8/mS3jS9872iLjnd8t5xCjkh8OZ1CkXt8K5Ukn3p8xHEfrW9605L8sqR71ZJgttZ7L3LMuIZ8apHPw5V7",
    "Ao5mxmV7lYl/yNt73JHDx6J914FuxYF8xoCsyMV7JYCwzDx9R38PzmR7znhXzSZ8CHoA0oJ7a4U22OJ8E3+A1gl90oM62PV7doDn2yx8aYOO7SR9w5AvC8qA",
    "mu79JMB/4yESNOR906ABN8F8x9EmOJF8w8+wOfx8p9LXOmR8791bOKN9nCjKPJl9BitmO+J8sJ7zQMd87qjQPAp+yH07Qil9NaV+QvN8YHoYQ/R/cYYjRAF9",
    "a6fvSHl9vkuzRlh9nKPsRj97tEOPSaF85UaCUDZ7zUWXTK58Z0ieUSp8619yiU59nF9Ujl9886Tfj3t8kJ+tkN18h2EOlKx9JGXLkxx9Upquk2V8eZh4kSl7",
    "lmmjlo17VGzwlSp8M5r+mHx7vppAmBx97GyNm4h85m71nhd9jGqemyB9pWwWoLl+eG94r5N9KG/BtL99EZT8tpZ8eJRGuhJ+MpPyvXF8kHJ7wxt+zXkix+N7",
    "zYO6xRh9v4MmyRJ9IowKyfR8933tzAd/mHWnzIt8GoJyzwx+wXt82KR8QH1j1jV//Xmm16p87oDN18d8SYVa3oZ8t4JB4px9keqqKrl8gRySKUR7cBm0K4l+",
    "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",
    "EWPWl6h/R2QhnqB/pmdFoBh/Gm96nDqCepfAqlWAsXCvrlF/QXJHsDCCnHGssqt/jZENwPZ/XoIvyAuAtHlAyZd/RolFynKAY5Dgx1R+8X6rxzuA83/Dy79/",
    "aXja0Wl/8IeD1fB/VoLq1OZ/kHnY1nx/y39M0/l++X5Z2fV+oHq73WF/zIWA14h/RYGP2pF/h4lF2lmAgoGJ4rp//n915ct/B4TF6ip/joN4+fV+qvbDGhR+",
    "WhmwHg6AsRq6IWWADuhoLUWAn+qyKVeA5uinMRB//uoFMxCAuyn6LfmAARojM5qA5DBOMap/MjCQMvOAmisXNH6A1H88PPKBB1YoNnWBVCZ7PV6BGT0XOeiA",
    "zl5lOQmAk2e2O1OAm6QYOTWArqd0OF2AzGwMPQCA00fyOl6A3sVQO1yAheD4PJ6Bo3xYP4GAJWKBQTSBp6PmQ3Z/c3/UP3eA6ap6QnKApF5aRc9/QX+lR5eA",
    "Vp9+ST2A5cO9Rt58AsNQRjSAAJKjTMCAtVs1ey+AF112eYF/Zl51h2OAR2B5huB/nF8Eivl/51+OksV/Z5tplE6ASqNajgOBNWhXmiSAaWn9lkeAiqE+meaA",
    "/p9tmXuBLZ3AnLGAoptWolV/RJq5oNF/0WxYoV2Awparn+p/fJV8p3CAWm6FpamAwZy6opCAR3ARp6OA0XIFt9x/rHIgupp/q3CWvkaAa3TGvo5/t3R5uzOB",
    "O3OUv5CA548EvmGBhnX2wNCArXCgyCGAA5Hbw0mA0pM3ySqBBHbay6p/Xo7myrF/63e3zNt+wIYLy2eAfoWNzXV/gYPQzWOAvoqfzVuBZ3SV005/wozkzGaA",
    "Uo4K0IOA8o7G1o9/Yoho0hyAQ4lh1UKBgYcG2cCACosT2hKAs3ff3ch/von84Cp/U4Pr2ut/t4bL3MaAcIDM3UuA5Xlh4xaAg3xC6vt+aYVb88J/E4Dh985/",
    "QIP//yCAsZBlD2qD1RI9IbWAdhN0IJOCJ+1YJ0uBfhVRKZuBR+hpKTyAuOnLLPqAGSB3LWGAld6qKxKCcOCaLr6APye1MF6AmzKQMP+AT+UhNAiCStScMRiA",
    "TdfGMfB/yjqzMwyCpzdFMwKC3Nn2My6AhdBFMWGBBB6wNdSA4VkAOSR+3lzbNq1/bFlSNh+C7LL8NwuC5jDNNymC4k0YNyiBjVc/N0qC/14YN0KBdDZhObKC",
    "W0YAObOCNs0BPFCANNCGODuBVFEXPFmBmVVSOa6CQ0nNPQGBf044OziBy6myP7mAJcKjPLWArWAvPGSBKF/mP1WAyaAuQS6AHrCEQauBWcDSQCaB8MOGPWGB",
    "vE9+QMOANV1DPRqBV1yYQp2BDrrePwSC0EuLQa+Ad1WVQdeCul/OQjaBc07sROuAG7QfRNeBTV4PSHOAFKewQmGA8cLCSHCDS6hBSsKBYXf1S0CAAonuSSOB",
    "FajUfz6AV18GhIeBamBXjt+BQmNxkyeBippelSSAIJ88lOOAVJxPmJGBOmukmiaAF26+m96AHaTfnK+ATGj5ojiB/JIGr2OA5G2tqaGA6W58rqeAjJVerpOA",
    "1nFsqiyC8ZO+tbyA4nPCtdSBfJGJtl2BV291tF6A8He+w5KCOHctx96A8I2DxUeA+oibxjeAZHtAzWx/dXkpzTOBXY39ypaBQof+zcWAqYOB1XiA9IKs2OZ/",
    "2oEo156AyIha3yWAaYof42aARH+K4kSBoIYn5OZ/O4Ar6bWAWn2V7SKBAABxAOeAdwPrA1uBMwJJA61+OAacCgqBPQn5DFuBQ5i5Hp6FhvKWIYuBA/EvIu2B",
    "AxgfKISBICKdLquBBePaLneCv+4aLeuA8yzQMPGA+NWoMEqCctp9MaeB2eOtM4KBGtTBNHmBHN3INb6BFz8oNXSB8tbbNOWAFUQnNZSBLlOxN1WCe8xIOaiC",
    "xdZEOJmAvNmoOJmBMEmvOGOBEkuuOYaBxliwOeWBN9RhOYCA4zjZOluBTzotOL6BhqZaOZKCjEKUN5GBf7RWOm+CYSm4OYCCPV5BOeyBq0eZPPqBP3uQPXCB",
    "U55jO6CBdbILPauBBt0pO/yBtLz5PP6BbcjcPBWBh0YcQHiBomnBQF2BnbdhOgKBWsA8O6GCvsegP3uBck3rP22B5FJvQPuBIpiFQeeAiZuxPN2B+8CmQXyC",
    "h31WQluB8LDdQ1aCcX90RFiCbVCPRrSBzXjGQCSCl6OYRcyAkkz+RZaBtlmaRmGC26pYR7uBuqLHR4iCapwCSv2DrKKPS62B8KOISgeCd3/vSNmDsabZSkiC",
    "rHU/TOOBHHdwT1iBAqt7dv2AI16TjA2COqYAklKBHp5ejoOC0mi1nJaB/28MotyCFW2MqSaBCm5qrY2CC3E4tEyBHJGYsoKBynX6xn2BWXmQx2aBV3zwxnWB",
    "G4Z1x1aBNoFUzTmBuXOc0EeB2YNR3P2AbIUl4Z6BqoVj6ZSBNYPP7Kl/F/JMJv+CvxA6Hs+CuOaCLpmByd4dMoOBlNAwNO2BUTWZMxqCQF11NZaBbsUpNRuD",
    "08QiOIOBoKIKOp+BezIXOWmCLK4xOa6CJXbXOjqCyaTyPZWBFb6KORKCuNkmPFODjlFhOp+Cd77vPmiBh2G8PdqCzp8WQZaB26HbPWSBhUlfQLaCXV2FSIyB",
    "160jdKiCJa4pcr+BfamedqWCEarveXKCYqcvgReCC6kzgDuCUqishcyBPWBegsWDN6cZiCWCi1/aiRuCOWI3jb6BtWZikK6CCqA9kNqC1qV/jJKBW18WkguD",
    "W2bxldWBgZoQlzCDjGc8ms6BUZcXmuB/Z5a4ng2DLZednGeAk2LKm5SBUZgomkyCF5tSoSeBAJWps1aCbHDft1qBi3B6ukaBG3PYuzqCC5HXxwyC14oPybOC",
    "e44EybGBlH3hxXGEWX+byI2CF4QUzkmC0HOfygiBbID/z4CB7YO60EqChoIZ0ziBcpD40FWBzoXU1WCCsYiz12WCH4tA3WeBeYEm3rmBT4L05/aBYoO1646C",
    "3og550GB8oC29y+BXYQq89GBd4Lh/YKBwaBCHX2G6fEUIlqEMemnKhOC8hnoJ5GCKBpYKnOCTewIKWmDjuChLgOCvxxuMCqBfSVvNHWBKykZNfWBgOlOMpKB",
    "/qMqN36DA738N4aCStNTOr2E9j8iN36CQsI1OLKCTjgMOnKDnDzaPNSC3cMtO+uBVNbBN5iBgLGFOTeDCk/dP8yBu11XQOCDKabLP9SDMLkbO/OCs1x+PEOE",
    "qJs5PjaEUVm5QNqCe6KmPg+Esbz1P9uC3HvEP86DBILKQ5iD8Lf9Qi6CPralRAyCObhGRoV/IacuRSmDsK2IRveB3lcXRKmDLn9eR3+EdbdiRVaEIJtyS36C",
    "OnfvSkqE8K82b5yCsKLwjjaDdKHZklWCQp4nksuDrZthlP+CkGtGm9eCvGihlaaDo5almliEOpjJnreDj2rsnKaCGGmmoSCCIZVhrAOCXZT3rbWCVG/mtoqD",
    "KpEVuLqCVZRmxL+CA5T9uPGCC3Vuu+KD/m/zvimDeJFGwNqC13CBxXiBl3ZEwzaDFIeMzMCCP3WRyEqCHHhYyU6DE3v6zcCBZ4BXy8ODCXcrz++A1nh21SaB",
    "fnzC1viAVXxn00iCb34i1s+CGoPz1miC8Xzn2IWCa4Y/2MyC6nqg4D+B8oL92UuDfIQy3W+Cm4fo4myBn3zM4RCCuu8zJ1qCe+kZKU2EEh4lLi+DuyBrM8KB",
    "cicYNnyDYtMyM6GDwchxOceD2ts2OPaCs03eOd+CCd+lON2CQSaiPFOCNT5HOYeDMcaOOkeDNqSiO6GE1K4IOVGElsaWPa6DE2GJQKmDN7v7P2aDPH/7RFqE",
    "daPEQrWDuoUeS5CEsqnzTPeDnlIHanqBYFQlbcOBOFOsaW+EkFjpeyqBXFqzgIOCd1ireWqDcF2rhKyCcFwPiHSDL6TpiMSEFqVSjgiDxaapj9SC02WqkgWE",
    "hqRzlfqCQWOlla2B95ZupQSDuZPVqHyDxpGisxaDonJRvqyALXN7wGmDnXJjvS6EYnYZweSEs5BXweeEz4JWybqDqX3DzvuC7XnW1GmDcoer0S+DAIlr1++D",
    "NoEP3hiDTIO43sSCQoL94jeDqX4A4KWCdH8l5v+BAIC34W+E34OG4RCE0IF67vyBOIhzGOGFjRntJYiF6+wSJcSEqCmTNGCGNSrJNiqDFD1dOSeFQXkIPgCE",
    "Pz1MPYaELltogCWEN2BWiV6ENGFBhsaFe2NTiKWFSZ+oiKCG1ZoskVmEXJnnlBmEFWIVktmDw2himkaEuZbjpCaEK27epnyDopZvqxSE8G15qfWEl3FjqzKF",
    "cHTisi+EbnGTxUeEyYuMyQ2FXomYxQKEh5FmxriEHYhny3yDG3zyyRmEEoYGz52EB3luy8mDD4kdy1SE1YlOz8KEsYLWzg6EW4oQ0AqDWX7O0lqFiYL90nyD",
    "BIXk1U2FVH6X26aDhYQW2daEoIbE3fSDeoKl5xOEJIJB6FaGyYL18iaDncwcOSmFoCiBNgyG6jfLOzuFMs2FOr2EKjmUOayFVcq8PQuFaq+4Q+iFlKiFSSiF",
    "TnezR2mG6apzSEKFVqNmRtGFSasmSRSH/11+hZ2Gb52WjKeFtWCIjqCD7WMhjSWEsGi8kQ+E3Gp9kNGEomtbmu6F12yrnkKDS29coEyFDG0foo2EW252ptiD",
    "IHCsrPWD0m+SrW+E13HvsK+EyXAzsgaFU3PfsYqFhnjSwb6Eq5IlwyiFto+exIeEU3bXxX2DdXuRxqiFAoXsyDWFooEc2pqCc4Pc5XyG+pT2GA6GrZvvIYOE",
    "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",
    "LnenRDmNIT43S1iOZkl6R9OMPEofSbiNBn96T1SOr1MyaCmNQV2YdBGOFm2njQCNtXuxtDKN83pxvPyM4oA9urCNkYM0uwCNQ36qvsWNP4KQxNaMv4PkxHSM",
    "PX7hxvmNiQtQEN6LNQntC9KOFwrTDyCMV5NFE/GNkhmLHRqOlhhmHiqPveTVJt+Mzea7IsyNpVF6P2KLclN9PceNk1H7O1mOeLV0PmiORqPBQViOIdAFO8WM",
    "GNDMO2aOw871Qr2O01dgPx6PlliFPGKNDmNJQAKNh2GtRCqOZWO8P8iOBsS+QjiN/ML9SM6M5MVHQq6MJMXdRmGNosjjRyqNpqgzRh+PjMCvUO2MV8L6S7eN",
    "07uqURyMPrtfT+uNdrtxUwyOZr3TUSCNAbyVV0yN86CGe1COGG8AlziNQo+9mQKO5I7knkyNO5FtmRSNo3aXmSeNOXUZnZiNZXdKoTCNm5GamxWPkYxyow2N",
    "SHeFpxKNRnmto3SNp4ppqQ6NsHq5rriNFX1puYyNFX75uqiOYYj/uWONR4jGv2iLIYhbvgOOrYThwGON/IbSxjyP5oVmxoSOaIBlzCCPoYaByvqNXYSbyrCN",
    "/edvJVSO2DMgQM6NwzTHPOONNjLAP2aN68uEQsqN88YJRjCOvnZwRqOO3D1ZSeSPp0cVUxWMsEaUUliNjkmKV7SPUJmkh6SOo5qrh4SO2JyQf1qO+pQQk0SN",
    "vJO4jcGQSJMAleaNpHJ6mkyOjZIFl1eP7HWCoSyORXeUp6aOlnm2qEaOYYkssOKNIoe8rZWOAX+jr/yNLXznssmOHoDJtZ2NDYO5tFuO9315tlCPJIB4vgOO",
    "kH8bxGeOECUUKFSQ9yMFKKCQQ7r+O6WQJraCPnKPabFVPnaOqV8BPiyPolqmPQ2PZ1pfQMiO6lwgQNaP0M6OQF6P6XkVQoaPfsRfRW+Oc4D/TTGTuKS0cw2Q",
    "AqP9d9+NnJe0j0eN+5PClimQJnIyljuPcY62oNmOq3lmoq6PFYzpolaQtosMp/uOrHsArCqPAX9YqmCPLXwCql2Q0IiGrFWP1n/7qTqRkIiPtNGMuYm1s2mO",
    "bYF1s6mPRIiEtgiOg4CluwyP9odLwFqPPYTxvRuPwtrbNE6NOtqIM7eSRNtkN82LQFiIPS6RB2GVPlKQDaDwQD+PLzgfQ1CO7DiJRvWOxzisRNGPF1gdRmKQ",
    "HHd8SD2RjcepSmqRDYZATkKQPYCES7KQ82SfdyaQ4Zt4f/iPTm1oid+OOG9+jPSPe26Bh66O25fakFuOpnITmDSQQHeNn4OPx3YRnUePKHxXtMGPRoJJui2Q",
    "UX6Lvm6PT33kwfiQboV3w12RdoVlxp+PI4MVytqPLaHXJgqRr6NvK52QQtmSNRGT5F+1QC2SX7I+P3OQ2zlMR0yRWEPPUJ6NJUPgUWqQ0GHidNuPi2GAd+yN",
    "6WJUc9+RDGw1hLySQ3GBjUiRU3N9lTaQlpTRj8CQGpNuk7SQmnV9llqR/I6qnz2RQHvhrsuQd4DWreCQt4aFsZKPooS6rwCTP3zPvPOQF4cMw+WQj31qxjOR",
    "pzEKO1aRqDM7PxGQ0DRoPweRJrCMPkCQMLCoPpaPJrCJPmKQX4CFPVqUWHbAQjyS4MhKSkyR9kC1T1GSDH+MTeSSMT9dT52RW1hxbNaPAFnecMqNJ1kpbRiR",
    "cm6zhdKRHZWQjCmSEXACjqSRu3g3nb2R7HYZnQCRDo2dnTCR3Xvbn9WQAnrWotaR6X5DpXGRb4Zqq4iSjYK9rG2RmoO0tW2REIfJtBqRXRmWG4qTpVd6QjGR",
    "Gz9YTcmSSMeMTcySA0m7Vw6SBkorXVCUvWBkbtuShaZac62R6aXNbi+Re4MIsBaTKojuuBeS3olRtv+SNoqmsKSReIi2uquQKYQptqySPIgExqmRfIM9yAKS",
    "faKPLJiT119fPPeSO3u9P1GSMbBrPumRMbBvPqSRMDH4OTiTsH8VSR2SEoEVSZ+S7sQDUfOQNcU4UJKScMO9T5KS1UwxXF2Ok02LW06SaUtSWi2Swa7JbNGO",
    "yK7xaF6VX60Ra5ySmK4ZbduSUaZNbl+TGG0tfy2TnJj7h9CQn5cChzWSC5Y4ibWQ0m20h76SInLSiEiToJFjkfGQmpKujgaSVZA8jtySnI60k8+SfI8dlSOS",
    "GI4DmqeQJI7PmbaS/3wppyOSh4brq2uTlXyds4GS3H/JsBGRGH9ItviQSYEztwuTOolKrjyTW39qvxSRxX2lvT6ScIBkvTGSUYS8vBeT5tx2LBaSwd0+LS+T",
    "aN3qKo2TOS/HNlGTNLBkPieSNLBkPjKSiVjLPj6UEVlsQZWUSKibRNiSSaiWRO2SSKidRNOSSqiPRAqTDXY8Q7mUkYQER3aTanCahgqTHJULh/eTHHYtjtyS",
    "jXM2jzCVQHZclIWTnHppmV2UbHuInxeU+XooqXySsX6Sqb2TOn0dqi2QMX0QrdKRiIQsq7iT8IllqUiTs+NAI9aVVOGOJQuS9+LZJQyR+iPIJYCVDmF+PQCV",
    "EX0BQPKUaF0gRDWSjVyWPvKSPFz+QC+WUqhtRGuTTqhpRISTUah4RGmTojlcRu+SxTsiSYqUYqlTbYqSIavncfeQ9qpBaqyVR3+/oDeVzX3BooGUvIX/pFiT",
    "xIKkpE+UwopFqlGU/opapYqTl4HkrTSVhoAzsLKTAIOIvy2SBuO0JS2V23zxPeyTv5wcQNGUp5swQOmT8q9EPueUNnjpQJaW+HcmRxuVTqgMRBiUWKhORNOT",
    "KYA7RCuV/MfBSkiVkD9FTf2UrT/wT9+UMbjJTyCV0bgUUaWTSblRTomTbrDvZQGUBbM5ZX2UobKsYt2SDp8udI2SN6A1cqyUyp/qb6iUHJ4md62Tr46VmfqU",
    "NnlWmfGUMXy0nVuVG4c6nwuVMoqSob6UUYuzmpqUm4iaormURoPAs4GTqpQMI7aWi68LPnqVfVV4PlqWnK9KPu+UVl1wP0GWMWTiPg+VQ2TBQd6UA2cvP7aU",
    "dFaRQRCVU6gZRFyUvoS/Q7qV/4LyR8OXkH/YSrSXToGwSCKYyMHIUM2VQL1cUumUaL8IVAuVhrnSXL+VgLaiXGaW8LewXnmUilXrabOTHle/a6eSjFVBZluW",
    "zXRljIOVWHb2jwSV3Ymwma+UxoDHpWuVT9weLAaXbk2LOfWVE0uTO7eVrU2QO7GVaabOPWiURKWoO86VPaM1PXaU+GSiO5+XH3xLPwWWN4G3PiaWa4alRLiW",
    "4IcCRCKVtYV7Sc2WEIf9SeyXrLVxTdKVe7aPUfOVtrzGV6SV9rLjYsGVYGXAazyW22NKbPOWM2VacZCT7qC3bSKXUZhBfSqWdJWYgbmU45QLhCSWxHJRiLaV",
    "KXMHhdyVgYscmIiWEImzm8KWK4booOGVHIHmoEWWwILsoOiUoYUupy6VR4N2qUmVx4CzptiXFeSkHd2WtuQAIZyWyFbuPfCWYH6jP62WR683PqqVIoDVO6mW",
    "z5u9PWmWaaNSPueWRpt1QhKYC6lRQMmWAqggRMyUc3eGQvuWXrzxV5uVS7vHWbKVV7u3WbKVHLyYWKmVi7oRW8SVyrqeWsGV9rpFWrOV2rWBXzOXgrh4X36X",
    "UmEIaAyZKWAJaj2YymHGbQOV3pvUcwmWBZuvfOCSuZxQdEmXgJuEbwKacJZSfOeWwHFyhAyXC3jdjlGXJXlslFGWS3+NmRKWsYcRnEiWi4I8mwaWRIRznuSW",
    "B4MCo1GX9/wGBU6XFfxSB5OaTP3fB7OWvecUHueXuNf8Nu2UN9hrNTiY+tZcNF6XPaMJOsuYo2GeO7yW1WHePS2ZDWbSPRuXwbN9PO2Vi7PKPSiYU7UcPimW",
    "9mjbPxuX0pyEQFiZLoCIQn+X7IYsQjWXT4icQFqWEYgfReqWQIrESsGXtUBsUJ2XBbauTniXfbjLVaWV27nxVKaXjLlZT3yaHrP0Y1aYcpZ2f66WiHZNkEGX",
    "43gZl9CXsob9mECWEYbLnBGY3X/1nlWXvYI7qgOZ7J2EL0mZyqReOc6Ya2a0O12Z7lzrPUaYio/6QNmZI5GUQBOZgVoPRMGXvF9JPtqXb3bDP32Y6VoERfOW",
    "N3gfP/+Y86flQ/ya7I+BRH+YzsMMUOmVEsbrULCVf8aPT46Y40BiUoGX2pYGejKZ+XuEmLaYQYUnmBaZHIRNmzSaVIdmmMSZRn3BnoaXl4Mtmn+Xin/tmvyY",
    "VIKKm3OZf4FRob2XK5UsIqmYVZPEJE+Zq2HtO9ya0mMFPWWZdptkPi6afZ46OV2Y559vQM2YEaBWQOCWCKLcP/aXeaCjPbSYdmWXPnKZvII4OXKZ+6QFPiqa",
    "2VuvQXSaR4XSQWCYpqhwRHqaP3jaRMWaPYhqRgeZW4RzSBaaIMjAS4eY/Mi4SvCWEkv/VM2ZmUuhVZSYt0uEVE+W+l+yZXKZaIvmkbOXBY3kjNia8IJqlRiZ",
    "CIiQlJGZXoDllUuaJf2NBQ2bEeQZHmmac9mDKxyZ+9o+K7OZPtu3Jg2Z6Zj3JvGYvJNwLy6ZjkiNORCbFX7APV2ZbIBZPhKZioKUQeqZr4khQgKa4IbvRceY",
    "tH8uRuiajLmwX02ZLLhXZE2bSWWfadeZJoz2kUaa+IcHkSqavYXGkwqaK3+mk62YtIJtn+2YTn8/oLGZg4OPo7Scuol9PuSX5Ib+PIuZg3MgQGKYnW97PcqZ",
    "eW8fQd+ZtHNTP7Wa+IU4P2Ka6VUpPVubo3pVPzWav6gvP1iZdEDeT8iankllYTWY00qgXuqXQ0g0YyqaupvOb9CbEYzXjIqaUIYjmBOae3zsmaeaoIEBol2a",
    "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",
    "WbQebROtALbMcKCt3KACPBaqZqGuOzOu75/kPNiqu7kLNourvLhUOUqts7qxOEWsNmorP/KtDXFrP4KuZJauP9qs0rziZEWsz7w1ZN+sz7yrZI6s1bzdZFCs",
    "07wNZR6sR6YkaMCtt0swbgau43ZdcE2qn3Zpa4qu13epbvSrI69Pbc6sWP2NA4Wqevw1BBmuJ/zXBOeq9ILmEnmu8H4PNoyu1mPfONCuiIXDOVSug5sjOkqt",
    "3ppbPWuuVpzAPEOuQJGbO2CwiI4/QIaue4XVQMSvw4WOPgmuHqMcQ9ytjYnsQdStjJulZGetEb25Y2mtgLzYYsWt/aqva56vX04ZcfWuFq8GcmWuh7WGc8iu",
    "3H9CFl6u52xGP7OvjJPuPziulocoQXWub2TYRN6wvlYfQ8utGVhSRTGvNHfCZ8evxVUdcZmu11D3chCvKoAkNTqvf7lpOo2wzYbUOtWu1oyLPP+v8oXNRGCv",
    "IKo8QpavP4WSSI6tEniHav+u7FMWbjGvclaLcNyv71LCco+wSbKVbzuw77DYcjCvQrP2dT6v/u9rDi2tp+7FEXaugO6xEmOyZ35+Fy6x42x0PM2x84w1Qk2v",
    "y2pmP1awQohbQYSv4on1P8OxqryjYaGvkJPQZTeuvpWUY0yvspOiYXmwuq+RdIuwR/J6Dfmwiu9+Dc6wXWQjO2eypodYPpCxvYIfQJawuoIgQISwvIIfQJCw",
    "poUKRj2xHpl8XG+wgZiKYO+vLJqVXimwC3HyYrKwVG/xYJ+xgqRyaOSvoaVgaHeyLqSfZe+wL7a+bgWwvLfTcbiwF1Bud/mwnFHDc/2wUVUGd96wHbIIdMSx",
    "/LTvfKuxeYIOEIyxUoAdOJuzLoXQOOex1Ic8OgqyfIoLPGqxKXcYOfivaHfsPfKweLnVP5qxyYIWQMKwzYIWQMqw0YIUQOGwtal1QM+xBqmQQrSxVqO2QKKy",
    "SMH/WM+wsbxfXu2wyL4BXhWxE7xvY+Gw7HFXY7OwXHP/Y/SwZHMKZOSwMnPcY+awXblEZu+wF3RmZO+wAHRYZOuwinSRZO6w/7g7auix+0t1afixWK/ca8qw",
    "hK0MbtKwnrR2cWKw9k1gcc6zlVSycp6x3lafcweyRfxAAxayWv2XBP2xhPs2BcKx2vOdDEmypfM2DLev6uyDE4WyI3+mG2CxI2QhOd20kHjCO4SyTo1pOzuy",
    "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"].join(""), j = ["AAABAAIAAAACAAMABAAFAAYAAwACAAEAAwABAAAABwAIAAkACgALAAwACQAIAAUACQAFAAQADQAOAA8ABQAIAAcABQAHAAYAEAARABIAEAASABMADAALAA4A",
    "DAAOAA0AFAAVABYAFAAWABcAFgAVABgAAgABABkAGgAUABcAGwAcAB0AAgAZAAEAHgAfACAADwAOAAsADwALAAoAGAAVABQAGAAUABoAEAATABIAEAASABEA",
    "CwAhAA4AIAAfACIADgAhAAsAHwAjACIAIAAfAB4AIAAiAB8AHAAkAB0AGQAlACYAFQAnABQAKAApACoAFQArACcALAAoACoALQAuAC8ALQAvADAAKQAsACoA",
    "EQAxADIAEQAyABIAGwAdABwAGQAmACUALwAuAC0ALwAtADAAMwApADQANQA2ADcAJwArABQAMgAxABEAMgARABIAFAArABUAMQA4ADkAMQA5ADIAHQA6ABwA",
    "HwA7ACMAKwAnADwAHQAkADoAIgAjADsALAApACgAOQA4ADEAOQAxADIAMwA0ACkAHAA9ACQAIgA7AB8AJwArADwAHAA6AD0APgA/AEAAPgBAAD8ANwA2ADUA",
    "KwBBADwALABCAEMARABFAEYAQABHAD8ASABJAEoAQwBLACwATABBACsAQwBCAE0APABBACsATgBPAFAAJAA9AFEAJABRADoARABSAEUAQwBNAEsAQQBMACsA",
    "RwBAAD8ARwBIAEoAUwBUAFUALABLAEIAVgBXAFgARgBSAEQARQBSAEYARwBKAEgASQBIAEoAWQBaADYAVgBYAFcANgBaAFkATgBQAE8AWwBcAF0AUwBVAF4A",
    "XwBgAGEASwBNAEIAXQBcAGIATwBjAGQAOgBRAD0AOABlAGYAUwBeAFQAVABeAFUAZwBoAGkAYQBgAFQAWwBdAFwAWABXAGoAXABdAGIAWwBrAFwAZABjAE8A",
    "OABmAGUAXwBhAGwAXwBsAGAAVABeAGEAYABtAFQAXABrAFsAWQBaAG4ATwBjAG8AcABxAHIAbABhAGAAbQBzAFQASwB0AE0AdQB2AHcAWABqAFcAeAB5AHoA",
    "TwBvAGMAdQB3AHYAewB8AH0AfQB8AH4AaQBoAGcAXgBtAGEAYQBtAGAAXgB/AG0AXgBUAH8AZwCAAGgAgQCAAGcAgQCCAIAAVABzAIIAWQBuAFoAgwCEAIUA",
    "dgCGAHcAeACHAHkAdwCGAIgAegCHAHgAYwCJAG8AfgCKAIsAZwCMAIEAaACMAGcAgACMAGgAjQBzAG0AVACCAH8AVwBqAI4AawCPAJAAdwCRAHYAiACRAHcA",
    "egB5AIcAkgCTAIgAfQB+AHsAYwCUAIkAfgB8AIoAlQCLAI0AlgCXAJgAfwCNAG0AfwCZAI0AjACCAIEAcwCaAIIASwBNAJsAhgCcAIgAdgCRAIYAkQCcAIYA",
    "awCQAI8AiACdAJIAkwCdAJwAkwCcAIgAiACcAJ0AiACcAJEAgwCFAJ4AcAByAJ8AeQCgAIcAkwCSAJ0AcACfAHEAfgB8AHsAiwB8AH4AlAChAIkAiQChAKIA",
    "owCkAKUAlQCNAKYAiwCKAKYAiwCmAI0AgACnAKgAggCaAKkASwCbAHQAdACbAE0AqgCrAKwAbwCUAGMAiQCUAG8ApQCtAKMAlgCYAJcAiwCKAHwAogChAKQA",
    "pQCkAK4ApQCuAK8AjACAALAAgACoALEAcwCNAJkAcwCZAJoAggCpAIAAgACpAKcAVwCOAGoAhACDAJ4AhwCgAHkAqgCsAKsApQCvAK0AcQCyAHIAlQCKAIsA",
    "swCyAHEAsQC0AIAApAChAK4AtQC2ALcAtQC3AJkAfwCCAJkAmgC4AKkAuAC5AKkAagC6AI4AhQCEAJ4AiQC7AJQAogC7AIkApAC8AKIArQCvAKMAcgCyAJ8A",
    "pACjALwAlQCmAIoAmAC9AL4AgAC0AL8AgAC/ALAAtQCZAMAAjACwAIIAvwCnALAAmQCCAMEAggCwAMEAqACnAL8ApwDCALAAqQDCAKcAhADDAJ4AqwCsAMQA",
    "cQCfALMAvAC7AKIAsgDFAJ8AmAC+AL0AlAC7AKEAsQC/ALQAswDGALIArgDHAK8AsQCoAL8AyADBALAAyACwAL8AwQDAAJkAmQC3AMkAmQDJAJoAuQDCAKkA",
    "jgC6AMoArADLAMQAowCvALwAxwDMAK8AsgDNAMUAyAC/AM4AuwDPAKEAxgDNALIArgChAM8AsADQAL8AsADCANAAagCOAMoAqwDEAKwAagDKALoAnwDFALMA",
    "xQDNANEAtQDSALYAwADSALUAwADBANIA0gDJALcAvwDQANMAwgC5ANQA1QDWANcA2ADZANoAngDDAIQA2gDZANgAngDDANsAzQDcANEArwDMALwAvADPALsA",
    "yADOANAAtwC2ANIA0ADBAMgAyQDUAJoAmgDUALgA1ADdALgAuADeALkA3wDgAOEAzADiALwA2wDGALMAzQDjANwAvwDTAM4AvADkAM8AxgDlAM0AxwCuAOIA",
    "rgDPAOIAwQDQAOYA0gDnAMkAyQDnAOYA0ADCAOYA5gDCANQA5wDoAOkA5gDUAMkA1QDXANYA1wDqAOsA7ADtAO4A3wDqAOAArADEAMsAngDbAMMA0QDjAMUA",
    "xwDvAMwAzADvAPAAxQDjALMAswDxANsAzQDxAOMAzQDlAPEAzwDyAOIA0ADOANMAuADdAPMA9AD1APYA3wDgAOoA3wDhAOAA1wD3AOoA+AD5AMQA8ADvAMwA",
    "0QDcAOMAzADvAOIA4wDxALMAvADiAPoA4gDvAMcA2wD7AMYAvAD6AOQAzwDkAPIAwQDmANIA5wDSAOYA/ADoAOcA1AC5AP0AuQDeAP0AuADzAN4A/gD/AAAB",
    "7ADuAAEBAQECAewA7AACAe4A7ADuAO0A+QADAcQA2wAEAcMA2wDDAAQB2wAEAfsA8QAEAdsA4wDxAAUBBgEHAQgBAAH/AP4A6wDqAPcA+ADEAAMBBQEJAQoB",
    "8QDjAAUBBQHxAAkB+gALAeQA4gDyAAwBAgEBAe4A9wDXAOsABAENAfsADgEJAQ8B8QAQAQQBDwERAQ4BEQESAQ4BDgESARMBCQHxAAoBFAH6AAsB+gDiAAwB",
    "CwH6ABQB+wAQAcYAEAHxAOUAFQHkAAsBFgEGAQgBFQHyAOQAFwHlAMYAGAH8AOcAGQEIAQcBGAHoAPwAGAHnAOkAGAHpAOgAGgHdANQAGgHUAP0A+QD4AAMB",
    "GwENAQQBDgEcAQoBDgETARwBGwEdAQ0BBQEKAR4BCgEJAQ4BDwEJAQoBDwEKAREBHgHxAAUBEQEcARIBEwESAR8BEgEcAR8BCwH6ABUBDAEVAfoADAEgASEB",
    "DAEiASABGgEjAd0AIwHzAN0AEwEfARwBBAEQAfsAEQEKARwB8QAeAQoBEAHlACQBFgEZAQYBBgEZAQcBFwElAeUA/AAmARgB9AAnAfUA9QAnAfYAKAEpASoB",
    "KQEoASoBBAH7AA0BIQEiAQwBEAErAcYAxgArARcB8gAVASwBDAHyACIBGQEWAQgB9AD2ACcBGwEEAQ0BGwENAR0BDAEsARUBIAEiASEB/QAtARoB/QDeAC0B",
    "8wAjAS4BLwEwATEBMQEyAS8BLwEyATABMwE0ATUBGwE2AR0BIgE3AQwB5QAlASQB8gA4ASIBGAEmAfwAGgE5ASMBGgEtATkB3gA6AS0BOwE8AT0BMQEwAT4B",
    "MQE+ATIBMAE/AT4BMgE+AUABMAEyAUEBMgFAAUEBMAFBAT8BNQE0ATMBGwFCATYBJQFDASQB8gAsATgBJgFEATkBIwE5AUQBIwFEAS4BLgFFAfMA8wBFAd4A",
    "PgE/AUYBPgFGAUABQAFHAUEBQAFGAUcBPwFHAUYBQQFHAT8BGwE2AUIBGwEdATYBDAE3ASwBNwEiATgBSAFJAUoBSwFMAU0BTgFPAVABUQFSAVMBEAEkASsB",
    "LAFUATgBLQE6AVUBRAFWAS4B3gBFAToBTAFXAU0BWAFZAVoBWgFbAVgBOAFcATcBOQFEASYBVgFEATkBLQFWATkBWgFZAVgBXQE2AUIBXgFbAVoBUAFPAU4B",
    "UgFRAVMBXwFgAWEBXAEsATcBFwFDASUBPQE8AWIBPQFiAWMBYgFkAWMBSwFXAUwBRgFlAWYBWAFeAVoBZwFoAWkBQgE2AV0BagFoAWcBawFgAV8BbAFUASwB",
    "XAE4AW0BKwFuARcBOgFvAVUBRQFwAToBZAFiATwBZAE8ATsBRgFmAWUBSwFNAVcBZwFpAWoBUQFxAVIBLAFcAWwBOAFUAW0BcgFzAXQBcgF0AXUBVgF2AS4B",
    "PAF3AWIBPAFiAXcBZQF4AWYBeQF6AXsBWAFbAV4BfAF9AVABUgFxAVEBfgFrAWEBXwFhAWsBYQFgAX8BcQGAAYEBcQGBAVIBggFtAVQBgwEXAW4BFwGDAUMB",
    "LgF2AUUBOgFwAYQBYgF3AYUBYgGFAYYBSgFJAUgBZgF4AWUBVwGHAYgBiQGKAYsBXgGMAVsBUAF9AXwBawGNAY4BawGOAWABJAGPASsBQwGPASQBXAFtAWwB",
    "cgF1AXMBVQFvAXYBOgGQAW8BegF5AXsBigGRAV0BXQGRAZIBaAFqAWkBfwF+AWEBaQGTAWoBgQFxAVIBKwGPAW4BbQGCAZQBRQF2AZYBRQGWAXABkAE6AZcB",
    "OgGEAZcBlgGEAXABYgGGAYUBYgGFAXcBmAF4AWUBiwGKAYkBmQGaAZsBXQGcAYoBmQGbAZoBigGdAZEBXQGSAZwBfgF/AY4BfgGNAZ4BWwGMAV4BfgGeAWsB",
    "fwFgAY4BgQGAAZ8BVAFsAYIBcwF1AXQBVwGIAYcBeAGYAWUBeAGYAaABjAFeAaEBfgGOAY0BagGTAaIBngGNAWsBbQGjAWwBgQGfAaQBbQGUAaMBbgGlAYMB",
    "dgGmAZYBhAGWAacBSQGoAakBYgGqAXcBmwGrAZoBaQFqAZMBXgGMAaEBrAGtAX0BgAGBAZ8BgAFxAYEBfQGtAawBbgGPAaUBowGCAWwBjwFDAYMBlAGuAaMB",
    "mAF4AaABnQGvAZEBsAGcAZIBogGTAWoBkQGxAZIBsgGzAbQBjwGDAbUBtgGDAaUBlQGQAacBhAGnAZABtwGnAZYBYgF3AaoBuAF3AaoBmgG5AZsBnQGKAboB",
    "igGcAboBugGRAa8BuwG8Ab0BvgG/AcABwQHCAcMBxAG/Ab4BggHFAZQBrgGUAcUBxgHHAcgBkAGXAckBpgHLAZYBlQGnAbcBSQGpAagBzQHOAc8BzQHPAc4B",
    "mwG5AasBnAGwAboBsAGSAdABsQHQAZIBtAGzAbIBgQGkAZ8BwQHRAcIBuwG9AbwBuwHSAb0BggGjAcUBngHTAY0BggHUAcUBdwHVAaoBdwG4AdUBnQG6AdYB",
    "mgHXAbkBugGwAZEBwQHDAdgBoQHZAdoBkQHbAbEBwQHYAdEB2gHZAaEBxAHAAb8BowGuAcUBggHcAdQBxQHUAa4BtgHdAYMBgwHdAbUB1AHeAa4BxwHKAcgB",
    "xwHGAcoBtwGmAZUByQHMAZAB3wHgAckBlwHfAckBkAHMAYQByAHhAcoBqgHVAbgBzwHOAeMBzgHPAeMB1gHkAZ0BugGvAdYBmgGrAdcBkQGwAdsBjQHTAZ4B",
    "2gHlAdkBjwG1AaUB5gHnAegBsQHpAdAB6QHqAdAB6wHmAewB5wHmAesBwAHtAb4B7gG9AdIBggHFAdwB7wHwAfEB5wHrAfIB8wG/AfQBtwHLAaYB9QHLAbcB",
    "3wHMAckB3wGXAfYBtwGWAeIB9wGXAcwB9gGXAfcB5AGvAZ0BuQH4AasB2AHDAcIB0QHYAcIBuwG9Ae4B6AHsAeYBxAHtAcAB8AH5AfEB6QGxAfoB9AG/AfMB",
    "7AH7AesB6wH8AfIB+wH8AesBtQH9AaUBvgHtAcQBxQGuAdwB7wH5AfAB/QG2AaUBrgHeAe8B7wHeAfkByQHgAd8BtwHiAf4B5AHWAf8BqwH4AdcBsAEAAtsB",
    "sAHQAQACAQICAsIBpAEDAgQC6AEFAuwB6AHnAQUCuwHuAdIB8QH5Ae8B+wHsAQUCBQLnAfIB8gEGAgUCBQIGAvsBpAEEAgMCswEHAuUB+wEIAgkC+wEJAvwB",
    "/AEGAvIB/AEJAgYCCQIKAgYCCQIIAgoC3AELAtQB7wEMAq4B3gENAvkB9QEOAssB3gHUAQ8CygEQAsgByAEQAuEB1gHkAf8BrwHkAdYB2gHZAeUB2wH6AbEB",
    "0AHqAQAC+wEKAggCBgIKAvsBEQIHArMB0wESAhMC+QEMAu8BDALcAa4B7QEUAhUC6QEWAuoB6gEWAv0B/QEWArYBzAHfAfcBuQHXAfgBAAL6AdsBGAIZAvgB",
    "wgECAgECBAIDAhoC5QERArMBGAL5ARkCBAIbAhoCAwIEAhoC+QEcAgwC0gEdAu4B3AEMAgsCHgIfAiACIAIhAh4C+QENAhkCFwL+AeIBCwIPAtQBygHhASIC",
    "DwINAt4BIwIkAiUCJAIjAiUCJgInAigCKQIYAvgBKAL4ASoC+AEZAioCKwIEAiwCLAItAi4CLAIaAi0CLAIEAhoCKwIbAgQCLgItAi8CLwItAhsCGgIbAi0C",
    "LwIbAisCMAL5ARgCMQIyAisCLwIrAjICEQLlAQcCMAIcAvkBMwIHAhECNALSAe4BHgIhAjUCNQIhAjYCtQHdAf0BNwIfAh4CNgIhAiACGQINAjgCHQLSATQC",
    "FAI5AhUCOgIXAuIBtgEWAt0BIgIQAsoB4gE7AjoCIgLhATwCEAI8AuEBPQI+Aj8CPQI/Aj4C+gEAAkACMQIrAiwCMQIsAkECLAIuAkECKQIwAhgCQQIvAkIC",
    "LgIvAkECAgIBAkMCQgIyAkQCLwIyAkICMgJFAkQCEQIHAjMC7QEVAkYCQwIBAgIC7QFGAhQCHgJHAjcCNQJHAh4CRwIfAjcCRwJIAh8CIAJJAjYCHwJIAkoC",
    "HwJKAiACIAJKAkkCSwJMAk0CSwILAk4CCwIMAk4CSwJNAgsCIgJPAhAC9gFQAt8B3wFQAvcB/wFRAlIC+AEoAikCAALqAUACQQJTAjECTAJUAlUCMQJTAjIC",
    "MgJTAkUCVgJXAlUCRAJFAkICVQJXAkwCWAJZAloC6gH9AVsCEgJcAhMC0wETAhIC7gEdAjQCNQI2AkcC+gFAAl0C/QHdAV4CRwI2AkgCNgJJAkgC+gFdAukB",
    "XwJgAmECFwJgAvUBSAJiAmMCSAJkAkoCYwJkAkgCSQJiAkgCSgJkAkkCSQJkAmICFQI5AkYCXwIOAmAC9QFgAg4CYwJlAmQCZAJlAmIC6QFdAhYCZgJnAmgC",
    "3QFpAmoCawJsAjsCXwJtAg4CFgJpAt0BIgI8Ak8CbwI8AhAC4wFwAnEC/wFSAnICKAIqAikCKgIwAikCVgJVAlQCQQJzAlMCQgJzAkECUwJzAkUCRQJzAkIC",
    "WgJZAlgCWAJ0AnUCTAJXAlQCEgITAlwCWAJ1AlkC/QFeAlsCdgJqAncCDAIcAk4CYgJlAmMCFAJGAjkCXwJ4Am0CYwJ5AmUCZQJ5AnoCCwJ7Ag8CZgJoAmcC",
    "OwIOAjoCDwJ7Ag0C9wF8AvYBfQJ+An8CgAKBAoICgAKCAoMCUQL/AXICJwImAoQCJgIoAoQChQIqAoYChwKIAkACQALqAYcCiAJdAkACVgKJAlcCKgIZAoYC",
    "6gFbAocCWQJ1AlgCMAKKAhwCGQI4AoYCXwJhAosCYAIXAowCTgIcAo0CRgKPAjkCkAJPApECDgJ4AmACOQKPApICDgJgAjoCCwJNAnsCFgKTAmkCUAJ8AvcB",
    "lAKVApYC4wFxApcClwJwAuMBPwKYAj4CcQJwApkCIwKaApsCIwKcApoCJwKdAigChAIoAp0CKgKFAp4CVgJUAlcCnwKgAqECWAJ1AnQCYQJgAngCTAJOAk0C",
    "XwKLAngCYwKiAnkCOAINAqMCXgIWAl0CkwIWAl4CDgJuAngCOgJgAqQCowINAnsCXAKmAqcCawKlAmwCbwJPAjwCgwKBAoACPgKoAj8CPwKoApgChAKdAicC",
    "hAKdAoUCqQKHAqoCqQKIAocCngKrAjACKgKeAjACVwKsAlYCMAKrAooCVwKJAqwCdgJ3AmoCYQJ4AosCHAKKAo0CXQKtAlsCFwKkAowCowKuAjgCXQJbAl4C",
    "RgI5Ao8CFwI6AqQCXgKOApMCrwKwAjMCrwIzArECOQKSAo8CsgKzArQCaAK1AmcCaAJnArYCfQJ/An4ClAK3ApUClQK3ApYCgQK4AoICmQK5AnECugKZAnAC",
    "UgK7ArwCUgK8AnIChAKFApwChQK9ApwChQKdAp4CvgKIAqkCiAK/Al0COAKrAoYCWwKtAocCdALAAnUCoAKfAqECigLBAo0CowKKAq4CkAKRAk8CowLCAooC",
    "YwJlAqICjQKjAnsCXAKnAqYCTQLDAsQCTQLEAnsCrwKxArACaAK2ArUCxgLHAsUClgK3ApQCgwKCAoECqAKWApgCPgKYAqgCIwKbApwCugLIApkChQLJAr0C",
    "hQKGAskChwKtAr8CqwKuAooCXQK/Aq0COAKuAqsCjQLBAsICwALKAnUCywKLAngCYALMAqQCagJpAs0CiwLLAngCeALLAm0CywJ4Am4CZQJ6AqICMwKwArEC",
    "ewLOAo0CywJuAm0CzwLQAtECzQKTAtICaQKTAs0CewLEAtMCpgKnAtQCxQLHAsYC0QLVAs8ClwJxArkC1gKWArcClgLWApgCUQJyArwCugJwAsgCmwLXApwC",
    "vAK7AqkCvAKpAqoCnAK9ApoCmgLYAsgCvgKpArsC1wKEApwCvQLYApoCqgKHAr8C2QKrAp4CyQKGAtkC2QKGAqsCrAKJAlYCigLCAtoCdQLKAnQCjALMAmAC",
    "TgLDAk0CjgLNAtsCwwLcAt0CogJ6AnkCsgK0ArMCzgJ7AtMCgQKCAt4CtwKWAqgCgQLeArgCuQK4At4C3wKaAsgCuQKZArgC1gK7ApgCUQK8AlIC3wKbApoC",
    "mQLYArgCmwLfAtcCyALYApkChALgAp0CnQLhAp4CqgK/AuICvgLiAogC4gK/AogCigLjAsEC4wKKAtoC5AKLAssCjAKkAuUC3ALDAuYC5ALLAosC3ALmAt0C",
    "pALMAuUC2wKTAo4C5QLnAugCogLpAnoCtQLqAmcCkwLrAtICpwKmAuwCZwLqArYCtQK2AuoCpgLUAuwCcAKXArkCqAKYAu0CcAK5AsgCuwLtApgCuwK8Au0C",
    "UgK8ArsC2ALuArgC1gLvAvAC1gLwArsCqgLxArwCvgK7AvAChALXAuAC2AK9Au4CnQLgAuEC4QLZAp4CiQLyAqwCegLpAqICogL1AukCwwLdAsQCkwL2AusC",
    "qALtArcC3gL6ArkCyAL7At8CqgLiAvEC4ALJAuEC4QLJAtkC5ALLAvwCwAJ0Av0CjQLOAsMC5QLoAv8C6AIAA/8CogLpAvUCAQPyAokCwAL9AsoCzQLSAgID",
    "AwPzAvQC3QIEA8QCpwLsAtQCBQP4AvcC9wL5AgUD0QLQAtUCtgIGA+oCtwLtAtYCggK4At4CuQL6AgcD3wL7AtcCyAIIA/sCyAIHAwgDyAK5AgcD+wIJA9cC",
    "8ALxAr4CCQPuAr0CvgLxAuIC1wLJAuAC1wIJA8kCvQLJAgkDjAL/AswCjALlAv8CiQKsAvICwwIKA+YC5ALzAssCiQLyAgEDwwLOAgoD8wILA8sCywILA/wC",
    "AQMMA/ICDQMOA6ECkwLbAvYCDwMQAxED1AISA+wCEwMUAxUD1QIWA88CFQMUAxcDtgIYAwYDGQMaAxsD3gK4AvoCvAIcA+0C7QLvAtYCvALxAhwDCAMJA/sC",
    "CQMIA+4CwQLjAsICoQIdAw0D8gIMAwEDdAIgA/0CdALKAiAD5QL/AucCAQMfAyED3QLmAgQD5gIiAwQDzgLTAgoDAQMhAwwD0gIjAwIDDQMjAw4DIwPSAusC",
    "+QIkAwUDJQMmAycDEwMVAxcDEQMQAw8DEwMoAxQDtgLqAhgDKQMSA9QCFAMoAyoDFAMqAysDFAMrAxcDKQMsAxID+gItAwcDLgPvAu0CBwPuAggD8AIcA/EC",
    "8ALvAhwD4wLaAi8D8wLkAh4DoQIOAx0D/wIwA+cC/wLnAjAD2wL+AvYC/wIAA+cCIQMxAwwDIgMyAwQDygIzAyAD8wIDAzQDNQMyAzYDDgMjAzcDygL9AjMD",
    "AAM4AzkD6wL2AjoD+AIFA/kC0ALPAjsDBgMYA+oCzwIWAzsDFwMoAxMD0AI7A9UCKAM9AyoDKAM+Az0DKAM/Az4DKANAAz8DKwNAAygDPQNAAyoDKgNAAysD",
    "FwMrAygDLANBAxIDPQM+A0IDPQNCA0ADPgNDA0ID1QI7AxYDRANFA0YDRgNFA0cDSANJA0oDSANKA0kD7QJLAy4D7QIcA0wDuALuAvoC7wJMAxwD5AL8Ah4D",
    "/AILAx4DCgNNA+YC5gJNAyID/wIwA04DCgPTAk0DDQMdAyMD9AIeAwMD8wI0Ax4D8wIeAwsDCwNPA1ADAANRAzgD0wLEAlIDBQMkA/kCBANSA8QC6wI3AyMD",
    "1AISAykDQANTAz8DPwNTAz4DGQMbAxoDQANCA1MDPgNUA0MDSQNVA1YD7QJMA0sDLQPuAlcDLQP6Au4C4wIvA8ICwgIvA9oC/AJYA1AD/AJQA1gD/wJYAzAD",
    "/gICA1kDWgNZA/4CIwMdAwIDHgM0AwMDUANbA1gDCwNQA08DUANPA1sDNgNcAzUD/gJZA/YCUgNNA9MCIQNdAzEDXANeAzUDWQM6A/YCNQNeAzID7AISA9QC",
    "RANGA0cDJQM8AyYDUwNDAz4DPgNDA1QDRANHA0UDQgNDA1MDSQNWA2EDSQNiA1UDBwNXA+4CYwNkA2UDZgNnA2gDZwNmA2gDWgNZA2kDWgP+AlkDWANbAzAD",
    "/QJqAzMD+QJrAyQDJwMmA2wDMgNtAwQDBANtA1IDOgNuA+sC6wJuAzcDEgNBAykDbwNwAxgDJwNsAzwDGANwA28DLANxA0EDcgNzA3QDSgNJA2EDSgNWA0kD",
    "SQNWA2ID7wJ1A0wDYwNlA3YDYwNlA2QDWgNpA3cDTgMwA3gDdwNZA1oDUAN5A08DWwNYAzADHwN6AyEDIgNNAzIDHQMOA3sDIANqA/0CNgMyA1wDDgM3A3sD",
    "MgN8A1wDTwN9A1sDXgNtAzID+QIkA2sDfgN/A4ADagOBAzMDKQOCAywDKQNBA4IDEAODA4QDhQOGA4cDYAOIAxsDQQNxA4kDSgNhA1YDVQOKA1YDLgN1A+8C",
    "SwNMA3UDdgNoA4sDWQN3A2kDTgN4AzADWQMCA4wDAgMdA4wDMAN+A3gDDAN6Ax8DTQONAzIDjAM6A1kDIQN6A10DMwOBAyADTQNSA48DgAN/A5ADMQNdA1wD",
    "JgM8A5EDEAOEA4MDXgOSA20DLAOCA3EDQQOJA4IDYAMbA5MDGwOIA5MDRQOUA5UDlgOXA5gDlwOWA5kDLgNLA5oDmAOZA5YDLQObAwcDBwOcA1cDYwN2A2UD",
    "UANYA3kDWANbA3kDMAN4A34DTQOPA40DTwN5A44DMQN6AwwDWwN9A3kDewNqA50DIAOBA2oDngOfA30DXgNcA5IDcgOgA3MDFgOhA6IDFgM7A6EDRQOjA5QD",
    "oQOkA6IDpAOlA6IDogOlA4gDlAOjA5UDVgOKA2IDLgOaA3UDSwN1A5oDVwOmAy0DBwObA5wDdgOLA2gDewOMAx0DeAOoA34DfgOoA38DfQOpA54DUgONA48D",
    "kQNsAyYDXQOqA1wDogOkAxYDhwOGA4UDYAOTA4gDhQOrA4YDcgN0A6ADrAOtA4MDkwOiA4gDrgOvA7ADpAOxA6UDVQNiA4oDlwOyA5gDmgOzA3UDlwOZA7ID",
    "LQOmA5sDnAOmA1cDtAO1A7YDtwONA48DeAN+A6cDewOdA4wDjAO4AzoDgAOQA6cDqQN9A44DUgNtA40DagN7A7oDOgO4A24DewM3A7oDhAO7A7wDNwO9A7oD",
    "kgNcA6oDNwNuA70DkQM8A2wDvAO7A4QDcAO+A78DFgOhAzsDpAOhAxYDggOJA8ADRQOVA6MDsAPBA64DkwOIA6IDowPCA5UDcwPDA3QDrwPEA7ADsQPFA6UD",
    "tAO2A7UDxgPHA8gDjAOdA7gDagO6A50DpwOQA6gDfAN6A1wDkAPJA8oDyQPLA8oDegOqA10DugO9A8wDbQOSA80DzgPPA9ADgwOtA6wD0APPA9EDhgOrA4UD",
    "cAO/A74DcQOCA9IDiAOkA6IDdAPDA6ADcwPTA8MDcQPUA4kDsgOZA5gDswOaA3UD1QPWA9cDtwPYA9YDtwOPA9gDfQOfA44DfQOOA3kD2gPbA9wDeAPdA6gD",
    "qAPdA6cDXwPeA98DqQOfA+ADfAPhA3oDjQPhA3wDqQPgA54D4APiA54DnwOeA+ADbQPNA40DywPJA+MD0APPA84DrgPBA68DoAPkA3MDiAPlA6QDiAOlA+UD",
    "cwPkA9MDwAOJA+YDsAPEA8ED5wPEA68DsQPoA8UD6APpA8UD6gOLA+sD6wOLA+oD1wPWA+wD7APWA9gD2QPHA8YD2AOPA40DnwOpA44D7QO4A50DygPLA+4D",
    "yQOQA8oDywPjA+4D4QOqA3oD7wO5A6gD4gPgA54DuAPwA24DvQNuA/ADzwPQA9ED8gPzA/QDvQP1A8wD0gOCA8ADpAPlA7EDwQPnA68DlQPCA/YD0gPUA3ED",
    "wQPEA+cD5QPpA/cDxQPpA+UD+AP5A7UD1QPsA9YD1gPYA7cDtwPYA40DyAPHA/oD+wN4A6cD2gP6A9sDXwPfA94DjQPNA+EDqAO5A+8DugPMA/UDqgP9A5ID",
    "kgP9A80D/gP/AwAEwAPmA9IDAQQCBP8DowOVA/YD5AMDBNMDowP2A8IDAwQEBNMDoAPDAwMExAMFBOcDxQPlA6UDBgTCA/YDBgQHBMIDwwMIBAME1APmA4kD",
    "sQMJBOgD5gPUAwoE0wMIBMMDtQP5A/gD1QPXA+wDygPuA8kDnQO6A+0DugPwA+0DyQPuA+MD4QPNAwsE7QPwA7gD7wMMBLkDugO9A/AD5AOgAwME5QMNBLED",
    "wgMHBPYD0wP3AwgE1AMOBAoECAT3Aw8E1gPsA9gD7AMQBBEEEAQSBBEE3QP7AxME+gMVBNsD4AMWBOID4QMLBP0D4APiAxYE8wMXBPQD8QMYBJEDugP1A70D",
    "kQMYBPEDAQT/AwIE0QMZBBoEAQQCBBsEAQQbBAIE0gPmAxwEsQMNBAkE5QMdBA0E5gMKBBwEBAQeBNMD5wMOBMQD5QP3Ax0EBwQfBPYDxAMOBAUE0wMeBPcD",
    "IAQcBAoEBQQOBNQDBwQPBB8E9wMfBA8E9wMhBB8E6QMhBPcDpgOcA5sDIgQjBCQE7AMRBCUEJQQQBOwDyAP6A9kDEQQSBCYEJwQoBCkE3APbAxUEKgQSBBAE",
    "zQP9AwsE8wPyAxcE0QMrBBkEBQQsBOcDBwQGBC0ELgQvBDAECAQPBAME5wMsBA4E9gMfBC0EBQTUAywE9wMeBB0ECQQxBOgD6QPoAyEEMgQjBCIEIgQkBDIE",
    "MwQ0BDUEMwQ1BDYEMwQ2BDQEEAQlBDcE2QP6A8cD+wPdAxMEEAQ3BCoEKATuAykEuQMMBDgEOQQYBPED9AMXBPIDGAQ5BPED/wP+AwAE0QMaBCsEGQQ6BBoE",
    "OwQ8BD0E9gMtBAYEPAQ+BD8ELwQuBEAEMARABC4E0gMcBEEEDwQEBAME0gNBBNQD1ANBBCwEDwRCBAQELQRCBAcEDwQHBEIENQRDBEQENARFBDUENQRFBEME",
    "NQREBDYENgREBEYENARGBEUENgRGBDQE+wNHBBMENwRIBCoE3gNJBEoEKgRIBBIEuQM4BO8D7wM4BAwE3gNLBEkE4gNMBBYEPQRNBDsEKwQ6BBkEPAQ/BD0E",
    "PAROBD4EBARCBB4ELwRPBDAELARQBA4EUAQwBA4EHAQgBEEEMQQhBOgDDgRRBAoEHwQhBFIERARTBFQEQwRTBEQERQRVBEMEQwRVBFMERQRWBFUEJAQjBDIE",
    "RARUBEYEVARXBEYERQRXBFYERgRXBEUEEQQ3BCUEEQQmBDcEWARZBFoENwQmBEgE+wNcBEcEWAReBFkE+wNfBFwEEwRfBPsDYARhBGIE7gMoBCcE7gNjBCkE",
    "KQRjBGAEEgRIBCYE3gNKBEsEFgRlBOIDZQRMBOIDGARmBDkEGgQ6BCsEZwRoBGkEOwRNBDwEPQQ/BE0EagQaBGsEagRrBGwETgRtBD4EDQQdBAkEHQRuBAkE",
    "HQQeBDEEHgRvBDEELQRwBEIEbwRxBDEEQgRvBB4EHwRwBC0EMQRxBCEEIQRyBFIEUwRzBFQEUwR0BHMEVQR0BFMEVQRWBHQEVARzBFcEcwR1BFcEVgR1BHQE",
    "VwR1BFYEdgRbBHcE/AMUBHgEFQR5BHoEWAR9BF4EfgR/BIAEgQSCBEoEKQRiBHwEJwRdBO4DSQRLBEoEPARNBE4EPwROBE0EPwSDBE4EPgSDBD8EHQQxBG4E",
    "QARPBC8EQQRQBCwEbgQxBAkEbwRCBIQEMARPBA4EDgRPBFEEIAQKBEEEHwRSBHAEdASFBHMEcwSFBIYEdQSGBIcEcwSGBHUEdASHBIUEdQSHBHQEiASJBIoE",
    "/AN4BBQEeASMBBQEFASMBHgEfgSNBH8ESgSCBIsEXASPBCgEXQRjBO4DgQRKBIsEkAQ4BF8EFgSQBGUETASQBBYEOQRmBBgETASRBJIEkwSUBJUEagSWBBoE",
    "lgRrBBoEMASXBEAEUASXBDAEbQSYBD4EbQRwBJkEbQSZBJgECgRRBEEEhQSaBIYEhQSbBJoEmgScBIYEhgScBIcEhwScBJsEhwSbBIUEiQSdBIoEngSfBKAE",
    "RwShBFsEowSkBKUEfARjBF0EpgSnBKgEpgSoBKcEpwSoBKkEOQRmBKoEagRsBJYEqwSsBK0EbQROBIMEawSWBGwEcQRvBK4EQgRwBK8EQQSwBFAErwSEBEIE",
    "sQRRBE8EcASyBJkEUgSyBHAEmgSbBLMEmwS0BLMEswS1BJwEmgSzBJwEnAS1BLYEnAS0BJsEnAS2BLQEWASiBH0EgAR/BI0EnwS5BKAEWwShBF8EXwS6BJAE",
    "fARiBGMEYwRiBGAEYARiBGEEkARkBDgEkARMBGUEZwRpBGgEqwStBLwEqwS8BL0EvQS+BKsEqwS+BKwEvQS/BL4EbwSEBMAEbwTABK4EPgSYBIMETwRABMEE",
    "sQRPBMEEUASwBJcEbQTCBHAEbQTDBMIEgwTDBG0EcATCBK8EIQRxBHIEhARyBHEEhASvBHIEUQSwBEEExATFBMYEswS0BLYEigSdBIkEdwShBMkEeQS3BMgE",
    "eQTIBIAEewR3BFsEoQTMBF8EywTNBI0EzgSOBM8EkATQBGUE0gTTBNQEOQSqBGYETASSBJEEkwSVBJQE1QTWBNcE1QTXBNgE1wTZBNgErQTaBLwErATaBK0E",
    "vAS/BL0EvgTbBNwEvgTcBNoEvgTaBKwEvgS/BNsEvwTdBNsE3gTfBOAEQASXBMEEmAThBIMEhARxBMAEwwSZBMIE4gTjBLEEsQTjBFEEmQTkBJgEsgTkBJkE",
    "UgTlBLIExgTFBMQEswS2BLUEigSJBIgEngSgBJ8EyQTmBHcEoAS5BJ8EowSlBKQEygTNBMsEywToBM0EjgTpBM8EkARlBNEE1ATqBNIE1QTrBNYE1QTsBOsE",
    "1QTXBOwE1QTYBNcEpwSpBO0E2ATZBO4E2QTvBPAEvATxBL8EvATaBPEE8QTbBL8EvwTbBN0E3ATbBNoE2gTbBPEE8gTgBN8E2wTzBN0E2wTdBPME8wT0BPUE",
    "wgTDBPYEcQSuBPcE9AT4BPUE+QSXBLAEcQT3BMAEUQTjBPoEwgT7BK8ErwT7BHIEmATkBOEEUQT6BLAEcgT7BFIExgTFBPwExQT9BP4E/ATFBP4EuAQEBY8E",
    "BQXnBAYFzAQEBbgEAwUHBegEAwXoBMsEDgUKBaQEDwXRBJAEDwWQBLoEEAUHBREFEQUSBRAF6wTsBBMFFAXWBOsEFQWRBJIEkQQWBZIEFAXXBNYElQQXBRgF",
    "GQUUBdYEGgUbBRwFHQWSBBYFHgUfBSAFIAUfBfIE8gTeBOAEIQX0BPMEIgXCBPYEIwXBBJcEIQX4BPQEJAXzBPUE3wTeBCUFsQTBBCYFJwXDBMIEgwQoBcME",
    "KAWZBMME+wTCBJkEKQWZBCgFKQX7BJkE+gQqBbAEKwXlBFIELAUtBS4FLQXGBC8FxQTGBDAFMAUxBcUExgT8BDAFxQQxBf0EMQUyBf0E/AQzBTAF/QQyBf4E",
    "/AT+BDMFMwX+BDIFxwTIBMoENQU2BQ4FNwU4BTkFeQQABbcE5gQ6BcwEOwU8BTYFCwU4BT0FPwVABUEFzAQPBQQFQgVDBQUFQwXnBAUFRAVFBUYFPwVBBUAF",
    "jgTOBOkEDwU6BdEE6QTOBM8EPwVBBeoEPwVJBUEFPwXqBEkF6gTUBNMESgVLBdME1gQTBdcE7ATXBBMFFAUZBdYE1wQUBdYElQQYBRcFHAUbBRoFTAUfBR4F",
    "kgQdBRUFTQXyBB8F8gRNBd4EIwWXBPkEwQQjBSYFIgUnBcIEIwX6BCYFgwThBCgF+gTjBCYF+QSwBE4F4QTkBCUF4gRPBeME4wRPBVAFTwUqBVAFUAUqBfoE",
    "UgT7BCsF5ARRBSUFUgVTBVQFUgVUBVUFLQUvBcYEMAVWBTEFMAVXBVYFMQVWBTIFMAUzBVcFMgVXBTMFMgVYBVcFtwRaBf8EBQUGBUIFWwVEBVwFYAVhBUAF",
    "twQABVoFOgViBcwEWwVjBUUFWwVFBUQFXAVkBWUFOwVoBTwFPAVpBTYFywToBAMFAQVrBWwFuQRtBUcFOgVuBdEE0QRuBbsEQwVvBXAF6gTTBNIEqASnBHEF",
    "FAUTBdYEqARxBakESwVKBUwFpwTtBHEFkQQdBRYFkQQVBR0F2ATuBNcEcQXtBKkEcgVzBXQFTAUeBUsF1wTuBNkE8wQkBXUFdQUkBXYFdgUkBXcFIQXzBHUF",
    "8gTfBCAFeAV5BXoFrgR7BXwFfAX3BK4EfQV+BXgF+QR/BSMFJQXeBCgFfgV5BXgF+gQjBX8FwwQnBfYEsQQmBX4F+gR/BVAFsQR+BeIE4QQlBSgF4wRQBSYF",
    "sAQqBU4FJQVRBYAFTwWBBSoFggWBBU8FsgSDBeQE5ASDBVEFgwWyBOUEhAWFBVYFVgWGBYQFVwWGBVYFVgWFBTIFhQVYBTIFWAWGBVcFhwWIBYkF5gTJBIoF",
    "yAT/BAAFzARdBYoFiwU4BTcFCAUJBV8F5wSQBQYFQAVhBWAFYgU6BQ8FDwU0BQQFCwUKBQ4F5wRDBZAFZwUNBegERwWTBUgFQQVJBeoEZQTQBNEEEQUQBRIF",
    "0wRLBUoF6wQTBRQFTAVNBR8FdgV3BZQFdAVzBXIF2QTwBO8EHQWVBRUFeAV6BX0FTQXfBN4EwAT3BK4EfQWWBX4FJAX1BPgE3gSXBSgFIwWYBX8FJQWABZcF",
    "JgVQBU8FKAWZBSkF4gSaBU8FfgWbBeIE+wQpBSsF4gSbBZoFmgWbBYIFggWbBYEFLAUuBS0FhAWGBYUFhQWGBVgFiQWIBYcFnAWdBZ4FZQWfBVwFjAWgBY0F",
    "igViBeYEOAWLBZIFYgU6BeYENQUOBVkFPQU4BWoFjgWPBaIFOwVpBWgFOwU2BWkFWQUOBTYFPQVqBQsFZwUNBaQFNAUPBV0FAgVmBaUFpwWRBagFAgWpBWYF",
    "bAWoBZEFpwWoBW0FbQWTBUcFZgWpBawFSgVLBa4FTAVKBa4FTAUeBU0FTAWuBR4FHgWuBUsFrwWwBbEFTQUeBd8EdwUkBZQFHgUgBd8EdQWyBSEF9gSzBSIF",
    "sgUkBSEFIQUkBfgErgT3BHsFfQV6BZYFJQWXBd8E9gQnBbQFfgWaBXkFfwWYBVAFJgVPBX4FfgVPBZoFmQW1BSkFKQW1BSsFKwW1BeUEKgWBBbYFUgVVBVQF",
    "UgVUBVMFtwW4BbkF/wRaBQAFYAW8Bb0FjwW+BaIFRAVjBVwFvwXABcEFogXCBY4FvgWPBV8FZQVkBaMFjgXCBY8FAgWlBakFDQWqBaQFpgWTBW0FSAWTBakF",
    "QwVwBW8FwwXEBcUFsAXGBccFlQUdBRUFdgUkBXUFdQUkBbIFlAUkBXYF3wTIBd4EyQXfBMoFlwXKBd8EfAXLBfcE9wTMBXsF3gTIBZcFIwXNBZgFywXMBfcE",
    "IwV/Bc4FJwUiBc8FfwVOBc4FfwX5BE4FlwWABdAFUAWYBU8F0QWbBZYFlgWbBX4FmgWCBdIFmAWCBU8FzwXTBScFJwXTBbUFJwW1BbQFTgUqBbYFtAW1BZkF",
    "mwXUBYEFgQXUBbYF5QTVBYMFuQW4BbcFvwXYBdkFvwXZBcAFXQViBYoFowXaBWUFYAW9BbwFpAXBBWcFNAUMBQQFkQWnBagFkgXeBd8FbQWoBacF3wXgBZIF",
    "OgXhBW4FsAXHBbEF4gXjBeQF5QXIBckFyQXIBd8EewXLBXwF5gXnBZUF6AXRBekF9gS0BbMF6QXRBZYFegV5BZYF6gXrBewFewXMBcsFzQXOBZgF7AXtBeoF",
    "yAXuBZcFeQWaBZYFKAWXBe4FmAXSBYIFtgXvBU4FgAVRBdAFUQXwBdAFtQXVBeUE8QXyBfMF1wX0BdYFZQX1BZ8FvwXBBdgFPgX2BfcFnwX4BaMFvAW9BfkF",
    "2gWjBfoFPgX7BfYFXgX9BTQFXgUMBcIF3AXdBf4FkgXgBd4FNAX9BQwFwgX/BY8FkQWoBWwFpQWtBawFOgViBeEFEAUBBqsFEAWtBQEGrwWxBbAF5QXJBQIG",
    "AwYEBgUGBQYEBgYGBwbEBcMFfAXLBQgGfAUIBgkGygUKBskFsgULBgwG0QXoBQ0G5wXmBQ4G6gXtBesFIgWzBc8FlwXQBcoFDwYQBhEGtAWZBRIG0AXwBcoF",
    "0QUNBpsFmgXSBZYFKAXuBZkFmQXuBRMGtQXTBdUFuQW4BRQGuQUUBrgFFQYWBhcGngW6BZwFowX4BdoF9QXaBfgF/wW+BdsF2gUABqMFjQUYBqEFwQWkBWcF",
    "pAWqBRkGpAWqBWcFDAX9BcIFpQWsBakFpQWrBa0FHAYdBh4GqQWTBaYFHwYgBiEGAwYFBgYG5QUiBiMG5QUCBiIGxgWwBSQGsQXHBbAFsAXHBSQGxgUkBscF",
    "yQUKBgIGCQYIBiUGsgUMBgsGzQUmBs4FIwXOBc0F4gXkBScG4gUnBuMFygUoBgoGtAUpBrMFlgUqBukFEQYQBg8GzgUrBpgFswUpBs8FtAUSBikGmAUrBtIF",
    "ygXwBSgGTgXvBSwGzwUtBtMFtgXUBS4GmwUvBtQFLwUwBjEG8wXyBfEFjAUyBrsF9QX4BZ8FMwY0BtkF2AUzBtkFiwXWBfQFogW+Bf8FwQU1BtgFvgVfBdsF",
    "NwY4BjkGpAU6BqoF3QU7Bv4FPQY+Bj8G4AXfBTwGIAYhBjgGHAYeBh0GOAYhBiAGqwUBBq0FHwYhBiAGHwZBBiEGHwYhBkEGxQUHBsMFlQUOBuYF5wUOBpUF",
    "yAXlBSgGCQYIBnwFfAUIBssFyAUoBu4F5AVCBicG4wUnBuQFzgUmBisGKQYSBkMGTgUsBs4FKQZEBs8FKgaWBdIF0gVFBioGKwZFBtIFLAbvBS4GLgbvBbYF",
    "zwVGBi0GRQYvBpsFUQVHBvAFLgbUBUgG0wVJBtUFLwZIBtQFMQYwBkoGLwUxBjAG+AX1BU4GPgX3BfsF9gVQBvcFwgVRBl4FogX/BcIFvQW8BfkFGQaqBToG",
    "/QVRBsIF/wVTBo8FNwY5BjgGGgZWBnAFVgYbBnAFAwYGBlwGxAUHBsUFIwYKBuUFAgYKBiMGBAZcBgYGxwVdBiQGCQYlBggG5QUKBigG6AXpBQ0GzgUsBs0F",
    "7gUoBl4G6QUqBg0GEgaZBRMGzwVEBkYGXgYTBu4FmwUNBkUGLgZIBl8GLQZGBtMFUQWDBUcGgwXVBWAGFQZhBhYGFQYXBmEG1wVNBmIGFwZjBmEG9QVPBk4G",
    "8QVkBmUGTQZMBmYG+AVOBk8GZQZkBjkGXgVRBmcG+wVQBvYFXgVnBv0FZwb/BWgGaAb/BWkG2QU1BsAF/gU7BlIGVQZqBjsGawZXBuEFQAaPBVgGNgY8Bt8F",
    "AgYjBiIGAwZcBgQGBwZsBm0GCwZuBgwGKQZDBkQGJgZvBisGLgZfBiwG7QVwBusFDQYqBkUGRgZxBtMFcQZJBtMFYAZHBoMFMQZyBjAG8QVzBnQG8QV0BnMG",
    "FgZhBhcG2AU1BjMG9AV3BkwGGQY6BqQFQAZ4BmkGZwZRBv8F2gX6BQAGGwZWBhoGegZ7BnwGxwUkBl0GbQZsBgcGzQUsBiYG7AV9Bu0FXwYmBiwG7AXrBX0G",
    "6wVwBn0GKwZvBkUG8AVeBigG8AVHBl4GfgZIBi8GXwZIBn4GSwZ2BvcFZQZ/BvEFZgaABk0G8QV/BmQGgwaCBoUGNQY0BjMGhgZVBocGVAaJBooGPQaOBj4G",
    "awaPBlcG/AVbBosGPgaQBj8GPQY/Bo4GPwaQBlcGfAZ7BnoGbgYLBgwGbAZtBpEGkgaTBlwG5AUnBkIGXwZvBiYGfQZwBu0FJwaUBkIGbwaVBkUGRAZDBhIG",
    "5gWWBg4GJwZCBpcGlQYvBkUGJwaXBpQGEgYTBpgGXgZHBpkG1QVJBmAGMAZyBkoGmgabBpwGnQabBpoGuAWdBhQGFAaeBrgFFAadBp4GnwaDBoUGOQZ/BmUG",
    "eAaIBmkGZAZ/BjkGGAajBqQGaQZYBlMGVQaGBqUGiAZYBmkGGAakBqkGqgarBqwGWAatBkAGsAaxBrIGVwaOBlkGtwa4BrkGXQYkBroGXAaTBrsGDgaWBuYF",
    "mQa8Br0GEgZGBkQGXgaZBhMGlAa+Br8GmQZHBrwGRgYSBpgGmAZxBkYGYAbABkcGwQbCBsMGuAWeBp0GxAbFBsYGnAbFBscGxwbFBsgGxwbGBsUGnAbHBsUG",
    "xAbLBsUGxQbLBsgGygbMBs0GygbNBsQGxAbNBssGnwaFBtAGYQahBhcGFwahBmMGhAZjBtQGhwY7BtIGaQZTBmgGtAbXBowGOwavBtIG/wWoBtgGjgbZBj4G",
    "/wXYBlMGPgbZBpAGiAatBlgGHQZaBtoG2gZaBtsGsAayBrEGjgaPBlkG3AbdBt4G3wbgBuEG4gYkBl0G4wbkBuUG5gbkBuMGvQbnBpkG6AbpBuoGmQaYBhMG",
    "6wbsBu0GXwZ+Bu4G7wbwBvEGwwbCBsEG8gbzBvQGdQb1BksGxAb2BskGxAbGBvYGyAb3BscGxwb3BsYGyQb4BsoGyAbLBvcGygb4BswGzAb5Bs0GzQb5BssG",
    "/Qb+Bv8GoQbUBmMGUwYAB2gGGAapBqMGUwbYBgAHVAaKBgIHeQaPBmsGVAYCB4oGiQZUBooGjQYDB4wGtAazBqsGeQYEB48GtgYGB4sGrgYHBwgHtga1BgYH",
    "fAYMB3sGuQYNB7cGuAYNB7kGXAa7BpIG3AYOB90GDwcOB9wG3wbhBuAGugbiBl0G3AbeBg8HbwbuBpUG4gYQByQG5QbmBuMGQgaUBpcGbwZfBu4GlQYRBy8G",
    "6gYSB+gGmAbtBnEGvAZHBhMHLwYRB34GcQbtBhQHcQYUB0kGYAYVB8AGSQYVB2AG8QbwBhYHFwcYBxkHmwaaBpwGmgabBp0Gxgb3BvYGywb2BvcGywb5BvYG",
    "+Ab5BswG0QbPBs4G+gbQBoIGggb8BvoGrwbTBtIGagauBtMGqQayBrEGrAarBqoGHAcdBx4HiwYGByMHBgckByMHqQaxBrIGjwYlB1kGCQcmBwoHWQYlB7UG",
    "JwcoByYHfAZ7BikHtwYNB7gGvQYqB+cG3QYOB94GuwaTBpIGJAYQB7oGbAYrB20GLAeVBu4GLQcuBy8HbQYrB5EG6gbpBhIH6wYwB+wGmQYxB5gG5wYyB5kG",
    "vwa+BjMH7AYUB+0G6AYSB+kGRwbABhMHFAcVB0kGFgfvBvEG8gb0BvMG/wb+Bv0G+gafBtAGoAY4B3cG0walBoYGqwazBtcGrgalBtMGqAY7B9gGPAciBz0H",
    "rgYIBz4HHAceBz8HpwbaBhsHjAbXBrMGeQZABwQHiwYjBwEHJwdBBygHJgdBBycHJgdCB0EHCQdDByYHIgdEByAHjwZFByUHtQYlBwYHuAZGByoHuAZHBw0H",
    "uAYqB0gHuAZIB0cHSQdKB0sHbAaRBisHSwdMB0kHvQYyByoH5QbkBuYGMgcxB5kGLAcRB5UG6wYUBzAH7QYUB+sGvwYzB5QG7QYVBxQH7gZ+Bk0HlAYzB74G",
    "EQdNB34GTgdPB1AH7wYWB/AGMQZKBnIGYgZ3BjgH1QY5B6cGQAd5BlEH0walBj4HUgdTB1QHOwcAB9gGpgYbBzoHPQciBzwHPgcHB64GIAdEByEHjwYEB0AH",
    "HwfbBgUHCAcHBxoHJgdDB0IHCwdDBwkHDAcpB3sGDQdGB7gGSwdKB0wHWQdaB1sHDgcPB94GugYQB+IGXAddB+UG5QZdB1wH6QZeB18HmAYxB2AHvAYyB70G",
    "mAZgB2EHvAZiBzIHmAZhB+0GvAYTB2IH7AYwBxQH7QZhB2MHMQdkB8AG7QZjBxUHYwfABhUHvgYzB2UHwAZkBxMHTgdmB08HGQcYBxcHZwdoB2kHNQfRBmoH",
    "NQdrBzYHbAc2B2sHNwdtB4EGbQfWBoEG+wZRB24HogZwB24HUgdUB3EHcgdxB1QHogZuBwEH0wZzB6UGdQd2B3cHPgcaB3gHpwY5B9oG2gY5Bx8HVAd5B3IH",
    "QAdRB3oHIQdEByIHfAdFB0AHegd8B0AHfAclB0UHfAckBwYHQwcKB0IHJgcoBwoHQwcLBwoHBgclB30HRgdIByoHDQdHB0YHKgcyB+cGLwcuBy0HTAdKB0kH",
    "7gZ+BywH7gZ/B4AHLAeBBxEH7gaCB38HfweCBxIHEgeCB4MH6QaEB14HEQeFB00HTgeGB2YHZwdpB2gHZwdpB4cHYgY4B6AG1gaKB1EHPgdzB9MGcwc+B3gH",
    "UQcBB24Hcwd7B6UGjAd3B3YHGgeNB3gHCQePB0MHQwePB5AHCQdDB48HHQc/Bx4HBwc+B5QHBweUBxoHlQd0B1UHIwd8B3oHQQdCBygHJAd8ByMHDAcpB5YH",
    "CgcoB0IHTQcsB34HgAd+B+4GmQfiBhAHmgebB5wHMgdiB50H4gaZBxAHggfuBk0HMQfABmAHMwe+Bp4HTwdOB1AHnge+Bp8HoAehBxkHogc0B6MHoQegBxkH",
    "pAelB6YHNAeiB6cHaQdnB4cHNgeoB2oHqgegBqsHqQesB/4GbwdSB3EHOAeuB3QHrgdVB3QHrQdTB1IHkAePB68HOgcbB7EHrQdUB1MHegeRB7IHsweVB1UH",
    "kgcFB5cHegeyB7QHVwdWB1gHfAeyByUHmAcMB5YHsgd9ByUHfAd9B7QHfAcGB30HWQdbB1oHmgecB5sHtgeBBywHLAdNB7YHXweEB+kGYwdgB8AGEwdkB2IH",
    "MweeB2UHZQe3B74Gnwe+BrcHTgdPB7gHTge4B4YHTwdmB7gHpQekB6YHNQdqB2sHuQe6B7sHawc2B2wHvwfAB8EHbwdxB8IHcgetB3EHiwd4B40HxQc5BzoH",
    "rQdyB3kHxQc6BzkHrwePB8cHrgfIB1UHyQfKB8sHzAd6B80HUQfNB3oHAQcjB3AHOgexBzkHsQcfBzkHzwfQB9EHdAfSB7MHkQfEB7IHzAd6B7IHjwdDB7UH",
    "0wfUB9UHege0B7IHdAeVB9IHXAfWB10HXAddB9YHtgfXB4EHgAd/B9gH1wcRB4EH2QfaB9sHTQd+B9wHTQfcB4IHggeAB4MHnwfdB54HZgeGB94HawdqB6gH",
    "aweoBzYHqAfhB2oHiAesB4kHvgeuBzgH4gfjB+QHrQfCB3EHjAd2B3UHdweMB3UHUQfDB80HcAevB+cHcwfoB3sHrQfqB8IHcAfsB0EHjwe1B+0HyQfLB+4H",
    "rQfvB+oHkAdBB/AHswfSB5UH0wfVB9QHRgdHB0gHmgebB/QHMgf1B/YHMgedB/UH9AebB5oH9wcxBzIH2AeDB4AH1wf4BxEHngefB2UHngfdB58Htwf5B/oH",
    "ZgfeB/sHhwf8B2kHhwdpB/wHvAe6B7kHxwftB/8HiweNB/4HOgfmBwEIcAfpB+cHrgeOB7MHwgfvB60HOgcBCLEHjwe1BwQIAAiNB5QHAQgGCLEHOgexBwUI",
    "dgcHCAgIzAfNB5EHjwftB7UHzgcHCHYHswfIBwkIIwe0B80HQQfsB/AH8AcKCJAHtQcLCO0HkweSB5cHzAe0B3oHtAd9B7IHKQeYB5YHDgjWBw8IEAj4BxEI",
    "EQj4B9cHgAfcB34HfwcSB9gHXwcSCIQHEwgUCBUIDggPCNYHMgf2B/cH9AcWCJsHgAeCB9wHEgeDB9gHnQdiBxcIFQgYCBMIEQf4B4UHZQefB7cH/QfgB98H",
    "vwfBB8AHiQesB6kHvQfGB4kH6AdzBxsIrwcdCOcHdgcICM4HwwcDCM0HxwceCK8HAgiuB7MH5wfpB+wHzQcDCJEHIAgHCM4H7QcLCLUH7QcLCP8HsgcMCMwH",
    "DAi0B8wHzQe0ByEIkgciCJcHJAglCCYI1wcnCBEItgcnCNcHXwdeBygInQcpCPUHFwgpCJ0HEggoCF4HFAgYCBUIhAcSCF4HtgeFByoITQeFB7YHFAgTCBgI",
    "MQf3B2QHtwcrCPkH+QcrCPoHZgcsCLgHuAcsCIYHLAjeB4YHLQj7B94HLggvCDAILggxCC8ILggwCDEIagfhB6gHiAccCL0HNAg1CMYHHggECK8HAwg8CAwI",
    "lAfoBxsI8Qc7CPIH7AchCD0ICQgmCD4IlwciCJIHQQhCCAoICghDCEEIEQhECBAIJwi2B0UIEAhECPgHRghHCEgI9AebBxYIYAdJCGEH2wdKCNkH2QdKCNsH",
    "2gfZB9sHYQdJCGMHYAdjB0kIFAgYCEYIZAdLCGIHtwf6BysIZgf7BywI+wctCEwI4gfkBzkI5AfjBzkIHQjpB+cHGggfCFEIHggLCO0H0QfQBzUIUwg8CAMI",
    "UAg8CFMI7AfpB1QIBAhVCB0I8wc/CFYIBAgLCFUIswcJCB8IwgdYCFkIwgfqB1gI5QfUB1oIPAhcCAwIPQgKCOwHCghCCAsIwgdeCO8HPQhDCAoI6gdeCFgI",
    "QghfCGAIYQhiCGMIEQgnCEQIZAj4B0QIJwgqCEQItgdlCEUISQhgB2YItgcqCGUI+AdkCGcISghoCNsHKgiFB2kIFwhiB0sIZwiFB/gHaghrCGwIawhtCGwI",
    "TAhuCPsHcAhxCHIIAwhQCFMI6Qc6CHUI5QdaCHcI0Ac2CDUIIAhSCAcIHQhVCFQICwhCCFUIVwgNCLAHPwjyB1YICQhbCCYIJghbCD4IJAgmCCUIQghgCF8I",
    "QQhfCEIIYQh6CGIIYgh6CHsIewh6CHwIewh8CH0IfAhkCEQIRAh9CHwIXwcoCH4IRwh/CEgIRQhlCCcIXwd+CBIIJwhlCCoIDwiACIEIKQiCCPUHFwiDCCkI",
    "2weECEoIFAhGCBgIZAf3B0sISwj3B4UIhQdnCGkIagiGCGsIhwiICIkI+geKCIsILAiMCN4H+wduCI0IcAhyCHEI4Af9B3QI4QeOCHMIHAiPCL0HdAiQCDMI",
    "TghRCBoIHwg3CP4HPgiVCFsIUAiWCDwIIQiWCDoIygfuB5MIwgdZCF4I1AeZCFoIlghcCDwIIQhACJYIQghfCFUIVQhfCFQIYQhjCJoIVAhfCEMIQQhDCF8I",
    "mgh6CGEImwhjCGIIYgh7CJsIewh9CJsIfAh6CGQInAgWCJ0IRAgqCH0I9gf1B4UIKQiDCIII3AeeCJ8IoAj2B6EIggiFCPUH3AefCJ4I9gegCPcHZghgB0kI",
    "9wegCIUIogijCKQIpQikCKMIhwiJCIgIigimCIsILAj7B4wI+weNCIwIpwioCKkIMAiqCDEIkQisCDgIUwhQCHUIrgh2CK8IXQisCHYIsgizCFkIdgi0CAYI",
    "sghZCLUIOgiXCJII5QeZCNQHPghbCJUI8ge7CFYIVAhDCLkIQAhcCJYIvAh5CHgImwi9CGMInAi+CBYIgQiACA8IhAjbB2gIfwhHCEYIvwhKCIQIowiiCKQI",
    "wAijCKIIpAilCMEIhghqCGwIiwimCMIIawjDCG0I+gfECIoIjAjFCN4HxQgtCN4HLQjGCEwILwgxCKoIMggZCMcIGQjICMcIyQj9BzMIGghRCMoIsQjMCFII",
    "rAiRCDgIzQjOCM8IzQjPCNAIzAjTCFII6wcNCNIIuwjyBzsI1AgjCJgIXghZCFgI1ggiCHkI0wjXCNgI2QjaCJoI2QiaCNoIlwjbCD0I3AjdCN4IYwi9CJoI",
    "mgi9CHoImwh9CN8I3whkCHoI4AicCJ0I4QiCCIMIRQhlCOIIKghpCH0InQgWCL4IhAhoCL8IoAj2B4UISAh/CEYIgwgXCOMIFwhLCOMIowikCKUI+geLCMII",
    "5AjlCOYI5gjlCMMIwgjECPoHbAhtCOcI5whtCOgIwwjnCG0IbQjnCOkI6QjoCG0IjQjqCIwIjQhuCOsI7AjGCMUIxQjGCC0ITAjGCG4IqAinCO0IqQjtCKcI",
    "LwiqCDAIcgjuCO8IcwiOCE8IMwjwCMkIkAjwCDMIrQiUCLcIyweTCO4HsAjTCPMI9QhWCLsI0QhaCJkI7gf3CJMI+Qj6CFsI0wjYCPwI3gj9CNwI+gj5CFsI",
    "mwjfCL0IvQjfCHoI/gihCKAI9gegCKEI3whnCGQInQi+COAIgQj/CIAIZggACUkIgggBCYUIfggCCRIIEggCCSgIogijCMAIvwhoCEoIgwjjCOEIhQjjCEsI",
    "pAjBCKUIhghsCGsIbAjnCGsIawjnCMMIAwkECQUJBgmKCMQIBwnqCAUJBQnqCAMJBgkICYoIiggJCaYIjAjqCMUICgkJCYoICwnsCAwJDAnsCMUIDAnFCAcJ",
    "jQgNCeoIDgnsCAsJ6wgNCY0IDQnrCAoJ7AgOCQ8J7AgPCcYIqQioCO0IEAkRCRIJEAkTCREJEAkUCRMJcggVCe4IFwkYCRkJrgivCHYIGgkbCRwJzQj0CM4I",
    "HQn3CB4JWQizCLUIWQgfCbMIqwj9CCEJtgirCCEJ8gjQCMoIGgkiCRsJHgn3CLMIWQizCB8J0wgkCdcIHAkiCRoJ0wj8CCQJ/QjeCPgIJQkmCbsI2AgnCfwI",
    "KAkpCSoJ3ggrCfgI3gjdCCsJKQkoCSoJLAktCS4J4ggvCUUIggjhCAEJfQhpCN8IRQgvCWUI3whpCGcInAjgCL4IgQiACP8ISQgACWYI/gigCKEIAQnjCIUI",
    "5wjoCOkIpggwCcIIwwjlCAsJ6QjDCAsJ6ggxCQMJpggJCTAJCwkMCekIiggICQoJBwnFCOoI6ggNCTIJCgkzCQkJCgnrCDMJbgg0CesIxgg0CW4IEgk3CRAJ",
    "EgkRCTcJEAk3CRQJEwk4CREJEwk5CTgJOgk7CTwJPAk7CRUJOwk9CRUJ7wgVCXIIzQjQCPQI8gjxCNAIFwkZCT4JdwitCLcI0AjPCPQI8AiQCCMJkwjwCCMJ",
    "9wgdCUMJ0wjMCPMIkwhDCfAIRQlXCEYJkwj3CEMJuAi5CEEJRQm6CFcIHAlHCSIJOwj1CCUJmAhICdQIIwlJCfcILQksCS4J4QhKCQEJSwlMCb8I4ghlCC8J",
    "wwhNCeYIMAnECMII6QgMCU4JBQlPCQcJDQkICVAJCAkNCQoJDQlQCTIJxggPCVEJxghRCTQJ7QhSCVMJEQlUCTcJNwlUCRQJEQk4CVQJFAlUCRMJOQlVCVQJ",
    "OQlUCTgJEwlUCTkJOQlUCVUJVgk6CVUJOgk8CVcJMgjHCG8I7wg9CRUJFQk9Ce4IPQnvCO4IWAlZCVoJIwmQCPsIswgfCVwJGwkiCRwJ0QhdCZkI+Ai2CCEJ",
    "/Qj4CCEJQQm5CGEJRwliCSIJQwn3CEkJYwlhCbkI/QhkCWUJ/AjYCCQJZQncCP0I+AgrCWUJ3AhlCd0IvwhMCUsJZwkoCGgJ4QjjCEoJaQlqCS8J/whrCWwJ",
    "5ghNCeQI5AhNCeUITQltCeUIwwjpCE0JAwkxCQQJBAlPCQUJMQlPCQQJxAhuCQYJMAkJCcQIBgluCQgJxAhvCW4JxAgJCW8JcAkOCQsJcQlvCQkJCQkzCXEJ",
    "UAlyCTIJ6whzCTMJNQlNCHQJOglXCTsJ8Qh1CXYJdAh4CZAIdgl6CfEIrQhACVsJRAl9CT4JIAl+CVkJfglaCVkJXQmACfMI9whDCbMIHwmzCFwJXwleCYQJ",
    "hQl8CYYJRgmHCUUJIgliCRwJtwiCCUAJRQmHCWYJ+AhlCdUI1QhlCSsJ1QgrCWMJ2Aj8CCcJigmNCYsJLQmOCS4Jawn/CI8JaQkvCZAJKAiRCWgJkgmTCZQJ",
    "lQmWCZcJ5QhtCQsJCwltCXAJbwmYCW4JTgkMCXAJDAkHCU8JCAluCVAJMQnqCHIJcQmZCW8JmgmbCQwJDAmbCQ4J6ggyCXIJDgmbCQ8JmwlRCQ8JUQmcCTQJ",
    "UwlSCe0IdAlNCJ0JVglVCToJVwmeCToJVwk8CTsJPQk7CTwJPAkVCT0JLwifCaAJLwigCaEJdAjJCHgJXQmBCYAJkAh4CUIJ9AiFCXsJ8Qh6CXUJyQjwCHgJ",
    "pglhCacJeAnwCCMJqQmFCaoJ8AhJCSMJ/QirCWQJmAiICUgJZAmsCWUJrAndCGUJjgktCS4JAAmtCa4JAQmvCbAJaQmQCbEJngiyCbMJZwmRCSgILwlqCZAJ",
    "KAgCCX4Iswm0CZ4ItQm2CbcJuAm2CbUJuQm6CZIJ6QhOCU0Jbwm7CZgJmQm7CW8JDAkOCXAJDAlPCZoJTwlyCZoJTwkxCXIJUAluCbwJMwm8CXEJvAm9CVAJ",
    "UAm9CXIJMwlzCbwJmwm+CVEJOgmeCVcJbwjHCJ0JLwihCZ8JPQnuCL8JPQnACe4IwQmiCRYJfAnCCcMJfglZCVoJgAnFCfMIdQnHCcgJfwkcCWIJpgnKCWEJ",
    "WwnLCYIJ/QjGCasJZAnMCc0JZAnPCcwJygmnCWEJqwnPCWQJrAnRCd0I3QjRCSsJrwnSCbAJAQlKCa8JjwlsCWsJsAnSCQEJswmyCbQJ/whsCY8JZwloCZEJ",
    "AQlKCeMIngi0CbIJtQm2CbgJuQnTCboJ1AnVCdYJbgmYCbwJcgnXCZoJcQm8CZkJ6wjYCXMJoQmgCdkJ7gjACb8JxwjICNoJFgl3CdsJWQlYCVoJ3AndCd4J",
    "pQnbCXcJ4AmECaIJywjECeEJogmkCeIJgQnFCYAJgQldCcUJewmGCXwJWQl+CagJewmFCYYJhAleCeAJeQnjCc0JgwnkCXkJyAnHCeUJRwl/CWIJzQnjCawJ",
    "eQnoCeMJ6gnrCewJ7QliCe4J7wnwCfEJqwnGCfIJ9AnwCe8J7AnrCeoJ4wljCSsJiQmLCY0JKwnRCeMJrQn1Ca4JrwlKCfYJ0gmvCQEJrwlKCQEJrgn1CQAJ",
    "rQkACfUJtwm2CbUJ9wn4CUwJtwm2CfkJkgm6CbkJlQmXCZYJTQlOCW0JbQlOCXAJuwmZCZgJmAmZCbwJcgm9CdcJmwnXCb4JmgnXCZsJvAn6Cb0JvAlzCfoJ",
    "cwnYCfoJ6wg0CdgJNAmcCdgJ+wk2CTUJ/AnHCNoJwAk9Cb8J3AneCd0JWgn+CVkJPwl5CaUJwgl8CekJ9ghICf8JgQkACl0JpgmnCcoJwgnpCcMJYgntCe4J",
    "WwlACcsJzAnPCQEK5AmnCcoJXAkDCgQKrAkFCs0JqQmqCc4JhwnmCWYJ7wkCCvQJBgoHCggKBgoICgcKzgnzCYUJ8QnwCfQJZAkBCqwJ5AljCegJZgnmCdAJ",
    "rAnjCdEJYwnjCegJrQkJCvUJsQlqCWkJ9Qn3CQoKlAmTCZIJCwoMCtMJ1AnWCdUJvgkNClEJDgpXCZ4JnQnHCA8KnwnZCaAJEQr+CRAKEApaCVkJognnCeAJ",
    "EgrbCaUJEwp1CcgJFAoHCsUJ/wmICfYIxgniCeAJAwpcCRUKFArFCQcKFwoYCukJBQqsCQEKzwmrCRkKGQqrCfIJ9glKCa8JGgpsCY8JCQqtCfUJGwpsCRoK",
    "HAr3CUwJugnTCbkJDAoLCtMJHQq+CdcJHQoeCr4JHwr6CdgJ2AmcCSAKUQkhCpwJDwrHCPwJDgoiClcJnglXCQ4KVwkiCg4KogniCaMJpQl5CSUKFgrnCaIJ",
    "JQp5Cc0J3wkmCsQJGAooCikKyAnlCRMKeQnkCScKgQlgCQAKeQknCugJzgkoCvMJzgnzCSoKxwkTCuUJygmnCSsKLAotCi4KKwoXCukJMgozCowJjAk0CjIK",
    "ywk1CjYK6Ak3CuQJOAorCqcJOAoXCisKOgo5CjsKOgo7CjwKGQryCT0KGQo9CtEJPgo/Cq8JPgqvCfYJsQmQCUAKQQpACpAJjwlsCRoKbAkbCkIKtglDCvkJ",
    "RApFCkYK1wm9CR0KHgoNCr4JnAkhCiAKUQlHCiEKNQl0CfsJdAmdCUgKJgpKCt8JzgkqCigKEQqoCf4JMgpLCkkKqAlLCkwKEQpLCqgJAwpNCgQKJwo3CugJ",
    "5Ak3CicKpwknCjgKTgovCjwK8gnGCTEKTgpPCi8KPApRCk4KzwkZCjEK0glSClMKkAlACkEKrwk/CvYJaglACpAJtwlUCrYJ+AlVCkwJ+An3CVUK9QkKCvcJ",
    "VQocCkwJHApVCvcJVgpXClgKvQlZCh0KvQn6CVkKWgpbClwKRQpdCkYKRApdCkUKDQpHClEJnQkPCl4KSgpgCt8JogkkChYKognBCSQKEgqlCWEKFApjCmQK",
    "JArGCRYKqAllCv4JAwoVCk0KSQpiCjIKJAoxCsYJOAonCsoJNgpnCssJKwo4CsoJZgopChcK8wloCioKhwnJCS8KKAoYCikKKApoCvMJPApRCjoKPAovCmkK",
    "PAppClEKTwppCi8KFwopChgKTgpRCmkKOQo6CjsKOwo6ClEKOAorChcKagprCrEJsQlACmoKsQlACmoJbAptCm4KbgpvCnAKtwn5CVQKbAlCChoKtglUCkMK",
    "cQpyCnMKcQpzCnQKdQp2CncKcgp3CnYKdQp4CnkKeAp6CnkKdQp5CnoKVgpYCnsK+gkfClkKfApbCloKfQpdCkQKHgp+Cg0KHwrYCSAKnQleCkgK/Al/Cg8K",
    "/AnaCX8KoQnZCZ8JgAqBCoIKSwqHChAKhAqGCogKiQqKCosKKwpmCsoJEwqMCiwKSwoyCocKjQqOCo8KKwpmChcKkQqSCpMKPQqUCtEJawpACrEJbApuCpUK",
    "UwpSCtIJbAqVCm0K+QlDClQKVQocCpYKcQp0CpcKcQqXCnIKcgp2CnMKmAqZCpoKRgpXCkQKHQpZCpsKXQqcCkYKVwp9CkQKHQqbCh4KXAp8CloKHgqbCn4K",
    "fAqdCp4KDwp/Cp8KDwqfCl4KnwmgCtkJyAj9CdoJ2wkkCqEKiwqKCokK/gllChAKKgpoCigKhApNChUKFApkCmMKKwqnCmYKLAqQCi0KiAmoCv8JPQoxCqwK",
    "GQqrCjEKrQquClIK9gk/Cj4KQgqvChoKlgqwCrEKVQqyChwKGgqvChsKHAqwCpYKGwqvCkIKswq0CrUKlwq2CnIKdAq2CpcKcgq2CncKdwq2CnUKdgp1CrYK",
    "cwp2CrYKcwq2CnQKmQq3CpoKuAq5CroKVgq5ClcKRgq7ClcKRgqcCrsKIAq8Ch8KvQq+Cr8KdAlICvsJ2QmgCsEK/QnCCtoJwQkjCiQKBQqmCqMKwwrECsUK",
    "jgqpCo8KjQqpCo4KiAmlCqoKEwosCowKMgo0CsgKkQqkCpIKyQrKCssKygrNCssKMQqrCqwK0QmUCqsKPQqsCpQKPgrOCj8KagpACs8KQAprCs8KsQrQCq4K",
    "cApvCtEKVQqWCrIKswq1CrQKdQp6CngKWArSCnsKewq5ClYKWApXCtIKVwq7CtIKWwp8ClwKDQrTCkcKvQq/CtQKfwrVCp8KnwnZCaAKggqBCoAK/QmDCtYK",
    "JQqjCl8KJgrYCtcKhQoVCtkKhArZCk0KyQrLCsoKxQrECsMKhAqICoYKFQpNCtkKpwrbCtwKLgqQCiwK3QrMCscKqwqUCqwK3grfCuAKagrhCmsKagrfCuEK",
    "Pgo/Cs4KrgrQCrEKrgqtClIKrgrQCq0KcArRCm4KlQpuCm0KsQrQCpYKsQqwCtAKbgrRCm8KrwriCuMKrwrkCkIKsgrlChwK4wrkCq8KHArlCrAKmArmCpkK",
    "mAqaCuYK5gq3CpkK0gq5CnsKuQrnClcKWQofCrwKuwqcCn0KfQqcCl0KVwrnCn0KnQp8CugKvAogCugKIArpCugK6QrqCp0KIAohCusKRwrsCiEKRwrtCuwK",
    "vQrUCr4K+wlICu4KXgqfCu8KfwraCfEK2QnBCqAKhwrICjMK8grzCvQKywr2CsoKTQoVCjAKkgqkCtoKTQowCgQKxwrMCt0KUAozCsgKzQr2CssKqwr3CpQK",
    "3wpqCs8KlgrQCrAKrwpCCuIKlgqwCrIKsgqwCuUKmgq3CuYKuAr4CrkKWQq8CpsKmwq8CvkKmwr5Cn4KvAroCvkKfAqeCugK5wr6Cn0K6ArpCp0KfQr6CvsK",
    "IArrCukKDQr8CtMKnQrqCp4K/QrTCvwKfwrxCtUK2gnCCvEK/woACwEL8woDC9kKBAsFCwYLpQoHC6oK2QoDC00KpwrbCmYK2QpNCvMKCAuQCgQLBAuQCgUL",
    "xgrMCscKzAoKC90KqwqUCvcKzwrhCt8KawrhCs8KrgqtCtAKtAoLCwwLCwsNCwwL5goOCw0LDQsPC+YK5goQCxEL5goPCxEL5goRC7cK5gq3ChALtwoSCxML",
    "ugq5CrgK0grnCrkKFAsVCxYLuwp9CtIKfQr7CtIKfgr5CukK6AqeCuoK/Ar7Cv0KFwsYCxkLIQoaC+sK/QobC9MK/QocCxsLIQrsChoL0wrtCkcKHQseCx8L",
    "oAogCyELoAohC8EKAgujCiMLJAslCwULyAomCzMK8woDC/QKKAvbCikLKgspC9sKyAorCywLygr2Cs0KxgrMCi0LxgotCykLMworC8gKKAsuC9sKLgsvC9sK",
    "2wovC9wKpwrcCi8LzArdCi0LMgusCvcK4AozC94KrAo0C/cKlAo1C/cK9wo0C5QKlAo0CzULrAo2CzQL4ArfCt4KNws4CzkLOQs6CzcLOws8Cz0L4grkCuMK",
    "Pgs/C0ALOwtBCzwL5QpCC0MLtApECwsL5goRCw4LEQtFC7cKtwpFCxILtwoTCxALFAsWC0YLRgsVCxQLFQsXC0cLFQsZCxcL5wpIC/oK+wr8CkkLDQp+CvwK",
    "6Qr8Cn4K6ArqCukKFwsZCxgL+gpKC/sKSgv6CksLGQsYC0wLTQtMCxgL0wpOC+0K7QpPC+wK7QpQC08L7QpRC1ALvwq+CtQK1ApSC74KHQsfCx4LUwtUC1UL",
    "nwrVClYL8QpXC9UKwQogC6AKAQsAC/8KAQtYC1kLWQtYCwEL1wrYCvUKBAtbC1wLBgtbCwQLBAtcCwgLxgopCyoLpwovC9sK8wpNCgMLXAtbCwgLkAoIC1sL",
    "BQuQClsLKAspCy4LIwtdC8wKXgtfC2AL9wo1C2ELYgtjC2QLZQtmC2cLaAtmC2ULaAs4CzcLNwtmC2gLaQs+C2oLaQtqCz4LPgtACz8L4gpCCuQKOws9C+QK",
    "5QpDC0ILawtsC20LtAoMC0QLCwtECw0LbgtvC3ALcAtxC24LcgtxC3ALcwt0C3ILdAtxC3ILdQsTC3YLuQp3C7gKuQr4CncL+wrnCtIKFQtGCxYLRwsXC3gL",
    "GQtHCxcL5wr7CkoL6Qr5CugKGQtNCxgL+wp5C/0K/ArrCnoLegt7CxsL0wobC04LSwt8C30LTwt+C+wK7Ap+C38LSwt9C4ALTgtRC+0KUQuBC1AL1Aq+CoIL",
    "7gqDC8AKnwpWC4QLnwqEC/4KhQuGC4cLwQohCyALhwuGC4ULiguLC4wL8goDC/MK9AoDC/IKyAosC1oLWgssC6IK2wovCy4LWwsGCwULkQuSC5MLlAuVC5YL",
    "lwuYC5kLLguaCy8LmwuQCpwLlwuZC50LlwudC5gLZwqeCzALCQswC54LzApdCwoLkAqbC58LYAtfC14LlAugC5ULoQuiC6MLYgtkC2MLNgusCqQLZwulC2UL",
    "ZwumC6ULZgs6C2gLZgs3CzoL5ApBCzsLDQtECwwLEQsQC0ULEwunC3YLdAtzCxYLuAp3C3YLuAp3C/gKFQtHCxkL5wqoC0gLSguoC+cK6QrrCvwK/Ap6C3kL",
    "/Qp5CxwLegsbC3kL+gp8C0sLSwupC3wLTAtNC6oL7AqrCxoLTQusC60LGwuuC04LGwscC64LTQutC6oLSwuAC6kLrQt/C68LfguvC38LfQuwC4ALUQuxC4EL",
    "rwuyC7MLrwuzC7QLtQuAC7ALgAu1C7ELswu2C7QLggtSC9QKtwu4C7kLuQu4C7cL7gpICoMLugu7C7wLVQtUC1MLVgvVCr0L1QpXC70LAAu+C/8KJQvCCwUL",
    "JQskC8MLJAuSC8MLxQtdCyMLLwvGCy4LXQvFCykLBgtbC5sLBgubC8gLwguSCwULmQvJC8oLmAvJC5kLmAvLC8kLXQspCy0LmQvOC50LmQvKC84LmAudC84L",
    "mAvOC8sLkAqfC5wLXgvPC18L9wrRCzILMwvgCtILrArQC6QL9wphC9EL3gozC9ML4AreCtILZAtjC9QLNAs2C9ULZwtmC6YLaAs6CzgLOAs6CzkLawttC2wL",
    "5Ao9C0ELDQsPC9YLDQsOCw8LDQvWCw8LDgsRCw8LRQvXCxILEwvYCxALcAvZC3ILdQvaCxMLdQt2C9oLdgt3C7gKFwtHC9sLFwvbC3gL/Ap5C0kLSgvcC6gL",
    "+wpJC3kLTAtNCxkLegurC3sLqwvdC3sLTAuqC94LewvdCxsLTQveC6wLrAt/C60LTguuC1ELrQuvC6oLfguyC68LsguBC7MLsQvfC4EL3wvgC4ELvgpSC4IL",
    "SArhC4MLHgviCx0LSArwCuEL8AqEC+ELVgvhC4QLugvjC7sL1grmC+UL1grlCyIL1gq/C+YLiwtYC+cL5gu/C+gLjQvHC8ALKgvbCi4LkAvAC5ELKgsuCykL",
    "7QvuC+8LkguRC5MLkQuTC8cLjgvNC8QLyQvwC8oLyQvxC/ALyQvLC/ELmwucC8gLlguVC5QLmgsuC8YLygvwC84L3QoKCy0LowuiC6ELMgvRC9ALYQvyC9EL",
    "8wv0C/ULNAvVC2ELNAthCzULNgukC9UL4Qr2C/cLpQumC2ULZQtmC2gLPAtBCz0LcAtvC9kLcQtvC24LcQv4C28LEwvaC6cLcgvZC3MLEgv5C6cLcwv6CxYL",
    "dgv7C3cLFgv6C3QLqAv8C0gLqAvcC/0L+gpIC3wLSwvcC0oL6wqrC3oLGgurC+sKTAveC00LSwt8C/4LGwv/C3kLeQv/CxwLqwvsCt0L7AoADN0LfwsADOwK",
    "fAsBDH0LgAsBDKkL3QsADE8LgAsCDAEMUAsDDE8LTwsEDH4LfgsEDLILUQuuC7ELrgsFDLELUAuBCwYMsAsHDLULgQvgC7MLgwsIDMAKgwsJDAoM8QoLDFcL",
    "VwsLDL0L8QrkCwwM/woNDAALiguMC4sLEgyPCxMMJQvDC8IL7AsVDMcLxQsqCykLkQvAC5MLXgsSDM8LjwvNC9oK8AvxCxYMywsWDPELXgtfCxIMnwubC5wL",
    "lAuVC6AL8AsWDM4LzgsWDMsLngswC8wLXQstCwoLLwuaC8YL0AvRC6QLZAvUC2ML0wvSC94KGAwZDBoMpAsZDBgMpgtmC2ULbAsbDG0LbAttCxsMHAwdDNYL",
    "1gsdDB4M1gseDBwMHgzXCx8MHgwgDNcLRQsQC9cL1wshDBILbwv4C9kLEgshDPkLEwsSC9gLEgshDNgLEgunCyEM2Qv6C3MLpwv5C/sLpwv7C3YLdgsiDNoL",
    "dgt3CyIMdwv7CyMMRwskDNsLRwt4CyQM2wslDHgL3AtIC/0LSAvcC3wL3Av+C3wL3AtLC/4L3gsmDCcMGwsoDP8LGwvdCygMJwysC94LqQsBDHwL/wsoDBwL",
    "HAsoDK4LKAzdC64L3QspDK4LrAsADH8LAAwEDE8LTwspDN0LKgyqCysMTwsDDCkMrwsrDKoLfQsBDLALrwu0CysMgAuxCwUMAgwsDLALgQstDAYMsgstDIEL",
    "LAwHDLALtQsHDLELswvgC7YL3wsuDC8M3wsvDOALgwsKDAgMvAvjC7oLHQswDB4LMQwyDCELMgw0DCEL/wq+Cw0MAAsNDL4LWAuLCzUMiQvqCxEMyAs2DFsL",
    "wQs3DCYL6Qs4DCwLxQsPDDkMmwtbCzYMlguVCzoM7wvuCzsMPAyTC8ALPQwWDBcMwwuSC8ILPgw/DEAMlgs6DJULOwzuC+0L7ws7DO0LQQw/DD4MQgw6DJYL",
    "QwwWDD0MQwwXDBYMFwxDDD0M0QsxC9ALMQvRC9ALRQxGDEcM0wszC0gMSAwzC9ILpAvRC9ULYQtJDPILGQykCxgM1QtJDGELSgxJDNULSwzhCvcL2AvXCxAL",
    "IAwhDNcL+AtxC0wM2QskDPoLTQx0C/oL+wv5C04MIgx3CyMM+wtPDCMMIwxQDCIMUQwlDNsLUgwjDE8MIwxSDFAMSAtTDP0LUwz+C/0LUwxUDP4L/Qv+C1UM",
    "/gtWDFUMVgz+C1QMVQxWDP8L/wtWDFcMVwxWDKkLWAwBDKkLVwwoDP8LJwwADKwLqgsqDN4LqQsBDFcMAwyuCykMAQwCDLALAwxQCwYMgAsFDAIMKwy0C1kM",
    "BgwtDLILtAu2C1kM3wuxCwcMtgvgC1oM4AsvDFsMgwvhCwkM4gswDB0L4wtcDLsL8QoMDF0MHgteDF8MIQs0DDEMJgs3DGAMJgtgDCcLlgs6DEIMmws2DJwL",
    "ZgxHDEYMZwxoDGkM0QvyC9UL0wtqDNILbAxtDG4MbAxvDG0MHwzXCyAM1wvYCyAMTAxxC3AMIQxxDPkLcQt0C3AM+gskDHIMcgxNDPoLqAtzDPwLqAv9C3MM",
    "UAx0DPwL/At0DEgLdAxTDEgLdAx1DFMMVgxYDKkLJwx2DAAM3gsqDHcMeAxXDAEMAwwFDK4LBAx5DLILKwxZDHoMeQwGDLILewwsDAIMfAx9DH4Mfwx+DLgL",
    "fgx/DLgLuwtcDLwLWAs1DOcL6AuBDOYLEAwRDOoL6wsUDBEMEQwUDOoLEwzPCxIMjwvPC2EMiAyJDEIMiAuKDA8MyAucCzYMEgxfC88LDwyKDDkMnAuLDIwM",
    "SAyNDI4M0wtIDI4M8wv1C/QL8gtJDGsMGQwYDBoM1QtrDI8M1QuPDEoMkwxsDG4M4QpLDPYLlAyVDJYMlAyWDJUMlwyYDJkMGwyaDG0LmwycDJ0MngyfDKAM",
    "HgwdDBwMHgwfDCAMIAzYCyEMTAyhDKIMpwujDCEMTAxwDPgLpwukDKMM2gukDKcL+AtwDNkL2QulDCQMcgzZC00M2QtwDE0MdAtNDHAMJAylDNsLTQymDKcM",
    "IgxQDPwL2wulDFEMeAslDKUMUgx0DFAMUQyoDCUMdAxSDHUMVAxTDHUMJQypDKoM/wsoDFUMKAyrDFUMVAysDFYMJwwmDHYM3gt3DCYMVwyrDCgMWAx4DAEM",
    "AAx2DAQMVwx4DK0MKwyuDHcMKwx3DCoMKwx6DK4MAgytDHgMAgwFDK0MeAx7DAIMBQwGDCwMBQwDDAYMtguvDFkMtgtaDK8M3wuwDC4M3wsHDLAMsQyyDLMM",
    "Hgu0DOILHgu1DLQMXQy2DPEKVgu9C7YMHgswDF4MvQsLDLYMNAwyDDEMtwy4DLkMugy7DLwMuwy6DLwMDgzADGAM6Au/C4EMOAzADA4MQgzDDIgMhAyFDMQM",
    "xAyFDGIMYwzHDMgMvwwRDBAMyQw8DMALwAvHC8kMOAzBC8sMiQzDDEIMyAs2DMUMPQxDDMwMzQxkDM4MzgzPDM0MQQw+DEAMPwxBDEAMjgzTDNQMSgyPDEkM",
    "bAxtDG8MSwzVDNYM1wzYDNkMmwzaDJwM2QtyDKUM2gsiDKQMJAylDHIM+QtxDNsM+QvbDNwM3AxODPkL+wvdDE8MJAx4C6UMqgylDCUMJQyoDKkM/QtVDKwM",
    "VAzeDKwMqQzfDOAMVgyrDFcMdgwmDHcMdwwEDHYMdwx5DAQMWQzhDHoMWQyvDOEMBgziDCwMfQx8DH4MCQzkDAoM5QzmDOcM8Qq2DAsM6AzpDOoMuQy4DLcM",
    "vAztDO4M5gv1DOUL5Qv1DIAM8gz2DPMM5guBDPUMiQsRDIIM9wz4DPYMDgzLDPsM9wz8DPgMDgzADMsMYgyFDMQMiAv9DIoMOAzLDMAMyQz/DDwMzwsTDGEM",
    "igz9DAANOQwBDcIMYAwCDScLAw0EDdAMBQ0EDQMNxws8DMkMXwsGDc8LzwsHDV8L0AwIDQMNzQzPDGQMXwsHDQYN0gzRDAkN0QwKDQkNPQwLDUMMAw0IDQUN",
    "SAwMDY0M0QzSDAoN0gtqDA0NDw1rDBANawxJDI8Mjgz2C9MMkwwRDWwMjgzUDPYL0wz2C9QMbAwRDW0M9wv2C0sMoAyfDJ4MmwydDNoMbQsSDRsMbQuaDBIN",
    "Ew0UDZwMFQ0WDRcNIQyjDHEM+wtODN0MIgz8C90MGA2mDE0MpQyoDFEMdAzdDPwLdAz8C3MMpwymDBkNcwz9C3QM/QveDHQMUgwaDXUM/QusDN4MqQzgDKoM",
    "VAx1DN4MrAxVDKsMrAyrDFYMVgxXDFgMqQyuDN8MVwytDFgMdwyuDBsNdwwbDXoMeQx3DOEMeQziDAYMHA3iDOEM4QziDHkM4gwHDCwM4gwcDR0NBwziDLAM",
    "Hg1aDOAL4AsfDR4NLgwgDS8MIQ3hC1YLVgu2DCEN4gsiDQwM4gu0DCINsgyxDLMMJQ3pDOgMMAxfDF4MJg3vDPEM8gz3DPYMwAwODCgNKA1gDMAMvQyEDIUM",
    "Kw38DPcMhQyEDPoMLA0tDS4NKQ3KDGEMKw0vDfwM+QzGDL4M+gzEDIUMMQ0yDb8LygyHDMQLywzBCzMNNA0tDSwNBw3PCwYNNQ0MDdILDA1IDNILzwxlDGQM",
    "Nw1rDA8NOA0PDRANkgw5DZAMjgyNDGoMkwxuDBENEQ1uDDoNbgxtDDoN1QxLDNYMmQyYDJcM2AzXDNkM2gydDDsN2gw8DZwMEw2cDDwNoQxMDKIMpAxODKMM",
    "pAwiDN0MPQ3bDHEMTgzcDD4NTwwaDVIMGg1PDN0M3Qx0DBoNpQyqDKgMPw0ZDaYMqAyqDEANdAzeDEENQg3eDHUMQw2pDKgMQw2uDKkMGw3fDK4MGw2uDHoM",
    "dwx6DOEMrQwFDHsMLAx7DAUMRA17DEUNRg0cDeEMRg0dDRwNHQ2vDFoMHQ1aDB4N4AtbDB8NCQzhC0cNSA1JDbMMJA22DF0MSg3iCwwMSA1LDUkNSQ1LDbMM",
    "TA1NDU4NtQweC+wMJQ3qDOkMTg1NDUwNJg3xDO8M7gztDE8NggwRDDAN+Az8DPYMvQyFDMYMUA3HDGMMUQ1SDb8MUg0wDb8MUw3/DMkMhwzKDCoNYAwoDQIN",
    "VQ0HDQYNCw3MDIUMyQw8DP8MVg1EDJ4LBQ0IDdAMVA2KDAANnAuMDIsMZwxpDGgMDA0NDWoMDA1qDI0MVw0aDFgNaww3DY8MOA05DZIMWQ0aDFcNNw1rDI8M",
    "kQyQDDkNEQ06DW0MnQycDDsNEg1aDRsMFw1bDRUNWw0WDRUNoQxcDaIMcQyjDD0NowxODD4NpAzdDE4MTQynDBgN2wxdDdwMGg10DEENGg1CDXUMqgzgDEAN",
    "QQ3eDF4NQA1DDagMXw1gDUINYA1hDUINYQ3eDEIN4AzfDEMNQw3fDBsNQw0bDa4MWAxiDXgMWAytDGINeAxiDXsMrQx7DGIN4QyvDGMNYw2vDGQNRg1jDR0N",
    "4gwdDR4NZQ0uDLAMLwwgDVsMZg3kDAkM5QznDOYM4gtKDTAMvAzuDE8NZw1oDWkNaQ1oDWoNvAxPDe0M9wzyDCsNbA1tDcMMhQz6DHANgwzCDHENywxyDfsM",
    "xQxzDXQNVQ0GDXUNhQx2DfoMzAx2DYUMNQ3SCw0NigxxDQENVA15DYoMBw16DQYNaAx8DXsNWQ19DVgNNg1+DUcMfw2ADYENDw2CDTcNEA05DTgNfg0ODUcM",
    "Nw2CDRANgw2EDYUNhg2HDYgNnAw8DTsNnAwUDTwNFw0WDVsNiQ2KDYsNGwyMDZoMiQ2LDY0NGwxaDYwNjg2PDZANogxcDaEMkQ2SDZMNGA2nDJQNpwwZDZQN",
    "3AxdDZUNQA3gDEMN3gxhDV4NYA2WDWENlw2YDWINewxEDWIN4QxjDUYNYg2YDUUNYg1FDXsMYw2ZDR0NrwyaDWQNHg2wDOIMRQ2bDUQNmw2cDUQNHQ2dDa8M",
    "rwydDZoNHQ2eDZ0NHg2eDR0NHg0fDZ4NZQ2fDS4MWwygDR8NLgyfDSANCQxHDWYNIQ1HDeELTw2hDe0M7QyhDU8N8AyiDe8M8gz0DCsN9QyBDGsNygwpDXUN",
    "Kw2jDS8NiQykDaUNMA1SDYIM/QyDDHENLA0uDTQNVQ11DacNKA37DMsMyQz/DFMNLg0tDagN9gx4DSsNggxRDb8MUg1RDYIMhgzFDP4M/gzFDKkNygx1DSoN",
    "ywwzDSgNKA0zDQIN/Ax4DfYMwgwBDXENdA2rDcUMVQ16DQcNhQxwDawNdw1WDdAMdQ0GDXoNhQysDQsNBQ2uDQQNcQ2KDHkNNgz+DMUMdg3MDKwNrA3MDAsN",
    "Ng0ODa8NDw04DYINOA2wDbENjAyLDLINgQ20DX8Nfw20DYANhA2IDbUNhA2GDYgNPA0UDRMNtg23DbgNoQy5DVwNPQ2jDD4NGA0/DaYMlQ1dDV8NQQ1CDRoN",
    "lQ1fDUINXQ26DV8NQg1BDV4NPw27DRkNXw28DWANYA29DZYNYQ2WDb4NYg1EDb8NwA1jDWQNmA2bDUUNHQ2ZDR4NsAweDWUNHw2gDZ4NZg3jDOQMswzBDUgN",
    "swxLDcENXAzCDbwLDAzDDUoN4wvFDVwMJQ3GDeoM7wyiDScN8AwnDaINbA1vDW0NwQzHDW4Nbg3HDcEMMwwxDb8LLw2jDXgNbA3DDG8NKw14DaMN/QzIDVQN",
    "cQ3IDf0McQ3JDcgNUw3/DMoN+gx2DXANUw10DcsNUw3LDf8M+wxyDcsMiQylDaQNMQ2xDTINcw2rDXQNzw0tDTQN0A3RDVANUA3RDdIN/gyBDNMN/gzTDcUM",
    "1A3VDdYN0Ax3Da4NNg2vDa0N2A3ZDdoNCQ3bDdIMVg13DdAM1A3cDdUNiwyMDN0N3g2vDQ4NVw3fDVkNiwzgDbINDg1+DeENDg3hDd4N4g3jDeQN2gw7DTwN",
    "iQ2LDYoNiQ3lDYsNkg3mDZMNkg2RDecNkg3nDegNPQ3pDdsM2wzpDV0N6g3rDewN3AyVDT4NlA0ZDeoN6g0ZDesNug3tDV8Nlg28DUIN7Q3uDV8NXg1hDZYN",
    "vg2WDWENvQ3vDfANwA3xDWMNRA3yDb8NYw3xDZkNZA2aDfMN8g1EDZwNoA1lDR4Ntgz0DSENIg0jDQwMJA30DbYMtAy1DCINwg3jC7wLSg3DDTAMSA31DUsN",
    "Tg32DUwN6gzGDegMTA32DU4NaQ1oDWcNag1oDWkNoQ1PDfcNTw34DfcNoQ34DU8NbQ1vDfoN1g39DdQNdA3+Df8NKQ0qDXUNAg4xDckN/gypDYEM/wzLDcoN",
    "Aw5yDfsMdA2rDcsNcQ15DckNAg6xDTENxQwEDqkNrQ3NDTYNCQ0KDdsN0Q3QDdINrg0IDgkO2Q3YDQoO1g3VDf0NBw7SDdEN2w0KDdIMZwwFDnwNfQ0NDlgN",
    "DA4LDg4OsQ2CDTgNsA0QDrENiwzdDeAN5A3jDeINEA2CDTkNNw0SDoINNw0TDhIOhQ0UDoMNgw0UDoQNhQ2EDbUNiA0VDoYNhg0VDocNhw0VDogNmgxaDRIN",
    "iQ2NDeUNiw0WDo0Njg2QDY8Ntw0XDrgNkw3mDZENXA25DaEMkQ3mDecNkg3oDRgOuQ0ZDhoOGQ7sDRoOPQ0+DekNPg2VDekNlA0bDhgNlA3qDRsOGA0cDj8N",
    "GA0bDhwOXQ3pDboNGQ0dDusNXg2WDUINPw0cDrsNHA4eDrsNuw0fDh0OvA0gDmAN7g0hDl8NYA0gDr0NHg4fDrsNvQ0gDu8Nlw1iDSIOZA0jDsANlw0iDpgN",
    "Ig4kDpgNZA3zDSMOJQ4mDpsNmg2dDfMNng0nDp0NnQ0nDigOmw0mDpwNZQ0pDp8NnA0mDioOZQ2gDSkOnA0qDisOoA0sDp4NLQ4sDqANnw0uDiANoA1bDC0O",
    "WwwvDi0OWwwwDi8OWwwgDTEOJA0jDTIOMw4jDSINIg21DMQNwQ00DkgNSA00DvUNww3rDDAM9w35DaENJw01DqINUw3KDTYONw44DqMNpA05DqUNaw2pDToO",
    "Uw3+DXQNpw07DlUNow04Dj0OyA3MDVQNyA3JDT4Oaw2BDKkN+wxyDTwOUA0/DtANyQ0xDT4OVQ07DnoNdQ16DUAOAw5BDnIN2w0KDT0OUA3SDT8OdA3/DasN",
    "sQ0CDkIOjAzXDUMO1A39DdwNQw7dDYwM3g3hDa8NsQ1FDoINEQ5GDn4Ngg0SDrMNsw0TDjcNOQ2CDRAOEw5HDhIOSA5JDkoOhA0UDrUNhA21DYYNhg21DYgN",
    "Ow1LDkwOWg2aDE0OmgyMDU0OTg5PDlAOUQ5NDowNuA0XDrYNtg0XDrcN5g2SDecNkg0YDucNlQ1SDukNlQ1CDVIO6w0dDhsOGQ27DR0OXw1TDrwNHQ5UDlUO",
    "lg0gDrwNHQ4fDlQOHg5WDh8OvQ0gDpYNVw5WDh4OWA5WDlcOIw7zDVkOmA0lDpsNmA0kDiUOnA1aDvINnA0rDloOmQ1bDh4NKw6fDSkOHg1cDqANKg5dDisO",
    "XQ4uDp8NoA0tDl4OLQ4vDl4OIQ30DV8OMw4iDcQNwg3FDeMLXAzFDcINog01DicNow1jDjcOAw5kDmUOpA1mDjkOUw02Dv4Npg1nDvsNpw11DUAOAw5BDmQO",
    "xw1uDWgOAw48DkEOyw1qDsoNCQ4IDq4NCg3bDT0OrA1wDXYNBg4PDmwOsQ1CDjENMQ1CDrENrQ2vDaYNbg5vDnAOeg07DgoODQ1zDs4Nqg1yDswNdA4RDjYN",
    "Bw7RDdINsQ0QDjIN2Q0KDnUO2Q11DtoN0w3dDXYORQ4QDoINsg3gDd0NWA0NDt8NtA2BDXkOsw0SDhMOSg5JDkgOtQ0UDoUNeg57DnwOfQ57DnoOiw3lDRYO",
    "Wg1+DowNjA1/DlEO6A2ADhgOGg6BDrkN6A3nDYIO6A2CDoAO7A2DDuoNhA6FDukN6Q2FDroNUg5CDYYOug2FDu0NQg28DYYOHA6HDh4OhQ6IDu0NXw0hDlMO",
    "hw6JDh4OHg6JDh8OHw5WDh4O7Q2KDu4NHw6LDlQOig6MDu4NIA6NDu8NVA6LDo4O7w2NDvANwA0jDvENWA6PDlYOYg2/DSIO8Q2QDpkNvw2RDiIOvw3yDZEO",
    "8w2SDlkOJA6TDiUOJQ6TDiYOHg1bDlwOoA1cDikOnQ0oDpQOXA6gDV4OXA4tDqANKg4mDpUOKw5dDp8Nlg5eDi0OKg6VDl0OlQ4uDl0OLQ5eDi8OLw6XDi0O",
    "LQ6XDiwOLg6YDiANMQ4wDlsMZg1HDZkOIw2bDpoOmw4jDTMOSw31DZwOxQ2dDsIN6AzGDSUNng6fDqAOoQ5gDmIO+w2iDvwNNw5jDjgObg3HDaMOpA6lDvgN",
    "Mww+DjENpA2mDmYOyA0+DswNNg5qDv4NqA07DqcNOQ6mDqUNPw6nDtANqA4IDgkO/g1qDqsNCg5ADnoNQQ6qDnINrg1xDgAOqw6sDskNbQ50DjYN0A2pDtIN",
    "yQ2sDgIOAg5FDkIOsQ1CDkUO3Q1DDgQOCw6tDg4O1Q13Dv0N/Q13DtwNWQ3fDQ0OAg6sDq4OAg6uDkUO3Q1DDq8O3Q2vDtcN1w2vDrAOgA20DXkOsQ6yDrMO",
    "TA5LDjsNtA5PDk4OtQ5QDk8O5Q2NDbUOjA1+Dn8OFw62DrcOuA65DroOuQ2BDhkOGg67DoEOGg7sDbsOvA6ADoIOgA68Dr0OvA6EDr0O7A3rDYMOvg6EDrwO",
    "Ug6EDukNGw6DDusNUg6/DoQO6g2DDhsOhA6+DoUOhQ6+DsAOHQ4cDhsOHQ6HDhwOHg5WDlcO7Q2IDooO7g2MDiEOIA7BDo0OvQ3BDiAO8A3BDr0Niw7CDo4O",
    "Iw5ZDvEN8Q1ZDpAOww6PDlgOig7EDsUOig7FDowOwQ4kDsYOIg7GDiQOJA7BDscOkA4nDpkNkw4kDscOJw5bDpkNng1bDicOnQ2UDvMNkw7IDiYOWw6WDlwO",
    "XA5eDikOng0sDlsOXA6WDi0OyQ6VDiYOlQ7KDi4OMA7LDi8OIA3MDjEOmQ4hDc0OIQ2ZDkcNzg6bDjMOXw4kDTIOSw2cDsENJQ3GDc8Ozw7GDSUNYQ5gDtAO",
    "0Q41DqINpA74DfkN0g4+DjMM0w6iDTUO+g1vDW0N1g77DWcOaA5uDaMO1w7UDjoObQ78DWcO2A49DjgOYw6jDT0Oow7ZDtoOqA4JDgEOqw7MDT4OOg6pDdcO",
    "PQ7YDjgO/g2rDf8NNQ3ODQUO3A7MDXIOdA6vDUYOEA5FDt0O3g6wDq8O4A5lDHgO3w5HDhMOtQ5PDrQOsg57Dn0OtA5ODrUOtQ7iDlAOUQ7jDk0O4g5ODlAO",
    "5A63DuUOtQ6NDeIOTQ5+DloNfw5+DuYOfw7nDlEOuQ5RDucO6A65DrgO6Q62DhcO6g63DrYOGQ7rDuwN6w6DDuwNvw5SDuwOUg6GDuwO7A6GDlMOHQ5VDocO",
    "wA6IDoUOhg68DVMOhw5VDu0OiQ7uDh8O7w4hDowOiA7vDooOjw7DDlgOiw7wDsIOjw7DDvAOww7xDvAO8g6QDlkO8w7wDvEO9A71DikOJw7yDigO9g4rDvUO",
    "9Q4rDikOkg7zDZQOKw73DloO9g73DisOkw74DvkOyA6TDvkOlg5bDiwO+g6WDiwOyQ77DpUO+w7KDpUO/A6XDi8OLg7KDv0OLg79DpgOMA4xDv4OzQ4hDf8O",
    "wg0AD8UNoA4BD54OZg6mDjkOAw8EDwUPog3TDgYPZA5BDmUOYw49DjgOBw8ID6QO0g6rDj4OQA47DqgN1w4JD9QOCg9tDmcOZw6mDdYOQQ48DqoOqA4LDwgO",
    "aQ7MDdwOaQ7cDqsO1w4EDgkPQA4KDjsO3A5yDggObg5wDm8Oqw4OD6wOBA5DDt0NdA5GDg8P3Q5FDq4O3Q7gDhAO3w6uDqwOsA7eDhEPEg8TDxQPEA7gDngO",
    "Ew8VDxQPfQ56DrIOfA4WD3oOtQ5ODuIO5Q4WDuQOfA4XDxYPew4XD3wOFg7lDuQOFg8XD34O4g6NDRgPFg4YD40NFw/mDn4OGQ/lDrcO6A64DroOFw8aD+YO",
    "5w4bD7kOHA+2Dh0PHA/qDrYOHg8fD7oOHA+BDiAPIA8hDxwPHg8iDx8PGA4jD+cNGA6ADiMPHg8kDyIP5w0jD4IOgg4lD7wOIw8lD4IO7A2DDrsOwA4mDycP",
    "wA4nD4gOUw4hDu8OVQ5UDu4O7Q5VDu4OVA4oD+4OHw7uDosOVA6ODigPKA+ODikPVg6PDlcOiw7uDioPKQ+ODioPjw5YDlcOjQ6MDisPjQ4rD4wOKw+MDsUO",
    "jQ7BDvANIg4sD8YOIg6RDiwP8A7zDsIO9A5bDi0PKQ4uD/QO9A4uD1sOkg6UDi8PMA9aDvcOMQ/5DvgOJg7IDskOKQ5eDjIPlg76Dl4O+Q4zDzQP+Q41DzMP",
    "LA6XDvoO+w42D8oONg/9DsoO/A43D5cOmA44DyANIA04D8wOxg05D88OOg87DzwPng4BD58OYQ6hDmIO9w0+D/kN+A2lDggP+w0/D6IOoQ7QDmAOog5AD/wN",
    "+w3WDj8Pxw1oDqMO/A1AD2cO0Q7TDjUOpA75DQcPBQ8ED0IP1A4JD0MPqg48DkQPpg1GD9YObA5JD9sOcw5HDwUOdA5KD6YNpg1KD0YP2g11DgoOdA4PDxEO",
    "1w2wDksPEQ4PD0YOrA5ND98O1w2vDkMOrg5PD90OEg8UDxMPEg5QD08Prg4SDk8Psw6yDrEOsg56DnsO5Q21DlEP5Q1RDxYOtQ7iDlEP4w5/Dk0Ofw7jDlIP",
    "UQ5SD+MOtw7kDhkPUQ65DlIPtw7pDhcOfw5SD+cO5Q5TD+QO6g7pDrcO5Q4ZD1MPHg9UDyQPvA4lD1UPvA5VD74Ogw5WD7sOgw5XD1YPVw9YD1YPhw7tDlkP",
    "WQ8oD1gPWQ/tDigPhw5aD4kO7Q7uDigPiA4nD1sPiQ5aD+4OiA5bD+8OjA5cD+8Oiw4qD/AOig7vDsQO7w4rD8QOww6PDvEOkA7yDicOjw6SDvEOkQ5dDywP",
    "8g1eD5EOkQ5eD10P8g1aDl4Pkw5fD2APxw5fD5MOMQ9fD8UOkw5gD/gO+A5fDzEP+A5gD18P9w72DjAPLg8pDjIP+Q4xD2EP+Q40D8gOYg9jD14OlA5kD2UP",
    "Xg78DmIPXg76DvwOlw5mD/oOZw/9DmgPLw7LDvwOlw43D2YPNw9pD2YPag9rD2wPNA7BDZwONA5tD/UN9Q1tD5wObQ9uD5wOOw9vDzwPxg1wDzkPcQ9yD3MP",
    "oA6fDnQPdQ92D3cPeA95D3oPdg/RDnsPYQ7QDnwPYQ4GD6EO+A0ID30Pog4/D0APfw8EDwMPAw8FD4AP0Q49D9MOPg8HD/kNBg/TDqEOZw5ADwoP2A6BD4IP",
    "1g6DDz8P0g6GD6sOhw+ID4kPqw6GD2kORg+KD9YOBQ5ID4sPRw+ODxAPRw8QD2sOBA6QDwkP3A4OD6sODg+SD6wOkw+UD5UP3w5NDw4Pkg9ND6wOkw+XD5QP",
    "1w1LD68OEQ/eDrAOTA9OD5gPTw/gDt0ORg4PD5kPEg+aD5sPmw8UDxIPTg+cD5gPEw8UDxUPng+fD6APoQ+iD6MPpA9RD+IO4g6lD6QPfg5/DhYPFg9/DqYP",
    "TQ5/Dn4O4g4YD6UPpw9/DuYOFg5RDxgPHQ+2DqgPGQ+pD1MPGA+qD6sPgQ4cDyEPrA+tD6kPgQ7rDhkOgQ67DusOIw+ADr0O6w67DoMOhA6/Dq4PVw9ZD1gP",
    "7A5TDr8OUw6vD78Ohw5ZD1oPUw7vDq8PWA8oD7APJw+xD1sPWg+yD+4OjA7vDlwP7g6yDyoPjA4rD+8OKg+zDykPKg+0D/AOjg6zDyoPxA4rD7UPKw/FDrYP",
    "jg7CDrMPLA+3D8EOxg4sD8EOtg/FDscOtw8sD10Pxw7FDl8PMA9eD1oO8Q64D/MOxQ61DzEPKA7yDpQOlA5lD7kPNA/JDsgOyQ40D/sONg+6D/0OZA9mD2UP",
    "NQ+7DzMP/A7LDroP/A76DjcPug+YDv0O/Q5nD2gPZw+8D2oPMA7+DssOzA69DzEOMQ69D/4O/g69D74PZg2ZDr8POg/ADzsPOg88D8APxQ3BD50Oxg3PDsIP",
    "xg3CD3APww9yD3EPcw/ED3EPoA50DwEPdw92D3sPcw9yD8QPYQ58D3kPdQ9/DwMPdQ8DD4APxQ/GD8cPyA/JD8oPyw/MD80P0Q7ODz0PzA+HD80PQg8EDwUP",
    "MwyGD9IOzA/PD0QPgQ/QD4IP0Q+HD4kPow6ND9IPhA9pDoYPQw/UD9UPPA7WD0QPow7aDo0PRQ/TD9cPiw/ZDwUOPA6qDtoPPA7aD9YPSA98DdkPlQ/bD5cP",
    "3A6PD9wPDg9ND5IPDw9KD90PDg/eD98O3g9QD98OEg8UD5sP4A/hD+IPSw+vDuMPmQ8PD+QPTA9OD0QORg6ZDw8P5Q/mD+cP6A/pD+YPoQ+jD+oP6w/pD+gP",
    "7A/tD+4PFg+mD3oOpA+lD+8Pew56DqYPew6mDxcPfw6nD6YPUQ+qDxgP5A5TD/APuQ7xD1IP6Q6oD7YOGw/xD7kOHQ+oDxwPHA+oD+oOug5UDx4PHw9UD7oO",
    "8g8YD/MPqw/zDxgPgQ4hDyAPrA/0D60PvQ6EDq4PVQ/1D74Ovg71D8AOgw67DvYPuw5WD/YPgw73D1cP9g/3D4MO+A/5D/UPrg/ADvUPrg+/DsAO+Q8mD/UP",
    "Jg/ADr8OVw/3D1kPWQ/6D1oP+Q8nDyYPWw+vD+8OKA8pD7APsg+0DyoPjw7wDvsP8A60D/sPtw/HDsEOwg78D7MPkg79D1kOkg4vD/0Pjw7+D5IOkg7+D/EO",
    "xA61D8UO9Q70Dv8P9Q7/D/YO8g5ZDgAQ8w64DwEQ/w8uDzIPLw+UDgIQlA65DwIQXg4DEDIP+Q4EEDUPYw8DEF4OYg82D2MP/A4FEGIP/A66DwUQuw8GEDMP",
    "Zw9oD7wP+g4HEDcPZw8IEGgPmA66DzgPaQ8JEGYPuw8KEGoPZw9qDwgQNw8HEAsQNw8LEGkPbA/MDjgPyw7+DgwQzA5sD70PvQ8NEL4Pmw4OEJoODxAQEBEQ",
    "DxASEBAQwg2dDgAPbQ80DhMQnQ4UEBIQEhAUEBAQnA5uDxUQzw45D8IPFhDADzwPwQ8XEJ0OFxAUEJ0OPA9vDxYQww9xDxgQeA96D3kPGBB3D8MPwg85D3AP",
    "bg8ZEDsPOw8ZEG8PGhB9DxsQfw91D3cPdw97D8MPHBBhDnkPbw8ZEHQPdA8ZEAEPGhA+D30PHRAeEB8QHxAeECAQHxAgECEQIhAjEH8Pww97D9EOww/RDnIP",
    "eQ98D3oPIRAkEMoP0Q49D3IPPQ8lEHIPxA8lEAYPYQ4cEAYPBg8cEMQPIxAoEH8Pnw4BDz4Pyg8kECkQJRA9DwYPfQ8rECwQIBAeEC0QLxAmEDAQAg9DDzEQ",
    "fw+ADwUPfw8FDwQPfQ8IDzIQNBDRD4kPdg81EM4Pzg/TDj0PoQ42ENAOCA8HDzIQyQ/SDy4QLhDSD0EPzA9EDycQoQ7TDjYQzA85EIcPgQ/YDtAP0g+ND9kO",
    "Qw8JD9QPPBCqDkQPPRBED9YP2A6CD9APMBA+ED8QAA4ND4UPCQ+QD0AQ2A9CEEoPDg/cDkMQqg5EENoP3A7cD0MQSg9CEN0PSg9GEEYPSg9FEEYQRxBIEEkQ",
    "RRBLEEYQcw4QD0wQlw/bD5QPEg+bD5oPDw/kD0UQTRBOEE8QThBQEE8QTxBQEK8OURBSEFMQDw+ZD+QPUBDjD68Ong+gD58P5w/mD1UQ5Q/oD+YPVhBXEFgQ",
    "7A9ZEO0PWBBXEFYQ7A/uD1kQWhBbEFwQXBBbEF0QpA/vD14QXxBgEGEQpA9eEFEPpQ8YD2IQUg9jEOcO5A7wDxkP6A66DrkO6Q7qDqgP8A9TD6kP5w5kEBsP",
    "rQ+qD6kPGw9kEPEPZBBlEPEPqg+tD6sPFw9mEBoPHw8iD1QPGg9mEGcQaBBpEGQQVA8iDyQPZBBpEGoQIw+9DmsQahD5D/gP9g9WD2wQJg9tEPUPbRAmD78O",
    "vw6vD20QbRCvD24Qrw9vEG4Qrw9bD28Q+w+0D3AQxw63D18PLQ9xEPQOLQ8uD3EQjw77D/4Pxw5fD7YPtw9dD3IQLQ9bDi4PWQ79D3MQ/g/7D3QQ/A/CDvMO",
    "dRB2EPQOXw+3D2AP9A52EP8PLg//D3EQcxAAEFkO9g7/DzIPABC5D/IOAhC5DwAQ8g65D5QOYQ93EPkOlA54EGQPuQ94EJQOdxAEEPkOYw95EAMQBBB6EDUP",
    "Yw82D3sQNg/7DnsQ+w40D3wQ+w58EHsQehB9EDUPNA8zDwYQNg9iD7oPZg9+EPoOug9iD38QfxAFELoPZg9kD2UPZQ9kD4AQNQ99ELsPaA8GELwPfRAKELsP",
    "ag8KELsPgRBsDzgPCBBsD4EQag9sDwgQaw+CEGwPDBD+DoMQ/g6+D4MQDRCEEL4PhRAPEBEQhhDAD4cQnA4VEDQOxQ0AD8EPOw/ADxUQbg87DxUQwg+IEHAP",
    "iRCKEBcQFxCLEBQQGxCMEBoQcA+KEMIPbg+NEBkQdA+fDhoQHRCOEI8QcA96D4oQPg8aEJ8OihCLEBcQfQ+QEBsQHRCPEB4QgA97D3YPeg98D4oQdg97DzUQ",
    "IBAkECEQKhAoECMQfA/QDooQGRCTEAEPkxA+DwEPfQ8yECsQMwyREIYPlxAKD5gQlxDVDgoPPg+TEAcP1Q6XENUPyQ/ID5oQ0g/JD5oQhg+REIQPQw/VDzEQ",
    "iQ+bEDQQ0w6cEDYQqA6dEAsP1A8JD0AQDA/VD58QCw+gEI8PCw+dEKAQ2A/dD0IQqg49EEQQ1g/aDz0Qcw5MEEcPQxDeDw4P4A/iD6MQpRB5DqYQmA9OD0wP",
    "oQ/qD6IP6g+jD6IPXxCoEGAQqRBfEGEQYBCqEGEQYRCqEKsQqxCqEKwQXhBiEFEPUQ9iEKoP8g9iEBgPpg+nD60Q8Q9jEFIP6g6uEKgP8A+pD68Qpg+tEBcP",
    "5w5jEGQQ8A+pDxkP5g4aD6cPqA+uEOoOqg+vEKkPZBCwEGUQGg9nEGgQVA+xELAQrQ+yEKsP9A+zEK0PahCwEGQQ9A+0ELUQtBC2ELUQ+A8lD7cQVQ8lD7cQ",
    "axC9Dq4PuBC1ELYQ+A+3ECUPuRD2D7gQuBD2D7UQuhD1D1UPtRD2D7sQrg/1D7wQWA/3D2wQVg9YD2wQWA+wD1kPWA9ZD/cPWQ8pD/oPWQ+wDykPWw+9EG8Q",
    "+g8pD1oPWw+xD70QKQ+yD1oPvhC9ELEPsQ+/EL4QXA++EMAQXA/AEMEQwBC+EMIQvxArD8IQ+w9wEMMQtg/CECsPwBDCELYPtg/EEMAQvxC1DysPvxDFELUP",
    "dBD7D8YQXQ9eD3IQMA91EF4P8w7HEPwPXw/IELYP/g/JEPEOtQ/FEDEPXw9gD8gQ/w92EHEQLw8CEP0P8Q7JELgPYA/KEMgQABDLEMwQdhAwD/YOuA/JEAEQ",
    "MQ/FEGEP9g4yD3YQdhAyD80QAhAAEM4QYQ/FEM8QMg8DEM0Q0BDREMkQ0RDSEMkQyRDSEAEQYQ/PEHcQuQ/TEHgQeRB+EMwQzBB4ENMQzBB+EHgQZQ/UELkP",
    "dxDPEHoQBRB5EGIP+g5+EAUQeBDVEGQPZQ+AENQQ0RDWENIQzxDXEHoQ1hDYENIQNA8GEHwQBRDZEPoOZA/VEIAQaA98EAYQaA9/EHwQug/ZEH8Q2RAHEPoO",
    "Zg/aEH4Q1xB9EHoQaA/bEH8Qug9/ENsQZg8JENoQaA8IENsQBhC7DwoQug+BEDgP2xCBELoPfRDXENwQfRDcEAoQag+8D2sP3RAKENwQ3RBrDwoQghC9D2wP",
    "aQ/eENgQCxCDEGkPaQ+DEN4QgxC+D94QDRDdEIQQ3RDfEIQQhBDeEL4PhBDgEN4QhBDfEOAQmQ7NDr8PERAPEIUQEBAPEBEQ4hBtDxMQwA+GEBUQNA4VEOMQ",
    "AA/kEMEPwQ/kEBcQbQ/lEG4P5hDnEIkQiBDnEOYQiRDnEIoQbg/lEI0Qbw90D+gQ6RDED+oQ5xCIEIoQwg+KEIgQdA8aEOgQGhCMEOsQjhDsEBsQiBDtEHAP",
    "HRDsEI4Qdw/uEH8Pdw/vEO4Qdw8YEO8QcQ/EDxgQeQ/qEBwQGBByD/IQcg8YEMQPcA/tEHoPjhAbEI8QIhB/D/MQ7xCAD+4Qew+AD+8Q7xDyEHsPxA8cEOoQ",
    "7hCAD38Pcg8lEPIQjRD0EBkQfQ8sEJAQew/ODzUQ8hDOD3sPLBArEPkQ9hCVEPwQlRA4EPwQ9BCTEBkQHhD9EC0Qyw/NDzkQKBD/EAARNhCKENAOixCKEDYQ",
    "MRDVD5cQmhADEdIPPBBEDz0QoBCoDoQPkRCgEIQP1A8JEdUPChGKDzsQhw8LEYgPDhEPEYwPgw+KD6EQPBAQEaoOCRGfENUPEhE/ED4QExGeEIwPoBDcD48P",
    "DRHZD4sPFBHZDw0RFRFIEEcQRw9MEBERFxHdD58QoRBGEN0PRg9GEKEQRBA9ENoP3Q9GEEoQoxDhD+APphB5DqUQphB5DhgR3w9OEE0QGRFFEOQP4Q+jEOIP",
    "GxFPD1APUBBPEKQQpBBLD+MPUhBREFMQnA9ODxoRnQ+nEFQQVRDmD+cP5w/mD+UP6A/lD+YP6Q/oD+YP6Q/rD+gPWRDuD+0PqRCoEF8QHBFeEO8PYRCrEB0R",
    "HBHvD6UPHBFiEF4QYhDyD6oPrxCqD/IPrRCnDx4Rpw8aDx8RrhAgEagP8A8hEakPGg9oEB8RqA8gEa4QIRGsD6kPrhAgESIRsRBlELAQsRBUDyMRtBD0D6wP",
    "sxCyEK0PaBBnEGkQVA+wECMRJBElDyMPaxAkESMPJRHzD6sPJQ8kEbcQahD4D7cQJhFqEGkQuxD0D7UQuhBVD7cQtxD4D7oQJhH5D2oQ+A/1D7oQbBC7EPYP",
    "9g+5EPcPuRAnEfcPKBH1DykRKRH1D20QKhFsEPcPbRBuECsRJxEqEfcPLBEqEScRLRFvEL0Q+g8uEScRLhEsEScRLxEnD/kPLxGxDycPvhBcD8EQtA+yD7MP",
    "KQ+zD7IPwhC+EL8QcBC0D/wPtA+zD/wPwxDGEPsPtw8wETERcRB1EPQOMhH+D8YQ/Q8zEXMQMxH9DzIRMhH9D/4PdBDGEP4PMRFgD7cP/g/9D8kQyBDKEDER",
    "MRHKEGAPXg80EXIQMA92EHUQABBzEMsQNRFyEDQR8w4BEMcQNhHQEMkQNxEAEMwQzhAAEDcR0BACEM4QexB5EGMP0xC5D9QQxxABENIQzBADEHkQdxB6EAQQ",
    "eRAFEH4QfBB/EHsQexB/EHkQOBE5EToRfhDVEHgQYg95EH8Q2RAFEH8Q2hDVEH4Q1hCAENgQ2BCAEDsR0hDYEDwRBhAKELwPug/LDgwQPREIEIEQCRBpDzsR",
    "2BA7EWkPCxAHED4RChBrD7wPPhEMEAsQPxGCEGsPPhELEAwQghA/Eb0PPhGDEAsQPBHYEN4Qaw/dED8RDRA/Ed0QvQ8/EQ0QQBHfEN0QQRFCEUMRQhFEEUUR",
    "mg4OEEYRDxBHERIQ4xATEDQOSBESEEcRRxEPEBAQAA+dDkgRSBGdDhIQ4xAVEEkRhxDADxYQFhBvD+gQiRAXEOQQ6BAaEEoReg/qEHkPSxHqEHoPTBEUEIsQ",
    "ShEaEOsQTRGMEBsQTREbEOwQThHuEO8QThHvEBgQ7BAdEPEQ8RAdEB8QTxEYEPIQ7RBQEXoP8BAfECEQ8xBREe4QURHvEO4QTxHyEFIRVBHvEFER8hDvEFQR",
    "IBAtECQQVRHKD8kPxQ9WEcYPVxEqECMQABF/DygQ8hBUEVgRWBFZEfIQyQ/+EFUR9xBcEfUQfg/4EDMQWBFREV0RWBFUEVERzg/yEFkRXhEkEC0QlxCYEGAR",
    "yw85ECcQORDNDwYRKhD/ECgQJhACETAQBxE3EJUQmhBlEQMRQQ8DEVsRqA6REGYRZxHUD0AQMxBoEWIRaRHTDs4PMhAHD5MQZhGdEKgOZxEJEdQPPBA9EGoR",
    "0A9rESoQbBGND2URZRGNDwMRlhBtEZkQZhGFD50QbhEQETwQhw8GEQsRCxEGEW8RmxBwEWsRjQ+ODwMRAxGOD3ERQRBzEXQRDBGID3URjg8REXERhQ8ND50Q",
    "OxA6EHcRoBB4EdwPQRCRD3MRSA/ZD3kRDxETEYwPExGiEJ4QcxGRD5YPCRF7EZ8QFRFJEEgQfBEQD44Plw/bD30REA98EUwQRhBLEH4RfxHeDnsRRhAZEUoQ",
    "gBFNEE8QfxGBEd4OexHeDoIRGBF5DqYQoxDhD4MRTRBOEN8PghHeDoERTw8bEeAOTxBQEE4QGhGFEZwPmA+cDxoRhRGGEZwPpBDjD1AQXBBdEFoQWhBdEIcR",
    "hxFbEFoQXRBbEIcRHBGlD2IQrBCIER4RrxDyD4kRiBGtEB4RihEhEfAPiRHyD/MPFw+tEGYQZBAfEWgQIhGsDyERIhG0EKwPsxD0D7sQahCLEbAQshAlEasP",
    "ahC3EIsRaxCuD4wRJhGNEfkP9Q8oEbwQjhEpEY0RjREpEfkPKRFtECsRKREvEfkPbxAtEY8RJxGQEfoP+g+QES4RLBEuEfwPxBC2D5ERtg8xEZERMBG3D5IR",
    "tw9yEJIRXg91EJMRMxGUEcsQMxHLEHMQMRG2D8gQcRB2EJURAhA2Ef0PxRCWEc8QzBDTEDcRlhHXEM8QlxEHENkQ2RC6D5cRug8MEJcR2hAJEDsRCBA9EdsQ",
    "mBE+EQcQPhGZEYMQgxCaEQwQgxCZEZoRQRFDEUIR4hATEOMQSREVEIYQEBAUEEcRRxEUEJsRnBFtD+IQGBBPEU4RiBCdEe0Q7hBOEfMQ6RCeEcQPSxF6D1AR",
    "kBBNERsQGxBNEY8QxA9SESUQxA+eEVIR8xB/D58RnxFREfMQjxCgER4Q9hD8EKERHhCgEf0QNBCiEaMRfw8AEZ8RKxClEfkQJBBeEV8RMxD4EKYRyA9hEWUR",
    "zQ80EJsQyA9lEZoQlRAOEWQRPBBqEakRmxAGEc0P0A8qEGsRWRGqEc4PmhBbEQMRBBGrEQERMhCTEGMRqA6gEJEQrBFqET0QaRGcENMOPxASETAQCRFnEa4R",
    "mxAMEXARDQ92EZ0QCRGuEa8RrxF7EQkRjQ+wEY4P3Q8XEQUR3Q8FEaEQFBEREUwQFBFxERERChF3EToQFhETEZ4QFBFMEHkR2w+iELERohAWEbERGhGcD4YR",
    "4A4bEeEOhxGyEbMRhxG0EbURHBG1EbQRtBG2ERwRqRBhEKgQHBG3EbURYRBgEKgQHBG2EbcRHBG3EbYRYRCqEGAQHBG4EbcRYRAdEaoQqxC5ER0RHBG6EWIQ",
    "YhC6ERwRHBG6EbgRrBAeEbsRvBEeEacPYxDxD70R8A++EYoR8A+vEL4RrxCJEb8RYxAfEWQQiBHAEa0Q8Q9lEMERIBGuEMIRrRDAEWYQZRDDEcERIBHCESIR",
    "ZRCxEMMRsRAjEbAQxBHFEcYRuxC0ELMQaRBnEMcRyBHEEcYRthC0EMkRthDJEbgQvBCMEa4PKBErEbwQKBEpESsRbhBvEI8RLBHKESoRyxGxDy8RyxEtEb0Q",
    "vRC+EMsRyxHMEbEPvhDMEcsRvhDNEcwRwRDNEb4QLhHDEPwPzBG/ELEPcBD8D8MQxhDOETIRMhHPETMRMhHQEf0PdRDREZMRdRDSEdER/Q/QEckQkxE0EV4P",
    "0BE2EckQchA1EZIRlRHSEXEQzRDTEXYQdhDTEZURxRDUEZYRzhA3EXMQNhECENAQ0BA2EdEQlRHNENUR1hHNEJURzBDNEAMQ1RHNENcRxxDSENgRNxHTENkR",
    "eBDZEdMQOBE6EdcReBDVENkReBDaEdUQeBDTENoR0hDbEdgRPBHbEdIQOxGAENsR2xA9EdwRgRDbENwRDBCYEZcRlxGYEQcQDBDdEZgRmBGZET4R3RDcEEAR",
    "DBCaEd0RmRHeEZoRPBHeEN8RQBHgEd8Q4BDhEd4Q3xDiEeAQ4hDjEJwRDxDkEUcRhhCHEEkRnBHlEG0P5hCJEOURhxAWEOYRFhDnEeYRFhDoEOcR5hDlEYgQ",
    "6BFMEecQFBBMEZsR6hDpEekQ6hBLEekR6hH0EI0QShHrEOsR6xDsEesR6xCMEOwRTBGLEO0RTRGQEOwRIxAiEAARIxAAEVcRnxEAESIQ+hBWEasRPBCpEe8R",
    "ixCcEO0RURHwEV0RixA2EJwQ+RClESsQlBDxEWERqRFvEfIRVxH/ECoQXxH0EZQQ8hFvEQYRAxFlEZoQmhBlEVsRMxD3EWgRAxGwEWURchEwEBIRbhH7ERAR",
    "dBFzEf0ROxB3EQoRlw99Ef4RrxH/EXsRjg9xEXwRSA95EXIRDQ8BEnYRcREUEXwR/xF/EXsReBECEtwP3A8CEkMQAxIEEgUSoxCDEXgRCBJ9EdsPlw8IEtsP",
    "oxB4EeEPeBEJEuEPRhB+ERkR4Q8JEoMRTRALEk4QGhGGEQwSThALEk8QhxGzEbQRDRKzEbIRHRGIEaoQqxC7EbkRqhCIEawQqxCsELsRpw8fEbwRuhG/EYkR",
    "rxAOEr4RwRG9EfEPDxIhERASERLCEa4QrhAiERESDxKyECERshCzECERsRASEhMSsRATEsMRsBCLEbEQxBEUEsURZxBmEMcRxREVEsYRyBHGERUStxASEhYS",
    "JBESErcQtxAWEosRxxEXEmkQtBC7EMkRaRAXEiYRuBDJEbkQyRG7ELkQbBC5ELsQvBArEYwRuRAYEicRGBK5EGwQbBAqERgSJxEZEpARKRGOERoSKREaEi8R",
    "kBEbEi4RyxHNES0RyxHMEc0RLBEcEh0SLBH8DxwSwRDAEB4SzBEfEr8QxBAeEsAQwxAgEsYQvxAhEsUQkREiEsQQxxAcEvwPcRDSEXUQlBEzESMSMhH9D88R",
    "MhHOEdARJBLUESESMRElEpERMxFzECMSMxHPEXMQxRAhEtQRNBGTESYS0hGVEScSzBDLENMRcxDPEc4QNBEmEjURcxA3ESMSNhHQEM4QlRHVEdYRzBDTEc0Q",
    "zRDWEdMRzRDTEdYR1BEoEpYR1RHXEdYRzRDWEdcRNxHZESMSKBIpEpYRKhIrEiwS1xEtEjgROhEtEtcR0xDUENoRgBDaEdQQLBIuEioSOBHZETkR1RAvEtkR",
    "0RDbEdYQ0RDYEdsROhE5ES0SORGXES0SORHZEZcRgBDVENoRlhEpEjASLRKXETESlhEwEtcQ1hDbEYAQlxEyEjESOxEzEtoQ3BE9EYEQOxHbETMSPBHfEdsR",
    "1xAwEtwQmREzEt8RQBHcEDQSmhHeEd0R3hDhEd8R4BHiEd8QQhFFEUQRRxHkEUgRDxBHEeQRSRGHEOYRSBE1EgAP4xBJEeUQNRLkEAAPiRDkEDYSiRA2EuUR",
    "SRHnEeUQ6BA3EucRTBE1EpsR5xA2EugR6BBKETcS5xCIEOUR5RDnEY0QjRDnEeoR6hHnETcSiBDnEJ0RTBHtEecQ5xDtEZ0RShHrETgSTRHsEYwQTRGgEY8Q",
    "7BCgEU0R8RCgEewQSxGeEekRnRHtEe0Q6hE3EvQQ8xCfESIQnhFLEVAR7BE5EusR8RHwEFMRURE6Ek4RURFOEfYRTxH2EU4RUxFVEfERoxGiEfIRNBA7EqIR",
    "UhE8Ek8R9hHwEVERTxFZEfYRTxE8ElkR7RDtEZwQ+hA9ElsRnhFQET4S7RA+ElAROBLrET8SqxE9EvoQbhHvEfsRPBDvEW4R8RGUEEASZRFhEf4QoxHyEfUR",
    "oxH1EUESoxFBEjsS9BA/EpMQKxBjEfkQXhHzEV8RWhFbEWURqBFCEmARahEQEakR8hEGEfUR/xBXEQARdBH9EWcRpBGvEWcR9RFBEgwRaRE+EpwQkxA/EmMR",
    "BxGtEQgRahEAEhARcRGwEQMRZxGvEa4RbxF1EQsRaxFwEUQSrRFFEggRdRH1EQwRCBFFEhMRDRH4EXkReRH4EXIR/hEIEpcPDQ96EQESDRF5ERQReBFHEgIS",
    "AxIFEgoSFBF5EXwRQxACEt4PexGCEUgSUA9JEhsRCxKAEU8QGRGEEUoSGRFKEksQSxJMEk0ShxG1EbIRThJPElASThJQEk8SURJPElISHBG2EboRURJSEogR",
    "HRFREogRrxC/EVMSuhFUEr8RiRFVEroRihEQEiERvRHBEVYS8w9VEokR8w9XElUSWBLHEcARIRGzECIRwBHHEWYQwRHDEVgSxBHIERQS8w8lEVcSWBLDEccR",
    "IhGzELQQixEWErEQsRAWEhISwxEXEscRixEXEsMRixEWEhcSxRFZEhUSWRJaEhgSGBJaEicRGBIqERkSKhHKERkSjxEtEW4QkBFbEhsSLBEdEsoRLxEfEssR",
    "GhIfEi8RLRHNER4SyxEfEswRwRAeEs0RLhEbEsMQwxAbEiASXBJdEl4SvxAfEiESxBAiEl8SxhBgEs4RzhEcEscQMRGSESUSMREwEZIRlBEjEssQxxDYEc4R",
    "/Q82Ec8RzhHYEdARkhE1ESUS0xFhEpURzhDPETYR1BEkEigS2BHREDYRYhIrEiYSKBJjEikSIxLZEWQSOBEtEtkR2hFlEtQQlxHZES8S1RDaES8S1RBlEtoR",
    "lxEvEjISKRJjEjQSKRI0EjAS3BFmEmcS3BFnEmgSMBI0EtwQaRJqEjQSaRJrEmoS3RFsEpgR2xHfETMSmBEzEpkRahJtEjQS3RFtEmoSNBJtEkAR4RGZEd8R",
    "4BFAEW0S3hGZEeER4BDiEeERnBHjEOUQSRHmEW8S5BBwEjYSNRLoEeQQTBHoETUSSRFvEucR5RE2EucQOBI3EkoRThE6EvMQOhKfEfMQNxI4EvQQ7BGQEPkQ",
    "cRI5EuwR7BFyEnES7BH5EHIS8BDxEUASnhE+ElIR9BA4Ej8SVRFhEfERkhD7EFYRoBHxEP0Q8RBfEf0Q8RBzEl8RVRH+EGER+BD3EaYRqRHyEe8RUhE+EjwS",
    "ORI/EusRYxFyEvkQXxHzEf0Q+BD7EfcRWRE8EqoRnBA+Eu0QXxFzEvQRWhFlEf4QEBH7Ee8REBHvEakRZhF0EqcRZhGREHQSaBH3EWIRQRJEEgwRlBD0EXUS",
    "rxHuEf8RqBH6EUISrBEAEmoRZRGwEWwRqBFIEvoR/BH5EQ8R/xFIEn8RAxIKEgQSeBGDEUcS3g9JElAPSxJNEkwSsxGyEbQRtBG3EbYRTxJ2ElASTxJREnYS",
    "uBG2EbcRthG4EboRuRF3EngSuRG7EXcSuxEeEXcSvxFUElMSiBFSEsAReRIeEbwRvBEfEXkSHxFjEHkSihG+EXoSvhEOEg8SERJ7EnwSfBLCERESwBF9ElgS",
    "DxJXErIQExJ+EsMRyBF8EhQSyBHCEXwSshBXEiUREhIkEWsQixHDERYSWRLFEX8SJhEXEoASWRJ/EloSJhGAEo0RWRKBEn8SgBKCEo0RWRIYEoESjRGCEo4R",
    "bhCDEisRWhIZEicRGBIZEoESLRGEEm4QkBEZElsSyhFbEhkSGxJbEiASWxIdEiASXBJeEl0SHxKFEiESIBJgEsYQIRKFEiQSkRElEiISIhIlEjARzxGGEocS",
    "zhGIEhwShxKJEs8RkxGKEiYSIxKJEosS0BHYETYRJRI1EYwSlRFhEicS0xHLECMSjRLPEYkSzhCGEs8RJhKMEjURzhDPEY0SzhCNEo4SJhKKEmIS0xGPEmES",
    "zhCQEoYS1hGPEtMRzhCOEpASKBIkEmMSYhKREisS1BCQEmQSkBLUEGUSKxKREiwS2REvEmQSZBIvEtQQkhKTEi0SLxLaEdQQLhJjEioSLRKTEtkR2RGTEi8S",
    "LhIsEpQS1RDaEGUSlRIyEi8S2hCWEmUS2hAzEpYS3BFoEmYSZxJsEmgSmBGWEjMSaBJsEt0R3RFqEmgS3RHeEZcS3RGXEm0SlxKYEm0SbRKZEuAR4RHiEZkS",
    "4BGZEuIRRxGbEeQRSBHkETUS5BDoEXASNRLkEZsR6RGeEekQ8RDwEEAS8RBAEnMS7xHyEW8RORKbEj8S/RCcEvMRPBI+EmkRYxE/EpsSQBKUEHUSqRHvEW8R",
    "8xGcEp4S7hFCEv8RbxHyEXURaxFEEkESOxKfEp0S8hH1EXURChF3EaASChGgEgcSAhJJEt4PBhIZEaEShREMEqISghGBEaQSfhGhEhkRShKEEaESSxBKEqUS",
    "hREMEoYRDRKyEbMRshG1EbQRtRG3EbQRTxJQEnYSdhJSEk8SURIdEaYSeRJ3Eh4RVBK6EVUSpxIQEooRvhEPEhASDhJUEg8SqBJ9EsARVBJXEg8SVBJVElcS",
    "WBJ9EqkSWBKpElYSqhITEqsSwRFYElYSIhHCERESyBEUEsIREhJrEKwSyBEVEhQSwxF+EhYSrBJrEK0SFhJ+Eq0SaxCMEa0SjBGuEq8SrRKMEa8SFhKtEhcS",
    "rRKAEhcSrxKAEq0SrhKMEbASjBGxErASjBErEbESghKyEo4RKxGDErESbhCzEoMSshK0Eo4RtBIaEo4RbhCEErUSyhEdElsSLREeEoQSxBBfEh4SHRIcEiAS",
    "MBG2EiISIBK3EmASIBIcErcSYBK4Es4RuRIkEoUSuBKIEs4RHBKIErcSMBGMEroSkxHREYoSJRIkErkSJRKMEjARjBIkEiUSYRKPErsS1hGLEo8S0xGLEtYR",
    "IxKLEtMRIxJkEosSJhJjEowSJhIrEmMSKxIqEmMSLRIxEpISkxKVEi8SMhKVEjESLhJpEmMSYxJpEjQSlBJpEi4SlBJrEmkSlBK8EmsSvBJmEmsSZxJmEmwS",
    "mBFsEpYSaBJqEmsSmBKZEm0S3hGZEr0S3hHhEZkS4RBGEb4SDhC/EkYR4xG/Eg4Q5BHAEsESmxHAEuQRwBKbEeQRcBLoETYSwhLzEcMSwxLzEZ4S8hGiEUES",
    "OxJBEqIRPBLFEqoRnRKaElcRxRLIEqoRaRHFEjwSwhKcEv0QcxJ1EvQRYBFCEskSdBKREMcS/xFCEsoSzBLNEqURyhLPEv8R+hH/EUISdBIBEnoR+hFIEv8R",
    "oBLREgcSdxHREqASCBL+EX0RSBKCEaQSfxGkEoERhRGiEgwSuRGmEh0RURKmEnYSdxJ5EngSUxLSEq8QrxDSEg4SUhLTEsARdxKoEsARYxC9EdQSqRJ9EqgS",
    "whF8EhESEhKsEhMSrBKtEtUSrRJ+EtYSrRLWEtUSFBJ/EsURrxKCEoASsBKxEoMSghLXErISshKzErQSbhC1ErMSGhK0EtgSGhLYEh8S2RLaErcS2RK3EtsS",
    "HhJfErYSYBK3EtoSXRKFEl4SXRJfEiISthJfEiISYBLcErgSIhK5El0SIhJfErkSthK6Et0SuRKFEl0SuhK2EjARYRK7Et4SuRLfEiUS0RG6EooShxK7EokS",
    "iRK7EosSixKJEiMSjBJjEiQSjxKLErsSkBKOEuASixJkEuASkBLgEmQSjhKQEmUSkhLhEpMSkRLiEiwSkhIxEpUSlBLjErwSvBLjEmYS4xLkEmYSZhLkEmwS",
    "bxLmEeUS5hHnEeUSbxLlEucRchLmEnES5xI+EugSPhLnEugSchJjEeYSmxLmEmMRpRHNEswSmhLpEjsS6hLrEuwSQBJ1EnMSQhLPEsoS7hHEEkISOxLpEp8S",
    "xhLOEq0RQxLuEssS/xHPEkIS7xLwEkYSSBLyEn8RRxLzEgISSBKkEvIS9xL4EvkS+hL7EvwS/RL+Ev8SdhLTElISdhKmEtMSYxDUEgATehKnEooRdxLAEdMS",
    "dxIBE6gSUxJUEg4SAROpEqgSvhECE3oSvhEQEgITVhKpEr0RpxICExASERJ8EnsSqxITEgMTwhEUEnwSExKsEgMT1hKvEtUS1RKvEq4SFBIVEn8SWRJ/EhUS",
    "rhKwEgQTgxIEE7ASfxKBEloSWhKBEhkSsxKyErQStBK1ErMShBIFE7USsxK1ErQShBIGEwUThBIeEgYTBxPaEtkS2RLbEggTthIJEx4SChNeEh8SXhKFEh8S",
    "XxILE7kSCxMME7kSuRIME98StxKIEg0ThxIOE7sSjBLfEroSYRLeEicSJRLfEowSuhIPE4oS0hEQEw8T0hEnEhATJxLeEhATYhKKEg8TkBKOEoYShhKOEo0S",
    "YhIPE5ESkhKVEuESLBLiEpQSlBLiEuMSlRJlEpYSZhJoEmsSbBLkEpYSlxK9EhETlxLeEb0SmBK9EpkSEhMTExQTvxIVE0YRcRKbEjkSyBIWE6oR7BIXE+oS",
    "dBLHEgESRhLxEu8SRxLQEvMSfxHyEqQSGBMZExoToRKlEkoSGxFJEvYS+BL3EhsT+BIbE/kS/BIbExwT/BL4EhsT+BL8Eh0T+BIdExsT/BIcE/oS+xIdE/wS",
    "HhMfEyATIRMiEyMTHxP9Ev8SuREhEyMTuREjE6YS/RIkE/4SeBJ5EiUTJhPSElMSYxAAE3kSJxN6EigTdxLTEqYSpxIpEyoTehIpE6cSDhLSElMSqRIBE3kS",
    "KRMrEyoTKRMsEysTKhMrE6cSqhItExMSLROsEhMSExKsEn4SLhOCEq8SLxMwEzETMBMyEzET1xIzE7IStRIFEzQTMBM1EzITshIzE7QSMhM1E9sSNRMIE9sS",
    "tBIzE9gSBxPZEjYT2xIIEzIT2BIKEx8SBxM3E9oSXhIKEzgT2xK3EggTXhILE10SXhI4EwsTXRILE18SthLdEgwT0RE5E7oShxI6Ew4ThxKGEjoTuBINE4gS",
    "DhM6E7sSjRIOEzsTOxOGEo0SDxO6EjwTDxMQE94SiRI9Ew4TjRKJEg4TixI9E4kSPhM/E+ES4BI9E4sSDxNAE5ESQRM9E+AS4RI/E5MSjhJlEuASZRJBE+AS",
    "lRKTEkETlRJBE2USlRKWEuQSEROYEpcSEhNCExMT4xEVE78SwBLkEUMTcBJEE0UTRhNHE+cSSBNJEzoSwxKeEsISQxLLEu4SmhKdEukSyBJKExYTQhJME8kS",
    "nxLpEp0S7BLrEhcT7xLxEvAS8hKkEk0TAhLzEvQSBhKhEvUSGRNOExoTHhMgEx8THxP/Ev0SuRFTEyETVBN4EiUTuRF4ElMTJhNTElUTdxKmEngSeBIBE3cS",
    "ABNWE3kSeRLUEqkSqRLUEr0RVxMCE6cSqxItE6oSKxNYE6cSqxIDEy0TfhKsEtYS1hIuE68SBBNZE64SghIuE9cSgxKzErUSMRMyEzUTHhIJEwYT2BIzEwoT",
    "CRO2EgsTNxNgEtoSNxPZEmAS2RIIE9wS2RLcEmAS3BIIE7cStxINE9wS3BINE7gS0hE8E9EROhOGEjsT0hEPEzwTOhNaE7sS3hI+E1sTuxI+E94SuxJcEz4T",
    "DhM9E10TXBM/Ez4T4RJeEz4T4RI/E14TPRNBEz8TPxPhEpMSlRKTEuES4hJfE+MSlRLkEpMSERO9EuQSwRJhE+QRYhNjE2QTZRNmE2cT5xJHE0YTyBJoE0oT",
    "nhKcEsISyBLFEhYTFxNqE0sTGhNOExgTGxP3EvkSGxMdExwTHBMdE/oS+hIdE/sSIRNsEyITIRNTE20T/RL/EiQT/hIkE/8SJhNuE9ISeRIBEyUTJxNvE3oS",
    "VhPUEnkSKRN6ElcTehICE1cTpxJYE1cTLRMDE6wScBNxE3ITrBLVEtYS1RIuE9YScxMvE3QTrhJZE3UTLxNzE3QTLxMxE3MTBBN2Ey4TgxJ2EwQTLhN2E9cS",
    "dxN4E3kTdhODEnoTtRJ6E4MSNBN6E7USexN4E3wTBhN9EwUTexN8EzYTMhMIEzUTBhN+E30TBxM2EzcTfxMJEzgTBhMJE38TfhOAE4ETCRMLEzgTthIMEwsT",
    "ghM6EzsTghM7E4MT3RI5E4QTuhI5E90S3hI8Ew8TuxJaE1wTDhNdEzsTPhNeE1sTXBOFEz8TkRJfE+ISQBOGE18T4xJfE4YT4xKGE4cTkxLkEocTkxKHE0ET",
    "hxPkEuMS5BKIE4cTFBNCExITwBJhE8ES4xGKExUTRhEVE4oT5BFhE0MTcBKLE0QT5RKME40TjhOPE5ATkROSE5MTOhJJE0gTyBIWE2gTzxLEEkwTlBOVE5YT",
    "lxOYE5kTzhKaE5sTzhKbE+0SnROgE54TnROfE6AToROiE6MTTxOkE1ATpROmE6cT8xKoE/QSpRKpE6MSoxKpE6USqhOrE6wTJhNVE24TVBOtE3gSbhNVE9IS",
    "eBKmElMTUxLSElUTKRNYEywTVxNYEykTKxMsE3ATKxNwE1gTrhKuE9USrhKvE64TdBNxE3MT1RKwEy4TLhOwEwQTdhMzE9cSNBMFE7ETfBOyEzYTfxM4EwoT",
    "sxO0E7UTsxO2E7QTNxM2E9kSgBOEE4EThBO3E90S3RK3EwwTtxPfEgwTPBM5E9ERuhLfErgTuhK4EzwTPBO5Ew8TuRNAEw8TPxOFE14TPxNdEz0TPxNBE10T",
    "QBNfE5EShxO6E+QS5BK6ExET5BK9EogTuhOYEhETExNCExQTvhJGEYoTwBJDE2ETbhKJE7sTvBPjEWATZBNjE2IT5RKNE4wTRROLE3ASkRO9E5ITcRLmEr4T",
    "cRK+E5sSmxK+E+YSFxNpE2oTwBPBE8ITlxOZE8MTxRPGE8cTnxPIE8kTnhOgE8oTnhPKE8gTlBPLE5UTzBPzEscSnxPJE6AToBPJE84ToBPOE8oT8hJNE0wT",
    "zBOoE/MSTxNRE6QTzxPQE9ETzxPWE9AT0RPWE88T9BKoE1IT2hPbE9wTbBMhE20TbBNTEyMTIxNTE6YSrRMBE3gSrRMlEwET3RN6Em8T3RMoE3oS3hPfE+AT",
    "3xMtE+ATLBNYE3ATsBPVEq4TrxOuEnUTcxPhEy8T4RPiEy8TWRMEE+MTLxPiEzAT5BPjEzQT4xMEE3YTNBPlE+QTdhN6E+MT5RM0E+YTdhPnEzMTNBPjE3oT",
    "NBOxE+YTMBMxEzUT6BPpE3wTehPqE38TeBN7E7ITfRPqEwUTfxMKEzMTexM2E7IT6hMGE38T6xMGE+oT6xPsEwYTfRN+E+sTfhOBE+sTBhPsE34TfhPsE4AT",
    "gRPtE+4TgROEE+0TghODEzoThBM5E+8TtxPwE98SPBO4EzkT3hJbEzwTOhPxE1oTOxPxE4MT3xLwE7gTOxNdE/ETWxNeE/IThhPzE/IThhPyE14ThhNAE/MT",
    "QRP0E10ThxP0E0ETvRKYEvUTZBNjE/cTRRNEE/gTjxP5E5ATkBP5E44TkhO9E5MTaRNLE2oTlRPLE5YTmhPtEsQTmROYE5cT+xP8E/0TyBP+E8kT/hP/E8kT",
    "AhSkEwMUyRMBFM4TARQFFM4ToxOiE6ET0BPVE9ET1RPWE9ETpxOmE6UTqhOsE6sTIxMiE2wTbRNTE2wTJROtE1QTABMHFFYTbxMnEwgUJxMoEwgUKBPdE28T",
    "3xMJFC0TLRMJFOATcBMKFHETcRMLFAwUcRMMFHITcRN0E3MTDRQOFHkT4xN1E1kTeRPiEw0UMRMPFHMTBBMQFHYTeBN3E3kTdxMRFHgTeBMRFHcTehPjE+YT",
    "6BN8ExEUfxPnE3oTehPmE+oTBRPmE7ETBRPqE+YTeBOyE3wTMxPnE38T6hN9E+sTtRMSFLMTgBO3E4QTgxPxEzoTWxMTFDwTPBMTFLkT8RNdExQUXBNaE4UT",
    "uRMVFEATuRMWFBUUQBMXFPMTQBMVFBcUXhMXFIYThxOIE/QTuhP1E5gSvRL1E4gTZBP3E2MTkROTE70TvRMaFJMTZxNmE2UTAxTAExsUxBL6E0wTAxTBE8AT",
    "yRJMExwUyRIcFPoTlBOWE8sTxBMdFJoTHhQfFCAUxRMhFMYT/hPOEwEUyhPOE/4TlhPLEyIUlxPDE5kTTBNNExwUxxPGEyMUnBMkFM0TJhQnFCgUpBLyEk0T",
    "zBMlFKgTThPYEykUqBMlFCoUqBMqFNcTKxRtEywU2xMtFNwTUxMsFG0TBxQAEy4U2xPaEy0UABPUEi4U1BJWEy4U3xPeEwkU3hPgEwkUcBMvFAoUcBNyEwwU",
    "cBMMFC8UrxN1EzAUdRPjE+QTcxMPFOETBBOwEzEUDRTiE+ETMRQQFAQTeRMOFHcTDxQxE+ITdhMQFOcTMBPiEzET4xN6EzIUehPnEzIU6BMRFDMUsRM0FDUU",
    "6BM2FOkTfBM2FBEUNBSxEzcUgRPsE+sTtBMSFLUTgRPuE+wT7ROEEzgU8BO3E7gT8RM5FFoTORO4ExMUWxM6FBMUOhRbEzkUuBMWFBMUExQWFLkT8hMXFF4T",
    "XhOFE/IT8xMXFPITFBRdEzsUhhMXFIcTGRS7E4kTixP4E0QTjxOOE/kTkxMaFL0TPBRlE2YTFhNKE2gTHRQ+FJoT/BM/FP0TIhTLE5YTzhMFFAEUmxM+FMQT",
    "zRNAFPwTTBNBFPIS1BNCFAAUAxSkE0MU0hMAFNMT1RPQE9YTJBRAFM0TURNQE6QT8hJBFE0TKhTZE9cT3BNEFNoTbhNFFEYUVRNHFAgUbhNHFFUTbhNVE0UU",
    "CBRHFFUTKBNvEwgUChQMFHETCxRxEwwUMBR1E0gUsBOuEzEUdRPkE0gUeRN3E+ITMhTlE+MT4xPlE+YTsRM1FDcUfBPpEzYU7hNJFOwTgBPsE7cTSRS3E+wT",
    "SRTtE7cThBPvEzgU7RM4FLcTuBO3EzgUuBM4FBYUORMTFO8TORRbE1oTFBQ7FPET8hOFE1oTWxPyE1oTXRP0E0oUixNFE/gTSxRmE2UTSxQ8FGYTTBRIE0kT",
    "SBNMFEkTwBPCE8ETwBPBE04UThTBEwMU+hMcFEwTxRPHEz0UUhRRFFAUVBT7E/0THhQgFB8UxhMhFD0UPRTHEyMUVRQFFFYUVxQDFEMUVhQFFFUUQxSkEwIU",
    "HxRYFFkUJxRaFCgUWxSpE1wUohNdFF4U/BNAFD8UYRRiFGMURhRHFG4T3BMtFEQUbxMIFEcURRRVE0cUZBRWEwcU3hNlFGYUZxRoFGUUrxNpFGgUrxNqFGkU",
    "SBTkEzIUSBQyFBAUDRTiEw4UDhTiE3cTMhTkE+UTMhTnExAUMxQRFGsU6BMzFDYUbBQ1FDQUNhRrFBEUNxRtFDQUbhRtFDcUbhTuE20UEhS2E7MTEhS0E7YT",
    "bhRJFO4T7RNJFO4TbxQ4FO8T7xM6FHAUcRQWFDgUOhTvExMUchQ5FPETcxR0FBUUFRR0FBcUShQ7FF0TdRSHExcUdRS6E4cTdhT1E7oTURRSFE8UAxRXFE4U",
    "GxRDFAIUzRN3FAQUHBRBFEwTHBRNE3gUeBRNE3kUPRQjFMYTzRNUFHcUHxR7FFgUfBR9FH4UfBR+FH0UnBOAFCQUKRTYE4EU0xODFEIUKRSBFE4ThBSFFFAT",
    "2RMqFIYUhhRrE9kTBhRrE4YUYRRjFIcUiBQrFCwUbRMsFFMTRBQtFNoTLhRWE2QUZRRoFIkULxQMFAoUahSvEzAUbBQ0FG0UNRRsFDcUihRtFO4TixRJFG4U",
    "jBRwFI0U7hNJFI4USRRvFI4UbxRxFDgUOhSPFHAUkBSPFDkUkBQ5FHIUOhQ5FI8UFhSRFHMUFhRzFBUUdBR1FBcUShT0E4gTdhSIE/UTkhSTFJQU9hOVFBgU",
    "lhSXFIwTmBT5E5kUmhSbFJwUTxSdFFUUHBR4FJ4UVhRPFFUUnxSgFCIUnxQiFKEUGxRXFEMUHRSkFD4UBBR3FJwTPxRUFP0THBSeFEEUVRSdFFYUxBOlFKYU",
    "xBM+FKUUnBN3FIAUVBRAFIAUWhRfFCgUpxSoFKkUJBSAFEAUPxRAFFQUWxRcFFkUUBOFFIQUqBSqFKkUqRSqFKsUWRSsFFsUrRSuFKgUrxSwFLEUshStFKgU",
    "rxSxFLMUrxSzFLIUYhRhFIcUKxSIFG0TbROIFCwUbxNHFLQU3hNmFGUUZRRmFGcUaBS1FK8TrxO1FK4TrhO1FDAUrhMwFDEUthS3FLgUuRS6FLsUuBS3FLwU",
    "DRThE+IT4RMPFOITvRQzFLcUuxS+FL8UvRTAFDMUMxRrFDYUbBRtFMEUbBRuFDcU7hPCFIoU7hPDFMIU7hOOFMMUxBTFFMYUSRSLFG8UjRRwFMcU7xOOFG8U",
    "kBTHFI8UcBSPFMcUchTIFMkUchTxE8gUdBRzFMoUShTLFDsUShTMFMsUdBTKFHUUiBN2FEoUuhN1FHYUlBSTFJIU+RPNFJkUmBTNFPkTzhTPFNAUPRQjFJ0U",
    "oBTRFCIUqRSrFNIUghTTFH8UXxQnFCYU1BSDFNMTrBSpE1sUqBSuFKoUrxSyFLAU1RTWFNcUYxRiFIcURhRFFEcURxQIFLQUbxO0FAgU2BTZFNoUZRSJFGYU",
    "ZxSJFGgU2xTcFN0UMBS1FGoUuhS5FN4USBTeFDAUuBS8FN8UMBTeFDEUMRTeFBAUSBQQFN4UuhTgFLsUuxThFL4UvxS+FOIUbBTiFL4UbBTBFOIU4xTAFOQU",
    "5RTmFOcU5xToFOUU5hTpFOcU5xTDFIwUjRTnFIwUjBTqFHAUxBTGFMUU7xPrFI4U7xNwFOsUcRSRFBYUchTJFJAUOxTIFPETShR2FMwUlhSME5cUSxRlE+wU",
    "7RQ8FEsUZRM8FOwUUhRQFO4UnxShFKAUPRTwFCMUTxRWFO8UmhScFJsU8hTzFPQU7xRWFJ0UoRT1FKAUfxT2FIIUeRRBFJ4UJxRfFFoUpxT3FKgUABTUFNMT",
    "ABRCFNQUqROsFFwU9xSqFKgUYBReFF0UqhTSFKsUqBSqFK4UqBSuFLIUKhQGFPgU+RT6FEYURhRFFPkURhT6FEUU2RTYFPsUZhSJFGcUaBRpFLUU3RT8FNsU",
    "aRRqFLUU3xS2FLgUuRT9FN4UtxT+FL0UvxT/FLsUMxT+FLcUuxTgFOEUvxTiFP8UvRQAFcAUwBQBFTMUAhUDFQQVAhXlFAMVwBQFFeQU4RTBFGwUAxXlFAYV",
    "bBTBFG4UwRRtFOYUBxUIFeMUbRSKFOYU6BQJFeUUBxXjFAoVBxUKFQgVihTCFG4UbhTCFIsU6RTCFMMU5xTpFMMU6BTnFI0UwxQLFYwUwxSOFMIUjBQLFeoU",
    "whSOFG8UwhRvFIsUxhQMFcUUjRTHFA0VxRQMFcYUjhTrFOoU6hTrFHAUkBTJFMcUkRTKFHMUOxTLFMgUSxTsFO0UDhUPFRAVDhUQFQ8VoxQRFaIUUhTuFE8U",
    "oxSiFBEVzxTOFNAUHRR6FKQUoBT1FNEU8RTyFPQUqRT3FKcUqRTSFPcUFBUVFRYVFxVgFF4U9xTSFKoUgxTUFEIUqxTSFBkVKhQaFQYUrRSyFK4UhhT4FAYU",
    "shSxFLAUshSzFLEUBxQcFWQUHBUuFGQU2hQdFdgUHhUfFSAV2BQhFfsU+xQhFdkU3xT8FN0U/RQiFd4U3xS8FPwUuRQjFSQVuxQjFbkU/hQAFb0UABUBFcAU",
    "wBQBFQUVwBTjFAEVvhThFGwU4hTBFAIVwRTmFG4U5BQFFeMUbhTmFIoU5hSKFCUV5hQlFekU6RTDFMIUjRQmFegUCxUmFY0U6hQnFY4UCxUnFeoUCxWNFA0V",
    "jhQnFW8UJxUoFW8UbxQoFXEUxxTJFCkVKhXMFCsVKhXLFMwUKhXIFMsUzBR2FCsVmRTNFJgUPBTtFOwUTRQsFS0VTRQtFb8TTRRTFCwVDhUuFQ8VLxUSFfEU",
    "8BQwFSMUnRQjFO8U9hR/FIIUFBUWFRUVghR/FNMUFhUVFTEVMhUzFYEUgRQzFTIV1RTXFNYUNBU1FTYVBxQuFBwV+hT5FEUUHhUgFTcV2RQhFdgUOBUfFTkV",
    "3BTbFDoV/RQ5FR8V3BQ7Fd0U2xT8FDoV3RQ7Fd8UuRQ8Ff0UuRQkFTwVthTfFLwUtxS2FLwUuhQkFeAUuxT/FCMVMxQ9Ff4U4BQkFeEU/xTiFCQVJBXiFOEU",
    "MxQAFT0VARUAFTMU4hQCFeEU4xQFFQEV4RQCFcEUAhU+FeUUBhXlFD8V5RQ+FeYU5RQJFT8V5BRAFQUV5BRBFUAV4xQIFQoV5hQlFYoUCRXoFCYVJRXDFOkU",
    "JRUnFcMUJRVCFScVxxQpFQ0VKRXJFEMVQxXJFMgUcRREFZEUyhR2FHUURRVGFUcVSRVIFUoV0RT1FKEUgBR3FBMV0hRNFRkV0hSrFE0VYBQXFV4UgxROFdQU",
    "KhQbFYYUhhQbFU8VgxRQFU4VURVSFVMV2RQdFdoUHRXZFNgUIBUfFVQVNxUfFR4V3BQ6FVUVHxVWFf0UVhUiFf0U/RQ8FTkVPBUkFVcVvBTfFPwU3hQiFboU",
    "uhRYFSQVJBUjFVcV/hRZFQAVPRVZFf4UIxX/FFoVWBVbFSQVJBVbFf8U/xQEFVoVWhUEFVwVBRVdFeQUCRVeFT8V5hQ+FSUVXxVgFUAVCRUmFV8VwxQnFQsV",
    "CxUNFSYVJxVCFSgVQxXIFAwVkRREFcoUdhTKFCsVlhRhFZcU8hTxFPQUERViFaIUohRiFREV8hT0FPMUFhUxFRUV1BRjFYMU1BROFWMVGRVkFU0VgxRjFVAV",
    "hhRPFfgUZRVmFdcUURVTFVIVNBU2FWcV+RRoFWkVIBVUFTcV3xQ7FfwUuhQiFVgV/xRbFQQVBBUDFVwVBBVbFT4VBBU+FQIV5BRdFUEVQBVgFQUVXhUJFWoV",
    "PhVCFSUVCRVfFWoVQBVBFV8VaxVsFW0VaxVuFWwVDRVvFSYVbhUMFXAVDBVuFUMVDBXIFHAVKBVEFXEUyBQqFXAVKxXKFHEVlhSXFGEVLRUsFXIVDhUPFS4V",
    "8RRzFS8VRRV3FUYVdxVHFUYVehV7FXwVfRV+FX8V1xRmFX8VfRV/FX4VgBWBFYIVgBWCFYMVaRVoFYQVZxU2FTQVNBU2FTUVNxVUFYUVhhWHFYgVNxWJFR8V",
    "hxWGFYgVOBVWFR8VOBWKFVYVVRWIFdwUixWMFY0V3BSMFTsVjRWOFYsVjhWPFYsVOhX8FDsVjhWQFY8VIhVWFTkVPBUiFTkVkBWRFY8VPBVXFSIVIhVXFVgV",
    "kBWRFVkVkBVZFZEVVxUjFVoVWhVcFZIVAxUGFVwVBRWTFV0VBRVgFZMVPhWUFUIVlRWWFZQVlRWXFZYVQRVqFV8VaxWYFWAVbRWYFWsVXxVvFWAVJhVvFV8V",
    "lhWZFZoVlhWXFZsVlhWbFZkVbhVwFWwVDRUpFZwVbhVrFUMVRBVxFcoUKhUrFXEVnRWeFZ8VRRV3FaAVoBV3FUUVdhWhFXUVdhWiFaEVERWjFWIVYhWkFREV",
    "pxWmFaUVpxWoFaYVpRWoFacVexVkFXoVZBV7FXoVfBV7FXoV1xR/FWUVihWrFVYVVBUfFYkVhxWIFVUVrBWMFdwUOBU5FVYVjBVVFTsVOhU7FVUVrRWuFTwV",
    "rRU8Fa8VjhWRFZAVWhWwFVcVVxVbFVgVABVZFT0VWhWSFbEVWxWyFT4VkhWzFbQVsxW1FbQVsxUGFbUVQRVdFbYVmBVtFbcVBhU/FZUVshWUFT4VBhWVFbUV",
    "tRWVFZQVkxVgFW8VbBVgFZgVbBVrFWAVmhVCFZQVDRWcFW8VQhWaFSgVmhWZFSgVaxVwFUMVmRVEFSgVcBUpFUMVcRVEFZkVKRUqFXEVKhUpFXAVuBW5FboV",
    "uxXsFO0UdxVFFUcVoxURFaQVvhW/FcAVxBUxFcUVwhXDFagVxBXFFTEVgRWAFYMVxhXHFcgVhBX5FGkVyBXHFcYVhBVoFfkUiBWHFawVrBXcFIgVrBVVFYwV",
    "OBVWFYoVrxU8Fa4VjBWLFY8VyRXKFVwVXBUGFckVyhWSFVwVyxVdFZMVzBVeFbYVthVdFcsVtxXNFc4VzxXQFT8VzxU/FV4VbRXNFbcV0BWVFT8VtRWUFbIV",
    "lRXQFZcVkxVvFUEVlhWaFZQVlxXRFZsVbBVwFWsVnBUpFdEV0RUpFXEV0RVxFZsVmxVxFZkV7BS7Fe0UuRXSFboV2RXCFcEV2RXaFcIV2RXBFdoVwRXDFdoV",
    "2BUYFakVwhXaFcMVGRXcFWQVGRVNFWQVGRVkFdwVYxVOFd0VYxXeFVAV3xXgFeEVThVQFd4V4hXjFeQV5RXmFecV5RXoFeYVhRVUFYkVhxVVFawVjRWMFY4V",
    "jBWPFY4VjxXpFY4VjhXpFZEVjxWRFekVVxXqFVsV6xVaFbEV7BXtFe4V6hWxFVsVsRWSFVsVyxWTFe8V7xW3Fc4VkhWyFVsVyhWzFZIVkhW0FbIVzBXPFV4V",
    "tBW1FbIVXhVqFbYVbRVsFc0VQRVvFfAVlxWcFdEVbxWcFfAVuBXSFbkVuhXSFbgVvxW+FfUVdBXTFb0VvhXAFfUV2RX6FdoV2RXaFfoVeBXbFXkVYxXdFcUV",
    "eBX9FU8VYxXFFd4V3RVOFd4V/xUAFgEWfxVmFWUVAhYDFgQWBRYGFgcW5RXnFegViRU3FYUVqxWKFVYVrRUIFq4VrxUJFq0VsBXqFVcVWhXrFbAV7hUKFuwV",
    "7BXvFe0VyxXvFewV7xXOFe0VyRUGFQsWBhWzFQsWzBULFs8VtxXvFZgVthWTFUEVbBWYFc0VQRXwFWoV0BXwFZcVlxXwFZwVnhUMFp8VDRYOFg8WEBYRFhIW",
    "vxX1FcAVcxW8FS8VTBXXFakV0xUUFr0V3xUaFhsW4BXfFeEV3xUbFuAVABYcFgEW5BUdFuIV4xUdFuQVghWBFYMVHhYfFiAW5xXmFSEW5xXmFegVrBUiFiMW",
    "IxYkFqwVJRYIFiYWJRauFQgWCBatFQkWrhUJFq8VChbuFScWChYoFuwV6xWxFckVyRWxFcoVyxXsFSkWKhbMFSsWKRYsFssVyxUsFrYVzhXNFe0VzBW2FS0W",
    "CxYuFs8VthUsFpMVahUtFrYVahXwFc8V0BXPFfAVLxa4FTAWnRWfFQwW8hUzFvQV0xW9FTIWSxU0FhUWNBYyFhUW1RXUFTUWpBX5FaMV2xUVFjIWGxbfFeAV",
    "OxY8Fj0WOxY9Fj4WOxY+FhwWPxZAFjwWQRY/FjwWPBZAFj0WAxZCFgQWAhYEFkMWBBZCFkMWHRbjFeIVBhYFFgcWZxVEFkUWZxVGFkQWZxVFFkYWRxZIFkkW",
    "SRZIFkoWIxYiFksWJhZMFiUWCBYJFk0WThbqFbAVsBXrFeoVyRVPFusVKBZQFuwV6hXrFbEVKhZPFskVURYrFlIW7RXvFe4VKhYrFlEWyRULFsoVKhYLFswV",
    "zBVTFisWCxazFcoVzBUtFlMWkxUsFu8V7RXNFe8V7xXNFZgVVBZVFlYWLxYwFlcWnRUMFp4VWBZZFloWDhYNFg8WERYQFjYWXBa8FV0W+BVeFhMWoxX5FTEW",
    "XxZgFmEW9xViFvgV1BU3FmMWZBbbFTIWFRbbFWQWZRZmFhcWZRYXFmYWFxYWFmUW3RVpFsUVahYbFhoWaRbeFcUVahbfFRsW/xUBFgAWaxZsFm0WHBY+FjsW",
    "QRY8Fj0WQRY9FkAWOxY+FjwWPBY+Fj0WQxYDFgIWQhYdFuMVbhbjFR0W5xUhFuYVShZIFkcWSxZvFiMWbxYkFiMWIhasFSQWcBZOFgkWCRZOFk0WcRbqFU4W",
    "JxYoFgoWchZzFlAWcxbsFVAWcxZSFuwV7hXvFSgWUhYpFuwVdBbJFcoVKRYoFu8VKRbvFSwWLRZqFXUWdRZqFc8VWxYRFncWeBYTFl4WWxY2FhIW8hXWFTMW",
    "eRbAFfUVYxY1FtQV8xUxFvkVeRZ8FsAVYhb3FV4WfBZ/FsAVOBaBFjkW/BWqFfsVgxaEFoUW3hVpFt0VGhbfFWoW3hWGFmkWaRaGFt4VhRaEFoMWABYBFhwW",
    "QRZAFj8WQhbjFW4WSxYiFocWIhYkFm8WJhYIFiUWJRZwFq4VCBZwFiUWrhVwFgkWThawFYgWiRaKFnIWJxbuFSgWcRaIFuoViBawFeoVchZQFosWTxaMFusV",
    "TxaIFowWURZSFo0WihZzFnIWjBaxFesVTxZ0Fo4WTxYqFnQWURZ0FioWURaPFnQWKBYpFlAWdBYqFskVsRWMFsoVyhWMFnQWUhYrFlMWkBYLFioWkBYuFgsW",
    "LxYwFrgV8RWRFpIWWhZZFlgWlRY1FmMWlhaXFpgWmBaZFpoW9hWUFvcVFRacFvsV9xWbFl4W9RXAFZ4WnhbAFXwW+xWfFvwVfxZ8FsAVZRYWFmcWORagFjgW",
    "/BWjFhgWphanFqgWHRZCFm4WRRZEFqkWRBZGFkUWhxYiFm8WJhYlFkwWCBZNFnAWqhYnFqsWURaNFqwWchatFokWchaLFq0WTxaOFq4WUBZzFosWUBYpFnMW",
    "KRZSFnMWdBaQFioWUxYtFnUWVBZWFq8WsBZXFjAWsRayFrMWmBaaFpYWNBa3FjIWNRaVFtUVERY2Fp0WFRZkFrgWlRY3FtUVuBZkFjIWZRYWFp8W/BWfFrkW",
    "ZRafFhYWGBa7FhkW/hW8Fv0VqBanFqYWQxa9FgMWQxZCFr4WHxYeFr8WHxa/FiAWShZHFkkWThZwFk0WqhbAFicWrRbBFsIWThaIFnEWrRbCFokWqxYnFsAW",
    "TxbDFogWjRaKFokWrBaPFlEWUhbEFo0WxRbEFnQWdBbEFpAWUhaQFsQWjBbFFnQWUhZTFpAWkBZTFi4WUxZ1FsYWrxZVFlQWVhZVFq8WLxZXFrAWLxawFjAW",
    "ERadFncWFRa4FpwWeBZeFpsWyRbKFssW+xWcFs0WnxbIFmUW+xXNFp8WfBZ5Fp4WgBY6Fs8WmRaXFpoWOBbQFoEW0BY4FqAWGBajFrsWhhbRFmkWaRbRFoYW",
    "axZtFmwWAxa9FkIW0hbTFtQWHhYgFr8WShbVFkkWSxaHFm8W1haqFqsWTxauFsMWjRaJFqwWiRbCFtcWiBbYFowWjRbEFooWxBbFFtkWUxbZFi4WNBbcFrcW",
    "lhbdFpcWnxbNFsgWlxbdFpoWWxadFpkWeRb1Fd4WZRbIFs0WyBbHFs0WexbfFnoWfhbgFjoWnxbNFrkWZRbNFp8W3xZ7FuEW4BahFjoWOhahFs8W4hbjFrkW",
    "uRbjFvwV3BXkFqQWbRZsFuUWbBZtFuUWpxamFuYWpxbmFqYW0hbnFtMW6BbpFuoW6xZKFkkWqhbWFsAWrBaJFsIWwxbsFogWjBbYFu0WdBaPFo4WcxaKFosW",
    "jBbtFsUWxBbZFsYW2RZTFsYWLhZ1Fs8VVRavFu4WtBa1FtoW2hbvFnYW2ha1FvAW8Ba1FvEW8ha2FtsW8xaWFpoWdxadFlsWeBabFpQW9Ra4FtwW9RacFrgW",
    "9hbNFpwWkxZdFn0W+hb7FtAW3hb1FfwW3haeFnkW/hbLFsoW9ha5Fs0W/xbQFp0W0BagFvoW/Bb1FQAX/xaBFtAWNxaVFmMWARehFuAW4xajFvwVoxYCF7sW",
    "AhcZFrsWAheiFmgWAhdoFhkW1BbTFucWAxdDFr4WBBfDFq4WBResFsIW7BbDFgQXBReuFgYXrhaOFgYXihaPFqwWjhaPFgcX1xaLFooWBxePFooWihbEFggX",
    "CBfEFsYW2RYJFy4WsxayFrEW3RaWFvMWCxcKFwwXDRcOF94WzBYPF8oW3Ba4FrcWzRYQF8gWzRa6FhAX4RYSF98W3xZ7FnoW3xYTF3sWyxYPF8wW+RbgFn4W",
    "exaCFnoWnRYUF/8W/xb7FoEW+xagFoEW+xb6FqAWEBe6FgIXuhaiFgIXoxbjFgIXvBYWF/0V/hX9FRYXpRakFuQWvRa+FkIWvRZDFhcXFxdDFgMXGBfqFukW",
    "GRdFFqkWGRdEFkUW6RboFuoWGhfrFhsX6xZJFtUWBBeuFgUXwRbXFsIWwRatFtcWwhaJFgUXrRaLFtcWrBYFF4oWBReJFooW7BbYFogWiRbXFooWHBeOFgcX",
    "7RYHF8UWBxfZFsUWCRd1Fi4W7havFlUWshYdFx4XshYeFx0XHxcNFyAXHxcOFw0XyBYQFyMXJBclFyYXlBb9FvQWCxcMFwoXHxcgFw4Xkxb9Fl0W9hYqF7kW",
    "KxcsF/0WLRcuF/4WKhfiFrkWExcxFxIXExcyFzEXMxc0FzUXNhc4FzcXNBczFzkXNBc5FzoXNhc7FzgXOBc7FzwXvRYXF74WRBY/F6kWqRY/FxkXQBdBF0IX",
    "QRdAF0MX6hYYF+kWShbrFtUW6xYaFxsXqxbAFtYWjhYcFwYXRBccF4oW2BZFF0YX2BZGF+0WihYcFwcXCBdEF4oW7RZGFwcX2RYHF0YX7havFkcX+hZKF/sW",
    "YxZMF/cW/RYsF00X3xYSFxMXYxaVFkwX3hYAF54WLhctFywXKhdPF+IW/xZQF/sWABdRF/wWABdSF1EXEBcCF+IW4hYCF+MWPhdUFzwXvhYXF1UX5xZWF9QW",
    "VxdYFxgXVxcYF+kWQRdZF0IXWhdbF1wX0hZdF+cW6RYYF1gX6RZYF1cX1BZdF9IWGRdeF0QWRBZeFz8XQhdZF0AXXxdgF2EXYhdjF2QXYxdlF2QXYxdmF2UX",
    "7BZFF9gW2RZGFwkX7hZHF68W8hZoF7YWaRdqF84WzhZqF2kXKBdJFykXIBduFw0XIBcNF94W9hZrFyoXShdvF/sW+xZQF/oW+hZQF3AX+hZwF0kXSRdwFykX",
    "JhdxFyQXIxcQF08XJRdxFyYXchcrF/0WKhd0F08XTxd1FzAXMBd2FxEX/hYuF04X4BYvFwEXMBd1F3YXdxd4F3kXMxc1F3oXNRd7F3oXPBd+FzgXfxeAF1QX",
    "gRcVF4IXMxd6FzkXORd6F3sXPRd8Fz4XXxdhF4MXVheEF9QWvhZVFwMXWhcXF1sXhReGF4cXiBeJF4YXiBeKF4kXhheJFwQXBBeLF4YXjBeNF4kXBReLFwQX",
    "BBeJF+wW7BaOF0UXHBdEFwYXCBePF0QX2hZnF+8W2hbwFpAXthaTFyEXIBcNF24XaheUF2kXIBdpF5QXKhdLFyMX/BaYF94W/hYuFy0XJxeZFxQXJxeaF5kX",
    "3haYFwAXcBebFykXABedF1IXvBYVF1MXfBd9Fz4XfRd+Fz4XQRdDF1kXFxcDF6EXWxcXF6EXXxeDF2AXAxdVF6EXhBddF9QWohejF6QXhRelF4YXhxemF4UX",
    "jBenF40XBRcGF4sXjReOF4kXiReOF+wWjReoF44XRBepFwYXjheoF0UXRReoFwkXRRcJF0YXxhaPFwgXxhZ1FgkX2haqF2cXqhfaFpAX8BbxFqsXaReUF2oX",
    "JBesFyUXIBeUF2kX9Bb9Fq0X9xauF/gWJBdxF6wXKBevF0kXSRevF3AX/RZyF60XKhdrF0sXUBeSF3AX/haVFy4XIxd0FyoXIxdPF3QXTxeyF7MXEReyFzAX",
    "/BZRF5gXbRf8FlEXbRdRF3IXKxdyF5wXLRcuFywXcBe1F5sXEhe2F3MXghe5F4EXEhcxF7YXUxcVF7cXVBe6F7sXURdSF50XMhcTFzEXeRd4F3cXPxe8FxkX",
    "Pxe9F7wXXBe+F1oXVhe/F4QXWhe+FxcXFxe+F1UXWRdDF0AXZRfAF2QXZRfBF8AXiBeGF8IXZhfDF2UXpxfEF2UXpxeMF8QXiRfEF4wXihfFF4kXiRfFF8QX",
    "ixcGF8YXBhepF8YXxhfHF44XRBfIF6kXRBfJF8gXyRdEF48XqBfKFwkX8BarF5AXDRfLF24XDRduF8wX9xZMF64XIheRF2wXrhfNF/gWSRdwF5IXUBdvF5IX",
    "zxfQF9EXbRdRF/wWdBdPF7kXsxfSF08XUBeZF28XcBevF7UXKRfTF68XsReWF1MXdBe5F08Xdhd1F7IXdhe0FxEXmxfTFykXgRe5F7cXtRfUF5sXthcxFxMX",
    "gBe7F7oX1RfWF9cXXBdbF9gX5xZdF1YXGRe8F14XgxdhF9kXWxehF9oXZBfAF2IXYhfAF2MXYxfAF2YXiheIF8IXZRfEF9sXhRemF6UXZRfDF6cXpReHF4YX",
    "pRemF4cXixfcF4YXpxfDF40XxhfcF4sXjhfdF8YXjhfHF90XCRfeF8YWDRfMF8sXrBdxFyUXkhdvF0oXkhdvF+AXtBdzF+IXzRdMF/gWbxeZF5oXnBfkF+UX",
    "sRfmF5cXsRe4F+YXUxe4F7EXtBd2F7IXnReYF1EXuBe3F3QXuRd0F7cX5xfoF+kX6heCF7cXuReCF+oXnhfoF58XFhe4F7cX6xfXF9YX1xfsF9UX1RfsF9YX",
    "vxftF4QXXBfYF74XXRe/F1YXPxdeF70XgxfuF2AXYBfuF2EXhBfvF10X8BeiF/EXoxeiF6QXihfCF/IXwBfDF2YXZRfbF8EXihfzF8UX2xfEF/QX9BfEF/MX",
    "xRfzF8QXxhfdF/UX9RfHF8YXxxf2F90XjxfeF/cXjxfGFt4XyhfeFwkXSBf4F2wXaBfOF5MXrRffF/QWsBf5F/oXbBf4F2sX+xf8F7MX3xf9F20X+xezF+EX",
    "shf+F+EXrhf/F80X/RetF3IXABgBGAIYrxfTF7UX6RfoFwQYuRfqF9IXoBcGGJ4X0xebFwcYBBjnF+kXCBgJGLcXoBefFwYY1hcKGOsX1xcLGOwXDBgLGNcX",
    "Xhe8Fw0YVRcOGKEXWxfaF9gXDhi+F6EXoRe+Fw8YoRcPGNoXwBcQGBEYEBjAF8EXwBcRGMMXwhcSGPIXExgUGBUYhhcWGMIXhhfcFxYYyBcVGBQYyBf3FxUY",
    "wxcXGI0XyBfJF/cXFxioF40Xjxf3F8kXqBcXGMoX9hcYGN0XxxcYGPYX+BdIFxkYGhgbGBwYSBdLFx0YHxhvF5IX/xeuF0wXkhfgFx4YIBivFygXzxfRF9AX",
    "cxchGOIX/xdMF80XBxjUF9MX6he5F9IXcxe2FyEYIxiyF3UXChjWF+wXJhgnGCgYvBe9F14X2RdhF+4XKRgqGCsYLBiEF+0X7heDF9kXLRguGC8YMBgxGDIY",
    "LBjvF4QXMxi+Fw4YKhgpGDQYMxgPGL4XNRiiF/AXNhg3GBAYNxgRGBAYOBg5GDoY8hcSGDsYPBgTGDgYORg4GBMY8xeKF/IXFBgTGDwY8xc9GPQXwxfbF/QX",
    "9BfdF8MXwxfdFxcY9RfcF8YXyBc+GKkXPxjHF/UX3RcYGBcYPxgYGMcXFxgYGMoXQRhCGEMYkxfOF0EY+hdFGLAX+xfhF0YY/RdIGK0XshcjGP4XSRjSF7MX",
    "ShhLGEwYIRi2FwUYAxjqF00Y5BdOGCIY6xcKGNcXChjsF9cX7BcMGNcXDBhTGAsY7Re/FywYvBdeFw0YvxddF1QYVRhWGFcYWBhZGFoY7xdbGF0X8ReiFzUY",
    "NhgQGFwYNxhdGBEYXBgQGMEXExgVGDkYPRjzF14Y8xcWGF4Y2xfDFxEY8xcSGMIX8xfCFxYY9BdfGN0X3RdfGPUXxhdgGPUXFBg+GMgXxhepF2AYYBipFz4Y",
    "YBg+GGEYPxjKFxgYPxjeF8oXHBhjGBoYyxdEGG4XSBcdGBkYkxdlGM4X+BdmGB0Y+xdGGPwXsxf8F0kY/hdnGOEXSBhoGP0X4xciGGkY4xflFyIYSRhGGNIX",
    "RhjhF9IXShhMGEsY5BdpGE4YBBhQGOcXUBhsGAYYKBhtGG4YKBgnGG0YbhhtGCgYCxhvGOwXLBi/F1QYVhhVGFcYVRe+Fw4YKxhUGCkY2BfaF3AYcRhyGHMY",
    "VBg0GCkYWBhXGFkYMhgxGDAYWhhZGHQYNxg2GF0YNhhcGF0YXBjBF9sXORh1GDoY8hc7GHYY8hd2GPMXdRg5GBUY8xd2GBIYFRj3F3cYFhjcF18Y9RdgGHgY",
    "9xd5GHcYXxjcF/UXFBh5GD4Y9Rd6GD8YYBhhGHsY9xdhGHkY9xfeF2EYYRjeFz8YfBh9GH4YzBdEGMsXHRh/GBkYgBiBGIIYIRiDGOIX3xdIGP0X/Bd/GEkY",
    "AhiFGAAY/hcjGIYY/RdoGEgYhxiIGIkY4RdnGCMYSRiKGEYYRhiKGIsYIRgFGIwYihhNGGsYJBiOGI8YUhhRGIgYCBhrGAkY7BdvGAwYDBhvGFMYKBhtGCYY",
    "UxiQGAsY7heRGNkXDhi+F5IY2ReRGO4X2BdwGL4XXRdbGFQYVBhbGDQY2hcPGJMYXRhcGBEYERhcGNsXOhh1GDgYlBg9GJUYdRgVGDgYOBgVGDwYPBgVGHcY",
    "PRhfGPQXPBh3GBQYlhh4GGAYeBh6GPUXFBh3GHkYPhh5GGEYexhhGD8YlxiYGJkYlxiZGJgYfBh+GH0YGRh/GJoYmxiCGJwYQBifGGQYgBigGIEYRxiEGGUY",
    "QRhHGGUY/BdGGH8YrRdIGN8XARiFGKIY4heDGLQXgxiNGLQXARhqGIUYiRiIGKMYaxikGIoYUBgEGGwYjhimGI8YbhhtGKcYbhinGG0YJxgmGG0YbxiQGFMY",
    "CxiQGG8Ykhi+F6gYLhipGC8YLRipGC4YKhg0GCsYDhiSGDMYcBioGL4XLxipGC0YVxiqGFkYWxirGDQYWBiqGFcYWhiqGFgY2heTGHAYdhg7GBIYlRg9GJQY",
    "rBiWGK0Yexg/GHoYgBiCGKAYQxhCGIQYQRhDGIQYZRiEGEcYjBiyGLMY3xdIGLQY3xe0GLUYRhi2GH8YRhiLGLYYtxi4GLkYSRi8GIoYuBi9GL4YBBgkGGwY",
    "ThhpGCIYqBhwGJAYwhjDGMQYWRiqGMUYLBjGGO8XMRjHGMgY7xfGGFsYNRjJGPEXNRjwF8kYWhh0GFkY8RfJGPAXyhjLGJUYlRjMGMoYzBheGM0YzBiVGF4Y",
    "XhiVGD0YzhjPGNAYrRjRGKwYPRiVGNIYPRjSGF8YXxjSGBYYeBiWGNMY1Bh4GNMYrBjVGJYY1BjWGHgYYBh7GJYYeBjWGHoY1xiZGJcYmxicGNgYnBiCGNgY",
    "fxixGJoYghiBGKAYtRhIGN8XAhjaGIUYRxjcGIQYthhJGH8YtRjdGEgYhxiJGIgYthi8GEkY3RhoGEgYSBhoGLQYZxiGGCMY4RiMGAUYJBiPGOIYiBhRGFIY",
    "3xjjGOAYihilGLsYvBiLGIoYihikGKUY4himGI4Y4hiPGKYYpBjBGOcY6BjpGOoY6RjrGOoYkBhwGOwYVBjGGCwYcRhzGHIY7RjuGKkYVBjvGMYYKxjvGFQY",
    "wxjwGMQYxBjwGMIYWRiqGFoYMxjxGA8YDxjxGJMY8hjPGPMY9BjQGM8Y9RjVGKwYXhgWGNIY9hjUGNMY0xiWGNUYlxiZGNcY+Bj5GPoYfRj7GK4YmxjYGIIY",
    "/Bj9GP4YnxhAGGQYZhieGLEY2hgAGYUYZxiwGLYYiRgBGYgYsxjhGIwYiRijGAMZZxgEGYYYoxiFGAMZAxlRGIgY4xgIGeUYTxgKGQsZbBgJGY4YpBjnGOYY",
    "wRjmGOcY6BjqGA0Z6BgNGekYkBjsGKgY7RipGA4ZKxg0GKsYDxkQGREZcBgSGewYxRgTGVkYFBkVGRYZFxnxGDMYWRgTGaoYWxgYGasYzxgZGfMYzRgaGcwY",
    "0Rj1GKwYlRjMGNIYlhh7GK0YexjTGNUY0xh7GHoY/hgbGfwYnRgcGa8YHBihGNkYRxiEGB0Z/BgbGf0YtBgfGbUYAxkBGYkYhRgAGaIYZxiLGCIZZxgiGQQZ",
    "2xgeGbgYuBi+GL0YtBgkGSUZJhknGSgZBRgjGeEYURgDGSkZvxgMGcAYhRijGAMZ3xgqGeMYjhgJGeIYpRjmGMEYKxksGSUYJRgsGS0ZJRgtGSsZ7RgOGe4Y",
    "qBjsGBIZxhjvGOsYqBgSGZIYwhjwGMMYqRjuGA4ZKxirGO8YDxkuGRAZkhgXGTMYMRjIGMcYcBiTGBIZFBkvGRUZ8hgZGc8YyxjKGMwY0RgwGfUYyxjMGJUY",
    "zBgaGTEZXhgxGc0YMRnSGMwY9hgyGdQYzxjOGPQYzhjQGPQY1BgyGdYYrRh7GNUYMxl6GNYY0xh6GDMZ9xg0GTUZ+Bj6GPkYGxn+GDYZNxnYGDgZrhj7GH0Y",
    "GRiaGDkZORmeGBkYOhmJGCAZOhk9GQEZ2hiiGAAZtRgfGd0YPxm2GLAYsxhAGeEYKBlBGSYZthg/GUIZQBlDGeEYuBgeGb0YwBgMGQYZuxhGGUcZRxlEGbsY",
    "3RgfGbQYoxgHGQMZ6xhIGeoYSBnpGA0ZSBnrGOkYDhlJGe4YSBnGGOsYWxjGGBgZEBlKGREZ8hjzGBkZzRhLGRoZzRgxGUsZ0RhMGTAZ0RitGEwZ0hgxGV4Y",
    "rRjVGPUY0xgzGfYYMhkzGdYYTRkbGTYZThlPGVAZTxlRGVAZ/hj9GBsZHBn/GK8YnRj/GBwZUhkdGYQYUhmEGNwYUxmwGIYYUxk/GbAYVBkqGd4YRBm8GFYZ",
    "Qhm8GLYYVhm8GEIZvRgCGbgYtBglGSQZVxkpGQMZWhkDGQcZDRnqGEgZ6xjvGFsZXBkTGcUYkhgSGRcZLhldGRAZxRiqGBMZXhmrGBgZXRlKGRAZFxkSGZMY",
    "yBhfGRcZXxnxGBcZYBlLGTEZYRliGWMZUBlRGU8ZGxlNGTYZ/hgbGTYZZRk6GSAZPBlkGTsZQBmzGLIYBRlFGSEZ2xhmGWcZaBkDGVoZ3hjlGOMYVRlYGboY",
    "CBnjGOUYaRlHGUYZBxnkGFcZKxktGSwZCxkKGWsZSBnrGGwZSRkOGW0ZSBluGcYYSRlvGe4YDhnuGG8ZDhlvGW0ZwxjwGHAZDxlKGS4ZDxkRGUoZExlcGcUY",
    "FhlxGRQZchlzGcMYwxhzGfAYqxheGXQZFxmTGPEYdRl2GXcZdhnzGHcZeBkaGUsZGhl4GTEZ9hgzGTIZ9xhiGDQZeRlNGXoZehlNGTYZeRkcGU0ZNxk4GdgY",
    "TRl6GTYZUBlPGU4Z3Bh7GVIZfRl+GX8ZQhmAGVYZQBmBGUMZshhDGUAZAxloGQcZPxlTGUIZKRlXGYIZ4xgqGd4YRxlpGYMZbRmEGUkZ6xhbGWwZXBmFGRMZ",
    "xhhuGRgZqxhbGe8Yqxh0GVsZGBlbGV4ZwxhwGXIZ8BhzGXAZFxmGGcgYyBiHGV8ZFBlxGS8Z8xh2GXcZMRl4GWAZTBmtGPUYMBlMGfUYHBl5GYgZYRljGU4Z",
    "TxlOGXwZHBmIGU0ZThlPGXwZThliGWEZgBlCGYkZ2xhnGWYZIRlFGVkZQhkiGVYZQhlTGSIZJhlqGScZQRkoGWoZRBlHGWkZixmMGY0ZVxnkGIIZ5hiRGZIZ",
    "5xiRGeYY5hiSGecYbBluGUgZbhlbGRgZhRmVGRMZcxmWGXAZFxnxGIYZhxmXGV8ZmBlpGZkZPhmaGZsZnBmdGZ4ZaRmfGZkZgBmZGVYZnxlpGVYZVhmJGUIZ",
    "oBmhGSMZohmjGaQZghmlGSkZRxlWGWkZRxmmGVYZWhkHGYoZaRmnGYMZqBmpGb8YUxmqGSwZvxirGagZ5xiSGZEZlBmsGZMZSRmEGW8ZbxmEGW0ZdBmtGVsZ",
    "ShmuGS4ZyBiGGYcZXRkuGa8ZFhkVGXEZFRmwGXEZ8RhfGYYZdxl2GXUZFRkvGbAZTBmxGTAZLxlxGbAZshlMGTAZeRl6GYgZiBl6GU0ZNhm0GbUZthm4GbkZ",
    "fxm6GX0Zfxl+GboZPhmbGZoZnhmdGbgZmRmfGVYZIxmBGaAZQBlDGbsZUxmhGbwZjhmPGb0ZvhmBGSMZghnkGKUZRxmDGacZrBmUGb8ZkxmsGb8ZbhlsGVsZ",
    "wBnBGcIZExmVGVwZwxnEGcUZShnGGa4ZxRnHGcMZdBleGa0ZShldGcYZyBmXGYcZhhlfGYcZXxnJGYcZlxnJGV8ZMBmxGbIZSxlgGXgZtBk2GbUZYxliGU4Z",
    "nBmeGZ0ZyhnLGcwZzRnOGc8ZVhmfGYkZzBnLGcoZIRlZGVUZKRmlGdAZuxlDGdIZLBmqGaEZKRnQGZAZpRnkGJAZixmNGYwZ0xnUGdUZ0xnWGdQZbRnEGYQZ",
    "1RnXGZMZvxnTGZMZ0xnVGZMZ1hnXGdUZlBnXGdYZvxnWGdMZvxmUGdYZkxnXGZQZhBnYGW0ZWxnZGV4ZwRnAGcIZ2hnbGdwZcRmwGd0ZsRlMGbIZ3hnfGeAZ",
    "3hngGd8ZuhnjGX0ZnRmeGbgZmBmZGYkZHRlSGXsZmBnkGWkZoBmBGegZWhnRGWgZoRnpGbwZQBm7GYEZaRnqGacZnxmmGesZnxlWGaYZoxnsGaQZkRmSGe0Z",
    "hRlcGe4Z1BnvGfAZ1BnwGdUZ1hnvGdQZ1RnwGe8Z1RnvGdYZXBmVGe4ZwxnxGcQZLhmuGa8Z2hncGdsZxRnEGccZhxnJGcgZrRleGfIZcRnzGbAZlxn0GckZ",
    "mBmJGeQZfRnjGboZoBnoGaEZ5BnqGWkZpRn2GdAZnxntGYkZoRnoGekZ0hn3GbsZoxmiGewZWBlVGVkZkRntGfgZqhnpGaEZ+BntGZEZkRntGZIZbRnYGcQZ",
    "WxmtGdkZ/BnbGdwZcBmWGa8ZxxnxGcMZrxmWGf0ZsBnzGd0ZXhnZGfIZchlwGf4Zrxn9GV0Z3RnzGXEZchn+GXMZXRn9GcYZNBnhGfUZtxm2GeIZthn/GeIZ",
    "uRn/GbYZzRkAGs4ZnxnrGQEanxkBGu0ZvBkCGlMZgRm7GfcZphn4GesZUxkCGqoZpxkDGvgZjhm9GfkZBRoDGqcZ7hmVGYUZxBnYGYQZ3BkGGvwZrxkHGnAZ",
    "rhkHGq8Z/RmWGQcaxhkIGq4Z3BnbGQYalhkJGgcayBkKGpcZlhlzGQka8xmwGQsalxkMGvQZDRoOGg8auRm4Gf8ZARqJGe0Z6Bm+GekZqhkCGhIaqxn7GfoZ",
    "0BkTGpAZ6hkDGqcZqhkSGukZkBkTGqUZpxkDGgUaAxoUGvgZ7xkWGvAZFxoYGhka8BkWGu8ZcBkHGv4ZBxquGf0ZrhkIGv0ZChoMGpcZ/hkJGnMZ8xkaGrAZ",
    "sBkaGgsaDRobGhwaDRocGg4aDRoPGhsavBnpGQIa0BkRGhMa6xkeGgEa+BkVGusZHxogGiEa9xm+GegZAxoiGgUaAxrqGRQaIxokGiUawRkmGicaKBopGioa",
    "yRn0GSsaChoLGgwaKxr0GSwa8hktGv4ZCRr+GS4a/RkvGsYZGhowGgsa9BkMGiwaDBoxGiwa4RkyGvUZ9RkyGrMZ4RkQGjIa/xm4GTMaHxo6GiAaHxo7Gjoa",
    "IBo6GiEaOho8GiEaEhoCGukZBBo9Gj4aIRo8Gh8ajxn5Gb0ZQBpBGkIaQRoWGkIaFhpBGkMaRBomGkUaRBpGGkcaRBpFGkYaQRpIGkMaFhpDGkIaRhpJGkoa",
    "RhpFGkkaShpJGksaQxpIGkwarRlNGtkZ2xn8GQYaCxpOGk8aChpOGgsayBnJGQoaCxpPGvMZUBoKGskZKxpQGskZ2RlRGvIZ/hkHGi4aTxoaGvMZKxosGkwa",
    "8hn+GS4aCBpSGv0ZCBrGGVMa/RlSGi8aLxpTGsYZCxowGgwa/hktGi4aVBrfGVUaVBpWGt8ZGxpXGlgaHBpZGg4aWRoPGg4aMhoQGrMZ4xkdGlsauBniGTMa",
    "5RleGuYZ5RnnGV4aNBpfGuoZARoeGjYa6BlgGmEaOxpiGjoaOhpjGjwaXxpnGuoZPBpjGmYaaRr5Gb0ZvRn5GWkaAxoFGiIaJhpqGicaRBpHGmsaJhpEGmsa",
    "RhpKGkcaSxpsGkoaJhprGkUaSxptGmwabhpvGnAaJxomGsEZSxpJGm0aGBoXGhkaxxlxGvEZBxoJGi4aTxpyGhoaUhpzGi8aMBp0GgwaDBp0GjEa3xlWGlUa",
    "WBpXGhsaYRp3GugZExoRGmUaNBp9Gl8aHhoVGjYaexp8GhMafxqDGoAagBqEGoEagRqEGoUafBqFGnkaExp8GnkaeRqFGnoa9hllGhEagBqDGoQaJRokGoca",
    "axpHGkUaiBqJGooaQRqLGkgaShpJGkcaRxpJGkUabBpJGkoabBptGkkaiBr8GYkaQxqLGkIaKhopGigaKxpMGowa8hmNGk0arRnyGU0a8RmOGsQZThoKGo8a",
    "xBmOGscZKxqMGlAaLhqQGvIZLhoJGpAaLhpSGgka8hlRGi0aLhpzGlIaLBoxGpEaLRpzGi4aVRqSGlQaGxoPGhwaHBoPGlkaGxqTGlcaEBpaGrMZlBqVGpYa",
    "lhqVGpQa4hl1GpcaWxodGuMZehqFGpgahBqYGoUaOBpkGoIaPRoEGj4aaRqaGvkZQRpAGosaQhqLGkAacBpvGm4aTBqbGowaSBqbGkwaThqPGk8aTRpRGtkZ",
    "jBqcGlAaCBpTGp0akBqNGvIZChowGnIaChpQGjAaCRpSGpAaMBoaGnIaUBqcGjAaLRqeGnManxqgGqEaoRqgGp8aGxpXGqIaGxqiGpMa/xkzGnUaYRpgGnca",
    "NxpcGjgaHhp9GjUaHho1GhUaFRo1GjYaHhoVGoYaphqnGqgamhqnGqYaaRqpGpoaaRqqGqkaaRr5GaoaZxqrGiIaphqnGqwaphqsGpoaJRqHGiMaihqtGoga",
    "iBqtGvwZSBqLGpsaQxqbGosarhpNGq8aKhqwGikaQxpMGpsasRqOGvEZ8RlxGrEanRqyGggaTxqPGnIajBqzGpwajhq0GscZxxm0GnEachqPGgoajRqQGrUa",
    "Lxq2GlMaMBq3GnQaLRpRGp4acxq2Gi8aVhpUGlUalBq4GrkaMxq6GnUauxq8Gr0aNRp9GjQaeBpdGncamRpfGsQaHhqGGn0apBrFGsMapRrFGqQaIhqrGmca",
    "IxrGGiQaxxrIGskaahomGsoaJxrKGiYayxrMGrAazBrNGrAaTRquGq8aTBrOGpsarxpRGk0aTRqNGs8aTBosGs4aCBqyGlIazhqRGrMaLBqRGs4atRqQGtAa",
    "0BqQGrIanRpTGtEaUhqyGpAanBq3GjAanBrSGrcasxqRGpwanBqRGtMacxqeGrYadBrTGjEaVxqTGqIavhrUGsAadhrWGsIaxBrXGpkaxBrYGtcaXxqZGsQa",
    "2RraGj8afhrVGmgaqBqnGqYaXxrbGmcaqRrcGpoapxqaGqwa3RreGt8axhojGocayBrHGuAaJBrGGocayBrgGskarRqJGvwZyxrhGswarxpNGs8aKhopGuIa",
    "rxrjGlEanRrRGrIa0RpTGuQanBrTGtIatRrlGp4aMRrTGpEakhpVGuYaVBrmGlUalBq5Grga5xrpGugauxq9GrwaWxrBGuoa6xrqGsEa8BrXGtga2BrxGvIa",
    "2BryGvAa7BrvGu0a2BrEGvEaxBrXGvEaxBqZGtcaPxr0GtkaORr1Gn4aPxraGvQaORpoGvUaqhrcGqka3BqqGpoa9hr3Gvgaxxr5GuAaahrKGicaihr6Gq0a",
    "yxrNGuEasBrNGssazBrhGs0amxr7GowajBr7GrMaKhriGrAasBr8Gika0BqyGv0asRq0Go4ajRq1GlEaURq1Gp4atxr+GnQa5Rq2Gp4a/xoAGwEbARsCG/8a",
    "uhoDG3Ua5xrZGuka1xrwGgQb8RoEG/Ia8RrXGgQbfhr1GtUapxqoGgYb1Rr1GmgaCBsJGwobCRsLGwobDBsJGw0bDBsLGwkbDhsPGxAbERsTGxIbihqJGvoa",
    "FBsVG4kaFhsXGxgbrxoZGxobrxoaG+MarxrPGhkbGxscGx0bKRqxGuIa4xoeG1EaHBsfGx0bsRpxGiAbHhuNGlEa0BohG7UatRohG+UacRq0GiAb5RohG+Qa",
    "Uxq2GuQa5RrkGrYa0hrTGnQakhoiG1QavxrUGr4a8hoEG/Aa8BoEGyMboxrCGnYawBrUGr8a8BojGwQbfRrzGgUbdhrCGiUbJhsIGycbdholG9Ya1holG8Ia",
    "pxorG6gaqxosG9saDRsPGwwbCxsMGy0bDxsuGxAbEhsTGy8b3xreGjAbMRsyGzMbNBsaGzUbxxrJGjYbFhsYGxcbGhs3G+Ma+xqbGjgbsBriGvwazxqNGh4b",
    "0Rr9GrIa/RrRGh8bKRr8GrEa/Bq0GrEaHxs5Gx0btxrSGjobIRs7G+Qatxo6G/4aPBs9Gz4bPBs+Gz8bkhrmGiIbIhvmGlQa/xoCGwAbWxrqGsEaIxsEG0Ab",
    "IxtAGwQbBRtDG9saCBsKGycb2RpEG9oaRxtKG0gbqxrbGksbqxpLG0wbChsLGy0bCRstGw0bDxstGwwbTRtOG08bTRszG04bLxsTGxEbLhsOGxAb3RowG94a",
    "Nhv5GscaNBs3GxobyRr5GjYb4Br5GskaUButGvoaiRoVGxQbiRqtGvoaOBtRG/sa4xo3Gx4bmxrOGjgbGRvPGh4bzRpSG1Mb+xrOGrMaGxs5Gxwb0Br9GlQb",
    "VRv9Gh8bsRpWG+IaHRs5GxsbsRogG1Yb0BpUGyEbIBv+Gjob5Bo7G9EaIBu0GlcbIBtXG/4adBr+GtIaAhsBG1gbWRtaG1sbXBtdG14bAxu6Gl8bYRtiGwYb",
    "YhtkGwYbYxvvGu4aZRtEG9kaQhv0GkYbBhsrG6caYRsGGyobBhuoGiobLRsJGwgbLxsRGxIbMBvdGt8aZxtoG2kbMhsxG2obaxtsG20bNRs3GzQb9hr4Gvca",
    "URs4G24bURtvG/sabxvOGvsacBtxG1UbcRv9GlUbUhvNGlMbVhsgGzobOxshG1QbHxvRGjsbPRs8Gz8bPRs/Gz4bABtYGwEbWhtZG1sbdBt1G3YbSRt4G0gb",
    "SRt5G3QbdBt4G0kbdBt5G3UbQBtDGwUbBhtkGysbQBtLG0MbQxvzGtsaKRtBGwgbRxtIG0ob3BpmGyobDRstGw8bDxsOGy4bextnG2kbMxtqGzEbMxsyG2ob",
    "fBt9G34bbht/G1EbNRuAGzcbgRs2G/kaNRsaGzcb+hqtGlAbGhsZGzcbNxsZGx4bVRuCG3AbcRtUG/0aUhtTG4MbHBuEGx8bHBs5G4QbVhs6G4UbVBuGGzsb",
    "4hq0GvwaOhvSGoUbhRvSGv4aHxs7GzkbIhvmGocbXBteG4gbXBteG10bQBtzG4sbBRtzG0AbYRuMG2IbdhuNG44bYBt3G0IbdhuOG3QbdRuOG40bdRuNG3Yb",
    "Qht3G+kadBt5G3gbdRt5G44bdBuOG3kbBxvvGmMbeRtJG3gbQBuPG0sbLBtLG9saTxtOG00bTRtOGzMbextoG2cbkRuSG5Mb+hqUG1Ab+RovG5Ub+RqVGy8b",
    "+RqVG4EbNhuVG/kabhs4G38bURuWG28bOBvOGm8bUhuXG1MbcRuYG1QbhRuZG1YbHxuEG4YbVhuaG+IahRubG5kbghuGG1Qb4hqaG7Qa/hqbG4UbORs7G5wb",
    "IhudG+Ya5hqdG4cbAhueGwAbYhuMG2QbnxtyG0MbeBtJG0gbQBufG48bKBt6G5AbQhtGG2UbZBuMGysbRRugGyQbYRsqG2YbYRtmGysbLBtMG0sbfBuhG30b",
    "axuiG2wbahujGzMbbRtsG2sbpBtxG6Ubbxt/GzgbVRuGG4IbVRsfG4YbVhuZG6YbmBuCG1QbVhumG5obORucG4Qb/hpXG5sbtBqnG1cbqBupG6obAhtYG54b",
    "XBuIG14bAxtfG6sb6Rp3G2AbJBusG0UbihutG48bQBuLG58bJBugG6wbnxuuG48bnxtDG64bahszG6MbkhuvG5MbkxuvG7AbsRuyG7Mb+hpQG5Qbfht9G3wb",
    "NhuBG5UbpBulG7QbcBuCG5gbtRu2G7cbgxuXG1IbmRubG7gbgxu5G5cbgxuaG7kbmhumG7kbhBucG7obphtXG6cbOxuGG5wbmhuDG7QaABueG1gbuxu8G70b",
    "ihu+G60bvhu/G60brhvAG48bQxvAG64bSxvAG0MbLBvBG0wbLBvCG8Ebwxt7G2kbaxvEG6IbNRvFG4AbLxvGG5UbLxuVG8YbaxtsG8QbohvHG2wbURt/G8gb",
    "NRs3G4AbyRt/G5YbfxtvG5YbpRtxG6QbcRtwG5gbmRu4G8obghvLG8wbghuGG8sbhBvNG4YbuhucG84bphunG7kbphubG1cbgxvPG7QatBrPG6cbqRvQG6ob",
    "0RuIG9IbvRu8G7sb0xvUG9UbiRu+G4obixtzG58bcxvWG58b1xvYG9kbnxvWG64bnxuuG3Ib2ht7G8MbexvbG2gbaBvbG9wbaBvcG2kboRt8G30bohvEG8cb",
    "kRuTG5IbrxuSG7AbsxuyG7EbURvIG90bNRuAG8UbbBvHG8Qb3RuWG1EbtBulG6QbzRuEG94btRu3G7YbuRvfG5cbmRvKG6YbzBuGG4IbuhvOG4QbyhubG6Yb",
    "UxvPG4MbhhvNG5wbnBvgG84bIhuHG50bvhuPG78bjxutG78bwRvCG+MbwRvCG0wboRvkG+Ub5BuhG+UbwxtpG9wbkxvmG5Ib3RvJG5Yb3hvnG80bhBvoG94b",
    "zhu2G+gblxvfG+kb6BuEG84byhu4G5sblxvPG1MbzRvgG5wbqBvQG6kbqhvQG6gb1BvqG9UbvBu7G9Qb0xvqG9QbAxvhG4kbihuPG74bvhu/G+sbwBvBG64b",
    "wxvsG9obkxuwG+0b7hvcG+8bohvHG/AbxhvxG5UbohvwG8cbyBvJG90byBt/G8kb8hvLG/MbyxvyG8wbthv0G+gbthvOG/UblxvpG88b3xu5G6cb9hv3G54b",
    "+Bv5G/ob0Rv7G4gb0RvSG/sbvBvUG7sb1Bv8G+ob6hvTG9UbiRvhG/0bcxv+G9Ybvhv/G4ob1xsAHNgbiRv/G74bvxu+G+sbrhvjG8AbrBugG0UbrhvBG+Mb",
    "7BsBHNobwhvBG+MbwxvcG+wb7BvcGwIc7hsCHNwbkxvtG+YbtBsDHKUblRsEHMYb5xveGwUcBhwHHOkbyxuGG/Mb6RvfGwYc9Bu2Gwgc6RsHHAkczBsKHIYb",
    "zRsLHOAb3xunG88b4Bv1G84bDBwNHA4c0hsPHPsbiBsPHNIbihsQHKsb2RsAHNcb2BsAHNkbrhvWGxEcchuuGxEcwBsVHMEb2hsBHHsbFhwXHBgcFhwYHBkc",
    "2xsaHBsc2xsbHNwbkhvtG7AbxBscHB0clRvxGwQc9BsIHB4c8xuGGwoc3hvoGwsczRvnGwsc6RsJHM8b6BvgGwsc6Bv1G+Ab+xsPHIgb1BvqG/wbHxwgHAEc",
    "4xvBGxUcABwhHBkcABwiHCMcABwZHCIcJRwmHOwbJxwoHCkcARwaHHsbFhwqHBccexsaHNsb3BsbHO8bxhsEHPEbxxsrHPAbxxvwGywctBulGwMcLRz0Gx4c",
    "LRwuHPQbBRwvHOcbBhzfGzActhv1GwgcMBzfG88bDBwxHA0cDBwOHDEc0BsyHDMcMxwyHNAbnhs0HPYbnhv3GzQc9hs0HPcbIBwfHDYcIBw3HBocARwgHBoc",
    "ARwmHB8cARzsGyYcJRw4HCYcGBwiHBkcAhw5HOwbFxwqHDocAhw7HDkc5hvtGzwcFxw6HD0ckhvmG+0bxBs+HBwcHRw+HMQbPxxAHEEcBhxCHAccBRzeG0Mc",
    "LhzoG/QbCxznGy8cCxwvHN4b9RtEHAgcCRwwHM8bqxsQHOEb/hsQHNYb4hsRHP4bABwjHCEcNhw3HCAcRRxGHEccExxIHBQcIRxJHBkcJRxKHDgcFhxLHCoc",
    "KBwnHEwcSRwWHBkcJRzsG0ocORxKHOwbFxxNHBgcGxw7HO8bAhzvGzsc7hvvGwIcQxwvHAUcQxzeGy8cBxxOHAkcChzMG/MbLhxEHOgb9RvoG0Qc+hv5G08c",
    "+BtPHPkbEBw1HOEb/xv9GxAcIRwjHEkcRRxHHEYcSRwjHCIcJBwTHBIcKRxQHCccURw7HBscGxxSHFEcPRw6HCocKhxNHD0cGhxSHBscQxxTHFQcVRxWHFcc",
    "LRweHFYcVxxWHB4cHhwIHFccQxwvHFMcBhwwHEIc+BtYHE8c/hs1HBAcERxZHP4bFBxIHCQcSxwWHFscExwkHEwcGBxNHCIcKBxMHFAcKBxQHCkcURxcHDsc",
    "5hs8HO0bKxzHGywcXRxeHFUcVRxeHFYcQxxUHC8cHRwcHD4cLRxWHC4cBxxfHE4cQhwwHE4cCRxOHDAc9xtgHDQc9xs0HGAc+hthHPgb+BthHFgcYhxjHGQc",
    "4RtlHP0bNRxaHOEbHxw3HDYcRhxmHEccHxwmHDccShxnHDgcSRxoHFscFhxJHFscORxpHEocIhxrHGocNxxsHBocGhxsHFIcXBw5HDscKxwsHG0cbhxfHAcc",
    "KxwsHPAbPhxvHBwcPhwcHHAcBxxCHG4cQRxAHD8cVxwIHFYc8hvzG3EcCBxEHFYcLhxWHEQc8htxHMwb8xvMG3EcMRwOHA0cMhxyHDMc+htPHGEc/htzHDUc",
    "4RtaHGUcRxxmHEYcOBx0HHUcSRxqHGgcNxx2HHccJhx1HHYcRhx4HGYcOBx1HCYcZxxcHFEcSxxbHCocZxxRHFIcKhxbHE0cIhxNHGscbRwsHHkcPhx6HG8c",
    "KxxtHCwcPhxwHHocXhxXHFYcHBxvHHAccRx7HPIbVBxTHC8cDhx8HA0cNBxgHH0c/ht+HHMcWRx+HP4b/Rt/HBAccxyAHDUcRhyCHHgcTBxQHIMcNxx3HGwc",
    "ShxpHGccaRw5HIQchRyGHIcchxyGHIUcTRxbHGscexxxHIgcVRxXHF4cQhxOHG4c8ht7HHEcMxxyHIkcWRyAHH4cihyLHIwcdxx2HI0cjBxoHGocdRyOHHYc",
    "dxyPHGwchBw5HFwcZxxSHHUcXRyQHF4ckRySHJMcehyUHJUcXRxVHJAclhyXHJgcmRyaHJscnByZHJ0cnByaHJkcehyVHG8cXhyQHFUcDhyeHHwcnxygHE8c",
    "NByhHGAcTxxYHJ8c/RtlHH8cWhyiHGUcEByiHFocdhyjHI0cdhykHKMcOBylHHQcOBxnHKUcjBxqHKYcpxyoHKkcZxxpHFwcWxxoHGscdRxSHI4cUBxMHIMc",
    "eRwsHG0cehxwHG8cbhxOHF8cnBydHJocWBygHJ8cfRyhHDQcjByLHIocdBytHHUcghxmHHgcrBxrHGgcdhyOHKQcrhyvHLAcrxyuHLEcahxrHKYcjhxSHGwc",
    "aRyyHFwchBxcHLIcmByzHIccmxy0HJkckRyTHJIcehxvHJQciBxxHHsctRy2HLccMxxyHDIctxy4HH0cTxxYHGEcTxygHFgcZBy5HGIcYhy5HGMcYxy5HGQc",
    "cxx+HKocixyrHIwcuhyCHLscrRylHHUcvByEHLIcjhxsHI0cZxx1HKUcqBynHKkcvRy+HL8cmBzAHJYcmxyaHLQcwByXHJYcmhydHJkcDRx8HA4cfByeHA4c",
    "fByeHMEcchzCHIkcthy4HLccWBzDHGEcYRzDHFgcwxzEHFgcxRx9HLgcfRzFHKEcxhzHHMgcoxykHMkcfxzKHKIcyxzMHM0cdxzOHM8cuxzQHLocdxzPHI8c",
    "hBzRHGkcghy6HLscpxypHNIc0hypHNMcpxzSHKkcrBzUHGscphzVHIwc1hywHK8crxyxHNYc1xxsHI8c2BzZHNocvRy/HNschxzAHJgc2BySHNkc2BzZHJIc",
    "3BzdHN4clxzAHJgcmhyZHLQclRyUHG8ciRzfHDMc3xxyHDMcYBzgHH0c4BxgHKEcwxxYHOEcoRzFHOIcuRxjHOMcZRyiHOQcyRyNHKMc0RyEHLwcgBzQHOUc",
    "dBylHK0cqhzQHIAcjBzVHIsc5hznHNIc5hzSHOgc6RzSHNMc6RzoHNIc0xypHOoc6RzTHOoc6hznHOYc6hypHOcc5xypHNIcjRxsHNccaRzRHLIc1BymHGsc",
    "6xzZHNgc3hzdHOwcvRy/HL4c3hzdHNwcfBzBHO0cfBztHJ4ctxx9HO4cthzFHLgcfRzgHO4cchzvHPAcoRziHPEcuRzjHGMc8hzzHPQcZRz1HPYcZRz2HH8c",
    "ohz3HOQcfxz2HMocyhz2HKIcgBzlHH4czhz4HM8c+Rz6HPsc/BzUHKwc+RzmHOgc6Rz5HOgc6hz5HOkc6hz9HPkc+Rz9HPocjhzJHKQcjhyNHMkc0ByqHOUc",
    "0By7HLoc6hzmHP4c6hz+HP0czRzMHMsc/xwAHdscAR0CHQMd1hyxHLAc2xwAHb0c2hzZHOscBB0FHewctxzuHLUc7hy2HLUc3xyJHMIcchzfHO8cthzuHMUc",
    "4RwGHe8cchzwHMIc7xwGHfAcoRzxHAcd4RzEHAYd4RxYHMQcxBzjHAgd4hwJHfEcxhzIHMccxxzIHAodCh0LHcccyBzHHAsdDB38HKwcDR0OHXQcdBylHA0d",
    "rByrHAwdDh2lHHQc5RwPHX4cfhwPHRAd+xwSHRMdixzVHBEd+hwSHfscjRzXHM4c0Ry8HLIcFB0VHRYd/Rz+HOYcFx0YHRkd6xwaHdkc7xwbHeEc4BwcHe4c",
    "7hwcHR0d7hwdHcUcxBzDHOMcHR0eHcUc4hzFHB4d4xwfHQgd4xwgHR8d8RwJHSEdIh0jHSQd8hz0HPMcqhx+HBAdEB0PHSUd+xwTHRId+xwSHfkc1Bz8HKsc",
    "qxwmHdQcEh0nHeYc+RwSHeYc/RwnHRId/RwSHfoc5hwnHf0c2xwoHf8c1BwmHaYc1RymHCkdGR0YHRcdAB0oHb8c2xy/HCgdvRwAHb8cAx0CHQEd3hzsHN0c",
    "7xzfHBsd4BwHHSsdoRwHHeAc8RwhHQcdxBwIHQYd4hweHQkdCh3IHAsdCh0sHQsdIh0kHSMdLR0uHRAdqxz8HAwdLx2lHA4dEB0uHaocqhwuHeUcMB0lHQ8d",
    "ER0mHascgRwxHTIdMx0xHYEcMx2BHDQdNR02Hdocjxw3HdccsBw4HdYcAB3/HCgd6xzZHDYd7BwqHQQdnhztHMEcGx05HeEcwxw6HeMcBh3CHPAcBx0hHTsd",
    "Ox0hHTwdHh0dHT0dHh09HSsd4xw+HSAdCB0fHQYdCR0/HSEd9hz1HEMdpRwvHQ0dQR34HEIdRB1FHUYdJR0wHQ8dSB0DHUkd5RwuHQ8dGR0YHUodSx1MHU0d",
    "FR0UHRYdzxw3HY8cTh1PHVAdNR3aHEgd1hw4HVEd2hw2HUgdGh1SHdkcHB3gHCsdUx0dHRwd4Rw5HcMcOh0+HeMcwxwGHTodPh1UHSAdIR1VHTwdCx1WHQod",
    "IR1XHVUd9BxYHVkdRB1GHVodIx1bHUAdRB1aHUUdQR1CHfgcQh03Hc8c+BxCHc8cER3VHCkdzhzXHEcdSx1cHUwdNR1dHTYd1hxRHbAcTx1OHVAdUR04HbAc",
    "SB02HV0d2RxSHTYdKh0FHQQdKx1THRwdGx1eHTkdUx09HR0d3xzCHBsdXx0+HTodBh05HRsdBh0bHcIcwxw5HQYdBx0JHSsdKx0JHR4dYB0JHQcdBh0fHTod",
    "YR0fHSAdLB0KHVYdYh1XHSEdVh0LHSwdYx3kHPccWB30HFkdWh1GHUUdQh34HEcdZB0RHSkdZR0lHQ8dZB0mHREdMR0zHTQdZR0PHS4dZh0WHRUdNR1IHV0d",
    "MR00HTIdTB1LHU0dBR1nHSodaB1pHWodaB1rHWkdaB1sHWsdYB0HHTsdOx08HWAdOh1tHW4dOh0fHW0dYB1vHQkdbx0/HQkdHx1hHW0dVB1hHSAdPx1iHSEd",
    "Dh0NHS8dcB1xHXIdcx0THXQddR1kHXYdJB1bHSMdQh1HHXcdSR33HEMdeB0uHS0deR1mHRUdFR16HXkdZB0pHXYdLh18HWUdeB18HS4deh0VHRYdfR0ZHUod",
    "Rx3XHDcdfh1/HYAdfh2AHYEdgh2BHYMdSR0DHUgdZx0FHX8dfx0FHYAdhB04HVEdBR0qHWcdbB1oHWsdXh0bHYYdXh2HHTkdOR2HHYgdGx05HYcdPR2JHSsd",
    "PB1vHWAdPh1tHWEdPh1hHVQdVR2KHTwdPx1vHYsdPx2LHWIdLx2MHQ4d9xx4HWMdLR2NHXgdJR1lHY0dDB38HI4ddB0THY8dgh2DHZAdXB1LHYUdGR1KHRgd",
    "BR2RHYAdgB2RHZIdgB2SHYEdhB2THTgdOB2UHVEdaR1qHZUdGx2HHYYdOR2WHYcdOR2IHZYdOh1uHV8dPB2KHYsdVB1hHZcdVB2YHVYdLB1WHZgdVh1hHVQd",
    "VR1XHZkdVh0sHZodVh2aHWEdWh1GHZsdVx1iHZwdLB2YHZodQB1bHSQdcx10HY8dmB2dHZod9RxjHUMdYx2eHUMdWB2dHVkdWR2dHVgdeR2fHWYdKR2gHXYd",
    "KR2dHaAdKR2hHZ0deB17HaIdXB2jHUwdQh1bHTcdRx03HXcdfh2CHaUdGR19HUodKR0mHaEdgR2mHYMdgx2mHZAdfx2RHWcdfx2SHZEdfx2kHZIdkh2kHYEd",
    "BR1nHZEdaR2VHWodah1rHWgdaR1rHWodUx0rHacdlh2IHYcdPh2oHW0dbR2oHW4dPB2LHW8dVR2pHYodqR1VHaodDB2OHfwcmB2rHZ0dJB1bHZwdcx2PHRMd",
    "cR1wHXIdJB2cHVsdSR1DHZ4deR2sHZ8dnh2uHUkdnR2vHZoddx2tHbAdSR2uHbEdfB2yHWUdZR2yHY0ddR12HWQdnR2hHa8dWx2zHTcdNx2tHXcdZh16HRYd",
    "pB2lHYEdgR2lHaYdth09HVMdKx2JHacdXx2oHT4dix2KHbcdVB2XHZgdix24HWIdVR2ZHaodmh2vHWEduR26HXMdVx2cHZkdWh2bHUYdDh2MHS8duh2PHXMd",
    "qx27HZ0dux2gHZ0ddx2wHa0dvB29Hb4dYx14HaIdnB2zHVsdvB2+Hb0dnx16HWYdoB2/HXYdfB3AHbIddh2/HWQdNx3BHa0deB3DHXwdox2FHUwdsx3BHTcd",
    "xB3FHVIdUh21HcQdUh20HbUdUx2nHbYdXh2GHYcdXx1uHagdYR3GHZcdqR2qHccdYR2vHcYdyB3JHXAdmx1GHcodDB2OHcsdyx2OHQwdYh3MHZwdmx3KHUYd",
    "nB1bHZkdoB3OHb8dnB3MHbMdWx2tHc8dzx2tHcEd0B3RHdIdhR2jHVwdZB2/HSYdah3UHZUdth2JHT0dih2pHbcdlx2rHZgdcx2PHdUd1h3XHdgdux3ZHaAd",
    "Wx3aHZkdoh2NHcAd2x3cHd0dXB3eHaMdWx3PHdodrh2eHcIdoh3fHWMd4B3hHeIdoh17Hd8dfB3jHcAdJh2/HaEdah3lHdQdlR3lHWodtx3mHYsdqR3HHbcd",
    "5x3oHekduB2LHaodlx3GHasduB2qHWIduR1zHdUdYh2qHcwdfR3qHesdcB3JHcgdxh2vHasdoB3ZHc4dqx2vHbsdzR3sHZ4d4h3hHe0dnh3sHcIdjR2yHcAd",
    "nx2sHXkdnx15HXod4h3hHeAdrh3CHbEdwR3vHc8deB3AHcMd0B3SHe4d3R3cHdsdrx2hHfAdex3sHdMdfB3kHeMdlR3UHeUdbh3xHagd8h3zHfQd9R3pHfYd",
    "9R3nHekd5x33Hegdxx2qHeYd5h2qHYsduh3VHY8d+B33Hbsdux33Hdkd3R3cHfkd2B3XHdYdYx3fHc0d6x3qHX0dux2vHfAdqh2ZHcwd2h3BHZkdXB2jHd4d",
    "7R3hHeIdmR3BHcwdzB3BHbMdwB3fHcMd+h3wHb8d7h3SHdEdoR2/HfAdxB21HcUd+x3kHcMd/B39Hf4d/x0AHoYd8R1uHQEe5h23HQIexx3mHbcd6B31Hekd",
    "1R0DHrkd6B33HfgdyB0EHgUe+B0GHugd1x0HHtgd+B27HQYeCB4JHgoeCx4MHt4d3x3jHc0d1B0NHuUdth2nHQ4eAB4PHoYdhh0PHv8d8R0BHqgd8h30HRAe",
    "qB0BHm4d6B0GHvUdER7aHRIeyx0THgQeFB7aHREeFR4WHhceyB0FHgQeBx4YHtgd1x3YHQceCx4ZHgweGh4bHqwdCR4IHgoeux33HQYeFB4cHtod9x3wHdkd",
    "8B33Hbsd2h0cHsEdzx3vHR0ezR0eHuwd3x37HcMd5R0NHtQd/R38Hf4d/x0PHgAeEB7zHfId6R31HfYd5h0CHrcd5x31HQYeBB4THgUe5x0GHvcdIB7rHeod",
    "uR0DHrodBB4THssd2B0YHgceGh6sHRsezx0dHtod7R0hHiIeIx4hHu0d3R35Hdwd7R3hHSMe4R3tHSMe3x17HSUe3x0mHvsdex3THSUe0x0nHiUeDh6JHbYd",
    "Dh6nHYkdEB70HfMdAh63HSgeKB63HQIeKR4qHiseEh4UHhEeGB4HHiweLR4qHikeAx7VHbodGR4LHgweLh75HdwdDB4LHt4dIx7tHSIeLx6/Hc4d+h2/HS8e",
    "MR4wHuMdMh7sHR4e4x3kHTEeMR7kHTMe+x0zHuQdNh43HjgeOR46HhkeIB7qHesdEh4cHhQe2h0dHhIeFx47Hh0ePB7OHT0ezh3ZHT0ePB4vHs4dLh7cHfkd",
    "HB4dHu8dIR4jHiIeHB7vHcEdHh4+HjIePx5AHjAeJx7THewdMB4xHkEeMB5BHj8ePh40HjUeQB4/HkEeOR4ZHjoeLB4HHhgeKh4tHiseBB4FHhMeEh4dHkIe",
    "Ox5CHh0eEh5CHhweFx4WHhUe2R3wHT0eQx5EHkUe7B0yHiceJx4yHiUe+x0mHjMeRh5HHkgeQh5JHhIeOx5KHkIeFx5LHjse8B36HT0eHR5LHhceRR5MHkMe",
    "HR4cHkseTR4kHk4eTR5PHiQeTx4fHiQeRB5QHkUeHh4fHk8eQx5RHkQeUB4+Hh4eQB5SHjAePh5THjIeNR5UHj4eVR5WHlceEh5JHlgeWB5ZHhIeWR5CHhIe",
    "Wh5CHkoeWx4uHvkdXB49HvodXR4eHlMeTx5THh4eMR5eHiQeUh4xHiQeXx5SHkAeUx4+HlQeVx5WHlUeDh5gHmEeYh5jHmQeKR4rHmUeWB5JHmYeZR4tHike",
    "OB43HjYeWx4uHmcePB49HmgePB5oHmkeZR4rHi0eLh5bHvkdaR5qHjweQh5aHkseOx5LHkoeax5sHm0eah4vHjweQh5LHhweXB76HS8ebh5tHmweTB5QHkMe",
    "TB5FHlAeTh4kHl4eXx5AHlIeUh5BHjEeUh5AHkEeUB5vHj4ecB4mHjIeNB4+Hm8eUx5UHjIeMh5UHnAeMR4zHnEeNB5yHlQeVB5yHnAeMx5zHnEedB51HnYe",
    "SB5HHkYedx4CHigeeB55Hnoeex58HkoeaB49Hn0eWR5JHkIeeR54HnoebR5uHmseah5cHi8eUB5RHkMeXR5vHlAeUx5vHl0eJh5wHjMeMR5xHl4eNB5vHnIe",
    "Mx5wHnMeYR5gHn4eDh5hHmAefx6AHoEeSh6CHloefB6CHkoeSh58HnseSh6CHnweLh5bHmceXB59Hj0eSh5LHoIeTR5OHoMeTR6DHk8eXh6EHk4eUx5yHm8e",
    "YR5+HoUeYB5hHn4eKB4CHncehh6HHogeYh5kHmMegB6JHooeZh6LHlgeXB5qHn0ebh5sHmseTh6MHoMejR6OHl0ejR5dHo4ebx6OHl0ebx6QHo4eTx6PHlMe",
    "XR6RHm8eYR6FHn4edB52HpIedR6SHnYegB5/HpMegB6JHpMegB6THoEeiB6HHoYeWB6LHlkeih6JHoAeSR5ZHmYeZx6UHlseaR59HmoeaB59Hmkegh6VHloe",
    "Wh6VHkseaR5qHpYeSx6VHoIeTh6EHowelx6YHowejx5yHlMeXh5xHoQech6ZHnAecB6ZHnMemR5xHnMedB6SHnUegB6THpoegB6aHokekx5/HoEeWR6LHmYe",
    "Zh6LHpsenB5qHmkeaR6WHpweWx6UHmcemB6XHp0ejB6YHp4eXR6OHpEejx6fHnIehB5xHqAehR6hHn4eZh6iHoseZh6VHqIeZh6bHpUeah6cHpYejh6jHo0e",
    "jB6gHp8ejh6QHpEehB6gHowenx6ZHnIeoB5xHqQemR6kHnEepR6mHqceqB6pHqoeix6iHqsenB6WHqwerR6uHq8erR6vHp0efh6hHoUekh6wHnQesR6yHrMe",
    "sx6yHrEekx6JHpoetB6UHrUeqx6bHosemx62HpUetx64HqMeox64Ho0ejR64Ho4enR6XHpgemB6XHp4enx65Hpkeuh67HrwesB6SHnQepx6mHqUevR6+Hr8e",
    "wB7BHsIewx7EHsUevR6/Hr4elR62HqIenR6vHq0enB7GHpYexx6fHsgenx6gHsgeyR6mHsoeqR6oHqoeoh6yHqserB6WHsYerR6vHq4euB7LHo4enx7HHrke",
    "uh7MHs0euh7NHrseph7JHsoezh6HHs8ezh7PHocexR7EHsMe0B7RHtIesh6iHsIe0R7QHtIelB60HtMe1B7VHqwerB7VHpweqx62Hpseoh62HsIetx6jHsse",
    "jh7LHqMeyB7WHsceyB6gHtceuh67Hs0euh7NHsweuh68Hrsekh7YHrAekh6wHtgetR7THrQesh7CHqserB7GHtQewR7AHsIetx7LHrgenB7ZHsYeyB7XHtYe",
    "oB6kHtcemR65HtoemR7aHqQe2x67Hs0e3B7dHt4e3h7dHt8eqx7CHuAelB7THrUe4R7iHr4evh7iHtUe1R7ZHpwe1h7XHuMe1h65Hsce3x7dHtwe3x7cHt4e",
    "tR7kHtMevh7lHuEevh7VHuUe2B7mHrAe5x7oHuke6h6pHuseqR7sHuse6h7sHqke7R7uHu8e7x7uHvAetR7THvEeqx7gHrYe8h7gHsIe1B7zHtUe4h7lHtUe",
    "th70HsIe4x71HtYe4x7XHvYe1x6kHvYezR67Htse9x7mHtgesB7mHtge+B7dHvke5B61HvEe8B7uHvoe7R77Hvwe7R78Hu4e/B79Hu4e+h7uHv0e/B77Hv4e",
    "/B7+Hv8e/B7/Hv0e4B7yHv4e9R4AH9YeAB8BH9Ye1h7aHrke9x7YHgIfAx/qHuseBB8FHwYfBx/vHvAeBx/wHvoeCB/kHvEeCR/tHu8eBx8JH+8eBx/6Hgkf",
    "CR//HvseCR/7Hu0eCR/9Hv8eCR/6Hv0e+x7/Hv4e/h7/Hgof/h4KH/8eCh/gHv4e8h4KH/4e4B70HrYe9B7yHsIeCx/1HuMeDB/jHvYeDR8OHw8fDx8OH/Ye",
    "AR/aHtYeEB8RH9weEB/cHgMfEh8THxQfEx8SHwQf6R7oHuceBB8UHxMfBB8SHxQf5B4IHxUf8R7THggf4R7lHhYf8x7ZHtUeCx/jHhcfCx8AH/UeDR/2Hg4f",
    "9h6kHg8fpB7aHg8f5h4CH9ge6h4DH+seBB8GHwUf6h7rHuwe+R7dHvgeCB/THhUf4B4KHxgf0x7kHhUf4B4YH/Qe8h70Hgof9B4ZHwof2R7zHhof1B7GHhsf",
    "2R4aHxwfHB/GHtke9h4NHwwf9x4CHx0f9x4dHx4f9x4CH+Ye3B4RHwMfHx8gHyEfHx8iHyAf8R4jHwgf8R4IHyQf4R4WHyUf4R4lH+Ie4h4lH+Ue5R4lHxYf",
    "Fh8aH/Me1B4bH/Mexh4cHxsf4x4MHxcfDB8NHyYfDB8BHwAfDB8mHwEfER8QHwMfHx8hHyIfFR8nH+QeCh8oHxgfKR8oHwof5B4nHxUfCh8ZHykfCx8qHysf",
    "Cx8sHyofLR8XHy4fCx8XHywfJh8uHxcfJh8NHy4fLx8wHzEfEx8yHzMfNB81HzYf8R4kHyMfIx8kHwgfGB8oHzcfNx84HxgfOR8rHzofGB84H/QeLR8uHzsf",
    "LR8sHxcfCx8XHwAfAB8XHwwfDx88Hw0fPR/aHgEfPh/3Hh4fNh8/HzQfKR8ZH0AfNx8oH0EfKx8qHzof8x4bHxYfGR9CH0Mf9B44H0If9B5CHxkfKx8qHwsf",
    "Cx8qHxcfDR88Hy4fJh89HwEfRB9FH/ceRB/3Hj4f9x5FHwIfMB8vHzEfIB8iHyEfQB8ZH0MfGx9GHxYfJR8aHxYfGh8lH0cfKx9IHyofGh9HHxwfFx8qHywf",
    "SR9KH0sfHR8CH0wfQB9NHykfNR8/HzYfQh9BHygfOh9IHzkfJR8WH0YfKh9IHzofOR9IHysfOx9OHy0fLR9OHywfLh9PHzsfLh88H08fFx89HyYfPB8PH1Af",
    "2h49Hw8fSx9KH0kfTB8CH0UfTB9FH0QfEx9RHzIfEx8zH1EfUh83H0EfKR9NHygfJR9GH1MfPx81HzQfUx9UHyUfGx8/H1UfKB9DH0IfGx9VH0YfQh84H0Ef",
    "Gx9VHz8fJR9UH0cfHB9VHxsfOx9PH04fLB89HxcfPR9QHw8fVh9XH1gfMx9ZH1EfMh9RHzMfUh9aHzcfNx9aHzgfTR9DHygfHB9HH1UfWx9cHywfLB9OH1sf",
    "Th9PH1sfXR9eH18fVh9YH1cfRh9gH1MfQR84H1ofQB9DH00fVR9HH0YfYR9iH2MfYx9kH2EfZR9PH2MfXB9mHywfZh89HywfPB9QH08fXR9nH14faB9pH2of",
    "Mx9RH1kfIR9rH2wfbR9uH28fIR9sH2sfbR9wH24fUh9BH1ofUx9xH1QfYB9GH1QfRx9UH0YfTx9iH2MfTx9QHz0fXR9fH2cfch9vH24fUx9gH3Mfcx9xH1Mf",
    "bx9wH20fYB9UH3EfYR90H2IfdB9hH3UfWx92H1wfYx93H2UfYh93H2MfWx9PH3gfZR94H08fPR9mH3gfeB9PHz0feR96H3sfex96H3kffB99H34fXh9nH18f",
    "fh9/H3wfah9pH2gfgB+BH4Ifgx+EH4Ufgh+BH4Afhh91H4cfiB9cH3YfYR9kH3UfWx94H3YfYh+JH3cfYh9PH4kfeB+JH08fih+GH4cfbh9wH28fhx+LH4of",
    "Yh90H2QfiB+MH1wfYx9iH2QfeB9lH4kfXB+MH2YffR98H38fgx+NH4Qfgx+FH4QfgR+AH44fcx9gH48fbx9yH24fgB+BH44fYB9xH48fdR+LH4cfkB+IH5Ef",
    "dx+SH2Ufdx+JH5MfZB90H3UflB9mH4wffh99H5UfXx9nH5YflR9/H34fgx+EH40fgR+OH5cfmB9xH3MfmR+aH5Afhh+LH3UfkB+aH5kfkB+aH4gfiB+aH4wf",
    "dh+RH4gfdh+MH5Efdh+bH5Qfdh94H5wfeB+UH5wfkh+JH2Ufdh+UH4wfZh+UH3gfhh+KH4sfdx+TH5Ifkx+JH5IfZx+dH54fZx9fH5YfZx+eH5Yfnx+NH6Af",
    "lx+OH4Efmh+QH5Efkx+hH5Ifdh+cH5sfkR+MH5ofZx+WH50fjx+YH3Mfjh+iH5cfmB+PH3EfoR+cH5Ifeh+jH6Qfeh+kH6Ufeh+lH6YffR9/H6cflR+nH38f",
    "jR+fH6AfqB+bH6Efmx+cH6EfnB+hH5Ifeh+mH6kfeh+pH6MffR+nH5Ufoh+qH6sfjh+qH6Ifoh+OH5cfnB+bH6Efkh+hH5MfnB+UH5sfqh+OH6IfrB+tH64f",
    "nR+vH54fnh+vH5YfpR+kH6kfpR+pH6YfrR+wH64fsR+yH6cfoh+rH6ofmx+oH6Efsx+vH50fsR+0H7IfnR+1H7Mflh+vH50frB+2H60ftx+mH6kfuB+5H7of",
    "rh+2H6wfnR+vH7UfsR+nH7Ifph+3H6kfth+wH60fqx+7H6Ifqx+8H70fqx+iH70fvR+8H6sfsB+2H64fqx+9H7sftB++H7Ifux+9H6Ifvh+xH7Ifsx+1H68f",
    "sR++H7QfsB+/H8AfsB/AH7Yfth/AH8Efth/BH8Ifth/CH7Afwx+4H8QfxB+4H7ofxB+6H8UfuB/DH8YfuB/GH7kfuh+5H8Yfuh/GH8cfyB/JH8ofyB/KH8sf",
    "yB/LH8ofyB/KH8kfuh/HH8UfsB/CH78fzB/NH84fzB/OH80f"].join(""), z = ["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",
    "DktbDUtaC0dYDUxcDURVDERUDD9PEl9yDEZaDl1zDHWPCzxKCzxKCjtIDDxKDEdWDEhXC0dWC0ZWDENSDUhXDU1dDEhXDUlYDEhYDEdWDkxbDEdWDUhYDEZW",
    "C0VUC0ZWDEJTDEJTCj5PDUNUDkNUDUxdDVBhDUtdElhsEVRpE2d7CniQDGB1Dl91CjxLDEdWC0NTDElZDEhXDElZDkhYDEhXC0JRC0lYDUlZDEtaC0ZWDkpa",
    "CT9PDEZVDUdXDEdWDElZC0ZXC0VVC0laD1lsD2F2EXWMCYKaCjlHCzpICz9OCz5MC0JRDEpaDElZDUtbDEdWC0NSDklYC0RTDDxLDT5LCkBPC0dXDExdCkFQ",
    "C0BPCz9ODERUDFRmDEZZDUhbDF1zD190ClRnDW2GCz5LCj5NCj5NCjtJDD9OCjxKCz1MDUZVC0VUC0VUC0RTDENSC0VUDUZVC0VUDEVVDU1dDUhYC0VUCz5N",
    "DEBPCz9PEVFiDlxvD0paDklaC0ZVDERTCTxJCTxKCj9OC0hXCj9OCz9NDUtbD0xcC0ZWDUxdDEVWEVtsDEdXDEhZEVtvDVlsDWqAEWyDDVdrDDxJCz1MDEdW",
    "C0VUC0VUDEhXCj9OCTxJEE5dDUxcDERTDEhYDElZDUdXDEdXCUVWDFVqElVoC05hDWyDElRoFX2UCztICjxJC0RTDERTDEdWCz9OC0NTDUpcDEZXDVhsDX6X",
    "C0FQCjxLDUNRDUhYDERTC0ZVC0dWDEZVC0dXDklYDEhYC0ZWDEJSDUZZEWZ6C0FUC0dZDlZpC2yDCjpHCjtICDdEDUpZC0ZWDUpaDU1cDUVTDUtbDEBPCkZW",
    "C0NTDEJSDUZVDERUC0peC0FTD05fDVRnCW+GC3iPC0BPDUJRDUFQCj5NDEBOC0BPC0hXC0JRDENSC0FPDEhXD1dnDl5tCj9NCVJlDVltC26FC0VUDU1cDEdW",
    "DUpaDEZVC0NSDVRnC1ptDFhsCj5NDUpZD1hoC0NSDU9fDV1uDUVVC0RUDEZWDEhYD15yDXqPCzxJCzxJCj5NCkBPCkBPCjtICzxJDEdXDEdWDEhXC0hXDVVl",
    "DF9wCz9OC0VUDUpbDVJjDEhZD1tuD2BzDUlbDmF2Cz9OCz5LDEBPCzxIC0RTC0dWDEVUDEVUC0RTC0hXDVhpDUpZDV5uDlNiDVZmDl9vCkdXDEhYDFBhDk9f",
    "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",
    "Cz1MCjpGCz5NC0BPC0RTC0FQDD1MC0BPCj5NC0NTDUZVC0dXC0lYCz1LCjdEDEJQCjlGC0FQDENSCkBPC0lZC0BOCj9NC0paDUtaDUlYCjlHCjtJCz5NDVlo",
    "DU9eDEJRDEVUDFhoCTZCC0BPDEtaC0FQDEdWDEdWDlJhCjxLDENSDUlYDFRkC0BOCjxJCjxJCjhFDD1KCjlGDkxbCkZWC0BPDEFQDEJRCztIDEJQDUVUDEFQ",
    "C0FQCkFQD05dDUhXDUhXDUpZCztICj1MCjxIC0JRCj5NC0JSDEJRCTxKDEhYCz9NCz9NCj5NDVNiDUxcDUlYCjxLCj1MDERTCjxJCjxJDENSCz5MCj5NC0FQ",
    "Cj5NCkNSDk9eDEdWDElXDEpZCjhGDlJiDV1tCz9NCz9OCz1LCzxLCj1LDUxbC0FQDENSDEpZC0FQC0NSCjhGCjxLCjpHCjlHCjxJDUhYCz1MCz1LCz1LCz1L",
    "Cz1LCj9OCz9ODUpZDVBhC01cDU9eCjtHCjxJCjxJCz1LCz1MCz1MCz1LCz1MCz1MC0taDlJhCz1KCTVCCkFQCjxKCjhGCz1LCj1MCz1LDlZnC0RTDU9fDUxb",
    "DU9fDFppCThFCTpHCjxJCzxLCj1MCj1MDVBgDE9eEFVkDU1dDlhnDk5eDldmCTpHCDlGC0FPCj9NCz9OCz9OCz9ODD1LDlJiDE9eCj5NDlJhDUhXCz9OCz1M",
    "DUxbDktaDEhYCjhEDUVUDUVUCzxJCzxJCztICz9OCzxJC0BPDlJhCj5NCz9NDlFgDlhoDltrCTpIDENSDkRTDUlYEVNiDU1dCTxLCjxLD1FgDVJiCz9NCj1M",
    "CTdECTlFCTtJCz9OD1ZlDVdnDWFxCjxKDUZVC0JQDUhXDUtbDURTCz9OCzxJCjxKDUdXDVpqDEtaCzxKCjxJCkBPDUhXDUJRDklYDklYDEVUDEZVC1RkCUBP",
    "CztHCjpICz1LCz9OCj1LEE9eCjtHCjpID0pZDUhXCjdECz9ODkhXDUVUDUlYD0paDVpqCz1LCjpICjpHCj1MCj5MCkBOCj9NDUJRCj1MC0BPC0FPCjxKC0NS",
    "CkBPCj1MDEZVDUhXCz9ODkVUDElYCj9OCkBPCz9OCjpHDk5dDU9eEU1cDUtaC0FPCkBOCz9OCz5NCjpHCjpIDEZVDUlYCzxJCz9OCjxJCzxKEEtaCz9OCjpH",
    "CjpHCjxICjlGCz9NEU1cCjpHCUBPCjxLCjpICz1LC0BOCTxKCkBOCj9OC0BPCTtJCz9OCjpICj5MCjlHCj5MCj5MCj9OCjxKC0FRCT1MC0BOC0BOCz5NCz1L",
    "Cz5MCj5NCj5NC0BOCz5MCz5NCj1LCz9OCzxKCzxKCjpHCztJCztJ"].join("");
    function O(D) {
      let A = atob(D), E = new Uint8Array(A.length);
      for (let C = 0; C < A.length; C += 1) E[C] = A.charCodeAt(C);
      return E;
    }
    function W() {
      let D = O(m), A = new Uint16Array(D.buffer, D.byteOffset, D.byteLength / 2), E = new Float32Array(A.length), C = H.boundsMin, B = H.quantScale;
      for (let F = 0; F < A.length; F += 3) E[F] = C[0] + A[F] * B[0], E[F + 1] = C[1] + A[F + 1] * B[1], E[F + 2] = C[2] + A[F + 2] * B[2];
      return E;
    }
    function CD() {
      let D = O(j);
      return new Uint16Array(D.buffer, D.byteOffset, D.byteLength / 2);
    }
    function k() {
      return O(z);
    }
    let d = null;
    function T() {
      if (!d) {
        let D = W(), A = CD(), E = k();
        if (D.length !== H.vertexCount * 3 || A.length !== H.indexCount || E.length !== H.vertexCount * 3) throw new Error("Builder 3 geometry failed its integrity check.");
        d = Object.freeze({ positions: D, indices: A, colours: E });
      }
      return d;
    }
    function q(D) {
      let A = D.closest(b);
      A && A.querySelectorAll(":scope > .rf-map-background").forEach((E) => E.remove());
    }
    function y(D) {
      let A = D.closest(b);
      A && (A.querySelectorAll(`:scope > ${f}`).forEach((E) => E.remove()), A.dataset.rfGraphKeyInit = "false");
    }
    function BD(D, A) {
      console.error("FieldOps RF Builder 3 failed:", A);
      let E = document.createElement("div");
      E.setAttribute("role", "status"), E.setAttribute("aria-live", "polite"), E.textContent = "Builder 3 opaque mountain unavailable", E.style.cssText = ["display:grid", "place-items:center", "width:100%", "height:100%", "min-height:300px", "background:#010a12", "color:rgba(201,251,255,.72)", "font:700 11px/1.2 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif", "letter-spacing:.04em"].join(";"), D.replaceChildren(E), D.dataset.rfGraphLoaded = "fallback", D.dataset.rfGraphVersion = G, D.dataset.rfGraphMode = "fallback";
    }
    function QD(D) {
      let A = document.createElement("div");
      A.className = "rf-webgl-orbit-frame", A.style.cssText = ["position:relative", "width:100%", "height:100%", "overflow:hidden", "background-color:#01090e", "background-image:linear-gradient(rgba(0,186,204,.050) 1px,transparent 1px),linear-gradient(90deg,rgba(0,186,204,.050) 1px,transparent 1px),linear-gradient(rgba(0,186,204,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,186,204,.018) 1px,transparent 1px)", "background-size:56px 56px,56px 56px,14px 14px,14px 14px", "touch-action:none", "user-select:none"].join(";");
      let E = document.createElement("canvas");
      E.className = "rf-webgl-orbit-canvas", E.setAttribute("role", "img"), E.setAttribute("aria-label", "Interactive opaque faceted cyan ridge mountain. Drag left or right to orbit 360 degrees."), E.setAttribute("tabindex", "0"), E.style.cssText = "display:block;width:100%;height:100%;touch-action:none;cursor:grab;outline:none";
      let C = document.createElement("div");
      return C.className = "rf-webgl-orbit-hint", C.textContent = "Drag to rotate 360°", C.style.cssText = ["position:absolute", "left:50%", "bottom:10px", "transform:translateX(-50%)", "padding:5px 9px", "border:1px solid rgba(116,228,244,.35)", "border-radius:999px", "background:rgba(2,16,31,.72)", "color:rgba(218,249,255,.9)", "font:700 9px/1.1 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif", "letter-spacing:.04em", "pointer-events:none", "transition:opacity .35s ease"].join(";"), A.append(E, C), D.replaceChildren(A), { frame: A, canvas: E, hint: C };
    }
    function J(D) {
      D.style.opacity = "0";
    }
    async function FD() {
      return oD;
    }
    let aD = 1, cD = 0.96, ID = 0.235, YD = 0.958, eD = 1e-18, tD = Object.freeze([6 / 255, 19 / 255, 26 / 255]), gD = Object.freeze({ x: 0.019635006830198476, y: 0.9086992847261541, z: 7775044148700117e-19, outerRadius: 0.08054548592230482 }), UD = Object.freeze([Object.freeze({ x: -0.07001383516569858, y: 0.7510444305667527, z: -0.004246370265828303, baseY: 0.475, fullRadius: 0.056353437349480166, outerRadius: 0.11571943055781153 }), Object.freeze({ x: 0.09025027463754276, y: 0.7623728400520853, z: -0.0026913614360883904, baseY: 0.475, fullRadius: 0.058657359157477496, outerRadius: 0.12255162993026053 }), Object.freeze({ x: 0.002464694551057911, y: 0.7255312439657589, z: 0.09264264143335321, baseY: 0.475, fullRadius: 0.06643181712826672, outerRadius: 0.12062755993172357 }), Object.freeze({ x: 0.019564250048828336, y: 0.7782908499531401, z: -0.06151854162578895, baseY: 0.475, fullRadius: 0.06693372515836765, outerRadius: 0.13159058221864872 })]);
    function HD(D, A, E) {
      if (A <= D) return E >= A ? 1 : 0;
      let C = Math.min(1, Math.max(0, (E - D) / (A - D)));
      return C * C * (3 - 2 * C);
    }
    function v(D, A, E) {
      return Math.hypot(D - E.x, A - E.z);
    }
    function lD(D, A, E) {
      let C = v(D, A, E) / E.outerRadius, B = v(D, A, gD) / gD.outerRadius;
      return C >= B ? !1 : UD.every((F) => F === E ? !0 : C <= v(D, A, F) / F.outerRadius);
    }
    function dD(D, A, E, C) {
      if (A <= C.baseY || !lD(D, E, C)) return 0;
      let B = v(D, E, C);
      if (B >= C.outerRadius) return 0;
      let F = 1 - HD(C.fullRadius, C.outerRadius, B), h = HD(C.baseY, C.y, A);
      return F * (0.3 + h * 0.7);
    }
    function VD(D, A, E, C) {
      if (C <= 1e-3) return [D, A, E];
      let B = Math.max(D, A, E, 1 / 255), F = aD / B, h = C * cD;
      return [D + (Math.min(1, D * F) - D) * h, A + (Math.min(1, A * F) - A) * h, E + (Math.min(1, E * F) - E) * h];
    }
    function RD(D, A) {
      return Number.isFinite(D.getX(A)) && Number.isFinite(D.getY(A)) && Number.isFinite(D.getZ(A));
    }
    function MD(D, A, E, C) {
      let B = D.getX(A), F = D.getY(A), h = D.getZ(A), x = D.getX(E) - B, g = D.getY(E) - F, c = D.getZ(E) - h, o = D.getX(C) - B, V = D.getY(C) - F, s = D.getZ(C) - h, U = g * s - c * V, I = c * o - x * s, a = x * V - g * o, l = U * U + I * I + a * a;
      return { areaSquared: l, normalY: l > eD ? Math.abs(I) / Math.sqrt(l) : 0 };
    }
    function ZD(D) {
      let A = T(), E = new D.BufferGeometry();
      return E.setAttribute("position", new D.BufferAttribute(A.positions, 3)), E.setAttribute("color", new D.BufferAttribute(A.colours, 3, !0)), E.setIndex(new D.BufferAttribute(A.indices, 1)), E.computeBoundingBox(), E.computeBoundingSphere(), E;
    }
    function kD(D, A) {
      let E = A.getAttribute("position"), C = A.getAttribute("color"), B = A.index;
      A.computeBoundingBox();
      let F = A.boundingBox;
      if (!E || !C || !B || !F) throw new Error("Builder 3 surface data is incomplete.");
      let h = Math.max(F.max.y - F.min.y, 1e-6), x = F.min.y + h * ID, g = [], c = [], o = [], V = [], q = [], y = [], W = [], J = [], K = [], z = [], P0 = [], s = 0;
      const smoothStep = (P, S, R) => {
        const u = Math.max(0, Math.min(1, (R - P) / Math.max(S - P, 1e-6)));
        return u * u * (3 - 2 * u);
      };
      const hash = (P, S, R, u = 0) => {
        const N = Math.sin(P * 127.1 + S * 311.7 + R * 74.7 + u * 19.19) * 43758.5453123;
        return N - Math.floor(N);
      };
      const neighbourSets = Array.from({ length: E.count }, () => new Set());
      for (let I = 0; I < B.count; I += 3) {
        const a = B.getX(I), l = B.getX(I + 1), n = B.getX(I + 2);
        if (a >= E.count || l >= E.count || n >= E.count) continue;
        neighbourSets[a].add(l); neighbourSets[a].add(n);
        neighbourSets[l].add(a); neighbourSets[l].add(n);
        neighbourSets[n].add(a); neighbourSets[n].add(l);
      }
      let prominence = new Float32Array(E.count);
      for (let I = 0; I < E.count; I += 1) {
        const neighbours = neighbourSets[I];
        if (!neighbours.size) continue;
        let sum = 0;
        neighbours.forEach((N) => { sum += E.getY(N); });
        prominence[I] = E.getY(I) - sum / neighbours.size;
      }
      for (let pass = 0; pass < 3; pass += 1) {
        const next = new Float32Array(E.count);
        for (let I = 0; I < E.count; I += 1) {
          const neighbours = neighbourSets[I];
          if (!neighbours.size) { next[I] = prominence[I]; continue; }
          let sum = 0;
          neighbours.forEach((N) => { sum += prominence[N]; });
          next[I] = prominence[I] * 0.46 + sum / neighbours.size * 0.54;
        }
        prominence = next;
      }
      const vertexCore = new Float32Array(E.count);
      let vertexShoulder = new Float32Array(E.count);
      for (let I = 0; I < E.count; I += 1) {
        vertexCore[I] = smoothStep(0.00115, 0.0064, prominence[I]);
        vertexShoulder[I] = vertexCore[I];
      }
      for (let pass = 0; pass < 3; pass += 1) {
        const next = new Float32Array(E.count);
        for (let I = 0; I < E.count; I += 1) {
          let spread = vertexShoulder[I];
          neighbourSets[I].forEach((N) => { spread = Math.max(spread, vertexShoulder[N] * 0.78); });
          next[I] = spread;
        }
        vertexShoulder = next;
      }
      const shiftedPoint = (point) => [point[0] - H.center[0], point[1] - H.center[2]];
      const main = shiftedPoint(H.majorPeaks[0].centreXZ);
      const shoulders = H.majorPeaks.filter((P) => P.role === "layer2-shoulder").map((P) => shiftedPoint(P.centreXZ));
      const forkPeaks = H.majorPeaks.filter((P) => P.role === "layer2-fork");
      const forks = forkPeaks.map((P) => shiftedPoint(P.centreXZ));
      const forkGapSegments = [];
      [
        forks.filter((P) => P[1] >= 0).sort((a, b) => a[0] - b[0]),
        forks.filter((P) => P[1] < 0).sort((a, b) => a[0] - b[0])
      ].forEach((group) => {
        for (let index = 0; index < group.length - 1; index += 1) {
          forkGapSegments.push({ a: group[index], b: group[index + 1] });
        }
      });
      const ridgeSegments = [];
      forks.forEach((P) => ridgeSegments.push({ a: main, b: P, core: 0.017, outer: 0.050, strength: 1 }));
      shoulders.forEach((P) => ridgeSegments.push({ a: main, b: P, core: 0.012, outer: 0.036, strength: 0.88 }));
      shoulders.forEach((P) => {
        const nearest = forks.map((Q, index) => ({ index, distance: Math.hypot(Q[0] - P[0], Q[1] - P[1]) })).sort((a, b) => a.distance - b.distance).slice(0, 2);
        nearest.forEach(({ index }) => ridgeSegments.push({ a: P, b: forks[index], core: 0.014, outer: 0.042, strength: 0.72 }));
      });
      const segmentField = (px, pz, segment, broad) => {
        const ax = segment.a[0], az = segment.a[1], bx = segment.b[0], bz = segment.b[1];
        const dx = bx - ax, dz = bz - az, lengthSquared = dx * dx + dz * dz;
        const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / Math.max(lengthSquared, 1e-8)));
        const qx = ax + dx * t, qz = az + dz * t;
        const distance = Math.hypot(px - qx, pz - qz);
        const width = (broad ? segment.outer : segment.core) * (1 + t * (broad ? 0.54 : 0.38));
        const falloff = Math.exp(-Math.pow(distance / Math.max(width, 1e-5), 2));
        return falloff * segment.strength * (1 - t * 0.12);
      };
      // Restore the original lower fork structure as three tapered branch traces per fork.
      // This is edge-only detail: it does not turn the lower mountain into a solid cyan fill.
      const forkDetailField = (px, pz, heightRatio) => {
        const altitude = smoothStep(0.025, 0.13, heightRatio) * (1 - smoothStep(0.61, 0.83, heightRatio));
        if (altitude <= 0) return 0;
        let detail = 0;
        forks.forEach((target) => {
          const length = Math.hypot(target[0], target[1]);
          if (length <= 1e-6) return;
          const dx = target[0] / length, dz = target[1] / length;
          const along = px * dx + pz * dz;
          const across = px * dz - pz * dx;
          const start = Math.min(0.105, length * 0.28);
          const progress = Math.max(0, Math.min(1, (along - start) / Math.max(length * 0.92 - start, 0.16)));
          const radial = smoothStep(start * 0.78, start * 1.36, along) * (1 - smoothStep(length * 0.94, length * 1.16, along));
          const split = smoothStep(0.13, 0.36, progress);
          const spread = 0.018 + Math.pow(progress, 1.08) * 0.142;
          const thickness = 0.0085 + progress * 0.0095;
          const centre = Math.exp(-Math.pow(Math.abs(across) / Math.max(thickness, 1e-5), 2)) * (1 - progress * 0.30);
          const left = Math.exp(-Math.pow(Math.abs(across - spread) / Math.max(thickness * 1.10, 1e-5), 2)) * split;
          const right = Math.exp(-Math.pow(Math.abs(across + spread) / Math.max(thickness * 1.10, 1e-5), 2)) * split;
          const branch = Math.max(centre, left, right) * radial * altitude;
          detail = Math.max(detail, branch);
        });
        return Math.max(0, Math.min(1, detail));
      };
      const forkGapFillField = (px, pz, heightRatio) => {
        const altitude = smoothStep(0.018, 0.115, heightRatio) * (1 - smoothStep(0.50, 0.74, heightRatio));
        if (altitude <= 0) return 0;
        const radius = Math.hypot(px, pz);
        const radialGate = smoothStep(0.10, 0.22, radius) * (1 - smoothStep(0.72, 0.91, radius));
        if (radialGate <= 0) return 0;
        let blend = 0;
        forkGapSegments.forEach((segment) => {
          const ax = segment.a[0], az = segment.a[1], bx = segment.b[0], bz = segment.b[1];
          const dx = bx - ax, dz = bz - az, lengthSquared = dx * dx + dz * dz;
          if (lengthSquared <= 1e-8) return;
          const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / lengthSquared));
          const qx = ax + dx * t, qz = az + dz * t;
          const distance = Math.hypot(px - qx, pz - qz);
          const centreWeight = 0.42 + 0.58 * smoothStep(0.06, 0.44, t) * (1 - smoothStep(0.56, 0.94, t));
          const width = 0.052 + centreWeight * 0.072;
          blend = Math.max(blend, Math.exp(-Math.pow(distance / Math.max(width, 1e-5), 2)) * centreWeight);
        });
        forks.forEach((target) => {
          const length = Math.hypot(target[0], target[1]);
          if (length <= 1e-6) return;
          const dx = target[0] / length, dz = target[1] / length;
          const along = px * dx + pz * dz;
          const across = px * dz - pz * dx;
          const start = Math.min(0.095, length * 0.24);
          const progress = Math.max(0, Math.min(1, (along - start) / Math.max(length * 0.78 - start, 0.16)));
          const collar = smoothStep(start * 0.68, start * 1.26, along) * (1 - smoothStep(length * 0.78, length * 1.04, along));
          const width = 0.033 + progress * 0.082;
          blend = Math.max(blend, Math.exp(-Math.pow(Math.abs(across) / Math.max(width, 1e-5), 2)) * collar * 0.58);
        });
        const rootFill = smoothStep(0.08, 0.18, radius) * (1 - smoothStep(0.34, 0.56, radius)) * 0.34;
        return Math.max(0, Math.min(1, Math.max(blend, rootFill) * altitude * radialGate));
      };
      const paletteCounts = [0, 0, 0, 0];
      for (let I = 0; I < B.count; I += 3) {
        let a = B.getX(I), l = B.getX(I + 1), n = B.getX(I + 2);
        if (a >= E.count || l >= E.count || n >= E.count || !RD(E, a) || !RD(E, l) || !RD(E, n)) continue;
        let Q = MD(E, a, l, n);
        if (Q.areaSquared <= eD) continue;
        let floorLike = Math.max(E.getY(a), E.getY(l), E.getY(n)) <= x && Q.normalY >= YD, p = floorLike, _ = [a, l, n], $ = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

        const ax = E.getX(a), ay = E.getY(a), az = E.getZ(a);
        const bx = E.getX(l), by = E.getY(l), bz = E.getZ(l);
        const cx = E.getX(n), cy = E.getY(n), cz = E.getZ(n);
        const mx = (ax + bx + cx) / 3;
        const my = (ay + by + cy) / 3;
        const mz = (az + bz + cz) / 3;
        const heightRatio = Math.max(0, Math.min(1, (my - F.min.y) / h));
        const radial = Math.hypot(mx, mz);
        const slope = Math.max(0, Math.min(1, 1 - Q.normalY));

        let pathCore = 0, pathShoulder = 0;
        ridgeSegments.forEach((segment) => {
          pathCore = Math.max(pathCore, segmentField(mx, mz, segment, false));
          pathShoulder = Math.max(pathShoulder, segmentField(mx, mz, segment, true));
        });
        const geometryCore = (vertexCore[a] + vertexCore[l] + vertexCore[n]) / 3;
        const geometryShoulder = (vertexShoulder[a] + vertexShoulder[l] + vertexShoulder[n]) / 3;
        const crownCore = smoothStep(0.72, 0.985, heightRatio) * (0.64 + slope * 0.36);
        const crownShoulder = smoothStep(0.56, 0.94, heightRatio) * (0.58 + slope * 0.30);
        const altitudeGate = smoothStep(0.035, 0.20, heightRatio);
        const outerGate = 1 - smoothStep(0.66, 0.98, radial);
        const lowerBand = smoothStep(0.025, 0.14, heightRatio) * (1 - smoothStep(0.60, 0.84, heightRatio));
        const forkDetail = forkDetailField(mx, mz, heightRatio);
        const forkBlend = forkGapFillField(mx, mz, heightRatio);
        const ridgeCore = Math.max(pathCore * (0.72 + slope * 0.28), geometryCore * 0.16, crownCore * 0.34) * altitudeGate * (0.78 + outerGate * 0.22);
        const ridgeShoulderBase = Math.max(pathShoulder * (0.72 + slope * 0.28), geometryShoulder * 0.56, crownShoulder * 0.48) * smoothStep(0.018, 0.14, heightRatio) * (0.80 + outerGate * 0.20);
        const ridgeShoulder = Math.max(ridgeShoulderBase, forkBlend * (0.58 + slope * 0.18));
        const reliefDetail = geometryShoulder * lowerBand * (0.54 + slope * 0.46);
        const ridgeDetail = Math.max(forkDetail, forkBlend * 0.74, reliefDetail * 0.82, pathShoulder * lowerBand * 0.42);
        const skinHash = hash(mx, my, mz, 5);
        const skinBand = smoothStep(0.050, 0.145, heightRatio) * (1 - smoothStep(0.62, 0.81, heightRatio));
        const skinRadial = smoothStep(0.085, 0.22, radial) * (1 - smoothStep(0.76, 0.96, radial));
        const skinSource = Math.max(ridgeDetail * 0.88, pathShoulder * lowerBand * 0.58, geometryShoulder * lowerBand * 0.46, slope * lowerBand * 0.16);
        const speckledSkin = skinHash > 0.18 ? skinBand * skinRadial * skinSource * (1.00 + skinHash * 0.72) * (1 - ridgeCore * 0.30) : 0;
        const gapSkin = forkBlend * skinBand * skinRadial * (0.72 + slope * 0.18);
        const skinPatch = Math.max(0, Math.min(1, Math.max(speckledSkin, gapSkin)));
        p = floorLike && forkBlend < 0.18 && skinPatch < 0.10;

        const stripHash = hash(mx, my, mz, 1);
        const intensity = Math.max(0, Math.min(1, ridgeCore * (0.86 + stripHash * 0.20)));
        let stripTier = 0;
        if (intensity > 0.82) stripTier = stripHash > 0.82 ? 3 : 2;
        else if (intensity > 0.57) stripTier = stripHash > 0.72 ? 2 : 1;
        else if (intensity > 0.30) stripTier = stripHash > 0.78 ? 1 : 0;
        else stripTier = 0;
        paletteCounts[stripTier] += 1;

        const baseHash = hash(mx, my, mz, 2);
        const substance = Math.max(heightRatio * 0.54, slope * 0.42, ridgeShoulder * 0.28);
        const baseTier = substance > 0.58 ? (baseHash > 0.58 ? 3 : 2) : substance > 0.30 ? (baseHash > 0.66 ? 2 : 1) : (baseHash > 0.82 ? 1 : 0);
        const edgeHash = hash(mx, my, mz, 3);
        const edgeTier = ridgeCore > 0.64 ? (edgeHash > 0.68 ? 2 : 1) : ridgeShoulder > 0.34 ? (edgeHash > 0.78 ? 2 : 1) : 0;

        let sr = 0, sg = 0, sb = 0;
        _.forEach((P) => {
          let R = E.getX(P), u = E.getY(P), N = E.getZ(P), w = 0;
          UD.forEach((M) => { w = Math.max(w, dD(R, u, N, M)); });
          let O = VD(C.getX(P), C.getY(P), C.getZ(P), w);
          sr += O[0]; sg += O[1]; sb += O[2];
        });
        sr /= 3; sg /= 3; sb /= 3;

        _.forEach((P, S) => {
          let R = E.getX(P), u = E.getY(P), N = E.getZ(P);
          g.push(R, u, N);
          o.push(...$[S]);
          V.push(p ? 0 : 1);
          if (p) {
            c.push(...tD);
            q.push(0); y.push(0); W.push(0); J.push(0); K.push(0); z.push(0); P0.push(0);
            return;
          }
          c.push(sr, sg, sb);
          q.push(baseTier);
          y.push(stripTier);
          W.push(Math.max(0, Math.min(1, ridgeCore)));
          J.push(Math.max(0, Math.min(1, ridgeShoulder)));
          K.push(edgeTier);
          z.push(Math.max(0, Math.min(1, ridgeDetail)));
          P0.push(skinPatch);
        });
        s += 1;
      }
      let U = new D.BufferGeometry();
      U.setAttribute("position", new D.Float32BufferAttribute(g, 3));
      U.setAttribute("color", new D.Float32BufferAttribute(c, 3));
      U.setAttribute("barycentric", new D.Float32BufferAttribute(o, 3));
      U.setAttribute("colourMask", new D.Float32BufferAttribute(V, 1));
      U.setAttribute("baseTier", new D.Float32BufferAttribute(q, 1));
      U.setAttribute("stripTier", new D.Float32BufferAttribute(y, 1));
      U.setAttribute("ridgeCore", new D.Float32BufferAttribute(W, 1));
      U.setAttribute("ridgeShoulder", new D.Float32BufferAttribute(J, 1));
      U.setAttribute("edgeTier", new D.Float32BufferAttribute(K, 1));
      U.setAttribute("ridgeDetail", new D.Float32BufferAttribute(z, 1));
      U.setAttribute("skinPatch", new D.Float32BufferAttribute(P0, 1));
      U.computeBoundingBox();
      U.computeBoundingSphere();
      U.userData.rfTwoLayerTopologyForks360Mesh = !0;
      U.userData.rfTwoLayerTopologyForks360MeshVersion = G;
      U.userData.rfRetainedFaceCount = s;
      U.userData.rfTrianglePaletteCounts = paletteCounts;
      U.userData.rfTrianglePaletteHex = ["#075765", "#0a7f8e", "#18c1ca", "#42f3f4"];
      U.userData.rfRidgeMethod = "surface-major-paths-plus-fork-gap-blended-exterior-skin-contained-core";
      return U;
    }
    function sD(D) {
      let E = new D.ShaderMaterial({
        transparent: !1,
        depthWrite: !0,
        depthTest: !0,
        side: D.DoubleSide,
        toneMapped: !1,
        uniforms: {
          uMinY: { value: 0 },
          uMaxY: { value: 1 },
          uTime: { value: 0 },
          uBase0: { value: new D.Color(0x062a34) },
          uBase1: { value: new D.Color(0x073641) },
          uBase2: { value: new D.Color(0x094852) },
          uBase3: { value: new D.Color(0x0c5c66) },
          uStrip0: { value: new D.Color(0x075765) },
          uStrip1: { value: new D.Color(0x0a7f8e) },
          uStrip2: { value: new D.Color(0x18c1ca) },
          uStrip3: { value: new D.Color(0x42f3f4) },
          uEdgeDim: { value: new D.Color(0x0a7782) },
          uEdgeMid: { value: new D.Color(0x11b1ba) },
          uEdgeBright: { value: new D.Color(0x49f4f5) },
          uNode: { value: new D.Color(0xb7ffff) },
          uRim: { value: new D.Color(0x0b98a1) },
          uBack: { value: new D.Color(0x01090e) }
        },
        vertexShader: `
          attribute vec3 color;
          attribute vec3 barycentric;
          attribute float colourMask;
          attribute float baseTier;
          attribute float stripTier;
          attribute float ridgeCore;
          attribute float ridgeShoulder;
          attribute float edgeTier;
          attribute float ridgeDetail;
          attribute float skinPatch;
          varying vec3 vSourceColour;
          varying vec3 vBarycentric;
          varying vec3 vViewPosition;
          varying vec3 vModelPosition;
          varying float vHeight;
          varying float vSurfaceMask;
          varying float vBaseTier;
          varying float vStripTier;
          varying float vRidgeCore;
          varying float vRidgeShoulder;
          varying float vEdgeTier;
          varying float vRidgeDetail;
          varying float vSkinPatch;
          uniform float uMinY;
          uniform float uMaxY;

          void main() {
            vSourceColour = color;
            vBarycentric = barycentric;
            vModelPosition = position;
            vHeight = clamp((position.y - uMinY) / max(uMaxY - uMinY, 0.0001), 0.0, 1.0);
            vSurfaceMask = colourMask;
            vBaseTier = baseTier;
            vStripTier = stripTier;
            vRidgeCore = ridgeCore;
            vRidgeShoulder = ridgeShoulder;
            vEdgeTier = edgeTier;
            vRidgeDetail = ridgeDetail;
            vSkinPatch = skinPatch;
            vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = viewPosition.xyz;
            gl_Position = projectionMatrix * viewPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vSourceColour;
          varying vec3 vBarycentric;
          varying vec3 vViewPosition;
          varying vec3 vModelPosition;
          varying float vHeight;
          varying float vSurfaceMask;
          varying float vBaseTier;
          varying float vStripTier;
          varying float vRidgeCore;
          varying float vRidgeShoulder;
          varying float vEdgeTier;
          varying float vRidgeDetail;
          varying float vSkinPatch;

          uniform float uTime;
          uniform vec3 uBase0;
          uniform vec3 uBase1;
          uniform vec3 uBase2;
          uniform vec3 uBase3;
          uniform vec3 uStrip0;
          uniform vec3 uStrip1;
          uniform vec3 uStrip2;
          uniform vec3 uStrip3;
          uniform vec3 uEdgeDim;
          uniform vec3 uEdgeMid;
          uniform vec3 uEdgeBright;
          uniform vec3 uNode;
          uniform vec3 uRim;
          uniform vec3 uBack;

          float edgeMask(float width) {
            vec3 derivative = max(fwidth(vBarycentric), vec3(0.00001));
            vec3 inset = smoothstep(vec3(0.0), derivative * width, vBarycentric);
            return 1.0 - min(min(inset.x, inset.y), inset.z);
          }

          float vertexNodeMask() {
            vec3 derivative = max(fwidth(vBarycentric), vec3(0.00001));
            vec3 nearEdge = 1.0 - smoothstep(vec3(0.0), derivative * 2.12, vBarycentric);
            float xy = min(nearEdge.x, nearEdge.y);
            float yz = min(nearEdge.y, nearEdge.z);
            float zx = min(nearEdge.z, nearEdge.x);
            return max(xy, max(yz, zx));
          }

          vec3 basePalette(float tier) {
            if (tier < 0.5) return uBase0;
            if (tier < 1.5) return uBase1;
            if (tier < 2.5) return uBase2;
            return uBase3;
          }

          vec3 stripPalette(float tier) {
            if (tier < 0.5) return uStrip0;
            if (tier < 1.5) return uStrip1;
            if (tier < 2.5) return uStrip2;
            return uStrip3;
          }

          vec3 edgePalette(float tier) {
            if (tier < 0.5) return uEdgeDim;
            if (tier < 1.5) return uEdgeMid;
            return uEdgeBright;
          }

          void main() {
            vec3 faceNormal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
            float sideFactor = 1.0;
            if (!gl_FrontFacing) {
              faceNormal = -faceNormal;
              sideFactor = 0.84;
            }
            vec3 viewDirection = normalize(-vViewPosition);
            vec3 keyDirection = normalize(vec3(-0.34, 0.82, 0.45));
            vec3 fillDirection = normalize(vec3(0.72, 0.28, 0.64));
            float keyLight = max(dot(faceNormal, keyDirection), 0.0);
            float fillLight = max(dot(faceNormal, fillDirection), 0.0);
            float topLight = max(faceNormal.y, 0.0);
            float h = smoothstep(0.0, 1.0, vHeight);

            vec3 base = basePalette(vBaseTier);
            vec3 strip = stripPalette(vStripTier);
            float sourceLuma = dot(vSourceColour, vec3(0.2126, 0.7152, 0.0722));
            float sourceVariation = mix(0.93, 1.075, smoothstep(0.04, 0.90, sourceLuma));
            float facetLight = 0.92 + keyLight * 0.28 + fillLight * 0.13 + topLight * 0.08;
            vec3 colour = base * facetLight * sourceVariation * sideFactor;

            float ridgeShoulder = smoothstep(0.035, 0.74, vRidgeShoulder);
            float ridgeCore = smoothstep(0.12, 0.86, vRidgeCore);
            float ridgeDetail = smoothstep(0.055, 0.72, vRidgeDetail);
            float broadFace = smoothstep(0.03, 0.82, ridgeShoulder) * (0.70 + h * 0.30);
            colour += uStrip0 * (0.050 + broadFace * 0.10 + h * 0.025) * sideFactor;
            float stripLight = 0.90 + keyLight * 0.20 + topLight * 0.08;
            colour = mix(colour, strip * stripLight * sideFactor, ridgeCore * 0.27);
            colour += mix(uStrip0, uStrip1, ridgeShoulder) * ridgeShoulder * (1.0 - ridgeCore) * 0.11 * sideFactor;
            float skinPatch = smoothstep(0.055, 0.72, vSkinPatch);
            vec3 skinColour = mix(uStrip0, uStrip2, clamp(vSkinPatch * 0.94, 0.0, 1.0));
            float skinLight = 0.90 + keyLight * 0.17 + topLight * 0.07;
            colour = mix(colour, skinColour * skinLight * sideFactor, skinPatch * 0.26);

            float edgeGlow = edgeMask(1.55);
            float edgeCore = edgeMask(0.68);
            float detailEdge = edgeMask(1.92);
            float nodes = vertexNodeMask();
            vec3 edgeColour = edgePalette(vEdgeTier);
            float pulse = 0.975 + 0.025 * sin(uTime * 0.42 + vModelPosition.y * 15.0 + vModelPosition.x * 9.0);
            float lowerVisibility = smoothstep(0.025, 0.16, h) * (1.0 - smoothstep(0.63, 0.86, h));
            float globalEdge = (0.34 + h * 0.070 + lowerVisibility * 0.075) * pulse;
            colour += uEdgeDim * edgeGlow * globalEdge * sideFactor;
            colour += edgeColour * edgeGlow * (ridgeShoulder * 0.62 + ridgeCore * 0.32) * pulse * sideFactor;
            colour += mix(uEdgeDim, uEdgeMid, ridgeDetail) * detailEdge * ridgeDetail * 0.48 * pulse * sideFactor;
            colour += skinColour * detailEdge * skinPatch * 0.24 * pulse * sideFactor;
            colour += mix(uEdgeMid, uEdgeBright, ridgeCore) * edgeCore * (0.13 + ridgeCore * 0.64 + ridgeDetail * 0.13) * sideFactor;
            colour += uNode * nodes * (0.052 + ridgeShoulder * 0.10 + ridgeCore * ridgeCore * 0.38 + ridgeDetail * 0.13) * sideFactor;

            float viewDot = max(dot(faceNormal, viewDirection), 0.0);
            float rim = pow(clamp(1.0 - viewDot, 0.0, 1.0), 2.5);
            colour += uRim * rim * (0.025 + ridgeShoulder * 0.055);

            float floorFade = mix(0.95, 1.0, smoothstep(0.015, 0.25, h));
            colour *= floorFade;
            colour = max(colour, uBase0 * (0.95 + h * 0.30) * sideFactor);
            vec3 surfaceColour = mix(uBack, colour, vSurfaceMask);
            float maskedExterior = (1.0 - vSurfaceMask);
            float floorNetwork = maskedExterior * edgeMask(1.48) * (0.34 + lowerVisibility * 0.16) * pulse;
            float floorNodes = maskedExterior * nodes * 0.075;
            colour = surfaceColour + uEdgeDim * floorNetwork * sideFactor + uEdgeMid * floorNodes * sideFactor;

            gl_FragColor = vec4(clamp(colour, 0.0, 1.0), 1.0);
            #include <colorspace_fragment>
          }
        `
      });
      E.name = "rf-faceted-cyan-ridge-volume-opaque-material";
      E.userData = {
        rfMeasuredPalette: ["#062a34", "#073641", "#094852", "#0c5c66", "#075765", "#0a7f8e", "#18c1ca", "#42f3f4"],
        rfRidgeMethod: "surface-major-paths-plus-fork-gap-blended-exterior-skin-contained-core",
        rfOpaque: true
      };
      return E;
    }
    function mD(D, A) {
      const E = A.getAttribute("position");
      const C = A.getAttribute("ridgeShoulder");
      const B = A.getAttribute("ridgeDetail");
      const R = A.getAttribute("ridgeCore");
      const M = A.getAttribute("colourMask");
      const S = A.getAttribute("skinPatch");
      if (!E || E.count < 3) return null;
      A.computeBoundingBox();
      const F = A.boundingBox;
      if (!F) return null;

      const h = Math.max(F.max.y - F.min.y, 1e-6);
      const radialExtent = Math.max(
        Math.abs(F.min.x), Math.abs(F.max.x),
        Math.abs(F.min.z), Math.abs(F.max.z),
        1e-6
      );
      const positions = [];
      const colours = [];
      const clamp01 = (value) => Math.max(0, Math.min(1, value));
      const smoothStep = (start, end, value) => {
        const t = clamp01((value - start) / Math.max(end - start, 1e-6));
        return t * t * (3 - 2 * t);
      };
      const hash = (value) => {
        const n = Math.sin(value) * 43758.5453123;
        return n - Math.floor(n);
      };
      const mixColour = (a, b, t) => a.map((value, index) => value + (b[index] - value) * t);
      const palette = [
        [0x04 / 255, 0x48 / 255, 0x54 / 255],
        [0x07 / 255, 0x69 / 255, 0x74 / 255],
        [0x0b / 255, 0x98 / 255, 0xa1 / 255],
        [0x1b / 255, 0xca / 255, 0xd0 / 255],
        [0x46 / 255, 0xf0 / 255, 0xf2 / 255]
      ];
      const colourFor = (strength, seed) => {
        const variation = hash(seed * 11.71 + 8.23);
        const adjusted = clamp01(strength * (0.88 + variation * 0.20));
        if (adjusted < 0.27) return mixColour(palette[0], palette[1], adjusted / 0.27);
        if (adjusted < 0.54) return mixColour(palette[1], palette[2], (adjusted - 0.27) / 0.27);
        if (adjusted < 0.80) return mixColour(palette[2], palette[3], (adjusted - 0.54) / 0.26);
        return mixColour(palette[3], palette[4], (adjusted - 0.80) / 0.20);
      };
      const gridPoint = (a, b, c, i, j, divisions) => {
        const wb = i / divisions, wc = j / divisions, wa = 1 - wb - wc;
        return [
          a[0] * wa + b[0] * wb + c[0] * wc,
          a[1] * wa + b[1] * wb + c[1] * wc,
          a[2] * wa + b[2] * wb + c[2] * wc
        ];
      };
      const normalFor = (a, b, c) => {
        const abx = b[0] - a[0], aby = b[1] - a[1], abz = b[2] - a[2];
        const acx = c[0] - a[0], acy = c[1] - a[1], acz = c[2] - a[2];
        const nx = aby * acz - abz * acy;
        const ny = abz * acx - abx * acz;
        const nz = abx * acy - aby * acx;
        const length = Math.hypot(nx, ny, nz) || 1;
        return [nx / length, ny / length, nz / length];
      };
      const liftPoint = (point, normal, lift) => [
        point[0] + normal[0] * lift,
        point[1] + normal[1] * lift,
        point[2] + normal[2] * lift
      ];
      const pushRibbon = (p0, p1, normal, colour, halfWidth, lift) => {
        const a = liftPoint(p0, normal, lift);
        const b = liftPoint(p1, normal, lift);
        const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
        const length = Math.hypot(dx, dy, dz);
        if (length <= 1e-8) return;
        const ux = dx / length, uy = dy / length, uz = dz / length;
        let px = normal[1] * uz - normal[2] * uy;
        let py = normal[2] * ux - normal[0] * uz;
        let pz = normal[0] * uy - normal[1] * ux;
        const pLength = Math.hypot(px, py, pz);
        if (pLength <= 1e-8) return;
        px = px / pLength * halfWidth;
        py = py / pLength * halfWidth;
        pz = pz / pLength * halfWidth;
        positions.push(
          a[0] + px, a[1] + py, a[2] + pz,
          a[0] - px, a[1] - py, a[2] - pz,
          b[0] + px, b[1] + py, b[2] + pz,
          b[0] + px, b[1] + py, b[2] + pz,
          a[0] - px, a[1] - py, a[2] - pz,
          b[0] - px, b[1] - py, b[2] - pz
        );
        for (let index = 0; index < 6; index += 1) colours.push(...colour);
      };

      let selectedFaces = 0;
      for (let face = 0; face < E.count; face += 3) {
        const surfaceMask = M ? (M.getX(face) + M.getX(face + 1) + M.getX(face + 2)) / 3 : 1;
        if (surfaceMask < 0.5) continue;

        const a = [E.getX(face), E.getY(face), E.getZ(face)];
        const b = [E.getX(face + 1), E.getY(face + 1), E.getZ(face + 1)];
        const c = [E.getX(face + 2), E.getY(face + 2), E.getZ(face + 2)];
        const mx = (a[0] + b[0] + c[0]) / 3;
        const my = (a[1] + b[1] + c[1]) / 3;
        const mz = (a[2] + b[2] + c[2]) / 3;
        const heightRatio = clamp01((my - F.min.y) / h);
        const radialRatio = clamp01(Math.hypot(mx, mz) / radialExtent);
        const shoulder = C ? (C.getX(face) + C.getX(face + 1) + C.getX(face + 2)) / 3 : 0;
        const detail = B ? (B.getX(face) + B.getX(face + 1) + B.getX(face + 2)) / 3 : 0;
        const core = R ? (R.getX(face) + R.getX(face + 1) + R.getX(face + 2)) / 3 : 0;
        const skin = S ? (S.getX(face) + S.getX(face + 1) + S.getX(face + 2)) / 3 : 0;
        const normal = normalFor(a, b, c);
        const slope = clamp01(1 - Math.abs(normal[1]));

        // Restore the previous skin specifically in the middle-to-lower exterior band,
        // with deterministic coverage where fork-gap fill has converted floor-like faces.
        const verticalBand = smoothStep(0.025, 0.12, heightRatio) * (1 - smoothStep(0.62, 0.81, heightRatio));
        const radialBand = smoothStep(0.08, 0.20, radialRatio) * (1 - smoothStep(0.92, 1.04, radialRatio));
        const betweenRidges = clamp01(0.24 + detail * 0.48 + shoulder * 0.30 + skin * 0.62 + slope * 0.20 - core * 0.10);
        const activity = clamp01(verticalBand * radialBand * betweenRidges + skin * 0.58);
        if (activity < 0.055) continue;

        const seed = mx * 47.3 + my * 61.7 + mz * 83.1 + face * 0.019;
        const faceKeep = clamp01(0.38 + activity * 0.58 + detail * 0.08 + skin * 0.28);
        if (skin < 0.18 && hash(seed + 1.7) > faceKeep) continue;
        selectedFaces += 1;

        const divisions = activity > 0.48 || skin > 0.20 ? 4 : 3;
        const segmentKeep = clamp01(0.50 + activity * 0.40 + detail * 0.08 + skin * 0.20);
        const halfWidth = 0.00040 + activity * 0.00038 + skin * 0.00018;
        const lift = 0.00022 + activity * 0.00016 + skin * 0.00008;
        const cache = new Map();
        const pointAt = (i, j) => {
          const key = `${i}:${j}`;
          if (!cache.has(key)) cache.set(key, gridPoint(a, b, c, i, j, divisions));
          return cache.get(key);
        };

        for (let i = 0; i <= divisions; i += 1) {
          for (let j = 0; j <= divisions - i; j += 1) {
            const p0 = pointAt(i, j);
            const localBase = seed + i * 13.1 + j * 21.7;
            if (i + j < divisions && hash(localBase + 2.0) <= segmentKeep) {
              const strength = clamp01(activity * (0.82 + hash(localBase + 2.2) * 0.34));
              pushRibbon(p0, pointAt(i + 1, j), normal, colourFor(strength, localBase + 2.4), halfWidth * (0.82 + hash(localBase + 2.6) * 0.72), lift);
            }
            if (i + j < divisions && hash(localBase + 3.0) <= segmentKeep * 0.92) {
              const strength = clamp01(activity * (0.78 + hash(localBase + 3.2) * 0.38));
              pushRibbon(p0, pointAt(i, j + 1), normal, colourFor(strength, localBase + 3.4), halfWidth * (0.82 + hash(localBase + 3.6) * 0.72), lift);
            }
            if (j > 0 && i + j < divisions && hash(localBase + 4.0) <= segmentKeep * 0.84) {
              const strength = clamp01(activity * (0.76 + hash(localBase + 4.2) * 0.42));
              pushRibbon(p0, pointAt(i + 1, j - 1), normal, colourFor(strength, localBase + 4.4), halfWidth * (0.82 + hash(localBase + 4.6) * 0.72), lift);
            }
          }
        }
      }

      if (!positions.length) return null;
      const geometry = new D.BufferGeometry();
      geometry.setAttribute("position", new D.Float32BufferAttribute(positions, 3));
      geometry.setAttribute("color", new D.Float32BufferAttribute(colours, 3));
      geometry.computeBoundingSphere();
      const material = new D.ShaderMaterial({
        transparent: !0,
        depthTest: !0,
        depthWrite: !1,
        toneMapped: !1,
        side: D.DoubleSide,
        polygonOffset: !0,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
        vertexShader: `
          attribute vec3 color;
          varying vec3 vSkinColour;
          void main() {
            vSkinColour = color;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vSkinColour;
          void main() {
            gl_FragColor = vec4(vSkinColour, 0.80);
            #include <colorspace_fragment>
          }
        `
      });
      const overlay = new D.Mesh(geometry, material);
      overlay.name = "rf-fork-gap-blended-mid-lower-exterior-skin";
      overlay.renderOrder = 1;
      overlay.frustumCulled = !1;
      overlay.userData.rfExteriorSkinOnly = !0;
      overlay.userData.rfExteriorSkinSelectedFaces = selectedFaces;
      overlay.userData.rfExteriorSkinRibbonVertexCount = positions.length / 3;
      overlay.userData.rfExteriorSkinBand = [0.025, 0.81];
      overlay.userData.rfForkGapBlend = !0;
      return overlay;
    }
    function PD(D) {
      let A = ZD(D), E = H.center;
      A.translate(-E[0], -H.boundsMin[1], -E[2]);
      let C = kD(D, A);
      A.dispose();
      let B = sD(D);
      C.computeBoundingBox(), C.boundingBox && (B.uniforms.uMinY.value = C.boundingBox.min.y, B.uniforms.uMaxY.value = C.boundingBox.max.y);
      let h = new D.Mesh(C, B), x = mD(D, C);
      return x && (h.add(x), h.userData.rfExteriorSkinRibbonVertexCount = x.userData.rfExteriorSkinRibbonVertexCount, h.userData.rfExteriorSkinSelectedFaces = x.userData.rfExteriorSkinSelectedFaces), h.name = "rf-two-layer-topology-forks-360-mesh", h.renderOrder = 0, h.userData.rfTwoLayerTopologyForks360Mesh = !0, h.userData.rfTwoLayerTopologyForks360MeshVersion = G, h.userData.rfExteriorSkinOnly = !0, h;
    }
    async function ND(D, A, E) {
      let { frame: C, canvas: B, hint: F } = A, h = await FD();
      if (E.destroyed) return { destroy() {
      } };
      let x = window.matchMedia("(max-width: 760px)").matches, g = new h.WebGLRenderer({ canvas: B, alpha: !1, antialias: !0, powerPreference: "high-performance" });
      g.setClearColor(0x01090e, 1), g.outputColorSpace = h.SRGBColorSpace, g.toneMapping = h.ACESFilmicToneMapping, g.toneMappingExposure = 1.02;
      let c = new h.Scene();
      c.background = new h.Color(0x01090e), c.fog = new h.Fog(0x01090e, 30, 92);
      let o = new h.PerspectiveCamera(45, 1, 0.1, 180), V = PD(h);
      V.scale.setScalar(18), c.add(V), V.updateMatrixWorld(!0);
      let s = new h.Box3().setFromObject(V), U = s.getSize(new h.Vector3()), I = s.getCenter(new h.Vector3()), a = new h.Vector3(I.x, s.min.y + U.y * 0.48, I.z), l = Math.max(U.x, U.z) * 0.92, n = U.y * 0.1, Q = { azimuth: X, velocity: 0, dragging: !1, pointerId: null, lastX: 0, lastTime: 0, destroyed: !1, width: 0, height: 0, animationFrame: 0 };
      function p() {
        let R = C.getBoundingClientRect(), w = Math.min(window.devicePixelRatio || 1, x ? 1.45 : 1.7), M = Math.max(1, Math.round(R.width * w)), N = Math.max(1, Math.round(R.height * w));
        Q.width === M && Q.height === N || (Q.width = M, Q.height = N, g.setPixelRatio(w), g.setSize(R.width, R.height, !1), o.aspect = M / N, o.updateProjectionMatrix());
      }
      function _() {
        if (Q.destroyed) return;
        p(), V.material?.uniforms?.uTime && (V.material.uniforms.uTime.value = performance.now() * 0.001), !Q.dragging && Math.abs(Q.velocity) > 1e-3 && (Q.azimuth += Q.velocity, Q.velocity *= 0.92);
        let R = Q.azimuth % 360 * L, w = Q.width / Math.max(1, Q.height);
        o.fov = w < 0.82 ? 48 : w < 1.12 ? 46 : 44;
        let M = o.fov * L, N = 2 * Math.atan(Math.tan(M / 2) * Math.max(w, 0.35)), DD = Math.max(U.x, U.z) / (2 * Math.tan(Math.max(N, 0.18) / 2)), OD = U.y / (2 * Math.tan(Math.max(M, 0.18) / 2)), xD = Math.max(l * 1.10, DD * 1.23, OD * 1.34);
        o.position.set(a.x + Math.sin(R) * xD, a.y + n, a.z + Math.cos(R) * xD), o.lookAt(a), g.render(c, o), Q.animationFrame = window.requestAnimationFrame(_);
      }
      function $(R) {
        J(F), Q.dragging = !0, Q.pointerId = R.pointerId, Q.lastX = R.clientX, Q.lastTime = performance.now(), Q.velocity = 0, B.setPointerCapture(R.pointerId), B.style.cursor = "grabbing", R.preventDefault();
      }
      function P(R) {
        if (!Q.dragging || R.pointerId !== Q.pointerId) return;
        let w = performance.now(), M = R.clientX - Q.lastX, N = Math.max(1, w - Q.lastTime), DD = M * 0.3;
        Q.azimuth += DD, Q.velocity = DD / N * 16, Q.lastX = R.clientX, Q.lastTime = w, R.preventDefault();
      }
      function S(R) {
        R.pointerId === Q.pointerId && (Q.dragging = !1, Q.pointerId = null, B.style.cursor = "grab", B.hasPointerCapture(R.pointerId) && B.releasePointerCapture(R.pointerId));
      }
      function K(R) {
        ["ArrowLeft", "ArrowRight", "Home"].includes(R.key) && (J(F), R.key === "Home" ? (Q.azimuth = X, Q.velocity = 0) : Q.azimuth += R.key === "ArrowLeft" ? -8 : 8, R.preventDefault());
      }
      B.addEventListener("pointerdown", $), B.addEventListener("pointermove", P), B.addEventListener("pointerup", S), B.addEventListener("pointercancel", S), B.addEventListener("keydown", K), B.addEventListener("dblclick", () => {
        J(F), Q.azimuth = X, Q.velocity = 0;
      });
      let u = new ResizeObserver(p);
      return u.observe(C), window.setTimeout(() => J(F), 2600), D.dataset.rfGraphLoaded = "true", D.dataset.rfGraphVersion = G, D.dataset.rfGraphMode = Y, D.dispatchEvent(new CustomEvent(Z, { bubbles: !0, detail: { version: G, selectedPathId: r, mode: Y } })), Q.animationFrame = window.requestAnimationFrame(_), { destroy() {
        Q.destroyed = !0, E.destroyed = !0, window.cancelAnimationFrame(Q.animationFrame), u.disconnect(), B.removeEventListener("pointerdown", $), B.removeEventListener("pointermove", P), B.removeEventListener("pointerup", S), B.removeEventListener("pointercancel", S), B.removeEventListener("keydown", K), g.dispose(), c.traverse((R) => {
          R.geometry?.dispose?.(), Array.isArray(R.material) ? R.material.forEach((w) => w?.dispose?.()) : R.material?.dispose?.();
        });
      } };
    }
    async function wD(D) {
      if (!D || D.dataset.rfGraphInit === G) return;
      D._rfGraphViewer?.destroy && D._rfGraphViewer.destroy(), D.dataset.rfGraphInit = G, q(D), y(D);
      let A = { destroyed: !1 }, E = QD(D);
      try {
        D._rfGraphViewer = await ND(D, E, A);
      } catch (C) {
        BD(D, C);
      }
    }
    function hD(D = document) {
      D.querySelectorAll(t).forEach((A) => wD(A));
    }
    window.FieldOpsRFGraph = { VERSION: G, META: H, renderMeshes: 1, init: wD, initAll: hD }, document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => hD(), { once: !0 }) : hD();
  })();
})().catch((i) => {
  console.error("FieldOps RF Builder 3 failed to initialize embedded Three.js runtime:", i);
});

})();
