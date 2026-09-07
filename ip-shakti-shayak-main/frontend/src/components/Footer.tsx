import React from 'react';
import { BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  language: AppLanguage;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, language }) => {
  const t = TRANSLATIONS[language].footer;

  return (
    <footer className="w-full bg-[#eff5f0] mt-24 border-t border-[#c1c8c2]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
        {/* Vedic Benediction Shloka */}
        <div className="text-center flex flex-col items-center gap-1.5 pb-8 border-b border-[#c1c8c2]/30">
          <p className="font-serif text-2xl sm:text-3xl text-[#042e1e] tracking-wide font-medium">
            {t.shloka}
          </p>
          <p className="font-serif text-base sm:text-lg text-[#845400] italic font-normal">
            {t.translation}
          </p>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 & 2: Overview */}
          <div className="flex flex-col gap-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#845400]" />
              <span className="font-semibold text-lg text-[#042e1e]">{t.concordanceTitle}</span>
            </div>
            <p className="text-sm text-[#414844] max-w-lg leading-relaxed">
              {t.concordanceDesc}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-[#042e1e] font-semibold bg-[#e4eae5] px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-[#845400]" />
              <span>{t.concordanceBadge}</span>
            </div>
          </div>

          {/* Column 3: Treatise Portals */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#042e1e] uppercase tracking-wider">{t.treatisePortals}</span>
            <button
              onClick={() => setActiveTab('interesting-facts')}
              className="text-sm text-[#414844] hover:text-[#042e1e] transition-colors text-left"
            >
              {t.charakaLink}
            </button>
            <button
              onClick={() => setActiveTab('interesting-facts')}
              className="text-sm text-[#414844] hover:text-[#042e1e] transition-colors text-left"
            >
              {t.sushrutaLink}
            </button>
            <button
              onClick={() => setActiveTab('interesting-facts')}
              className="text-sm text-[#414844] hover:text-[#042e1e] transition-colors text-left"
            >
              {t.ashtangaLink}
            </button>
            <button
              onClick={() => setActiveTab('interesting-facts')}
              className="text-sm text-[#414844] hover:text-[#042e1e] transition-colors text-left"
            >
              {t.bhavaprakashaLink}
            </button>
          </div>

          {/* Column 4: Quick Navigation */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#042e1e] uppercase tracking-wider">{t.systemsTitle}</span>
            <button
              onClick={() => setActiveTab('home')}
              className="text-sm text-[#414844] hover:text-[#042e1e] transition-colors text-left flex items-center gap-1"
            >
              <span>{t.nav?.home || (language === 'hi' ? 'मुख्य पृष्ठ' : 'Home')}</span>
            </button>
            <button
              onClick={() => setActiveTab('interesting-facts')}
              className="text-sm text-[#414844] hover:text-[#042e1e] transition-colors text-left flex items-center gap-1"
            >
              <span>{language === 'hi' ? 'रोचक तथ्य' : 'Interesting Facts'}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#845400]" />
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className="text-sm text-[#414844] hover:text-[#042e1e] transition-colors text-left"
            >
              {t.knowledgeGraphLink}
            </button>
            <span className="text-xs text-[#845400] font-semibold mt-1">
              {t.engineTag}
            </span>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#c1c8c2]/30 text-xs text-[#414844]">
          <span>
            {t.copyright}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[#845400] font-semibold">{t.verifiedTag}</span>
            <span>•</span>
            <span>{t.openAccessTag}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
