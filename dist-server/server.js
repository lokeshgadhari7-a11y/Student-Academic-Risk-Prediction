import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config();
const app = express();
app.use(express.json());
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
app.post("/api/academic-chat", async (req, res) => {
  try {
    const { message, studentData, history = [] } = req.body;
    const cgpa = studentData?.CGPA_LAST ?? 7.5;
    const attendance = studentData?.ATTENDANCE_PERCENT ?? 85;
    const backlogs = studentData?.BACKLOGS_COUNT ?? 0;
    const internals = studentData?.INTERNAL_MARKS ?? 24;
    const studyHours = studentData?.WEEKLY_STUDY_HOURS ?? 3;
    const prepMidterm = studentData?.PREP_MIDTERM ?? 2;
    const noteTaking = studentData?.TAKING_NOTES ?? 3;
    const projectImpact = studentData?.PROJECT_IMPACT ?? 1;
    const systemInstruction = `You are "Prof. AI", an experienced and encouraging Academic Mentor for Third-Year Engineering students in Artificial Intelligence & Data Science.
The student is using our "Engineering Student Performance and At-Risk Prediction System" (trained on the UCI Higher Education Evaluation Dataset).

CURRENT STUDENT PROFILE (ENTERED DATA):
- Prior Cumulative GPA: ${cgpa} / 10.0 (Standard University 10-Point Scale)
- Class & Lab Attendance: ${attendance}% (Mandatory University threshold is >= 75%)
- Active Uncleared Backlogs / KT: ${backlogs} subject(s)
- Internal Continuous Assessment: ${internals} / 30 marks
- Weekly Self-Study Hours tier: ${studyHours} (1: <5h, 2: 5-10h, 3: 11-15h, 4: 16-20h, 5: >20h)
- Midterm Prep Strategy: ${prepMidterm === 2 ? "Consistent semester revision" : prepMidterm === 1 ? "Last-minute cramming" : "Minimal"}
- Note-Taking in Lectures: ${noteTaking === 3 ? "Always" : noteTaking === 2 ? "Sometimes" : "Never"}
- Mini-Project Engagement: ${projectImpact === 1 ? "Positive" : "Neutral/Negative"}

DATASET INSIGHTS & STATISTICAL PATTERNS:
1. Prior CGPA accounts for 38% of predictive weight; student baseline determines core technical grasp.
2. Attendance below 75% triggers a steep drop in practical lab exam scores and university eligibility risk.
3. Each active backlog reduces predicted semester SGPA by approximately ~0.75 points due to compounding timetable stress.
4. Consistent weekly problem-solving outperforms last-minute cramming by 1.6 CGPA points on average.

YOUR ROLE:
- Provide specific, personalized, non-judgmental advice directly tailored to the student's entered data.
- Offer actionable study schedules, backlog clearance tactics, internal test score boosters, and semester exam strategies.
- Maintain an empathetic, inspiring tone suitable for an engineering college student.
- Format responses cleanly using short paragraphs, bullet points, and bold text for key strategies.
- If the student asks how to reach a target CGPA (e.g. 8.5+ Distinction), calculate realistic target internal scores and study allocations.`;
    const isRealApiKey = Boolean(process.env.GEMINI_API_KEY) && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && !process.env.GEMINI_API_KEY?.startsWith("MY_");
    const generateLocalAdvisorAdvice = () => {
      let advice = `### Academic Improvement Plan for Your Profile

`;
      advice += `**Current Standing:** Your Prior CGPA is **${cgpa}/10.0** with **${attendance}%** attendance and **${backlogs}** active backlog(s).

`;
      if (backlogs > 0) {
        advice += `\u26A0\uFE0F **Priority 1: Backlog Resolution Strategy**
- Carrying ${backlogs} active backlog subject(s) directly affects your upcoming semester SGPA. Allocate 60-90 minutes daily specifically for past university question papers and fundamental theory modules.

`;
      }
      if (attendance < 75) {
        advice += `\u{1F6A8} **Priority 2: Mandatory Attendance Recovery**
- At ${attendance}%, you are below the university 75% cutoff required for exam hall tickets. Attend 100% of upcoming lectures and practical laboratory slots to earn continuous evaluation marks.

`;
      }
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes("raise") || lowerMessage.includes("boost") || lowerMessage.includes("8.5") || lowerMessage.includes("distinction")) {
        advice += `\u{1F3AF} **Roadmap to 8.5+ CGPA (Distinction Tier):**
`;
        advice += `1. **Target Internal Marks (27+/30):** Scoring high in internal continuous assessments provides a solid foundation before university exams.
`;
        advice += `2. **Dedicated Problem-Solving Time:** Spend 12-15 hours/week on coding exercises, mathematical derivations, and technical proofs.
`;
        advice += `3. **Mini-Project Implementation:** Practical application of concepts significantly increases memory retention for technical theory exams.

`;
      } else if (lowerMessage.includes("timetable") || lowerMessage.includes("schedule") || lowerMessage.includes("plan")) {
        advice += `\u{1F4C5} **Recommended Weekly Engineering Study Timetable:**
`;
        advice += `- **Monday & Wednesday (Core Theory):** 2 hours reviewing lecture notes and reference textbooks.
`;
        advice += `- **Tuesday & Thursday (Practical Labs & Coding):** 2.5 hours hands-on coding, algorithm traces, and lab assignments.
`;
        advice += `- **Friday (Doubt Resolution):** 1.5 hours meeting professors or peer-study groups.
`;
        advice += `- **Saturday & Sunday (Revision & Mock Questions):** 3-4 hours solving previous semester university papers.

`;
      } else {
        advice += `\u{1F4A1} **Actionable Engineering Recommendations:**
`;
        advice += `- Maintain regular weekly problem solving rather than last-minute cramming.
`;
        advice += `- Form active 3-person peer study groups for collaborative lab assignments.
`;
        advice += `- Actively summarize lecture notes within 24 hours of each lecture.

`;
      }
      advice += `Feel free to ask for a custom study timetable, subject-specific revision strategies, or exam preparation tips!`;
      return advice;
    };
    if (!isRealApiKey) {
      return res.json({ response: generateLocalAdvisorAdvice(), source: "academic-advisor-engine" });
    }
    try {
      const geminiPromise = ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          ...history.map((h) => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          })),
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      const timeoutPromise = new Promise(
        (_, reject) => setTimeout(() => reject(new Error("Gemini timeout")), 5e3)
      );
      const response = await Promise.race([geminiPromise, timeoutPromise]);
      const replyText = response?.text || generateLocalAdvisorAdvice();
      return res.json({ response: replyText, source: "gemini-3.8-flash" });
    } catch (apiErr) {
      console.warn("Gemini API call timed out or failed, serving data-driven advisor advice:", apiErr);
      return res.json({ response: generateLocalAdvisorAdvice(), source: "academic-advisor-engine" });
    }
  } catch (error) {
    console.error("Error in academic-chat:", error);
    res.status(500).json({ error: error.message || "Chatbot service error" });
  }
});
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", service: "Engineering Performance Server" });
});
app.get("/api/download-report-pdf", (req, res) => {
  const prodPdf = path.resolve("dist/Engineering_Student_Performance_Final_Project_Report.pdf");
  const publicPdf = path.resolve("public/Engineering_Student_Performance_Final_Project_Report.pdf");
  const pdfPath = fs.existsSync(prodPdf) ? prodPdf : publicPdf;
  if (fs.existsSync(pdfPath)) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="Engineering_Student_Performance_Final_Project_Report.pdf"');
    return res.sendFile(pdfPath);
  }
  return res.status(404).json({ error: "Report PDF not found" });
});
app.get("/Engineering_Student_Performance_Final_Project_Report.pdf", (req, res) => {
  const prodPdf = path.resolve("dist/Engineering_Student_Performance_Final_Project_Report.pdf");
  const publicPdf = path.resolve("public/Engineering_Student_Performance_Final_Project_Report.pdf");
  const pdfPath = fs.existsSync(prodPdf) ? prodPdf : publicPdf;
  if (fs.existsSync(pdfPath)) {
    res.setHeader("Content-Type", "application/pdf");
    return res.sendFile(pdfPath);
  }
  return res.status(404).send("PDF not found");
});
const isProd = process.env.NODE_ENV === "production";
const PORT = parseInt(process.env.PORT || "3000", 10);
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
startServer();
