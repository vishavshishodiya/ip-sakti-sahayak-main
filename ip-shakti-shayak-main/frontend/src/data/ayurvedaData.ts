import { CuriosityFact, SamhitaTreatise, TriviaItem, RagResponse } from '../types';

export const TRIVIA_LIST: TriviaItem[] = [
  {
    id: 1,
    text: "Ant mandibles (Bengal Ants) were used by Sushruta as natural surgical staples whose bodies were snipped, leaving the clamp intact.",
    source: "Sushruta Samhita, Sutrasthana"
  },
  {
    id: 2,
    text: "Ancient Vaidyas tested urine for diabetes ('Madhumeha') by observing if black ants were attracted to the patient's sample.",
    source: "Charaka Samhita, Nidanasthana Ch. 4"
  },
  {
    id: 3,
    text: "Sushruta designed over 125 distinct surgical instruments—including forceps modeled after the beaks of eagles, crows, and falcons.",
    source: "Sushruta Samhita, Sutrasthana Ch. 7 (Yantra Vidhi)"
  },
  {
    id: 4,
    text: "Water purification was executed using Moringa seeds, Copper chalices, and Vetiver roots thousands of years before active carbon filters.",
    source: "Sushruta Samhita, Sutrasthana Ch. 45"
  },
  {
    id: 5,
    text: "Ghee was aged for up to 100 years ('Kumbha Ghrita') and prescribed as a neuro-protective tonic capable of crossing the blood-brain barrier.",
    source: "Ashtanga Hridaya, Uttarasthana"
  },
  {
    id: 6,
    text: "Leech therapy (Jalaukavacharana) categorized 12 species of leeches into 6 poisonous and 6 medicinal varieties with exact feeding behaviors.",
    source: "Sushruta Samhita, Sutrasthana Ch. 13"
  }
];

