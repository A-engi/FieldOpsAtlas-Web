#!/usr/bin/env node
"use strict";
const fs=require("fs"),vm=require("vm"),path=require("path");
const root=path.join(__dirname,"../FieldOpsAtlas/Features/Tools/calculators");
const ctx={console,Math,Number,String,Array,Object,JSON,Date,RegExp,parseFloat,parseInt,Infinity,NaN,isFinite};ctx.window=ctx;vm.createContext(ctx);
for(const file of ["calculator-helpers.js","general.js","rf.js","electronics.js","electrical.js","broadcast.js","instruments.js","cable.js","sensors.js"]){vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),ctx,{filename:file});}
const registry=ctx.FieldOpsCalculatorRegistry;
const byId=new Map(registry.map(c=>[c.id,c]));
const nums=s=>[...String(s).matchAll(/(?<![A-Za-z])[-+]?\d*\.?\d+(?:e[-+]?\d+)?(?![A-Za-z])/gi)].map(m=>Number(m[0]));
const merged=o=>nums(`${o.primary} ${o.secondary}`);
const close=(a,b,tol=2e-5)=>Number.isFinite(a)&&Math.abs(a-b)<=Math.max(1e-9,tol*Math.abs(b));
const C=299792458,k=1.380649e-23;
const cases=[];
const add=(id,input,expect,contains=[])=>cases.push({id,input,expect,contains});

// General
add("percentage-change",{old:100,new:125},[25,25]);
add("percentage-difference",{a:100,b:110},[Math.abs(100-110)/105*100]);
add("reverse-percentage",{final:120,percent:20},[100]);
add("ratio-proportion",{a:2,b:3,c:10},[15]);
add("arithmetic-mean",{values:"1,2,3"},[2,1,3,3]);
add("weighted-average",{values:"10,20",weights:"1,3"},[17.5]);
add("standard-deviation",{values:"1,2,3"},[Math.sqrt(2/3),1]);
add("linear-interpolation",{x1:0,y1:0,x2:10,y2:100,x:4},[40]);
add("significant-figures",{value:12345.678,digits:4},[12350]);
add("pythagoras",{a:3,b:4},[5]);
add("right-triangle",{a:3,b:4},[5,Math.atan2(3,4)*180/Math.PI,90-Math.atan2(3,4)*180/Math.PI]);
add("circle",{radius:1},[Math.PI,2*Math.PI]);
add("cylinder",{radius:1,height:2},[2*Math.PI,6*Math.PI]);
add("speed-distance-time",{speed:60,time:2},[120]);
add("density-mass-volume",{mass:1000,volume:1},[1000]);
add("journey-cost",{distance:100,mpg:40,price:1.45},[100/40*4.54609*1.45,100/40*4.54609]);

