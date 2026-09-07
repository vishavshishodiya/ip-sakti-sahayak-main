import React, { useState } from 'react';
import { X, HeartPulse, CheckCircle2, ArrowRight } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface PrakritiQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePrakriti: (prakriti: string) => void;
  language: AppLanguage;
}

export const PrakritiQuizModal: React.FC<PrakritiQuizModalProps> = ({
  isOpen,
  onClose,
  onSavePrakriti,
  language
}) => {
  const [answers, setAnswers] = useState<Record<number, 'Vata' | 'Pitta' | 'Kapha'>>({});
  const [result, setResult] = useState<string | null>(null);

  if (!isOpen) return null;
  const t = TRANSLATIONS[language].prakriti;

  const handleSelect = (qId: number, dosha: 'Vata' | 'Pitta' | 'Kapha') => {
    setAnswers((prev) => ({ ...prev, [qId]: dosha }));
  };

  const calculateResult = () => {
    const counts: Record<'Vata' | 'Pitta' | 'Kapha', number> = { Vata: 0, Pitta: 0, Kapha: 0 };
    for (const d of Object.values(answers) as ('Vata' | 'Pitta' | 'Kapha')[]) {
      counts[d] = (counts[d] || 0) + 1;
    }

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const topDosha = sorted[0][0];
    const secondDosha = sorted[1][0];

    let calculated = topDosha;
    if (sorted[0][1] === sorted[1][1]) {
      calculated = `${sorted[0][0]}-${sorted[1][0]} Dual-Dosha`;
    } else if (sorted[1][1] >= 2) {
      calculated = `${topDosha}-${secondDosha}`;
    }

    setResult(calculated);
    onSavePrakriti(calculated);
  };

  const isComplete = Object.keys(answers).length === t.questions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#c1c8c2]/40 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-[#042e1e] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#ffb958]" />
            <span className="font-serif text-lg font-semibold">{t.title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {!result ? (
            <>
              <p className="text-xs text-[#414844] leading-relaxed">
                {t.subtitle}
              </p>

              <div className="flex flex-col gap-5">
                {t.questions.map((q) => (
                  <div key={q.id} className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#042e1e]">
                      {q.id}. {q.text}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {q.options.map((opt, idx) => {
                        const isSelected = answers[q.id] === opt.dosha;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelect(q.id, opt.dosha)}
                            className={`text-left p-2.5 rounded-xl text-xs transition-all border ${
                              isSelected
                                ? 'bg-[#c2ecd4] border-[#a6d0b9] font-bold text-[#002114]'
                                : 'bg-[#eff5f0] border-transparent text-[#414844] hover:bg-[#e4eae5]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#e4eae5] flex justify-end">
                <button
                  type="button"
                  disabled={!isComplete}
                  onClick={calculateResult}
                  className="px-6 py-2.5 bg-[#845400] text-white disabled:opacity-50 text-xs font-bold rounded-xl hover:bg-[#744900] transition-all shadow flex items-center gap-2"
                >
                  <span>{language === 'hi' ? 'मेरी प्रकृति का मूल्यांकन करें' : 'Evaluate My Prakriti'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-[#c2ecd4] text-[#042e1e] flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-[#845400] uppercase tracking-wider">
                  {t.resultTitle}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#042e1e]">{result}</h3>
                <p className="text-xs text-[#414844] max-w-md mt-2 leading-relaxed">
                  {t.descriptions[result] ||
                    (language === 'hi'
                      ? `आपके AI सहायक RAG परामर्श अब आपकी ${result} प्रकृति के अनुसार समायोजित कर दिए गए हैं।`
                      : `Your AI Sahayak RAG consultations are now calibrated to prioritize botanicals and seasonal Dinacharya harmonizing your ${result} constitution.`)}
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setResult(null)}
                  className="px-4 py-2 border border-[#c1c8c2] text-xs font-semibold rounded-xl hover:bg-[#eff5f0]"
                >
                  {t.retakeBtn}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-[#042e1e] text-white text-xs font-bold rounded-xl hover:bg-[#1e4433] shadow"
                >
                  {t.saveBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
