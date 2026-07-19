"use client"
import TaskItem from "@/components/taskitem";
import { apiFetch } from "@/lib/apiFetch";
import { Dot, Plus } from "lucide-react";
import { useEffect, useState } from "react"
import TaskModal from "@/components/taskModal";

export default function Focus(){
    const [selected,setSelect]=useState(1);
    const [tasks,setTasks]=useState([]);
    const [loading,setLoading]=useState(true);
    const [user,setUser]=useState(null);
    const [ModalOpen,setModalOpen]=useState(false);
    const [streak,setStreak]=useState(0);
    
    async function load(){
        const [tasksRes,userRes]= await Promise.all([
            apiFetch('/tasks/today'),
            apiFetch('/users/me')
        ]);
        const tasksData=await tasksRes.json();
        const userData=await userRes.json();
        setTasks(tasksData);
        setUser(userData);
        const streakRes= await apiFetch('/tasks/streak');
        const { streak }= await streakRes.json();
        setStreak(streak);
        setLoading(false);
    }   
    async function toggleTask(task){
        const isDone = !task.todayLog?.goalMet;
        const achievedValue = isDone ? task.goalTarget : 0;
        await apiFetch(`/tasks/${task._id}/log`, {
            method: 'POST',
            body: JSON.stringify({ achievedValue }),
        });
        load();
    }
    async function deleteTask(taskId) {
        await apiFetch(`/tasks/${taskId}`, {
            method: 'DELETE',
        });
        load();
    }
    useEffect(() => {
        load();
    }, []);
    
    if (loading) return null;

    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.deadline === today);
    const upcomingTasks = tasks.filter(t => t.deadline > today);
    const tasksLeft=todayTasks.filter(t=>
        !t.todayLog?.goalMet
    ).length;
    const visibleTasks= selected? todayTasks : upcomingTasks;

    return (
        <div className="px-8 py-8 flex flex-col gap-6 ">
            <div className="flex flex-row gap-2 items-center">
                <div className="px-2 py-1 font-mono text-sm uppercase bg-[#00a572]/30 text-[#00a572] font-extrabold rounded-xl shadow-sm shadow-primary-text ">
                    {streak} day streak
                </div>
                <Dot className="h-8 w-8 text-primary-text" />
                <div className="font-mono text-sm font-semibold text-primary-text">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="text-5xl font-extrabold text-secondary-text justify-items-center leading-13">
                    Hey {user?.name || "there"}, let's <span className="text-foreground">crush<br/> today's</span> goals!
                </div>
                <div className="text-md text-primary-text">
                    You have {tasksLeft} tasks remaining for your current streak.
                </div>
            </div>
            <div className="bg-primary-bg shadow-sm mt-4 rounded-lg shadow-primary-text px-20 py-8 flex flex-col gap-10">
                <div className="flex flex-row justify-between">
                    <div className="font-mono font-semibold flex flex-row gap-8 text-md justify-center items-end pb-1 text-center">
                        <div onClick={()=>{setSelect(1)}} className={`text-center cursor-pointer ${selected ? "pb-1 text-foreground border-b border-foreground":"text-primary-text" }`}>
                            Today
                        </div>
                        <div onClick={()=>{setSelect(0)}} className={`text-center cursor-pointer ${!selected ? "pb-1 text-foreground border-b border-foreground":"text-primary-text" }`}>
                            Upcoming
                        </div>
                    </div>
                    <button onClick={()=>setModalOpen(true)} className="bg-[#4cd7f6] cursor-pointer rounded-lg  font-bold justify-center items-center text-black font-mono text-sm px-4 py-2 flex flex-row gap-1">
                        <Plus className=" h-4 w-4"/> 
                        <span className="text-center">
                            Add Task
                        </span>
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    {visibleTasks.length!=0 ? (visibleTasks.map((task)=>(
                        <TaskItem
                            key={task._id}
                            task={task}
                            onToggle={() => toggleTask(task)}
                            onDelete={() => deleteTask(task._id)}
                        />)
                    )):(
                        <p className="text-primary-text text-lg ">Nothing here yet!</p>
                    )}
                </div>
            </div>
            <TaskModal 
                open={ModalOpen} 
                onOpenChange={setModalOpen} 
                onSuccess={load} 
            />
        </div>
    )
}

// function isWithinCurrentCycle(task,today){
//     const start=new Date(task.startDate || task.createdAt);
//     const present=new Date(today);
//     const daysSinceStart = Math.floor((present - start) / (1000 * 60 * 60 * 24));
//     const cycleLength = task.durationDays || 1;
//     return (daysSinceStart % cycleLength) < cycleLength && daysSinceStart >= 0 && daysSinceStart < cycleLength;
// }