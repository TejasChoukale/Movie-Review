//Movie_Website\Backend\server.js
// File: backend/server.js
import express from "express";
import cors from "cors";
import reviews from "./api/reviews.route.js";

const app = express();

// Updated CORS configuration to allow Netlify domain
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://movie-reviews-tejas.netlify.app',
            'https://fascinating-kangaroo-e8cd6b.netlify.app'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));


app.use(express.json());
app.use("/api/v1/reviews", reviews);
app.use("*", (req, res) => res.status(404).json({ error: "Not Found" }));

export default app;
