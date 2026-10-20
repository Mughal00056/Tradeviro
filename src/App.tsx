
// @ts-nocheck
import {useState,useEffect,useRef,useMemo,useCallback} from 'react';
import './index.css';

/* ---------- helpers ---------- */
const pad=n=>String(n).padStart(2,'0');
const money=n=>(n<0?'-':'')+'$'+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const hms=(t,s=true)=>{const d=new Date(t);return pad(d.getUTCHours())+':'+pad(d.getUTCMinutes())+(s?':'+pad(d.getUTCSeconds()):'')};
const mmss=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return pad(Math.floor(s/60))+':'+pad(s%60)};
const lsGet=(k,d)=>{try{const s=localStorage.getItem(k);return s?JSON.parse(s):d}catch(e){return d}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const hash=s=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h};
function randn(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}

/* ---------- icons ---------- */
const P={
chart:'M3 3v18h18 M7 15l4-4 3 3 5-6',briefcase:'M3 8h18v12H3z M9 8V5h6v3 M3 13h18',
history:'M3 12a9 9 0 1 0 3-6.7 M3 4v5h5 M12 8v5l3 2',trophy:'M8 4h8v5a4 4 0 0 1-8 0z M8 6H4v2a3 3 0 0 0 4 3 M16 6h4v2a3 3 0 0 1-4 3 M12 13v4 M8 20h8 M10 17h4',
menu:'M4 7h16 M4 12h16 M4 17h16',x:'M6 6l12 12 M18 6L6 18',search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-5-5',
star:'M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.3l1-6.2L3 9.7l6.2-.9z',
chevD:'M6 9l6 6 6-6',chevU:'M6 15l6-6 6 6',chevR:'M9 6l6 6-6 6',
upr:'M6 18L18 6 M8 6h10v10',dnr:'M6 6l12 12 M18 8v10H8',arrowR:'M5 12h14 M13 6l6 6-6 6',
user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 20c0-4 4-6 8-6s8 2 8 6',
wallet:'M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M3 7l2-3h12 M16 13h3',card:'M3 6h18v12H3z M3 10h18',
bars:'M5 20V10 M12 20V4 M19 20v-7',help:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7 M12 17h.01',
heart:'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',flag:'M5 21V4 M5 4h12l-2 4 2 4H5',
gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2L10 21h4l.6-2.6c.7-.3 1.4-.7 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z',
logout:'M9 4H5v16h4 M16 8l4 4-4 4 M20 12H9',sliders:'M4 8h10 M18 8h2 M4 16h2 M10 16h10 M16 6v4 M8 14v4',
swap:'M7 4L3 8l4 4 M3 8h14 M17 20l4-4-4-4 M21 16H7',clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
info:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5 M12 8h.01',plus:'M12 5v14 M5 12h14',minus:'M5 12h14',
check:'M5 12l5 5 9-10',shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',list:'M8 6h12 M8 12h12 M8 18h12 M4 6h.01 M4 12h.01 M4 18h.01',bolt:'M13 3L5 14h6l-1 7 8-11h-6z',calendar:'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4',candles:'M7 4v3 M7 15v4 M5 7h4v8H5z M17 7v3 M17 17v3 M15 10h4v7h-4z',pulse:'M3 12h4l3-8 4 16 3-8h4',pencil:'M4 20l1-5L16 4l4 4L9 19z M14 6l4 4',undo:'M9 14L4 9l5-5 M4 9h10a6 6 0 0 1 0 12h-3',redo:'M15 14l5-5-5-5 M20 9H10a6 6 0 0 0 0 12h3',palette:'M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2-.6-1.2.2-2.5 1.6-2.5H17a4 4 0 0 0 4-4c0-5-4-9.5-9-9.5z M7.5 11h.01 M10 7.5h.01 M14 7.5h.01 M17 11h.01'};
function Icon({n,s=18,fill,sw=1.8}){return <svg viewBox="0 0 24 24" width={s} height={s} fill={fill?'currentColor':'none'} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]}/></svg>}

/* ---------- assets ---------- */
const CCY={EUR:'#2f5bd8',USD:'#2e8b57',GBP:'#b8344a',AUD:'#c99416',CAD:'#d6403a',CHF:'#c23a3a',NZD:'#1e3a6e',SGD:'#d9544f',JPY:'#8b8fa3'};
const PAL=['#e8590c','#7048e8','#1c7ed6','#0ca678','#d6336c','#f08c00','#364fc7','#2b8a3e'];
const ASSETS=[];
const fx=(a,b,base,pay,vol=0.00005)=>ASSETS.push({id:a+b,name:`${a}/${b} (OTC)`,cat:'Currency pairs',base,dec:b==='JPY'?3:5,vol,pay,pair:[a,b]});
fx('EUR','USD',1.0966,82);fx('EUR','AUD',1.6420,92);fx('EUR','CAD',1.4880,92);fx('EUR','CHF',0.9650,92);fx('EUR','GBP',0.8590,92);fx('EUR','NZD',1.7810,92);fx('EUR','SGD',1.4720,92);
fx('GBP','AUD',1.9120,92);fx('GBP','CAD',1.7320,92);fx('GBP','CHF',1.1230,92);fx('GBP','USD',1.2760,88);fx('USD','JPY',150.20,88,0.00005);fx('AUD','USD',0.6680,88);fx('USD','CAD',1.3570,88);fx('USD','CHF',0.8800,88);fx('NZD','USD',0.6160,88);
const ot=(cat,name,base,pay,vol,dec,ini)=>ASSETS.push({id:name.replace(/\W/g,''),name:name+' (OTC)',cat,base,dec,vol,pay,ini:ini||name.slice(0,2).toUpperCase()});
ot('Crypto','Bitcoin',67200,88,0.00022,2,'BT');ot('Crypto','Ethereum',3480,88,0.00026,2,'ET');ot('Crypto','Solana',172,88,0.00034,2,'SO');ot('Crypto','Binance Coin',590,88,0.00024,2,'BN');
ot('Crypto','Aptos',9.4,85,0.0004,3,'AP');ot('Crypto','Arbitrum',1.12,85,0.0004,4,'AR');ot('Crypto','Avalanche',36.5,85,0.00036,3,'AV');ot('Crypto','Bitcoin Cash',465,85,0.0003,2,'BC');
ot('Crypto','Celestia',6.8,85,0.0004,3,'CE');ot('Crypto','XRP',0.52,85,0.00032,4,'XR');ot('Crypto','Dogecoin',0.158,85,0.00038,5,'DO');ot('Crypto','Litecoin',84.2,85,0.0003,2,'LT');
ot('Commodities','Gold',2385,82,0.00012,2,'AU');ot('Commodities','Silver',28.4,82,0.00018,3,'AG');ot('Commodities','Platinum',985,82,0.00016,2,'PT');ot('Commodities','Palladium',1010,82,0.0002,2,'PD');
ot('Commodities','UK Brent',84.3,82,0.00018,2,'BR');ot('Commodities','US Crude',80.1,82,0.0002,2,'CL');ot('Commodities','Copper',4.52,80,0.00016,4,'CU');
[['Apple',226,'AP'],['Microsoft',428,'MS'],['Tesla',252,'TS'],['NVIDIA',118,'NV'],['Google',172,'GO'],['Meta',502,'ME'],['Netflix',640,'NF'],['Amazon',184,'AZ'],['Nike',78,'NK'],['Visa',275,'VI'],['Walmart',68,'WM'],['Boeing',172,'BA'],['Coca-Cola',63,'KO'],['Disney',96,'DS'],['Intel',31,'IN'],['JPMorgan',205,'JP'],['McDonalds',292,'MC'],['Pfizer',29,'PF']].forEach(([n,b,i])=>ot('Stocks',n==='McDonalds'?"McDonald's":n,b,85,0.00024,2,i));

/* ---- 500+ assets ---- */
const ids0=new Set(ASSETS.map(a=>a.id));
const ot2=(cat,name,base,pay,vol,dec,ini)=>{const id=name.replace(/\W/g,'');if(ids0.has(id))return;ids0.add(id);ot(cat,name,base,pay,vol,dec,ini)};
const dec4=v=>v>=100?2:v>=1?3:v>=0.1?4:v>=0.001?5:8;
const USD_PER={USD:1,EUR:.912,GBP:.784,AUD:1.497,CAD:1.357,CHF:.88,NZD:1.623,SGD:1.34,JPY:150.2,NOK:10.7,SEK:10.5,DKK:6.8,PLN:4.0,MXN:17.0,ZAR:18.4,TRY:32,HKD:7.8,INR:83,CNY:7.2,BRL:5.1,THB:36,KRW:1340,CZK:23,HUF:360,ILS:3.7};
const ORDER=['EUR','GBP','AUD','NZD','USD','CAD','CHF','JPY','SGD','NOK','SEK','DKK','PLN','MXN','ZAR','TRY','HKD','INR','CNY','BRL','THB','KRW','CZK','HUF','ILS'];
for(let i=0;i<ORDER.length;i++)for(let j=i+1;j<ORDER.length;j++){const A=ORDER[i],B=ORDER[j],id=A+B;if(ids0.has(id))continue;ids0.add(id);
  const base=USD_PER[B]/USD_PER[A];ASSETS.push({id,name:`${A}/${B} (OTC)`,cat:'Currency pairs',base,dec:base>50?3:base>10?4:5,vol:0.00005+(hash(id)%5)*0.00001,pay:80+hash(id)%13,pair:[A,B]})}
'Cardano:0.45,Polkadot:7,Chainlink:14,Polygon:0.7,Cosmos:8.5,Near Protocol:6,Uniswap:8,Stellar:0.11,Tron:0.12,Toncoin:6.5,Shiba Inu:0.000025,Pepe:0.000012,Filecoin:5.5,VeChain:0.035,Algorand:0.17,Hedera:0.1,Aave:95,Maker:2800,Injective:24,Optimism:2.4,Sui:1.1,Sei:0.45,Render:8,The Graph:0.28,Fantom:0.7,Monero:160,Dash:28,Zcash:30,EOS:0.8,Tezos:0.95,Neo:14,IOTA:0.2,Flow:0.8,MultiversX:35,Kava:0.7,Chiliz:0.09,Decentraland:0.45,The Sandbox:0.45,Axie Infinity:7,Gala:0.04,Immutable:1.8,Lido DAO:2,Curve DAO:0.5,Synthetix:2.5,Compound:55,PancakeSwap:2.4,Theta Network:2,Quant:100,Kaspa:0.14,Stacks:1.8,Worldcoin:3,Bonk:0.000025,Floki:0.00018,Ethereum Classic:27,Bitcoin SV:50,Helium:6,Arweave:32,ApeCoin:1.2,Mantle:0.8,Pyth Network:0.4,Jupiter:0.9,Ondo:0.8,Ethena:0.9,Dogwifhat:2.5,Terra Classic:0.00009,Zilliqa:0.02,Harmony:0.014,Loopring:0.25,Ankr:0.03,Enjin Coin:0.3,Basic Attention Token:0.23'.split(',').forEach(x=>{const [n,b]=x.split(':'),v=+b;ot2('Crypto',n,v,85,0.0004,dec4(v),n.slice(0,2).toUpperCase())});
'Natural Gas:2.6,Wheat:5.9,Corn:4.5,Soybeans:11.8,Coffee:2.3,Sugar:0.19,Cocoa:7000,Cotton:0.8,Lumber:520,Heating Oil:2.7,Gasoline:2.5,Orange Juice:2.5,Live Cattle:1.8,Rice:15,Rhodium:4700,Aluminum:2500,Zinc:2900,Nickel:18500,Tin:32000,Lead:2100'.split(',').forEach(x=>{const [n,b]=x.split(':'),v=+b;ot2('Commodities',n,v,80,0.0002,dec4(v),n.slice(0,2).toUpperCase())});
'S&P 500:5300,Nasdaq 100:18500,Dow Jones:39500,Russell 2000:2050,DAX 40:18500,FTSE 100:8200,CAC 40:8000,Euro Stoxx 50:4900,IBEX 35:11000,FTSE MIB:34000,SMI:11700,Nikkei 225:38500,Hang Seng:17500,Shanghai Composite:3100,ASX 200:7800,KOSPI:2700,Nifty 50:22500,Sensex:74000,Bovespa:128000,TSX Composite:22000,VIX:15,US Dollar Index:104,Straits Times:3300,Taiwan Weighted:20000'.split(',').forEach(x=>{const [n,b]=x.split(':');ot2('Indices',n,+b,86,0.00014,2,n.slice(0,2).toUpperCase())});
'Adobe:520,Salesforce:260,Oracle:125,IBM:185,Cisco:48,Qualcomm:170,AMD:160,Broadcom:1300,Texas Instruments:190,Micron:110,Applied Materials:200,Lam Research:900,Uber:70,Airbnb:140,PayPal:62,Block:70,Shopify:70,Spotify:300,Snap:11,Pinterest:35,Zoom:62,Palantir:25,Snowflake:150,CrowdStrike:310,Datadog:120,Coinbase:230,Robinhood:20,Roblox:40,Electronic Arts:140,Take-Two:150,Sony:85,Toyota:230,Honda:33,Ford:12,General Motors:45,Rivian:12,Lucid:3,NIO:5,Alibaba:75,Baidu:100,JD.com:28,PDD Holdings:130,TSMC:150,ASML:900,SAP:190,Siemens:180,Volkswagen:120,BMW:95,Mercedes-Benz:70,Airbus:150,Bank of America:38,Citigroup:62,Wells Fargo:58,Goldman Sachs:450,Morgan Stanley:95,American Express:230,Mastercard:450,BlackRock:800,Charles Schwab:70,Berkshire Hathaway:410,HSBC:40,Barclays:3,UBS:28,Deutsche Bank:17,Santander:5,Johnson & Johnson:150,UnitedHealth:480,Eli Lilly:780,Merck:125,AbbVie:170,Novartis:100,AstraZeneca:70,Moderna:120,Novo Nordisk:130,Abbott:105,Thermo Fisher:570,Amgen:300,Gilead:70,Bristol-Myers:50,Medtronic:85,CVS Health:60,Procter & Gamble:165,PepsiCo:175,Starbucks:85,Costco:800,Home Depot:350,Lowes:220,Target:160,Adidas:220,LVMH:800,Chipotle:60,Lululemon:350,Estee Lauder:130,Colgate:90,Kraft Heinz:36,Mondelez:70,Philip Morris:100,Unilever:48,Nestle:100,Diageo:33,Heineken:90,AB InBev:60,Marriott:240,Hilton:205,Booking:3800,Expedia:130,Delta Air Lines:50,United Airlines:55,American Airlines:13,Southwest:28,Ryanair:20,Carnival:16,Royal Caribbean:140,Yum Brands:135,Dominos:500,Dollar General:140,eBay:52,Etsy:65,Wayfair:40,Exxon Mobil:115,Chevron:160,ConocoPhillips:125,BP:36,TotalEnergies:70,Shell:33,Schlumberger:52,Caterpillar:340,Deere:400,3M:100,Honeywell:200,General Electric:160,Lockheed Martin:460,RTX:100,Northrop Grumman:470,FedEx:270,UPS:150,Union Pacific:240,Verizon:40,AT&T:17,T-Mobile:170,Comcast:42,Warner Bros Discovery:9,Paramount:13,NextEra Energy:70,Enphase:120,First Solar:200,Intuit:640,ServiceNow:760,Workday:260,Autodesk:250,Cloudflare:80,MongoDB:300,Okta:90,Twilio:60,DoorDash:130,Lyft:15,Affirm:30,SoFi:8,Zillow:45,Carvana:120,GameStop:20,AMC Entertainment:4,Peloton:5,Beyond Meat:7,Plug Power:3,Sunrun:15,Nvidia Drive:1,Arm Holdings:130,Super Micro:900,Dell:120,HP:30,Lenovo:1,Nintendo:13,Sea Limited:70,Grab:3.5,Infosys:18,Wipro:5,Tata Motors:25,Reliance:45'.split(',').forEach(x=>{const i=x.lastIndexOf(':'),n=x.slice(0,i),v=+x.slice(i+1);ot2('Stocks',n,v,85,0.00024,v<10?3:2,n.replace(/[^A-Za-z]/g,'').slice(0,2).toUpperCase())});
const BYID={};ASSETS.forEach(a=>{a.col=PAL[hash(a.id)%PAL.length];BYID[a.id]=a});
const CATS=['Crypto','Currency pairs','Commodities','Stocks','Indices'];
const DURS=[[30,'30 sec'],[60,'1 min'],[120,'2 min'],[180,'3 min'],[300,'5 min'],[600,'10 min'],[900,'15 min']];
const MAXI=5000;
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

/* ---------- price engine ---------- */
const eng={prices:{},candles:{},open24:{},mom:{},results:[]};
const nowC=()=>Math.floor(Date.now()/5000)*5000;
function initAsset(a){
  let p=a.base*(1+(Math.random()-.5)*0.004),m=0;const arr=[],c0=nowC();
  for(let i=720;i>0;i--){const o=p;let h=p,l=p;
    for(let k=0;k<5;k++){m=m*0.9+randn()*a.vol*0.5;p=p*(1+a.vol*randn()+m+(a.base-p)/a.base*0.0015);h=Math.max(h,p);l=Math.min(l,p)}
    arr.push({t:c0-i*5000,o,h,l,c:p})}
  const first=arr[arr.length-1];arr.push({t:c0,o:first.c,h:first.c,l:first.c,c:first.c});
  eng.candles[a.id]=arr;eng.prices[a.id]=first.c;eng.mom[a.id]=0;eng.open24[a.id]=a.base*(1+(Math.random()-.5)*0.02);
}
ASSETS.forEach(initAsset);
eng.sid=Math.random().toString(36).slice(2);
function tickEngine(){
  const now=Date.now(),ct=Math.floor(now/5000)*5000,dt=0.25;
  for(const a of ASSETS){
    let p=eng.prices[a.id];
    eng.mom[a.id]=eng.mom[a.id]*0.97+randn()*a.vol*0.25*Math.sqrt(dt);
    p=p*(1+a.vol*Math.sqrt(dt)*randn()+eng.mom[a.id]+(a.base-p)/a.base*0.0015*dt);
    eng.prices[a.id]=p;
    const arr=eng.candles[a.id];let c=arr[arr.length-1];
    if(ct-c.t>720*5000){arr.length=0;arr.push({t:ct,o:p,h:p,l:p,c:p});continue}
    while(c.t+5000<=ct){const n={t:c.t+5000,o:c.c,h:c.c,l:c.c,c:c.c};arr.push(n);c=n}
    c.c=p;if(p>c.h)c.h=p;if(p<c.l)c.l=p;
    if(arr.length>1800)arr.splice(0,300);
  }
}
function agg(arr,mult){
  if(mult===1)return arr;const ms=5000*mult,out=[];let cur=null;
  for(const c of arr){const b=Math.floor(c.t/ms)*ms;
    if(!cur||cur.t!==b){cur={t:b,o:c.o,h:c.h,l:c.l,c:c.c};out.push(cur)}
    else{if(c.h>cur.h)cur.h=c.h;if(c.l<cur.l)cur.l=c.l;cur.c=c.c}}
  return out;
}
const fmtP=(id,v)=>v.toFixed(BYID[id].dec);
const chg24=id=>(eng.prices[id]/eng.open24[id]-1)*100;
const buyPct=(id,now)=>Math.round(50+16*Math.sin(now/23000+hash(id)%7)+6*Math.sin(now/5300+hash(id)%3));

