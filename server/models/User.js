import mongoose from 'mongoose';

const UserSchema= new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String},
    onboarded: {type: Boolean, default:false},
    createdAt: {type: Date, default: Date.now}
})

export default mongoose.model('User',UserSchema);