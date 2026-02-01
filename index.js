console.log("FILE INI YANG JALAN 🚀");

import "dotenv/config";
import express from "express";
import multer from "multer";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const app = express();
// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage: multer.memoryStorage() });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-2.5-flash";

app.use(express.json());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

app.post("/generate-text", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ result: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/generate-from-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const { prompt } = req.body;
    const base64Image = req.file.buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Image,
                mimeType: req.file.mimetype,
              },
            },
          ],
        },
      ],
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ result: text });
  } catch (error) {
    console.error("IMAGE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


app.post("/generate-from-document", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Document file is required" });
    }

    const { prompt } = req.body;
    const base64Document = req.file.buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt ?? 'Tolong berikan ringkasan dari dokumen yang saya berikan.' },
            {
              inlineData: {
                data: base64Document,
                mimeType: req.file.mimetype,
              },
            },
          ],
        },
      ],
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ result: text });
  } catch (error) {
    console.error("DOCUMENT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


app.post("/generate-from-audio", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    const { prompt } = req.body;
    const base64Audio = req.file.buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt ?? 'Tolong berikan transkripsi dari audio yang saya berikan.' },
            {
              inlineData: {
                data: base64Audio,
                mimeType: req.file.mimetype,
              },
            },
          ],
        },
      ],
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ result: text });
  } catch (error) {
    console.error("AUDIO ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

