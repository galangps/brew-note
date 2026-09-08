'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {Bean,Brew,BrewData,Pour,Recipe} from '@/lib/types';
import {loadData,saveData} from '@/lib/storage';
import {Coffee,BookOpen,FlaskConical,Plus,Heart,Play,Pause,Music,Search,Trash2,Save,Scale,ChevronRight,Timer,Bean as BeanIcon,X,Pencil} from 'lucide-react';

const uid=()=>Math.random().toString(36).slice(2,10);
const methods=['Pour Over / Manual Brew','Espresso'];
const roastLevels=['Light','Medium','Dark'];
const processes=['Natural','Washed','Honey','Wet Hulled','Anaerobic'];
const filters=['Hario V60 01','Hario V60 02','Flat Bottom B75','Hario Switch Dripper'];
const grinders=['Timemore Chestnut C3 ESP Pro','Vesper Grinder Lens','Other Grinders'];
const pourLabels=['Bloom','Pour 1','Pour 2','Pour 3','Final Pour'];
const techniques=['Circular','Center','Circular to Center','Center to Out'];
const speciesOptions=['Arabica','Robusta','Excelsa'];
const emptyRecipe=():Recipe=>({
  id:uid(),name:'',method:'Pour Over / Manual Brew',beanName:'',origin:'',process:'',roast:'Light',
  coffee:15,water:240,temp:92,ratio:16,grinder:'Timemore Chestnut C3 ESP Pro',grindSetting:'',
  grindSize:'Medium Fine',filter:'Hario V60 02',brewTime:'02:45',agitation:'',favorite:false,
  status:'Draft',rating:0,notes:'',createdAt:new Date().toISOString().slice(0,10),
  iced:false,icePlacement:'end',iceStart:0,iceEnd:0,
  pours:[{id:uid(),label:'Bloom',start:'00:00',amount:45,mode:'cumulative',technique:'Circular',stepType:'water'}]
});

const iceTotal=(r:Recipe)=>r.pours.filter(p=>p.stepType==='ice').reduce((s,p)=>s+(Number(p.amount)||0),0);
const brewLiquid=(r:Recipe)=>Number(r.water)||0;
const finalWater=(r:Recipe)=>brewLiquid(r)+iceTotal(r);
const finalRatio=(r:Recipe)=>r.coffee>0?finalWater(r)/r.coffee:0;
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
const liquidIceRatio=(r:Recipe)=>{
  const l=Math.round(brewLiquid(r)), i=Math.round(iceTotal(r));
  if(i<=0)return `${l}:0`;
  const g=gcd(l,i)||1;
  return `${Math.round(l/g)}:${Math.round(i/g)}`;
};
const MixNote=({recipe,compact=false}:{recipe:Recipe;compact?:boolean})=>{
 const ice=iceTotal(recipe), liquid=brewLiquid(recipe), total=finalWater(recipe), ratio=finalRatio(recipe);
 return <div className={`mixNote ${compact?'compact':''}`}>
   <span><b>{liquid}g</b><small>LIQUID</small></span>
   <span><b>{ice}g</b><small>ICE</small></span>
   <span><b>{liquidIceRatio(recipe)}</b><small>LIQUID:ICE</small></span>
   <span><b>1:{ratio.toFixed(1)}</b><small>FINAL RATIO</small></span>
   {!compact&&<span><b>{total}g</b><small>TOTAL</small></span>}
 </div>
};

