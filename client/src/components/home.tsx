"use client";

import { FileChartColumn, RefreshCw, Terminal, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Root(){
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 30 
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                type: "spring", 
                stiffness: 60
            } 
        },
    };

    return(
        <div className="px-2 mt-8 gap-4 sm:gap-6 flex flex-col justify-center items-center">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-secondary-text font-extrabold text-center text-3xl sm:text-5xl leading-snug"
            >
                One dashboard for <span className="italic text-foreground">every coding streak</span><br/> you're keeping..
            </motion.div>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-primary-text font-medium text-center text-xs sm:text-lg"
            >
                Codeforces, LeetCode and all your other goals- tracked and never forgotten again.<br/> Build your discipline with technical precision.
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            >
                <Link 
                    href="/register&login"
                    className="flex flex-row gap-2 justify-items-center bg-btn-bg text-btn-text text-sm sm:text-lg font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-md transition-all duration-200 hover:opacity-90 hover:scale-102 active:scale-95 shadow-xs"
                >
                    Get Started
                    <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6"/>
                </Link>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-1 justify-center items-center mt-9 sm:mt-12"
            >
                <div className="text-secondary-text font-extrabold uppercase text-center text-2xl sm:text-5xl">
                    Features
                </div>
                <div className="text-primary-text font-normal text-center text-sm sm:text-md">
                    The core, waiting to serve you.
                </div>
            </motion.div>
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="w-full grid grid-cols-1 sm:grid-cols-3 justify-items-center px-1 sm:px-15 sm:gap-x-8 sm:gap-y-0 gap-y-4 mt-4 mb-4 sm:mb-8"
            >
                <motion.div 
                    variants={cardVariants}
                    className="transition-all ease-in-out h-full bg-primary-bg p-4 sm:p-6 rounded-lg flex flex-col gap-1 sm:gap-2 border-btn-bg border-[0.5px] shadow-sm hover:scale-102 hover:shadow-md shadow-btn-bg"
                >
                    <RefreshCw className="sm:h-10 sm:w-10 h-8 w-8 p-1 sm:p-2 rounded-lg bg-secondary-bg shrink-0 "/>
                    <div className="text-secondary-text font-bold text-2xl">
                        Auto-Sync
                    </div>
                    <div className="text-primary-text font-normal text-sm sm:text-md">
                        Pulls daily solve counts from Codeforces and LeetCode automatically. Focus on the code, not the count.
                    </div>
                </motion.div>
                <motion.div 
                    variants={cardVariants}
                    className="transition-all ease-in-out h-full bg-primary-bg p-4 sm:p-6 rounded-lg flex flex-col gap-1 sm:gap-2 border-btn-bg border-[0.5px] shadow-sm hover:scale-102 hover:shadow-md shadow-btn-bg"
                >
                    <Terminal className="sm:h-10 sm:w-10 h-8 w-8 p-1 sm:p-2 rounded-lg bg-secondary-bg shrink-0 "/>
                    <div className="text-secondary-text font-bold text-2xl">
                        Manual Tasks
                    </div>
                    <div className="text-primary-text font-normal text-sm sm:text-md">
                        Add and track all your tasks. Full control over your learning path.
                    </div>
                </motion.div>
                <motion.div 
                    variants={cardVariants}
                    className="transition-all ease-in-out h-full bg-primary-bg p-4 sm:p-6 rounded-lg flex flex-col gap-1 sm:gap-2 border-btn-bg border-[0.5px] shadow-sm hover:scale-102 hover:shadow-md shadow-btn-bg"
                >
                    <FileChartColumn className="sm:h-10 sm:w-10 h-8 w-8 p-1 sm:p-2 rounded-lg bg-secondary-bg shrink-0 "/>
                    <div className="text-secondary-text font-bold text-2xl">
                        Streak Analytics
                    </div>
                    <div className="text-primary-text font-normal text-sm sm:text-md">
                        See goal completion, current and longest streaks at a glance.
                    </div>
                </motion.div>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 60 }}
                className="mb-4 flex flex-col gap-2 sm:gap-4 m-2 sm:m-8 justify-items-center px-2 sm:px-24 py-5 sm:py-10 bg-secondary-bg rounded-xl shadow-xs shadow-primary-text text-secondary-text font-bold text-center"
            >
                <div className=" text-xl sm:text-4xl leading-snug">
                    Stop breaking streaks.<br/>
                    Start building discipline.<br/>
                </div>
                <Link 
                    href="/register&login"
                    className="mx-auto w-fit justify-items-center bg-btn-bg text-btn-text text-lg sm:text-xl font-semibold px-5 sm:px-8 py-2 sm:py-3 rounded-md transition-all duration-200 hover:opacity-90 hover:scale-102 active:scale-95 shadow-xs"
                >
                    Launch
                </Link>
            </motion.div>
        </div>
    );
}