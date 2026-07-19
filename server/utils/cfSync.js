export async function fetchCfProfile(handle){
    const res= await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const data=await res.json();
    if(data.status!=='OK'){
        throw new Error("Invalid Codeforces handle!");
    }
    const user=data.result[0];
    return{
        rating: user.rating??null,
        rank: user.rank??'unrated',
    }
}

export async function fetchCfSubmissionByDate(handle){
    const res=await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`);
    const data = await res.json();
    if(data.status!=='OK'){
        throw new Error("Failed to fetch submissions!");
    }
    const submissionsByDate={};
    for(const sub of data.result){
        if(sub.verdict!=='OK'){
            continue;
        }
        const date=new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
        const problemKey=`${sub.problem.contestId}_${sub.problem.index}`
        submissionsByDate[date]=submissionsByDate[date] || new Set();
        submissionsByDate[date].add(problemKey);
    }
    const cleanedData={};
    for(const date of Object.keys(submissionsByDate)){
        cleanedData[date]=submissionsByDate[date].size;
    }
    return cleanedData;
}