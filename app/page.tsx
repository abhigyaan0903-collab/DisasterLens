"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle, ArrowRight, BarChart3, Bell, CheckCircle2, ChevronRight,
  CircleHelp, Clock3, Crosshair, Droplets, Flame, Info, Layers3, MapPin,
  Menu, Navigation, Package, Radio, RefreshCw, ShieldCheck, Siren, Truck,
  Upload, Users, Waves, X, Zap
} from "lucide-react";

type Incident = {
  id:string; type:string; location:string; priority:number; affected:number;
  status:string; confidence:number; danger:boolean; reason:string; x:number; y:number; time:string;
};

const demoIncidents:Incident[] = [
  {id:"DL-1042",type:"Flood",location:"Riverside Area",priority:96,affected:240,status:"Awaiting response",confidence:94,danger:true,reason:"Large affected population, immediate danger, and limited road access.",x:27,y:35,time:"10:42 PM"},
  {id:"DL-1047",type:"Building damage",location:"Central District",priority:89,affected:65,status:"Team assigned",confidence:88,danger:true,reason:"Structural damage combined with reported people trapped nearby.",x:55,y:28,time:"10:51 PM"},
  {id:"DL-1039",type:"Road blockage",location:"Highway Zone",priority:72,affected:30,status:"Needs verification",confidence:76,danger:false,reason:"Blocked access may delay emergency movement to nearby incidents.",x:72,y:62,time:"10:35 PM"},
  {id:"DL-1044",type:"Fire",location:"Market Quarter",priority:78,affected:48,status:"Response en route",confidence:91,danger:true,reason:"Active fire report with high confidence and dense occupancy.",x:43,y:66,time:"10:46 PM"},
  {id:"DL-1049",type:"Landslide",location:"North Ridge",priority:67,affected:18,status:"Needs verification",confidence:71,danger:false,reason:"Access is constrained and the report needs corroboration.",x:79,y:31,time:"11:02 PM"}
];

const baseResources = [
  ["Rescue teams",8,"2 assigned"],["Ambulances",5,"1 assigned"],["Food supplies",420,"120 allocated"],
  ["Water",780,"240 allocated"],["Medical kits",64,"18 allocated"],["Rescue boats",3,"1 assigned"]
];

function scoreReport(r:{affected:number,danger:boolean,type:string,description:string}) {
  const infrastructure = /bridge|road|building|blocked|damage|collapse/i.test(r.description) ? 18 : 7;
  const access = /blocked|isolated|cut off|water/i.test(r.description) ? 15 : 7;
  const typeBoost:{[k:string]:number} = {Flood:10,Fire:12,Earthquake:15,Cyclone:13,Landslide:14,"Building damage":14,"Road blockage":6,Other:4};
  const score = Math.min(100, Math.round(
    25 + Math.min(28, r.affected / 10) + (r.danger ? 20 : 0) + infrastructure + access + (typeBoost[r.type] ?? 4)
  ));
  return score;
}

function priorityLabel(p:number){return p>=90?"CRITICAL":p>=75?"HIGH":p>=50?"MEDIUM":"LOW"}
function priorityClass(p:number){return p>=90?"text-red-300 bg-red-500/10 border-red-400/20":p>=75?"text-orange-300 bg-orange-500/10 border-orange-400/20":p>=50?"text-yellow-200 bg-yellow-500/10 border-yellow-400/20":"text-emerald-300 bg-emerald-500/10 border-emerald-400/20"}

export default function Home(){
  const [incidents,setIncidents]=useState<Incident[]>([]);
  const [selected,setSelected]=useState<Incident|null>(null);
  const [demo,setDemo]=useState(false);
  const [page,setPage]=useState<"home"|"dashboard"|"report"|"how">("home");
  const [toast,setToast]=useState("");
  const [mobile,setMobile]=useState(false);
  const [form,setForm]=useState({type:"Flood",location:"",description:"",affected:"20",danger:"Yes"});
  const [analyzing,setAnalyzing]=useState(false);
  const [resources,setResources]=useState(baseResources.map(x=>[...x] as [string,number,string]));
  const data = demo ? demoIncidents : incidents;
  const sorted=useMemo(()=>[...data].sort((a,b)=>b.priority-a.priority),[data]);
  const affected=data.reduce((a,b)=>a+b.affected,0);
  const critical=data.filter(x=>x.priority>=90).length;

  function launchDemo(){
    setDemo(true); setPage("dashboard"); setSelected(null); setToast("Demo mode launched — live incident feed populated.");
    setTimeout(()=>setToast(""),3500);
  }
  function submitReport(){
    setAnalyzing(true);
    setTimeout(()=>{
      const affected=Number(form.affected)||0;
      const score=scoreReport({affected,danger:form.danger==="Yes",type:form.type,description:form.description});
      const id=`DL-${1050+incidents.length}`;
      const inc:Incident={id,type:form.type,location:form.location||"Unspecified location",priority:score,affected,
        status:"Awaiting response",confidence:89,danger:form.danger==="Yes",
        reason: score>=90 ? "High population impact and immediate danger require rapid response." : "Priority reflects reported impact, danger level, access constraints, and report confidence.",
        x:30+Math.random()*55,y:25+Math.random()*50,time:"Just now"};
      setIncidents(v=>[inc,...v]); setSelected(inc); setAnalyzing(false); setPage("dashboard");
      setToast(`Report ${id} analyzed — priority ${score}/100`);
      setTimeout(()=>setToast(""),4000);
    },1500);
  }

  const nav=(p:"home"|"dashboard"|"report"|"how")=>{setPage(p);setMobile(false);};

  return <main className="min-h-screen grid-bg">
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071013]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <button onClick={()=>nav("home")} className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-teal-400/10 border border-teal-300/20 flex items-center justify-center"><Crosshair className="text-teal-300" size={20}/></div>
          <div className="font-bold tracking-tight">Disaster<span className="text-teal-300">Lens</span><div className="text-[9px] uppercase tracking-[.25em] text-slate-500">Emergency intelligence</div></div>
        </button>
        <nav className="hidden md:flex items-center gap-1 text-sm text-slate-300">
          {([["dashboard","Live Dashboard"],["report","Report Emergency"],["how","How it works"]] as const).map(([p,l])=><button key={p} onClick={()=>nav(p)} className={`px-4 py-2 rounded-lg hover:bg-white/5 ${page===p?"bg-white/5 text-white":""}`}>{l}</button>)}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={launchDemo} className="hidden sm:flex items-center gap-2 rounded-lg bg-teal-400 text-slate-950 font-semibold px-4 py-2 text-sm hover:bg-teal-300"><Zap size={16}/> Launch Demo</button>
          <button onClick={()=>setMobile(!mobile)} className="md:hidden p-2 rounded-lg hover:bg-white/5"><Menu size={20}/></button>
        </div>
      </div>
      {mobile&&<div className="md:hidden border-t border-white/10 p-3 flex flex-col gap-1">
        <button onClick={()=>nav("dashboard")} className="text-left p-3 rounded-lg hover:bg-white/5">Live Dashboard</button>
        <button onClick={()=>nav("report")} className="text-left p-3 rounded-lg hover:bg-white/5">Report Emergency</button>
        <button onClick={()=>nav("how")} className="text-left p-3 rounded-lg hover:bg-white/5">How it works</button>
        <button onClick={launchDemo} className="p-3 rounded-lg bg-teal-400 text-slate-950 font-semibold">Launch Demo</button>
      </div>}
