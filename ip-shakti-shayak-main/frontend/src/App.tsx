import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CuriositiesView } from './components/CuriositiesView';
import { RagStudioView } from './components/RagStudioView';
import { AppLanguage, RagResponse } from './types';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' } | null>(null);
  const [searchFilterQuery, setSearchFilterQuery] = useState<string>('');

  // RAG Studio state — held at the App level so navigation can swap it in
  // without losing the in-flight answer.
  const [ragResponse, setRagResponse] = useState<RagResponse | null>(null);
  const [ragLoading, setRagLoading] = useState<boolean>(false);
  const [ragError, setRagError] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Called from HomeView / RagStudioView / etc. Hits the FastAPI orchestrator.
  const handleRagQuery = async (
    query: string,
    _treatise?: string,
    _dosha?: string
  ) => {
    setRagLoading(true);
    setRagError(null);
    setActiveTab('rag');
    setSearchFilterQuery(query);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const resp = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language,
          treatiseFilter: _treatise ?? 'All',
          doshaFilter: _dosha ?? 'All',
        }),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`RAG API error ${resp.status}: ${errText}`);
      }
      const data: RagResponse = await resp.json();
      setRagResponse(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setRagError(message);
      setRagResponse(null);
      showToast(
        language === 'hi'
          ? `त्रुटि: ${message}`
          : `Error: ${message}`,
        'info'
      );
    } finally {
      setRagLoading(false);
    }
  };

  const handleSearchFromHome = (query: string) => {
    setSearchFilterQuery(query);
    setActiveTab('rag');
    showToast(
      language === 'hi'
        ? `"${query}" के लिए RAG स्टूडियो खोला जा रहा है`
        : `Opening RAG Studio for "${query}"`,
      'info'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Auto-trigger the query immediately for a smoother demo.
    if (query && query.trim()) {
      handleRagQuery(query);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5fbf6] text-[#171d1a] selection:bg-[#ffddb6] selection:text-[#2a1800]">
      {/* Top Fixed Header with Home, RAG Studio, and Interesting Facts tabs near language switch */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-20">
        {activeTab === 'home' && (
          <HomeView
            onSearchQuery={handleSearchFromHome}
            setActiveTab={setActiveTab}
            language={language}
          />
        )}

        {activeTab === 'rag' && (
          <RagStudioView
            currentResponse={ragResponse}
            isLoading={ragLoading}
            onSearch={(q, t, d) => handleRagQuery(q, t, d)}
            onBookmarkShloka={() => {
              showToast(
                language === 'hi'
                  ? 'श्लोक सहेजा गया (बुकमार्क डेमो)'
                  : 'Shloka bookmarked (demo)',
                'success'
              );
            }}
            showToast={showToast}
            language={language}
          />
        )}

        {(activeTab === 'interesting-facts' || activeTab === 'crazy-facts-&-curiosities') && (
          <CuriositiesView
            onSearchQuery={handleSearchFromHome}
            showToast={showToast}
            language={language}
            initialQuery={searchFilterQuery}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} language={language} />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e4433] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#a6d0b9]/40 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#ffb958] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
