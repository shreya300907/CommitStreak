import { FileChartColumn, RefreshCw, Terminal, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Root(){
    return(
        <div className=" mt-8 gap-6 flex flex-col justify-center items-center">
            <div className="text-secondary-text font-extrabold text-center text-5xl leading-snug">
                One dashboard for <span className="italic text-foreground">every coding streak</span><br/> you're keeping..
            </div>
            <div className="text-primary-text font-medium text-center text-lg">
                Codeforces, LeetCode and all your other goals- tracked and never forgotten again.<br/> Build your discipline with technical precision.
            </div>
            <Link 
                href="/register&login"
                className="flex flex-row gap-2 justify-items-center bg-btn-bg text-btn-text text-lg font-semibold px-8 py-3 rounded-md transition-all duration-200 hover:opacity-90 hover:scale-102 active:scale-95 shadow-xs"
            >
                Get Started
                <TrendingUp className="h-6 w-6"/>
            </Link>
            <div className="h-200">

            </div>
            <div className="flex flex-col gap-1 justify-center items-center">
                <div className="text-secondary-text font-extrabold text-center text-3xl">
                    What it does <span className="italic text-foreground">today</span>
                </div>
                <div className="text-primary-text font-normal text-center text-md">
                    The core, waiting to serve you.
                </div>
            </div>
            <div className="w-full grid grid-cols-3 justify-items-center px-15 gap-x-8 mt-4 mb-8">
                <div className="transition-all ease-in-out h-full bg-primary-bg p-6 rounded-lg flex flex-col gap-2 border-btn-bg border-[0.5px] shadow-sm hover:scale-102 hover:shadow-md shadow-btn-bg">
                    <RefreshCw className="h-10 w-10 p-2 rounded-lg bg-background shrink-0 "/>
                    <div className="text-secondary-text font-bold text-2xl">
                        Auto-Sync
                    </div>
                    <div className="text-primary-text font-normal text-md">
                        Pulls daily solve counts from Codeforces and LeetCode automatically. Focus on the code, not the count.
                    </div>
                </div>
                <div className="transition-all ease-in-out h-full bg-primary-bg p-6 rounded-lg flex flex-col gap-2 border-btn-bg border-[0.5px] shadow-sm hover:scale-102 hover:shadow-md shadow-btn-bg">
                    <Terminal className="h-10 w-10 p-2 rounded-lg bg-background shrink-0 "/>
                    <div className="text-secondary-text font-bold text-2xl">
                        Manual Tasks
                    </div>
                    <div className="text-primary-text font-normal text-md">
                        Add and track all your tasks. Full control over your learning path.
                    </div>
                </div>
                <div className="transition-all ease-in-out h-full bg-primary-bg p-6 rounded-lg flex flex-col gap-2 border-btn-bg border-[0.5px] shadow-sm hover:scale-102 hover:shadow-md shadow-btn-bg">
                    <FileChartColumn className="h-10 w-10 p-2 rounded-lg bg-background shrink-0 "/>
                    <div className="text-secondary-text font-bold text-2xl">
                        Streak Analytics
                    </div>
                    <div className="text-primary-text font-normal text-md">
                        See goal completion, current and longest streaks at a glance with predictive health scores.
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center ">
                <div className="text-secondary-text font-extrabold text-center text-3xl">
                    What's <span className="italic text-foreground">coming next</span>
                </div>
                <div className="text-primary-text font-normal text-center text-md">
                    Upcoming features to improve your experience.
                </div>
            </div>
            <div className="w-full grid grid-cols-3 justify-items-center px-15 gap-x-8 mt-4 mb-8">
                <div className="transition-all ease-in-out h-full bg-primary-bg p-6 rounded-lg flex flex-col gap-2 border-btn-bg border-[0.5px] shadow-sm hover:scale-102 hover:shadow-md shadow-btn-bg">
                    <RefreshCw className="h-10 w-10 p-2 rounded-lg bg-background shrink-0 "/>
                    <div className="text-secondary-text font-bold text-2xl">
                        Auto-Sync
                    </div>
                    <div className="text-primary-text font-normal text-md">
                        Pulls daily solve counts from Codeforces and LeetCode automatically. Focus on the code, not the count.
                    </div>
                </div>
                <div className="transition-all ease-in-out h-full bg-primary-bg p-6 rounded-lg flex flex-col gap-2 border-btn-bg border-[0.5px] shadow-sm hover:scale-102 hover:shadow-md shadow-btn-bg">
                    <Terminal className="h-10 w-10 p-2 rounded-lg bg-background shrink-0 "/>
                    <div className="text-secondary-text font-bold text-2xl">
                        Manual Tasks
                    </div>
                    <div className="text-primary-text font-normal text-md">
                        Add and track all your tasks. Full control over your learning path.
                    </div>
                </div>
                <div className="transition-all ease-in-out h-full bg-primary-bg p-6 rounded-lg flex flex-col gap-2 border-btn-bg border-[0.5px] shadow-sm hover:scale-102 hover:shadow-md shadow-btn-bg">
                    <FileChartColumn className="h-10 w-10 p-2 rounded-lg bg-background shrink-0 "/>
                    <div className="text-secondary-text font-bold text-2xl">
                        Streak Analytics
                    </div>
                    <div className="text-primary-text font-normal text-md">
                        See goal completion, current and longest streaks at a glance with predictive health scores.
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 m-8 justify-items-center px-24 py-10 bg-secondary-bg rounded-xl shadow-xs shadow-primary-text text-secondary-text font-bold text-center">
                <div className=" text-4xl leading-snug">
                    Stop breaking streaks.<br/>
                    Start building discipline.<br/>
                </div>
                <Link 
                    href="/register&login"
                    className="mx-auto w-fit justify-items-center bg-btn-bg text-btn-text text-xl font-semibold px-8 py-3 rounded-md transition-all duration-200 hover:opacity-90 hover:scale-102 active:scale-95 shadow-xs"
                >
                    Launch
                </Link>
            </div>
        </div>
    );
}