export type Pour={
  id:string;
  label:string;
  start:string;
  amount:number;
  mode:'add'|'cumulative';
  technique:string;
  notes?:string;
  stepType?:'water'|'ice'|'switch';
  icePlacement?:'start'|'end';
  switchAction?:'open'|'close';
};

export type Recipe={
  id:string;
  name:string;
  method:string;
  beanId?:string;
  beanName:string;
  origin:string;
  process:string;
  roast:string;
  coffee:number;
  water:number;
  temp:number;
  ratio:number;
  grinder:string;
  grindSetting:string;
  grindSize:string;
  filter:string;
  brewTime:string;
  agitation:string;
  favorite:boolean;
  status:'Draft'|'Tested'|'Favorite';
  rating:number;
  notes:string;
  pours:Pour[];
  createdAt:string;
  parentId?:string;
  iced?:boolean;
  icePlacement?:'start'|'end'|'both';
  iceStart?:number;
  iceEnd?:number;
};

export type Bean={
  id:string;
  name:string;
  origin:string;
  process:string;
  roast:string;
  notes:string;
  roastedAt:string;
  stock:number;
  roastery?:string;
  species?:'Arabica'|'Robusta'|'Excelsa'|'';
};

export type Brew={
  id:string;
  recipeId:string;
  recipeName:string;
  beanName:string;
  date:string;
  coffee:number;
  water:number;
  temp:number;
  actualTime:string;
  grindSetting:string;
  sweetness:number;
  acidity:number;
  bitterness:number;
  body:number;
  clarity:number;
  rating:number;
  notes:string;
  entryType?:'brew'|'note'
};

export type BrewData={recipes:Recipe[];beans:Bean[];brews:Brew[]};
