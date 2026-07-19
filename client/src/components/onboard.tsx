"use client"

import { apiFetch } from "@/lib/apiFetch";
import { useState } from "react";

const STEPS=[ "codeforces","leetcode","github"];

export default function Onboarding({onComplete}){
    const [step,setStep]=useState(0);
    const [name,setName]=useState("");
    const [error,setError]=useState("");
    const [saving,setSaving]=useState(false);
    const [platforms, setPlatforms] =useState([{username:"",goalTarget:""}
        ,{username:"",goalTarget:""}
        ,{username:"",frequency: "" }
    ]);
    
    function updatePlatform(i,field,value){
        setPlatforms((prev) => {
            const updated=[...prev];
            updated[i]={
                ...updated[i], [field]:value
            };
            return updated;
        }
    );
    }

    const FREQUENCY_TO_DAYS = {
        daily: 1,
        weekly: 7,
        monthly: 30,
    };

    async function finish(){
        setSaving(true);
        setError("");

        try{

           const res= await apiFetch('/users/me',{
            method:'PATCH',
            body:JSON.stringify({name,onboarded:true}),
           }); 
           
           if(!res.ok){
            const errData=await res.json().catch(()=>({}));
            console.error('PATCH /users/me failed:',res.status,errData);
            setError('Failed to save your info. PLease try again.');
            setSaving(false);
            return;
           }

           const updatedUser= await res.json();

           for(let i=0;i<2;i++){
            const hasAllData = platforms[i].username && platforms[i].goalTarget;
            const data=platforms[i];
            if(hasAllData){
                const taskRes =await apiFetch('/tasks',{
                    method:'POST',
                    body: JSON.stringify({
                        title: `${i===0? 'Codeforces' : 'Leetcode'} practice`,
                        sourceType: `${i===0? 'codeforces': 'leetcode'}`,
                        sourceUsername: data.username,
                        goalType: 'count',
                        goalTarget:Number(data.goalTarget),
                        frequency: 'daily',
                        durationDays:1,
                    })
                });

                if(!taskRes.ok){
                    console.error('Failed to create task', await taskRes.json().catch(()=>({})));
                }
            }
           }
           const data=platforms[2];
           const hasAllData=data.username;
           if(hasAllData){
                const taskRes =await apiFetch('/tasks',{
                    method:'POST',
                    body: JSON.stringify({
                        title: 'Github Activity',
                        sourceType: 'github',
                        sourceUsername: data.username,
                        goalType: 'boolean',
                        goalTarget: 1,
                        frequency: data.frequency,
                        durationDays: FREQUENCY_TO_DAYS[data.frequency] ?? 1,
                    })
                });

                if(!taskRes.ok){
                    console.error('Failed to create task', await taskRes.json().catch(()=>({})));
                }
            } 
            setSaving(false);
            onComplete(updatedUser);
        }catch(err){
            console.error('Onboarding finish() error:', err);
            setError('Something went wrong. Please try again.');
            setSaving(false);
        }
    }

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-primary-bg rounded-xl p-8 w-full max-w-md flex flex-col gap-4 border-btn-bg border-[0.5px] shadow-md shadow-btn-bg">
                
                {step===0 && (
                    <>
                        <h2 className="text-3xl font-extrabold">
                            Welcome to CommitStreak
                        </h2>
                        <p className="text-primary-text text-lg">
                           Let's set up your goals — takes under a minute. 
                        </p>
                        <button onClick={()=>{setStep(step+1)}} className="font-semibold cursor-pointer bg-btn-bg text-btn-text px-4 py-2 rounded-md hover:shadow-sm transition-all ease-in-out hover:scale-102 hover:shadow-btn-bg">
                            Next
                        </button>
                    </>
                )}

                {step===1 && (
                    <>
                        <h2 className="text-2xl font-bold">
                            What should we call you?
                        </h2>
                        <input
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            placeholder="Your Name"
                            className="border rounded-md px-3 py-2 text-primary-text"
                        />
                        <button onClick={()=>{setStep(step+1)}} disabled={!name} className="font-semibold cursor-pointer disabled:cursor-not-allowed bg-btn-bg text-btn-text px-4 py-2 rounded-md disabled:opacity-50">
                            Next
                        </button>
                    </>
                )}

                {(step === 2 || step ===3 || step ===4) && (
                    <PlatformSteps 
                        step={step}
                        data={platforms[step-2]}
                        label={STEPS[step-2]}
                        onNext={()=>{setStep(step+1)}}
                        onSkip={()=>{setStep(step+1)}}
                        onchange={(i,field,value)=>{
                            updatePlatform(i,field,value)
                        }}
                    />
                )}

                {step===5 && (
                    <>
                        <h2 className="text-2xl font-extrabold">
                            You're all set
                        </h2>
                        <p className="text-primary-text text-lg">
                            Let's get to your dashboard.
                        </p>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button onClick={finish} disabled={saving} className="cursor-pointer font-semibold bg-btn-bg hover:shadow-sm transition-all ease-in-out hover:scale-102 hover:shadow-btn-bg text-btn-text px-4 py-2 rounded-md disabled:opacity-50">
                            {saving ? "Saving..." : "Go to dashboard"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function PlatformSteps({step,data,label,onNext,onSkip,onchange}){
    const isGithub = step===4 ;
    const isComplete = isGithub 
        ? data.username && data.frequency
        : data.username && data.goalTarget;
    
    return(
        <>
            <h2 className="text-2xl font-bold capitalize">{label} handle</h2>
            <input
                value={data.username}
                onChange={(e)=>{onchange((step-2),"username",e.target.value)}}
                placeholder={`Your ${label} username`}
                className="border rounded-md px-3 py-2 text-primary-text"
            />
            {!isGithub && (
                <input
                    type="number"
                    value={data.goalTarget}
                    onChange={(e)=>{onchange((step-2),"goalTarget",e.target.value)}}
                    placeholder="Number of questions"
                    className="border rounded-md px-3 py-2 text-primary-text"
                />
            )}
            {isGithub && (
                <select
                    value={data.frequency ?? ""}
                    onChange={(e) => { onchange((step - 2), "frequency", e.target.value) }}
                    className="border rounded-md px-3 py-2 text-primary-text bg-primary-bg border-slate-600 focus:outline-none focus:border-btn-bg"
                >
                    <option value="" disabled>Frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            )}
            <div className="flex gap-2">
                <button onClick= {onSkip} 
                    className="font-semibold flex-1 border-2 border-btn-bg px-4 py-2 rounded-md cursor-pointer">
                    Skip
                </button>
                <button onClick= {onNext} disabled={!isComplete} 
                    className="font-semibold flex-1 bg-btn-bg text-btn-text px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">Next
                </button>
            </div>
        </>
    )
}