export default function Home(){
 const [data,setData]=useState<BrewData>({recipes:[],beans:[],brews:[]}); const [ready,setReady]=useState(false); const [tab,setTab]=useState('dashboard'); const [query,setQuery]=useState(''); const [editing,setEditing]=useState<Recipe|null>(null); const [selected,setSelected]=useState<Recipe|null>(null); const [scaleDose,setScaleDose]=useState(10); const [brewMode,setBrewMode]=useState<Recipe|null>(null); const [brewStart,setBrewStart]=useState<number|null>(null); const [seconds,setSeconds]=useState(0);
 useEffect(()=>{setData(loadData());setReady(true)},[]); useEffect(()=>{if(ready)saveData(data)},[data,ready]); useEffect(()=>{if(!brewStart)return;const i=setInterval(()=>setSeconds(Math.floor((Date.now()-brewStart)/1000)),250);return()=>clearInterval(i)},[brewStart]);
 const update=(d:BrewData)=>setData(d); const favorite=(r:Recipe)=>update({...data,recipes:data.recipes.map(x=>x.id===r.id?{...x,favorite:!x.favorite,status:!x.favorite?'Favorite':x.status==='Favorite'?'Tested':x.status}:x)});
 const filtered=useMemo(()=>data.recipes.filter(r=>(r.name+' '+r.method+' '+r.beanName).toLowerCase().includes(query.toLowerCase())),[data.recipes,query]);
 const scaled=(r:Recipe,dose:number)=>{const factor=dose/r.coffee;return {...r,coffee:dose,water:Math.round(r.water*factor),pours:r.pours.map(p=>({...p,amount:Math.round(p.amount*factor)}))}};
 const saveRecipe=(r:Recipe)=>{const exists=data.recipes.some(x=>x.id===r.id);update({...data,recipes:exists?data.recipes.map(x=>x.id===r.id?r:x):[r,...data.recipes]});setEditing(null);setSelected(r);};
 const deleteRecipe=(id:string)=>{update({...data,recipes:data.recipes.filter(r=>r.id!==id)});setSelected(null)};
 if(!ready)return <main className="shell"><div className="hero"><h1>BREW-NOTE.</h1><p>Loading your coffee lab…</p></div></main>;
 return <main className="shell">
  <div className="brutalDecor" aria-hidden="true"><i className="geo geoSquare"></i><i className="geo geoCircle"></i><i className="geo geoTriangle"></i><i className="geo geoDots"></i><i className="geo geoCross"></i></div>
  <header className="topbar"><div className="brand" onClick={()=>setTab('dashboard')}><Coffee className="brandIcon" size={38}/><div><b>BREW-NOTE v1.1</b><small>RUN. TASTE. TWEAK. REPEAT.</small></div></div><nav>{[['dashboard','LAB'],['recipes','RECIPES'],['beans','BEANS'],['journal','JOURNAL']].map(([id,l])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}>{l}</button>)}</nav><LofiPlayer/></header>
  {tab==='dashboard'&&<section><div className="hero heroWithRunner"><div className="heroCopy"><p className="kicker">PERSONAL COFFEE LAB</p><h1>GOOD COFFEE IS<br/>DEBUGGING WITH BEANS.</h1><p>Run the brew. Taste the output. Tweak the variables. Repeat.</p><button className="primary" onClick={()=>{setEditing(emptyRecipe());setTab('recipes')}}><Plus/> ADD RECIPE</button></div><div className="runnerArt"><span className="speechSticker">GOOD IDEAS<br/>START WITH<br/>COFFEE.</span><img src="/running-cup.svg" alt="Running white coffee cup mascot"/></div><div className="heroMenuCards"><button className="heroMenu recipesMenu" onClick={()=>setTab('recipes')}><BookOpen size={38}/><span><b>RECIPES</b><small>Organize your brewing recipes.</small></span><ChevronRight/></button><button className="heroMenu beansMenu" onClick={()=>setTab('beans')}><BeanIcon size={38}/><span><b>BEANS</b><small>Track your beans and stock.</small></span><ChevronRight/></button><button className="heroMenu journalMenu" onClick={()=>setTab('journal')}><FlaskConical size={38}/><span><b>JOURNAL</b><small>Log brews and tasting notes.</small></span><ChevronRight/></button></div></div>
   <div className="stats"><Stat n={data.recipes.length} label="RECIPES" icon={<BookOpen/>}/><Stat n={data.brews.length} label="BREWS" icon={<FlaskConical/>}/><Stat n={data.beans.length} label="BEANS" icon={<BeanIcon/>}/><Stat n={data.recipes.filter(r=>r.favorite).length} label="FAVORITES" icon={<Heart/>}/></div>
   <div className="grid2"><div className="panel"><div className="panelHead"><h2>BREW AGAIN</h2><span>latest log</span></div>{data.brews[0]?<><h3>{data.brews[0].recipeName}</h3><p>{data.brews[0].beanName}</p><div className="miniSpecs"><b>{data.brews[0].coffee}g</b><b>{data.brews[0].water}g</b><b>{data.brews[0].temp}°C</b><b>★ {data.brews[0].rating}</b></div><button className="primary" onClick={()=>{const r=data.recipes.find(x=>x.id===data.brews[0].recipeId);if(r)setBrewMode(r)}}><Play/> BREW AGAIN</button></>:<p>No brew logs yet.</p>}</div>
   <div className="panel yellow"><div className="panelHead"><h2>BEAN INVENTORY</h2><span>what's left</span></div>{data.beans.slice(0,3).map(b=><div className="beanRow" key={b.id}><div><b>{b.name}</b><small>{b.origin} · {b.process}</small></div><strong>{b.stock}g</strong></div>)}</div></div>
   </section>}
  {tab==='recipes'&&<section><div className="sectionTitle"><div><p className="kicker">RECIPE LIBRARY</p><h1>MY RECIPES.</h1></div><button className="primary" onClick={()=>setEditing(emptyRecipe())}><Plus/> ADD RECIPE</button></div><div className="search"><Search/><input placeholder="Search recipe, brewer, bean…" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="cards">{filtered.map(r=><article className="recipeCard" key={r.id}><div className="cardTop"><span className="tag">{r.method}</span><button className="iconBtn" onClick={()=>favorite(r)}>{r.favorite?'♥':'♡'}</button></div><h2>{r.name}</h2><p>{r.beanName||'No bean assigned'}</p><div className="specGrid"><span><b>{r.coffee}g</b> coffee</span><span><b>{r.water}g</b> liquid</span><span><b>1:{r.ratio}</b> base ratio</span><span><b>{r.temp}°</b> temp</span></div><div className="cardActions"><button onClick={()=>{setSelected(null);setBrewMode(null);setEditing(r)}}><Pencil size={17}/> EDIT</button><button onClick={()=>{setEditing(null);setBrewMode(null);setSelected(r);setScaleDose(r.coffee)}}>OPEN <ChevronRight size={17}/></button><button onClick={()=>{setEditing(null);setSelected(null);setBrewMode(r)}}><Play size={17}/> BREW</button></div></article>)}</div></section>}
  {tab==='beans'&&<Beans data={data} update={update}/>} {tab==='journal'&&<Journal data={data} update={update}/>} 
  {editing&&<RecipeEditor recipe={editing} beans={data.beans} onClose={()=>setEditing(null)} onSave={saveRecipe}/>} {selected&&<RecipeDetail recipe={selected} scaled={scaled(selected,scaleDose)} dose={scaleDose} setDose={setScaleDose} onClose={()=>setSelected(null)} onEdit={()=>{const r=selected;setSelected(null);setEditing(r)}} onDelete={()=>deleteRecipe(selected.id)} onBrew={()=>{const r=scaled(selected,scaleDose);setSelected(null);setBrewMode(r)}} onSaveVariant={()=>{const v={...scaled(selected,scaleDose),id:uid(),name:selected.name+' · '+scaleDose+'g version',parentId:selected.id,createdAt:new Date().toISOString().slice(0,10)};saveRecipe(v)}}/>}
  {brewMode&&<BrewMode recipe={brewMode} seconds={seconds} started={!!brewStart} start={()=>{setSeconds(0);setBrewStart(Date.now())}} stop={()=>{setBrewStart(null);setSeconds(0)}} close={()=>{setBrewMode(null);setBrewStart(null);setSeconds(0)}} save={(b)=>{update({...data,brews:[b,...data.brews],beans:data.beans.map(x=>x.name===b.beanName?{...x,stock:Math.max(0,x.stock-b.coffee)}:x)});setBrewMode(null);setBrewStart(null);setSeconds(0);setTab('journal')}}/>}
  <nav className="mobileDock" aria-label="Mobile navigation">{[['dashboard','LAB',<Coffee key="i1" size={20}/>],['recipes','RECIPES',<BookOpen key="i2" size={20}/>],['beans','BEANS',<BeanIcon key="i3" size={20}/>],['journal','JOURNAL',<FlaskConical key="i4" size={20}/>]].map(([id,label,icon]:any)=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}>{icon}<span>{label}</span></button>)}</nav>
  <footer className="boxedFooter"><span>RUN. TASTE. TWEAK. REPEAT.</span><span className="creator">Created with <Coffee size={15}/> by gpsteam</span><span>BREW-NOTE v1.1</span></footer>
 </main>
}