/* sound */
let actx=null;
function beep(on,f=660,d=.12){if(!on)return;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(actx.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+d);o.stop(actx.currentTime+d)}catch(e){}}

/* ---------- small components ---------- */
const star=(cx,cy,r,k)=><circle key={k} cx={cx} cy={cy} r={r} fill="#fff"/>;
const JACK=<g><path d="M0 0L24 24M24 0L0 24" stroke="#fff" strokeWidth="4.5"/><path d="M0 0L24 24M24 0L0 24" stroke="#c8102e" strokeWidth="1.6"/><path d="M12 0V24M0 12H24" stroke="#fff" strokeWidth="7"/><path d="M12 0V24M0 12H24" stroke="#c8102e" strokeWidth="4.2"/></g>;
const FLAGS={
  USD:<><rect width="24" height="24" fill="#fff"/>{[0,2,4,6].map(i=><rect key={'stripe-'+i} y={i*24/7} width="24" height={24/7} fill="#c8102e"/>)}<rect width="11.500" height={24*4/7} fill="#2b3a85"/>{[[3,3],[7,3],[5,6],[9,6],[3,9],[7,9]].map(([x,y],i)=><circle key={'star-'+i} cx={x} cy={y} r=".9" fill="#fff"/>)}</>,
  EUR:<><rect width="24" height="24" fill="#1b4fb4"/>{Array.from({length:12},(_,i)=><circle key={'eu-'+i} cx={12+6.400*Math.cos(i*Math.PI/6)} cy={12+6.400*Math.sin(i*Math.PI/6)} r="1.100" fill="#ffd617"/>)}</>,
  GBP:<><rect width="24" height="24" fill="#1f3a8a"/>{JACK}</>,
  AUD:<><rect width="24" height="24" fill="#1f2f86"/><g transform="scale(.5)">{JACK}</g>{[[6,19,2],[17,17,1.200],[20,8,1.200],[13,6,1.200],[17,12,1.200]].map(([x,y,r],i)=><circle key={'aud-'+i} cx={x} cy={y} r={r} fill="#fff"/>)}</>,
  CAD:<><rect width="24" height="24" fill="#fff"/><rect width="6" height="24" fill="#d52b1e"/><rect x="18" width="6" height="24" fill="#d52b1e"/><polygon points="12,5 13.500,9.500 17.500,8.500 15,12.500 16.500,17 12.800,15.500 12.800,19 11.200,19 11.200,15.500 7.500,17 9,12.500 6.500,8.500 10.500,9.500" fill="#d52b1e"/></>,
  CHF:<><rect width="24" height="24" fill="#d52b1e"/><rect x="10" y="5" width="4" height="14" fill="#fff"/><rect x="5" y="10" width="14" height="4" fill="#fff"/></>,
  NZD:<><rect width="24" height="24" fill="#1f2f86"/><g transform="scale(.5)">{JACK}</g>{[[17,8],[20,13],[15,14],[17,19]].map(([x,y],i)=><circle key={'nzd-'+i} cx={x} cy={y} r="1.400" fill="#d52b1e" stroke="#fff" strokeWidth=".6"/>)}</>,
  SGD:<><rect width="24" height="12" fill="#ed2939"/><rect y="12" width="24" height="12" fill="#fff"/><circle cx="8" cy="6" r="4" fill="#fff"/><circle cx="9.600" cy="6" r="3.600" fill="#ed2939"/>{[[13,3.500],[15,5.500],[14.500,8.500],[11.500,9]].map(([x,y],i)=><circle key={'sgd-'+i} cx={x} cy={y} r=".9" fill="#fff"/>)}</>,
  JPY:<><rect width="24" height="24" fill="#fff"/><circle cx="12" cy="12" r="6.500" fill="#bc002d"/></>
};
const GLY={Bitcoin:['₿','#f7931a'],Ethereum:['Ξ','#627eea'],Solana:['◎','#9945ff'],BinanceCoin:['◆','#f3ba2f'],Aptos:['A','#1f2937'],Arbitrum:['◭','#28a0f0'],Avalanche:['▲','#e84142'],BitcoinCash:['₿','#0ac18e'],Celestia:['✦','#7b2bf9'],XRP:['✕','#23292f'],Dogecoin:['Ð','#c2a633'],Litecoin:['Ł','#345d9d'],Gold:['🥇','#fbe7a1'],Silver:['🥈','#e3e6ec'],Platinum:['◈','#9aa4b2'],Palladium:['◈','#7f8da3'],UKBrent:['🛢️','#d9dce3'],USCrude:['🛢️','#e7dccf'],Copper:['🔶','#f2d3b5']};
function AIcon({a,sm}){
  if(a.pair)return <span className={'ico pair'+(sm?' sm':'')}>{a.pair.map((c,idx)=>FLAGS[c]?<i key={c+'-'+idx} className="fl" title={c}><svg viewBox="0 0 24 24" aria-hidden="true">{FLAGS[c]}</svg></i>:<i key={c+'-'+idx} title={c} style={{background:CCY[c]||PAL[hash(c)%PAL.length]}}>{c.slice(0,2)}</i>)}</span>;
  const g=GLY[a.id];if(g)return <span className={'ico'+(sm?' sm':'')}><i className="gl" style={{background:g[1],color:/[🥇🥈🛢🔶]/u.test(g[0])?'inherit':'#fff'}}>{g[0]}</i></span>;
  return <span className={'ico'+(sm?' sm':'')}><i style={{background:a.col}}>{a.ini}</i></span>;
}
function Switch({on,onClick,label}){return <button role="switch" aria-checked={on} aria-label={label} className={'sw'+(on?' on':'')} onClick={onClick}/>}
function SheetHead({title,icon,onClose}){return <div className="ttl"><h2><span className="ic"><Icon n={icon}/></span>{title}</h2><button className="xbtn" onClick={onClose} aria-label="Close"><Icon n="x"/></button></div>}

function mkPath(h){const cms=5000,t0=Math.floor((h.openT-45000)/cms)*cms,t1=Math.ceil(h.closeT/cms)*cms,n=Math.max(2,Math.round((t1-t0)/cms)),nPre=Math.round((h.openT-t0)/cms),vol=Math.abs(h.close-h.entry)*0.25+h.entry*0.00003,out=[];let q=h.entry;
  for(let i=0;i<=n;i++){const o=q,tg=i<nPre?h.entry:h.entry+(h.close-h.entry)*Math.min(1,(i-nPre+1)/Math.max(1,n-nPre)),c=i===n?h.close:tg+(Math.random()-.5)*vol;out.push([t0+i*cms,o,Math.max(o,c)+Math.random()*vol*.4,Math.min(o,c)-Math.random()*vol*.4,c]);q=c}
  return {...h,path:out,cms}}

/* ---------- indicators ---------- */
const IND=[['sma20','SMA 20','ov','#f59f00'],['sma50','SMA 50','ov','#1c7ed6'],['ema9','EMA 9','ov','#d6336c'],['ema20','EMA 20','ov','#7048e8'],['ema50','EMA 50','ov','#0ca678'],['wma20','WMA 20','ov','#e8590c'],['bb','Bollinger Bands','ov','#7048e8'],['env','Envelopes','ov','#868e96'],['donch','Donchian Channel','ov','#1c7ed6'],['keltner','Keltner Channel','ov','#0ca678'],['sar','Parabolic SAR','ov','#d6336c'],['ichi','Ichimoku (Tenkan/Kijun)','ov','#e8590c'],
 ['rsi','RSI 14','osc','#7048e8'],['macd','MACD 12,26,9','osc','#1c7ed6'],['stoch','Stochastic 14,3','osc','#d6336c'],['stochrsi','Stochastic RSI','osc','#7048e8'],['cci','CCI 20','osc','#f59f00'],['atr','ATR 14','osc','#0ca678'],['willr','Williams %R','osc','#e8590c'],['mom','Momentum 10','osc','#1c7ed6'],['roc','ROC 12','osc','#d6336c'],['adx','ADX 14','osc','#364fc7'],['ao','Awesome Oscillator','osc','#2b8a3e'],
 ['sma100','SMA 100','ov','#868e96'],['sma200','SMA 200','ov','#495057'],['ema100','EMA 100','ov','#e64980'],['ema200','EMA 200','ov','#862e9c'],['dema20','DEMA 20','ov','#f76707'],['tema20','TEMA 20','ov','#1098ad'],['hma20','Hull MA 20','ov','#37b24d'],['smma14','SMMA 14','ov','#5c7cfa'],['lsma25','Linear Regression 25','ov','#d9480f'],['zlema20','ZLEMA 20','ov','#c2255c'],['kama','Kaufman AMA','ov','#0b7285'],['alma','ALMA 9','ov','#6741d9'],['tma20','Triangular MA 20','ov','#e67700'],['super','Supertrend 10,3','ov','#2f9e44'],['gator','Williams Alligator','ov','#1c7ed6'],
 ['rsi7','RSI 7','osc','#845ef7'],['aroon','Aroon 14','osc','#2b8a3e'],['aroonosc','Aroon Oscillator','osc','#1971c2'],['trix','TRIX 15','osc','#e8590c'],['uo','Ultimate Oscillator','osc','#c2255c'],['dpo','Detrended Price Osc','osc','#0c8599'],['bull','Bulls Power 13','osc','#2f9e44'],['bear','Bears Power 13','osc','#e03131'],['cmo','Chande Momentum','osc','#5f3dc4'],['fisher','Fisher Transform','osc','#1c7ed6'],['kst','Know Sure Thing','osc','#d6336c'],['coppock','Coppock Curve','osc','#f08c00'],['tsi','True Strength Index','osc','#0ca678'],['ppo','PPO 12,26,9','osc','#4263eb'],['dem','DeMarker 14','osc','#e64980'],['pctb','Bollinger %B','osc','#7048e8'],['bbw','Bollinger Bandwidth','osc','#7950f2'],['std','Std Deviation 20','osc','#868e96'],['vortex','Vortex 14','osc','#364fc7'],['chop','Choppiness 14','osc','#f59f00'],['rvi','Relative Vigor Index','osc','#087f5b'],['psy','Psychological Line','osc','#a61e4d'],['bop','Balance of Power','osc','#1864ab'],['natr','Normalized ATR','osc','#2b8a3e']];
