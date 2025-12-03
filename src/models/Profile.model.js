import mongoose from "mongoose";


const ProfileSchema = new mongoose.Schema({
name: { type: String, required: true },
ownerName: { type: String },
meta: mongoose.Schema.Types.Mixed
}, { timestamps: true });


export default mongoose.model("Profile", ProfileSchema);