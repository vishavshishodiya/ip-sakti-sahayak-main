import React, { useState } from 'react';
import { Menu, X, Sparkles, Home, Bot } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const isHome = activeTab === 'home';
  const isRag = activeTab === 'rag';
  const isFacts = activeTab === 'interesting-facts' || activeTab === 'crazy-facts-&-curiosities';

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f5fbf6]/95 backdrop-blur-md border-b border-[#c1c8c2]/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Emblem and Logo Title */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 shrink-0 text-left hover:opacity-95 transition-opacity"
        >
          <img
            alt="IP-SAKTI Sahayak Emblem"
            className="h-9 w-auto object-contain rounded-full shadow-sm border border-[#ffb958]/40"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1wnUFVomatJXGkqpJLnstW0Bgunc3lSIOg8a1PjUrgL9_6reaG2-1aCsJz3U-F_Wl_3rI156WSzfNLeWfrSCu9FIMmo7wcoYaxfVpmQ--rA-R0wPWj9ZbsmTQkiBGTzLsOQTX8jS3B6DFWnU1NsCu4FElsCgFx5eJSA76lvJ_SsGkmgFz0yPyBrOZzsEPbdrmawHwvSD_Bf32up28vzRR-JTlaqvc84ujfSuK-iXSryRdhZlXn9hT"
          />
          <span className="font-serif text-xl sm:text-2xl text-[#042e1e] font-semibold tracking-tight">
            {t.home.heroTitle}
          </span>
        </button>

        {/* Right Section: Nav tabs directly near the language switch option! */}
        <div className="flex items-center gap-3">
          {/* Desktop Navigation Tabs right near the language switch option */}
          <nav className="hidden sm:flex items-center gap-1.5 bg-[#e9efea]/70 p-1.5 rounded-xl border border-[#c1c8c2]/30">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                isHome
                  ? 'bg-[#1e4433] text-white shadow-sm'
                  : 'text-[#414844] hover:text-[#171d1a] hover:bg-[#e4eae5]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t.nav.home}</span>
            </button>

            <button
              onClick={() => setActiveTab('rag')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                isRag
                  ? 'bg-[#1e4433] text-white shadow-sm'
                  : 'text-[#414844] hover:text-[#171d1a] hover:bg-[#e4eae5]'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>{t.nav.rag}</span>
            </button>

            <button
              onClick={() => setActiveTab('interesting-facts')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                isFacts
                  ? 'bg-[#1e4433] text-white shadow-sm'
                  : 'text-[#414844] hover:text-[#171d1a] hover:bg-[#e4eae5]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#ffb958]" />
              <span>{t.nav.interestingFacts || (language === 'hi' ? 'रोचक तथ्य' : 'Interesting Facts')}</span>
            </button>
          </nav>

          {/* Bilingual Selector (English <-> Hindi only) */}
          <div className="inline-flex items-center bg-[#eff5f0] p-1 rounded-full border border-[#c1c8c2]/40 shadow-inner">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                language === 'en'
                  ? 'bg-[#845400] text-white shadow-sm'
                  : 'text-[#414844] hover:text-[#171d1a]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                language === 'hi'
                  ? 'bg-[#845400] text-white shadow-sm'
                  : 'text-[#414844] hover:text-[#171d1a]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-[#414844] hover:text-[#042e1e] hover:bg-[#e4eae5] rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#f5fbf6] border-b border-[#c1c8c2]/30 px-4 py-3 flex flex-col gap-2 shadow-md animate-fade-in">
          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
              isHome
                ? 'bg-[#1e4433] text-white font-bold'
                : 'text-[#414844] hover:bg-[#e4eae5]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t.nav.home}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('rag');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
              isRag
                ? 'bg-[#1e4433] text-white font-bold'
                : 'text-[#414844] hover:bg-[#e4eae5]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>{t.nav.rag}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('interesting-facts');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
              isFacts
                ? 'bg-[#1e4433] text-white font-bold'
                : 'text-[#414844] hover:bg-[#e4eae5]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#ffb958]" />
            <span>{t.nav.interestingFacts || (language === 'hi' ? 'रोचक तथ्य' : 'Interesting Facts')}</span>
          </button>
        </div>
      )}
    </header>
  );
};
