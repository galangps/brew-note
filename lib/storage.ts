import {BrewData} from './types'; import {demoData} from './demo';
const KEY='brew-note-v1';
export function loadData():BrewData{if(typeof window==='undefined')return demoData;try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw):demoData}catch{return demoData}}
export function saveData(data:BrewData){localStorage.setItem(KEY,JSON.stringify(data))}
export function resetData(){localStorage.removeItem(KEY)}
