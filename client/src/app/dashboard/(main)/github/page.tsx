"use client"
import Heatmap from "@/components/heatmap";
import ConnectHandle from "@/components/connectHandle";
import InvalidHandle from "@/components/invalidHandle";
import { apiFetch } from "@/lib/apiFetch";
import { Link2OffIcon, Repeat2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Codeforces(){
    const [data,setData]=useState(null);
    const [loading,setLoading]=useState(true);
    const [frequency, setFrequency] = useState("daily");
    const [syncing,setSyncing]=useState(false);
    const [view,setView]=useState("global");
    const [status,setStatus]=useState("loading");

    async function load(){
        setLoading(true);
        const res=await apiFetch('/tasks/github/dashboard');
        if(res.ok){
            const d=await res.json();
            setData(d);
            setFrequency(d.frequency);
            setStatus("connected");
        }else if(res.status===404){
            setData(null);
            setStatus("not-connected");
        }else{
            setData(null);
            setStatus("invalid");
        }
        setLoading(false);
    }

    useEffect(()=>{
        load()
    },[]);

    async function save(){
        const taskRes= await apiFetch('/tasks');
        const tasks=await taskRes.json();
        const gTask= tasks.find(t => t.sourceType==='github');
        if(gTask){
            await apiFetch(`/tasks/${gTask._id}`,{
                method:'PATCH',
                body:JSON.stringify({
                   frequency
                })
            })
        }
        load();
    }

    async function refresh(){
        setSyncing(true);
        const tasksRes= await apiFetch('/tasks');
        const tasks=await tasksRes.json();
        const gTask= tasks.find(t => t.sourceType==='github');
        if(gTask){
            await apiFetch(`/tasks/${gTask._id}/sync/github`,{
                method:'POST',
            })
            await load();
        }
        setSyncing(false);
    }
    
    async function disconnect(){
        if(data===null){
            return;
        }
        await apiFetch(`/tasks/${data.taskId}`,{method:'DELETE'});
        load();
    }
    if (loading) return null;

    if(status==="not-connected"){
        return(
            <ConnectHandle platform={"Github"} load={load} sourceType={"github"}/>
        );
    }else if(status==="invalid"){
        return(
            <InvalidHandle platform={"Github"} load={load}/>
        );
    }

    const active = view === "global" ? data.global : data.commitStreak;
    return (
        <div className="px-8 py-8 flex flex-col gap-6 ">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col ">
                    <span className="text-6xl font-extrabold text-foreground">Github Dashboard</span>
                    <span className="text-md font-medium text-primary-text">Connect as: <span className="text-md font-semibold text-[#00a572]">{data.username}</span></span>
                </div>
                <div className="flex flex-row gap-6">
                    <div className="px-6 py-4 h-fit my-auto  flex flex-col gap-1 bg-secondary-bg rounded-lg justify-center">
                        <span className="text-xs uppercase font-medium font-mono text-primary-text text-center">
                            Public Repos
                        </span>
                        <span className="tracking-wider text-2xl font-bold text-[#00a572]">
                            {data.publicRepos}
                        </span>
                    </div>
                    <div className="px-6 py-3 h-fit my-auto flex flex-col gap-1 bg-secondary-bg rounded-lg justify-center">
                        <span className="text-xs uppercase font-medium font-mono text-primary-text text-center">
                            Followers
                        </span>
                        <span className="capitalize tracking-wide text-2xl font-bold text-foreground">
                            {data.followers}
                        </span>
                    </div>
                </div>
            </div>
            <div className="shadow-sm shadow-primary-text bg-secondary-bg rounded-lg p-6 flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-secondary-text text-2xl font-bold">
                            Github Activity
                        </h2>
                        <p className="text-primary-text text-sm">
                            Events across last 13 weeks
                        </p>
                    </div>
                    <div className="flex flex-row gap-6">
                        <select
                            value={view}
                            onChange={(e)=>setView(e.target.value)}
                            className="w-full h-fit py-2 px-3 border rounded-md text-sm bg-background text-primary-text "
                        >
                            <option value="global">Global</option>
                            <option value="commitStreak">CommitStreak</option>
                        </select>
                        <button onClick={()=>refresh()} disabled={syncing} className="disabled:opacity-50 bg-foreground h-fit cursor-pointer rounded-lg  font-medium text-secondary-bg text-sm px-4 py-2">
                            {syncing ? "Syncing..." : "Refresh"}
                        </button>
                    </div>
                </div>
                <Heatmap data={active.heatmap} weeks={13}/>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row gap-6">
                        <div className="px-6 py-4 h-full  flex flex-col gap-1 bg-primary-bg rounded-lg justify-center">
                            <span className="text-xs uppercase font-medium font-mono text-primary-text text-center">
                                Current Streak
                            </span>
                            <span className="tracking-wider text-2xl font-bold text-[#00a572]">
                                {active.cur} Days
                            </span>
                        </div>
                        <div className="px-6 py-3 h-full flex flex-col gap-1 bg-primary-bg rounded-lg justify-center">
                            <span className="text-xs uppercase font-medium font-mono text-primary-text text-center">
                                Longest Streak
                            </span>
                            <span className="capitalize tracking-wide text-2xl font-bold text-foreground">
                                {active.longest} Days
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" w-full grid grid-cols-2 gap-x-8 ">
                <div className="flex flex-col w-full px-8 py-6 gap-6 bg-secondary-bg rounded-lg shadow-sm shadow-primary-text">
                    <h2 className="flex flex-row gap-4 font-semibold text-secondary-text text-xl">
                        <Repeat2Icon className="h-6 w-6"/>
                        Frequency
                    </h2>
                    <select
                        className="w-full px-4 py-4 border rounded-md text-lg bg-background text-primary-text "
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                    <button onClick={()=>save()} className="cursor-pointer border border-foreground text-foreground w-full py-2 font-mono font-semibold text-center">
                        Save Preferences
                    </button>
                </div>
                <div className="w-full flex flex-col px-8 py-4 gap-3 bg-secondary-bg rounded-lg shadow-sm shadow-primary-text">
                    <h2 className="flex flex-row gap-4 font-semibold text-secondary-text text-xl">
                        <Link2OffIcon className="h-6 w-6"/>
                        Integration
                    </h2>
                    <div className=" text-sm text-primary-text flex flex-row gap-8  items-center">
                        <span>API Status:</span> 
                        <span className="text-[#00a572] px-2 py-0.5 bg-[#00a572]/30 rounded-lg shadow-sm shadow-primary-text">Connected</span></div>
                    <button onClick={()=>disconnect()} className="mt-3 bg-red-600 text-white rounded-md px-3 py-2 text-sm w-full cursor-pointer">
                        Disconnect Github
                    </button>
                </div>
            </div>
        </div>
    )
}