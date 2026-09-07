import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { CANONICAL_TREATISES, CURIOSITY_FACTS, CURATED_RAG_RESPONSES, TRIVIA_LIST } from "./src/data/ayurvedaData";
import { RagResponse } from "./src/types";
import {
  isValidEmail,
  generateOtp,
  getUserByEmail,
  saveUser,
  setOtp,
  getOtp,
  removeOtp,
  sendOtpEmail,
  UserRecord
} from "./server/auth";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

  // Authentication Endpoints
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { email, purpose = "register", fullName } = req.body;

      if (!email || !isValidEmail(email)) {
        res.status(400).json({
          success: false,
          error: "Please provide a valid email address (e.g., yourname@domain.com)."
        });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = getUserByEmail(normalizedEmail);

      if (purpose === "register" && existingUser) {
        res.status(400).json({
          success: false,
          error: "An account with this email address already exists. Please switch to Login."
        });
        return;
      }

      if (purpose === "login" && !existingUser) {
        res.status(404).json({
          success: false,
          error: "No registered account found with this email. Please register first."
        });
        return;
      }

      const otp = generateOtp();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      setOtp(normalizedEmail, {
        otp,
        expiresAt,
        fullName,
        purpose
      });

      const emailResult = await sendOtpEmail(normalizedEmail, otp, fullName, purpose);

      res.json({
        success: true,
        realEmailSent: emailResult.realEmailSent,
        devOtp: emailResult.devOtp,
        message: emailResult.message
      });
    } catch (err: any) {
      console.error("[AUTH ERROR] send-otp:", err);
      res.status(500).json({
        success: false,
        error: "Failed to dispatch verification code. Please try again."
      });
    }
  });

  app.post("/api/auth/verify-otp-and-register", (req, res) => {
    try {
      const { email, otp, fullName, password } = req.body;

      if (!email || !isValidEmail(email)) {
        res.status(400).json({ success: false, error: "Valid email address is required." });
        return;
      }

      if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
        res.status(400).json({ success: false, error: "Please enter a valid 6-digit verification code." });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const storedOtp = getOtp(normalizedEmail);

      if (!storedOtp) {
        res.status(400).json({
          success: false,
          error: "Verification code expired or not found. Please request a new code."
        });
        return;
      }

      if (Date.now() > storedOtp.expiresAt) {
        removeOtp(normalizedEmail);
        res.status(400).json({
          success: false,
          error: "Verification code has expired. Please request a new code."
        });
        return;
      }

      if (storedOtp.otp !== otp.trim()) {
        res.status(400).json({
          success: false,
          error: "Incorrect verification code. Please check and re-enter."
        });
        return;
      }

      if (getUserByEmail(normalizedEmail)) {
        removeOtp(normalizedEmail);
        res.status(400).json({
          success: false,
          error: "This email is already registered. Please log in."
        });
        return;
      }

      // Create new verified user
      const newUser: UserRecord = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        email: normalizedEmail,
        fullName: fullName && fullName.trim() ? fullName.trim() : "Ayurvedic Seeker",
        passwordHash: password && password.trim() ? password.trim() : "otp-verified",
        verified: true,
        createdAt: new Date().toISOString()
      };

      saveUser(newUser);
      removeOtp(normalizedEmail);

      const token = `ipsakti-auth-${newUser.id}-${Date.now()}`;

      res.json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          verified: newUser.verified,
          createdAt: newUser.createdAt
        },
        token,
        message: "Email verified successfully! Welcome to IP-SAKTI Sahayak."
      });
    } catch (err: any) {
      console.error("[AUTH ERROR] verify-otp-and-register:", err);
      res.status(500).json({
        success: false,
        error: "An unexpected error occurred during registration."
      });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !isValidEmail(email)) {
        res.status(400).json({ success: false, error: "Valid email address is required." });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = getUserByEmail(normalizedEmail);

      if (!user) {
        res.status(401).json({
          success: false,
          error: "No account found with this email. Please register first."
        });
        return;
      }

      // Verify password
      if (user.passwordHash && password && user.passwordHash !== password) {
        res.status(401).json({
          success: false,
          error: "Incorrect password. Please try again or log in with OTP."
        });
        return;
      }

      const token = `ipsakti-auth-${user.id}-${Date.now()}`;

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          verified: user.verified,
          createdAt: user.createdAt
        },
        token,
        message: `Welcome back, ${user.fullName}!`
      });
    } catch (err: any) {
      console.error("[AUTH ERROR] login:", err);
      res.status(500).json({
        success: false,
        error: "An unexpected error occurred during login."
      });
    }
  });

  app.post("/api/auth/verify-otp-and-login", (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !isValidEmail(email)) {
        res.status(400).json({ success: false, error: "Valid email address is required." });
        return;
      }

      if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
        res.status(400).json({ success: false, error: "Please enter a valid 6-digit verification code." });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const storedOtp = getOtp(normalizedEmail);

      if (!storedOtp) {
        res.status(400).json({
          success: false,
          error: "Verification code expired or not found. Please request a new code."
        });
        return;
      }

      if (Date.now() > storedOtp.expiresAt) {
        removeOtp(normalizedEmail);
        res.status(400).json({
          success: false,
          error: "Verification code has expired. Please request a new code."
        });
        return;
      }

      if (storedOtp.otp !== otp.trim()) {
        res.status(400).json({
          success: false,
          error: "Incorrect verification code. Please check and re-enter."
        });
        return;
      }

      let user = getUserByEmail(normalizedEmail);
      if (!user) {
        // Auto-register if not present
        user = {
          id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          email: normalizedEmail,
          fullName: storedOtp.fullName || "Ayurvedic Seeker",
          passwordHash: "otp-verified",
          verified: true,
          createdAt: new Date().toISOString()
        };
        saveUser(user);
      }

      removeOtp(normalizedEmail);
      const token = `ipsakti-auth-${user.id}-${Date.now()}`;

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          verified: user.verified,
          createdAt: user.createdAt
        },
        token,
        message: `Welcome back, ${user.fullName}!`
      });
    } catch (err: any) {
      console.error("[AUTH ERROR] verify-otp-and-login:", err);
      res.status(500).json({
        success: false,
        error: "An unexpected error occurred during OTP login."
      });
    }
  });

  app.get("/api/samhitas", (_req, res) => {
    res.json(CANONICAL_TREATISES);
  });

  app.get("/api/trivia", (_req, res) => {
    res.json({
      trivia: TRIVIA_LIST,
      curiosityFacts: CURIOSITY_FACTS
    });
  });

  app.post("/api/rag", async (req, res) => {
    const { query, language = "en", treatiseFilter = "All", doshaFilter = "All" } = req.body;

    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    const ai = getGenAI();

    // Check if we can execute a live Gemini API call
    if (ai) {
      try {
        const langInstruction = language === 'hi' 
          ? 'Respond predominantly in fluent scholarly Hindi (Devanagari), keeping Sanskrit shlokas in authentic Devanagari script.'
          : language === 'sa'
          ? 'Respond in clear scholarly Sanskrit (Samskritam), keeping authentic classical prose style.'
          : 'Respond in scholarly, accessible English with Sanskrit terms accompanied by transliteration and translation.';

        const prompt = `You are IP-SAKTI Sahayak, an authoritative classical Ayurvedic RAG AI indexing the Brihat Trayi (Charaka Saṁhitā, Suśruta Saṁhitā, and Aṣṭāṅga Hṛdayam) along with classical Nighantus.
User Query: "${query}"
Context Filters: Treatise = ${treatiseFilter}, Target Dosha Focus = ${doshaFilter}
Language: ${langInstruction}

Provide a comprehensive, canonically grounded response following this exact JSON schema:
- title: string (descriptive title of the therapeutic protocol or principle)
- summary: string (2-3 sentences of clear clinical doctrine)
- treatiseReference: string (e.g. "Charaka Saṁhitā, Cikitsāsthāna Ch. 24, Verses 32-35")
- shlokas: array of objects with:
  - sanskrit: authentic Sanskrit verse in Devanagari script
  - transliteration: IAST Roman transliteration with diacritics
  - translation: accurate verse translation
  - source: exact chapter and verse
- doshicImpact: object with:
  - vata: "Pacifies" | "Aggravates" | "Neutral"
  - pitta: "Pacifies" | "Aggravates" | "Neutral"
  - kapha: "Pacifies" | "Aggravates" | "Neutral"
  - explanation: concise reason based on gunas and virya
- dravyaguna: object with:
  - rasa: array of strings (e.g. ["Tikta (Bitter)", "Madhura (Sweet)"])
  - guna: array of strings (e.g. ["Laghu (Light)", "Snigdha (Unctuous)"])
  - virya: string (e.g. "Shita (Cooling)" or "Ushna (Heating)")
  - vipaka: string (e.g. "Madhura" or "Katu")
  - prabhava: string (special medicinal action, e.g. "Medhya" or "Hridya")
- formulations: array of objects with:
  - name: classical formulation name (e.g. "Tikta Ghrita", "Shadanga Paniya")
  - ingredients: primary botanicals/minerals
  - indications: therapeutic targets
  - dosage: safe classical anupana and intake guidance
- lifestyleRegimen: array of 3-4 daily (Dinacharya) or seasonal (Ritucharya) guidelines
- modernScience: object with:
  - phytochemicals: bioactive molecules (e.g. "Withanolides, Curcuminoids, Piperine")
  - mechanism: cellular or physiological pathway (e.g. "GABA modulation, cytokine inhibition")
  - clinicalEvidence: 1-2 sentences summarizing clinical findings
- precautions: contraindications, safety caveats, and medical disclaimer
- suggestedQueries: array of 3 thoughtful follow-up questions
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                treatiseReference: { type: Type.STRING },
                shlokas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      sanskrit: { type: Type.STRING },
                      transliteration: { type: Type.STRING },
                      translation: { type: Type.STRING },
                      source: { type: Type.STRING },
                    },
                    required: ["sanskrit", "transliteration", "translation", "source"],
                  },
                },
                doshicImpact: {
                  type: Type.OBJECT,
                  properties: {
                    vata: { type: Type.STRING },
                    pitta: { type: Type.STRING },
                    kapha: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ["vata", "pitta", "kapha", "explanation"],
                },
                dravyaguna: {
                  type: Type.OBJECT,
                  properties: {
                    rasa: { type: Type.ARRAY, items: { type: Type.STRING } },
                    guna: { type: Type.ARRAY, items: { type: Type.STRING } },
                    virya: { type: Type.STRING },
                    vipaka: { type: Type.STRING },
                    prabhava: { type: Type.STRING },
                  },
                  required: ["rasa", "guna", "virya", "vipaka", "prabhava"],
                },
                formulations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      ingredients: { type: Type.STRING },
                      indications: { type: Type.STRING },
                      dosage: { type: Type.STRING },
                    },
                    required: ["name", "ingredients", "indications", "dosage"],
                  },
                },
                lifestyleRegimen: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                modernScience: {
                  type: Type.OBJECT,
                  properties: {
                    phytochemicals: { type: Type.STRING },
                    mechanism: { type: Type.STRING },
                    clinicalEvidence: { type: Type.STRING },
                  },
                  required: ["phytochemicals", "mechanism", "clinicalEvidence"],
                },
                precautions: { type: Type.STRING },
                suggestedQueries: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                "title",
                "summary",
                "treatiseReference",
                "shlokas",
                "doshicImpact",
                "dravyaguna",
                "formulations",
                "lifestyleRegimen",
                "modernScience",
                "precautions",
                "suggestedQueries",
              ],
            },
          },
        });

        const rawText = response.text;
        if (rawText) {
          const parsed = JSON.parse(rawText.trim());
          const fullResponse: RagResponse = {
            ...parsed,
            query,
            timestamp: new Date().toISOString(),
            isAiGenerated: true,
          };
          res.json(fullResponse);
          return;
        }
      } catch (geminiError) {
        console.error("Gemini API generation error, utilizing canonical synthesis:", geminiError);
      }
    }

    // Fallback: Synthesize rich canonical answer from Brihat Trayi knowledge base
    const lower = query.toLowerCase();
    let matched: RagResponse;

    if (lower.includes("ashwagandha") || lower.includes("stress") || lower.includes("sleep") || lower.includes("vitality")) {
      matched = { ...CURATED_RAG_RESPONSES.ashwagandha, query };
    } else if (lower.includes("rhinoplast") || lower.includes("surgery") || lower.includes("sushruta") || lower.includes("skin graft")) {
      matched = {
        query,
        title: "Forehead Flap Rhinoplasty & Shalya Tantra Reconstructive Principles",
        summary: "Acharya Sushruta described nasal reconstruction (Nasasandhana) in Sutrasthana chapter 16. The living vascular pedicle flap from the forehead or adjacent cheek was rotated and positioned over hollow reed stents, securing viability with ant-head natural micro-stapling.",
        treatiseReference: "Suśruta Saṁhitā, Sūtrasthāna Ch. 16 (Karṇavyadhana-bandha-vidhi)",
        shlokas: [
          {
            sanskrit: "नासासंधानविधिना च्छिन्नं नासां प्रसाधयेत् । कपोलफलकादाच्छिद्य सजीवं मांसखण्डकम् ॥",
            transliteration: "nāsāsaṁdhānavidhinā cchinnaṁ nāsāṁ prasādhayet | kapolaphalakādācchidya sajīvaṁ māṁsakhaṇḍakam ||",
            translation: "Repair the amputated nose by plastic reconstruction: dissecting a living tissue flap with active vascularity and molding it accurately.",
            source: "Suśruta Saṁhitā, Sūtrasthāna 16/27"
          }
        ],
        doshicImpact: {
          vata: "Pacifies",
          pitta: "Neutral",
          kapha: "Neutral",
          explanation: "Post-surgical healing requires pacifying Vata to avoid acute spasm and nerve disruption, while avoiding Rakta-Pitta suppuration."
        },
        dravyaguna: {
          rasa: ["Kashaya (Astringent)", "Tikta (Bitter)"],
          guna: ["Ruksha (Drying)", "Ropana (Wound healing)"],
          virya: "Shita (Cooling / Anti-inflammatory)",
          vipaka: "Katu",
          prabhava: "Vrana Ropana (Rapid tissue cicatrization)"
        },
        formulations: [
          {
            name: "Jatyadi Ghrita & Taila",
            ingredients: "Jati, Nimba, Patola, Karanja, and Yashtimadhu in cow's ghee",
            indications: "Surgical wound debridement, rapid epithelialization",
            dosage: "Sterile topical application twice daily"
          }
        ],
        lifestyleRegimen: [
          "Immobilization with twin hollow castor-oil or reed stalks to preserve airway patency.",
          "Application of fine red sandalwood (Rakta Chandana) and Lodhra cooling paste.",
          "Abstain from sneezing, vigorous mastication, and unwholesome fermented foods during graft incorporation."
        ],
        modernScience: {
          phytochemicals: "Flavonoids, Glycyrrhizin, Azadirachtin, and Triterpenoids",
          mechanism: "Stimulates fibroblast migration, promotes angiogenesis in the pedicle base, and exerts broad-spectrum antimicrobial protection.",
          clinicalEvidence: "The British journal Gentleman's Magazine published this exact Indian rhinoplasty in October 1794, leading directly to modern plastic surgery."
        },
        precautions: "Maintain strict sterile debridement; do not compress the flap pedicle to avoid venous thrombosis.",
        suggestedQueries: [
          "What surgical instruments were invented by Sushruta?",
          "How did ancient surgeons use ant mandibles as dissolvable sutures?",
          "What is Agnikarma (thermal cautery) in Sushruta Samhita?"
        ]
      };
    } else {
      // Default to Pitta Shamana & Body Heat Protocol
      matched = { ...CURATED_RAG_RESPONSES.pitta, query };
    }

    res.json({
      ...matched,
      timestamp: new Date().toISOString(),
      isAiGenerated: false
    });
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