const IND_BY={};IND.forEach(d=>IND_BY[d[0]]=d);
const OSC=new Set(IND.filter(d=>d[2]==='osc').map(d=>d[0])),PANE=62;
const ZERO=new Set(['mom','roc','trix','dpo','bull','bear','coppock','bop']),FIX={rsi7:[[0,100],[30,70]],uo:[[0,100],[30,70]],cmo:[[-100,100],[-50,0,50]],dem:[[0,1],[.3,.7]],chop:[[0,100],[38.2,61.8]],psy:[[0,100],[25,75]],aroonosc:[[-100,100],[0]],pctb:[null,[0,1]]};
const nul=n=>Array(n).fill(null);
function SMA(v,n){const o=nul(v.length);for(let i=n-1;i<v.length;i++){let s=0,ok=true;for(let j=i-n+1;j<=i;j++){if(v[j]==null){ok=false;break}s+=v[j]}if(ok)o[i]=s/n}return o}
function EMA(v,n){const o=nul(v.length),k=2/(n+1);let e=null,s=0,c=0;for(let i=0;i<v.length;i++){const x=v[i];if(x==null)continue;if(e==null){s+=x;c++;if(c===n){e=s/n;o[i]=e}}else{e=x*k+e*(1-k);o[i]=e}}return o}
function WMA(v,n){const o=nul(v.length),d=n*(n+1)/2;for(let i=n-1;i<v.length;i++){let s=0;for(let j=0;j<n;j++)s+=v[i-n+1+j]*(j+1);o[i]=s/d}return o}
function roll(v,n,f){const o=nul(v.length);for(let i=n-1;i<v.length;i++){let a=v[i];for(let j=i-n+1;j<i;j++)a=f(a,v[j]);o[i]=a}return o}
function RSI(c,n){const o=nul(c.length);let g=0,l=0;for(let i=1;i<c.length;i++){const d=c[i]-c[i-1],u=Math.max(d,0),w=Math.max(-d,0);if(i<=n){g+=u;l+=w;if(i===n){g/=n;l/=n;o[i]=l===0?100:100-100/(1+g/l)}}else{g=(g*(n-1)+u)/n;l=(l*(n-1)+w)/n;o[i]=l===0?100:100-100/(1+g/l)}}return o}
function ATR(h,l,c,n){const o=nul(c.length);let a=0;for(let i=1;i<c.length;i++){const t=Math.max(h[i]-l[i],Math.abs(h[i]-c[i-1]),Math.abs(l[i]-c[i-1]));if(i<=n){a+=t;if(i===n){a/=n;o[i]=a}}else{a=(a*(n-1)+t)/n;o[i]=a}}return o}
function STOCH(h,l,c,n,m){const hh=roll(h,n,Math.max),ll=roll(l,n,Math.min),k=c.map((x,i)=>hh[i]==null?null:hh[i]===ll[i]?50:100*(x-ll[i])/(hh[i]-ll[i]));return{k,d:SMA(k,m)}}
function PSAR(h,l){const n=h.length,o=nul(n);if(n<3)return o;let up=true,af=.02,ep=h[0],sar=l[0];for(let i=1;i<n;i++){sar=sar+af*(ep-sar);if(up){sar=Math.min(sar,l[i-1],i>1?l[i-2]:l[i-1]);if(l[i]<sar){up=false;sar=ep;ep=l[i];af=.02}else if(h[i]>ep){ep=h[i];af=Math.min(af+.02,.2)}}else{sar=Math.max(sar,h[i-1],i>1?h[i-2]:h[i-1]);if(h[i]>sar){up=true;sar=ep;ep=h[i];af=.02}else if(l[i]<ep){ep=l[i];af=Math.min(af+.02,.2)}}o[i]=sar}return o}
function ADXf(h,l,c,n){const L=c.length,out={adx:nul(L),pdi:nul(L),mdi:nul(L)};let tr=0,pd=0,md=0,ax=null;const dxs=[];for(let i=1;i<L;i++){const up=h[i]-h[i-1],dn=l[i-1]-l[i],p=up>dn&&up>0?up:0,m=dn>up&&dn>0?dn:0,t=Math.max(h[i]-l[i],Math.abs(h[i]-c[i-1]),Math.abs(l[i]-c[i-1]));if(i<=n){tr+=t;pd+=p;md+=m;if(i<n)continue}else{tr=tr-tr/n+t;pd=pd-pd/n+p;md=md-md/n+m}const pi=100*pd/tr,mi=100*md/tr;out.pdi[i]=pi;out.mdi[i]=mi;const dx=100*Math.abs(pi-mi)/Math.max(pi+mi,1e-9);dxs.push(dx);if(dxs.length===n){ax=dxs.reduce((x,y)=>x+y,0)/n;out.adx[i]=ax}else if(dxs.length>n){ax=(ax*(n-1)+dx)/n;out.adx[i]=ax}}return out}
const zip2=(a,b,f)=>a.map((v,i)=>v==null||b[i]==null?null:f(v,b[i]));
function WMAs(v,n){const o=nul(v.length),d=n*(n+1)/2;for(let i=n-1;i<v.length;i++){let t=0,ok=true;for(let j=0;j<n;j++){const x=v[i-n+1+j];if(x==null){ok=false;break}t+=x*(j+1)}if(ok)o[i]=t/d}return o}
function SMMA(v,n){const o=nul(v.length);let p=null,t=0,k=0;for(let i=0;i<v.length;i++){const x=v[i];if(x==null)continue;if(p==null){t+=x;k++;if(k===n){p=t/n;o[i]=p}}else{p=(p*(n-1)+x)/n;o[i]=p}}return o}
function LSMA(v,n){const o=nul(v.length),sx=n*(n-1)/2,sxx=(n-1)*n*(2*n-1)/6;for(let i=n-1;i<v.length;i++){let sy=0,sxy=0,ok=true;for(let j=0;j<n;j++){const y=v[i-n+1+j];if(y==null){ok=false;break}sy+=y;sxy+=j*y}if(!ok)continue;const b=(n*sxy-sx*sy)/(n*sxx-sx*sx);o[i]=(sy-b*sx)/n+b*(n-1)}return o}
function KAMA(c,n){const o=nul(c.length),fa=2/3,sa=2/31;let p=null;for(let i=n;i<c.length;i++){let vol=0;for(let j=i-n+1;j<=i;j++)vol+=Math.abs(c[j]-c[j-1]);const er=vol?Math.abs(c[i]-c[i-n])/vol:0,sc=(er*(fa-sa)+sa)**2;if(p==null)p=c[i-1];p=p+sc*(c[i]-p);o[i]=p}return o}
function ALMA(c,n){const o=nul(c.length),m=.85*(n-1),sg=n/6,w=Array.from({length:n},(_,i)=>Math.exp(-((i-m)**2)/(2*sg*sg))),ws=w.reduce((a,b)=>a+b,0);for(let i=n-1;i<c.length;i++){let t=0;for(let j=0;j<n;j++)t+=c[i-n+1+j]*w[j];o[i]=t/ws}return o}
function SUPER(h,l,c,n,m){const a=ATR(h,l,c,n),o=nul(c.length);let fu=null,fl=null,tr=1;for(let i=0;i<c.length;i++){if(a[i]==null)continue;const hl=(h[i]+l[i])/2,bu=hl+m*a[i],bl=hl-m*a[i];if(fu==null){fu=bu;fl=bl}else{fu=(bu<fu||c[i-1]>fu)?bu:fu;fl=(bl>fl||c[i-1]<fl)?bl:fl;if(tr===1&&c[i]<fl)tr=-1;else if(tr===-1&&c[i]>fu)tr=1}o[i]=tr===1?fl:fu}return o}
function AROON(h,l,n){const u=nul(h.length),d=nul(h.length);for(let i=n;i<h.length;i++){let bh=0,bl=0;for(let j=0;j<=n;j++){if(h[i-j]>h[i-bh])bh=j;if(l[i-j]<l[i-bl])bl=j}u[i]=100*(n-bh)/n;d[i]=100*(n-bl)/n}return{u,d}}
function calcInd(all,ids){
  const st=Math.max(0,all.length-480),cs=all.slice(st),op=cs.map(x=>x.o),h=cs.map(x=>x.h),l=cs.map(x=>x.l),c=cs.map(x=>x.c),res={},z=(a,b,f)=>a.map((v,i)=>v==null||b[i]==null?null:f(v,b[i]));
  for(const id of ids){switch(id){
    case 'sma20':res[id]=SMA(c,20);break;case 'sma50':res[id]=SMA(c,50);break;case 'ema9':res[id]=EMA(c,9);break;case 'ema20':res[id]=EMA(c,20);break;case 'ema50':res[id]=EMA(c,50);break;case 'wma20':res[id]=WMA(c,20);break;
    case 'bb':{const m=SMA(c,20),sd=c.map((_,i)=>{if(m[i]==null)return null;let q=0;for(let j=i-19;j<=i;j++)q+=(c[j]-m[i])**2;return Math.sqrt(q/20)});res[id]={m,u:z(m,sd,(a,b)=>a+2*b),l:z(m,sd,(a,b)=>a-2*b)};break}
    case 'env':{const m=SMA(c,20);res[id]={u:m.map(v=>v==null?null:v*1.001),l:m.map(v=>v==null?null:v*.999)};break}
    case 'donch':{const u=roll(h,20,Math.max),lo=roll(l,20,Math.min);res[id]={u,l:lo,m:z(u,lo,(a,b)=>(a+b)/2)};break}
    case 'keltner':{const m=EMA(c,20),a=ATR(h,l,c,10);res[id]={m,u:z(m,a,(x,y)=>x+2*y),l:z(m,a,(x,y)=>x-2*y)};break}
    case 'sar':res[id]=PSAR(h,l);break;
    case 'ichi':{const t=z(roll(h,9,Math.max),roll(l,9,Math.min),(a,b)=>(a+b)/2),k=z(roll(h,26,Math.max),roll(l,26,Math.min),(a,b)=>(a+b)/2);res[id]={t,k};break}
    case 'rsi':res[id]=RSI(c,14);break;
    case 'macd':{const m=z(EMA(c,12),EMA(c,26),(a,b)=>a-b),sg=EMA(m,9);res[id]={m,s:sg,h:z(m,sg,(a,b)=>a-b)};break}
    case 'stoch':res[id]=STOCH(h,l,c,14,3);break;
    case 'stochrsi':{const r=RSI(c,14),hh=roll(r.map(v=>v==null?-1e9:v),14,Math.max),ll=roll(r.map(v=>v==null?1e9:v),14,Math.min),k=r.map((v,i)=>v==null||hh[i]==null||hh[i]>1e8||ll[i]>1e8?null:hh[i]===ll[i]?50:100*(v-ll[i])/(hh[i]-ll[i]));res[id]={k,d:SMA(k,3)};break}
    case 'cci':{const tp=c.map((x,i)=>(h[i]+l[i]+x)/3),m=SMA(tp,20);res[id]=tp.map((v,i)=>{if(m[i]==null)return null;let d=0;for(let j=i-19;j<=i;j++)d+=Math.abs(tp[j]-m[i]);d/=20;return d?(v-m[i])/(0.015*d):0});break}
    case 'atr':res[id]=ATR(h,l,c,14);break;
    case 'willr':{const hh=roll(h,14,Math.max),ll=roll(l,14,Math.min);res[id]=c.map((x,i)=>hh[i]==null?null:hh[i]===ll[i]?-50:-100*(hh[i]-x)/(hh[i]-ll[i]));break}
    case 'mom':res[id]=c.map((x,i)=>i<10?null:x-c[i-10]);break;
    case 'roc':res[id]=c.map((x,i)=>i<12?null:(x/c[i-12]-1)*100);break;
    case 'adx':res[id]=ADXf(h,l,c,14);break;
    case 'ao':{const md=c.map((_,i)=>(h[i]+l[i])/2);res[id]=z(SMA(md,5),SMA(md,34),(a,b)=>a-b);break}
    case 'sma100':res[id]=SMA(c,100);break;case 'sma200':res[id]=SMA(c,200);break;case 'ema100':res[id]=EMA(c,100);break;case 'ema200':res[id]=EMA(c,200);break;
    case 'dema20':{const e=EMA(c,20);res[id]=zip2(e,EMA(e,20),(a,b)=>2*a-b);break}
    case 'tema20':{const e=EMA(c,20),e2=EMA(e,20),e3=EMA(e2,20);res[id]=e.map((a,i)=>a==null||e2[i]==null||e3[i]==null?null:3*a-3*e2[i]+e3[i]);break}
    case 'hma20':res[id]=WMAs(zip2(WMAs(c,10),WMAs(c,20),(x,y)=>2*x-y),4);break;
    case 'smma14':res[id]=SMMA(c,14);break;case 'lsma25':res[id]=LSMA(c,25);break;
    case 'zlema20':res[id]=EMA(c.map((x,i)=>i<9?null:2*x-c[i-9]),20);break;
    case 'kama':res[id]=KAMA(c,10);break;case 'alma':res[id]=ALMA(c,9);break;case 'tma20':res[id]=SMA(SMA(c,10),11);break;
    case 'super':res[id]=SUPER(h,l,c,10,3);break;
    case 'gator':{const md=c.map((_,i)=>(h[i]+l[i])/2),sh=(a,k)=>a.map((_,i)=>i-k>=0?a[i-k]:null);res[id]={j:sh(SMMA(md,13),8),t:sh(SMMA(md,8),5),l:sh(SMMA(md,5),3)};break}
    case 'rsi7':res[id]=RSI(c,7);break;
    case 'aroon':res[id]=AROON(h,l,14);break;
    case 'aroonosc':{const a=AROON(h,l,14);res[id]=zip2(a.u,a.d,(x,y)=>x-y);break}
    case 'trix':{const e=EMA(EMA(EMA(c,15),15),15);res[id]=e.map((v,i)=>i&&v!=null&&e[i-1]!=null?(v/e[i-1]-1)*100:null);break}
    case 'uo':{const bp=c.map((x,i)=>i?x-Math.min(l[i],c[i-1]):null),tr=c.map((x,i)=>i?Math.max(h[i],c[i-1])-Math.min(l[i],c[i-1]):null),sm=(a,n)=>a.map((_,i)=>{if(i<n)return null;let t=0;for(let j=i-n+1;j<=i;j++)t+=a[j];return t}),b7=sm(bp,7),b14=sm(bp,14),b28=sm(bp,28),t7=sm(tr,7),t14=sm(tr,14),t28=sm(tr,28);res[id]=c.map((_,i)=>b28[i]==null||!t7[i]||!t14[i]||!t28[i]?null:100*(4*b7[i]/t7[i]+2*b14[i]/t14[i]+b28[i]/t28[i])/7);break}
    case 'dpo':{const m=SMA(c,20);res[id]=c.map((_,i)=>i<11||m[i]==null?null:c[i-11]-m[i]);break}
    case 'bull':{const e=EMA(c,13);res[id]=e.map((v,i)=>v==null?null:h[i]-v);break}
    case 'bear':{const e=EMA(c,13);res[id]=e.map((v,i)=>v==null?null:l[i]-v);break}
    case 'cmo':res[id]=c.map((_,i)=>{if(i<14)return null;let u=0,d=0;for(let j=i-13;j<=i;j++){const x=c[j]-c[j-1];if(x>0)u+=x;else d-=x}return u+d?100*(u-d)/(u+d):0});break;
    case 'fisher':{const hh=roll(h,9,Math.max),ll=roll(l,9,Math.min),f=nul(c.length),t=nul(c.length);let v=0,pf=0;for(let i=0;i<c.length;i++){if(hh[i]==null)continue;const x=hh[i]===ll[i]?0:((h[i]+l[i])/2-ll[i])/(hh[i]-ll[i])-.5;v=Math.max(-.999,Math.min(.999,.66*x+.67*v));const fv=.5*Math.log((1+v)/(1-v))+.5*pf;f[i]=fv;t[i]=pf;pf=fv}res[id]={f,t};break}
    case 'kst':{const r=n=>c.map((x,i)=>i<n?null:(x/c[i-n]-1)*100),a=SMA(r(10),10),b=SMA(r(15),10),d=SMA(r(20),10),e=SMA(r(30),15),k=a.map((v,i)=>v==null||b[i]==null||d[i]==null||e[i]==null?null:v+2*b[i]+3*d[i]+4*e[i]);res[id]={k,s:SMA(k,9)};break}
    case 'coppock':{const r=n=>c.map((x,i)=>i<n?null:(x/c[i-n]-1)*100);res[id]=WMAs(zip2(r(14),r(11),(a,b)=>a+b),10);break}
    case 'tsi':{const m=c.map((x,i)=>i?x-c[i-1]:null),am=m.map(v=>v==null?null:Math.abs(v)),t=zip2(EMA(EMA(m,25),13),EMA(EMA(am,25),13),(a,b)=>b?100*a/b:0);res[id]={k:t,s:EMA(t,7)};break}
    case 'ppo':{const p=zip2(EMA(c,12),EMA(c,26),(x,y)=>(x-y)/y*100);res[id]={k:p,s:EMA(p,9)};break}
    case 'dem':{const mx=c.map((_,i)=>i?Math.max(h[i]-h[i-1],0):null),mn=c.map((_,i)=>i?Math.max(l[i-1]-l[i],0):null);res[id]=zip2(SMA(mx,14),SMA(mn,14),(x,y)=>x+y?x/(x+y):.5);break}
    case 'pctb':case 'bbw':case 'std':{const m=SMA(c,20),sd=c.map((_,i)=>{if(m[i]==null)return null;let q=0;for(let j=i-19;j<=i;j++)q+=(c[j]-m[i])**2;return Math.sqrt(q/20)});res[id]=id==='std'?sd:c.map((x,i)=>sd[i]==null?null:id==='bbw'?4*sd[i]/m[i]*100:sd[i]?(x-(m[i]-2*sd[i]))/(4*sd[i]):.5);break}
    case 'vortex':{const n=14,vp=c.map((_,i)=>i?Math.abs(h[i]-l[i-1]):null),vm=c.map((_,i)=>i?Math.abs(l[i]-h[i-1]):null),tr=c.map((_,i)=>i?Math.max(h[i]-l[i],Math.abs(h[i]-c[i-1]),Math.abs(l[i]-c[i-1])):null),sm=a=>a.map((_,i)=>{if(i<n)return null;let t=0;for(let j=i-n+1;j<=i;j++)t+=a[j];return t}),P=sm(vp),M=sm(vm),T=sm(tr);res[id]={p:P.map((v,i)=>v==null||!T[i]?null:v/T[i]),n:M.map((v,i)=>v==null||!T[i]?null:v/T[i])};break}
    case 'chop':{const n=14,tr=c.map((_,i)=>i?Math.max(h[i]-l[i],Math.abs(h[i]-c[i-1]),Math.abs(l[i]-c[i-1])):null),hh=roll(h,n,Math.max),ll=roll(l,n,Math.min);res[id]=c.map((_,i)=>{if(i<n||hh[i]==null)return null;let t=0;for(let j=i-n+1;j<=i;j++)t+=tr[j];const r=hh[i]-ll[i];return r>0&&t>0?100*Math.log10(t/r)/Math.log10(n):null});break}
    case 'rvi':{const nm=c.map((_,i)=>i<3?null:((c[i]-op[i])+2*(c[i-1]-op[i-1])+2*(c[i-2]-op[i-2])+(c[i-3]-op[i-3]))/6),dn=c.map((_,i)=>i<3?null:((h[i]-l[i])+2*(h[i-1]-l[i-1])+2*(h[i-2]-l[i-2])+(h[i-3]-l[i-3]))/6),k=zip2(SMA(nm,10),SMA(dn,10),(a,b)=>b?a/b:0),sg=k.map((_,i)=>i<3||k[i]==null||k[i-1]==null||k[i-2]==null||k[i-3]==null?null:(k[i]+2*k[i-1]+2*k[i-2]+k[i-3])/6);res[id]={k,s:sg};break}
    case 'psy':res[id]=c.map((_,i)=>{if(i<12)return null;let u=0;for(let j=i-11;j<=i;j++)if(c[j]>c[j-1])u++;return u/12*100});break;
    case 'bop':res[id]=SMA(c.map((x,i)=>h[i]===l[i]?0:(x-op[i])/(h[i]-l[i])),14);break;
    case 'natr':res[id]=ATR(h,l,c,14).map((v,i)=>v==null?null:v/c[i]*100);break;
  }}
  return{cs,res}}
function drawPanes(ctx,IR,ids,g){
  const{X,tfms,cw,plotW,MB,col,txt}=g;let k=0;
  for(const id of ids){if(!OSC.has(id))continue;
    const top=MB+k*PANE+3,hh=PANE-6,def=IND_BY[id],r=IR.res[id],cs=IR.cs;k++;
    ctx.strokeStyle=col.line;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,top-2.5);ctx.lineTo(plotW,top-2.5);ctx.stroke();
    let lines=[],hist=null,fixed=null,guides=[],main=null;
    if(id==='rsi'){lines=[[r,def[3]]];fixed=[0,100];guides=[30,70];main=r}
    else if(id==='macd'){hist=r.h;lines=[[r.m,'#1c7ed6'],[r.s,'#f59f00']];guides=[0];main=r.m}
    else if(id==='stoch'||id==='stochrsi'){lines=[[r.k,def[3]],[r.d,'#f59f00']];fixed=[0,100];guides=[20,80];main=r.k}
    else if(id==='cci'){lines=[[r,def[3]]];guides=[-100,0,100];main=r}
    else if(id==='willr'){lines=[[r,def[3]]];fixed=[-100,0];guides=[-20,-80];main=r}
    else if(id==='adx'){lines=[[r.adx,def[3]],[r.pdi,col.gu],[r.mdi,col.gd]];main=r.adx}
    else if(id==='ao'){hist=r;guides=[0];main=r}
    else if(id==='aroon'){lines=[[r.u,col.gu],[r.d,col.gd]];fixed=[0,100];guides=[30,70];main=r.u}
    else if(id==='fisher'){lines=[[r.f,def[3]],[r.t,'#f59f00']];guides=[0];main=r.f}
    else if(id==='kst'||id==='tsi'||id==='ppo'||id==='rvi'){lines=[[r.k,def[3]],[r.s,'#f59f00']];guides=[0];main=r.k}
    else if(id==='vortex'){lines=[[r.p,col.gu],[r.n,col.gd]];guides=[1];main=r.p}
    else{lines=[[r,def[3]]];if(ZERO.has(id))guides=[0];else if(FIX[id]){fixed=FIX[id][0];guides=FIX[id][1]}main=r}
    let lo=Infinity,hi=-Infinity;const vis=[];
    for(let i=0;i<cs.length;i++){const x=X(cs[i].t+tfms/2);if(x<-cw)continue;if(x>plotW+cw)break;vis.push([i,x]);
      for(const[a]of lines){const v=a[i];if(v!=null){if(v<lo)lo=v;if(v>hi)hi=v}}if(hist&&hist[i]!=null){lo=Math.min(lo,hist[i]);hi=Math.max(hi,hist[i])}}
    if(fixed){lo=fixed[0];hi=fixed[1]}else{for(const gd of guides){if(gd===0||Math.abs(gd)===100){lo=Math.min(lo,gd);hi=Math.max(hi,gd)}}}
    if(!isFinite(lo)||hi<=lo){lo=0;hi=1}
    const py=v=>top+3+(hi-v)/(hi-lo)*(hh-6);
    ctx.setLineDash([3,3]);ctx.strokeStyle=col.grid;ctx.lineWidth=1;for(const gd of guides){const y=py(gd);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(plotW,y);ctx.stroke()}ctx.setLineDash([]);
    if(hist){const bw=Math.max(1.5,cw*.6),y0=py(Math.max(lo,Math.min(hi,0)));for(const[i,x]of vis){const v=hist[i];if(v==null)continue;const pv=i>0?hist[i-1]:null;ctx.fillStyle=(id==='ao'?(pv==null||v>=pv):v>=0)?col.up:col.down;const y=py(v);ctx.fillRect(x-bw/2,Math.min(y,y0),bw,Math.max(1,Math.abs(y-y0)))}}
    for(const[a,color]of lines){ctx.beginPath();let on=false;for(const[i,x]of vis){const v=a[i];if(v==null){on=false;continue}if(!on){ctx.moveTo(x,py(v));on=true}else ctx.lineTo(x,py(v))}ctx.strokeStyle=color;ctx.lineWidth=1.4;ctx.lineJoin='round';ctx.stroke()}
    let lv=null;for(let i=main.length-1;i>=0;i--)if(main[i]!=null){lv=main[i];break}
    txt(def[1]+(lv==null?'':'  '+(Math.abs(lv)<1?lv.toFixed(5):lv.toFixed(2))),6,top+8,col.muted,'600 9.5px Roboto, sans-serif');
  }}

