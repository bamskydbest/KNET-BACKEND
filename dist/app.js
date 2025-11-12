import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import contactRoutes from "./routes/contact.js";
const app = express();
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
// rate limiter for contact endpoint
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 10,
    message: { error: "Too many requests, please try again later." },
});
app.use("/api/contact", limiter, contactRoutes);
app.get("/", (_req, res) => res.json({ status: "ok" }));
export default app;
