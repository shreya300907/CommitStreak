import DashboardNav from "@/components/dashnav";

export default function Dashboard({children} :{children: React.ReactNode}){
    return(
        <div>
            <DashboardNav/>
            <main>
                {children}
            </main>            
        </div>
    )
}