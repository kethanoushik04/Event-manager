import express from "express";
import { createEvent, listEvents, updateEvent, deleteEvent, getLogs } from "../controllers/event.controller.js";
const router = express.Router();
// CRUD for events
router.post("/", createEvent);
router.get("/", listEvents);
router.put("/:eventId", updateEvent);
router.delete("/:eventId", deleteEvent);
router.get("/:eventId/logs", getLogs);
export default router;
