import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors({ origin: "https://bugfreecode.netlify.app" }));
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/ping", (req, res) => res.send("pong"));

app.post("/review", async (req, res) => {
  try {
    const { code } = req.body;

    const prompt = `
      You are an expert software engineer.
      Review the following code and provide constructive feedback:
      - Identify bugs, performance issues, and security risks
      - Suggest improvements and best practices
      Code:
      ${code}
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    res.json({ review: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ review: "Error analyzing code" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
