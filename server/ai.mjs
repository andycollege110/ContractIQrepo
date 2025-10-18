// gemini route
import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";


// Gemini API Setup
const router = Router(); // creates a sub-router for ai endpoints
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";


// creates a gemini model instance with optional config 
function getModel(config ={}) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    return genAI.getGenerativeModel({
        model: config.model || DEFAULT_MODEL,
        generationConfig: {
            temperature: 0.7,
            topP:0.95,
            topK: 40,
            maxOutputTokens: 1024,
            ... config
        }
    });
}

// generates text for one-time prompt.

router.post("/generate", async (req, res)=> {
    try {
        const { prompt, system, config } = req.body || {};

        // validate input 
        if(!prompt|| typeof prompt!== "string") {
            return res.status(400).json({ error: "prompt (string) is required"});
        }
        // create model + merge config
        const model = getModel(config);

        //combine optional "system" instructions with user prompt
        const textPrompt = system ? '${system.trim()}\n\nUser: ${prompt}': prompt;

        // generate output text
        const result = await model.generateContent(textPrompt);
        const text = result?.response?.text?.() ?? " ";

        res.json ({ text, model: config?.model || DEFAULT_MODEL});
     }  catch (err) {
        console.error("[gemini] generate error:", err);
        res.status(500).jsopn ({ error: err.message || "AI generation failed"});
     }
});

// ai chat
// continuses a converstaion using prior history. 

router.post("/chat", async (req, res) => {
    try {
        const {history = [], message, config } = req.body || {};

        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "message (string) is required"});
        }
        const model = getModel(config);
        const chat = model.startChat({ history });
        const reply = await chat.sendMessage(message);

        const text = reply?.response?.text?.() ?? " ";
        res.json ({ text });
    }  catch (err) {
            console.error("[gemini] chat error: ", err);
            res.status(500).json({error: err.message || "Chat Failed"});
        }
    });

    // exports the ai router to used in server.mjs file 
    export default router;