/* ---------- chart ---------- */
const TFS=[5,15,30,60];
const COLORS=['#5a45e6','#e0413f','#14a05b','#f59f00','#1c7ed6','#d6336c'];
function Chart({assetId,tf,setTf,type,setType,zoom,setZoom,openTrades,expMs,pendMs,now,onInfo,hold,review,onLive}){
  const cvRef=useRef(),pr=useRef({}),panRef=useRef(0),yRef=useRef({lo:null,hi:null}),strokes=useRef({}),redoS=useRef({}),geo=useRef(null);
  const [panned,setPanned]=useState(false),[setOpen,setSetOpen]=useState(false),[tools,setTools]=useState(false),[drawOn,setDrawOn]=useState(false),[inds,setInds]=useState([]),[indOpen,setIndOpen]=useState(false),[color,setColor]=useState(COLORS[0]),[palOpen,setPalOpen]=useState(false),[,bump]=useState(0);
  pr.current={assetId,tf,type,zoom,openTrades,expMs,pendMs,draw:drawOn,inds,color,hold,review};
  const toggleInd=id=>setInds(v=>{if(v.includes(id))return v.filter(x=>x!==id);let nv=[...v,id];const os=nv.filter(x=>OSC.has(x));if(os.length>3)nv=nv.filter(x=>x!==os[0]);return nv});
  useEffect(()=>{panRef.current=0;yRef.current={lo:null,hi:null};setPanned(false)},[assetId,tf]);
  useEffect(()=>{
    const cv=cvRef.current,ctx=cv.getContext('2d');let raf,col,lastCol=0,focusK=null;
    const readCol=()=>{const s=getComputedStyle(document.documentElement),g=n=>s.getPropertyValue(n).trim();col={up:g('--c-up'),down:g('--c-down'),gu:g('--up'),gd:g('--down'),grid:g('--chart-grid'),muted:g('--muted'),fg:g('--fg'),surface:g('--solid'),accent:g('--accent'),line:g('--line')}};
    const resize=()=>{const r=cv.getBoundingClientRect(),d=window.devicePixelRatio||1;cv.width=Math.max(1,r.width*d);cv.height=Math.max(1,r.height*d);ctx.setTransform(d,0,0,d,0,0)};
    resize();const ro=new ResizeObserver(resize);ro.observe(cv);
    const rr=(x,y,w,h,r,f)=>{ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);ctx.fillStyle=f;ctx.fill()};
    const txt=(s,x,y,c,font='10.5px Roboto, system-ui, -apple-system, sans-serif',al='left')=>{ctx.font=font;ctx.fillStyle=c;ctx.textAlign=al;ctx.textBaseline='middle';ctx.fillText(s,x,y)};
    const draw=()=>{
      const t0=performance.now();if(!col||t0-lastCol>600){readCol();lastCol=t0}
      const p=pr.current,W=cv.clientWidth,H=cv.clientHeight;ctx.clearRect(0,0,W,H);
      const a=BYID[p.assetId],dec=a.dec,AX=60,BY=24,TY=48,plotW=W-AX,nO=p.inds.filter(x=>OSC.has(x)).length,MB=H-BY-nO*PANE,plotH=MB-TY,rv=p.review&&p.review.stored?p.review.h:null,tfms=rv?(rv.cms||5000):p.tf*1000;
      const all=rv?rv.path.map(c=>({t:c[0],o:c[1],h:c[2],l:c[3],c:c[4]})):agg(eng.candles[p.assetId],p.tf/5),last=all[all.length-1],price=rv?rv.close:eng.prices[p.assetId],now=Date.now();
      if(p.review&&focusK!==p.review.k){focusK=p.review.k;const v0=Math.max(10,Math.round(36/p.zoom)),c0=plotW/v0,mid=(p.review.h.openT+p.review.h.closeT)/2;panRef.current=(plotW*0.46-plotW*0.56-(mid-(last.t+tfms/2))/tfms*c0)/c0;yRef.current={lo:null,hi:null};setPanned(true)}
      const vis=Math.max(10,Math.round(36/p.zoom)),cw=plotW/vis,pan=panRef.current;
      const cx0=last.t+tfms/2,anchor=plotW*0.56+pan*cw,X=t=>anchor+(t-cx0)/tfms*cw;
      let lo=Infinity,hi=-Infinity,hiC=null,loC=null;
      for(let i=all.length-1;i>=0;i--){const c=all[i],x=X(c.t+tfms/2);if(x<-cw)break;if(x>plotW+cw)continue;
        if(c.h>hi){hi=c.h;hiC=c}if(c.l<lo){lo=c.l;loC=c}}
      if(!isFinite(lo)){lo=price*.999;hi=price*1.001}
      for(const t of p.openTrades){if(t.entry){lo=Math.min(lo,t.entry);hi=Math.max(hi,t.entry)}}
      if(p.review&&p.review.h.asset===p.assetId){lo=Math.min(lo,p.review.h.entry,p.review.h.close);hi=Math.max(hi,p.review.h.entry,p.review.h.close)}
      if(pan<1){lo=Math.min(lo,price);hi=Math.max(hi,price)}
      const padv=(hi-lo)*0.16||price*0.0004,tl=lo-padv,th=hi+padv,y=yRef.current;
      if(y.lo===null){y.lo=tl;y.hi=th}else{y.lo+=(tl-y.lo)*0.18;y.hi+=(th-y.hi)*0.18}
      const Y=v=>TY+(y.hi-v)/(y.hi-y.lo)*plotH;
      geo.current={cx0,anchor,tfms,cw,TY,plotH,hi:y.hi,lo:y.lo};
      // price grid
      const rg=y.hi-y.lo,rough=rg/6,pw=Math.pow(10,Math.floor(Math.log10(rough))),fr=rough/pw,step=(fr<1.5?1:fr<3?2:fr<7?5:10)*pw;
      ctx.lineWidth=1;
      for(let v=Math.ceil(y.lo/step)*step;v<y.hi;v+=step){const yy=Math.round(Y(v))+.5;ctx.strokeStyle=col.grid;ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(plotW,yy);ctx.stroke();txt(v.toFixed(dec),plotW+8,yy,col.muted)}
      // time grid
      const mults=[1,2,3,5,10,15,30,60,120,360,720];let stepMs=tfms*mults[mults.length-1];
      for(const m of mults){if(tfms*m/tfms*cw>=74){stepMs=tfms*m;break}}
      const tLeft=cx0+(0-anchor)/cw*tfms,showS=stepMs<60000;
      for(let t=Math.ceil(tLeft/stepMs)*stepMs;;t+=stepMs){const x=X(t);if(x>plotW-24)break;
        ctx.strokeStyle=col.grid;ctx.beginPath();ctx.moveTo(Math.round(x)+.5,TY-6);ctx.lineTo(Math.round(x)+.5,MB);ctx.stroke();
        txt(hms(t,showS),x,H-10,col.muted,'10px Roboto Mono, monospace','center')}
      // series
      ctx.save();ctx.beginPath();ctx.rect(0,0,plotW,MB);ctx.clip();
      if(p.type==='line'){
        ctx.beginPath();let first=true,lx=0;
        for(const c of all){const x=X(c.t+tfms/2);if(x<-cw||x>plotW+cw)continue;if(first){ctx.moveTo(x,Y(c.c));first=false}else ctx.lineTo(x,Y(c.c));lx=x}
        ctx.strokeStyle=col.accent;ctx.lineWidth=2;ctx.lineJoin='round';ctx.stroke();
        ctx.lineTo(lx,MB);ctx.lineTo(Math.max(0,X(all[Math.max(0,all.length-Math.ceil(plotW/cw)-pan)]?.t||0)),MB);
        ctx.globalAlpha=.08;ctx.fillStyle=col.accent;ctx.fill();ctx.globalAlpha=1;
      }else{
        const bw=Math.max(2,cw*0.88);
        for(let i=all.length-1;i>=0;i--){const c=all[i],x=X(c.t+tfms/2);if(x<-cw)break;if(x>plotW+cw)continue;
          const up=c.c>=c.o,k=up?col.up:col.down;ctx.strokeStyle=k;ctx.fillStyle=k;ctx.lineWidth=1.2;
          ctx.beginPath();ctx.moveTo(Math.round(x)+.5,Y(c.h));ctx.lineTo(Math.round(x)+.5,Y(c.l));ctx.stroke();
          const yt=Y(Math.max(c.o,c.c)),yb=Y(Math.min(c.o,c.c));ctx.fillRect(x-bw/2,yt,bw,Math.max(2,yb-yt))}
      }
      const IR=p.inds.length?calcInd(all,p.inds):null;
      if(IR){
        const csT=IR.cs,pl=(arr,color,w=1.6,dash)=>{ctx.beginPath();let on=false;ctx.setLineDash(dash||[]);for(let i=0;i<arr.length;i++){const x=X(csT[i].t+tfms/2);if(x<-cw)continue;if(x>plotW+cw)break;const v=arr[i];if(v==null){on=false;continue}if(!on){ctx.moveTo(x,Y(v));on=true}else ctx.lineTo(x,Y(v))}ctx.strokeStyle=color;ctx.lineWidth=w;ctx.lineJoin='round';ctx.stroke();ctx.setLineDash([])};
        const band=(u,lw,color)=>{ctx.beginPath();const idx=[];for(let i=0;i<csT.length;i++){const x=X(csT[i].t+tfms/2);if(x<-cw)continue;if(x>plotW+cw)break;if(u[i]!=null&&lw[i]!=null)idx.push([i,x])}if(idx.length<2)return;idx.forEach(([i,x],j)=>j?ctx.lineTo(x,Y(u[i])):ctx.moveTo(x,Y(u[i])));for(let j=idx.length-1;j>=0;j--)ctx.lineTo(idx[j][1],Y(lw[idx[j][0]]));ctx.closePath();ctx.globalAlpha=.09;ctx.fillStyle=color;ctx.fill();ctx.globalAlpha=1};
        for(const id of p.inds){if(OSC.has(id))continue;const d=IND_BY[id],r=IR.res[id];if(!r)continue;
          if(id==='sar'){ctx.fillStyle=d[3];for(let i=0;i<r.length;i++){const v=r[i];if(v==null)continue;const x=X(csT[i].t+tfms/2);if(x<-cw||x>plotW+cw)continue;ctx.beginPath();ctx.arc(x,Y(v),2,0,7);ctx.fill()}}
          else if(Array.isArray(r))pl(r,d[3]);
          else if(id==='bb'||id==='keltner'||id==='donch'){band(r.u,r.l,d[3]);pl(r.u,d[3],1.2);pl(r.l,d[3],1.2);pl(r.m,d[3],1.2,[4,3])}
          else if(id==='env'){pl(r.u,d[3],1.2,[5,3]);pl(r.l,d[3],1.2,[5,3])}
          else if(id==='ichi'){pl(r.t,'#1c7ed6',1.4);pl(r.k,'#d6336c',1.4)}
          else if(id==='gator'){pl(r.j,'#1c7ed6',1.4);pl(r.t,'#d6336c',1.4);pl(r.l,'#2b8a3e',1.4)}}
      }
      // extremes
      if(hiC&&loC&&hi>lo&&p.type!=='line'){
        const xH=X(hiC.t+tfms/2),yH=Y(hi);
        ctx.strokeStyle=col.muted;ctx.lineWidth=1.2;
        ctx.beginPath();ctx.moveTo(xH,yH);ctx.lineTo(xH,yH-10);ctx.lineTo(xH+6,yH-10);ctx.stroke();
        txt(fmtP(p.assetId,hi),xH+10,yH-10,col.muted,'500 10.5px Roboto, sans-serif','left');
        const xL=X(loC.t+tfms/2),yL=Y(lo);
        ctx.strokeStyle=col.muted;ctx.lineWidth=1.2;
        ctx.beginPath();ctx.moveTo(xL,yL);ctx.lineTo(xL,yL+10);ctx.lineTo(xL+6,yL+10);ctx.stroke();
        txt(fmtP(p.assetId,lo),xL+10,yL+10,col.muted,'500 10.5px Roboto, sans-serif','left');}
      // preview lines
      const mine=p.openTrades;
      const snap=Math.floor(now/tfms)*tfms+tfms/2,xNow=X(now),sx=p.pendMs?X(p.pendMs):X(snap),ex=p.pendMs?X(p.pendMs+p.expMs):X(snap)+p.expMs/tfms*cw;
      if(!mine.length&&!p.review){
        ctx.setLineDash([4,4]);ctx.strokeStyle=col.muted;ctx.globalAlpha=.55;ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(sx,TY-10);ctx.lineTo(sx,MB);ctx.stroke();
        if(ex<plotW){ctx.beginPath();ctx.moveTo(ex,TY-10);ctx.lineTo(ex,MB);ctx.stroke()}
        ctx.setLineDash([]);ctx.globalAlpha=1;
        txt(p.pendMs?'Pending start':'Beginning of trade',sx-6,TY-20,col.muted,'600 10px Roboto, sans-serif','right');
        txt(fmtP(p.assetId,price),sx-6,TY-8,col.fg,'500 10px Roboto Mono, monospace','right');
        if(ex<plotW-4){const l=ex>plotW-80,al=l?'right':'left',ox=l?ex-6:ex+6;txt('End of trade',ox,TY-20,col.muted,'600 10px Roboto, sans-serif',al);txt(mmss(p.expMs+(p.pendMs?p.pendMs-now:0)),ox,TY-8,col.fg,'500 10px Roboto Mono, monospace',al)}
        else{rr(plotW-92,TY-26,86,18,9,col.surface);ctx.strokeStyle=col.line;ctx.stroke();txt('End of trade »',plotW-49,TY-17,col.muted,'600 10px Roboto, sans-serif','center')}
      }
      // live result tint (latest open trade). No arrow while a trade is running.
      const fade=(c,a)=>c.length===7?c+Math.round(a*255).toString(16).padStart(2,'0'):c;
      const lt=[...mine].reverse().find(t=>t.status==='open'&&now<t.expT);
      if(lt){
        const goUp=price>=lt.entry,win=lt.dir==='up'?price>lt.entry:price<lt.entry,k=win?col.gu:col.gd;
        const yc=Math.max(0,Math.min(MB,Y(price))),y0=goUp?0:yc,y1=goUp?yc:MB;
      }
      // history review: entry / close markers, dotted line and result popup (like the reference)
      if(p.review&&p.review.h.asset===p.assetId){
        const h=p.review.h,k=h.status==='won'?col.gu:h.status==='lost'?col.gd:col.muted,ex2=X(h.openT),cx2=X(h.closeT),ey=Y(h.entry),cy=Y(h.close);
        const box=(x,y,w,hh,st)=>{ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,hh,8);else ctx.rect(x,y,w,hh);ctx.fillStyle=col.surface;ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle=st;ctx.stroke()};
        ctx.lineWidth=2.6;ctx.strokeStyle=fade(k,.5);ctx.beginPath();ctx.moveTo(ex2,ey);ctx.lineTo(cx2,ey);ctx.stroke();
        ctx.setLineDash([5,4]);ctx.lineWidth=2.4;ctx.strokeStyle=k;ctx.beginPath();ctx.moveTo(cx2,ey);ctx.lineTo(cx2,cy);ctx.stroke();ctx.setLineDash([]);
        for(const [x,y] of [[ex2,ey],[cx2,cy]]){ctx.beginPath();ctx.arc(x,y,5.5,0,7);ctx.fillStyle='#fff';ctx.fill();ctx.lineWidth=2.6;ctx.strokeStyle=k;ctx.stroke()}
        const lb=(v,x,y)=>{const t=fmtP(h.asset,v);ctx.font='500 11px Roboto Mono, monospace';const w=ctx.measureText(t).width+16,yy=Math.max(TY+6,y);box(x,yy-11,w,22,fade(k,.45));txt(t,x+8,yy,col.fg,'500 11px Roboto Mono, monospace')};
        lb(h.entry,ex2-8,ey-24);lb(h.close,cx2-8,cy-24);
        const pw2=118,ph2=46,px=Math.max(4,Math.min(plotW-pw2-4,cx2+10)),py=cy+18+ph2>MB?cy-24-ph2:cy+18;
        box(px,py,pw2,ph2,fade(k,.6));
        txt((h.pnl>0?'+':'')+money(h.pnl),px+10,py+15,k,'700 14px Roboto Mono, monospace');
        txt(money(h.stake)+' → '+money(h.status==='won'?h.stake+h.pnl:h.status==='tie'?h.stake:0),px+10,py+34,col.muted,'500 11px Roboto Mono, monospace');
      }
      // long-press preview: tint + double indicator lines + small arrow placed ahead (between start and end)
      if(p.hold){
        const up=p.hold==='up',k=up?col.gu:col.gd,yc=Math.max(0,Math.min(MB,Y(price))),y0=up?0:yc,y1=up?yc:MB;
        if(y1>y0){const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,fade(k,up?.04:.26));g.addColorStop(1,fade(k,up?.26:.04));ctx.fillStyle=g;ctx.fillRect(0,y0,plotW,y1-y0)}
        for(const lx of [sx,Math.min(ex,plotW-3)]){
          ctx.lineWidth=1.3;ctx.setLineDash([4,4]);
          ctx.strokeStyle=col.muted;ctx.beginPath();ctx.moveTo(lx-1.5,TY-10);ctx.lineTo(lx-1.5,MB);ctx.stroke();
          ctx.strokeStyle=k;ctx.beginPath();ctx.moveTo(lx+1.5,TY-10);ctx.lineTo(lx+1.5,MB);ctx.stroke();ctx.setLineDash([])}
        const ax=sx+(Math.min(ex,plotW-6)-sx)*.64,ay=Math.max(TY+18,Math.min(MB-18,yc+(up?-46:34)));
        ctx.save();ctx.translate(ax,ay);ctx.rotate(up?-Math.PI/4:Math.PI/4);ctx.scale(.95,.95);
        ctx.beginPath();ctx.moveTo(-20,-6);ctx.lineTo(4,-6);ctx.lineTo(4,-15);ctx.lineTo(22,0);ctx.lineTo(4,15);ctx.lineTo(4,6);ctx.lineTo(-20,6);ctx.closePath();
        ctx.lineJoin='round';ctx.shadowColor='rgba(0,0,0,.28)';ctx.shadowBlur=7;ctx.fillStyle=k;ctx.fill();ctx.lineWidth=5;ctx.strokeStyle='#fff';ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle=k;ctx.fill();ctx.restore();
      }
      // open trades
      let endDrawn = false;
      const tz = -new Date().getTimezoneOffset();
      const gmtTag = 'GMT' + (tz >= 0 ? '+' : '-') + Math.floor(Math.abs(tz) / 60);

      for (const t of mine) {
        if (t.status === 'pending') {
          if (t.target != null) {
            const y = Y(t.target);
            ctx.setLineDash([6, 4]);
            ctx.strokeStyle = '#6c43f5';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(plotW, y);
            ctx.stroke();
            ctx.setLineDash([]);
            txt('Target ' + fmtP(t.asset, t.target), plotW - 6, y - 6, '#6c43f5', '600 10px Inter, sans-serif', 'right');
            continue;
          }
          const x = X(t.openT);
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = col.muted;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x, TY - 10);
          ctx.lineTo(x, MB);
          ctx.stroke();
          ctx.setLineDash([]);
          txt('Pending ' + mmss(t.openT - now), x - 6, TY - 14, col.muted, '600 10px Inter, sans-serif', 'right');
          continue;
        }

        const isUp = t.dir === 'up';
        const win = isUp ? price >= t.entry : price <= t.entry;
        const tradeColor = isUp ? '#1b9a68' : '#e5484d';
        const statusColor = win ? '#1b9a68' : '#e5484d';
        const x1 = Math.max(2, X(t.openT));
        const x2 = Math.min(plotW - 2, X(t.expT));
        const yy = Y(t.entry);
        const curX = Math.min(plotW - 4, Math.max(x1, X(now)));

        // 1. Horizontal Strike Price Line:
        // Solid colored line from open candle to current candle
        ctx.strokeStyle = tradeColor;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(x1, yy);
        ctx.lineTo(curX, yy);
        ctx.stroke();

        // Dashed line continuing from current candle to expiration line / right axis
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = tradeColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(curX, yy);
        ctx.lineTo(plotW, yy);
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. Start marker base at entry candle
        if (x1 >= 0 && x1 <= plotW) {
          ctx.fillStyle = tradeColor;
          ctx.fillRect(x1 - 10, yy - 1.5, 20, 3);
        }

        // 3. Dot on current candle / strike line
        if (curX >= 0 && curX <= plotW) {
          ctx.beginPath();
          ctx.arc(curX, yy, 3.6, 0, Math.PI * 2);
          ctx.fillStyle = tradeColor;
          ctx.fill();
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();
        }

        // 4. Trade badge (e.g. "↑ $1 00:43" or "↓ $1 00:25")
        const sym = isUp ? '↑' : '↓';
        const stakeStr = money(t.stake).replace(/\.00$/, '');
        const timeStr = mmss(t.expT - now);
        const lb = `${sym} ${stakeStr} ${timeStr}`;
        ctx.font = '700 11px Inter, -apple-system, Roboto, sans-serif';
        const bw = ctx.measureText(lb).width + 14, bh = 20;
        const bx = Math.min(plotW - bw - 4, Math.max(4, x1 - 10));
        const by = yy - bh - 4;
        rr(bx, by, bw, bh, 4, tradeColor);
        txt(lb, bx + bw / 2, by + bh / 2, '#ffffff', '700 11px Inter, -apple-system, Roboto, sans-serif', 'center');

        // 5. Directional Arrow ("Arrow asa chota" - compact white-bordered 3D arrow like in screenshot)
        // Positioned beside the current candle dot!
        // In screenshot 1 (losing UP trade): Red ↘ below the line
        // In screenshot 2 (winning UP trade): Green ↗ above the line
        const arrowAngle = win ? (isUp ? -Math.PI / 4 : Math.PI / 4) : (isUp ? Math.PI / 4 : -Math.PI / 4);
        const arrowColor = statusColor;
        const arrowX = Math.min(plotW - 16, Math.max(x1 + 18, curX + 14));
        const arrowY = win ? (isUp ? yy - 20 : yy + 20) : (isUp ? yy + 20 : yy - 20);

        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(arrowAngle);
        ctx.beginPath();
        // Compact sleek arrow polygon (~22px length, 10px width)
        ctx.moveTo(-10, -4);
        ctx.lineTo(1, -4);
        ctx.lineTo(1, -8);
        ctx.lineTo(11, 0);
        ctx.lineTo(1, 8);
        ctx.lineTo(1, 4);
        ctx.lineTo(-10, 4);
        ctx.closePath();
        ctx.lineJoin = 'round';
        ctx.shadowColor = 'rgba(0,0,0,0.25)';
        ctx.shadowBlur = 5;
        ctx.fillStyle = arrowColor;
        ctx.fill();
        ctx.lineWidth = 2.8;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = arrowColor;
        ctx.fill();
        ctx.restore();

        // 6. Beginning of trade marker
        if (x1 >= 0 && x1 < plotW - 4) {
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = '#9aa0a6';
          ctx.globalAlpha = 0.55;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x1, TY - 6);
          ctx.lineTo(x1, MB);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
          const openDate = new Date(t.openT);
          const timeHms = pad(openDate.getHours()) + ':' + pad(openDate.getMinutes()) + ':' + pad(openDate.getSeconds());
          txt(`🟢 ${timeHms} ${gmtTag} »`, x1, TY - 20, col.fg, '600 9.5px Inter, sans-serif', 'center');
          txt('Beginning of trade', x1, TY - 9, col.muted, '500 9px Inter, sans-serif', 'center');
        }

        // 7. End of trade marker
        if (!endDrawn && X(t.expT) < plotW - 4) {
          endDrawn = true;
          const x = X(t.expT);
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = '#e5484d';
          ctx.globalAlpha = 0.55;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, TY - 6);
          ctx.lineTo(x, MB);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
          txt('« End of trade', x, TY - 20, col.muted, '600 9.5px Inter, sans-serif', 'center');
          txt(mmss(t.expT - now), x, TY - 9, col.fg, '700 10px Inter, sans-serif', 'center');
        }
      }
      // results
      for(const r of eng.results){if(r.asset!==p.assetId)continue;const age=now-r.t;if(age>9000)continue;
        ctx.globalAlpha=age>7500?(9000-age)/1500:1;const k=r.pnl>=0?col.gu:col.gd;
        const l1=(r.pnl>=0?'+':'')+money(r.pnl),l2=money(r.stake)+' → '+money(r.pnl>=0?r.stake+r.pnl:r.pnl===0?r.stake:0);
        ctx.font='800 12px Roboto, sans-serif';const w=Math.max(ctx.measureText(l1).width,ctx.measureText(l2).width)+18;
        const bx=Math.max(6,Math.min(plotW-w-6,anchor-w-12)),by=Math.max(TY,Math.min(MB-46,Y(r.price)-56));
        rr(bx,by,w,40,10,k);ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();txt(l1,bx+9,by+13,'#fff','800 12px Roboto, sans-serif');txt(l2,bx+9,by+29,'#ffffffcc','500 9.5px Roboto, sans-serif');ctx.globalAlpha=1}
      for(const sk of (strokes.current[p.assetId]||[])){ctx.strokeStyle=sk.c;ctx.fillStyle=sk.c;ctx.lineWidth=2.6;ctx.lineCap='round';ctx.lineJoin='round';
        if(sk.pts.length<2){ctx.beginPath();ctx.arc(X(sk.pts[0].t),Y(sk.pts[0].p),1.8,0,7);ctx.fill();continue}
        ctx.beginPath();sk.pts.forEach((q,i)=>{const x=X(q.t),yy=Y(q.p);if(i)ctx.lineTo(x,yy);else ctx.moveTo(x,yy)});ctx.stroke()}
      ctx.lineCap='butt';
      ctx.restore();
      // current price
      if(pan<1||true){const yy=Math.round(Y(price))+.5,dn=last.c<last.o,k=dn?'#e5484d':'#1b9a68';
        if(yy>TY-10&&yy<MB){
          ctx.setLineDash([5,4]);ctx.strokeStyle=dn?'#e5484d':'#1b9a68';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(plotW,yy);ctx.stroke();ctx.setLineDash([]);
          rr(plotW+2,yy-15,AX-4,30,4,k);
          txt(fmtP(p.assetId,price),plotW+AX/2,yy-5,'#fff','700 11px Inter, -apple-system, Roboto, sans-serif','center');
          txt(mmss(tfms-(now-last.t)),plotW+AX/2,yy+7,'rgba(255,255,255,.94)','600 9.5px Inter, -apple-system, Roboto, sans-serif','center')}}
      if(IR&&nO)drawPanes(ctx,IR,p.inds,{X,tfms,cw,plotW,MB,col,txt});
      raf=requestAnimationFrame(draw);
    };
    raf=requestAnimationFrame(draw);
    // interaction
    let drag=null,ink=null,pinch=null;const ptrs=new Map(),dist=()=>{const [a,b]=[...ptrs.values()];return Math.hypot(a.x-b.x,a.y-b.y)};
    const pt=e=>{const r=cv.getBoundingClientRect(),g=geo.current;return{t:g.cx0+(e.clientX-r.left-g.anchor)/g.cw*g.tfms,p:g.hi-(e.clientY-r.top-g.TY)/g.plotH*(g.hi-g.lo)}};
    const down=e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});if(ptrs.size===2){pinch={d:dist()||1,z:pr.current.zoom};drag=null;ink=null;return}if(pr.current.draw&&geo.current){const id=pr.current.assetId;ink={c:pr.current.color,pts:[pt(e)]};(strokes.current[id]=strokes.current[id]||[]).push(ink);redoS.current[id]=[];bump(n=>n+1);return}drag={x:e.clientX,pan:panRef.current};cv.style.cursor='grabbing'};
    const move=e=>{if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pinch&&ptrs.size>=2){setZoom(Math.max(.5,Math.min(6,+(pinch.z*dist()/pinch.d).toFixed(2))));return}if(ink){ink.pts.push(pt(e));return}if(!drag)return;const cw=(cv.clientWidth-60)/Math.max(10,Math.round(36/pr.current.zoom));panRef.current=Math.max(-4,Math.min(600,drag.pan+(e.clientX-drag.x)/cw));setPanned(panRef.current>1)};
    const up=e=>{if(e&&e.pointerId!==undefined){ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null}if(ink){ink=null;return}drag=null;cv.style.cursor='grab'};
    const wheel=e=>{e.preventDefault();setZoom(z=>Math.max(.5,Math.min(6,+(z+(e.deltaY<0?.2:-.2)).toFixed(2))))};
    cv.addEventListener('pointerdown',down);cv.addEventListener('pointermove',move);cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.addEventListener('wheel',wheel,{passive:false});
    return ()=>{cancelAnimationFrame(raf);ro.disconnect();cv.removeEventListener('pointerdown',down);cv.removeEventListener('pointermove',move);cv.removeEventListener('pointerup',up);cv.removeEventListener('pointercancel',up);cv.removeEventListener('wheel',wheel)};
  },[]);
  const nS=(strokes.current[assetId]||[]).length,nR=(redoS.current[assetId]||[]).length;
  const undo=()=>{const l=strokes.current[assetId]||[];if(!l.length)return;(redoS.current[assetId]=redoS.current[assetId]||[]).push(l.pop());bump(n=>n+1)};
  const redo=()=>{const r=redoS.current[assetId]||[];if(!r.length)return;(strokes.current[assetId]=strokes.current[assetId]||[]).push(r.pop());bump(n=>n+1)};
  const bp=buyPct(assetId,now);
  return <div className="chartwrap">
    <div className="sent" aria-hidden="true"><i style={{height:bp+'%'}}/></div>
    <span className="sentl" style={{top:18,color:'var(--up)'}}>{bp}%</span>
    <span className="sentl" style={{bottom:8,color:'var(--down)'}}>{100-bp}%</span>
    <canvas ref={cvRef} aria-label="Live price chart"/>
    <div className="clk"><button className="ibtn" onClick={onInfo} aria-label="Asset info"><Icon n="info" s={18}/></button><span className="dot"/><span>{hms(now)} GMT</span></div>
    {panned&&<button className="cbtn live" aria-label="Back to live" onClick={()=>{panRef.current=0;setPanned(false);onLive&&onLive()}}><Icon n="arrowR" s={21} sw={2.6}/></button>}
    {!tools&&<button className="cbtn set" aria-label="Chart tools" onClick={()=>setTools(true)}><Icon n="sliders" s={16}/></button>}
    {tools&&<div className="tools">
      <button className="tb" aria-label="Chart type" onClick={()=>setType(type==='line'?'candles':'line')}><Icon n={type==='line'?'chart':'candles'} s={18}/></button>
      <button className={'tb'+(setOpen?' on':'')} aria-label="Candle length and zoom" onClick={()=>{setSetOpen(o=>!o);setPalOpen(false);setIndOpen(false)}}>{tf<60?tf+'s':'1m'}</button>
      <button className={'tb'+(inds.length||indOpen?' on':'')} aria-label="Indicators" onClick={()=>{setIndOpen(o=>!o);setSetOpen(false);setPalOpen(false)}}><Icon n="pulse" s={18}/></button>
      <button className={'tb'+(drawOn?' on':'')} aria-label="Pencil" onClick={()=>setDrawOn(v=>!v)}><Icon n="pencil" s={18}/></button>
      <div className="tbrow"><button className="tb" disabled={!nS} aria-label="Undo" onClick={undo}><Icon n="undo" s={17}/></button><button className="tb" disabled={!nR} aria-label="Redo" onClick={redo}><Icon n="redo" s={17}/></button></div>
      <button className="tb" aria-label="Pencil color" style={{color}} onClick={()=>{setPalOpen(o=>!o);setSetOpen(false);setIndOpen(false)}}><Icon n="palette" s={19}/></button>
      <button className="tb" aria-label="Close tools" onClick={()=>{setTools(false);setDrawOn(false);setSetOpen(false);setPalOpen(false);setIndOpen(false)}}><Icon n="x" s={18}/></button>
    </div>}
    {tools&&indOpen&&<div className="setpop indp"><div className="ihd"><h4>Indicators{inds.length?` · ${inds.length}`:''}</h4>{inds.length>0&&<button onClick={()=>setInds([])}>Clear</button>}</div>
      {['ov','osc'].map(g=><div key={g}><h4>{g==='ov'?'On chart':'Oscillators (max 3)'}</h4>{IND.filter(d=>d[2]===g).map(d=><button key={d[0]} className={'irow'+(inds.includes(d[0])?' on':'')} onClick={()=>toggleInd(d[0])}><i style={{background:d[3]}}/>{d[1]}<span className="ck">{inds.includes(d[0])?'✓':''}</span></button>)}</div>)}</div>}
    {tools&&setOpen&&<div className="setpop">
      <div><h4>Candle length</h4><div className="seg">{TFS.map(t=><button key={t} className={tf===t?'on':''} onClick={()=>setTf(t)}>{t<60?t+'s':'1m'}</button>)}</div></div>
      <div><h4>Zoom</h4><div className="seg"><button onClick={()=>setZoom(z=>Math.max(.5,+(z-.25).toFixed(2)))} aria-label="Zoom out">−</button><button className="num" style={{pointerEvents:'none'}}>{Math.round(zoom*100)}%</button><button onClick={()=>setZoom(z=>Math.min(6,+(z+.25).toFixed(2)))} aria-label="Zoom in">+</button></div></div>
    </div>}
    {tools&&palOpen&&<div className="setpop pal">{COLORS.map(c=><button key={c} className={'sw2'+(c===color?' on':'')} style={{background:c}} onClick={()=>{setColor(c);setDrawOn(true);setPalOpen(false)}} aria-label={'Color '+c}/>)}</div>}
  </div>
}