// RF
add("dbm-watts",{mode:"dbm",value:30},[1], ["W"]);
add("dbm-watts",{mode:"w",value:10},[40], ["dBm"]);
add("dbw-watts",{mode:"dbw",value:0},[1],["W"]);
add("dbw-watts",{mode:"w",value:100},[20],["dBW"]);
add("db-power-ratio",{mode:"db",value:3},[10**0.3]);
add("db-power-ratio",{mode:"ratio",value:10},[10]);
add("db-voltage-ratio",{mode:"db",value:6},[10**0.3]);
add("db-voltage-ratio",{mode:"ratio",value:2},[20*Math.log10(2)]);
add("db-power-change",{power:10,db:-3},[10*10**(-.3),40-3]);
add("db-voltage-change",{voltage:1,db:6},[10**.3]);
add("vswr-return-loss",{vswr:1.5},[-20*Math.log10(.2),.2,-10*Math.log10(1-.04)]);
add("return-loss-vswr",{rl:20},[(1+.1)/(1-.1),.1]);
add("forward-reflected-vswr",{forward:100,reflected:1},[(1+.1)/(1-.1),20]);
add("mismatch-loss",{gamma:.2},[-10*Math.log10(.96),96]);
add("wavelength",{frequency:100},[C/1e8,C/2e8,C/4e8*1000]);
add("dipole-length",{frequency:100,factor:1},[C/1e8/2,C/1e8/4*1000]);
add("quarter-wave",{frequency:100,factor:1},[C/1e8/4*1000]);
add("fspl",{frequency:600,distance:10},[32.44+20*Math.log10(600)+20]);
add("friis-received",{pt:30,gt:10,gr:10,loss:2,frequency:600,distance:10},[30+10+10-2-(32.44+20*Math.log10(600)+20)]);
add("link-budget",{pt:30,gt:10,path:108,gr:10,loss:2,sensitivity:-95},[-60,35]);
add("fade-margin",{received:-70,threshold:-90},[20]);
add("fresnel-zone",{frequency:2.4,d1:5,d2:5},[17.32*Math.sqrt(25/(2.4*10)),17.32*Math.sqrt(25/(2.4*10))*.6]);
add("radio-horizon",{h1:30,h2:30},[4.12*(Math.sqrt(30)+Math.sqrt(30))]);
add("erp-eirp",{power:100,gain:6,loss:2},[100*10**.4,100*10**.4*10**.215]);
add("field-strength-eirp",{eirp:100,distance:100},[Math.sqrt(3000)/100,20*Math.log10(Math.sqrt(3000)/100*1e6)]);
add("power-density",{eirp:100,distance:100},[100/(4*Math.PI*10000)]);
add("effective-aperture",{gain:10,frequency:600},[10*(C/600e6)**2/(4*Math.PI)]);
const nw=k*290*1e6; add("thermal-noise",{bandwidth:1e6,temperature:290},[10*Math.log10(nw*1000)]);
add("noise-floor",{bandwidth:1e6,nf:5},[-109]);
add("noise-temperature",{nf:3},[290*(10**.3-1)]);
add("noise-cascade",{nf1:1,g1:20,nf2:6},[10*Math.log10(10**.1+(10**.6-1)/100)]);
add("cascade-gain",{stages:"20,-3,15,-1"},[31]);
add("p1db-output",{input:0,gain:20},[19]);
add("ip3-output",{iip3:10,gain:20},[30]);
add("im3-level",{tone:0,oip3:30},[-60,60]);
add("phase-delay",{frequency:100,delay:1},[36,36]);
add("time-delay-phase",{frequency:100,phase:90},[2.5]);
add("group-delay",{phase:-36,df:1},[100]);
add("coupler-directivity",{coupling:20,isolation:40},[20]);

