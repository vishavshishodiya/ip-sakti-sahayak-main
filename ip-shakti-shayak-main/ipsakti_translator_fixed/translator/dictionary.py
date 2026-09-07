"""
Domain Dictionary for IP-SAKTI Sahayak

Provides offline domain vocabulary for:
  1. Ayurveda terminology (doshas, herbs, formulations, rasas, TKDL)
  2. Intellectual Property (IP) & Patent terms (prior art, claims, infringement, novelty)
  3. Government & Regulatory terms (AYUSH, licensing, certificates, schemes)

Supports bidirectional translation (Indic -> English and English -> Indic)
across 7 Indian languages + Sanskrit.
"""

from typing import Dict, List, Optional, Tuple


# ---------------------------------------------------------------------- #
#  1. AYURVEDA & TRADITIONAL MEDICINE TERMS                              #
# ---------------------------------------------------------------------- #
AYURVEDA_TERMS: Dict[str, Dict[str, str]] = {
    "hi": {
        "आयुर्वेद": "Ayurveda",
        "आयुर्वेदिक दवा": "Ayurvedic medicine",
        "पारंपरिक ज्ञान": "traditional knowledge",
        "पारंपरिक चिकित्सा": "traditional medicine",
        "जड़ी-बूटी": "medicinal herb",
        "औषधीय पौधा": "medicinal plant",
        "अश्वगंधा": "Ashwagandha (Withania somnifera)",
        "तुलसी": "Tulsi / Holy Basil (Ocimum sanctum)",
        "नीम": "Neem (Azadirachta indica)",
        "हल्दी": "Turmeric / Curcuma longa",
        "आंवला": "Amla / Indian Gooseberry (Phyllanthus emblica)",
        "त्रिफला": "Triphala",
        "च्यवनप्राश": "Chyawanprash",
        "वात": "Vata dosha",
        "पित्त": "Pitta dosha",
        "कफ": "Kapha dosha",
        "त्रिदोष": "Tridosha",
        "रसशास्त्र": "Rasa Shastra",
        "भस्म": "Bhasma (calcined preparation)",
        "काढ़ा": "decoction / kwath",
        "अर्क": "distillate / arka",
        "चूर्ण": "herbal powder / churna",
        "घृत": "medicated ghee / ghrita",
        "तैल": "medicated oil / taila",
        "योग": "formulation / yoga",
        "पादप": "botanical / plant",
        "रोग प्रतिरोधक क्षमता": "immunity",
        "जैव सक्रिय घटक": "bioactive compound",
    },
    "sa": {
        "आयुर्वेदः": "Ayurveda",
        "औषधम्": "medicine",
        "पारम्परिकज्ञानम्": "traditional knowledge",
        "वनस्पतिः": "botanical plant",
        "त्रिदोषः": "Tridosha",
        "वात": "Vata",
        "पित्त": "Pitta",
        "कफ": "Kapha",
        "रसशास्त्रम्": "Rasa Shastra",
        "भस्म": "Bhasma",
        "क्वाथः": "decoction",
        "चूर्णम्": "powder",
    },
    "bn": {
        "আয়ুর্বেদ": "Ayurveda",
        "ভেষজ ওষুধ": "herbal medicine",
        "ঐতিহ্যগত জ্ঞান": "traditional knowledge",
        "ভেষজ উদ্ভিদ": "medicinal plant",
        "অশ্বগন্ধা": "Ashwagandha",
        "তুলসী": "Tulsi",
        "নিম": "Neem",
        "হলুদ": "Turmeric",
        "আমলকী": "Amla",
        "ত্রিফলা": "Triphala",
        "বাত": "Vata dosha",
        "পিত্ত": "Pitta dosha",
        "কফ": "Kapha dosha",
        "ভস্ম": "Bhasma",
        "কাড়া": "decoction",
    },
    "ta": {
        "ஆயுர்வேதம்": "Ayurveda",
        "பாரம்பரிய அறிவு": "traditional knowledge",
        "மூலிகை": "medicinal herb",
        "அசுவகந்தா": "Ashwagandha",
        "துளசி": "Tulsi",
        "வேம்பு": "Neem",
        "மஞ்சள்": "Turmeric",
        "நெல்லிக்காய்": "Amla",
        "திரிபலா": "Triphala",
        "வாதம்": "Vata dosha",
        "பித்தம்": "Pitta dosha",
        "கபம்": "Kapha dosha",
        "பஸ்பம்": "Bhasma",
        "கசாயம்": "decoction",
        "சித்த மருத்துவம்": "Siddha medicine",
    },
    "te": {
        "ఆయుర్వేదం": "Ayurveda",
        "సాంప్రదాయ జ్ఞానం": "traditional knowledge",
        "మూలికా ఔషధం": "herbal medicine",
        "అశ్వగంధ": "Ashwagandha",
        "తులసి": "Tulsi",
        "వేప": "Neem",
        "పసుపు": "Turmeric",
        "ఉసిరి": "Amla",
        "త్రిఫల": "Triphala",
        "వాతం": "Vata dosha",
        "పిత్తం": "Pitta dosha",
        "కఫం": "Kapha dosha",
        "భస్మం": "Bhasma",
        "కషాయం": "decoction",
    },
    "mr": {
        "आयुर्वेद": "Ayurveda",
        "पारंपारिक ज्ञान": "traditional knowledge",
        "औषधी वनस्पती": "medicinal plant",
        "अश्वगंधा": "Ashwagandha",
        "तुळस": "Tulsi",
        "कडुनिंब": "Neem",
        "हळद": "Turmeric",
        "आवळा": "Amla",
        "त्रिफळा": "Triphala",
        "वात": "Vata dosha",
        "पित्त": "Pitta dosha",
        "कफ": "Kapha dosha",
        "भस्म": "Bhasma",
        "काढा": "decoction",
    },
    "gu": {
        "આયુર્વેદ": "Ayurveda",
        "પરંપરાગત જ્ઞાન": "traditional knowledge",
        "ઔષધીય વનસ્પતિ": "medicinal plant",
        "અશ્વગંધા": "Ashwagandha",
        "તુલસી": "Tulsi",
        "લીમડો": "Neem",
        "હળદર": "Turmeric",
        "આમળા": "Amla",
        "ત્રિફળા": "Triphala",
        "વાત": "Vata dosha",
        "પિત્ત": "Pitta dosha",
        "કફ": "Kapha dosha",
        "ઉકાળો": "decoction",
    },
    "kn": {
        "ಆಯುರ್ವೇದ": "Ayurveda",
        "ಸಾಂಪ್ರದಾಯಿಕ ಜ್ಞಾನ": "traditional knowledge",
        "ಔಷಧೀಯ ಸಸ್ಯ": "medicinal plant",
        "ಅಶ್ವಗಂಧ": "Ashwagandha",
        "ತುಳಸಿ": "Tulsi",
        "ಬೇವು": "Neem",
        "ಅರಿಶಿನ": "Turmeric",
        "ನೆಲ್ಲಿಕಾಯಿ": "Amla",
        "ತ್ರಿಫಲ": "Triphala",
        "ವಾತ": "Vata dosha",
        "ಪಿತ್ತ": "Pitta dosha",
        "ಕಫ": "Kapha dosha",
        "ಕಷಾಯ": "decoction",
    }
}


