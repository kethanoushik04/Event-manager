import "./src/config/dontenv.js"
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./src/config/db.js";
import eventRoutes from "./src/routes/event.routes.js";


const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


// debug logger
app.use((req, res, next) => {
console.log(`${req.method} ${req.path} - headers:`, req.headers["content-type"]);
next();
});


app.use("/api/events", eventRoutes);


app.get("/", (req, res) => res.json({ message: "Event backend running" }));


const port = process.env.PORT || 4000;
connectDB()
.then(() => app.listen(port, () => console.log(`Server running on http://localhost:${port}`)))
.catch((err) => console.error("DB connection failed:", err));