// Electronics
add("ohms-law",{mode:"vi",a:12,b:2.5},[12,2.5,4.8,30]);
add("electrical-power",{voltage:12,current:2.5},[30],["W"]);
add("voltage-divider",{vin:12,r1:1000,r2:1000},[6,.006]);
const q=1/(1/1000+1/10000); add("loaded-divider",{vin:12,r1:1000,r2:1000,load:10000},[12*q/(1000+q),q]);
add("resistors-series",{values:"100,220,330"},[650]);
add("resistors-parallel",{values:"100,220,330"},[1/(1/100+1/220+1/330)]);
add("thevenin",{vin:12,r1:1000,r2:2000},[8,1000*2000/3000]);
add("norton",{vth:8,rth:667},[8/667]);
add("rc-time",{r:1000,c:10,multiples:5},[.01,.05,(1-Math.exp(-5))*100]);
add("rl-time",{l:10,r:100},[.0001]);
add("lc-resonance",{l:10,c:100},[1/(2*Math.PI*Math.sqrt(10e-6*100e-12))/1e6],["MHz"]);
add("inductive-reactance",{frequency:1000,l:10},[2*Math.PI*1000*.01]);
add("capacitive-reactance",{frequency:1000,c:1},[1/(2*Math.PI*1000*1e-6)]);
const X=2*Math.PI*1000*.01-1/(2*Math.PI*1000*1e-6); add("series-rlc",{frequency:1000,r:50,l:10,c:1},[Math.hypot(50,X),Math.atan2(X,50)*180/Math.PI]);
add("rc-lowpass",{r:1000,c:100},[1/(2*Math.PI*1000*100e-9)/1e3],["kHz"]);
add("rc-highpass",{r:1000,c:100},[1/(2*Math.PI*1000*100e-9)/1e3],["kHz"]);
add("rl-lowpass",{r:50,l:10},[50/(2*Math.PI*.01)],["Hz"]);
add("opamp-inverting",{rin:1000,rf:10000,vin:.1},[-10,-1]);
add("opamp-noninverting",{rg:1000,rf:10000,vin:.1},[11,1.1]);
add("opamp-summing",{v1:1,r1:10000,v2:2,r2:10000,rf:10000},[-3]);
add("led-resistor",{supply:12,forward:2,current:20},[500,.2]);
add("zener-resistor",{supply:12,zener:5.1,current:20},[345,.138]);
add("bjt-base-resistor",{drive:5,vbe:.7,collector:100,beta:10},[430,10]);
add("555-astable",{r1:10,r2:100,c:.01},[1.44/((10+200)*1000*.01e-6),(110/210)*100]);
add("555-monostable",{r:100,c:10},[1.1]);
add("adc-resolution",{bits:12,vref:3.3},[3.3/4096,6.02*12+1.76]);
add("adc-code",{voltage:1.65,vref:3.3,bits:12},[2048,4095]);
add("dac-voltage",{code:2048,vref:3.3,bits:12},[1.65]);
add("battery-runtime",{capacity:100,voltage:12,load:100,eff:85},[10.2]);
add("capacitor-energy",{c:1000,voltage:12},[.072,.012]);
add("inductor-energy",{l:10,current:2},[.02]);
add("junction-temperature",{ambient:25,power:5,theta:20},[125]);
add("heatsink-theta",{tj:125,ambient:25,power:10,theta_jc:2,theta_cs:.5},[7.5]);
add("current-sense",{current:10,voltage:50},[.005,.5]);

// Electrical
add("single-phase-power",{voltage:230,current:10,pf:.9},[2.07,2.3,2.3*Math.sqrt(1-.81)]);
add("three-phase-power",{voltage:400,current:10,pf:.9},[Math.sqrt(3)*400*10*.9/1000,Math.sqrt(3)*4,Math.sqrt(3)*4*Math.sqrt(1-.81)]);
add("single-phase-current",{power:2,voltage:230,pf:.9},[2000/(230*.9)]);
add("three-phase-current",{power:10,voltage:400,pf:.9},[10000/(Math.sqrt(3)*400*.9)]);
add("kva-current",{phase:"three",kva:10,voltage:400},[10000/(Math.sqrt(3)*400)]);
add("power-factor",{kw:8,kva:10},[.8,Math.acos(.8)*180/Math.PI]);
add("pf-correction",{kw:100,pf1:.75,pf2:.95},[100*(Math.tan(Math.acos(.75))-Math.tan(Math.acos(.95)))]);
add("pf-capacitance",{phase:"single",kvar:10,voltage:400,frequency:50},[10000/(2*Math.PI*50*400**2)*1e6]);
add("voltage-drop-single",{current:10,length:50,resistance:7.41,voltage:230},[7.41,7.41/230*100]);
const d3=Math.sqrt(3)*10*7.41*50/1000; add("voltage-drop-three",{current:10,length:50,resistance:7.41,voltage:400},[d3,d3/400*100]);
add("conductor-resistance",{rho:.01724,length:100,area:2.5},[.6896]);
add("copper-temperature",{r1:1,t1:20,t2:75},[(234.5+75)/(234.5+20)]);
add("fault-current",{voltage:230,impedance:.5},[460]);
add("short-circuit-mva",{voltage:11,current:10},[Math.sqrt(3)*110]);
add("transformer-current",{phase:"three",kva:100,voltage:400},[100000/(Math.sqrt(3)*400)]);
add("transformer-turns",{primary:1000,secondary:100,voltage:230,current:1},[23,10]);
add("transformer-regulation",{noLoad:240,fullLoad:230},[(10/230)*100]);
add("ct-ratio",{primary:400,ratedPrimary:500,ratedSecondary:5},[4]);
add("ct-burden",{current:5,resistance:.2},[5]);
add("motor-current",{power:7.5,voltage:400,eff:90,pf:.85},[7500/(Math.sqrt(3)*400*.9*.85)]);
add("synchronous-speed",{frequency:50,poles:4},[1500]);
add("motor-slip",{sync:1500,running:1450},[(50/1500)*100]);
add("generator-frequency",{rpm:1500,poles:4},[50]);
add("energy-cost",{power:2,hours:8,tariff:.3},[4.8,16]);
add("demand-factor",{demand:80,connected:100},[80]);
add("load-factor",{average:50,peak:100},[50]);
add("battery-bank",{cellVoltage:12,cellAh:100,series:2,parallel:3},[24,300,7.2]);
add("ups-runtime",{voltage:48,ah:100,load:1000,eff:85},[4.08]);
add("capacitor-bank-energy",{capacitance:.1,voltage:400},[8000]);

