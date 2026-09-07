import React from 'react';
import { X, Bookmark, Copy, Trash2, Volume2, Sparkles } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: { id: string; sanskrit: string; translation: string; source: string }[];
  onRemove: (id: string) => void;
  showToast: (msg: string) => void;
  language: AppLanguage;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onRemove,
  showToast,
  language
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language].bookmarks;

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(language === 'hi' ? 'श्लोक क्लिपबोर्ड में कॉपी हो गया!' : 'Shloka copied to clipboard!');
    }
  };

  const handleRecite = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
      showToast(language === 'hi' ? 'संस्कृत श्लोक पाठ प्रारंभ...' : 'Reciting Sanskrit verse...');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#c1c8c2]/40">
        {/* Header */}
        <div className="p-5 bg-[#042e1e] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#ffb958]" />
            <span className="font-serif text-lg font-semibold">{t.title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 gap-3 text-[#717973]">
              <Bookmark className="w-12 h-12 text-[#c1c8c2]" />
              <p className="text-sm font-semibold">{t.emptyTitle}</p>
              <p className="text-xs max-w-xs">
                {t.emptyDesc}
              </p>
            </div>
          ) : (
            bookmarks.map((b) => (
              <div
                key={b.id}
                className="bg-[#eff5f0] p-4 rounded-xl border border-[#c1c8c2]/30 flex flex-col gap-2 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#845400] uppercase tracking-wider">
                    {b.source}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRecite(b.sanskrit)}
                      className="p-1 text-[#845400] hover:text-[#042e1e] hover:bg-white rounded"
                      title={t.listenBtn}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(`${b.sanskrit}\n(${b.translation})\n— ${b.source}`)}
                      className="p-1 text-[#414844] hover:text-[#042e1e] hover:bg-white rounded"
                      title={t.copyBtn}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemove(b.id)}
                      className="p-1 text-[#ba1a1a] hover:bg-white rounded"
                      title={t.removeBtn}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="font-serif text-sm font-semibold text-[#042e1e] text-center my-1 leading-relaxed">
                  {b.sanskrit}
                </p>

                <p className="text-xs text-[#414844] italic pt-1 border-t border-[#c1c8c2]/30">
                  "{b.translation}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
