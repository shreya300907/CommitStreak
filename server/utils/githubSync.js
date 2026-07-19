export async function fetchGithubProfile(username){
    console.log("h");
    const res=await fetch(`https://api.github.com/users/${username}`);
    if(res.status===404){
        throw new Error('Invalid github username!');
    }
    const data=await res.json();
    return{
        publicRepos:data.public_repos,
        followers:data.followers,
    }
}

export async function fetchGithubActivityByDate(username){
    const activeDays=new Set();
    for( let page=1;page<=3;page++){
        const res=await fetch(`https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`);
        if(res.status===404){
            throw new Error('Invalid github username!');
        }
        const data=await res.json();
        if(!Array.isArray(data) || data.length===0){
            break;
        }
        for(const event of data){
            const date = new Date(event.created_at).toISOString().split('T')[0];
            activeDays.add(date);
        }
    }
    const cleanedData={};
    for(const day of activeDays){
        cleanedData[day]=true;
    }
    return cleanedData;
}