export const CURIOSITY_FACTS: CuriosityFact[] = [
  {
    id: 'rhinoplasty',
    category: 'surgery',
    categoryLabel: 'Surgical Marvels',
    chronology: '600 BCE • Shalya Tantra',
    title: 'The World’s First Plastic Surgery (Rhinoplasty)',
    description: 'Acharya Sushruta recorded pedicle forehead flap rhinoplasty 2,600 years ago. When criminal amputations occurred, surgeons dissected living forehead skin, inverted the pedicle, molded wax prostheses, and sutured with live black ants whose snapping mandibles served as self-dissolving natural clamps.',
    shlokaSource: 'Sushruta Samhita, Sutrasthana 16',
    shlokaSanskrit: 'यथा नासाप्रमाणेन पत्रं च्छित्त्वा समाहितः... नासासंधानमेतत्ते संक्षेपात् कथितं मया ॥',
    shlokaTranslation: 'Fashioning the skin flap measured accurately by leaf pattern, placing it over the debrided nasal defect and suturing with precision.',
    ragPrompt: 'How did Sushruta perform forehead flap rhinoplasty in 600 BCE?',
    shareSnippet: "The World's First Plastic Surgery was documented in 600 BCE by Sushruta in India!"
  },
  {
    id: 'circadian',
    category: 'circadian',
    categoryLabel: 'Circadian Biology',
    chronology: '~1000 BCE • Dinacharya',
    title: 'Circadian Biology 3,000 Years Before Nobel Prize',
    description: 'The 2017 Nobel Prize in Medicine awarded molecular circadian rhythm mechanisms. Yet ancient Dinacharya texts had already divided the 24-hour solar arc into precise 4-hour cycles: Kapha (heavy/anabolic), Pitta (metabolic fire 10-2), and Vata (cellular catabolism/awakening 2-6), matching clock gene oscillations.',
    shlokaSource: 'Ashtanga Hridaya, Sutrasthana 2',
    shlokaSanskrit: 'ब्राह्मे मुहूर्ते उत्तिष्ठेत् स्वस्थो रक्षार्थमायुषः । शरीरचिन्तां निर्वर्त्य कृतशौचविधिस्ततः ॥',
    shlokaTranslation: 'One should awake during Brahma Muhurta (pre-dawn hour of Vata) to safeguard vitality and maintain systemic equilibrium.',
    ragPrompt: 'Explain the Vedic Dosha Clock vs modern circadian rhythm science.',
    shareSnippet: 'Ayurveda codified 4-hour Dosha circadian clocks 3 millennia before the 2017 Nobel Prize!',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu874zD0JhtgQO1UdTarA42v8fk3_uM52VrxpNyAAaRW915TSXlTEMyQUKC4IYwq9DBF8kRyQ7TEFy_HmFxfyMf1svDC-W33hgicZfqNjfHaQSafOvCmUsSN_rOygepWSBVL4O8nYOEUNrT83ftGZQLSbQRxodeCFEj899LreEuYuHts587MjvhLtCy98Ag1JCPHkSC2WKRibCHT6mEl1nxWJ6FmSPxj0gA62aSrrvp7xmvbjEZfBI0pNfXlcCES1q5Q'
  },
  {
    id: 'bhasmas',
    category: 'alchemy',
    categoryLabel: 'Herbal Alchemy',
    chronology: 'Rasashastra • <50 Nanometers',
    title: "Ancient Nanomedicine via 'Bhasma' Calcinations",
    description: "Centuries before synthetic nanotechnology, Rasashastra alchemists incinerated heavy minerals (Swarna/Gold, Rajata/Silver, Tamra/Copper) inside cow-dung kilns ('Puta') over 100 consecutive cycles with herbal extracts, yielding non-toxic, bio-compatible nanoparticles under 50nm that penetrate cellular walls.",
    shlokaSource: 'Rasa Ratna Samucchaya',
    shlokaSanskrit: 'वारितरं भवेद्यत्तु तद् भस्म श्रेष्ठमुच्यते । रेखापूर्णं च यत्सूक्ष्मं तत्प्रशस्तं प्रकीर्तितम् ॥',
    shlokaTranslation: 'The empirical standard of fineness: when incinerated metallic ash floats upon water (Varitaram) and fills fine dermatoglyphic finger ridges (Rekhapurna).',
    ragPrompt: 'What does modern electron microscopy reveal about Ayurvedic Swarna Bhasma?',
    shareSnippet: 'Ayurvedic Bhasma incineration created verifiable 50nm nanoparticles 1,200 years ago.'
  },
  {
    id: 'bioavailability',
    category: 'alchemy',
    categoryLabel: 'Herbal Alchemy',
    chronology: '700+ Taxa • Charaka Samhita',
    title: '700+ Plants with Bio-availability Synergies',
    description: 'Charaka categorized over 700 botanicals with explicit pharmacological synergy (Samyoga). For example, Trikatu (black pepper, long pepper, ginger) was prescribed alongside hard-to-absorb roots—millennia before contemporary pharmacology proved piperine enhances cellular bio-availability by up to 2000%.',
    shlokaSource: 'Charaka Samhita, Sutrasthana 4',
    shlokaSanskrit: 'षड्विरेचनशतानि भवन्ति... संयोगविभागाभ्यां द्रव्याणां कर्म सिध्यति ॥',
    shlokaTranslation: 'Therapeutic action succeeds by strategic combination and adjuvant division of herbs, magnifying potency exponentially.',
    ragPrompt: 'How does Trikatu work as a bio-enhancer according to Charaka and modern pharmacology?',
    shareSnippet: 'Ayurvedic Yogavahi principle predicted bio-enhancers 2,000 years before modern pharma discovered piperine enhancement!',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD27LFlxxNG5PvZjAtjumfgOrYk7KKLobswMA2m5U6mUpSKE3439FPKJAESzMD3a75BvHJJ-3jhCFWr6FG9YoeQhjnoO6hHYYZ-mwE_4cj9UmftEnoGtNDwSiAD3rox92s9iappbAJ91V7NWMJb4s6iN2S6LNJOoyH_V043RE7GWRc_62rLOJg8IzJsmbBRR4k7vagqLRTB1GI9ED60bJVIefnnKnVIzn9ZXrURPmKmKBUKZ5Bp9KDIQCRfJCTKMczQIw'
  },
  {
    id: 'gut-brain',
    category: 'microbiome',
    categoryLabel: 'Gut Microbiome',
    chronology: 'Agni & Ama • Gut Microbiome',
    title: 'The Gut-Brain Axis & Autoimmune Genesis',
    description: 'Western medicine only recently acknowledged the enteric nervous system ("second brain"). Ayurveda’s core maxim—"Rogah Sarvepi Mande Agnou"—explicitly stated that all chronic metabolic and neuro-affective diseases originate from impaired digestive fire (Mandagni) producing systemic endotoxins (Ama).',
    shlokaSource: 'Ashtanga Hridaya, Nidanasthana 12',
    shlokaSanskrit: 'रोगाः सर्वेऽपि मन्देऽग्नौ सुतरामुदराणि तु । मन्दाग्निश्चामदोषाणामुत्पत्तिस्थानमुच्यते ॥',
    shlokaTranslation: 'All systemic disorders arise primarily from defective metabolic fire, generating Ama which obstructs srotas (micro-channels).',
    ragPrompt: 'Correlate the Ayurvedic concept of Ama with modern endotoxemia and leaky gut syndrome.',
    shareSnippet: 'Ayurveda discovered the gut-brain axis 2,500 years ago with the principle Rogah Sarvepi Mande Agnou!'
  },
  {
    id: 'psychotherapy',
    category: 'circadian',
    categoryLabel: 'Cognitive Therapy',
    chronology: 'Satvavajaya • Cognitive Therapy',
    title: 'Non-Pharmacological Cognitive Therapy',
    description: 'Ayurveda classified mental wellness into three therapies: Yukti-Vyapashraya (pharmacology), Daiva-Vyapashraya (vibrational/ritual), and Satvavajaya Chikitsa. Satvavajaya served as the earliest structured psychotherapy: consciously restraining the mind from harmful sensory compulsions through cognitive appraisal.',
    shlokaSource: 'Charaka Samhita, Sutrasthana 11',
    shlokaSanskrit: 'सत्त्वावजयः पुनरहितेभ्योऽर्थेभ्यो मनोनिग्रहः । धीधैर्यात्मादिविज्ञानं मनोदोषौषधं परम् ॥',
    shlokaTranslation: 'Satvavajaya is the deliberate restraint of intellect and senses from detrimental attachments; clarity, fortitude, and self-knowledge are supreme remedies for the psyche.',
    ragPrompt: 'How did Charaka formulate Satvavajaya Chikitsa for affective cognitive disorders?',
    shareSnippet: 'Ayurveda formalized Satvavajaya—the earliest form of Cognitive Behavioral Restructuring—in 500 BCE.'
  }
];

