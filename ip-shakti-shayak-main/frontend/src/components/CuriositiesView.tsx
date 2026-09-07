import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Share2,
  BookOpen,
  Bot,
  Search,
  CheckCircle2,
  ExternalLink,
  Flame,
  Award,
  Clock,
  FlaskConical,
  Microscope,
  Brain
} from 'lucide-react';
import { CURIOSITY_FACTS } from '../data/ayurvedaData';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface CuriositiesViewProps {
  onSearchQuery?: (query: string) => void;
  showToast: (msg: string) => void;
  language: AppLanguage;
  initialQuery?: string;
}

export const CuriositiesView: React.FC<CuriositiesViewProps> = ({ onSearchQuery, showToast, language, initialQuery }) => {
  const t = TRANSLATIONS[language].curiosities;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [triviaIndex, setTriviaIndex] = useState<number>(0);
  const [bottomInput, setBottomInput] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>(initialQuery || '');

  const triviaList = t.trivia;
  const currentTrivia = triviaList[triviaIndex % triviaList.length];

  const rotateTrivia = () => {
    setTriviaIndex((prev) => (prev + 1) % triviaList.length);
  };

  const filteredFacts = CURIOSITY_FACTS.filter((fact) => {
    if (activeCategory !== 'all' && fact.category !== activeCategory) return false;
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      fact.title.toLowerCase().includes(term) ||
      fact.description.toLowerCase().includes(term) ||
      fact.shlokaTranslation.toLowerCase().includes(term) ||
      fact.shlokaSource.toLowerCase().includes(term) ||
      fact.categoryLabel.toLowerCase().includes(term)
    );
  });

  const handleShare = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(language === 'hi' ? 'तथ्य क्लिपबोर्ड में कॉपी हो गया!' : 'Fact copied to clipboard!');
    } else {
      showToast(language === 'hi' ? 'तथ्य साझा करने के लिए तैयार!' : 'Fact ready to share!');
    }
  };

  const handleBottomSubmit = (override?: string) => {
    const val = (override !== undefined ? override : bottomInput).trim();
    if (val) {
      setSearchFilter(val);
      setActiveCategory('all');
      showToast(
        language === 'hi'
          ? `"${val}" से संबंधित रोचक तथ्य फ़िल्टर किए गए`
          : `Filtered interesting facts matching "${val}"`
      );
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const filterCategories = [
    { id: 'all', label: t.filterAll },
    { id: 'surgery', label: t.categorySurgery },
    { id: 'circadian', label: t.categoryCircadian },
    { id: 'alchemy', label: t.categoryAlchemy },
    { id: 'microbiome', label: t.categoryMicrobiome }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Subtle Parchment Texture Accent Ribbon */}
      <div className="w-full bg-[#e4eae5] py-2.5 px-4 sm:px-6 lg:px-8 border-b border-[#c1c8c2]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[#414844] text-xs">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#845400]" />
            <span className="font-bold tracking-widest uppercase text-[#845400]">
              {language === 'hi' ? 'वैद्य प्रमाण • वैज्ञानिक प्राचीनता' : 'Vaidya Pramāṇa • Empirical Antiquity'}
            </span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#845400] inline-block"></span>
              {language === 'hi' ? '६ प्रामाणिक संहिताएं अनुक्रमित' : '6 Canonical Treatises Indexed'}
            </span>
            <span className="text-[#c1c8c2]">/</span>
            <span className="text-[#042e1e] font-semibold">
              {language === 'hi' ? 'ईसा पूर्व नैदानिक कालक्रम' : 'Pre-Common Era Clinical Chronology'}
            </span>
          </div>
        </div>
      </div>

      {/* Header Banner Section */}
      <section className="relative w-full bg-white py-14 lg:py-18 overflow-hidden shadow-sm border-b border-[#c1c8c2]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffddb6]/35 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#c2ecd4]/25 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left intro text */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="inline-flex items-center gap-1.5 bg-[#845400]/10 px-3.5 py-1.5 rounded-full w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#845400]" />
                <span className="text-xs text-[#845400] uppercase tracking-widest font-bold">
                  {t.bannerBadge}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h1
                  className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#042e1e] font-semibold tracking-tight"
                  style={{
                    textShadow: 'rgba(180, 83, 9, 0.25) 2px 3px 6px, rgba(30, 68, 51, 0.35) 0px 1px 3px'
                  }}
                >
                  {t.bannerTitle}
                </h1>
                <p className="font-serif text-lg sm:text-xl text-[#845400] italic font-normal">
                  {t.bannerSubtitle}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#414844] max-w-2xl leading-relaxed">
                {t.bannerDesc}
              </p>

              {/* Quick Statistics Strip */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                <div className="bg-[#eff5f0] p-3 rounded-xl flex flex-col border border-[#c1c8c2]/30">
                  <span className="font-serif text-xl sm:text-2xl text-[#042e1e] font-bold">600 BCE</span>
                  <span className="text-[11px] font-semibold text-[#414844] uppercase">{t.stat1Label}</span>
                </div>
                <div className="bg-[#eff5f0] p-3 rounded-xl flex flex-col border border-[#c1c8c2]/30">
                  <span className="font-serif text-xl sm:text-2xl text-[#042e1e] font-bold">&lt;100nm</span>
                  <span className="text-[11px] font-semibold text-[#414844] uppercase">{t.stat2Label}</span>
                </div>
                <div className="bg-[#eff5f0] p-3 rounded-xl flex flex-col border border-[#c1c8c2]/30">
                  <span className="font-serif text-xl sm:text-2xl text-[#042e1e] font-bold">3,000 Yr</span>
                  <span className="text-[11px] font-semibold text-[#414844] uppercase">{t.stat3Label}</span>
                </div>
              </div>
            </div>

            {/* Featured Manuscript Visual Anchor */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md bg-[#e9efea] p-2.5 rounded-2xl shadow-lg border border-[#c1c8c2]/40 group">
                <div className="overflow-hidden rounded-xl relative aspect-[4/3] bg-[#e4eae5]">
                  <img
                    alt="Traditional painting of Ancient Sage Sushruta / Charaka"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfndlkdEcbDUjGGViUdhT86_ctEZZV8C5HsvXu3KNay-vdshgCt4JTdEpsi2dYlfLYI-bfrwcysQtIYa07A7y-N3yO6C52Y4JdIha7tMspKTFvr_Sz0hs1UBPji8Vt7S1piCk9EucQjhgMAsn7ku4AOMmwdPkSWDkO1mfx66PYHq4fdF3hq9xrF6HSXZ5mYWHe_FulJA_qnDE8YP8zxh4S3aUmhG_lKJmQO3RO7kwcGSuacXwBe0Ifoa1ry_0h-lAyoA"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#042e1e]/90 via-[#042e1e]/30 to-transparent flex flex-col justify-end p-5">
                    <span className="text-xs text-[#ffddb6] tracking-wider uppercase font-bold">
                      {t.manuscriptBadge}
                    </span>
                    <p className="font-serif text-lg text-white font-semibold mt-0.5">
                      {t.manuscriptTitle}
                    </p>
                    <p className="text-xs text-[#dee4df] mt-1 line-clamp-2">
                      {t.manuscriptDesc}
                    </p>
                  </div>
                </div>
                {/* Filigree Corner Accent */}
                <div className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-[#845400] text-white flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Did You Know? Spotlight */}
      <section className="w-full bg-[#eff5f0] py-5 border-b border-[#c1c8c2]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#ffb958] text-[#744900] flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#845400] uppercase tracking-wider">
                {t.didYouKnow}
              </span>
              <span className="text-xs text-[#414844]">
                {language === 'hi' ? 'प्राचीन चिकित्सीय रहस्यों को जानने के लिए क्लिक करें' : 'Click to uncover ancient clinical oddities'}
              </span>
            </div>
          </div>

          {/* Flip / Rotate Trivia Pill */}
          <div
            onClick={rotateTrivia}
            className="w-full md:w-auto flex-1 max-w-2xl bg-white p-3.5 rounded-xl shadow-sm border border-[#c1c8c2]/30 flex items-center justify-between gap-3 cursor-pointer transition-all duration-300 hover:shadow-md hover:bg-[#e4eae5]/50 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#c2ecd4] text-[#002114] uppercase font-bold shrink-0">
                {language === 'hi' ? `तथ्य #${(triviaIndex % triviaList.length) + 1}` : `Trivia #${(triviaIndex % triviaList.length) + 1}`}
              </span>
              <p className="text-xs sm:text-sm text-[#171d1a] italic leading-relaxed">
                "{currentTrivia?.text || ''}"
              </p>
            </div>
            <button
              className="p-1.5 text-[#845400] hover:text-[#042e1e] transition-transform group-hover:rotate-180 duration-500 shrink-0"
              title={t.nextFact}
              type="button"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Facts Explorer Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col gap-8">
        {/* Filter Bar & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#e4eae5]">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#845400] uppercase tracking-widest font-bold">
              {language === 'hi' ? 'प्रामाणिक वर्गीकरण' : 'Canonical Classifications'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#042e1e] font-semibold">
              {language === 'hi' ? 'प्राचीन वैज्ञानिक प्रतिभा के ६ स्तंभ खोजें' : 'Discover the 6 Pillars of Ancient Ingenuity'}
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {searchFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ffddb6] text-[#2a1800] border border-[#845400]/30 shadow-sm">
                <span>{language === 'hi' ? 'खोज:' : 'Search:'} {searchFilter}</span>
                <button
                  onClick={() => setSearchFilter('')}
                  className="hover:text-red-700 ml-1 font-bold"
                  title="Clear search"
                  type="button"
                >
                  ✕
                </button>
              </span>
            )}
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                type="button"
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  activeCategory === cat.id && !searchFilter
                    ? 'bg-[#042e1e] text-white shadow-md'
                    : 'bg-[#e4eae5] text-[#414844] hover:bg-[#e9efea] hover:text-[#171d1a]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* The 6 Crazy Facts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacts.map((fact) => {
            const translatedFact = t.facts?.[fact.id];
            const displayTitle = translatedFact ? translatedFact.title : fact.title;
            const displayCategoryLabel = translatedFact ? translatedFact.categoryLabel : fact.categoryLabel;
            const displayDesc = translatedFact ? translatedFact.description : fact.description;
            const displayTranslation = translatedFact ? translatedFact.translation : fact.shlokaTranslation;

            return (
              <article
                key={fact.id}
                className="flex flex-col justify-between bg-white rounded-2xl shadow-sm hover:shadow-md border border-[#c1c8c2]/30 transition-all duration-300 p-6 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#845400] to-[#ffb958]"></div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[11px] bg-[#ffdbd0] text-[#3a0a00] font-bold">
                      {fact.chronology}
                    </span>
                    <span className="text-xs font-semibold text-[#845400] bg-[#eff5f0] px-2 py-0.5 rounded-md">
                      {displayCategoryLabel}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl text-[#042e1e] group-hover:text-[#845400] transition-colors font-semibold">
                    {displayTitle}
                  </h3>

                  {fact.image && (
                    <div className="w-full h-36 rounded-xl overflow-hidden my-1 bg-[#e4eae5] shadow-inner">
                      <img
                        alt={displayTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={fact.image}
                      />
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-[#414844] leading-relaxed">
                    {displayDesc}
                  </p>

                  {/* Classical Sanskrit Evidence Quote */}
                  <div className="bg-[#eff5f0] p-3 rounded-xl flex flex-col gap-1 border border-[#c1c8c2]/25">
                    <div className="flex items-center gap-1.5 text-[#845400] text-xs uppercase font-bold">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{fact.shlokaSource}</span>
                    </div>
                    <p className="font-serif text-xs text-[#042e1e] font-medium italic">
                      "{fact.shlokaSanskrit}"
                    </p>
                    <p className="text-[11px] text-[#414844]">
                      ({displayTranslation})
                    </p>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#e4eae5]">
                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(`${fact.shlokaSanskrit}\n${displayTranslation}\n(${fact.shlokaSource})`);
                        showToast(language === 'hi' ? 'श्लोक क्लिपबोर्ड में कॉपी हो गया!' : 'Classical verse copied to clipboard!');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#042e1e] hover:text-[#845400] transition-colors"
                    type="button"
                  >
                    <BookOpen className="w-4 h-4 text-[#845400]" />
                    <span>{language === 'hi' ? 'श्लोक उद्धरण' : 'Canonical Shloka'}</span>
                  </button>
                  <button
                    onClick={() => handleShare(fact.shareSnippet)}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 text-[#414844] hover:text-[#042e1e] hover:bg-[#eff5f0] rounded-lg transition-colors"
                    title={t.shareFact}
                    type="button"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#845400]" />
                    <span>{t.shareFact || (language === 'hi' ? 'साझा करें' : 'Share')}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Deep Historical Comparison Banner (Asymmetric Bento Display) */}
      <section className="w-full bg-[#eff5f0] py-14 border-t border-[#c1c8c2]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <div className="flex flex-col gap-1 text-center items-center">
            <span className="text-xs font-bold text-[#845400] uppercase tracking-widest">
              {language === 'hi' ? 'कालानुक्रमिक समन्वय' : 'Chronological Concordance'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#042e1e] font-semibold">
              {language === 'hi' ? 'वैदिक सूत्र बनाम आधुनिक आविष्कार' : 'Vedic Axioms vs. Modern Discoveries'}
            </h2>
            <p className="text-sm text-[#414844] max-w-2xl">
              {language === 'hi'
                ? 'देखें कि कैसे प्रामाणिक संस्कृत सूत्र २०वीं और २१वीं सदी के नोबेल पुरस्कार विजेता मील के पत्थरों से अक्षरशः मेल खाते हैं।'
                : 'Observe how canonical Sanskrit aphorisms map 1:1 against 20th and 21st-century Nobel Prize winning milestones.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Comparison Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c1c8c2]/30 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#845400] font-bold uppercase">
                    {language === 'hi' ? 'दैनिक जैविक घड़ी' : 'Circadian Rhythms'}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#e9efea] text-[#171d1a]">
                    3000 Yr Delta
                  </span>
                </div>
                <h4 className="font-serif text-lg text-[#042e1e] font-semibold">
                  {language === 'hi' ? 'दिनचर्या जैविक घड़ी' : 'Dinacharya Organ Clocks'}
                </h4>
                <p className="text-xs sm:text-sm text-[#414844] leading-relaxed">
                  {language === 'hi'
                    ? 'चरक ने दोपहर/मध्यरात्रि में पित्त (चयापचय) और भोर/गोधूलि में कफ (विश्राम) के चक्रों के अनुसार सोने-जागने के नियम स्थापित किए।'
                    : 'Charaka laid down sleep-wake cycles aligned with Pitta (metabolism) peaks at noon/midnight and Kapha (structural resting) cycles at dawn/dusk.'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#e4eae5]/60 flex items-center gap-3 border border-[#c1c8c2]/25">
                <CheckCircle2 className="w-6 h-6 text-[#845400] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-[#042e1e] font-bold">
                    {language === 'hi' ? '२०१७ नोबेल पुरस्कार सत्यापन' : '2017 Nobel Prize Validation'}
                  </span>
                  <span className="text-[11px] text-[#414844]">
                    {language === 'hi'
                      ? 'हॉल, रोसबैश और यंग ने आणविक सर्केडियन फीडबैक लूप की खोज की।'
                      : 'Hall, Rosbash & Young discover molecular circadian feedback loops.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Comparison Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c1c8c2]/30 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#845400] font-bold uppercase">
                    {language === 'hi' ? 'औषधि अवशोषण विज्ञान' : 'Pharmacokinetics'}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#e9efea] text-[#171d1a]">
                    2500 Yr Delta
                  </span>
                </div>
                <h4 className="font-serif text-lg text-[#042e1e] font-semibold">
                  {language === 'hi' ? 'योगवाही एवं जैव-संवर्धन' : 'Yogavāhi & Bio-enhancement'}
                </h4>
                <p className="text-xs sm:text-sm text-[#414844] leading-relaxed">
                  {language === 'hi'
                    ? 'घृत, मधु और पिप्पली को योगवाही माना गया जो औषधीय तत्वों को रक्त-मस्तिष्क बाधा के पार पहुंचाते हैं।'
                    : 'Ghee, Honey, and Black Pepper were designated as Yogavahi (catalytic transport vehicles) that carry active herbal phytochemicals past blood-brain barriers.'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#e4eae5]/60 flex items-center gap-3 border border-[#c1c8c2]/25">
                <CheckCircle2 className="w-6 h-6 text-[#845400] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-[#042e1e] font-bold">
                    {language === 'hi' ? '१९७९ पिपेरिन जैवउपलब्धता खोज' : '1979 Piperine Bioavailability'}
                  </span>
                  <span className="text-[11px] text-[#414844]">
                    {language === 'hi'
                      ? 'अटल एवं साथियों ने सिद्ध किया कि पिपेरिन अवशोषण को २०००% तक बढ़ाता है।'
                      : 'Atal et al. officially discover piperine enhances systemic drug bioavailability up to 2000%.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Comparison Card 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c1c8c2]/30 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#845400] font-bold uppercase">
                    {language === 'hi' ? 'प्रतिरक्षा एवं पाचन' : 'Immunometabolism'}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#e9efea] text-[#171d1a]">
                    2800 Yr Delta
                  </span>
                </div>
                <h4 className="font-serif text-lg text-[#042e1e] font-semibold">
                  {language === 'hi' ? 'अग्नि-ओजस संबंध' : 'Agni-Ojas Axis'}
                </h4>
                <p className="text-xs sm:text-sm text-[#414844] leading-relaxed">
                  {language === 'hi'
                    ? 'जब अग्नि भोजन को सातों धातुओं में परिपक्व करती है, तो अंतिम सार ओजस (रोग प्रतिरोधक कवच) उत्पन्न होता है।'
                    : 'When digestion (Agni) converts nutrients seamlessly through the seven Dhatus, it yields Ojas (vital immune envelope resisting opportunistic pathogens).'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#e4eae5]/60 flex items-center gap-3 border border-[#c1c8c2]/25">
                <CheckCircle2 className="w-6 h-6 text-[#845400] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-[#042e1e] font-bold">
                    {language === 'hi' ? 'आंत-प्रतिरक्षा आधुनिक विज्ञान' : '2010s Gut-Immunity Paradigm'}
                  </span>
                  <span className="text-[11px] text-[#414844]">
                    {language === 'hi'
                      ? 'शरीर की ७०% प्रतिरक्षा प्रणाली आंतों में स्थित पाई गई (GALT)।'
                      : '70% of mucosal immunity identified in gut-associated lymphoid tissue (GALT).'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI RAG Prompt Bar CTA at Bottom */}
      <section className="w-full bg-white py-14 border-t border-[#c1c8c2]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#042e1e] text-white rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col gap-2 max-w-xl">
              <div className="flex items-center gap-1.5 text-[#ffddb6]">
                <Bot className="w-5 h-5 text-[#ffb958]" />
                <span className="text-xs uppercase font-bold tracking-wider">
                  {language === 'hi' ? 'प्रामाणिक RAG खोज इंजन' : 'Semantic Canonical RAG Query Engine'}
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-semibold">
                {t.interactiveTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#88b19b] leading-relaxed">
                {t.interactiveDesc}
              </p>
            </div>

            {/* Inline Prompt Input Box */}
            <div className="w-full lg:w-auto flex-1 max-w-md flex flex-col gap-2">
              <div className="flex items-center bg-white text-[#171d1a] rounded-xl p-1.5 shadow-inner border border-white/20">
                <Search className="w-4 h-4 text-[#717973] ml-2 shrink-0" />
                <input
                  className="w-full bg-transparent border-0 px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none"
                  placeholder={t.interactivePlaceholder}
                  type="text"
                  value={bottomInput}
                  onChange={(e) => setBottomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleBottomSubmit();
                  }}
                />
                <button
                  className="bg-[#845400] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#744900] transition-all shrink-0"
                  onClick={() => handleBottomSubmit()}
                  type="button"
                >
                  {t.interactiveBtn}
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#88b19b]">
                <span className="font-semibold text-white">
                  {language === 'hi' ? 'लोकप्रिय:' : 'Popular:'}
                </span>
                <button
                  className="hover:underline hover:text-white transition-colors"
                  onClick={() => handleBottomSubmit(language === 'hi' ? 'सुश्रुत' : 'Sushruta')}
                  type="button"
                >
                  {language === 'hi' ? 'सुश्रुत शल्यक्रिया' : 'Sushruta Surgery'}
                </button>
                <span>•</span>
                <button
                  className="hover:underline hover:text-white transition-colors"
                  onClick={() => handleBottomSubmit(language === 'hi' ? 'पारद' : 'Mercury')}
                  type="button"
                >
                  {language === 'hi' ? 'पारद रसायन' : 'Mercury Alchemy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
