"use client"
import TaskItem from "@/components/taskitem";
import { apiFetch } from "@/lib/apiFetch";
import { Dot, Plus } from "lucide-react";
import { useEffect, useState } from "react"
import TaskModal from "@/components/taskModal";
import { motion, AnimatePresence } from "framer-motion";

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

    const containerVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.4,
                ease: "easeOut",
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="px-3 sm:px-8 py-8 flex flex-col gap-4 sm:gap-6"
        >
            <motion.div variants={itemVariants} className="flex flex-row gap-0.5 sm:gap-2 items-center">
                <div className="px-2 py-1 font-mono text-sm uppercase bg-[#00a572]/30 text-[#00a572] font-extrabold rounded-xl shadow-sm shadow-primary-text ">
                    {streak} day streak
                </div>
                <Dot className="h-8 w-8 text-primary-text" />
                <div className="font-mono text-sm font-semibold text-primary-text">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col gap-3">
                <div className="text-3xl sm:text-5xl font-extrabold text-secondary-text justify-items-center leading-10 sm:leading-13">
                    Hey {user?.name || "there"}, let's <span className="text-foreground">crush<br/> today's</span> goals!
                </div>
                <div className="text-sm sm:text-md text-primary-text">
                    You have {tasksLeft} tasks remaining for your current streak.
                </div>
            </motion.div>
            
            <motion.div 
                variants={itemVariants} 
                className="bg-primary-bg shadow-sm mt-4 rounded-lg shadow-primary-text px-2 py-4 sm:px-20 sm:py-8 flex flex-col gap-5 sm:gap-10"
            >
                <div className="flex flex-row justify-between">
                    <div className="font-mono font-semibold flex flex-row gap-4 sm:gap-8 text-sm sm:text-md justify-center items-end pb-1 text-center">
                        <div onClick={()=>{setSelect(1)}} className={`text-center cursor-pointer ${selected ? "pb-1 text-foreground border-b border-foreground":"text-primary-text" }`}>
                            Today
                        </div>
                        <div onClick={()=>{setSelect(0)}} className={`text-center cursor-pointer ${!selected ? "pb-1 text-foreground border-b border-foreground":"text-primary-text" }`}>
                            Upcoming
                        </div>
                    </div>
                    <button onClick={()=>setModalOpen(true)} className="bg-[#4cd7f6] cursor-pointer rounded-lg  font-bold justify-center items-center text-black font-mono text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 flex flex-row gap-1">
                        <Plus className="h-3 w-3  sm:h-4 sm:w-4"/> 
                        <span className="text-center">
                            Add Task
                        </span>
                    </button>
                </div>
                
                <motion.div layout className="flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                        {visibleTasks.length!=0 ? (visibleTasks.map((task)=>(
                            <motion.div
                                key={task._id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <TaskItem
                                    task={task}
                                    onToggle={() => toggleTask(task)}
                                    onDelete={() => deleteTask(task._id)}
                                />
                            </motion.div>
                        ))) : (
                            <motion.p 
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-primary-text text-sm sm:text-lg"
                            >
                                Nothing here yet!
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
            
            <TaskModal 
                open={ModalOpen} 
                onOpenChange={setModalOpen} 
                onSuccess={load} 
            />
        </motion.div>
    )
}