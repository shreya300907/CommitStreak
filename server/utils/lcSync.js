export async function fetchLCProfile(username){
    const query={
        query:`
            query getUserProfile($username: String!){
                matchedUser(username:$username){
                    profile {ranking}
                    submitStats: submitStatsGlobal {
                        acSubmissionNum { difficulty count }
                    }
                }
            }`,
        variables:{username},
    }
    const res=await fetch("https://leetcode.com/graphql",{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
    })
    const data=await res.json();
    const user=data?.data?.matchedUser;
    if(!user){
        throw new Error("Invalid username!")
    }
    const totalSolved = user.submitStats.acSubmissionNum.find(s => s.difficulty === 'All')?.count ?? 0;
    console.log(totalSolved);
    return {
        ranking: user.profile.ranking,
        totalSolved
    }
}

export async function fetchLCSubmissionByDate(username){
    const query = {
        query: `
            query getUserCalendar($username: String!) {
                matchedUser(username: $username) {
                submissionCalendar
                }
            }`,
        variables: { username },
    };
    const res=await fetch("https://leetcode.com/graphql",{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
    })
    const data=await res.json();
    const raw=data?.data?.matchedUser?.submissionCalendar;
    if(!raw){
        throw new Error("Failed to fetch LeetCode submissions!")
    }
    const calendar=JSON.parse(raw);
    const counts = {};
    for (const [timestamp, count] of Object.entries(calendar)) {
        const date = new Date(Number(timestamp) * 1000).toISOString().split('T')[0];
        counts[date] = (counts[date] || 0) + count;
    }
    return counts;
}