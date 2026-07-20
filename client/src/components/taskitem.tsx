"use client"

import { CheckCircle, Clock, Lock } from "lucide-react";
import { useState } from "react";

export default function TaskItem({task,onToggle,onDelete}){
    const [menuOpen,setMenuOpen]=useState(false);
    const done = task.todayLog?.goalMet;
    const isAutoSynced = task.sourceType !== 'manual';

    function formatTimeLeft(deadline) {
        const end = new Date(deadline + 'T23:59:59');
        const diffMs = end - (new Date());
        if (diffMs <= 0) return "Overdue";
        const days = Math.floor(diffMs / 86400000);
        const hours = Math.floor((diffMs % 86400000) / 3600000);
        const mins = Math.floor((diffMs % 3600000) / 60000);
        return `${days}d ${hours}h ${mins}m left`;
    }

    return(
        <div className="bg-background px-3 py-2 sm:px-8 sm:py-4 flex flex-row justify-between rounded-lg shadow-xs shadow-primary-text">
            <div className="flex flex-row gap-2 sm:gap-4 justify-center items-center">
                <div>
                    <input
                        type="checkbox"
                        checked={!!done}
                        onChange={isAutoSynced ? undefined : onToggle}
                        disabled={isAutoSynced}
                        title={isAutoSynced ? "Synced automatically from " + task.sourceType : ""}
                        className={`sm:w-5 sm:h-5 w-3 h-3 ${isAutoSynced ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                    />
                </div>
                <div className="flex flex-col">
                    <div className={` font-bold text-lg sm:text-xl ${done ? "line-through text-primary-text ": "text-secondary-text"}`}>
                        {task.title}
                    </div>
                    {!done ?
                    (<div className={`text-primary-text capitalize font-medium items-center font-mono text-[10px]  sm:text-xs flex flex-row gap-1`}>
                        {isAutoSynced ? <Lock className="sm:w-3 sm:h-3 w-2 h-2"/> : <Clock className="sm:w-3 sm:h-3 w-2 h-2"/>}
                        <span>
                          {isAutoSynced
                            ? `Synced from ${task.sourceType}`
                            : (task.frequency === 'custom' ? formatTimeLeft(task.deadline) : task.frequency)}
                        </span>
                    </div>):(
                    <div className={`text-[#00a572] items-center font-medium font-mono text-[10px] sm:text-sm flex flex-row gap-1`}>
                        <CheckCircle className="sm:w-3 sm:h-3 w-2 h-2"/>
                        <span>Completed</span>
                    </div>)}
                </div>
            </div>
            <div className="relative">
                <button className="cursor-pointer px-2 text-lg" onClick={()=>(setMenuOpen(!menuOpen))}>⋮</button>
                {menuOpen && (
                <div className="absolute right-0 top-6 z-10">
                    <button
                    className="px-3 py-1 bg-red-600 cursor-pointer text-background text-[10px] sm:text-sm font-medium rounded-sm transition-all duration-200 hover:opacity-90 active:scale-95 shadow-xs"
                    onClick={()=>{onDelete(); setMenuOpen(!menuOpen);}}
                    >
                    Delete
                    </button>
                </div>
                )}
            </div>
        </div>
    );
}