import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import Task from '../models/Task.js';
import DailyLog from '../models/DailyLog.js';
import { getCurrentCycle } from '../utils/cycle.js';
import { fetchCfProfile,fetchCfSubmissionByDate } from '../utils/cfSync.js';
import { fetchLCProfile, fetchLCSubmissionByDate } from '../utils/lcSync.js';
import { fetchGithubActivityByDate, fetchGithubProfile } from '../utils/githubSync.js';

const router = express.Router();
router.use(requireAuth); 

router.post('/', async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.user.user_id });
  res.json(task);
});

router.get('/', async (req, res) => {
  const tasks = await Task.find({ userId: req.user.user_id, active: true });
  res.json(tasks);
});

router.patch('/:id', async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.user_id },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

router.post('/:id/log', async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.user_id });
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  const { deadline } = getCurrentCycle(task, today);
  const achievedValue = req.body.achievedValue ?? (req.body.done ? 1 : 0);
  const goalMet = achievedValue >= task.goalTarget;

  const log = await DailyLog.findOneAndUpdate(
    { taskId: task._id, date: deadline },
    { userId: req.user.user_id, achievedValue, goalMet, source: 'manual' },//why manual source
    { upsert: true, new: true }
  );
  res.json(log);
});

router.get('/:id/logs', async (req, res) => {
  const logs = await DailyLog.find({ taskId: req.params.id, userId: req.user.user_id })
    .sort({ date: -1 })
    .limit(30);
  res.json(logs);
});

router.get('/today', async (req, res) => {
  const userId = req.user.user_id;
  const today = new Date().toISOString().split('T')[0];

  const tasks = await Task.find({ userId, active: true });
  const cleanData=[];
  for(const task of tasks){
    const {deadline,isPast}=getCurrentCycle(task,today);
    if(task.frequency==="custom" && isPast){
      continue;
    }
    const log = await DailyLog.findOne({taskId:task._id, date:deadline });
    cleanData.push({...task.toObject(),deadline,todayLog:log||null});
  }
  res.json(cleanData);
});

router.delete('/:id',async (req,res)=>{
  const task=await Task.findOneAndDelete({userId:req.user.user_id, _id:req.params.id});
  if(!task){
    return res.status(404).json({error:"Task not found!"});
  }
  await DailyLog.deleteMany({taskId:task._id});//how did id come here
  res.json({success:"true"});
});

router.get('/streak',async(req,res)=>{
  const userId=req.user.user_id;
  const logs=await DailyLog.find({userId});
  const tasks = await Task.find({ userId, active: true });
  const logsByTaskAndDate={};
  for(const log of logs){
    logsByTaskAndDate[`${log.taskId}_${log.date}`]=log;
  }
  let streak=0;
  let date=new Date();
  date.setDate(date.getDate() - 1);
  while(true){
    const dateStr = date.toISOString().split('T')[0];
    const tasksDueOnthisDate=tasks.filter(task=>{
      const {deadline}=getCurrentCycle(task,dateStr);
      return deadline===dateStr;
    })
    if (tasksDueOnthisDate.length === 0) break;
    const allCompleted=tasksDueOnthisDate.every(task=>{
      const log=logsByTaskAndDate[`${task._id}_${dateStr}`];
      return log?.goalMet;
    })
    if(!allCompleted){
      break;
    }
    streak++;
    date.setDate(date.getDate()-1);
  }
  res.json({streak});
})

router.get('/codeforces/dashboard',async(req,res)=>{
  try{
    const task=await Task.findOne({userId:req.user.user_id, sourceType:"codeforces",active:true});
    if(!task){
      return res.status(404).json({error:"No codeforces task added!"});
    }
    const profile= await fetchCfProfile(task.sourceUsername);
    const submissionCounts=await fetchCfSubmissionByDate(task.sourceUsername);
    const globalHeatMap={};
    const globalActiveDays = new Set();
    for(const [date,count] of Object.entries(submissionCounts)){
      globalHeatMap[date]=count>0;
      if(count>0){
        globalActiveDays.add(date);
      }
    }
    const globalStreaks = computeStreakFromSet(globalActiveDays);

    const logs=await DailyLog.find({taskId:task._id}).sort({date:-1}).limit(371);
    const csHeatMap={};
    const csActiveDays=new Set();
    for(const log of logs){
      if(log.goalMet){
        csHeatMap[log.date]=true;
        csActiveDays.add(log.date);
      }
    }
    const csStreaks = computeStreakFromSet(csActiveDays);
    res.json({
      taskId:task._id,
      username:task.sourceUsername,
      rank:profile.rank,
      rating:profile.rating,
      goalTarget:task.goalTarget,
      frequency:task.frequency,
      global: { heatmap: globalHeatMap, ...globalStreaks },
      commitStreak: { heatmap: csHeatMap, ...csStreaks },
    })
  }catch(err){
    console.error("Codeforces dashboard throwed error: ",err);
    res.status(400).json({error:err.message});
  }
})

router.post('/:id/sync/codeforces', async (req,res)=>{
  try{
    const task= await Task.findOne({userId:req.user.user_id, _id:req.params.id});
    if(!task){
      return res.status(404).json({error:'Codeforces Task not found'});
    }
    const counts= await fetchCfSubmissionByDate(task.sourceUsername);
    for(const [date,count] of Object.entries(counts)){
      await DailyLog.findOneAndUpdate(
        {taskId:task._id, date},
        {goalMet:count>=task.goalTarget, achievedValue:count, source:"auto", userId:req.user.user_id}
        ,{ upsert: true, new: true }
      );
    }
    res.json({ success: true, daysSynced: Object.keys(counts).length });
  }catch(err){
    console.error('Codeforces sync error: ',err);
    res.status(400).json({error: err.message});
  }
})