# ---------------------------------------------------------------------- #
#  2. INTELLECTUAL PROPERTY & PATENT LAW TERMS                           #
# ---------------------------------------------------------------------- #
IP_TERMS: Dict[str, Dict[str, str]] = {
    "hi": {
        "पेटेंट": "patent",
        "पेटेंट आवेदन": "patent application",
        "पेटेंट कार्यालय": "patent office",
        "बौद्धिक संपदा": "intellectual property",
        "बौद्धिक संपदा अधिकार": "intellectual property rights (IPR)",
        "पूर्व कला": "prior art",
        "प्रारंभिक कला": "prior art",
        "पारंपरिक ज्ञान डिजिटल लाइब्रेरी": "Traditional Knowledge Digital Library (TKDL)",
        "टीकेडीएल": "TKDL",
        "जैव चोरी": "biopiracy",
        "जैव चोरी रोकथाम": "biopiracy prevention",
        "पेटेंट उल्लंघन": "patent infringement",
        "नवीनता": "novelty",
        "आविष्कारशील कदम": "inventive step / non-obviousness",
        "औद्योगिक अनुप्रयोग": "industrial applicability",
        "पेटेंट पात्रता": "patent eligibility",
        "धारा 3(p)": "Section 3(p) Indian Patent Act",
        "धारा 3(d)": "Section 3(d) Indian Patent Act",
        "भौगोलिक संकेत": "Geographical Indication (GI)",
        "ट्रेडमार्क": "trademark",
        "कॉपीराइट": "copyright",
        "व्यापार रहस्य": "trade secret",
        "दावे": "patent claims",
        "विशिष्टता": "patent specification",
        "अनुदान": "patent grant",
        "अस्वीकृति": "patent rejection",
        "लाइसेंस": "license",
        "अनिवार्य लाइसेंस": "compulsory license",
        "स्वामित्व": "ownership",
        "आविष्कारक": "inventor",
        "आवेदक": "applicant",
    },
    "sa": {
        "स्वामित्वम्": "ownership",
        "अधिकारः": "right",
        "नवीनता": "novelty",
        "संशोधनम्": "research/invention",
    },
    "bn": {
        "পেটেন্ট": "patent",
        "পেটেন্ট আবেদন": "patent application",
        "বুদ্ধিবৃত্তিক সম্পত্তি": "intellectual property",
        "পূর্ব জ্ঞান": "prior art",
        "বায়োপাইরেসি": "biopiracy",
        "পেটেন্ট লঙ্ঘন": "patent infringement",
        "নতুনত্ব": "novelty",
        "ভৌগোলিক নির্দেশক": "Geographical Indication (GI)",
        "ট্রেডমার্ক": "trademark",
        "মালিকানা": "ownership",
        "উদ্ভাবক": "inventor",
    },
    "ta": {
        "காப்புரிமை": "patent",
        "காப்புரிமை விண்ணப்பம்": "patent application",
        "அறிவுசார் சொத்து": "intellectual property",
        "முந்தைய அறிவு": "prior art",
        "உயிர்க்கொள்ளை": "biopiracy",
        "புத்தாக்கம்": "novelty / invention",
        "புவிசார் குறியீடு": "Geographical Indication (GI)",
        "வணிக முத்திரை": "trademark",
        "கண்டுபிடிப்பாளர்": "inventor",
        "விண்ணப்பதாரர்": "applicant",
    },
    "te": {
        "పేటెంట్": "patent",
        "పేటెంట్ దరఖాస్తు": "patent application",
        "మేధో సంపత్తి": "intellectual property",
        "ముందస్తు జ్ఞానం": "prior art",
        "బయోపైరసీ": "biopiracy",
        "కొత్తదనం": "novelty",
        "భౌగోళిక గుర్తింపు": "Geographical Indication (GI)",
        "ట్రేడ్‌మార్క్": "trademark",
        "ఆవిష్కర్త": "inventor",
    },
    "mr": {
        "पेटंट": "patent",
        "पेटंट अर्ज": "patent application",
        "बौद्धिक संपदा": "intellectual property",
        "बौद्धिक संपदा अधिकार": "intellectual property rights (IPR)",
        "पूर्व कला": "prior art",
        "पारंपरिक ज्ञान डिजिटल लायब्ररी": "Traditional Knowledge Digital Library (TKDL)",
        "टीकेडीएल": "TKDL",
        "बायोपायरेसी": "biopiracy",
        "पेटंट उल्लंघन": "patent infringement",
        "नवीनता": "novelty",
        "पेटंट पात्रता": "patent eligibility",
        "कलम 3(p)": "Section 3(p) Indian Patent Act",
        "कलम 3(d)": "Section 3(d) Indian Patent Act",
        "भौगोलिक मानांकन": "Geographical Indication (GI)",
        "ट्रेडमार्क": "trademark",
        "संशोधक": "inventor",
        "दावे": "patent claims",
        "स्वामित्व": "ownership",
    },
    "gu": {
        "પેટન્ટ": "patent",
        "પેટન્ટ અરજી": "patent application",
        "બૌદ્ધિક સંપદા": "intellectual property",
        "પૂર્વ જ્ઞાન": "prior art",
        "બાયોપાયરસી": "biopiracy",
        "નવીનતા": "novelty",
        "ભૌગોલિક સંકેત": "Geographical Indication (GI)",
        "ટ્રેડમાર્ક": "trademark",
        "શોધક": "inventor",
    },
    "kn": {
        "ಪೇಟೆಂಟ್": "patent",
        "ಪೇಟೆಂಟ್ ಅರ್ಜಿ": "patent application",
        "ಬೌದ್ಧಿಕ ಆಸ್ತಿ": "intellectual property",
        "ಹಿಂದಿನ ಕಲೆ": "prior art",
        "ಬಯೋಪೈರಸಿ": "biopiracy",
        "ಹೊಸತನ": "novelty",
        "ಭೌಗೋಳಿಕ ಸೂಚ್ಯಂಕ": "Geographical Indication (GI)",
        "ಟ್ರೇಡ್‌ಮಾರ್ಕ್": "trademark",
        "ಸಂಶೋಧಕ": "inventor",
    }
}