/* ---------- asset picker ---------- */
function AssetSheet({cur,onPick,onClose,favs,toggleFav,now}){
  const [q,setQ]=useState(''),[tab,setTab]=useState('fixed'),[open,setOpen]=useState(()=>BYID[cur].cat),[sort,setSort]=useState('profit');
  const srt=l=>[...l].sort((a,b)=>sort==='profit'?b.pay-a.pay:chg24(b.id)-chg24(a.id));
  const match=a=>a.name.toLowerCase().includes(q.trim().toLowerCase());
  const Row=({a})=>{const c=chg24(a.id);return <div className={'arow'+(a.id===cur?' cur':'')} role="button" tabIndex={0} onClick={()=>onPick(a.id)} onKeyDown={e=>{if(e.key==='Enter')onPick(a.id)}}>
    <span className="n"><AIcon a={a}/><span>{a.name}</span></span>
    <span className={'ch '+(c>=0?'pos':'neg')}>{c>=0?'+':''}{c.toFixed(2)}%</span>
    <span style={{textAlign:'center'}}><span className="pill">{a.pay}%</span></span>
    <button className={'star'+(favs.includes(a.id)?' on':'')} aria-label="Toggle favourite" onClick={e=>{e.stopPropagation();toggleFav(a.id)}}><Icon n="star" s={17} fill={favs.includes(a.id)}/></button></div>};
  const Head=()=><div className="thead"><span>Asset</span><span style={{textAlign:'right'}}>24h</span><button style={{textAlign:'center',color:'var(--accent)',fontWeight:700}} onClick={()=>setSort(s=>s==='profit'?'move':'profit')}>{sort==='profit'?'Profit ↓':'24h ↓'}</button><span/></div>;
  return <div className="sheet" role="dialog" aria-label="Select asset">
    <SheetHead title="Select Asset" icon="list" onClose={onClose}/>
    <div className="search"><input id="asset-search" placeholder="Search assets..." value={q} onChange={e=>setQ(e.target.value)} autoFocus/><Icon n="search"/></div>
    <div className="tabs2"><button className={tab==='fav'?'on':''} onClick={()=>setTab('fav')}><Icon n="heart" s={15}/>Favorites</button><button className={tab==='fixed'?'on':''} onClick={()=>setTab('fixed')}><Icon n="clock" s={15}/>Fixed Time</button></div>
    <div className="body" style={{gap:0}}>
      {tab==='fav'?(favs.length?<><Head/>{srt(ASSETS.filter(a=>favs.includes(a.id)&&match(a))).map(a=><Row key={a.id} a={a}/>)}</>:<div className="empty"><div className="big"><Icon n="star" s={26}/></div><b>No favourites yet</b>Tap the star next to an asset to pin it here.</div>)
      :q?<><Head/>{srt(ASSETS.filter(match)).map(a=><Row key={a.id} a={a}/>)}{!ASSETS.some(match)&&<div className="empty"><b>No match</b>Try a different name.</div>}</>
      :CATS.map(c=>{const list=ASSETS.filter(a=>a.cat===c),o=open===c;return <div key={c}>
        <button className={'cat'+(o?' open':'')} onClick={()=>setOpen(o?'':c)}><span style={{color:o?'var(--accent)':'var(--muted)'}}><Icon n={c==='Crypto'?'wallet':c==='Stocks'?'bars':c==='Commodities'?'shield':c==='Indices'?'chart':'flag'} s={16}/></span>{c}<span className="ct">{list.length}</span><span className="sp"/><Icon n={o?'chevU':'chevD'} s={16}/></button>
        {o&&<><Head/>{srt(list).map(a=><Row key={a.id} a={a}/>)}</>}</div>})}
    </div>
  </div>
}

