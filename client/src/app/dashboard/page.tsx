"use client";
import { useEffect, useState } from "react";
import Onboarding from "@/components/onboard";
import { apiFetch } from "@/lib/apiFetch";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const router = useRouter(); 
  useEffect(()=>{
    apiFetch('/users/me').then(res => res.json()).then((data)=>{
        setUser(data);
        setLoading(false);
        console.log(data);
        if (data.onboarded) router.replace('/dashboard/focus');
        })
        .catch(err => {
            console.error('Failed to fetch user:', err);
            setLoading(false);
        });
    },[router])
    if(loading){
        return null;
    }
    if(!user?.onboarded){
        return <Onboarding onComplete={(updatedUser) => {
          setUser(updatedUser);
          router.push('/dashboard/focus');//change here if some trouble occurs
        }}/>
    }else{
        if (loading) {
            return <div className="flex items-center justify-center h-screen">Loading...</div>;
        }
    }
}