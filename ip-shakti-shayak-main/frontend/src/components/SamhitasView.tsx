import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Bot,
  Volume2,
  Bookmark,
  Share2,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { CANONICAL_TREATISES } from '../data/ayurvedaData';
import { SamhitaChapter, SamhitaSthana, SamhitaTreatise, AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface SamhitasViewProps {
  onSearchQuery: (query: string) => void;
  onBookmarkShloka: (shloka: { sanskrit: string; translation: string; source: string }) => void;
  showToast: (msg: string) => void;
  language: AppLanguage;
}

export const SamhitasView: React.FC<SamhitasViewProps> = ({
  onSearchQuery,
  onBookmarkShloka,
  showToast,
  language
}) => {
  const t = TRANSLATIONS[language].samhitas;
  const [selectedTreatiseId, setSelectedTreatiseId] = useState<string>('charaka');
  const [selectedSthanaId, setSelectedSthanaId] = useState<string>('sutrasthana');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch-1');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const currentTreatise = CANONICAL_TREATISES.find((tr) => tr.id === selectedTreatiseId) || CANONICAL_TREATISES[0];
  const currentSthana = currentTreatise.sthanas.find((s) => s.id === selectedSthanaId) || currentTreatise.sthanas[0];
  const currentChapter = currentSthana.chapters.find((c) => c.id === selectedChapterId) || currentSthana.chapters[0];

  const treatiseMeta = t.treatiseMeta[selectedTreatiseId];
  const currentTreatiseTitle = treatiseMeta?.title || currentTreatise.title;
  const currentTreatiseAuthor = treatiseMeta?.author || currentTreatise.author;
  const currentTreatiseScope = treatiseMeta?.scope || currentTreatise.scope;
  const currentSthanaName = treatiseMeta?.sthanaNames?.[currentSthana.id] || currentSthana.name;

  const handleTreatiseChange = (id: string) => {
    setSelectedTreatiseId(id);
    const newTreatise = CANONICAL_TREATISES.find((tr) => tr.id === id);
    if (newTreatise && newTreatise.sthanas.length > 0) {
      setSelectedSthanaId(newTreatise.sthanas[0].id);
      if (newTreatise.sthanas[0].chapters.length > 0) {
        setSelectedChapterId(newTreatise.sthanas[0].chapters[0].id);
      }
    }
  };

  const handlePlayChant = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const hiVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('sa'));
      if (hiVoice) utterance.voice = hiVoice;

      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      showToast(language === 'hi' ? 'संस्कृत मूल श्लोक पाठ प्रारंभ...' : 'Reciting classical Sanskrit shloka...');
    } else {
      showToast(language === 'hi' ? 'श्लोक वाचन पूर्ण।' : 'Classical audio recitation completed.');
    }
  };

  return (
    <div className="flex flex-col w-full py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="inline-flex items-center gap-2 text-xs text-[#845400] font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>{language === 'hi' ? 'वैदिक ग्रंथागार • बृहत्त्रयी' : 'Vedic Scriptural Archives • Brihat Trayi'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#042e1e] font-semibold">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#414844] max-w-3xl leading-relaxed">
          {t.desc}
        </p>
      </div>

      {/* Treatise Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {CANONICAL_TREATISES.map((treatise) => {
          const isSelected = treatise.id === selectedTreatiseId;
          const meta = t.treatiseMeta[treatise.id];
          const title = meta?.title || treatise.title;
          const author = meta?.author || treatise.author;
          const scope = meta?.scope || treatise.scope;

          return (
            <button
              key={treatise.id}
              onClick={() => handleTreatiseChange(treatise.id)}
              className={`p-5 rounded-2xl text-left transition-all border ${
                isSelected
                  ? 'bg-white border-[#845400] shadow-md ring-2 ring-[#845400]/20'
                  : 'bg-[#eff5f0] border-[#c1c8c2]/30 hover:bg-white hover:border-[#c1c8c2]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif text-xl font-semibold text-[#042e1e]">
                  {title}
                </span>
                <span className="text-xs font-bold text-[#845400] bg-[#ffddb6] px-2 py-0.5 rounded">
                  {treatise.sanskritTitle}
                </span>
              </div>
              <p className="text-xs text-[#845400] font-semibold">{author}</p>
              <p className="text-xs text-[#414844] mt-1.5 line-clamp-2">{scope}</p>
            </button>
          );
        })}
      </div>

      {/* Main Reader Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sthana and Chapter Selector */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-[#c1c8c2]/30 shadow-sm flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4eae5]">
            <span className="text-xs font-bold text-[#042e1e] uppercase tracking-wider">
              {language === 'hi' ? 'स्थान (विभाग) एवं अध्याय' : 'Sections (Sthānas) & Chapters'}
            </span>
            <span className="text-[11px] bg-[#eff5f0] text-[#845400] px-2 py-0.5 rounded font-semibold">
              {currentTreatise.sthanas.length} {language === 'hi' ? 'स्थान' : 'Sthānas'}
            </span>
          </div>

          {/* Sthana Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#414844]">{t.sthanaLabel}</label>
            <div className="flex flex-col gap-1.5">
              {currentTreatise.sthanas.map((sthana) => {
                const isActive = sthana.id === selectedSthanaId;
                const localizedSthanaName = treatiseMeta?.sthanaNames?.[sthana.id] || sthana.name;

                return (
                  <button
                    key={sthana.id}
                    onClick={() => {
                      setSelectedSthanaId(sthana.id);
                      if (sthana.chapters.length > 0) {
                        setSelectedChapterId(sthana.chapters[0].id);
                      }
                    }}
                    className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-[#042e1e] text-white shadow-sm'
                        : 'bg-[#eff5f0] text-[#171d1a] hover:bg-[#e4eae5]'
                    }`}
                  >
                    <span>{localizedSthanaName}</span>
                    <span className="text-[10px] opacity-80">
                      {sthana.totalChapters} {language === 'hi' ? 'अध्याय' : 'Ch.'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chapters List */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#e4eae5]">
            <label className="text-xs font-bold text-[#414844]">{t.chaptersLabel}</label>
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {currentSthana.chapters.map((chapter) => {
                const isSelected = chapter.id === selectedChapterId;
                return (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedChapterId(chapter.id)}
                    className={`text-left p-3 rounded-xl text-xs transition-all border ${
                      isSelected
                        ? 'bg-[#c2ecd4]/50 border-[#a6d0b9] font-bold text-[#002114]'
                        : 'bg-white border-[#c1c8c2]/30 text-[#414844] hover:bg-[#eff5f0]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-[#845400] font-bold uppercase">
                        {language === 'hi' ? `अध्याय ${chapter.chapterNumber}` : `Chapter ${chapter.chapterNumber}`}
                      </span>
                      <span className="text-[10px] text-[#717973]">{chapter.sanskritTitle}</span>
                    </div>
                    <span className="line-clamp-1">{chapter.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Chapter Detail & Classical Shloka View */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#c1c8c2]/30 flex flex-col gap-6">
            {/* Chapter Header */}
            <div className="flex flex-col gap-2 pb-5 border-b border-[#e4eae5]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-[#845400] bg-[#ffddb6] px-3 py-1 rounded-full uppercase">
                  {currentTreatiseTitle} • {currentSthanaName}
                </span>
                <span className="text-xs text-[#717973] font-medium">
                  {language === 'hi' ? 'प्रामाणिक बृहत्त्रयी वाङ्मय' : 'Authoritative Brihat Trayi Canon'}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#042e1e] font-semibold">
                {currentChapter.title}
              </h2>
              <p className="text-xs text-[#845400] font-bold uppercase tracking-wider">
                संस्कृत शीर्षकम्: {currentChapter.sanskritTitle}
              </p>
              <p className="text-xs sm:text-sm text-[#414844] leading-relaxed mt-1">
                {currentChapter.summary}
              </p>
            </div>

            {/* Classical Root Shloka Manuscript Card */}
            <div className="bg-gradient-to-br from-[#eff5f0] via-[#f5fbf6] to-[#eff5f0] p-6 sm:p-7 rounded-2xl border border-[#c1c8c2]/40 relative shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#845400] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#ffb958]" />
                  <span>{t.keyShlokaTitle}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePlayChant(currentChapter.keyShloka.sanskrit)}
                    className="p-2 text-[#845400] hover:text-[#042e1e] hover:bg-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                    title={t.listenShloka}
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-[#042e1e]' : ''}`} />
                    <span>{t.listenShloka}</span>
                  </button>
                  <button
                    onClick={() =>
                      onBookmarkShloka({
                        sanskrit: currentChapter.keyShloka.sanskrit,
                        translation: currentChapter.keyShloka.english,
                        source: `${currentTreatiseTitle}, ${currentSthanaName}, ${language === 'hi' ? 'अध्याय' : 'Ch.'} ${currentChapter.chapterNumber}`
                      })
                    }
                    className="p-2 text-[#414844] hover:text-[#845400] hover:bg-white rounded-lg transition-colors"
                    title={t.bookmarkShloka}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Devanagari Shloka Calligraphy */}
              <div className="bg-white/90 p-5 rounded-xl border border-[#c1c8c2]/30 shadow-sm text-center my-3">
                <p className="font-serif text-lg sm:text-xl text-[#042e1e] font-semibold leading-loose tracking-wide">
                  {currentChapter.keyShloka.sanskrit}
                </p>
              </div>

              {/* IAST Transliteration */}
              <div className="text-center text-xs sm:text-sm font-mono text-[#845400] italic mb-3">
                {currentChapter.keyShloka.transliteration}
              </div>

              {/* English/Hindi Translation */}
              <div className="pt-3 border-t border-[#c1c8c2]/30">
                <span className="text-[11px] font-bold text-[#717973] uppercase tracking-wider block mb-1">
                  {language === 'hi' ? 'प्रामाणिक अर्थ:' : 'Canonical Meaning:'}
                </span>
                <p className="text-xs sm:text-sm text-[#171d1a] leading-relaxed">
                  "{currentChapter.keyShloka.english}"
                </p>
              </div>
            </div>

            {/* Clinical & Pharmacological Relevance */}
            <div className="bg-white p-5 rounded-xl border border-[#c1c8c2]/30 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#042e1e] uppercase tracking-wider">
                <Info className="w-4 h-4 text-[#845400]" />
                <span>{t.clinicalRelevanceTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#414844] leading-relaxed">
                {currentChapter.clinicalRelevance}
              </p>
            </div>

            {/* Direct Ask AI RAG CTA */}
            <div className="pt-4 border-t border-[#e4eae5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#414844]">
                {language === 'hi'
                  ? 'क्या इन श्लोकों अथवा त्रिदोष संतुलन के विषय में कोई प्रश्न है?'
                  : 'Have questions about these verses or doshic correlations?'}
              </span>
              <button
                onClick={() =>
                  onSearchQuery(
                    language === 'hi'
                      ? `${currentTreatiseTitle} में ${currentChapter.title} की नैदानिक द्रव्यगुण व्याख्या करें`
                      : `Explain ${currentChapter.title} in ${currentTreatise.title} with clinical dravyaguna applications`
                  )
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#042e1e] text-white hover:bg-[#1e4433] rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Bot className="w-4 h-4 text-[#ffb958]" />
                <span>{t.askRagAboutChapter}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