/* ---------- tournaments ---------- */
const FAKE=['kairo_fx','mia.trades','northwind','duskline','bluefin','tara_07','ledger_sam','orbit9','pipsqueak','quietbull','halcyon','vera.k'];
function Tournaments({joined,join,hist,balance,now}){
  const base=useRef(Date.now()).current;
  const T=[{id:'sprint',name:'Daily Sprint',prize:1000,fee:10,ends:base+3.5*3600e3,players:184,top:[642,590,515,470,402,366,318,271]},
    {id:'weekly',name:'Weekly Cup',prize:10000,fee:50,ends:base+3*86400e3,players:1260,top:[5210,4880,4301,3990,3745,3320,2990,2615]},
    {id:'crypto',name:'Crypto Showdown',prize:5000,fee:25,ends:base+26*3600e3,players:610,top:[2310,2120,1985,1760,1530,1388,1204,1010]}];
  const [open,setOpen]=useState(null);
  const left=ms=>{const s=Math.max(0,Math.floor(ms/1000));return `${Math.floor(s/86400)?Math.floor(s/86400)+'d ':''}${pad(Math.floor(s%86400/3600))}:${pad(Math.floor(s%3600/60))}:${pad(s%60)}`};
  return <>
    <div className="ttl"><h2><span className="ic"><Icon n="trophy"/></span>Tournaments</h2></div>
    <div className="demo-note"><Icon n="info" s={16}/>Demo tournaments. Entry fees come out of your demo balance and rivals are simulated.</div>
    {T.map(t=>{const j=joined[t.id],score=j?hist.filter(h=>h.closeT>=j).reduce((s,h)=>s+h.pnl,0):0;
      const board=FAKE.slice(0,8).map((n,i)=>({n,s:t.top[i]})),all=j?[...board,{n:'You',s:score,me:1}].sort((a,b)=>b.s-a.s):board,rank=all.findIndex(x=>x.me)+1;
      return <div className="card" key={t.id}>
        <div style={{display:'flex',justifyContent:'space-between',gap:8,alignItems:'center'}}>
          <div><b style={{fontSize:15}}>{t.name}</b><div className="note num" style={{marginTop:2}}>Ends in {left(t.ends-now)} · {t.players+(j?1:0)} players</div></div>
          <div style={{textAlign:'right'}}><div className="note">Prize pool</div><b className="num pos" style={{fontSize:16}}>${t.prize.toLocaleString()}</b></div></div>
        <div style={{display:'flex',gap:8,marginTop:10,alignItems:'center'}}>
          {j?<span className="dirtag up">Joined · rank #{rank}</span>:<button className="btn sm" disabled={balance<t.fee} onClick={()=>join(t)}>Join for ${t.fee}</button>}
          <button className="btn sm ghost" onClick={()=>setOpen(open===t.id?null:t.id)}>{open===t.id?'Hide':'Leaderboard'}</button></div>
        {open===t.id&&<div style={{marginTop:10}}>{all.map((x,i)=><div key={x.n} className={'lb'+(x.me?' me':'')}><span className="rk">{i+1}</span><span>{x.n}</span><span className="num">{money(x.s)}</span></div>)}</div>}
      </div>})}
  </>
}


/* ---------- pending trade sheet ---------- */
function PendSheet({a,price,pmode,setPmode,pTarget,setPTarget,pDelay,setPDelay,dur,setDur,eAlt,setEAlt,openAt,now,mode,amt,bump,swapMode,stake,balance,profit,place,onClose}){
  const tick=Math.pow(10,-a.dec)*(a.dec>=5?5:10),diff=+(pTarget-price).toFixed(a.dec),idx=Math.max(0,DURS.findIndex(d=>d[0]===dur));
  const openT=openAt(now),clock=(pmode==='time')!==eAlt,base=pmode==='time'?openT:now;
  const stepDur=d=>setDur(DURS[Math.max(0,Math.min(DURS.length-1,idx+d))][0]);
  const stp=(f,ic,l)=><button className="pst" onClick={f} aria-label={l}><Icon n={ic} s={15} sw={2.4}/></button>;
  const hr=<div className="phr"/>;
  return <div className="pbk" onClick={onClose}><div className="pbs" role="dialog" aria-label="Pending trade" onClick={e=>e.stopPropagation()}>
    <div className="phd"/>
    <div className="ptabs"><button className={pmode==='price'?'on':''} onClick={()=>setPmode('price')}><Icon n="chart" s={20}/>BY PRICE</button><button className={pmode==='time'?'on':''} onClick={()=>setPmode('time')}><Icon n="history" s={20}/>BY TIME</button></div>
    <div className="pbody">
      {pmode==='price'?<>
        <div className="prow"><span className="pl">TARGET PRICE</span><span className={'pdl '+(diff>0?'up':diff<0?'dn':'')}><Icon n={diff>=0?'chevU':'chevD'} s={12}/>{Math.abs(diff).toFixed(a.dec)}</span></div>
        <div className="prow">{stp(()=>setPTarget(v=>+(v-tick).toFixed(a.dec)),'minus','Lower target')}<b className="pbig num">{pTarget.toFixed(a.dec)}</b>{stp(()=>setPTarget(v=>+(v+tick).toFixed(a.dec)),'plus','Raise target')}</div>
        <div className="pcq">Current quote: <b className="num">{price.toFixed(a.dec)}</b></div>
      </>:<>
        <div className="prow"><span className="pl">OPENS AT</span><span className="pin num">in {mmss(openT-now)}</span></div>
        <div className="prow">{stp(()=>setPDelay(v=>Math.max(1,v-1)),'minus','Earlier')}<b className="pbig num">{hms(openT,false)}</b>{stp(()=>setPDelay(v=>Math.min(240,v+1)),'plus','Later')}</div>
        <div className="pchips">{[1,2,3,5,10,15,30,60].map(m=><button key={m} className={pDelay===m?'on':''} onClick={()=>setPDelay(m)}>+{m}m</button>)}</div>
      </>}
      {hr}
      <div className="prow"><span className="pt">{clock?'Expires at':'Expiration'}</span><span className="pstep">{stp(()=>stepDur(-1),'minus','Shorter')}<b className="pv num">{clock?hms(base+dur*1000,dur%60!==0):DURS[idx][1]}</b>{stp(()=>stepDur(1),'plus','Longer')}</span></div>
      <div className="psub">{pmode==='time'?DURS[idx][1]+' after open':clock?'if triggered now':'after trigger'} <i>·</i> <button onClick={()=>setEAlt(v=>!v)}>SWITCH TIME</button></div>
      {hr}
      <div className="prow"><span className="pt">Investments</span><span className="pstep">{stp(()=>bump(-10),'minus','Decrease')}<span className="pu">{mode}</span><b className="pv num">{amt}</b>{stp(()=>bump(10),'plus','Increase')}</span></div>
      <div className="psub num">{mode==='%'?money(stake):Math.round(stake/Math.max(balance,1)*100)+'%'} <button onClick={swapMode}>SWITCH</button></div>
      <div className="prow pprof"><span className="pt" style={{fontWeight:500,color:'var(--muted)'}}>Profit</span><span><b className="pp">+{a.pay}%</b> <b className="pd num">+{money(profit)}</b></span></div>
      <div className="trade"><button className="tbtn dn" disabled={stake<1} onClick={()=>place('down')}><span>LOWER</span><span className="ar"><Icon n="dnr" s={22} sw={2.6}/></span></button><button className="tbtn up" disabled={stake<1} onClick={()=>place('up')}><span>HIGHER</span><span className="ar"><Icon n="upr" s={22} sw={2.6}/></span></button></div>
    </div>
  </div></div>
}

/* ---------- leaderboard ---------- */
const LB=[['Ishara Palihawadana','',30120],['Kabir Verma','',28415],['Jawahir Al-Marzouq','',25394],['Fatima Shah','🇵🇰',24591],['Valeria Mendoza','🇲🇽',20255],['Zephyr Lee','🇦🇺',19574],['Sara Hayat','🇵🇰',17015],['Nadia Akhtar','🇵🇰',14923],['Aarav Sharma','🇮🇳',11946],['Lukas Brandt','🇩🇪',10382],['Amina Okafor','🇳🇬',9140],['Mateo Silva','🇧🇷',7815],['Hana Kimura','🇯🇵',6420],['Omar Haddad','🇦🇪',5107],['Chloe Martin','🇫🇷',3892]];
function Shield({c='#8c6df0'}){return <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true"><path d="M10 1l8 3v6c0 5-3.5 9-8 11C5.500 19 2 15 2 10V4z" fill={c} fillOpacity=".25" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/><path d="M10 6l3.500 4-3.500 5-3.500-5z" fill={c} fillOpacity=".55"/></svg>}
function Leaderboard({user,hist,net,onClose,onTour}){
  const [why,setWhy]=useState(false);
  const today=new Date().toDateString(),tToday=hist.filter(h=>new Date(h.closeT).toDateString()===today).length;
  const rank=hist.length?LB.filter(x=>x[2]>net).length+1:null;
  const medal=['#f5b50a','#b8bfd0','#e8731a'];
  const fmt=v=>'+$'+v.toLocaleString('en-US');
  return <>
    <div className="ttl"><h2><span className="ic" style={{background:'#fff6d6',color:'#e0a100',border:'1px solid #f7de8a'}}><Icon n="trophy"/></span>Leaderboard</h2><button className="xbtn" onClick={onClose} aria-label="Close"><Icon n="x"/></button></div>
    <div className="lbme"><div className="rkbox">{rank?'#'+rank:'--'}</div>
      <div style={{minWidth:0,flex:1}}><b className="nm"><span style={{fontSize:17,marginRight:6,verticalAlign:'-1px'}}>🇵🇰</span>{user.name} <span style={{verticalAlign:'-4px'}}><Shield c="#8a93aa"/></span></b><div className="note num">{tToday} trades today</div></div>
      <div style={{textAlign:'right'}}><b className={'num '+(net>=0?'pos':'neg')} style={{fontSize:20}}>{net>=0?'+':''}{money(net)}</b><div className="note num">{hist.length} trades</div></div></div>
    <button className="why" onClick={()=>setWhy(v=>!v)}><Icon n="info" s={16}/>How does this rating work?</button>
    {why&&<div className="demo-note"><Icon n="info" s={16}/>Traders are ranked by net profit and loss from closed trades. Your row counts your own demo trades; the other traders are simulated.</div>}
    <div className="lbh"><span>Rank</span><span>Trader</span><span style={{marginLeft:'auto'}}>P&amp;L</span></div>
    <div className="lbl2">{LB.map(([n,f,s],i)=><div className="lbr" key={n}>
      <span className="lrk">{i<3?<span style={{color:medal[i]}}><Icon n="trophy" s={26} sw={1.7}/></span>:i+1}</span>
      {i<3?<span className="lav"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="9" r="4.2" fill="currentColor"/><path d="M3.500 21c.6-4.700 4-7 8.500-7s7.900 2.300 8.500 7z" fill="currentColor"/></svg></span>:<span className="lfl">{f}</span>}
      <span className="lnm">{n}</span><Shield c={i<9?'#8c6df0':'#e0a100'}/>
      <b className="num pos lpl">{i===0?'+$30k+':fmt(s)}</b></div>)}</div>
    <button className="why" style={{margin:'14px 6px 6px'}} onClick={onTour}><Icon n="trophy" s={16}/>Tournaments</button>
  </>
}

/* ---------- single trade on chart ---------- */
function TradeView({h,onClose,onGo}){
  const [z,setZ]=useState(1);
  const A=BYID[h.asset],dec=A.dec,W=360,Ht=300,PR=56,PT=18,PB=24,pw=W-PR,ph=Ht-PT-PB;
  const path=h.path||[],cms=h.cms||5000,won=h.status==='won',tie=h.status==='tie',k=tie?'var(--muted)':won?'var(--up)':'var(--down)';
  let lo=Math.min(h.entry,h.close),hi=Math.max(h.entry,h.close);
  for(const c of path){lo=Math.min(lo,c[3]);hi=Math.max(hi,c[2])}
  const pd=(hi-lo)*0.18||h.entry*0.0004;lo-=pd;hi+=pd;
  const a0=Math.min(path.length?path[0][0]:h.openT,h.openT-30000),a1=h.closeT+(h.closeT-h.openT)*0.3+5000,mid=(h.openT+h.closeT)/2,hw=(a1-a0)/(2*z),t0=z===1?a0:mid-hw,t1=z===1?a1:mid+hw;
  const X=t=>(t-t0)/(t1-t0)*pw,Y=v=>PT+(hi-v)/(hi-lo)*ph;
  const rough=(hi-lo)/5,pwr=Math.pow(10,Math.floor(Math.log10(rough))),fr=rough/pwr,step=(fr<1.5?1:fr<3?2:fr<7?5:10)*pwr,grid=[];
  for(let v=Math.ceil(lo/step)*step;v<hi;v+=step)grid.push(v);
  const ex=X(h.openT),cx=X(h.closeT),ey=Y(h.entry),cy=Y(h.close),bw=Math.max(3,Math.min(14,X(t0+cms)*0.6));
  const lbl=(x,y,t,al='start',k='lbl')=><g key={k}><rect x={al==='end'?x-60:x} y={y-9} width="60" height="18" rx="6" style={{fill:'var(--surface)',stroke:'var(--line)'}}/><text x={al==='end'?x-30:x+30} y={y+4} textAnchor="middle" fontSize="10.500" style={{fill:'var(--fg)',fontFamily:'var(--mono)'}}>{t}</text></g>;
  const rx=Math.max(4,Math.min(pw-118,cx-118)),ry=cy<Ht/2?cy+16:cy-58;
  const row=(l,v)=><div className="cr" key={l}><span>{l}</span><b className="num">{v}</b></div>;
  return <div className="sheet"><SheetHead title="Trade on chart" icon="history" onClose={onClose}/><div className="body">
    <div className="tvbox" style={{position:'relative',cursor:'pointer'}} onClick={onGo} role="button" aria-label="Open on chart"><svg viewBox={`0 0 ${W} ${Ht}`} width="100%" role="img" aria-label="Trade chart with entry and exit">
      {grid.map((v,i)=><g key={'grid-'+v+'-'+i}><line x1="0" x2={pw} y1={Y(v)} y2={Y(v)} style={{stroke:'var(--chart-grid)'}}/><text x={pw+6} y={Y(v)+3.500} fontSize="10" style={{fill:'var(--muted)',fontFamily:'var(--mono)'}}>{v.toFixed(dec)}</text></g>)}
      <defs><clipPath id="tvclip"><rect x="0" y="0" width={pw} height={Ht}/></clipPath></defs><g clipPath="url(#tvclip)">
      <rect x={ex} y={PT} width={Math.max(0,cx-ex)} height={ph} style={{fill:k,opacity:.08}}/>
      {path.map((c,i)=>{const x=X(c[0]+cms/2),up=c[4]>=c[1],cc=up?'var(--c-up)':'var(--c-down)';
        return <g key={'candle-'+c[0]+'-'+i} style={{stroke:cc,fill:cc}}><line x1={x} x2={x} y1={Y(c[2])} y2={Y(c[3])} strokeWidth="1.300"/><rect x={x-bw/2} y={Y(Math.max(c[1],c[4]))} width={bw} height={Math.max(1.500,Math.abs(Y(c[1])-Y(c[4])))} stroke="none"/></g>})}
      {!path.length&&<line x1={ex} y1={ey} x2={cx} y2={cy} strokeWidth="1.500" style={{stroke:'var(--muted)'}}/>}
      <line x1={ex} x2={cx} y1={ey} y2={ey} strokeWidth="2.200" style={{stroke:k}}/>
      <line className="dot-line" x1={cx} x2={cx} y1={ey} y2={cy} strokeWidth="2" strokeDasharray="4 4" style={{stroke:k}}/>
      <circle cx={ex} cy={ey} r="5" strokeWidth="2.200" style={{fill:'var(--surface)',stroke:k}}/>
      <circle cx={cx} cy={cy} r="5" strokeWidth="2.200" style={{fill:'var(--surface)',stroke:k}}/></g>
      {lbl(ex-8,ey-(h.dir==='up'?16:-16),fmtP(h.asset,h.entry),'end','lbl-entry')}
      {lbl(cx+8,cy+(cy>ey?16:-16),fmtP(h.asset,h.close),'start','lbl-close')}
      <g key="pnl-box"><rect x={rx} y={ry} width="112" height="42" rx="10" style={{fill:'var(--surface)',stroke:k}} strokeWidth="1.500"/>
        <text x={rx+10} y={ry+17} fontSize="13" fontWeight="800" style={{fill:k,fontFamily:'var(--mono)'}}>{h.pnl>0?'+':''}{money(h.pnl)}</text>
        <text x={rx+10} y={ry+33} fontSize="10.500" style={{fill:'var(--muted)',fontFamily:'var(--mono)'}}>{money(h.stake)} → {money(won?h.stake+h.pnl:tie?h.stake:0)}</text></g>
      <text x={ex} y={Ht-8} fontSize="9.500" textAnchor="middle" style={{fill:'var(--muted)',fontFamily:'var(--mono)'}}>{hms(h.openT)}</text>
      <text x={cx} y={Ht-8} fontSize="9.500" textAnchor="middle" style={{fill:'var(--muted)',fontFamily:'var(--mono)'}}>{hms(h.closeT)}</text>
    </svg><button className="tvgo" style={{left:`${(rx+56)/W*100}%`,top:`${(ry+54)/Ht*100}%`}} aria-label="Open on chart" onClick={e=>{e.stopPropagation();onGo()}}><Icon n="arrowR" s={20} sw={2.6}/></button></div>
    <div className="note" style={{textAlign:'center'}}>Tap the chart to see this trade on the main chart</div>
    <div className="seg" style={{alignSelf:'center',width:190}}><button onClick={()=>setZ(v=>Math.max(1,+(v-.5).toFixed(1)))} aria-label="Zoom out">−</button><button className="num" style={{pointerEvents:'none'}}>{Math.round(z*100)}%</button><button onClick={()=>setZ(v=>Math.min(6,+(v+.5).toFixed(1)))} aria-label="Zoom in">+</button></div>
    {!path.length&&<div className="note">Candle data was not saved for this older trade, so only entry and exit are shown.</div>}
    <div className="card">{row('Asset',A.name)}{row('Direction',h.dir==='up'?'Higher':'Lower')}{row('Opened',hms(h.openT)+' GMT')}{row('Closed',hms(h.closeT)+' GMT')}{row('Entry price',fmtP(h.asset,h.entry))}{row('Close price',fmtP(h.asset,h.close))}{row('Result',(h.pnl>0?'+':'')+money(h.pnl))}</div>
  </div></div>
}

/* ---------- main app ---------- */
function App(){
  const [authed,setAuthed]=useState(true),[tab,setTab]=useState('chart'),[sheet,setSheet]=useState(null),[pop,setPop]=useState(null);
  const [assetId,setAssetId]=useState(()=>lsGet('tp_asset','EURUSD')),[tf,setTf]=useState(()=>lsGet('tp_tf',5)),[ctype,setCtype]=useState('candles'),[zoom,setZoom]=useState(1.7);
  const [accType,setAccType]=useState(()=>lsGet('tp_acctype','demo'));
  const [demoBal,setDemoBal]=useState(()=>lsGet('tp_bal',10001.43));
  const [liveBal,setLiveBal]=useState(()=>lsGet('tp_live_bal',1250));
  const [open,setOpen]=useState([]),[hist,setHist]=useState(()=>lsGet('tp_hist',[]));
  const balance=accType==='live'?liveBal:demoBal;
  const setBalance=useCallback((fnOrVal)=>{
    if(accType==='live'){
      setLiveBal(prev=>{
        const next=typeof fnOrVal==='function'?fnOrVal(prev):fnOrVal;
        const val=+(+next).toFixed(2);
        lsSet('tp_live_bal',val);
        return val;
      });
    }else{
      setDemoBal(prev=>{
        const next=typeof fnOrVal==='function'?fnOrVal(prev):fnOrVal;
        const val=+(+next).toFixed(2);
        lsSet('tp_bal',val);
        return val;
      });
    }
  },[accType]);
  const [amt,setAmt]=useState(1),[mode,setMode]=useState('$'),[dur,setDur]=useState(60),[pending,setPending]=useState(false);
  const [favs,setFavs]=useState(()=>lsGet('tp_favs',['EURUSD','Bitcoin'])),[theme,setTheme]=useState(()=>{const t=lsGet('tp_theme','light');return t==='dark'?'dark':'light'}),[sound,setSound]=useState(()=>lsGet('tp_sound',true));
  const [user,setUser]=useState(()=>lsGet('tp_user',{name:'Demo Trader',email:'demo@tradepad.app',id:'1148212757',verified:false}));
  const [joined,setJoined]=useState(()=>lsGet('tp_tour',{}));
  const [toasts,setToasts]=useState([]),[now,setNow]=useState(Date.now()),[flt,setFlt]=useState('all'),[faq,setFaq]=useState(0);
  const [oneClick,setOneClick]=useState(()=>lsGet('tp_oneclick',false)),[confirm,setConfirm]=useState(null),[chk,setChk]=useState(false);
  const [tv,setTv]=useState(null),[lbv,setLbv]=useState('lb'),[review,setReview]=useState(null),[pmode,setPmode]=useState('time'),[pDelay,setPDelay]=useState(1),[pTarget,setPTarget]=useState(0),[eAlt,setEAlt]=useState(false),[hold,setHold]=useState(null),holdT=useRef(0);
  const openRef=useRef([]),confirmAt=useRef(0);
  const held=open.reduce((s,t)=>s+t.stake,0);
  useEffect(()=>{if(accType==='live')lsSet('tp_live_bal',+(liveBal).toFixed(2));else lsSet('tp_bal',+(demoBal).toFixed(2))},[demoBal,liveBal,accType]);
  useEffect(()=>{lsSet('tp_hist',hist)},[hist]);
  useEffect(()=>{lsSet('tp_oneclick',oneClick)},[oneClick]);
  useEffect(()=>{lsSet('tp_acctype',accType);lsSet('tp_asset',assetId);lsSet('tp_tf',tf);lsSet('tp_favs',favs);lsSet('tp_theme',theme);lsSet('tp_sound',sound);lsSet('tp_user',user);lsSet('tp_tour',joined)},[accType,assetId,tf,favs,theme,sound,user,joined]);
  useEffect(()=>{const r=document.documentElement;if(theme==='system')r.removeAttribute('data-theme');else r.setAttribute('data-theme',theme)},[theme]);
  const toast=useCallback((msg,kind)=>{const id=Math.random();setToasts(t=>[...t,{id,msg,kind}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),kind?4200:2600)},[]);
  const notify=useCallback(n=>{const id=Math.random();setToasts(t=>[...t,{id,n}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),4600)},[]);
  const commit=arr=>{openRef.current=arr;setOpen(arr)};

  const settle=()=>{
    const n=Date.now(),cur=openRef.current;if(!cur.length)return;let changed=false;const keep=[],done=[];
    for(const t0 of cur){let t=t0;
      if(t.status==='pending'){
        if(t.target!=null){const pr=eng.prices[t.asset];if(t.side==='above'?pr>=t.target:pr<=t.target){t={...t,status:'open',entry:pr,openT:n,expT:n+t.durMs};changed=true}}
        else if(n>=t.openT){t={...t,status:'open',entry:eng.prices[t.asset]};changed=true}}
      if(t.status==='open'&&n>=t.expT){const close=eng.prices[t.asset],a=BYID[t.asset],e=+t.entry.toFixed(a.dec),c=+close.toFixed(a.dec);
        let pnl=0,res='tie';if(c!==e){const w=t.dir==='up'?c>e:c<e;res=w?'won':'lost';pnl=w?+(t.stake*t.pct/100).toFixed(2):-t.stake}
        const raw=(eng.candles[t.asset]||[]).filter(c=>c.t>=t.openT-45000&&c.t<=n),mm=Math.max(1,Math.ceil(raw.length/60)),path=agg(raw,mm).map(c=>[c.t,c.o,c.h,c.l,c.c]);
        done.push({...t,status:res,close,pnl,closeT:n,path,cms:5000*mm,sid:eng.sid});changed=true;continue}
      keep.push(t)}
    if(!changed)return;commit(keep);
    if(done.length){setHist(h=>[...done.slice().reverse(),...h].slice(0,300));
      for(const d of done){
        const ret=d.status==='won'?d.stake+d.pnl:d.status==='tie'?d.stake:0;
        if(d.accType==='live'){
          setLiveBal(b=>{const nb=+(b+ret).toFixed(2);lsSet('tp_live_bal',nb);return nb;});
        }else{
          setDemoBal(b=>{const nb=+(b+ret).toFixed(2);lsSet('tp_bal',nb);return nb;});
        }
        eng.results.push({asset:d.asset,pnl:d.pnl,stake:d.stake,price:d.close,t:n});
        beep(sound,d.status==='won'?880:d.status==='lost'?220:440,.25);
      }
      eng.results=eng.results.filter(r=>n-r.t<10000)}
  };
  useEffect(()=>{const id=setInterval(()=>{tickEngine();setNow(Date.now());settle()},250);return ()=>clearInterval(id)},[sound]);

  const a=BYID[assetId],price=eng.prices[assetId];
  const stake=Math.max(0,mode==='$'?+amt||0:+((balance*(+amt||0))/100).toFixed(2));
  const profit=+(stake*a.pay/100).toFixed(2);
  const openAt=n=>Math.ceil((n+pDelay*60000)/60000)*60000;
  const byPrice=pending&&pmode==='price';
  const pendMs=pending&&!byPrice?openAt(now):0;
  const place=dir=>{
    if(stake<1){toast('Minimum investment is $1.00');return false}
    if(stake>balance){toast(`Not enough ${accType==='live'?'Live':'Demo'} balance. Top up funds.`);return false}
    if(stake>MAXI){toast('Maximum investment is $5,000.00');return false}
    const n=Date.now(),start=pending&&!byPrice?openAt(n):n;
    const t={id:Math.random().toString(36).slice(2),asset:assetId,dir,stake:+stake.toFixed(2),pct:a.pay,openT:start,expT:start+dur*1000,entry:pending?null:eng.prices[assetId],status:pending?'pending':'open',accType,...(byPrice?{target:pTarget,side:pTarget>=price?'above':'below',durMs:dur*1000}:{})};
    commit([...openRef.current,t]);setBalance(b=>+(b-t.stake).toFixed(2));beep(sound,520,.08);
    return true;
  };
  const openPend=()=>{setPending(true);setPTarget(+price.toFixed(a.dec));setSheet('pend')};
  const tryTrade=dir=>{
    if(stake<1||stake>balance||stake>MAXI||oneClick){place(dir);return}
    setChk(false);confirmAt.current=Date.now();setConfirm(dir)};
  const holdOn=d=>{clearTimeout(holdT.current);holdT.current=setTimeout(()=>setHold(d),220)},holdOff=()=>{clearTimeout(holdT.current);setHold(null)};
  const hp=d=>({onPointerDown:()=>holdOn(d),onPointerUp:holdOff,onPointerLeave:holdOff,onPointerCancel:holdOff,onContextMenu:e=>e.preventDefault()});
  const doConfirm=()=>{const d=confirm;setConfirm(null);if(chk)setOneClick(true);place(d)};
  const mine=open.filter(t=>t.asset===assetId);
  const live=mine.filter(t=>t.status==='open');
  const liveVal=live.reduce((s,t)=>{const w=t.dir==='up'?price>t.entry:price<t.entry;return s+(w?t.stake*t.pct/100:-t.stake)},0);
  const chipCls=live.length?(liveVal>0?'win':'lose'):'';
  const toggleFav=id=>setFavs(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]);
  const go=t=>{setTab(t);setSheet(null);setPop(null);setConfirm(null);setReview(null)};
  const viewTrade=h=>{const arr=eng.candles[h.asset]||[],live=h.sid&&h.sid===eng.sid&&arr.length&&arr[0].t<=h.openT-20000;
    setAssetId(h.asset);setSheet(null);setPop(null);setTab('chart');setReview({h:live||h.path?h:mkPath(h),k:Date.now(),stored:!live})};
  const startAt=pending?pendMs:now;
  const durLabel=DURS.find(d=>d[0]===dur)[1];
  const swapMode=()=>{if(mode==='$'){setAmt(Math.max(1,Math.min(100,Math.round(stake/Math.max(balance,1)*100))));setMode('%')}else{setAmt(+stake.toFixed(2));setMode('$')}};
  const bump=d=>setAmt(v=>Math.max(mode==='$'?1:1,+((+v||0)+(mode==='$'?d:d/10)).toFixed(2)));
  const stats=useMemo(()=>{const w=hist.filter(h=>h.status==='won'),l=hist.filter(h=>h.status==='lost'),net=hist.reduce((s,h)=>s+h.pnl,0);
    const by={};hist.forEach(h=>{by[h.asset]=(by[h.asset]||0)+h.pnl});
    const rev=[...hist].reverse();let run=0;const curve=rev.map(h=>run+=h.pnl);
    return{n:hist.length,w:w.length,l:l.length,rate:hist.length?Math.round(w.length/Math.max(1,w.length+l.length)*100):0,net,vol:hist.reduce((s,h)=>s+h.stake,0),best:Math.max(0,...hist.map(h=>h.pnl)),worst:Math.min(0,...hist.map(h=>h.pnl)),by:Object.entries(by).sort((x,y)=>y[1]-x[1]),curve}},[hist]);

  if(!authed)return <Login onIn={()=>{setAuthed(true);setTab('chart')}}/>;

  const Sheets=()=>{
    if(sheet==='asset')return <AssetSheet cur={assetId} favs={favs} toggleFav={toggleFav} now={now} onClose={()=>setSheet(null)} onPick={id=>{setAssetId(id);setSheet(null)}}/>;
    const close=()=>setSheet(null);
    if(sheet==='pend')return <PendSheet a={a} price={price} pmode={pmode} setPmode={setPmode} pTarget={pTarget} setPTarget={setPTarget} pDelay={pDelay} setPDelay={setPDelay} dur={dur} setDur={setDur} eAlt={eAlt} setEAlt={setEAlt} openAt={openAt} now={now} mode={mode} amt={amt} bump={bump} swapMode={swapMode} stake={stake} balance={balance} profit={profit} place={d=>{if(place(d))setSheet(null)}} onClose={close}/>;
    if(sheet==='info')return <AssetInfo a={a} onClose={close}/>;
    if(sheet==='trade'&&tv)return <TradeView h={tv} onClose={close} onGo={()=>viewTrade(tv)}/>;
    if(sheet==='profile')return <div className="sheet"><SheetHead title="Profile" icon="user" onClose={close}/><div className="body">
      <div style={{display:'flex',alignItems:'center',gap:14}}><div className="avatar" style={{width:60,height:60,fontSize:22}}>{user.name[0]}</div><div><b style={{fontSize:16}}>{user.name}</b><div className="note">{user.email}</div></div></div>
      <div className="form"><label>Display name<input id="pname" value={user.name} onChange={e=>setUser({...user,name:e.target.value||' '})}/></label>
      <label>Email<input id="pmail" value={user.email} onChange={e=>setUser({...user,email:e.target.value})}/></label>
      <label>Account ID<input id="pid" value={user.id} readOnly/></label></div>
      <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}><div><b>{user.verified?'Verified (demo)':'Not verified'}</b><div className="note">Verification is simulated in this demo.</div></div>
      <button className="btn sm" onClick={()=>{setUser({...user,verified:!user.verified});toast(user.verified?'Verification removed':'Marked as verified (demo)')}}>{user.verified?'Undo':'Verify'}</button></div></div></div>;
    if(sheet==='topup')return <TopUp close={close} accType={accType} onSwitchAcc={t=>{setAccType(t);lsSet('tp_acctype',t)}} add={v=>{setBalance(b=>+(b+v).toFixed(2));toast(`Added ${money(v)} to ${accType==='live'?'Live Real':'Demo'} balance`);close()}}/>;
    if(sheet==='stats')return <div className="sheet"><SheetHead title="Trading Stats" icon="bars" onClose={close}/><div className="body">
      <div className="stats"><div className="stat"><small>Total trades</small><b>{stats.n}</b></div><div className="stat"><small>Win rate</small><b>{stats.rate}%</b></div><div className="stat"><small>Net P&amp;L</small><b className={stats.net>=0?'pos':'neg'}>{money(stats.net)}</b></div>
      <div className="stat"><small>Volume</small><b>{money(stats.vol)}</b></div><div className="stat"><small>Best trade</small><b className="pos">{money(stats.best)}</b></div><div className="stat"><small>Worst trade</small><b className="neg">{money(stats.worst)}</b></div></div>
      <div className="card"><b style={{fontSize:13}}>Cumulative P&amp;L</b>{stats.curve.length>1?<Spark data={stats.curve}/>:<div className="note" style={{marginTop:8}}>Place a few trades to see your curve.</div>}</div>
      <div className="card"><b style={{fontSize:13}}>By asset</b>{stats.by.length?stats.by.slice(0,6).map(([id,v])=><div className="lb" key={id} style={{padding:'8px 0'}}><AIcon a={BYID[id]} sm/><span>{BYID[id].name}</span><span className={'num '+(v>=0?'pos':'neg')}>{money(v)}</span></div>):<div className="note" style={{marginTop:8}}>No closed trades yet.</div>}</div>
      <button className="btn ghost" onClick={()=>{setHist([]);toast('History cleared')}}>Clear history</button></div></div>;
    if(sheet==='withdraw')return <div className="sheet"><SheetHead title="Withdrawals" icon="wallet" onClose={close}/><div className="body">
      <div className="demo-note"><Icon n="info" s={16}/>Demo funds can't be withdrawn. This screen only shows how the flow looks.</div>
      <div className="form"><label>Amount<input id="wamt" placeholder="0.00" inputMode="decimal" disabled/></label><label>Method<select id="wmeth" disabled><option>Bank transfer</option><option>Card</option><option>Crypto wallet</option></select></label></div>
      <button className="btn" disabled>Request withdrawal</button>
      <div className="empty"><b>No withdrawals</b>Requests you make on a live account will be listed here.</div></div></div>;
    if(sheet==='help'){const F=[['How does a fixed time trade work?','Pick an asset, set an investment and an expiry time, then choose Higher or Lower. If the price at expiry is on the side you chose you win the payout shown, otherwise you lose the investment.'],['What is the payout?','The profit percentage shown on the asset, such as +82%. A $100 winning trade at 82% returns your $100 plus $82.'],['Is this real money?','No. Everything here uses a simulated price feed and a demo balance, so nothing is deposited or withdrawn.'],['What is a pending trade?','Switch it on and the order waits for the next 15 second mark before it opens at the price of that moment.'],['What happens on a tie?','If the price at expiry equals the opening price, your investment is returned.']];
      return <div className="sheet"><SheetHead title="Help Center" icon="help" onClose={close}/><div className="body">{F.map((f,i)=><div className="faq" key={i}><button onClick={()=>setFaq(faq===i?-1:i)} aria-expanded={faq===i}>{f[0]}<Icon n={faq===i?'chevU':'chevD'} s={16}/></button>{faq===i&&<p>{f[1]}</p>}</div>)}</div></div>}
    if(sheet==='report')return <ReportIssue close={close} sent={()=>{toast('Report sent. Thanks for the feedback.');close()}}/>;
    if(sheet==='settings')return <div className="sheet"><SheetHead title="Settings" icon="gear" onClose={close}/><div className="body">
      <div><div className="note" style={{marginBottom:6}}>Theme</div><div className="seg">{['light','dark'].map(t=><button key={t} className={theme===t?'on':''} onClick={()=>setTheme(t)} style={{textTransform:'capitalize'}}>{t}</button>)}</div></div>
      <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b>Trade sounds</b><Switch on={sound} label="Trade sounds" onClick={()=>setSound(!sound)}/></div>
      <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}><div><b>Confirm trades</b><div className="note">Ask before placing Higher or Lower.</div></div><Switch on={!oneClick} label="Confirm trades" onClick={()=>setOneClick(!oneClick)}/></div>
      <div><div className="note" style={{marginBottom:6}}>Default candle length</div><div className="seg">{TFS.map(t=><button key={t} className={tf===t?'on':''} onClick={()=>setTf(t)}>{t<60?t+'s':'1m'}</button>)}</div></div>
      <button className="btn ghost" onClick={()=>{setDemoBal(10000);commit([]);toast('Demo balance reset to $10,000.00')}}>Reset demo balance to $10,000</button></div></div>;
    return null};

  const titles={chart:null};
  return <div className={'app'+(tab==='chart'&&!sheet?' flat':'')}>
    {tab==='chart'&&<>
      <div className="hdr">
        <button className={'chip '+chipCls} onClick={()=>setSheet('asset')} aria-label="Select asset">
          <AIcon a={a}/>
          <span style={{textAlign:'left',minWidth:0}}>
            <div className="nm">{a.name.replace(' (OTC)','')}</div>
            <div className="pc num">{a.pay}%{live.length?` ${liveVal>0?'+':'-'}${money(Math.abs(liveVal))}`:''}</div>
          </span>
          <Icon n="chevD" s={14}/>
        </button>
        <button className={'bal '+(accType==='live'?'live':'demo')} onClick={()=>setPop(pop==='bal'?null:'bal')} aria-label="Account balance">
          <Icon n="briefcase" s={14}/>
          <span className="num">{money(balance)}</span>
          {accType==='live'?<span className="live-tag"><i className="live-dot"/>LIVE</span>:<span className="demo-tag">DEMO</span>}
          <Icon n="chevD" s={11}/>
        </button>
        <button className={'acc-toggle '+(accType==='live'?'is-live':'is-demo')} onClick={()=>{
          const next=accType==='live'?'demo':'live';
          setAccType(next);lsSet('tp_acctype',next);
          toast(next==='live'?`🟢 Switched to LIVE Real Trading Account (${money(liveBal)})`:`🟡 Switched to DEMO Practice Account (${money(demoBal)})`);
        }} title="Quick switch between Demo and Live">
          <span className={accType==='demo'?'active':''}>DEMO</span>
          <span className={accType==='live'?'active':''}>LIVE</span>
        </button>
        <button className="wallet-btn" onClick={()=>setSheet('topup')} aria-label="Deposit / Top up" title="Deposit funds">
          <Icon n="wallet" s={16}/>
          <span className="wbadge">+</span>
        </button>
        <button className="avatar" onClick={()=>setPop(pop==='user'?null:'user')} aria-label="Account menu">{user.name[0]}</button>
      </div>
      {pop&&<div className="scrim" onClick={()=>setPop(null)}/>}
      {pop==='bal'&&<div className="pop" style={{top:58,right:30,minWidth:250}}>
        <div style={{padding:'6px 10px 4px',fontSize:10.5,fontWeight:800,letterSpacing:'.06em',color:'var(--muted)',textTransform:'uppercase'}}>Trading Accounts</div>
        <button className={'it '+(accType==='demo'?'on':'')} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}} onClick={()=>{setAccType('demo');lsSet('tp_acctype','demo');setPop(null);toast('Switched to Demo Practice Account')}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:6,fontWeight:700}}>Demo Account <span className="demo-tag">DEMO</span></div>
            <div style={{fontSize:10.5,color:'var(--muted)',marginTop:1}}>Virtual practice funds</div>
          </div>
          <b className="num" style={{fontSize:13.5}}>{money(demoBal)}</b>
        </button>
        <button className={'it '+(accType==='live'?'on':'')} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}} onClick={()=>{setAccType('live');lsSet('tp_acctype','live');setPop(null);toast('Switched to Live Real Trading Account')}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:6,fontWeight:700}}>Live Account <span className="live-tag"><i className="live-dot"/>LIVE</span></div>
            <div style={{fontSize:10.5,color:'var(--muted)',marginTop:1}}>Real money trading</div>
          </div>
          <b className="num" style={{fontSize:13.5,color:'#1b9a68'}}>{money(liveBal)}</b>
        </button>
        <hr/>
        <button className="it" onClick={()=>{setPop(null);setSheet('topup')}}><Icon n="plus" s={16}/>Deposit {accType==='live'?'Live':'Demo'} Funds</button>
        {accType==='demo'&&<button className="it" onClick={()=>{setDemoBal(10000);commit([]);setPop(null);toast('Demo balance reset to $10,000.00')}}><Icon n="history" s={16}/>Reset demo to $10,000</button>}
      </div>}
      {pop==='user'&&<div className="pop" style={{top:58,right:0,width:260}}>
        <div style={{padding:'10px 10px 6px'}}><b style={{fontSize:15}}>{user.name}</b><div className="note">{user.email}</div></div>
        <button className="it" style={{background:'var(--surface2)'}} onClick={()=>{setPop(null);setSheet('profile')}}><Icon n="info" s={16}/>{user.verified?'Verified (demo)':'Not Verified'}<span style={{marginLeft:'auto'}}><Icon n="chevR" s={14}/></span></button>
        <div className="note num" style={{padding:'6px 10px'}}>ID: {user.id}</div>
        {[['Personal Area','user','profile'],['Top Up','card','topup'],['Withdrawals','wallet','withdraw'],['Trades','history',null],['Trading Stats','bars','stats'],['Help Center','help','help']].map(([l,i,s])=><button className="it" key={l} onClick={()=>{setPop(null);s?setSheet(s):go('history')}}><Icon n={i} s={16}/>{l}</button>)}<hr/>
        <button className="it" style={{color:'var(--down)'}} onClick={()=>{setPop(null);setAuthed(false)}}><Icon n="logout" s={16}/>Log Out</button></div>}
      <Chart assetId={assetId} tf={tf} setTf={setTf} type={ctype} setType={setCtype} zoom={zoom} setZoom={setZoom} openTrades={mine} expMs={dur*1000} pendMs={pendMs} now={now} hold={hold} review={review} onLive={()=>setReview(null)} onInfo={()=>setSheet('info')}/>
      <div className="panel">
        <div className="acc-bar">
          <span>Account: <b className={accType==='live'?'live-txt':'demo-txt'}>{accType==='live'?'🟢 LIVE Real Account':'🟡 DEMO Practice'}</b> ({money(balance)})</span>
          <button className="acc-switch-btn" onClick={()=>{
            const next=accType==='live'?'demo':'live';
            setAccType(next);lsSet('tp_acctype',next);
            toast(next==='live'?`🟢 Switched to LIVE Account`:`🟡 Switched to DEMO Account`);
          }}>{accType==='live'?'Switch to Demo':'Switch to Live'}</button>
        </div>
        <div className="row2">
          <div><div className="lbl"><span>Investments</span><button onClick={swapMode}><Icon n="swap" s={12}/>{mode}</button></div>
            <div className="fld"><input id="stake" inputMode="decimal" value={amt} onChange={e=>setAmt(e.target.value.replace(/[^0-9.]/g,''))} aria-label="Investment amount"/><span className="u">{mode}</span>
              <button className="st" onClick={()=>bump(-10)} aria-label="Decrease"><Icon n="minus" s={13}/></button><button className="st" onClick={()=>bump(10)} aria-label="Increase"><Icon n="plus" s={13}/></button></div></div>
          <div style={{position:'relative'}}><div className="lbl"><span>Expiration</span><span style={{display:'flex',alignItems:'center',gap:6}}><button style={{fontSize:10,fontWeight:700,color:pending?'var(--accent)':'inherit'}} onClick={openPend}>Pending trade</button><Switch on={pending} label="Pending trade" onClick={()=>{if(pending)setPending(false);else openPend()}}/></span></div>
            <button className="fld" onClick={()=>setPop(pop==='dur'?null:'dur')} aria-haspopup="listbox"><span className="num" style={{flex:1}}>{hms(startAt+dur*1000)}</span><span className="u" style={{fontSize:11}}>{durLabel}</span><Icon n="chevD" s={14}/></button>
            {pop==='dur'&&<><div className="scrim" style={{position:'fixed'}} onClick={()=>setPop(null)}/><div className="pop" style={{bottom:56,right:0,minWidth:170}}>{DURS.map(([s,l])=><button key={s} className={'it'+(s===dur?' on':'')} onClick={()=>{setDur(s);setPop(null)}}><span style={{flex:1}}>{l}</span><span className="num" style={{fontSize:11,color:'var(--muted)'}}>{hms(startAt+s*1000)}</span></button>)}</div></>}</div>
        </div>
        <div className="prof"><span>Profit: <span className="a">+{a.pay}%</span></span><span className="a num">+{money(profit)}</span></div>
        <div className="trade"><button className="tbtn dn" disabled={stake<1} {...hp('down')} onClick={()=>{holdOff();tryTrade('down')}}><span>LOWER</span><span className="ar"><Icon n="dnr" s={22} sw={2.6}/></span></button><button className="tbtn up" disabled={stake<1} {...hp('up')} onClick={()=>{holdOff();tryTrade('up')}}><span>HIGHER</span><span className="ar"><Icon n="upr" s={22} sw={2.6}/></span></button></div>
        {confirm&&<><div className="scrim" style={{position:'fixed'}} onClick={()=>{if(Date.now()-confirmAt.current>400)setConfirm(null)}}/>
          <div className={'cwrap '+(confirm==='up'?'up':'dn')}><div className="confirm" role="dialog" aria-label="Confirm trade">
            <div className="ch1"><b>{a.name.replace(' (OTC)','')}</b><span className={'dirtag '+(confirm==='up'?'up':'dn')}><Icon n={confirm==='up'?'upr':'dnr'} s={16} sw={2.5}/>{confirm==='up'?'Higher':'Lower'}</span><button className="xbtn" onClick={()=>setConfirm(null)} aria-label="Cancel"><Icon n="x" s={16}/></button></div>
            <div className="cr"><span>Open price</span><b className="num">{pending?(byPrice?'Target '+fmtP(assetId,pTarget):'Opens '+hms(openAt(now),false)):fmtP(assetId,price)}</b></div>
            <div className="cr"><span>Invest</span><b className="num">{money(stake)}</b></div>
            <div className="cr"><span>Expiration</span><b className="num">{durLabel}</b></div>
            <button className={'cfm '+(confirm==='up'?'up':'dn')} onClick={doConfirm} autoFocus><Icon n={confirm==='up'?'upr':'dnr'} s={20} sw={2.5}/>Confirm {confirm==='up'?'Higher':'Lower'}</button>
            <label className="once"><input type="checkbox" checked={chk} onChange={e=>setChk(e.target.checked)}/>Always purchase in one click</label>
          </div></div></>}
      </div></>}

    {tab==='portfolio'&&<div className="screen"><div className="ttl"><h2><span className="ic"><Icon n="briefcase"/></span>Portfolio</h2><span className="note num">{open.length} open</span></div>
      {open.length?<div className="list">{open.map(t=>{const A=BYID[t.asset],p=eng.prices[t.asset],isOpen=t.status==='open',w=isOpen&&(t.dir==='up'?p>t.entry:p<t.entry),tot=t.expT-t.openT,left=t.expT-now;
        return <div className="tr" key={t.id}><div className="a"><AIcon a={A} sm/>{A.name}<span className={'dirtag '+(t.dir==='up'?'up':'dn')}><Icon n={t.dir==='up'?'upr':'dnr'} s={13} sw={2.5}/>{t.dir==='up'?'HIGHER':'LOWER'}</span><span className={'dirtag '+(t.accType==='live'?'up':'')} style={{fontSize:9.5,padding:'2px 5px',background:t.accType==='live'?'rgba(27,154,104,.15)':'rgba(217,120,11,.15)',color:t.accType==='live'?'#1b9a68':'#d9780b'}}>{t.accType==='live'?'LIVE':'DEMO'}</span></div>
          <div className={'r '+(isOpen?(w?'pos':'neg'):'')}>{isOpen?(w?'+'+money(t.stake*t.pct/100):money(-t.stake)):'Pending'}</div>
          <div className="m">{isOpen?`${fmtP(t.asset,t.entry)} → ${fmtP(t.asset,p)}`:`Opens ${hms(t.openT)} GMT`} · {money(t.stake)}</div><div className="m" style={{textAlign:'right'}}>{mmss(isOpen?left:t.openT-now)}</div>
          <div className="bar"><i style={{width:Math.max(0,Math.min(100,isOpen?(1-left/tot)*100:0))+'%',background:isOpen?(w?'var(--up)':'var(--down)'):'var(--muted)'}}/></div></div>})}</div>
      :<div className="empty"><div className="big"><Icon n="briefcase" s={26}/></div><b>No open trades</b>Pick Higher or Lower on the chart and your trade will show up here with a live result.<button className="btn" style={{marginTop:10}} onClick={()=>go('chart')}>Go to chart</button></div>}</div>}

    {tab==='history'&&<div className="screen"><div className="ttl"><h2><span className="ic"><Icon n="history"/></span>Trades History</h2></div>
      <div className="note num">Total Deals: {hist.length}{hist.length?` · Net ${money(stats.net)} · Win rate ${stats.rate}%`:''}</div>
      <div className="chips">{[['all','All'],['won','Won'],['lost','Lost']].map(([k,l])=><button key={k} className={flt===k?'on':''} onClick={()=>setFlt(k)}>{l}</button>)}</div>
      {hist.length?<div className="list">{hist.filter(h=>flt==='all'||h.status===flt).map(h=>{const A=BYID[h.asset];return <div className="tr hx" key={h.id}><div className="a"><AIcon a={A} sm/>{A.name}<span className={'dirtag '+(h.dir==='up'?'up':'dn')}><Icon n={h.dir==='up'?'upr':'dnr'} s={13} sw={2.5}/>{h.dir==='up'?'HIGHER':'LOWER'}</span><span className={'dirtag '+(h.accType==='live'?'up':'')} style={{fontSize:9.5,padding:'2px 5px',background:h.accType==='live'?'rgba(27,154,104,.15)':'rgba(217,120,11,.15)',color:h.accType==='live'?'#1b9a68':'#d9780b'}}>{h.accType==='live'?'LIVE':'DEMO'}</span></div>
        <div className={'r '+(h.pnl>0?'pos':h.pnl<0?'neg':'')}>{h.pnl>0?'+':''}{money(h.pnl)}</div><div className="m">{fmtP(h.asset,h.entry)} → {fmtP(h.asset,h.close)} · {money(h.stake)}</div><div className="m" style={{textAlign:'right'}}>{hms(h.closeT)}</div>
        <button className="gbtn" aria-label="Show trade on chart" onClick={()=>{setTv(h);setSheet('trade')}}><Icon n="chart" s={18}/></button></div>})}</div>
      :<div className="empty"><div className="big"><Icon n="history" s={26}/></div><b>No trades yet</b>Closed trades appear here with entry, exit and result.<button className="btn" style={{marginTop:10}} onClick={()=>go('chart')}>Make a trade</button></div>}</div>}

    {tab==='tour'&&<div className="screen">
      {lbv==='lb'?<Leaderboard user={user} hist={hist} net={stats.net} onClose={()=>go('chart')} onTour={()=>setLbv('tr')}/>:<><button className="why" onClick={()=>setLbv('lb')}>← Leaderboard</button><Tournaments joined={joined} hist={hist} balance={balance} now={now} join={t=>{setBalance(b=>+(b-t.fee).toFixed(2));setJoined(j=>({...j,[t.id]:Date.now()}));toast(`Joined ${t.name} for $${t.fee}`)}}/></>}</div>}

    {tab==='more'&&<div className="screen"><div className="ttl"><h2><span className="ic"><Icon n="menu"/></span>More</h2></div>
      <div className="menu">{[['Profile','user','profile',''],['Top Up','card','topup',''],['Trading Stats','bars','stats',''],['Withdrawals','wallet','withdraw',''],['Help','help','help','help'],['Report Issue','flag','report','warn'],['Settings','gear','settings','']].map(([l,i,s,c])=><button key={l} className={c} onClick={()=>setSheet(s)}><span className="mi"><Icon n={i} s={17}/></span><span>{l}</span><span className="sp"/><span className="ch2"><Icon n="chevR" s={15}/></span></button>)}
        <button className="out" onClick={()=>setAuthed(false)}><span className="mi"><Icon n="logout" s={17}/></span><span>Logout</span></button></div></div>}

    <nav className="nav" aria-label="Main">{[['chart','chart','Chart'],['portfolio','briefcase','Portfolio'],['history','history','History'],['tour','trophy','Leaderboard'],['more','menu','More']].map(([k,i,l])=>
      <button key={k} className={tab===k?'on':''} onClick={()=>go(k)}><Icon n={i} s={21}/>{l}{k==='portfolio'&&open.length>0&&<span className="badge">{open.length}</span>}</button>)}</nav>
    {Sheets()}
    <div className="toasts" aria-live="polite">{toasts.map(t=>t.n?<div key={t.id} className={'notif '+t.n.tone} role="status"><span className="bd"><Icon n={t.n.dir==='up'?'upr':'dnr'} s={26} sw={2.6}/></span><div style={{minWidth:0}}><b>{t.n.title}</b><small>{t.n.sub}</small></div><span className="tm">{t.n.tm}</span><i className="pg"/></div>:<div key={t.id} className={'toast '+(t.kind||'')}>{t.msg}</div>)}</div>
  </div>
}

function AssetInfo({a,onClose}){
  const [tab,setTab]=useState('cond'),prev=useRef(eng.prices[a.id]),dir=useRef(0);
  const price=eng.prices[a.id],c=chg24(a.id),str=fmtP(a.id,price),today=(new Date().getDay()+6)%7;
  if(price!==prev.current){dir.current=price>prev.current?1:-1;prev.current=price}
  const R=({k,v,cls})=><div className="crow"><span>{k}</span><b className={'num '+(cls||'')}>{v}</b></div>;
  return <div className="sheet" role="dialog" aria-label="Asset info">
    <div className="ahd"><span className="abox"><AIcon a={a}/></span><div style={{flex:1,minWidth:0}}><div className="an"><b>{a.name}</b><span className="open"><i/>Open</span></div><div className="note">{a.cat}</div></div><button className="xbtn" onClick={onClose} aria-label="Close"><Icon n="x"/></button></div>
    <div className="apx num"><span>{str.slice(0,-1)}<small style={{transform:dir.current>0?'translateY(-.28em)':dir.current<0?'translateY(.28em)':'none'}}>{str.slice(-1)}</small></span><em className={'chg '+(c>=0?'up':'dn')}>{c>=0?'+':''}{c.toFixed(2)}%</em></div>
    <div className="tabs2"><button className={tab==='info'?'on':''} onClick={()=>setTab('info')}><Icon n="info" s={15}/>Information</button><button className={tab==='cond'?'on':''} onClick={()=>setTab('cond')}><Icon n="sliders" s={15}/>Trading Conditions</button></div>
    <div className="body" style={{gap:0}}>
      {tab==='info'?<>
        <R k="Asset" v={a.name.replace(' (OTC)','')}/><R k="Category" v={a.cat}/><R k="Market" v="OTC · simulated feed"/><R k="Current price" v={str}/>
        <R k="24h open" v={fmtP(a.id,eng.open24[a.id])}/><R k="24h change" v={(c>=0?'+':'')+c.toFixed(2)+'%'} cls={c>=0?'pos':'neg'}/><R k="Price precision" v={a.dec+' decimals'}/><R k="Payout" v={'+'+a.pay+'%'} cls="pos"/>
      </>:<>
        <div className="csec bolt"><Icon n="bolt" s={18}/>Blitz mode (Timer-based)</div>
        <R k="Profit" v={'+'+a.pay+'%'} cls="pos"/><R k="Min investment" v="$1"/><R k="Max investment" v={'$'+MAXI.toLocaleString()}/>
        <R k="Durations" v={DURS.map(d=>d[1].replace(' sec','s').replace(' min','m')).join(', ')}/>
        <div className="csec"><Icon n="calendar" s={18}/>Trading schedule</div>
        {DAYS.map((d,i)=><div className={'crow'+(i===today?' now':'')} key={d}><span>{d}</span><b className="num">00:00 - 23:59</b></div>)}
        <div className="csec plain">Commission</div>
        <R k="Trading fee" v="None"/>
      </>}
    </div>
  </div>
}

