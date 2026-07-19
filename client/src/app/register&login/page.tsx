"use client";

import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";
import { useState } from "react";

export default function Signup() {
    const [step, setStep] = useState("email"); 
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleRequestOtp(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/request-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        setLoading(false);
        if (res.ok) setStep("otp");
        else setError("Something went wrong. Try again.");
    }

    async function handleVerifyOtp(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
            document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
            window.location.href = "/dashboard";
        } else {
            setError(data.error || "Invalid code");
        }
    }

    return (
        <div className="gap-8 mx-auto justify-center items-center flex flex-col my-auto">
            <div className="flex flex-col items-center gap-1 sm:gap-4">
                <div className="text-foreground p-1.5 flex items-center justify-center">
                    <Zap className="sm:w-25 sm:h-25 w-10 h-10" fill="currentColor" strokeWidth={0} />
                </div>
                <span className="font-[900] text-4xl sm:text-8xl text-foreground tracking-tight">
                    CommitStreak
                </span>
            </div>
            <div className="flex flex-col gap-2 bg-primary-bg rounded-xl border-btn-bg border-[0.5px] shadow-md shadow-btn-bg px-24 py-10">
                <div className="text-secondary-text font-extrabold text-left text-4xl">
                    Welcome to the Streak
                </div>
                <span className="text-primary-text text-left text-lg">
                    {step === "email" ? "Enter your email to start your sprint." : "Enter the code sent to your email."}
                </span>

                {step === "email" ? (
                    <form className="mt-8 flex flex-col gap-3" onSubmit={handleRequestOtp}>
                        <label className="text-primary-text text-left text-md font-mono tracking-wide">
                            Email Address
                        </label>
                        <Input
                            type="email"
                            placeholder="name@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border-[0.5px] border-slate-600"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" disabled={loading} className="mt-2 bg-btn-bg text-btn-text text-md font-semibold cursor-pointer px-4 py-2 rounded-md font-mono hover:shadow-sm transition-all ease-in-out hover:scale-102 hover:shadow-btn-bg disabled:opacity-50">
                            {loading ? "Sending..." : "Send Code"}
                        </button>
                    </form>
                ) : (
                    <form className="mt-8 flex flex-col gap-3" onSubmit={handleVerifyOtp}>
                        <label className="text-primary-text text-left text-md font-mono tracking-wide">
                            6-digit OTP
                        </label>
                        <Input
                            type="text"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="border-[0.5px] border-slate-600"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" disabled={loading} className="mt-2 bg-btn-bg text-btn-text text-md font-semibold cursor-pointer px-4 py-2 rounded-md font-mono hover:shadow-sm transition-all ease-in-out hover:scale-102 hover:shadow-btn-bg disabled:opacity-50">
                            {loading ? "Verifying..." : "Verify & Continue"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}