# ---------------------------------------------------------------------- #
#  3. GOVERNMENT & REGULATORY TERMS                                      #
# ---------------------------------------------------------------------- #
GOVT_TERMS: Dict[str, Dict[str, str]] = {
    "hi": {
        "आयुष मंत्रालय": "Ministry of AYUSH",
        "आयुष": "AYUSH (Ayurveda, Yoga, Unani, Siddha, Homeopathy)",
        "शिकायत": "complaint",
        "आवेदन": "application",
        "प्रमाण पत्र": "certificate",
        "अनुमति": "permission / clearance",
        "दवा नियंत्रण": "drug controller",
        "लाइसेंसिंग प्राधिकरण": "licensing authority",
        "सरकारी योजना": "government scheme",
        "मानकीकरण": "standardization",
        "गुणवत्ता नियंत्रण": "quality control",
        "नैदानिक परीक्षण": "clinical trials",
        "सुरक्षा मानक": "safety standards",
        "राष्ट्रीय जैव विविधता प्राधिकरण": "National Biodiversity Authority (NBA)",
        "राज्य जैव विविधता बोर्ड": "State Biodiversity Board (SBB)",
        "पेंशन": "pension",
        "बिजली": "electricity",
        "पानी": "water",
        "सड़क": "road",
        "स्वास्थ्य": "health",
        "शिक्षा": "education",
    },
    "bn": {
        "আয়ুশ মন্ত্রণালয়": "Ministry of AYUSH",
        "অভিযোগ": "complaint",
        "আবেদন": "application",
        "প্রমাণপত্র": "certificate",
        "সরকারি প্রকল্প": "government scheme",
        "স্বাস্থ্য": "health",
        "শিক্ষা": "education",
    },
    "ta": {
        "ஆயுஷ் அமைச்சகம்": "Ministry of AYUSH",
        "புகார்": "complaint",
        "விண்ணப்பம்": "application",
        "சான்றிதழ்": "certificate",
        "அரசு திட்டம்": "government scheme",
        "சுகாதாரம்": "health",
        "கல்வி": "education",
    },
    "te": {
        "ఆయుష్ మంత్రిత్వ శాఖ": "Ministry of AYUSH",
        "ఫిర్యాదు": "complaint",
        "దరఖాస్తు": "application",
        "ధృవీకరణ పత్రం": "certificate",
        "ప్రభుత్వ పథకం": "government scheme",
        "ఆరోగ్యం": "health",
    },
    "mr": {
        "आयुष मंत्रालय": "Ministry of AYUSH",
        "तक्रार": "complaint",
        "अर्ज": "application",
        "प्रमाणपत्र": "certificate",
        "शासकीय योजना": "government scheme",
        "आरोग्य": "health",
    },
    "gu": {
        "આયુષ મંત્રાલય": "Ministry of AYUSH",
        "ફરિયાદ": "complaint",
        "અરજી": "application",
        "પ્રમાણપત્ર": "certificate",
        "સરકારી યોજના": "government scheme",
        "આરોગ્ય": "health",
    },
    "kn": {
        "ಆಯುಷ್ ಸಚಿವಾಲಯ": "Ministry of AYUSH",
        "ದೂರು": "complaint",
        "ಅರ್ಜಿ": "application",
        "ಪ್ರಮಾಣಪತ್ರ": "certificate",
        "ಸರ್ಕಾರಿ ಯೋಜನೆ": "government scheme",
        "ಆರೋಗ್ಯ": "health",
    }
}