function Spark({data}){
  const w=300,h=90,mn=Math.min(0,...data),mx=Math.max(0,...data),r=mx-mn||1,pts=data.map((v,i)=>[i/(data.length-1)*w,h-4-(v-mn)/r*(h-8)]);
  const last=data[data.length-1],z=h-4-(0-mn)/r*(h-8);
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{marginTop:8,display:'block'}} role="img" aria-label="Cumulative profit and loss"><line x1="0" x2={w} y1={z} y2={z} stroke="var(--line)" strokeDasharray="4 4"/>
    <polyline fill="none" stroke={last>=0?'var(--up)':'var(--down)'} strokeWidth="2" strokeLinejoin="round" points={pts.map(p=>p.join(',')).join(' ')}/><circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3.5" fill={last>=0?'var(--up)':'var(--down)'}/></svg>
}
function TopUp({close,add,accType,onSwitchAcc}){
  const isLive = accType === 'live';
  const [v,setV]=useState(isLive?250:1000),[m,setM]=useState('Card');
  return <div className="sheet"><SheetHead title={isLive ? "Deposit Funds (Live)" : "Top Up Demo Balance"} icon="card" onClose={close}/><div className="body">
    <div style={{display:'flex',gap:8,background:'var(--surface2)',padding:4,borderRadius:10,marginBottom:4}}>
      <button style={{flex:1,padding:'8px',borderRadius:8,fontWeight:700,fontSize:12,background:!isLive?'var(--surface)':'transparent',color:!isLive?'#d9780b':'var(--muted)',boxShadow:!isLive?'0 1px 3px rgba(0,0,0,.1)':''}} onClick={()=>onSwitchAcc&&onSwitchAcc('demo')}>🟡 Demo Practice</button>
      <button style={{flex:1,padding:'8px',borderRadius:8,fontWeight:700,fontSize:12,background:isLive?'var(--surface)':'transparent',color:isLive?'#1b9a68':'var(--muted)',boxShadow:isLive?'0 1px 3px rgba(0,0,0,.1)':''}} onClick={()=>onSwitchAcc&&onSwitchAcc('live')}>🟢 Live Real Account</button>
    </div>
    <div className="demo-note"><Icon n="info" s={16}/>{isLive ? 'Simulate adding real trading funds to your Live balance. Pick amount and payment method.' : 'Adds virtual demo funds for training and backtesting.'}</div>
    <div className="chips">{(isLive?[25,50,100,250,500,1000]:[100,500,1000,5000,10000]).map(x=><button key={x} className={v===x?'on':''} onClick={()=>setV(x)}>${x.toLocaleString()}</button>)}</div>
    <div className="form"><label>Amount ($)<input id="topamt" inputMode="decimal" value={v} onChange={e=>setV(+e.target.value.replace(/[^0-9.]/g,'')||0)}/></label></div>
    <div><div className="note" style={{marginBottom:6}}>Payment Method</div><div className="chips">{['Card','Bank Transfer','Crypto USDT','EasyPaisa / JazzCash'].map(x=><button key={x} className={m===x?'on':''} onClick={()=>setM(x)}>{x}</button>)}</div></div>
    <button className="btn" style={{background:isLive?'#1b9a68':'var(--accent)'}} disabled={v<1} onClick={()=>add(v)}>{isLive?`Deposit $${v.toLocaleString()} to Live Balance`:`Add $${v.toLocaleString()} Demo Funds`}</button></div></div>
}
function ReportIssue({close,sent}){
  const [t,setT]=useState('Chart'),[m,setM]=useState('');
  return <div className="sheet"><SheetHead title="Report Issue" icon="flag" onClose={close}/><div className="body"><form className="form" onSubmit={e=>{e.preventDefault();sent()}}>
    <label>Area<select id="rtype" value={t} onChange={e=>setT(e.target.value)}>{['Chart','Trades','Balance','Account','Other'].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>What went wrong?<textarea id="rmsg" value={m} onChange={e=>setM(e.target.value)} placeholder="Describe the problem and the steps to reproduce it."/></label>
    <button className="btn" disabled={m.trim().length<5}>Send report</button></form></div></div>
}
function Login({onIn}){
  const [reg,setReg]=useState(false);
  return <div className="login"><div className="logo"><Icon n="chart" s={24}/></div><div><h1>{reg?'Create demo account':'Sign in'}</h1><p>Practice fixed time trading with a $10,000 demo balance.</p></div>
    <form className="form" onSubmit={e=>{e.preventDefault();onIn()}}>
      <label>Email<input id="lemail" type="email" defaultValue="demo@tradepad.app" autoComplete="email"/></label>
      <label>Password<input id="lpass" type="password" defaultValue="demo1234" autoComplete="current-password"/></label>
      <button className="btn" style={{height:48}}>{reg?'Create account':'Sign in'}</button></form>
    <div className="note" style={{textAlign:'center'}}>Or continue with</div>
    <button className="btn ghost" style={{height:48}} onClick={onIn}>Google (demo)</button>
    <div className="note" style={{textAlign:'center'}}>{reg?'Already have an account?':"Don't have an account?"} <button style={{color:'var(--accent)',fontWeight:700}} onClick={()=>setReg(!reg)}>{reg?'Sign in':'Sign up'}</button></div>
    <div className="demo-note"><Icon n="info" s={16}/>Demo only. Any email and password works, and every price is simulated.</div></div>
}
export default App;
