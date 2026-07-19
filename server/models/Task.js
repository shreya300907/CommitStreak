import mongoose from 'mongoose'

const TaskSchema= new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    title:{type:String, required:true},
    sourceType:{type:String, enum:['manual', 'codeforces', 'leetcode', 'github'],default:'manual'},
    sourceUsername:{type:String},
    platformURL:{type:String},
    goalType:{type:String, enum:['count','boolean'], default:'boolean'},
    goalTarget:{type:Number , default:1},
    frequency:{type:String, enum:['daily','weekly','monthly','custom'],default:'daily'},
    active:{type:Boolean, default:true},
    durationDays: { type: Number },
    startedDate:{type:Date,default: Date.now()},
    createdAt:{type:Date, default: Date.now()},
});

export default mongoose.model('Task', TaskSchema);