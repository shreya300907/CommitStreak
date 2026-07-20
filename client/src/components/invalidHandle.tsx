"use client"

import { apiFetch } from "@/lib/apiFetch";
import { useEffect, useState } from "react"

export default function InvalidHanlde({platform,load}){

    const [username, setUsername] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [taskId, setTaskId] = useState(null);

    useEffect(() => {
        apiFetch('/tasks').then(res => res.json()).then(tasks => {
            const t = tasks.find(t => t.sourceType === platform.toLowerCase());
            if (t) setTaskId(t._id);
        });
    }, []);

    if (!taskId) return null;

    async function handleSave(e){
        e.preventDefault();
        setSubmitting(true);
        setError("");
        const res=await apiFetch(`/tasks/${taskId}`,{
            method:'PATCH',
            body:JSON.stringify({
                sourceUsername: username,
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
        <div className="bg-secondary-bg rounded-lg shadow-sm shadow-primary-text p-2 sm:p-8 flex flex-col gap-3 sm:gap-4 mx-2 my-30 sm:max-w-md">
            <div>
                <h2 className="text-2xl font-bold text-secondary-text">Fix your {platform} handle</h2>
                <p className="text-primary-text text-sm mt-1">
                    We couldn't find that username on {platform}. Double-check and try again.
                </p>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={`Your ${platform} username`}
                    required
                    className="border rounded-md px-3 py-2 text-primary-text"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-btn-bg text-btn-text font-semibold rounded-md px-4 py-2 disabled:opacity-50 cursor-pointer"
                >
                    {submitting ? "Saving..." : "Save & Retry"}
                </button>
            </form>
        </div>
    )
}