function LofiPlayer(){
 const ctxRef=useRef<AudioContext|null>(null);
 const gainRef=useRef<GainNode|null>(null);
 const timerRef=useRef<ReturnType<typeof setInterval>|null>(null);
 const stepRef=useRef(0);
 const [playing,setPlaying]=useState(false);
 const [needsTap,setNeedsTap]=useState(false);

 const clearScheduler=()=>{if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null}};
 const note=(ctx:AudioContext,freq:number,dur=.24,vol=.055,type:OscillatorType='square')=>{
   const o=ctx.createOscillator(); const g=ctx.createGain();
   o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0.0001,ctx.currentTime);
   g.gain.exponentialRampToValueAtTime(vol,ctx.currentTime+.015);
   g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+dur);
   o.connect(g);g.connect(gainRef.current!);o.start();o.stop(ctx.currentTime+dur+.03);
 };
 const tick=()=>{
   const ctx=ctxRef.current;if(!ctx||ctx.state!=='running')return;
   const melody=[293.66,349.23,0,311.13,293.66,0,233.08,261.63,293.66,0,349.23,392,349.23,311.13,261.63,0];
   const bass=[73.42,77.78,65.41,69.30];
   const s=stepRef.current%16;
   if(melody[s])note(ctx,melody[s],.16,.034,s%4===0?'sawtooth':'square');
   if(s%4===0)note(ctx,bass[Math.floor(s/4)],.34,.05,'triangle');
   if(s%2===0)note(ctx,1046.5,.035,.006,'square');
   stepRef.current=(s+1)%16;
 };
 const startMusic=async()=>{
   try{
     if(!ctxRef.current){
       const Ctx=window.AudioContext||(window as any).webkitAudioContext;
       const ctx:AudioContext=new Ctx();ctxRef.current=ctx;
       const master=ctx.createGain();master.gain.value=.55;master.connect(ctx.destination);gainRef.current=master;
     }
     const ctx=ctxRef.current!;
     await ctx.resume();
     if(ctx.state!=='running'){setNeedsTap(true);return}
     setNeedsTap(false);setPlaying(true);clearScheduler();tick();timerRef.current=setInterval(tick,360);
   }catch{setNeedsTap(true);setPlaying(false)}
 };
 const pauseMusic=async()=>{clearScheduler();if(ctxRef.current)await ctxRef.current.suspend();setPlaying(false)};
 const toggle=()=>playing?pauseMusic():startMusic();

 useEffect(()=>{
   const t=setTimeout(()=>startMusic(),500);
   const unlock=()=>startMusic();
   window.addEventListener('pointerdown',unlock,{once:true});
   return()=>{clearTimeout(t);clearScheduler();window.removeEventListener('pointerdown',unlock);ctxRef.current?.close()};
 },[]);
 return <div className={`lofiPlayer ${playing?'playing':''}`}>
   <Music size={18}/>
   <div className="lofiCopy"><b>ARCADE FIGHT LOFI</b><small>{needsTap?'Tap to start audio':'original 90s arcade battle loop'}</small></div>
   <button onClick={toggle} aria-label={playing?'Pause lofi music':'Play lofi music'}>{playing?<Pause size={18}/>:<Play size={18}/>}</button>
 </div>
}

