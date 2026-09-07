import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
  ShieldCheck,
  Cpu,
  Languages,
  X
} from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HomeViewProps {
  onSearchQuery: (query: string) => void;
  setActiveTab: (tab: string) => void;
  language: AppLanguage;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSearchQuery, setActiveTab, language }) => {
  const t = TRANSLATIONS[language];
  const [queryInput, setQueryInput] = useState(
    language === 'hi'
      ? 'शरद अथवा ग्रीष्म में पित्त असंतुलन के उपाय'
      : 'Remedies for Pitta imbalance in autumn or heat'
  );

  // Update sample query if language flips and input wasn't custom-typed
  useEffect(() => {
    setQueryInput(
      language === 'hi'
        ? 'शरद अथवा ग्रीष्म में पित्त असंतुलन के उपाय'
        : 'Remedies for Pitta imbalance in autumn or heat'
    );
  }, [language]);

  const handleLaunch = () => {
    if (queryInput.trim()) {
      onSearchQuery(queryInput.trim());
    }
  };

  const handlePromptClick = (promptText: string) => {
    setQueryInput(promptText);
    onSearchQuery(promptText);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section with Layered Parchment Atmosphere */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f5fbf6] via-[#eff5f0] to-[#f5fbf6] py-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle Botanical Mandala Watermark Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center">
          <svg className="w-[800px] h-[800px] text-[#042e1e]" fill="currentColor" viewBox="0 0 200 200">
            <circle cx="100" cy="100" fill="none" r="90" stroke="currentColor" strokeDasharray="2 3" strokeWidth="0.75" />
            <circle cx="100" cy="100" fill="none" r="68" stroke="currentColor" strokeWidth="0.5" />
            <path d="M100 10 C120 50 150 80 190 100 C150 120 120 150 100 190 C80 150 50 120 10 100 C50 80 80 50 100 10 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="100" cy="100" fill="none" r="32" stroke="currentColor" strokeWidth="0.8" />
            <path d="M100 36 A64 64 0 0 1 164 100 A64 64 0 0 1 100 164 A64 64 0 0 1 36 100 A64 64 0 0 1 100 36 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Top Main Heading */}
          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#042e1e] tracking-tight max-w-4xl font-semibold"
            style={{
              textShadow: 'rgba(180, 83, 9, 0.25) 2px 3px 6px, rgba(30, 68, 51, 0.35) 0px 1px 2px'
            }}
          >
            {t.home.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="font-serif text-lg sm:text-xl text-[#845400] mt-2 max-w-2xl font-medium tracking-wide">
            {t.home.heroSubtitle}
          </p>
          <p className="text-sm sm:text-base text-[#414844] max-w-2xl mt-3 mb-10 leading-relaxed">
            {t.home.heroDesc}
          </p>

          {/* Centerpiece Visual & RAG Interactive Showcase */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            {/* Botanical Imagery Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-white p-2.5 border border-[#c1c8c2]/30 group">
                <div className="relative rounded-xl overflow-hidden h-72 w-full bg-[#e9efea]">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt="Traditional Ayurvedic botanical practitioner working with healing herbs"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxms-CB_ATOszoizv-Ksv1gh2VrDb6A4zjoz3LJhh_Utqq8FdYj2hzdQkph0HnZGeEi2KyRqY3N_3cJig0BrBuGBGNsmaqwf3y9zNviAGtlp1RWZ3XpUuCbB8EJ0kqhJKmfntLGGNvdkRBmYV1Fo1FwV119ed_1_CwSRyq6fDkDyp51wPOb-m8sMTtLKHCz1BSMEw3tiTos5AK_iUmxz8KZMtaU88279YMRxzws32cTgEALPR374hcxXqKoBYB9N5l3A"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#042e1e]/95 via-[#042e1e]/40 to-transparent flex flex-col justify-end p-5">
                    <div className="flex items-center gap-1.5 text-[#c2ecd4]">
                      <Sparkles className="w-4 h-4 text-[#ffb958]" />
                      <span className="text-xs uppercase font-bold tracking-wider">
                        {t.home.codifiedTag}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl text-white font-medium mt-1">
                      {t.home.herbologyTitle}
                    </h3>
                    <p className="text-xs text-[#88b19b] line-clamp-2 mt-1">
                      {t.home.herbologyDesc}
                    </p>
                  </div>
                </div>

                {/* Ancient Lineage Sub-Strip */}
                <div className="mt-2.5 p-2.5 bg-[#eff5f0] rounded-xl flex items-center justify-between gap-3 border border-[#c1c8c2]/30">
                  <div className="flex items-center gap-2.5">
                    <img
                      className="w-11 h-11 rounded-full object-cover shadow-sm border border-[#ffb958]/50 shrink-0"
                      alt="History of Ayurveda Sage"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRdMLs4NeBKqqkNRSPoATMhtcK4abvJS65BXuteQ6bpCJBfFDAhgiFAJks0bFG3jOADWAfb7jvUCd6sctNPCmhscPTlFb2XUf8Shdx4wIc4L6Ktu9V7lqVK17Ee7y2sWUaiJ-MXv4wQll81FfqekW-ZF_SwBV4NuCURC6sL29PYtig43D1EjlJXidjIO1nKosMszN3hXzLqDkimlUncR6EGalfsesAX1PLq3DaFdqLGY5HIX-nBEoPuWUcG3nKtlBNXg"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#845400] uppercase font-bold tracking-wider">
                        {t.home.ancientLineageTag}
                      </span>
                      <span className="text-xs font-semibold text-[#042e1e]">
                        {t.home.ancientLineageTitle}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#845400] px-2.5 py-1 bg-[#e9efea] rounded-md text-xs font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t.home.sutrasthanaTag}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Centerpiece RAG AI Model Launcher Prompt Box */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-[#c1c8c2]/30 relative overflow-hidden">
                {/* Decorative Subtle Gold Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#845400] via-[#ffb958] to-[#042e1e]"></div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#042e1e] font-semibold mt-1">
                  {t.home.askWisdomTitle}
                </h2>
                <p className="text-xs sm:text-sm text-[#414844] mt-1.5 mb-5 leading-relaxed">
                  {t.home.askWisdomDesc}
                </p>

                {/* Search / Query Input Bar */}
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-[#845400]" />
                  <input
                    className="w-full pl-11 pr-24 py-3.5 bg-[#f5fbf6] text-[#171d1a] rounded-xl border border-[#c1c8c2]/40 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#845400] text-sm sm:text-base font-medium placeholder:text-[#717973]"
                    id="rag-query-input"
                    placeholder={t.home.searchPlaceholder}
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLaunch();
                    }}
                  />
                  {queryInput && (
                    <button
                      onClick={() => setQueryInput('')}
                      className="absolute right-16 text-[#717973] hover:text-[#171d1a] p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleLaunch}
                    className="absolute right-2 px-3 py-2 bg-[#845400] hover:bg-[#744900] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>{t.home.searchButton}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Clickable Sample Prompts */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-[#414844] uppercase tracking-wider block mb-2">
                    {t.home.verifiedPromptsLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {t.home.curatedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePromptClick(prompt)}
                        type="button"
                        className="text-left text-xs bg-[#eff5f0] hover:bg-[#e4eae5] text-[#042e1e] px-3 py-1.5 rounded-lg transition-all shadow-sm border border-[#c1c8c2]/30 hover:border-[#845400]/40"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Curiosity Banner: Interesting Facts Related to Ayurveda */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div
          onClick={() => setActiveTab('interesting-facts')}
          className="cursor-pointer group block relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#042e1e] via-[#1e4433] to-[#845400] p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#ffb958] text-[#2a1800] flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform duration-300">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-[#ffddb6]">
                  <span className="text-xs uppercase tracking-widest font-bold">
                    {t.home.bannerTag}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-white group-hover:text-[#ffddb6] transition-colors font-semibold mt-0.5">
                  {t.home.bannerTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#88b19b] max-w-2xl mt-1 leading-relaxed">
                  {t.home.bannerDesc}
                </p>
              </div>
            </div>
            <div className="shrink-0 inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl bg-white text-[#042e1e] group-hover:bg-[#ffb958] group-hover:text-[#2a1800] transition-all shadow">
              <span>{language === 'hi' ? 'रोचक तथ्य देखें' : 'Explore Interesting Facts'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Architectural Pillars */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#042e1e] font-semibold">
            {t.home.pillarsHeading}
          </h2>
          <p className="text-sm sm:text-base text-[#414844] max-w-2xl mx-auto mt-2 leading-relaxed">
            {t.home.pillarsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Bilingual Intelligence */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#c1c8c2]/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#eff5f0] flex items-center justify-center text-[#042e1e] mb-4 border border-[#c1c8c2]/30">
                <Languages className="w-6 h-6 text-[#042e1e]" />
              </div>
              <span className="text-xs uppercase tracking-wider text-[#845400] font-bold">
                {t.home.pillar1Tag}
              </span>
              <h3 className="font-serif text-xl text-[#042e1e] font-semibold mt-1">
                {t.home.pillar1Title}
              </h3>
              <p className="text-sm text-[#414844] mt-2 leading-relaxed">
                {t.home.pillar1Desc}
              </p>
            </div>
            <div className="mt-6 pt-3 bg-[#eff5f0] rounded-xl p-2.5 flex items-center justify-around text-xs font-semibold">
              <span className="text-[#042e1e]">{t.home.pillar1BadgeEn}</span>
              <span className="text-[#845400]">{t.home.pillar1BadgeHi}</span>
            </div>
          </div>

          {/* Pillar 2: RAG Neural Engine */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#c1c8c2]/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#eff5f0] flex items-center justify-center text-[#845400] mb-4 border border-[#c1c8c2]/30">
                <Cpu className="w-6 h-6 text-[#845400]" />
              </div>
              <span className="text-xs uppercase tracking-wider text-[#845400] font-bold">
                {t.home.pillar2Tag}
              </span>
              <h3 className="font-serif text-xl text-[#042e1e] font-semibold mt-1">
                {t.home.pillar2Title}
              </h3>
              <p className="text-sm text-[#414844] mt-2 leading-relaxed">
                {t.home.pillar2Desc}
              </p>
            </div>
            <div className="mt-6 pt-3 bg-[#eff5f0] rounded-xl p-2.5 flex items-center justify-between px-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#845400]"></span>
                <span className="text-[#414844] font-medium">{t.home.pillar2Match}</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-[#845400]" />
            </div>
          </div>

          {/* Pillar 3: Authenticated Information */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#c1c8c2]/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#eff5f0] flex items-center justify-center text-[#042e1e] mb-4 border border-[#c1c8c2]/30">
                <ShieldCheck className="w-6 h-6 text-[#042e1e]" />
              </div>
              <span className="text-xs uppercase tracking-wider text-[#845400] font-bold">
                {t.home.pillar3Tag}
              </span>
              <h3 className="font-serif text-xl text-[#042e1e] font-semibold mt-1">
                {t.home.pillar3Title}
              </h3>
              <p className="text-sm text-[#414844] mt-2 leading-relaxed">
                {t.home.pillar3Desc}
              </p>
            </div>
            <div className="mt-6 pt-3 bg-[#eff5f0] rounded-xl p-2.5 flex items-center justify-between px-3 text-xs">
              <span className="text-[#042e1e] font-bold">{t.home.pillar3Badge1}</span>
              <span className="text-[#845400] bg-[#ffddb6] px-2 py-0.5 rounded font-semibold">
                {t.home.pillar3Badge2}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Canonical Treatise Quick Reference Strip */}
      <section className="w-full bg-[#eff5f0] py-8 px-4 sm:px-6 lg:px-8 border-t border-[#c1c8c2]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#1e4433] text-white flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-[#ffb958]" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-[#042e1e] font-semibold">{t.home.stripTitle}</h4>
              <p className="text-xs text-[#414844]">{t.home.stripDesc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('interesting-facts')}
              className="px-3.5 py-1.5 bg-white text-[#042e1e] text-xs font-bold rounded-lg shadow-sm hover:bg-[#042e1e] hover:text-white transition-all border border-[#c1c8c2]/30"
            >
              {t.home.treatiseCharaka}
            </button>
            <button
              onClick={() => setActiveTab('interesting-facts')}
              className="px-3.5 py-1.5 bg-white text-[#042e1e] text-xs font-bold rounded-lg shadow-sm hover:bg-[#042e1e] hover:text-white transition-all border border-[#c1c8c2]/30"
            >
              {t.home.treatiseSushruta}
            </button>
            <button
              onClick={() => setActiveTab('interesting-facts')}
              className="px-3.5 py-1.5 bg-white text-[#042e1e] text-xs font-bold rounded-lg shadow-sm hover:bg-[#042e1e] hover:text-white transition-all border border-[#c1c8c2]/30"
            >
              {t.home.treatiseAshtanga}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
