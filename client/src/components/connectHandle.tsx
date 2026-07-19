"use client"

import { apiFetch } from "@/lib/apiFetch";
import { useState } from "react"

export default function ConnectHandle({platform,load,sourceType}){

    const [username,setUsername]=useState("");
    const [goalTarget,setGoalTarget]=useState("");
    const [error,setError]=useState("");
    const [submitting, setSubmitting] =useState(false);
    const isBoolean=sourceType==="github";

    async function handleConnect(e){
        e.preventDefault();
        setSubmitting(true);
        setError("");
        const res=await apiFetch('/tasks',{
            method:'POST',
            body:JSON.stringify({
                title:`${platform} practice`,
                sourceType,
                sourceUsername: username,
                goalType: isBoolean ? 'boolean' : 'count',
                goalTarget: isBoolean ? 1 : Number(goalTarget),
                frequency: 'daily',
            })
        })
        setSubmitting(false);
        if(res.ok){
            load();
        }else{
            const d= await res.json().catch(()=>({}));
            setError(d.error || "Failed to connect. Please try again.");
        }
    }

    return(
        <div className="bg-secondary-bg rounded-lg shadow-sm shadow-primary-text p-8 flex flex-col gap-4 mx-auto my-30 max-w-md">
            <div>
                <h2 className="text-2xl font-bold text-secondary-text">Connect {platform}</h2>
                <p className="text-primary-text text-sm mt-1">
                    Link your {platform} account to start tracking your progress automatically.
                </p>
            </div>
            <form onSubmit={handleConnect} className="flex flex-col gap-3">
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={`Your ${platform} username`}
                    required
                    className="border rounded-md px-3 py-2 text-primary-text"
                />
                {!isBoolean && (
                    <input
                        type="number"
                        value={goalTarget}
                        onChange={(e) => setGoalTarget(e.target.value)}
                        placeholder="Daily goal (e.g. 3 problems)"
                        required
                        className="border rounded-md px-3 py-2 text-primary-text"
                    />
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-btn-bg text-btn-text font-semibold rounded-md px-4 py-2 disabled:opacity-50 cursor-pointer"
                >
                    {submitting ? "Connecting..." : "Connect"}
                </button>
            </form>
        </div>
    )
}