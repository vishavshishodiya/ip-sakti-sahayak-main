export type AppLanguage = 'en' | 'hi';

export interface ShlokaVerse {
  sanskrit: string;
  transliteration: string;
  translation: string;
  source: string;
}

export interface DoshicImpact {
  vata: 'Pacifies' | 'Aggravates' | 'Neutral' | string;
  pitta: 'Pacifies' | 'Aggravates' | 'Neutral' | string;
  kapha: 'Pacifies' | 'Aggravates' | 'Neutral' | string;
  explanation: string;
}

export interface DravyagunaProperties {
  rasa: string[];
  guna: string[];
  virya: string;
  vipaka: string;
  prabhava: string;
}

export interface AyurvedicFormulation {
  name: string;
  ingredients: string;
  indications: string;
  dosage: string;
}

export interface ModernScientificCorrelation {
  phytochemicals: string;
  mechanism: string;
  clinicalEvidence: string;
}

export interface RagResponse {
  query: string;
  title: string;
  summary: string;
  treatiseReference: string;
  shlokas: ShlokaVerse[];
  doshicImpact: DoshicImpact;
  dravyaguna: DravyagunaProperties;
  formulations: AyurvedicFormulation[];
  lifestyleRegimen: string[];
  modernScience: ModernScientificCorrelation;
  precautions: string;
  suggestedQueries: string[];
  timestamp?: string;
  isAiGenerated?: boolean;
}

export interface SamhitaChapter {
  id: string;
  chapterNumber: number;
  title: string;
  sanskritTitle: string;
  summary: string;
  keyShloka: {
    sanskrit: string;
    transliteration: string;
    english: string;
  };
  clinicalRelevance: string;
}

export interface SamhitaSthana {
  id: string;
  name: string;
  sanskritName: string;
  description: string;
  totalChapters: number;
  chapters: SamhitaChapter[];
}

export interface SamhitaTreatise {
  id: string;
  title: string;
  sanskritTitle: string;
  author: string;
  period: string;
  scope: string;
  sthanas: SamhitaSthana[];
}

export interface CuriosityFact {
  id: string;
  category: 'surgery' | 'circadian' | 'alchemy' | 'microbiome';
  categoryLabel: string;
  chronology: string;
  title: string;
  description: string;
  shlokaSource: string;
  shlokaSanskrit: string;
  shlokaTranslation: string;
  ragPrompt: string;
  shareSnippet: string;
  image?: string;
}

export interface TriviaItem {
  id: number;
  text: string;
  source: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  verified: boolean;
  role?: string;
  avatar?: string;
  token?: string;
  createdAt?: string;
}