function Stat({n,label,icon}:{n:number;label:string;icon:React.ReactNode}){return <div className="stat">{icon}<strong>{n}</strong><span>{label}</span></div>}
function RecipeEditor({recipe,beans,onClose,onSave}:{recipe:Recipe;beans:Bean[];onClose:()=>void;onSave:(r:Recipe)=>void}){
 const normalize=(base:Recipe):Recipe=>({...base,pours:base.pours.map(p=>({...p,stepType:p.stepType||'water'}))});
 const [r,setR]=useState(normalize(recipe));
 const set=(k:keyof Recipe,v:any)=>setR({...r,[k]:v});
 const grinderValue=grinders.includes(r.grinder)?r.grinder:'Other Grinders';
 const addPour=()=>setR({...r,pours:[...r.pours,{id:uid(),label:'Pour 1',start:'01:00',amount:r.water,mode:'cumulative',technique:'Circular',stepType:'water'}]});
 const addSwitchStep=()=>setR({...r,pours:[...r.pours,{id:uid(),label:'Switch',start:'01:30',amount:0,mode:'add',technique:'',stepType:'switch',switchAction:'close'}]});
 const addIce=()=>setR({...r,pours:[...r.pours,{id:uid(),label:'Ice',start:'02:45',amount:60,mode:'add',technique:'Add ice',stepType:'ice',icePlacement:'end'}]});
 const chooseBean=(value:string)=>{const b=beans.find(x=>x.name===value);if(!b){setR({...r,beanName:'',beanId:undefined});return}setR({...r,beanName:b.name,beanId:b.id,origin:b.origin,process:b.process,roast:b.roast})};
 const moveStep=(id:string,dir:-1|1)=>{const arr=[...r.pours];const i=arr.findIndex(x=>x.id===id);const j=i+dir;if(i<0||j<0||j>=arr.length)return;[arr[i],arr[j]]=[arr[j],arr[i]];setR({...r,pours:arr})};
 return <div className="modal"><div className="modalBox wide">
  <div className="modalHead"><div><p className="kicker">RECIPE BUILDER</p><h2>{recipe.name||'NEW RECIPE'}</h2></div><button className="iconBtn" onClick={onClose}><X/></button></div>
  <div className="formGrid">
   <Field label="Recipe name"><input value={r.name} onChange={e=>set('name',e.target.value)}/></Field>
   <Field label="Method"><select value={r.method} onChange={e=>set('method',e.target.value)}>{!methods.includes(r.method)&&r.method&&<option>{r.method}</option>}{methods.map(m=><option key={m}>{m}</option>)}</select></Field>
   <Field label="Bean"><select value={r.beanName} onChange={e=>chooseBean(e.target.value)}><option value="">Custom / none</option>{beans.map(b=><option key={b.id}>{b.name}{b.roastery?` · ${b.roastery}`:''}</option>)}</select></Field>
   <Field label="Origin"><input value={r.origin} onChange={e=>set('origin',e.target.value)} placeholder="Auto-filled when bean is selected"/></Field>
   <Field label="Process"><input value={r.process} onChange={e=>set('process',e.target.value)} placeholder="Auto-filled when bean is selected"/></Field>
   <Field label="Roast"><select value={r.roast} onChange={e=>set('roast',e.target.value)}>{!roastLevels.includes(r.roast)&&r.roast&&<option>{r.roast}</option>}{roastLevels.map(x=><option key={x}>{x}</option>)}</select></Field>
   <Field label="Coffee (g)"><input type="number" value={r.coffee} onChange={e=>{const c=+e.target.value;setR({...r,coffee:c,water:Math.round(c*r.ratio)})}}/></Field>
   <Field label="Base ratio 1:x"><input type="number" step="0.01" value={r.ratio} onChange={e=>{const ratio=+e.target.value;setR({...r,ratio,water:Math.round(r.coffee*ratio)})}}/></Field>
   <Field label="Liquid / brew water (g)"><input type="number" value={r.water} onChange={e=>set('water',+e.target.value)}/></Field>
   <Field label="Temperature °C"><input type="number" value={r.temp} onChange={e=>set('temp',+e.target.value)}/></Field>
   <Field label="Grinder"><select value={grinderValue} onChange={e=>{if(e.target.value==='Other Grinders')setR({...r,grinder:''});else setR({...r,grinder:e.target.value})}}>{grinders.map(x=><option key={x}>{x}</option>)}</select></Field>
   {grinderValue==='Other Grinders'&&<Field label="Other grinder name"><input value={r.grinder} onChange={e=>set('grinder',e.target.value)} placeholder="Type grinder name"/></Field>}
   <Field label="Grind setting"><input value={r.grindSetting} onChange={e=>set('grindSetting',e.target.value)} placeholder="13 clicks"/></Field>
   <Field label="Grind size"><input value={r.grindSize} onChange={e=>set('grindSize',e.target.value)}/></Field>
   <Field label="Filter / Dripper"><select value={r.filter} onChange={e=>set('filter',e.target.value)}>{!filters.includes(r.filter)&&r.filter&&<option>{r.filter}</option>}{filters.map(x=><option key={x}>{x}</option>)}</select></Field>
   <Field label="Target brew time"><input value={r.brewTime} onChange={e=>set('brewTime',e.target.value)} placeholder="02:45"/></Field>
   <Field label="Agitation"><input value={r.agitation} onChange={e=>set('agitation',e.target.value)}/></Field>
  </div>

  <div className="pourSectionHead"><div><p className="kicker">BREW SEQUENCE</p><h3 className="subhead">POUR STEP</h3></div><div className="pourHeadActions">
   <button className="secondary" onClick={addPour}><Plus/> ADD POUR</button>
   <button className="secondary iceAdd" onClick={addIce}><Plus/> ADD ICE</button>
   {r.filter==='Hario Switch Dripper'&&<button className="secondary" onClick={addSwitchStep}><Plus/> ADD SWITCH ACTION</button>}
  </div></div>

  <MixNote recipe={r}/>

  {r.pours.map((p,i)=><div className={`pourEditor ${p.stepType==='ice'?'iceStep':p.stepType==='switch'?'switchStep':''}`} key={p.id}>
    <select value={p.stepType||'water'} onChange={e=>setR({...r,pours:r.pours.map(x=>x.id===p.id?{...x,stepType:e.target.value as any,label:e.target.value==='ice'?'Ice':e.target.value==='switch'?'Switch':x.label}:x)})}>
      <option value="water">Water pour</option><option value="ice">Ice</option>{r.filter==='Hario Switch Dripper'&&<option value="switch">Switch action</option>}
    </select>
    {p.stepType==='switch'?<>
      <select value={p.switchAction||'close'} onChange={e=>setR({...r,pours:r.pours.map(x=>x.id===p.id?{...x,switchAction:e.target.value as 'open'|'close'}:x)})}><option value="close">CLOSE switch · Immersion</option><option value="open">OPEN switch · Percolation</option></select>
      <input value={p.start} onChange={e=>setR({...r,pours:r.pours.map(x=>x.id===p.id?{...x,start:e.target.value}:x)})}/>
      <div className="switchHint">{(p.switchAction||'close')==='close'?'IMMERSION — water is held in the dripper':'PERCOLATION — coffee drains through'}</div>
    </>:p.stepType==='ice'?<>
      <input value={p.start} onChange={e=>setR({...r,pours:r.pours.map(x=>x.id===p.id?{...x,start:e.target.value}:x)})} placeholder="02:45"/>
      <input type="number" value={p.amount} onChange={e=>setR({...r,pours:r.pours.map(x=>x.id===p.id?{...x,amount:+e.target.value}:x)})}/>
      <input value={p.technique||'Add ice'} onChange={e=>setR({...r,pours:r.pours.map(x=>x.id===p.id?{...x,technique:e.target.value}:x)})} placeholder="Add ice / flash chill / server"/>
    </>:<>
      <select value={pourLabels.includes(p.label)?p.label:'Pour 1'} onChange={e=>setR({...r,pours:r.pours.map(x=>x.id===p.id?{...x,label:e.target.value}:x)})}>{pourLabels.map(x=><option key={x}>{x}</option>)}</select>
      <input value={p.start} onChange={e=>setR({...r,pours:r.pours.map(x=>x.id===p.id?{...x,start:e.target.value}:x)})}/>
      <input type="number" value={p.amount} onChange={e=>setR({...r,pours:r.pours.map(x=>x.id===p.id?{...x,amount:+e.target.value}:x)})}/>
      <select value={p.mode} onChange={e=>setR({...r,pours:r.pours.map(x=>x.id===p.id?{...x,mode:e.target.value as 'add'|'cumulative'}:x)})}><option value="cumulative">Pour until</option><option value="add">Add water</option></select>
      <select value={techniques.includes(p.technique)?p.technique:'Circular'} onChange={e=>setR({...r,pours:r.pours.map(x=>x.id===p.id?{...x,technique:e.target.value}:x)})}>{techniques.map(x=><option key={x}>{x}</option>)}</select>
    </>}
    <div className="stepOrder">
      <button className="iconBtn tiny" disabled={i===0} onClick={()=>moveStep(p.id,-1)} title="Move step up">↑</button>
      <button className="iconBtn tiny" disabled={i===r.pours.length-1} onClick={()=>moveStep(p.id,1)} title="Move step down">↓</button>
      <button className="iconBtn" onClick={()=>setR({...r,pours:r.pours.filter(x=>x.id!==p.id)})}><Trash2 size={18}/></button>
    </div>
  </div>)}

  <Field label="Recipe notes"><textarea value={r.notes} onChange={e=>set('notes',e.target.value)} rows={4}/></Field>
  <div className="modalActions"><button className="secondary" onClick={onClose}>CANCEL</button><button className="primary" onClick={()=>onSave(r)} disabled={!r.name}><Save/> SAVE RECIPE</button></div>
 </div></div>
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="field"><span>{label}</span>{children}</label>}
function RecipeDetail({recipe,scaled,dose,setDose,onClose,onEdit,onDelete,onBrew,onSaveVariant}:{recipe:Recipe;scaled:Recipe;dose:number;setDose:(n:number)=>void;onClose:()=>void;onEdit:()=>void;onDelete:()=>void;onBrew:()=>void;onSaveVariant:()=>void}){
 return <div className="modal"><div className="modalBox">
  <div className="modalHead"><div><span className="tag">{recipe.method}</span><h2>{recipe.name}</h2><p>{recipe.beanName}</p></div><button className="iconBtn" onClick={onClose}><X/></button></div>
  <div className="scaleBox"><div><p className="kicker">RECIPE SCALER</p><h3><Scale/> CHANGE DOSE</h3></div><input type="number" value={dose} min="1" step="0.5" onChange={e=>setDose(+e.target.value)}/><b>g coffee → {finalWater(scaled)}g total liquid + ice</b></div>
  <div className="specGrid big"><span><b>{scaled.coffee}g</b> coffee</span><span><b>{scaled.water}g</b> liquid</span><span><b>1:{recipe.ratio}</b> base ratio</span><span><b>{recipe.temp}°C</b> temp</span><span><b>{recipe.grindSetting||'—'}</b> grind</span><span><b>{recipe.brewTime}</b> target</span></div>
  <MixNote recipe={scaled}/>
  <h3 className="subhead">POUR STEP</h3>
  <div className="timeline">{scaled.pours.map((p,i)=><div className={`timelineRow ${p.stepType==='ice'?'iceTimeline':p.stepType==='switch'?'switchTimeline':''}`} key={p.id}><strong>{p.start}</strong><span>{i+1}</span><div><b>{p.stepType==='switch'?(p.switchAction==='open'?'OPEN SWITCH':'CLOSE SWITCH'):p.label}</b><p>{p.stepType==='ice'?`${p.amount}g ice · ${p.technique||'Add ice'}`:p.stepType==='switch'?(p.switchAction==='open'?'Percolation · coffee drains':'Immersion · hold water'):`${p.mode==='cumulative'?'Pour until':'Add'} ${p.amount}g · ${p.technique}`}</p></div></div>)}</div>
  <p className="note">{recipe.notes}</p>
  <div className="modalActions wrap"><button className="primary" onClick={onBrew}><Play/> START BREW</button>{dose!==recipe.coffee&&<button className="secondary" onClick={onSaveVariant}><Save/> SAVE {dose}g VERSION</button>}<button className="secondary" onClick={onEdit}>EDIT</button><button className="danger" onClick={onDelete}><Trash2/></button></div>
 </div></div>
}
function BrewMode({recipe,seconds,started,start,stop,close,save}:{recipe:Recipe;seconds:number;started:boolean;start:()=>void;stop:()=>void;close:()=>void;save:(b:Brew)=>void}){
 const [finish,setFinish]=useState(false);const [rating,setRating]=useState(5);const [notes,setNotes]=useState('');
 const fmt=(s:number)=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
 const toSec=(value:string)=>{const [m,sec]=value.split(':').map(Number);return (m||0)*60+(sec||0)};
 const timed=recipe.pours.map(p=>({...p,stepType:p.stepType||'water',at:toSec(p.start)})).sort((a,b)=>a.at-b.at);
 let currentIndex=0;timed.forEach((p,i)=>{if(seconds>=p.at)currentIndex=i});
 const current=timed[currentIndex]||recipe.pours[0];
 const upcoming=timed.slice(currentIndex+1);
 const nextAt=timed[currentIndex+1]?.at??Math.max(toSec(recipe.brewTime),(current?.at??0)+30);
 const stepStart=current?.at||0;const stepDuration=Math.max(1,nextAt-stepStart);const stepElapsed=Math.max(0,seconds-stepStart);
 const stepProgress=Math.max(0,Math.min(100,(stepElapsed/stepDuration)*100));
 const totalTarget=Math.max(1,toSec(recipe.brewTime)||nextAt);const totalProgress=Math.max(0,Math.min(100,(seconds/totalTarget)*100));
 const totalIce=iceTotal(recipe); const brewWater=brewLiquid(recipe);
 const instruction=(p:any)=>{
   if(!p)return {title:'READY',main:'Press start',sub:''};
   if(p.stepType==='ice')return {title:'ADD ICE',main:`${p.amount}g ICE`,sub:p.technique||'Add ice'};
   if(p.stepType==='switch')return {title:p.switchAction==='open'?'OPEN SWITCH':'CLOSE SWITCH',main:p.switchAction==='open'?'PERCOLATION':'IMMERSION',sub:p.switchAction==='open'?'Let coffee drain through':'Hold water in the dripper'};
   return {title:p.label,main:(p.mode==='cumulative'?'POUR UNTIL ':'ADD ')+p.amount+'g',sub:p.technique};
 };
 const ins=instruction(current);
 return <div className="brewOverlay">{!finish?<>
  <button className="brewClose" onClick={close}><X/></button>
  <div className="brewStage"><div className="brewMain"><p className="kicker">BREW MODE · {recipe.method}</p><h1>{recipe.name}</h1><div className="brewNumbers"><span>{recipe.coffee}g<small>COFFEE</small></span><span>{recipe.water}g<small>{recipe.iced?'TOTAL WATER':'WATER'}</small></span><span>{recipe.temp}°<small>TEMP</small></span></div><div className="timer">{fmt(seconds)}</div></div><div className="pinkCupArt"><span className="niceBrew">NICE<br/>BREW!</span><img src="/pink-brew-cup.svg" alt="Pink coffee cup mascot giving a thumbs up"/></div></div>
  {totalIce>0&&<div className="brewIceStrip"><span><b>{brewWater}g</b> liquid</span><strong>+</strong><span><b>{totalIce}g</b> ice</span><strong>=</strong><span><b>{finalWater(recipe)}g</b> total</span><strong>·</strong><span><b>1:{finalRatio(recipe).toFixed(1)}</b> final ratio</span></div>}
  <div className={`instruction progressInstruction ${current?.stepType==='ice'?'iceInstruction':current?.stepType==='switch'?'switchInstruction':''}`}>
   <div className="instructionTitle"><div><small>STEP {Math.min(currentIndex+1,timed.length)} / {timed.length}</small><h2>{ins.title}</h2><strong>{ins.main}</strong></div><span>{Math.max(0,Math.ceil(nextAt-seconds))}s left</span></div><p>{ins.sub}</p>
   <div className="stepProgress" aria-label={`Current step ${Math.round(stepProgress)} percent`}><div className="stepProgressFill" style={{width:`${stepProgress}%`}}></div><span className="progressMarker" style={{left:`${stepProgress}%`}}></span></div>
  </div>
  <div className="brewTimeline" aria-label="Brew progress" style={{gridTemplateColumns:`repeat(${Math.max(timed.length,1)}, minmax(90px,1fr))`}}>{timed.map((p,i)=>{const si=instruction(p);return <div className={`brewTimelineStep ${i<currentIndex?'done':i===currentIndex?'current':''}`} key={p.id}><span>{i<currentIndex?'✓':i+1}</span><b>{si.title}</b><small>{p.start}</small></div>})}<div className="timelineRail"><i style={{width:`${totalProgress}%`}}></i></div></div>
  <div className="upcomingSteps"><div className="upcomingHead"><b>NEXT STEPS</b><span>{upcoming.length} remaining</span></div>{upcoming.length?upcoming.map((p,i)=>{const ui=instruction(p);return <div className="upcomingRow" key={p.id}><span className="stepNo">{currentIndex+i+2}</span><strong>{p.start}</strong><div><b>{ui.title}</b><small>{ui.main} · {ui.sub}</small></div></div>}):<div className="allDone">LAST STEP — finish when your drawdown is complete.</div>}</div>
  {!started?<button className="brewStart" onClick={start}><Play/> START</button>:<div className="brewBtns"><button onClick={()=>{stop();setFinish(true)}}>FINISH BREW</button><button onClick={stop}>RESET</button></div>}
 </>:<div className="finish"><p className="kicker">BREW COMPLETE</p><h1>HOW WAS IT?</h1>{totalIce>0&&<div className="finishIce"><MixNote recipe={recipe}/></div>}<div className="stars">{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setRating(n)}>{n<=rating?'★':'☆'}</button>)}</div><textarea placeholder="Taste notes, what changed, what would you tweak next?" value={notes} onChange={e=>setNotes(e.target.value)}/><button className="primary" onClick={()=>save({id:uid(),recipeId:recipe.id,recipeName:recipe.name,beanName:recipe.beanName,date:new Date().toISOString().slice(0,10),coffee:recipe.coffee,water:recipe.water,temp:recipe.temp,actualTime:fmt(seconds),grindSetting:recipe.grindSetting,sweetness:5,acidity:5,bitterness:5,body:5,clarity:5,rating,notes,entryType:'brew'})}><Save/> SAVE BREW LOG</button></div>}</div>
}
function Beans({data,update}:{data:BrewData;update:(d:BrewData)=>void}){
 const [form,setForm]=useState<Bean|null>(null);const isEditing=!!form&&data.beans.some(b=>b.id===form.id);
 const normalize=(b:Bean):Bean=>({...b,roastery:b.roastery||'',species:b.species||'Arabica'});
 const saveBean=()=>{if(!form?.name)return;const normalized=normalize(form);const exists=data.beans.some(b=>b.id===form.id);update({...data,beans:exists?data.beans.map(b=>b.id===form.id?normalized:b):[normalized,...data.beans]});setForm(null)};
 return <section><div className="sectionTitle"><div><p className="kicker">INVENTORY</p><h1>MY BEANS.</h1></div><button className="primary" onClick={()=>setForm({id:uid(),name:'',origin:'',process:'Natural',roast:'Light',notes:'',roastedAt:new Date().toISOString().slice(0,10),stock:250,roastery:'',species:'Arabica'})}><Plus/> ADD BEAN</button></div>
 <div className="cards">{data.beans.map(b=><article className="recipeCard beanCard" key={b.id}><div className="cardTop"><span className="tag">{b.roast}</span><button className="editBadge" onClick={()=>setForm(normalize({...b}))}><Pencil size={16}/> EDIT</button></div><h2>{b.name}</h2><p>{b.roastery&&<>{b.roastery} · </>}{b.species||'Arabica'} · {b.origin}</p><p>{b.process}</p><h3>{b.stock}g <small>remaining</small></h3><p>{b.notes}</p><div className="beanActions"><button className="danger" onClick={()=>update({...data,beans:data.beans.filter(x=>x.id!==b.id)})}><Trash2 size={16}/> DELETE</button></div></article>)}</div>
 {form&&<div className="modal"><div className="modalBox"><div className="modalHead"><div><p className="kicker">BEAN LIBRARY</p><h2>{isEditing?'EDIT BEAN':'ADD BEAN'}</h2></div><button className="iconBtn" onClick={()=>setForm(null)}><X/></button></div>
 <Field label="NAME"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
 <Field label="ROASTERY"><input value={form.roastery||''} onChange={e=>setForm({...form,roastery:e.target.value})} placeholder="Roastery name"/></Field>
 <div className="formGrid">
  <Field label="BEAN TYPE"><select value={form.species||'Arabica'} onChange={e=>setForm({...form,species:e.target.value as Bean['species']})}>{speciesOptions.map(x=><option key={x}>{x}</option>)}</select></Field>
  <Field label="ORIGIN"><input value={form.origin} onChange={e=>setForm({...form,origin:e.target.value})}/></Field>
  <Field label="PROCESS"><select value={form.process} onChange={e=>setForm({...form,process:e.target.value})}>{!processes.includes(form.process)&&form.process&&<option>{form.process}</option>}{processes.map(x=><option key={x}>{x}</option>)}</select></Field>
  <Field label="ROAST LEVEL"><select value={form.roast} onChange={e=>setForm({...form,roast:e.target.value})}>{!roastLevels.includes(form.roast)&&form.roast&&<option>{form.roast}</option>}{roastLevels.map(x=><option key={x}>{x}</option>)}</select></Field>
 </div>
 <Field label="TASTING NOTES"><input value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></Field>
 <Field label="ROAST DATE"><input type="date" value={form.roastedAt} onChange={e=>setForm({...form,roastedAt:e.target.value})}/></Field>
 <Field label="STOCK (G)"><input type="number" value={form.stock} onChange={e=>setForm({...form,stock:+e.target.value})}/></Field>
 <div className="modalActions"><button className="secondary" onClick={()=>setForm(null)}>CANCEL</button><button className="primary" onClick={saveBean}><Save/> {isEditing?'UPDATE BEAN':'SAVE BEAN'}</button></div>
 </div></div>}
 </section>
}
function Journal({data,update}:{data:BrewData;update:(d:BrewData)=>void}){
 const [form,setForm]=useState<Brew|null>(null); const [selected,setSelected]=useState<Brew|null>(null);
 const newNote=()=>{const r=data.recipes[0];setForm({id:uid(),recipeId:r?.id||'',recipeName:r?.name||'',beanName:r?.beanName||'',date:new Date().toISOString().slice(0,10),coffee:r?.coffee||0,water:r?.water||0,temp:r?.temp||0,actualTime:'—',grindSetting:r?.grindSetting||'',sweetness:5,acidity:5,bitterness:5,body:5,clarity:5,rating:5,notes:'',entryType:'note'})};
 const chooseRecipe=(id:string)=>{const r=data.recipes.find(x=>x.id===id);if(!form||!r)return;setForm({...form,recipeId:r.id,recipeName:r.name,beanName:r.beanName,coffee:r.coffee,water:r.water,temp:r.temp,grindSetting:r.grindSetting})};
 const saveNote=()=>{if(!form?.recipeId||!form.notes.trim())return;update({...data,brews:[form,...data.brews]});setForm(null)};
 return <section><div className="sectionTitle"><div><p className="kicker">ACTUAL BREWS + NOTES</p><h1>BREW JOURNAL.</h1></div><button className="primary" onClick={newNote} disabled={!data.recipes.length}><Plus/> ADD NOTE</button></div>{!data.recipes.length&&<p className="note">Create a recipe first, then attach journal notes to it.</p>}<div className="journal">{data.brews.map(b=><button className="journalRow journalButton" key={b.id} onClick={()=>setSelected(b)}><div className="dateBox"><b>{b.date.slice(8)}</b><span>{b.date.slice(5,7)}/{b.date.slice(2,4)}</span></div><div className="journalCopy"><div className="journalMeta"><span className="tag">{b.entryType==='note'?'NOTE':'BREW'}</span><h3>{b.recipeName}</h3></div><p>{b.beanName||'No bean'} · {b.coffee}g/{b.water}g · {b.temp}°C {b.actualTime&&b.actualTime!=='—'?`· ${b.actualTime}`:''}</p><small>{b.notes||'No note yet.'}</small></div><strong className="rating">{'★'.repeat(b.rating)}{'☆'.repeat(5-b.rating)}</strong></button>)}</div>
 {form&&<div className="modal"><div className="modalBox"><div className="modalHead"><div><p className="kicker">JOURNAL NOTE</p><h2>ADD BREW NOTE</h2></div><button className="iconBtn" onClick={()=>setForm(null)}><X/></button></div><Field label="RECIPE"><select value={form.recipeId} onChange={e=>chooseRecipe(e.target.value)}><option value="">Choose recipe</option>{data.recipes.map(r=><option value={r.id} key={r.id}>{r.name} · {r.method}</option>)}</select></Field><div className="formGrid"><Field label="DATE"><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></Field><Field label="RATING"><select value={form.rating} onChange={e=>setForm({...form,rating:+e.target.value})}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} star{n>1?'s':''}</option>)}</select></Field></div><Field label="NOTE / COMMENT"><textarea rows={7} placeholder="What did you taste? What changed? What would you tweak next?" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></Field><div className="note recipeSnapshot"><b>{form.recipeName||'No recipe selected'}</b><span>{form.beanName||'No bean'} · {form.coffee}g/{form.water}g · {form.temp}°C</span></div><div className="modalActions"><button className="secondary" onClick={()=>setForm(null)}>CANCEL</button><button className="primary" onClick={saveNote} disabled={!form.recipeId||!form.notes.trim()}><Save/> SAVE NOTE</button></div></div></div>}
 {selected&&<div className="modal"><div className="modalBox"><div className="modalHead"><div><span className="tag">{selected.entryType==='note'?'JOURNAL NOTE':'BREW LOG'}</span><h2>{selected.recipeName}</h2><p>{selected.date}</p></div><button className="iconBtn" onClick={()=>setSelected(null)}><X/></button></div><div className="specGrid big"><span><b>{selected.coffee}g</b> coffee</span><span><b>{selected.water}g</b> water</span><span><b>{selected.temp}°C</b> temp</span><span><b>{selected.grindSetting||'—'}</b> grind</span><span><b>{selected.actualTime||'—'}</b> time</span><span><b>{'★'.repeat(selected.rating)}</b> rating</span></div><h3 className="subhead">NOTE</h3><p className="journalNoteFull">{selected.notes||'No note was saved for this brew.'}</p><div className="modalActions"><button className="secondary" onClick={()=>setSelected(null)}>CLOSE</button></div></div></div>}
 </section>
}