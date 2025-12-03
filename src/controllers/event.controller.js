import Event from "../models/Event.model.js";
import EventLog from "../models/EventLog.model.js";
import Profile from "../models/Profile.model.js";
// Create event
export const createEvent = async (req, res) => {
  try {
    // No auth: createdByName comes from payload (admin types name) or header
    const {
      title,
      profiles = [],
      timezone,
      startAt,
      endAt,
      createdByName,
    } = req.body;
    if (!timezone || !startAt || !endAt)
      return res.status(400).json({ message: "Missing fields" });
    const s = new Date(startAt);
    const e = new Date(endAt);
    if (isNaN(s) || isNaN(e))
      return res.status(400).json({ message: "Invaliddates" });
    if (e <= s)
      return res.status(400).json({ message: "endAt must be afterstartAt" });
    // Validate profile ids (optional)
    const validProfiles = [];
    for (const p of profiles) {
      try {
        const doc = await Profile.findById(p).select("_id");
        if (doc) validProfiles.push(doc._id);
      } catch (err) {
        /* ignore invalid ids */
      }
    }
    const event = await Event.create({
      title,
      createdByName: createdByName || "admin",
      profiles: validProfiles,
      timezone,
      startAt: s,
      endAt: e,
    });
    await EventLog.create({
      event: event._id,
      userName: createdByName || "admin",
      action: "create",
      changes: [{ key: "create", before: null, after: event }],
    });
    return res.status(201).json({ success: true, event });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const listEvents = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 50));
    const skip = (page - 1) * limit;
    const events = await Event.find({})
      .sort({ startAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate("profiles")
      .lean();
    const total = await Event.countDocuments();
    return res.json({ success: true, events, page, limit, total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (
      updates.startAt &&
      updates.endAt &&
      new Date(updates.endAt) <= new Date(updates.startAt)
    )
      return res.status(400).json({ message: "endAt must be after startAt" });
    const before = event.toObject();
    Object.assign(event, updates);
    await event.save();
    const changes = [];
    for (const key of Object.keys(updates)) {
      changes.push({ key, before: before[key], after: event[key] });
    }
    await EventLog.create({
      event: event._id,
      userName: updates.updatedByName || "admin",
      action: "update",
      changes,
    });
    return res.json({ success: true, event });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    await Event.findByIdAndDelete(eventId);
    await EventLog.create({
      event: eventId,
      userName: req.body.deletedByName || "admin",
      action: "delete",
      changes: [],
    });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
// Get logs
export const getLogs = async (req, res) => {
  try {
    const { eventId } = req.params;
    const logs = await EventLog.find({ event: eventId })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, logs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