// Broadcast
add("dtt-channel",{channel:32},[562,558,566]);
add("dtt-wavelength",{channel:32},[C/562e6*1000]);
add("dab-block",{block:"12B"},[225.648]);
add("fm-carson",{deviation:75,audio:15},[180]);
add("fm-mod-index",{deviation:75,audio:15},[5]);
add("satellite-if",{mode:"low",rf:12000,lo:9750},[2250]);
const lam=C/12e9; add("dish-gain",{diameter:1.2,frequency:12,eff:60},[10*Math.log10(.6*(Math.PI*1.2/lam)**2)]);
add("dish-beamwidth",{diameter:1.2,frequency:12},[70*lam/1.2]);
add("symbol-bitrate",{symbols:6.9,bits:2,code:.75},[10.35]);
add("dvbs-bandwidth",{symbols:27.5,rolloff:.35},[37.125]);
add("mer-evm",{mode:"mer",value:30},[100*10**(-1.5)]);
add("cn-ebn0",{mode:"cn",value:12,bandwidth:8,bitrate:20},[12+10*Math.log10(8/20)]);
add("transport-storage",{bitrate:20,hours:1},[9]);

// Instruments
add("scope-bandwidth",{rise:5,factor:.35},[70],["MHz"]);
add("scope-rise-time",{bandwidth:100,factor:.35},[3.5]);
add("sample-rate",{bandwidth:100,samples:10},[1000]);
add("record-length",{time:10,rate:100},[1e6]);
add("fft-bin",{rate:100,points:65536},[100e6/65536/1e3],["kHz"]);
add("rbw-correction",{level:-90,rbw1:10000,rbw2:1000},[-100]);
add("generator-correction",{wanted:-10,cable:2,pad:10},[2]);
add("dmm-loading",{source:1e6,meter:10,voltage:10},[10*10e6/11e6,(1-10e6/11e6)*100]);
add("probe-loading",{frequency:10,capacitance:10},[1/(2*Math.PI*10e6*10e-12)]);
add("uncertainty-rss",{values:"0.5,0.2,0.1"},[Math.sqrt(.3)]);

// Cable
add("cable-loss",{length:50,rate:6.6},[3.3]);
add("cable-system-loss",{cable:3.3,connectors:2,perConnector:.1,other:0},[3.5]);
add("cable-delay",{length:100,vf:.85},[100/(C*.85)*1e9]);
add("cable-electrical-length",{length:1,vf:.85,frequency:100},[1/(C*.85/100e6)*360]);
add("quarter-wave-cable",{frequency:100,vf:.85},[C/100e6*.85/4*1000]);
add("coax-impedance",{outer:7.25,inner:1.63,er:2.25},[60/1.5*Math.log(7.25/1.63)]);
add("fibre-budget",{length:10,atten:.35,connectors:2,connectorLoss:.5,splices:4,spliceLoss:.1,budget:15},[4.9,10.1]);