router.get('/leetcode/dashboard',async(req,res)=>{
  try{
    const task=await Task.findOne({userId:req.user.user_id, sourceType:"leetcode",active:true});
    if(!task){
      return res.status(404).json({error:"No leetcode task added!"});
    }
    const profile= await fetchLCProfile(task.sourceUsername);
    const submissionCounts=await fetchLCSubmissionByDate(task.sourceUsername);
    const globalHeatMap={};
    const globalActiveDays = new Set();
    for(const [date,count] of Object.entries(submissionCounts)){
      globalHeatMap[date]=count>0;
      if(count>0){
        globalActiveDays.add(date);
      }
    }
    const globalStreaks = computeStreakFromSet(globalActiveDays);

    const logs=await DailyLog.find({taskId:task._id}).sort({date:-1}).limit(371);
    const csHeatMap={};
    const csActiveDays=new Set();
    for(const log of logs){
      if(log.goalMet){
        csHeatMap[log.date]=true;
        csActiveDays.add(log.date);
      }
    }
    const csStreaks = computeStreakFromSet(csActiveDays);
    res.json({
      taskId:task._id,
      username:task.sourceUsername,
      ranking: profile.ranking,
      totalSolved: profile.totalSolved,
      goalTarget:task.goalTarget,
      frequency:task.frequency,
      global: { heatmap: globalHeatMap, ...globalStreaks },
      commitStreak: { heatmap: csHeatMap, ...csStreaks },
    })
  }catch(err){
    console.error("Leetcode dashboard throwed error: ",err);
    res.status(400).json({error:err.message});
  }
})

router.post('/:id/sync/leetcode', async (req,res)=>{
  try{
    const task= await Task.findOne({userId:req.user.user_id, _id:req.params.id});
    if(!task){
      return res.status(404).json({error:'Leetcode Task not found'});
    }
    const counts= await fetchLCSubmissionByDate(task.sourceUsername);
    for(const [date,count] of Object.entries(counts)){
      await DailyLog.findOneAndUpdate(
        {taskId:task._id, date},
        {goalMet:count>=task.goalTarget, achievedValue:count, source:"auto", userId:req.user.user_id}
        ,{ upsert: true, new: true }
      );
    }
    res.json({ success: true, daysSynced: Object.keys(counts).length });
  }catch(err){
    console.error('Leetcode sync error: ',err);
    res.status(400).json({error: err.message});
  }
})

router.get('/github/dashboard',async (req,res)=>{
  try{
    const task=await Task.findOne({userId:req.user.user_id, sourceType:"github",active:true});
    if(!task){
      return res.status(404).json({error:"No github task added!"});
    }
    const profile= await fetchGithubProfile(task.sourceUsername);
    const activity=await fetchGithubActivityByDate(task.sourceUsername);
    const globalHeatMap={};
    const globalActiveDays = new Set();
    for(const [date,active] of Object.entries(activity)){
      globalHeatMap[date]=active;
      if(active){
        globalActiveDays.add(date);
      }
    }
    const globalStreaks = computeStreakFromSet(globalActiveDays);

    const logs=await DailyLog.find({taskId:task._id}).sort({date:-1}).limit(371);
    const csHeatMap={};
    const csActiveDays=new Set();
    for(const log of logs){
      if(log.goalMet){
        csHeatMap[log.date]=true;
        csActiveDays.add(log.date);
      }
    }
    const csStreaks = computeStreakFromSet(csActiveDays);
    res.json({
      taskId:task._id,
      username:task.sourceUsername,
      publicRepos: profile.publicRepos,
      followers: profile.followers,
      frequency:task.frequency,
      global: { heatmap: globalHeatMap, ...globalStreaks },
      commitStreak: { heatmap: csHeatMap, ...csStreaks },
    })
  }catch(err){
    console.error("Github dashboard throwed error: ",err);
    res.status(400).json({error:err.message});
  }
})

router.post('/:id/sync/github', async (req,res)=>{
  try{
    const task= await Task.findOne({userId:req.user.user_id, _id:req.params.id});
    if(!task){
      return res.status(404).json({error:'Github Task not found'});
    }
    const activity= await fetchGithubActivityByDate(task.sourceUsername);
    for(const [date,active] of Object.entries(activity)){
      await DailyLog.findOneAndUpdate(
        {taskId:task._id, date},
        {goalMet:active, achievedValue:active ? 1 : 0, source:"auto", userId:req.user.user_id}
        ,{ upsert: true, new: true }
      );
    }
    res.json({ success: true, daysSynced: Object.keys(activity).length });
  }catch(err){
    console.error('Github sync error: ',err);
    res.status(400).json({error: err.message});
  }
})

function computeStreakFromSet(activeDays){
    let cur=0,longest=0,temp=0;
    let date=new Date();
    while(true){
      const dateStr = date.toISOString().split('T')[0];
      if(!activeDays.has(dateStr)){
        break;
      }
      cur++;
      date.setDate(date.getDate()-1);
    }
    const sorted=[...activeDays].sort();
    let prev=null;
    for( const d of sorted){
      if(prev){
        const diffDays=(new Date(d) - new Date(prev))/86400000;
        temp = diffDays===1 ? temp+1 :1;
      }else{
        temp=1;
      }
      longest=Math.max(longest,temp);
      prev=d;
    }
    return {cur,longest}
  }

export default router;