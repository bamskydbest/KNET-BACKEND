import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import contactRoutes from "./routes/contact.js";

const app = express();


const allowedOrigins = [
  "https://k-netgh.netlify.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  })
);


app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);


app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1); // trust first proxy



const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: "Too many requests, please try again later." },
});

app.use("/api/contact", limiter, contactRoutes);
app.get("/", (_req, res) => res.json({ status: "ok" }));

export default app;