export const CANONICAL_TREATISES: SamhitaTreatise[] = [
  {
    id: 'charaka',
    title: 'Charaka Saṁhitā',
    sanskritTitle: 'चरकसंहिता',
    author: 'Acharya Charaka & Agnivesha',
    period: 'Circa 1000 BCE - 300 BCE',
    scope: 'Kāya Cikitsā (Internal Medicine), Pharmacology, Diagnostics & Bioethics',
    sthanas: [
      {
        id: 'sutrasthana',
        name: 'Sūtrasthāna (General Principles)',
        sanskritName: 'सूत्रस्थानम्',
        description: 'Foundational doctrines, pharmacology (Dravyaguna), seasonal routines (Ritucharya), daily habits (Dinacharya), and ethics.',
        totalChapters: 30,
        chapters: [
          {
            id: 'ch-1',
            chapterNumber: 1,
            title: 'Dirghanjivitiya Adhyaya (Desire for Longevity)',
            sanskritTitle: 'दीर्घञ्जीवितीयोध्यायः',
            summary: 'Descent of Ayurveda from Brahma to Prajapati, Indra, and Bharadvaja; the triad of cause, symptom, and therapeutics (Hetu, Linga, Aushadha).',
            keyShloka: {
              sanskrit: 'हिताहितं सुखं दुःखमायुस्तस्य हिताहितम् । मानं च तच्च यत्रोक्तमायुर्वेदः स उच्यते ॥',
              transliteration: 'hitāhitaṁ sukhaṁ duḥkhamāyustasya hitāhitam | mānaṁ ca tacca yatroktamāyurvedaḥ sa ucyate ||',
              english: 'That wisdom is defined as Ayurveda wherein is described wholesome and unwholesome, happy and unhappy life, along with their parameters.'
            },
            clinicalRelevance: 'Defines the foundational scope of holistic medicine beyond disease suppression into holistic vitality (Ayu).'
          },
          {
            id: 'ch-6',
            chapterNumber: 6,
            title: 'Tasyashitiya Adhyaya (Seasonal Dietetics)',
            sanskritTitle: 'तस्याशितीयोध्यायः',
            summary: 'Comprehensive analysis of the six seasons (Shad Ritu), northern and southern solar solstices, and doshic accumulation/alleviation.',
            keyShloka: {
              sanskrit: 'ऋतौ ऋतौ यथोद्दिष्टं पथ्यं सेवेत मानवः । आहारं चेष्टितं चैव स सदा सुखमेधते ॥',
              transliteration: 'ṛtau ṛtau yathoddiṣṭaṁ pathyaṁ seveta mānavaḥ | āhāraṁ ceṣṭitaṁ caiva sa sadā sukhamedhate ||',
              english: 'One who adheres in each season to the diet and lifestyle prescribed specifically for that period flourishes in enduring health.'
            },
            clinicalRelevance: 'Predicts seasonal immunological dips (e.g. Varsha ritu mandagni) and guides prophylactic herbs like Ushira and Chandana.'
          }
        ]
      },
      {
        id: 'chikitsasthana',
        name: 'Cikitsāsthāna (Therapeutics & Clinical Pathology)',
        sanskritName: 'चिकित्सास्थानम्',
        description: 'Comprehensive treatment protocols for 30 major disease classes including Jvara (fevers), Rajayakshma, Grahani, and Rasayana (rejuvenation).',
        totalChapters: 30,
        chapters: [
          {
            id: 'ch-1-rasayana',
            chapterNumber: 1,
            title: 'Rasayana Adhyaya (Rejuvenation Science)',
            sanskritTitle: 'रसायनाध्यायः',
            summary: 'Protocols for cellular rejuvenation, free-radical mitigation, longevity, and memory enhancement with Cyavanaprasha and Brahma Rasayana.',
            keyShloka: {
              sanskrit: 'दीर्घमायुः स्मृतिं मेधामारोग्यं तरुणं वयः । प्रभां वर्णं स्वरौदार्यं देहेन्द्रियबलं परम् ॥',
              transliteration: 'dīrghamāyuḥ smṛtiṁ medhāmārogyaṁ taruṇaṁ vayaḥ | prabhāṁ varṇaṁ svaraudāryaṁ dehendriyabalaṁ param ||',
              english: 'From Rasayana therapy one gains long lifespan, heightened memory, sharp intellect, freedom from disorders, youthful vigor, radiant complexion, and supreme sensory strength.'
            },
            clinicalRelevance: 'Foundational framework for adaptogenic botanical therapy (Withania somnifera, Emblica officinalis).'
          },
          {
            id: 'ch-24-madatyaya',
            chapterNumber: 24,
            title: 'Madatyaya & Pitta Cikitsā (Heat Disorders & Cooling Protocols)',
            sanskritTitle: 'मदात्ययचिकित्सितम्',
            summary: 'Management of acute internal heat, metabolic combustion, and excessive Pitta vitiation with Shita Virya botanical infusions.',
            keyShloka: {
              sanskrit: 'शीतैः प्रदेहैः परिषेचनैश्च सुगन्धिभिर्वारिभिरुत्पलाद्यैः । प्रशाम्यते पित्तकृता विदाहाः सन्तापशान्तिश्च भवेन्नराणाम् ॥',
              transliteration: 'śītaiḥ pradehaiḥ pariṣecanaiśca sugandhibhirvāribhirutpalādyaiḥ | praśāmyate pittakṛtā vidāhāḥ santāpaśāntiśca bhavennarāṇām ||',
              english: 'Internal and external heat generated by fiery Pitta is alleviated through cooling paste applications, fragrant water infusions containing water lilies, sandal, and vetiver.'
            },
            clinicalRelevance: 'Prescribes earthenware water cooling, Ushirasava, and Chandana for heatstroke and hyperchlorhydria.'
          }
        ]
      }
    ]
  },
  {
    id: 'sushruta',
    title: 'Suśruta Saṁhitā',
    sanskritTitle: 'सुश्रुतसंहिता',
    author: 'Acharya Sushruta & Divodasa Dhanvantari',
    period: 'Circa 800 BCE - 600 BCE',
    scope: 'Śalya Tantra (Surgery), Anatomy (Śārīra), Toxicology & Operative Instrumentation',
    sthanas: [
      {
        id: 'sushruta-sutra',
        name: 'Sūtrasthāna (Surgical Fundamentals & Tools)',
        sanskritName: 'सूत्रस्थानम्',
        description: 'Surgical training, pre- and post-operative regimens, cautery (Agni Karma), alkaline therapeutics (Kshara Karma), and 125 instruments.',
        totalChapters: 46,
        chapters: [
          {
            id: 'su-ch-16',
            chapterNumber: 16,
            title: 'Karnavyadhana-Bandha-Vidhi (Reconstruction & Rhinoplasty)',
            sanskritTitle: 'कर्णव्यधबन्धविधिः',
            summary: 'Exact surgical protocol for nasal reconstruction via pedicle forehead flap, earlobe restoration, and surgical ant-head suture stapling.',
            keyShloka: {
              sanskrit: 'नासासंधानविधिना च्छिन्नं नासां प्रसाधयेत् । कपोलफलकादाच्छिद्य सजीवं मांसखण्डकम् ॥',
              transliteration: 'nāsāsaṁdhānavidhinā cchinnaṁ nāsāṁ prasādhayet | kapolaphalakādācchidya sajīvaṁ māṁsakhaṇḍakam ||',
              english: 'Repair the severed nose by plastic reconstruction: dissecting a living living flap from adjacent forehead/cheek tissue and suturing over reeds.'
            },
            clinicalRelevance: 'Globally acknowledged as the earliest documented rhinoplasty technique (Indian Forehead Flap).'
          }
        ]
      }
    ]
  },
  {
    id: 'vagbhata',
    title: 'Aṣṭāṅga Hṛdayam',
    sanskritTitle: 'अष्टाङ्गहृदयम्',
    author: 'Acharya Vagbhata',
    period: 'Circa 4th - 6th Century CE',
    scope: 'Harmonized synthesis of Charaka and Sushruta in poetic verse',
    sthanas: [
      {
        id: 'vag-sutra',
        name: 'Sūtrasthāna (Heart of Principles)',
        sanskritName: 'सूत्रस्थानम्',
        description: 'Essential daily hygiene, circadian rhythms, digestion physiology (Agni), and doshic equilibrium in concise metric poetry.',
        totalChapters: 30,
        chapters: [
          {
            id: 'vag-ch-2',
            chapterNumber: 2,
            title: 'Dinacaryā (Daily Regimen for Longevity)',
            sanskritTitle: 'दिनचर्याध्यायः',
            summary: 'Pre-dawn awakening (Brahma Muhurta), tongue scraping (Jihva Nirlekhana), oil pulling (Gandusha), herbal nasal drops (Nasya), and massage (Abhyanga).',
            keyShloka: {
              sanskrit: 'अभ्यङ्गमाचरेन्नित्यं स जराश्रमवातहा । दृष्टिप्रसादपुष्ट्यायुःस्वप्नसुत्वक्त्वदार्ढ्यकृत् ॥',
              transliteration: 'abhyaṅgamācarennityaṁ sa jarāśramavātahā | dṛṣṭiprasādapuṣṭyāyuḥsvapnasutvaktvadārḍhyakṛt ||',
              english: 'Perform daily warm oil massage (Abhyanga); it wards off old age, overcomes fatigue, pacifies Vata, improves vision, nourishes the body, promotes deep sleep, and enhances skin firmness.'
            },
            clinicalRelevance: 'Pre-clinical validation of transdermal lipid nutrient absorption and parasympathetic nervous activation.'
          }
        ]
      }
    ]
  }
];

