import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Shared Gemini instance
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Health API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", system: "ZAMEEN VIVAAD AI ADM REGISTRY V2.04-SURVEY" });
  });

  // AI Risk Prediction Endpoint
  app.post("/api/predict-risk", async (req, res) => {
    try {
      const projectData = req.body;

      if (!process.env.GEMINI_API_KEY) {
        // Fallback calculation if key not present in dev
        const riskScore = Math.min(98, Math.max(10, Math.floor(
          (projectData.affectedFamilies || 10) * 0.15 +
          (projectData.legalDisputesCount || 0) * 18 +
          (projectData.historicalDistrictDelayRate || 0.3) * 35 +
          (projectData.coordinationIssues === "Yes" ? 20 : 5)
        )));

        let riskLevel = 'LOW';
        if (riskScore >= 80) riskLevel = 'CRITICAL';
        else if (riskScore >= 60) riskLevel = 'HIGH';
        else if (riskScore >= 40) riskLevel = 'MED-HIGH';
        else if (riskScore >= 25) riskLevel = 'MEDIUM';

        return res.json({
          riskScore,
          riskLevel,
          probabilityOfDelay: `${Math.min(99, Math.round(riskScore * 0.95))}%`,
          delayPredictionText: riskScore > 30 ? `+${Math.round(riskScore * 1.8)} days delay predicted` : 'On Schedule',
          likelihoodPercent: Number((riskScore * 0.95).toFixed(1)),
          shapFactors: [
            { driver: 'Multi-heir Title Claims & Disputes', vector: 'up', impact: Number((riskScore * 0.3).toFixed(1)) },
            { driver: 'Compensation & Rehabilitation Disbursal Rate', vector: 'up', impact: Number((riskScore * 0.25).toFixed(1)) },
            { driver: 'Historical District Resolution Velocity', vector: 'up', impact: Number((riskScore * 0.2).toFixed(1)) },
            { driver: 'Inter-Agency Coordination Alignment', vector: 'down', impact: -8.5 },
          ],
          directives: [
            {
              id: `dir-${Date.now()}-1`,
              title: 'Schedule Section 21 Special Hearing',
              description: 'Issue official notification for accelerated dispute resolution panel.',
              completed: false,
            },
            {
              id: `dir-${Date.now()}-2`,
              title: 'Deploy Gram Sabha & Local Land Counsel',
              description: 'Initiate public dialogue to resolve compensation multiplier grievances.',
              completed: false,
            },
            {
              id: `dir-${Date.now()}-3`,
              title: 'Verify Cadastral Boundary Coordinates',
              description: 'Deploy drone survey unit for high-resolution topographical re-assessment.',
              completed: false,
            }
          ],
          riskPredictionBreakdown: [
            { factor: 'TITLE & HEIR CONFLICT', score: Math.min(99, Math.round(riskScore * 1.05)), level: riskScore > 70 ? 'critical' : 'warning', description: 'Assessed likelihood of court injunctions or stay orders.' },
            { factor: 'REHABILITATION & COMPENSATION', score: Math.round(riskScore * 0.85), level: riskScore > 50 ? 'warning' : 'low', description: 'Disbursal gap relative to target schedule.' },
            { factor: 'ECOLOGICAL & CLEARANCE RISK', score: Math.round(riskScore * 0.6), level: 'low', description: 'Environmental and forest clearance status.' }
          ]
        });
      }

      // Prompt Gemini API for structured prediction
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `You are the lead AI Risk Analyst for the Indian Government's ADM Land Registry System (ZAMEEN VIVAAD AI).
Analyze the following land acquisition survey proposal and predict dispute risk metrics, delay probability, SHAP risk drivers, administrative directives, and factor breakdown.

Project Inputs:
- State: ${projectData.state}
- District: ${projectData.district}
- Land Type: ${projectData.landType}
- Affected Families: ${projectData.affectedFamilies}
- Land Area (Hectares): ${projectData.hectares}
- Project Age (Months): ${projectData.projectAgeMonths}
- Planned Duration (Months): ${projectData.plannedDurationMonths}
- Compensation Status: ${projectData.compensationStatus}
- Disbursed %: ${projectData.compDisbursedPercent}%
- Rehab Progress %: ${projectData.rehabProgressPercent}%
- Approval Stage: ${projectData.approvalStage}
- Legal Disputes Count: ${projectData.legalDisputesCount}
- Coordination Issues: ${projectData.coordinationIssues}
- Historical District Delay Rate: ${projectData.historicalDistrictDelayRate}
- Stakeholder Responsiveness (1-10): ${projectData.stakeholderResponsiveness}

Provide a structured JSON output.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskScore: { type: Type.INTEGER, description: "Risk score between 0 and 100" },
              riskLevel: { type: Type.STRING, description: "CRITICAL, HIGH, MED-HIGH, MEDIUM, or LOW" },
              probabilityOfDelay: { type: Type.STRING, description: "e.g. '85%'" },
              delayPredictionText: { type: Type.STRING, description: "e.g. '+120 days delay predicted' or 'On Schedule'" },
              likelihoodPercent: { type: Type.NUMBER, description: "Likelihood percentage e.g. 85.4" },
              shapFactors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    driver: { type: Type.STRING },
                    vector: { type: Type.STRING, description: "'up' or 'down'" },
                    impact: { type: Type.NUMBER }
                  },
                  required: ["driver", "vector", "impact"]
                }
              },
              directives: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    completed: { type: Type.BOOLEAN }
                  },
                  required: ["id", "title", "description", "completed"]
                }
              },
              riskPredictionBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    factor: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    level: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["factor", "score", "level", "description"]
                }
              }
            },
            required: ["riskScore", "riskLevel", "probabilityOfDelay", "delayPredictionText", "likelihoodPercent", "shapFactors", "directives", "riskPredictionBreakdown"]
          }
        }
      });

      const resultText = response.text || "{}";
      const resultJson = JSON.parse(resultText);
      return res.json(resultJson);
    } catch (err: any) {
      console.error("Error calling Gemini API:", err);
      return res.status(500).json({ error: "Failed to run risk forecast model", details: err.message });
    }
  });

  // AI Executive Report Generation Endpoint
  app.post("/api/generate-report", async (req, res) => {
    try {
      const { projectId, projectData } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          reportMarkdown: `# OFFICIAL ADM LAND ACQUISITION & DISPUTE ASSESSMENT
**GOVERNMENT REGISTRY REF**: ${projectId || 'REG-2024-X'}
**DATE**: ${new Date().toISOString().split('T')[0]}
**PREPARED BY**: ADM MAGISTRATE RISK ENGINE V2.04

---

## 1. EXECUTIVE SUMMARY
Project **${projectData?.title || 'Selected Project'}** located in **${projectData?.district || 'District'}, ${projectData?.state || 'State'}** encompasses **${projectData?.hectares || 100} hectares** affecting **${projectData?.affectedFamilies || 50} families**. Current risk evaluation stands at **${projectData?.riskScore || 75}/100 (${projectData?.riskLevel || 'HIGH'})**.

## 2. LEGAL & CADASTRAL RISK ANALYSIS
- **Primary Bottleneck**: Unresolved Multi-heir Title Claims & High Court writ petitions.
- **Acquisition Stage**: ${projectData?.acquisitionStage || 'Preliminary Survey'}.
- **Delay Expectation**: ${projectData?.delayPredictionText || '+90 days predicted'}.

## 3. MANDATORY ADMINISTRATIVE DIRECTIVES
1. Issue Section 21 Special Hearing Notices to all registered title claimants.
2. Form Gram Sabha Consensus Task Force to review compensation multipliers.
3. Validate Cadastral Maps using High-Definition Drone Surveying.

---
*Certified for Official Government Record under ADM Registry Protocol 2024.*`
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Generate a comprehensive, formal Indian Government ADM Land Acquisition & Dispute Assessment Executive Report in Markdown format for the project below:
Project ID: ${projectId}
Details: ${JSON.stringify(projectData, null, 2)}

Include sections:
1. EXECUTIVE SUMMARY & CADASTRAL SCOPE
2. LEGAL DISPUTE & JUDICIAL STAY PROJECTION
3. COMPENSATION & REHABILITATION PROGRESS
4. SHAP RISK DRIVER ANALYSIS
5. BINDING ADMINISTRATIVE DIRECTIVES FOR DISTRICT MAGISTRATE

Make it authoritative, formal, and precise.`,
      });

      return res.json({ reportMarkdown: response.text });
    } catch (err: any) {
      console.error("Report generation error:", err);
      return res.status(500).json({ error: "Report generation failed", details: err.message });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
