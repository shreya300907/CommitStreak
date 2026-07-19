import { Zap } from "lucide-react";

export default function Footer(){
    return(
        <div className="bg-[#060e20] w-full justify-between flex flex-row px-4 py-4">
            <div className="flex items-center gap-1 sm:gap-3 group">
                <div className="bg-btn-bg text-btn-text p-1.5 rounded-md flex items-center justify-center transition-transform group-hover:scale-105">
                    <Zap className="sm:w-5 sm:h-5 w-3 h-3" fill="currentColor" strokeWidth={0} />
                </div>
                <span className="font-sans font-[900] text-[16px] sm:text-xl text-foreground tracking-tight">
                    CommitStreak
                </span>
            </div>
            <div className="font-mono text-primary-text">
                Built by Shreya
            </div>
        </div>
    );
}