export const CURATED_RAG_RESPONSES: Record<string, RagResponse> = {
  pitta: {
    query: "Remedies for Pitta imbalance in autumn or heat",
    title: "Classical Pitta Shamana Protocols (Pacifying Metabolic Fire)",
    summary: "In classical Ayurveda, elevated Pitta dosha manifests with excess heat, acid regurgitation, cutaneous inflammation, and irritability. Canonical management focuses on Tikta (bitter) and Madhura (sweet) rasa herbs with Shita Virya (cooling potency) that purify blood (Rakta Dhatu) without extinguishing digestive Agni.",
    treatiseReference: "Charaka Samhitā, Cikitsāsthāna Ch. 24 & Aṣṭāṅga Hṛdayam, Sūtrasthāna Ch. 13",
    shlokas: [
      {
        sanskrit: "पित्तस्य सर्पिषः पानं स्वादुशीतैर्विरेचनम् । स्वादुतिक्तकषायाणि भोजनानि च भेषजम् ॥",
        transliteration: "pittasya sarpiṣaḥ pānaṁ svāduśītairvirecanam | svādutiktakaṣāyāṇi bhojanāni ca bheṣajam ||",
        translation: "For pacifying aggravated Pitta: ingestion of medicated cow ghee (Tikta Ghrita), mild purgation with sweet-cooling adjuvants, and diets rich in sweet, bitter, and astringent tastes are paramount.",
        source: "Aṣṭāṅga Hṛdayam, Sūtrasthāna 13/9"
      }
    ],
    doshicImpact: {
      vata: "Neutral",
      pitta: "Pacifies",
      kapha: "Neutral",
      explanation: "Shita Virya (cooling potency) directly counteracts Ushna and Tikshna attributes of Pitta dosha, restoring mucosal homeostasis."
    },
    dravyaguna: {
      rasa: ["Tikta (Bitter)", "Madhura (Sweet)", "Kashaya (Astringent)"],
      guna: ["Laghu (Light)", "Snigdha (Unctuous / Soothing)", "Mrudu (Soft)"],
      virya: "Shita (Cooling)",
      vipaka: "Madhura (Sweet post-digestive effect)",
      prabhava: "Pitta-shamana & Raktaprasadana (Blood purifying)"
    },
    formulations: [
      {
        name: "Tikta Ghrita (Bitter Herbal Ghee)",
        ingredients: "Cow's Ghee infused with Neem, Kutki, Patola, Chandana, and Ushira",
        indications: "Acid peptic disorders, urticaria, liver heat, burning sensation",
        dosage: "10ml on empty stomach with warm milk or lukewarm water"
      },
      {
        name: "Shadanga Paniya (The 6-Herb Cooling Water)",
        ingredients: "Musta, Parpataka, Ushira, Chandana, Udichya, and Shunthi",
        indications: "Internal burning, excessive thirst, febrile heat",
        dosage: "Sip throughout the afternoon chilled in earthenware vessel"
      }
    ],
    lifestyleRegimen: [
      "Drink water naturally cooled in unglazed clay pots (Matka) infused with Vetiver (Khus) roots.",
      "Moonlight walking (Chandrika Sevana) in early evening to calm neuro-endocrine heat.",
      "Avoid pungent chili, fermented cheeses, excessive vinegar, and midday sun exposure.",
      "Apply pure sandalwood (Chandana) or rose water paste to forehead and temples."
    ],
    modernScience: {
      phytochemicals: "Santalols, Vetiverols, Picrosides, and Curcuminoids",
      mechanism: "Downregulates pro-inflammatory cytokines (TNF-alpha, IL-6), reduces gastric acid secretion, and scavenges reactive nitrogen species.",
      clinicalEvidence: "Randomized controlled trials confirm significant reduction in mucosal irritation and lipid peroxidation with classical bitter herb extracts."
    },
    precautions: "Do not extinguish Agni completely with ice; use room-temperature or earthenware clay-pot cooling rather than refrigerated ice.",
    suggestedQueries: [
      "How to reduce body heat and pitta with classical Ayurvedic herbs?",
      "What is Shadanga Paniya and how to prepare it?",
      "Dinacharya routines for Sharad Ritu (Autumn Pitta peak)"
    ]
  },
  ashwagandha: {
    query: "Scientific benefits of Ashwagandha in Charaka Samhita",
    title: "Ashwagandha (Withania somnifera) in Classical Rasayana Science",
    summary: "Acharya Charaka designates Ashwagandha as supreme among Balya (strength-promoting), Brimhana (tissue-building), and Rasayana (cellular longevity) botanicals. It possesses Madhura-Tikta-Kashaya tastes with Ushna virya that selectively nourishes Majja Dhatu (nervous tissue) and Shukra Dhatu.",
    treatiseReference: "Charaka Samhitā, Cikitsāsthāna Ch. 1 & Sūtrasthāna Ch. 4 (Balya Mahakashaya)",
    shlokas: [
      {
        sanskrit: "गन्धानुकृतिरस्या यद्वाजिगन्धैव कथ्यते । वाजीकरणमुख्या च क्षतक्षयविनाशिनी ॥",
        transliteration: "gandhānukṛtirasyā yadvājigandhaiva kathyate | vājīkaraṇamukhyā ca kṣatakṣayavināśinī ||",
        translation: "Its root aroma resembles a spirited steed; it bestows horse-like stamina, acts as a foremost virility adaptogen, and heals tissue emaciation.",
        source: "Bhavaprakasha Nighantu, Guduchyadi Varga"
      }
    ],
    doshicImpact: {
      vata: "Pacifies",
      pitta: "Mild Increase (if taken in excess)",
      kapha: "Pacifies",
      explanation: "Due to Ushna virya and Madhura vipaka, it deeply grounds erratic Vata in the nervous system while building muscle mass."
    },
    dravyaguna: {
      rasa: ["Tikta (Bitter)", "Kashaya (Astringent)", "Madhura (Sweet)"],
      guna: ["Laghu (Light)", "Snigdha (Soothing)"],
      virya: "Ushna (Mildly Heating)",
      vipaka: "Madhura (Sweet)",
      prabhava: "Balya, Medhya (Nootropic), Rasayana"
    },
    formulations: [
      {
        name: "Ashwagandharishta",
        ingredients: "Ashwagandha fermented decoction with Woodfordia, Dhataki, and warming spices",
        indications: "Nervous exhaustion, chronic fatigue, insomnia, memory fog",
        dosage: "15-20ml with equal quantity of water after meals"
      },
      {
        name: "Ashwagandha Ksheerapaka",
        ingredients: "3g root powder simmered in 1 part milk and 4 parts water until only milk remains",
        indications: "Anxiety, somatic tension, deep restorative sleep",
        dosage: "Warm cup before bedtime with nutmeg pinch"
      }
    ],
    lifestyleRegimen: [
      "Consume alongside cow's ghee or warm milk (Yogavahi lipid vehicle) to maximize blood-brain barrier transport.",
      "Combine with gentle evening Nadi Shodhana pranayama (alternate nostril breathing).",
      "Avoid taking when systemic Ama (metabolic toxins/coated tongue) is acute."
    ],
    modernScience: {
      phytochemicals: "Withanolides (Withaferin A, Withanolide D), Alkaloids (Withanine, Somniferine)",
      mechanism: "Modulates GABA-A receptor signaling, blunts hypothalamic-pituitary-adrenal (HPA) axis cortisol response by up to 28%, and promotes neurogenesis.",
      clinicalEvidence: "Dozens of double-blind, placebo-controlled human clinical trials validate stress reduction, VO2 max improvement, and enhanced restorative slow-wave sleep."
    },
    precautions: "Caution in acute hyperthyroidism and severe Pitta inflammation. Best paired with cooling anupana (milk/ghee) for Pitta constitutions.",
    suggestedQueries: [
      "How to prepare Ashwagandha Ksheerapaka at home?",
      "Brahmi vs Ashwagandha: when to use which for the mind?",
      "Can Ashwagandha be taken in summer without heating the body?"
    ]
  }
};
