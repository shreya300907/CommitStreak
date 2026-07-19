export function getCurrentCycle(task,todayStr){
    const today=new Date(todayStr+'T00:00:00Z');
    const created = new Date(task.startedDate || task.createdAt);
    const createdStr = created.toISOString().split('T')[0];
    const createdDate = new Date(createdStr + 'T00:00:00Z');

    if(task.frequency==="daily"){
        return {deadline:todayStr , isPast:false};
    }
    if(task.frequency==="custom"){
        const deadline= new Date(createdDate);
        deadline.setUTCDate(deadline.getUTCDate()+(task.durationDays-1));
        const deadlineStr=deadline.toISOString().split('T')[0];
        return {deadline: deadlineStr , isPast: todayStr>deadlineStr};
    }
    //weekly or monthly 
    const cycleLength= task.frequency==="weekly"?7:30;
    const daysSinceStart=Math.floor((today-createdDate)/86400000);
    const daysLeft= cycleLength-(daysSinceStart%cycleLength);
    const deadline =new Date(today);
    deadline.setUTCDate(deadline.getUTCDate()+(daysLeft-1));
    const deadlineStr=deadline.toISOString().split('T')[0];
    return {deadline: deadlineStr , isPast:false};
}