// Sensors
add("loop-4-20",{current:12,low:0,high:100},[50]);
add("loop-4-20-reverse",{value:50,low:0,high:100},[12]);
add("voltage-scaling",{voltage:5,low:0,high:100},[50]);
add("pt100",{resistance:119.4},[(1.194-1)/.00385]);
add("pt1000",{resistance:1194},[(1.194-1)/.00385]);
add("thermistor-beta",{resistance:5000,r0:10000,t0:25,beta:3950},[1/(1/298.15+Math.log(.5)/3950)-273.15]);
add("two-point-calibration",{x1:4,y1:0,x2:20,y2:100,x:12},[50,6.25,-25]);

let failures=[];
for(const tc of cases){const calc=byId.get(tc.id);if(!calc){failures.push(`${tc.id}: calculator missing`);continue;}let out;try{out=calc.compute(Object.fromEntries(Object.entries(tc.input).map(([k,v])=>[k,String(v)])));}catch(e){failures.push(`${tc.id}: threw ${e.message}`);continue;}if(!out||!out.ok){failures.push(`${tc.id}: returned failure ${JSON.stringify(out)}`);continue;}const got=merged(out);for(let i=0;i<tc.expect.length;i++){if(!close(got[i],tc.expect[i]))failures.push(`${tc.id}: number ${i+1} got ${got[i]} expected ${tc.expect[i]} | ${out.primary} | ${out.secondary}`);}for(const text of tc.contains){if(!(`${out.primary} ${out.secondary}`).includes(text))failures.push(`${tc.id}: missing text ${text}`);}}

// Edge and validation tests on actual functions
const edge=[];const edgeFail=(id,input)=>{const o=byId.get(id).compute(input);if(o.ok)edge.push(`${id}: expected rejection but got ${o.primary}`);};
edgeFail("dbm-watts",{mode:"dbm",value:""});
edgeFail("arithmetic-mean",{values:"1,bad,3"});
edgeFail("standard-deviation",{values:"1,bad,3"});
edgeFail("single-phase-current",{power:"2",voltage:"230",pf:"1.2"});
edgeFail("three-phase-current",{power:"10",voltage:"400",pf:"1.2"});
edgeFail("motor-current",{power:"7.5",voltage:"400",eff:"110",pf:"0.85"});
edgeFail("battery-runtime",{capacity:"100",voltage:"12",load:"100",eff:"110"});
edgeFail("ups-runtime",{voltage:"48",ah:"100",load:"1000",eff:"110"});
edgeFail("cable-loss",{length:"50",rate:"-1"});
edgeFail("fibre-budget",{length:"-1",atten:".35",connectors:"2",connectorLoss:".5",splices:"4",spliceLoss:".1",budget:"15"});
const dmm0=byId.get("dmm-loading").compute({source:"1000000",meter:"10",voltage:"0"});if(!dmm0.ok||/—|NaN|Infinity/.test(dmm0.secondary))edge.push(`dmm-loading zero-voltage edge failed: ${JSON.stringify(dmm0)}`);
const negPower=byId.get("electrical-power").compute({voltage:"-12",current:"2"});if(!negPower.ok||!negPower.primary.includes("-24 W"))edge.push(`electrical-power signed formatting failed: ${JSON.stringify(negPower)}`);
const zeroDemand=byId.get("demand-factor").compute({demand:"0",connected:"100"});if(!zeroDemand.ok||!zeroDemand.primary.startsWith("0"))edge.push(`demand-factor zero edge failed: ${JSON.stringify(zeroDemand)}`);
const zeroSlip=byId.get("motor-slip").compute({sync:"1500",running:"0"});if(!zeroSlip.ok||!zeroSlip.primary.startsWith("100"))edge.push(`motor-slip zero-speed edge failed: ${JSON.stringify(zeroSlip)}`);

const covered=new Set(cases.map(x=>x.id));const missing=registry.filter(c=>!covered.has(c.id)).map(c=>c.id);
const summary={registryCount:registry.length,uniqueCalculators:covered.size,knownValueCases:cases.length,numericAssertions:cases.reduce((s,x)=>s+x.expect.length,0),missingCoverage:missing,failures,edgeFailures:edge};
console.log(JSON.stringify(summary,null,2));
process.exit(failures.length||edge.length||missing.length?1:0);
