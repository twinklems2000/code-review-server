import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    });

    res.json({ review: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ review: "Error analyzing code" });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
