import mongoose from "mongoose";


const EventLogSchema = new mongoose.Schema({
event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true, index: true },
userName: { type: String },
action: { type: String },
changes: [{ key: String, before: mongoose.Schema.Types.Mixed, after: mongoose.Schema.Types.Mixed }],
createdAt: { type: Date, default: Date.now }
});


export default mongoose.model("EventLog", EventLogSchema);