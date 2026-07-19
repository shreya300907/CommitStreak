import mongoose from 'mongoose'

const DailyLogSchema=new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, required:true, ref: 'User'},
    taskId:{type: mongoose.Schema.Types.ObjectId, required:true,ref: 'Task'},
    date:{type:String, required:true},
    achievedValue:{type:Number, default:0},
    goalMet:{type:Boolean, default:false},
    source:{type:String, enum:[ 'auto','manual'], default:'manual'},
})
DailyLogSchema.index({ taskId: 1, date: 1 }, { unique: true });
export default mongoose.model('DailyLog',DailyLogSchema);