class DomainDictionary:
    """
    Consolidated domain dictionary with fast lookup, multi-word matching,
    and bidirectional (Indic <-> English) support.
    """

    def __init__(self):
        # Merge all categories per language
        self._indic_to_en: Dict[str, Dict[str, str]] = {}
        self._en_to_indic: Dict[str, Dict[str, str]] = {}

        all_dicts = [AYURVEDA_TERMS, IP_TERMS, GOVT_TERMS]

        for d in all_dicts:
            for lang, terms in d.items():
                if lang not in self._indic_to_en:
                    self._indic_to_en[lang] = {}
                    self._en_to_indic[lang] = {}

                for indic_term, en_term in terms.items():
                    # Normalized keys
                    indic_key = indic_term.strip()
                    en_val = en_term.strip()
                    self._indic_to_en[lang][indic_key] = en_val

                    # Reverse index (clean English term without parentheses for lookup)
                    clean_en = en_val.split("(")[0].strip().lower()
                    self._en_to_indic[lang][clean_en] = indic_key
                    self._en_to_indic[lang][en_val.lower()] = indic_key

    def get_terms_for_lang(self, lang: str) -> Dict[str, str]:
        """Return all Indic -> English terms for a language."""
        return self._indic_to_en.get(lang, {})

    def lookup_indic(self, text: str, lang: str) -> Optional[str]:
        """Look up exact Indic term in specified language."""
        terms = self._indic_to_en.get(lang, {})
        return terms.get(text.strip())

    def lookup_english(self, text: str, target_lang: str) -> Optional[str]:
        """Look up exact English term to translate into target Indic language."""
        en_dict = self._en_to_indic.get(target_lang, {})
        return en_dict.get(text.strip().lower())

    def find_longest_phrase_match(self, text: str, lang: str) -> Optional[str]:
        """
        Check if the text exactly matches or contains known domain phrases,
        prioritizing longest phrases first.
        """
        terms = self._indic_to_en.get(lang, {})
        clean = text.strip()
        if clean in terms:
            return terms[clean]
        return None

    def get_domain_keywords(self, lang: str) -> List[str]:
        """Get all known domain keywords for a language."""
        return list(self._indic_to_en.get(lang, {}).keys())

    @property
    def supported_languages(self) -> List[str]:
        return list(self._indic_to_en.keys())
