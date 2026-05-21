 import "dotenv/config";
 import express from "express";
 import cors from "cors";
 import { connectDB } from "./config/db.js";
 import authRouts from "./routes/auth.js"
 import { notFound, errorHandler } from "./middleware/errorHandler.js";

 const app = express();

 const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

    const corsOptions = {
        origin: (origin, callback) => {
            if(!origin) return callback(null, true);
            if(/^https?:\/\/localhost:\d+$/.test(origin) || allowedOrigins.includes(origin)) {
             return callback(null, true);
            }

            if(allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET","POST","PUT","DELETE","OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],

    };


app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
app.use(express.json({limit: "1mb"}));


app.use("/api/health", (req,res) => {
    res.json({ status: "ok" });
});
app.use("/", (req,res) => {
    res.json({ message: "Welcome to the Habit Tracker API" });
});


app.use("/api/auth",authRouts);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(error => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
});


