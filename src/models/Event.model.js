import mongoose from "mongoose";


const EventSchema = new mongoose.Schema({
title: { type: String, default: "Untitled Event" },
createdByName: { type: String },
profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
timezone: { type: String, required: true },
startAt: { type: Date, required: true, index: true },
endAt: { type: Date, required: true, index: true },
meta: mongoose.Schema.Types.Mixed
}, { timestamps: true });


EventSchema.index({ startAt: 1, endAt: 1 });


export default mongoose.model("Event", EventSchema);