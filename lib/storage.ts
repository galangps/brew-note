import {BrewData} from './types';
import {demoData} from './demo';
import {getSupabase} from './supabase';

const LOCAL_KEY='brew-note-v1';

function cloneDemo():BrewData{
  return JSON.parse(JSON.stringify(demoData));
}

export function loadLocalData():BrewData|null{
  if(typeof window==='undefined') return null;
  try{
    const raw=localStorage.getItem(LOCAL_KEY);
    return raw?JSON.parse(raw):null;
  }catch{
    return null;
  }
}

export function saveLocalData(data:BrewData){
  if(typeof window==='undefined') return;
  try{
    localStorage.setItem(LOCAL_KEY,JSON.stringify(data));
  }catch{}
}

export async function loadData(userId:string):Promise<{
  data:BrewData;
  source:'cloud'|'local'|'demo';
  migrated:boolean;
}>{
  const supabase=getSupabase();
  if(!supabase) throw new Error('Supabase is not configured.');

  const {data:row,error}=await supabase
    .from('brew_note_state')
    .select('data')
    .eq('user_id',userId)
    .maybeSingle();

  if(error) throw error;

  if(row?.data){
    const cloud=row.data as BrewData;
    saveLocalData(cloud);
    return {data:cloud,source:'cloud',migrated:false};
  }

  // First cloud login: preserve the browser's current Brew-Note data if it exists.
  const local=loadLocalData();
  const initial=local??cloneDemo();

  const {error:insertError}=await supabase
    .from('brew_note_state')
    .insert({
      user_id:userId,
      data:initial,
      updated_at:new Date().toISOString()
    });

  if(insertError) throw insertError;

  saveLocalData(initial);
  return {
    data:initial,
    source:local?'local':'demo',
    migrated:Boolean(local)
  };
}

export async function saveData(userId:string,data:BrewData){
  saveLocalData(data); // offline/browser backup

  const supabase=getSupabase();
  if(!supabase) throw new Error('Supabase is not configured.');

  const {error}=await supabase
    .from('brew_note_state')
    .upsert({
      user_id:userId,
      data,
      updated_at:new Date().toISOString()
    },{
      onConflict:'user_id'
    });

  if(error) throw error;
}
