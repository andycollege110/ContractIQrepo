// import dependncies from package.json file
import express from "express"; // main web framework
import cors from "cors";    // allows client to access the API
import dotenv from "dotenv"; // loads .env file
import bodyParser from "body-parser"; // parses POST JSON
import Stripe from "stripe";        // payment integration
import { createClient } from "@supabase/supabase-js" // database/authication
import { GoogleGenerativeAI } from "@google/generative-ai";
import aiRouter from "./routes/ai.mjs";


dotenv.config(); // Load .env file first


// intialize app + middleware
const app = express();


// for stricter secuirty, set origin to your client URl
app.use(cors());
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000"}));


// external services
// STRIPE SETUP
const stripeSecret = (process.env.STRIPE_SECRET_KEY || " ").trim();


let stripe =null;
if (!stripeSecret){
   console.warn("[stripe] Missing STRIPE_SECRET_KEY in .env");
} else { stripe = new Stripe(stripeSecret);
   }


// health route for server
app.get ("/", (_req, res) => {
   res.send("server is running");
});




// mount gemini routes
app.use("/ai", aiRouter);


//start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
   console.log (`server is running on  http://localhost:${PORT}`);
});

