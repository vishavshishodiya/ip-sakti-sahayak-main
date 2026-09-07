import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  Bookmark,
  Share2,
  Printer,
  Copy,
  CheckCircle2,
  AlertCircle,
  Volume2,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Wind,
  Flame,
  Droplets,
  RefreshCw,
  Bot,
  X
} from 'lucide-react';
import { RagResponse, AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface RagStudioViewProps {
  currentResponse: RagResponse | null;
  isLoading: boolean;
  onSearch: (query: string, treatise?: string, dosha?: string) => void;
  onBookmarkShloka: (shloka: { sanskrit: string; translation: string; source: string }) => void;
  showToast: (msg: string) => void;
  userPrakriti?: string;
  language: AppLanguage;
}

export const RagStudioView: React.FC<RagStudioViewProps> = ({
  currentResponse,
  isLoading,
  onSearch,
  onBookmarkShloka,
  showToast,
  userPrakriti,
  language
}) => {
  const t = TRANSLATIONS[language].rag;
  const [searchInput, setSearchInput] = useState<string>('');
  const [treatiseFilter, setTreatiseFilter] = useState<string>('All');
  const [doshaFilter, setDoshaFilter] = useState<string>('All');
  const [isPlayingShlokaIndex, setIsPlayingShlokaIndex] = useState<number | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim(), treatiseFilter, doshaFilter);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setSearchInput(prompt);
    onSearch(prompt, treatiseFilter, doshaFilter);
  };

  const handlePlayAudio = (text: string, index: number) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.82;
      utterance.pitch = 0.95;
      setIsPlayingShlokaIndex(index);
      utterance.onend = () => setIsPlayingShlokaIndex(null);
      utterance.onerror = () => setIsPlayingShlokaIndex(null);
      window.speechSynthesis.speak(utterance);
      showToast(language === 'hi' ? 'संस्कृत मूल श्लोक पाठ प्रारंभ...' : 'Reciting classical verse...');
    } else {
      showToast(language === 'hi' ? 'श्लोक वाचन पूर्ण।' : 'Audio recitation completed.');
    }
  };

  const handleCopyConsultation = () => {
    if (!currentResponse) return;
    const text = `IP-SAKTI Sahayak Consultation Sheet:
Query: ${currentResponse.query || ''}
Title: ${currentResponse.title || ''}
Treatise Reference: ${currentResponse.treatiseReference || ''}

Summary:
${currentResponse.summary || ''}

Shloka:
${(currentResponse.shlokas || []).map((s) => `${s.sanskrit}\n(${s.translation})`).join('\n\n')}

Doshic Impact:
Vata: ${currentResponse.doshicImpact?.vata || ''} | Pitta: ${currentResponse.doshicImpact?.pitta || ''} | Kapha: ${currentResponse.doshicImpact?.kapha || ''}
${currentResponse.doshicImpact?.explanation || ''}

Dravyaguna:
Rasa: ${(currentResponse.dravyaguna?.rasa || []).join(', ')}
Virya: ${currentResponse.dravyaguna?.virya || ''} | Vipaka: ${currentResponse.dravyaguna?.vipaka || ''} | Prabhava: ${currentResponse.dravyaguna?.prabhava || ''}

Formulations:
${(currentResponse.formulations || []).map((f) => `- ${f.name}: ${f.ingredients} (Dosage: ${f.dosage})`).join('\n')}

Modern Science:
${currentResponse.modernScience?.mechanism || ''} (${currentResponse.modernScience?.clinicalEvidence || ''})

Precautions:
${currentResponse.precautions || ''}
`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(language === 'hi' ? 'परामर्श पत्र क्लिपबोर्ड में कॉपी हो गया!' : 'Consultation sheet copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getDoshaImpactLabel = (val: string) => {
    if (val === 'Pacifies') return t.pacifies;
    if (val === 'Aggravates') return t.aggravates;
    if (val === 'Neutral') return t.neutral;
    return val;
  };

  return (
    <div className="flex flex-col w-full py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 text-xs text-[#845400] font-bold uppercase tracking-wider">
            <Bot className="w-4 h-4 text-[#ffb958]" />
            <span>{language === 'hi' ? 'न्यूरल RAG स्टूडियो • प्रामाणिक ज्ञान भंडार' : 'Neural RAG Studio • Canonical Ingestion'}</span>
          </div>
          {userPrakriti && (
            <span className="text-xs bg-[#c2ecd4] text-[#002114] px-3 py-1 rounded-full font-bold">
              {language === 'hi' ? `सक्रिय उपयोगकर्ता प्रकृति: ${userPrakriti}` : `Active User Prakriti: ${userPrakriti}`}
            </span>
          )}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#042e1e] font-semibold">
          {t.headerTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#414844] max-w-3xl leading-relaxed">
          {t.headerDesc}
        </p>
      </div>

      {/* Query Search Card & Context Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#c1c8c2]/30 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-[#845400]" />
            <input
              type="text"
              className="w-full pl-11 pr-12 py-3.5 bg-[#f5fbf6] text-[#171d1a] rounded-xl border border-[#c1c8c2]/40 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#845400] text-sm sm:text-base font-medium placeholder:text-[#717973]"
              placeholder={t.searchPlaceholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-3.5 text-[#717973] hover:text-[#171d1a] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#414844]">{t.canonicalFilterLabel}</span>
                <select
                  value={treatiseFilter}
                  onChange={(e) => setTreatiseFilter(e.target.value)}
                  className="bg-[#eff5f0] border border-[#c1c8c2]/40 rounded-lg px-2.5 py-1.5 font-semibold text-[#042e1e] focus:outline-none"
                >
                  <option value="All">{t.allTreatises}</option>
                  <option value="Charaka Samhita">Charaka Saṁhitā</option>
                  <option value="Sushruta Samhita">Suśruta Saṁhitā</option>
                  <option value="Ashtanga Hridaya">Aṣṭāṅga Hṛdayam</option>
                  <option value="Nighantu">Bhāvaprakāśa Nighaṇṭu</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#414844]">{t.targetDoshaLabel}</span>
                <select
                  value={doshaFilter}
                  onChange={(e) => setDoshaFilter(e.target.value)}
                  className="bg-[#eff5f0] border border-[#c1c8c2]/40 rounded-lg px-2.5 py-1.5 font-semibold text-[#042e1e] focus:outline-none"
                >
                  <option value="All">{t.allDoshas}</option>
                  <option value="Vata">Vāta Focus</option>
                  <option value="Pitta">Pitta Focus</option>
                  <option value="Kapha">Kapha Focus</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="px-6 py-2.5 bg-[#845400] hover:bg-[#744900] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.scanningCanon}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.executeRagQuery}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Curated Prompt Chips */}
        <div className="mt-5 pt-4 border-t border-[#e4eae5]">
          <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider block mb-2">
            {t.suggestedPromptsLabel}
          </span>
          <div className="flex flex-wrap gap-2">
            {(t.suggestedPrompts || t.quickPrompts || []).map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(p)}
                className="text-left text-xs bg-[#eff5f0] hover:bg-[#e4eae5] text-[#042e1e] px-3 py-1.5 rounded-lg border border-[#c1c8c2]/30 transition-all hover:border-[#845400]/40"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State Skeleton */}
      {isLoading && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#c1c8c2]/30 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#ffddb6] border-t-[#845400] animate-spin"></div>
            <Bot className="w-8 h-8 text-[#042e1e] absolute inset-0 m-auto" />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <span className="font-serif text-xl font-semibold text-[#042e1e]">
              {t.interrogatingEmbeddings}
            </span>
            <p className="text-xs text-[#414844] animate-pulse">
              {t.crossReferencingText}
            </p>
          </div>
        </div>
      )}

      {/* RAG Response Card */}
      {!isLoading && currentResponse && (
        <div className="flex flex-col gap-6" id="consultation-result">
          {/* Header Bar of Result */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#c1c8c2]/30 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#e4eae5]">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#042e1e] bg-[#c2ecd4] px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#042e1e]" />
                    <span>{t.groundedTag}</span>
                  </span>
                  {currentResponse.isAiGenerated && (
                    <span className="text-[11px] font-semibold text-[#845400] bg-[#ffddb6] px-2.5 py-0.5 rounded-full">
                      Gemini Grounded Synthesis
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#042e1e] font-semibold mt-1">
                  {currentResponse.title}
                </h2>
                <span className="text-xs font-bold text-[#845400] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t.canonicalCitation}: {currentResponse.treatiseReference}</span>
                </span>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyConsultation}
                  className="p-2 text-[#414844] hover:text-[#042e1e] hover:bg-[#eff5f0] rounded-xl transition-colors border border-[#c1c8c2]/30 flex items-center gap-1.5 text-xs font-bold"
                  title="Copy Full Consultation Sheet"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.copyBtn}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 text-[#414844] hover:text-[#042e1e] hover:bg-[#eff5f0] rounded-xl transition-colors border border-[#c1c8c2]/30 flex items-center gap-1.5 text-xs font-bold"
                  title="Print / Save as PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.printBtn}</span>
                </button>
              </div>
            </div>

            {/* Clinical Overview Summary */}
            <div className="p-4 rounded-xl bg-[#eff5f0] border border-[#c1c8c2]/30">
              <span className="text-xs uppercase font-bold text-[#845400] tracking-wider block mb-1">
                {t.clinicalSynthesis}
              </span>
              <p className="text-sm text-[#171d1a] leading-relaxed">
                {currentResponse.summary}
              </p>
            </div>

            {/* Sanskrit Shlokas Block */}
            {(currentResponse.shlokas || []).map((shloka, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-[#eff5f0] via-[#f5fbf6] to-[#eff5f0] p-6 rounded-2xl border border-[#c1c8c2]/40 relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#845400] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#ffb958]" />
                    <span>
                      {language === 'hi'
                        ? `प्रामाणिक मूल श्लोक #${idx + 1} (${shloka.source})`
                        : `Classical Mūla Verse #${idx + 1} (${shloka.source})`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlayAudio(shloka.sanskrit, idx)}
                      className="p-1.5 text-[#845400] hover:text-[#042e1e] hover:bg-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                      title="Recite Sanskrit Shloka"
                    >
                      <Volume2
                        className={`w-4 h-4 ${
                          isPlayingShlokaIndex === idx ? 'animate-bounce text-[#042e1e]' : ''
                        }`}
                      />
                      <span>{t.chant}</span>
                    </button>
                    <button
                      onClick={() =>
                        onBookmarkShloka({
                          sanskrit: shloka.sanskrit,
                          translation: shloka.translation,
                          source: `${currentResponse.treatiseReference} - ${shloka.source}`
                        })
                      }
                      className="p-1.5 text-[#414844] hover:text-[#845400] hover:bg-white rounded-lg transition-colors"
                      title="Save Shloka to Bookmarks"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-white/95 p-5 rounded-xl border border-[#c1c8c2]/30 shadow-sm text-center my-2">
                  <p className="font-serif text-lg sm:text-xl text-[#042e1e] font-semibold leading-relaxed tracking-wide">
                    {shloka.sanskrit}
                  </p>
                </div>

                <div className="text-center text-xs font-mono text-[#845400] italic my-2">
                  {shloka.transliteration}
                </div>

                <div className="pt-2 border-t border-[#c1c8c2]/30 text-xs sm:text-sm text-[#171d1a] leading-relaxed">
                  <strong className="text-[#845400]">
                    {language === 'hi' ? 'प्रामाणिक अर्थ: ' : 'Translation: '}
                  </strong>
                  "{shloka.translation}"
                </div>
              </div>
            ))}

            {/* Doshic Impact Radar / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Vata */}
              <div className="bg-[#eff5f0] p-4 rounded-xl border border-[#c1c8c2]/30 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#042e1e]">
                    <Wind className="w-4 h-4 text-[#845400]" />
                    <span>{t.vataTitle}</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      currentResponse.doshicImpact.vata === 'Pacifies'
                        ? 'bg-[#c2ecd4] text-[#002114]'
                        : currentResponse.doshicImpact.vata === 'Aggravates'
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : 'bg-[#e4eae5] text-[#414844]'
                    }`}
                  >
                    {getDoshaImpactLabel(currentResponse.doshicImpact.vata)}
                  </span>
                </div>
              </div>

              {/* Pitta */}
              <div className="bg-[#eff5f0] p-4 rounded-xl border border-[#c1c8c2]/30 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#042e1e]">
                    <Flame className="w-4 h-4 text-[#845400]" />
                    <span>{t.pittaTitle}</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      currentResponse.doshicImpact.pitta === 'Pacifies'
                        ? 'bg-[#c2ecd4] text-[#002114]'
                        : currentResponse.doshicImpact.pitta === 'Aggravates'
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : 'bg-[#e4eae5] text-[#414844]'
                    }`}
                  >
                    {getDoshaImpactLabel(currentResponse.doshicImpact.pitta)}
                  </span>
                </div>
              </div>

              {/* Kapha */}
              <div className="bg-[#eff5f0] p-4 rounded-xl border border-[#c1c8c2]/30 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#042e1e]">
                    <Droplets className="w-4 h-4 text-[#845400]" />
                    <span>{t.kaphaTitle}</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      currentResponse.doshicImpact.kapha === 'Pacifies'
                        ? 'bg-[#c2ecd4] text-[#002114]'
                        : currentResponse.doshicImpact.kapha === 'Aggravates'
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : 'bg-[#e4eae5] text-[#414844]'
                    }`}
                  >
                    {getDoshaImpactLabel(currentResponse.doshicImpact.kapha)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#414844] italic px-1">
              <strong>{t.doshicMechanism} </strong> {currentResponse.doshicImpact.explanation}
            </p>

            {/* Dravyaguna Botanical Properties Matrix */}
            <div className="bg-white p-5 rounded-xl border border-[#c1c8c2]/30 flex flex-col gap-3">
              <span className="text-xs font-bold text-[#042e1e] uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-[#845400]" />
                <span>{t.dravyagunaMatrix}</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="bg-[#eff5f0] p-3 rounded-lg flex flex-col">
                  <span className="text-[10px] text-[#717973] uppercase font-bold">{t.rasa}</span>
                  <span className="font-semibold text-[#042e1e] mt-1">
                    {currentResponse.dravyaguna.rasa.join(', ')}
                  </span>
                </div>
                <div className="bg-[#eff5f0] p-3 rounded-lg flex flex-col">
                  <span className="text-[10px] text-[#717973] uppercase font-bold">{t.guna}</span>
                  <span className="font-semibold text-[#042e1e] mt-1">
                    {currentResponse.dravyaguna.guna.join(', ')}
                  </span>
                </div>
                <div className="bg-[#eff5f0] p-3 rounded-lg flex flex-col">
                  <span className="text-[10px] text-[#717973] uppercase font-bold">{t.virya}</span>
                  <span className="font-semibold text-[#845400] mt-1">
                    {currentResponse.dravyaguna.virya}
                  </span>
                </div>
                <div className="bg-[#eff5f0] p-3 rounded-lg flex flex-col">
                  <span className="text-[10px] text-[#717973] uppercase font-bold">{t.vipaka}</span>
                  <span className="font-semibold text-[#042e1e] mt-1">
                    {currentResponse.dravyaguna.vipaka}
                  </span>
                </div>
                <div className="bg-[#eff5f0] p-3 rounded-lg flex flex-col">
                  <span className="text-[10px] text-[#717973] uppercase font-bold">{t.prabhava}</span>
                  <span className="font-semibold text-[#4f1100] mt-1">
                    {currentResponse.dravyaguna.prabhava}
                  </span>
                </div>
              </div>
            </div>

            {/* Classical Formulations */}
            {currentResponse.formulations && currentResponse.formulations.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-[#042e1e] uppercase tracking-wider">
                  {t.recommendedFormulations}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentResponse.formulations.map((f, idx) => (
                    <div
                      key={idx}
                      className="bg-[#eff5f0] p-4 rounded-xl border border-[#c1c8c2]/30 flex flex-col gap-1.5"
                    >
                      <span className="font-serif text-base font-semibold text-[#042e1e]">
                        {f.name}
                      </span>
                      <p className="text-xs text-[#414844]">
                        <strong>{t.ingredientsLabel} </strong> {f.ingredients}
                      </p>
                      <p className="text-xs text-[#414844]">
                        <strong>{t.indicationsLabel} </strong> {f.indications}
                      </p>
                      <p className="text-xs text-[#845400] font-semibold mt-1">
                        <strong>{t.dosageLabel} </strong> {f.dosage}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lifestyle & Dinacharya Guidelines */}
            {currentResponse.lifestyleRegimen && currentResponse.lifestyleRegimen.length > 0 && (
              <div className="bg-[#eff5f0] p-5 rounded-xl border border-[#c1c8c2]/30 flex flex-col gap-2">
                <span className="text-xs font-bold text-[#042e1e] uppercase tracking-wider">
                  {t.dinacharyaProtocols}
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#414844]">
                  {currentResponse.lifestyleRegimen.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#845400] shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modern Science Concordance */}
            {currentResponse.modernScience && (
              <div className="bg-white p-5 rounded-xl border border-[#c1c8c2]/30 flex flex-col gap-2">
                <span className="text-xs font-bold text-[#042e1e] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#845400]" />
                  <span>{t.modernConcordance}</span>
                </span>
                <p className="text-xs sm:text-sm text-[#414844]">
                  <strong>{t.phytochemicalsLabel} </strong> {currentResponse.modernScience.phytochemicals}
                </p>
                <p className="text-xs sm:text-sm text-[#414844]">
                  <strong>{t.mechanismLabel} </strong> {currentResponse.modernScience.mechanism}
                </p>
                <p className="text-xs text-[#717973] italic">
                  <strong>{t.clinicalEvidenceLabel} </strong> {currentResponse.modernScience.clinicalEvidence}
                </p>
              </div>
            )}

            {/* Precautions */}
            <div className="p-4 rounded-xl bg-[#ffdad6]/40 border border-[#ffdad6] text-xs text-[#93000a] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>{t.precautionTitle} </strong> {currentResponse.precautions}
              </div>
            </div>

            {/* Suggested Follow-up Inquiries */}
            {currentResponse.suggestedQueries && currentResponse.suggestedQueries.length > 0 && (
              <div className="pt-4 border-t border-[#e4eae5] flex flex-col gap-2">
                <span className="text-xs font-bold text-[#414844] uppercase tracking-wider">
                  {t.deepenInquiry}
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentResponse.suggestedQueries.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(q)}
                      className="inline-flex items-center gap-1.5 text-xs bg-[#eff5f0] hover:bg-[#e4eae5] text-[#042e1e] font-semibold px-3 py-1.5 rounded-lg border border-[#c1c8c2]/30 transition-colors"
                    >
                      <span>{q}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#845400]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
