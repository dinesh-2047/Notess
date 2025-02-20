const express = require('express');
const cors = require('cors')
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const fetch = require('node-fetch'); 
const { Headers, Request, Response } = require('node-fetch');  

global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

const app=express()
const port = 3000;
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are a recommendation engine for books and study materials. When a user asks for recommendations, you must only provide books, notes, or study resources relevant to the specified topic or subject. If the user’s input is about general knowledge (e.g., dog breeds, animals,movies or any other recommendation other than books), avoid providing an answer about general topics, and instead steer the response toward academic or study-related resources. Always prioritize providing book titles, study notes, and related materials."
});
const chat = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "Hello" }],
        },
        {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
    ],
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.2,
    }
});
app.use(cors()); 
app.use(express.json())

app.post('/send-message', async (req, res) => {
    const userMessage = req.body.message;
  
    try {
      const result = await chat.sendMessage(userMessage,
        {
            systemInstruction: "You are a recommendation engine for books and study materials. When a user asks for recommendations, you must only provide books, notes, or study resources relevant to the specified topic or subject. If the user’s input is about general knowledge (e.g., dog breeds, animals,movies or any other recommendation other than books), avoid providing an answer about general topics, and instead steer the response toward academic or study-related resources. Always prioritize providing book titles, study notes, and related materials.",
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.2,
            }}
      );
      const responseText = result.response?.text ? result.response.text() : result.response || "No response from the model.";
      res.json({ response: responseText });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while processing your message.' });
    }
  });


app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });