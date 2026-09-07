import { AppLanguage } from '../types';

export interface TranslationDictionary {
  nav: {
    home: string;
    rag: string;
    curiosities: string;
    interestingFacts: string;
    samhitas: string;
    checkPrakriti: string;
    savedVerses: string;
    signIn: string;
    signOut: string;
    verifiedVaidya: string;
    guestVaidya: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroDesc: string;
    codifiedTag: string;
    herbologyTitle: string;
    herbologyDesc: string;
    ancientLineageTag: string;
    ancientLineageTitle: string;
    sutrasthanaTag: string;
    askWisdomTitle: string;
    askWisdomDesc: string;
    searchPlaceholder: string;
    searchButton: string;
    verifiedPromptsLabel: string;
    curatedPrompts: string[];
    bannerTag: string;
    bannerTitle: string;
    bannerDesc: string;
    bannerButton: string;
    pillarsHeading: string;
    pillarsSubtitle: string;
    pillar1Tag: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar1BadgeEn: string;
    pillar1BadgeHi: string;
    pillar2Tag: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar2Match: string;
    pillar3Tag: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar3Badge1: string;
    pillar3Badge2: string;
    stripTitle: string;
    stripDesc: string;
    treatiseCharaka: string;
    treatiseSushruta: string;
    treatiseAshtanga: string;
  };
  rag: {
    tag: string;
    activePrakriti: string;
    title: string;
    desc: string;
    headerTitle: string;
    headerDesc: string;
    placeholder: string;
    searchPlaceholder: string;
    canonicalFilter: string;
    canonicalFilterLabel: string;
    targetDosha: string;
    targetDoshaLabel: string;
    allTreatises: string;
    charaka: string;
    sushruta: string;
    ashtanga: string;
    nighantu: string;
    allDoshas: string;
    vataFocus: string;
    pittaFocus: string;
    kaphaFocus: string;
    scanning: string;
    scanningCanon: string;
    executeQuery: string;
    executeRagQuery: string;
    quickPromptsLabel: string;
    quickPrompts: string[];
    suggestedPromptsLabel: string;
    suggestedPrompts: string[];
    interrogatingEmbeddings: string;
    crossReferencingText: string;
    groundedTag: string;
    canonicalCitation: string;
    copyBtn: string;
    clinicalSynthesis: string;
    verifiedConsultation: string;
    noQueryYet: string;
    startExploring: string;
    canonicalVerses: string;
    chant: string;
    listenChant: string;
    copyVerse: string;
    bookmarkVerse: string;
    doshicImpact: string;
    vata: string;
    pitta: string;
    kapha: string;
    vataTitle: string;
    pittaTitle: string;
    kaphaTitle: string;
    pacifies: string;
    neutral: string;
    aggravates: string;
    doshicMechanism: string;
    dravyaguna: string;
    dravyagunaMatrix: string;
    rasa: string;
    guna: string;
    virya: string;
    vipaka: string;
    prabhava: string;
    formulations: string;
    recommendedFormulations: string;
    indications: string;
    indicationsLabel: string;
    dosage: string;
    dosageLabel: string;
    ingredients: string;
    ingredientsLabel: string;
    lifestyleRegimen: string;
    dinacharyaProtocols: string;
    modernCorrelation: string;
    modernConcordance: string;
    phytochemicals: string;
    phytochemicalsLabel: string;
    mechanism: string;
    mechanismLabel: string;
    clinicalEvidence: string;
    clinicalEvidenceLabel: string;
    precautions: string;
    precautionTitle: string;
    suggestedQueries: string;
    deepenInquiry: string;
    shareBtn: string;
    printBtn: string;
  };
  curiosities: {
    ribbonMotto: string;
    checkPrakritiBtn: string;
    title: string;
    desc: string;
    filterAll: string;
    categoryAll: string;
    categorySurgery: string;
    categoryCircadian: string;
    categoryAlchemy: string;
    categoryMicrobiome: string;
    bannerBadge: string;
    bannerTitle: string;
    bannerSubtitle: string;
    bannerDesc: string;
    stat1Label: string;
    stat2Label: string;
    stat3Label: string;
    manuscriptBadge: string;
    manuscriptTitle: string;
    manuscriptDesc: string;
    didYouKnow: string;
    nextFact: string;
    shlokaSource: string;
    askSahayak: string;
    shareFact: string;
    interactiveTitle: string;
    interactiveDesc: string;
    interactivePlaceholder: string;
    interactiveBtn: string;
    facts: Record<
      string,
      {
        categoryLabel: string;
        title: string;
        description: string;
        translation: string;
      }
    >;
    trivia: { text: string; source: string }[];
  };
  samhitas: {
    title: string;
    desc: string;
    searchPlaceholder: string;
    canonicalTreatisesLabel: string;
    sthanaLabel: string;
    chaptersLabel: string;
    treatiseInfo: string;
    period: string;
    scope: string;
    totalChapters: string;
    chapterOverview: string;
    keyShlokaTitle: string;
    clinicalRelevanceTitle: string;
    listenShloka: string;
    copyShloka: string;
    bookmarkShloka: string;
    askRagAboutChapter: string;
    treatiseMeta: Record<
      string,
      {
        title: string;
        author: string;
        scope: string;
        sthanaNames: Record<string, string>;
      }
    >;
  };
  prakriti: {
    title: string;
    subtitle: string;
    stepOf: string;
    resultTitle: string;
    resultSubtitle: string;
    saveBtn: string;
    retakeBtn: string;
    nextBtn: string;
    prevBtn: string;
    closeBtn: string;
    questions: {
      id: number;
      text: string;
      options: { label: string; dosha: 'Vata' | 'Pitta' | 'Kapha' }[];
    }[];
    descriptions: Record<string, string>;
  };
  bookmarks: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    listenBtn: string;
    copyBtn: string;
    removeBtn: string;
  };
  auth: {
    portalBadge: string;
    appTitle: string;
    appSubtitle: string;
    subtitle: string;
    registerTab: string;
    loginTab: string;
    passwordMethod: string;
    otpMethod: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    sendOtpBtn: string;
    sendingOtp: string;
    resendIn: string;
    resendCode: string;
    resendOtp: string;
    changeEmail: string;
    otpHelp: string;
    enterOtpLabel: string;
    enterOtpDesc: string;
    enterOtpTitle: string;
    enterOtpSubtitle: string;
    verifyAndRegisterBtn: string;
    verifyAndLoginBtn: string;
    loginWithPasswordBtn: string;
    verifyBtn: string;
    passwordSignIn: string;
    otpSignIn: string;
    loginBtn: string;
    verifying: string;
    guestBtn: string;
    continueAsGuest: string;
    guestNotice: string;
    alreadyHaveAccount: string;
    needAccount: string;
    switchLogin: string;
    switchRegister: string;
  };
  footer: {
    motto: string;
    mottoMeaning: string;
    shloka: string;
    translation: string;
    overviewTitle: string;
    overviewDesc: string;
    overviewBadge: string;
    concordanceTitle: string;
    concordanceDesc: string;
    concordanceBadge: string;
    portalsTitle: string;
    treatisePortals: string;
    charakaLink: string;
    sushrutaLink: string;
    ashtangaLink: string;
    bhavaprakashaLink: string;
    systemsTitle: string;
    systemTitle: string;
    ragLink: string;
    ragIngestion: string;
    curiositiesLink: string;
    knowledgeGraph: string;
    knowledgeGraphLink: string;
    engineText: string;
    engineTag: string;
    copyright: string;
    verifiedTag: string;
    openAccessTag: string;
  };
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDictionary> = {
  en: {
    nav: {
      home: 'Home',
      rag: 'AI Sahayak (RAG)',
      curiosities: 'Interesting Facts',
      interestingFacts: 'Interesting Facts',
      samhitas: 'Ayurvedic Samhitas',
      checkPrakriti: 'Prakriti Assessment',
      savedVerses: 'Saved Verses',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      verifiedVaidya: 'Verified Vaidya',
      guestVaidya: 'Guest Vaidya'
    },
    home: {
      heroTitle: 'IP-SAKTI Sahayak',
      heroSubtitle: 'Vedic Wisdom Meets Neural RAG • Authentic Ayurvedic Intelligence',
      heroDesc: 'Where 5,000 years of consecrated botanical pharmacology intersect with modern semantic retrieval. Direct canonical provenance, zero speculative dosha protocols.',
      codifiedTag: 'Codified Botanical Pharmacology',
      herbologyTitle: 'Authentic Herbology & Rasayana',
      herbologyDesc: 'Over 12,400 classical Sanskrit formulations cross-referenced against authoritative Dravyaguna characteristics and modern phytochemical assays.',
      ancientLineageTag: 'Ancient Lineage',
      ancientLineageTitle: 'Charaka, Sushruta & Vagbhata',
      sutrasthanaTag: 'Sūtrasthāna Section',
      askWisdomTitle: 'Inquire with Classical Wisdom',
      askWisdomDesc: 'Search 4.8 million verse embeddings with direct chapter-and-verse provenance.',
      searchPlaceholder: 'e.g., Remedies for Pitta imbalance in autumn, Ashwagandha in Charaka, Agni...',
      searchButton: 'Consult AI Sahayak',
      verifiedPromptsLabel: 'Or click a verified clinical question:',
      curatedPrompts: [
        'Remedies for Pitta imbalance in autumn or heat',
        'Scientific benefits of Ashwagandha in Charaka Samhita',
        'Dinacharya routines for monsoon (Varsha Ritu)',
        'How did Sushruta perform forehead flap rhinoplasty in 600 BCE?'
      ],
      bannerTag: 'Rasashastra & Surgical Curiosities',
      bannerTitle: 'Explore mind-blowing Ayurvedic facts: 5,000 years before modern medicine!',
      bannerDesc: 'Did you know Sushruta performed reconstructive rhinoplasty using living skin grafts in 600 BCE? Discover metallic calcification, circadian organ clocks, and microscopic pathology precursors.',
      bannerButton: 'Uncover Curiosities',
      pillarsHeading: 'Architectural Pillars of IP-SAKTI',
      pillarsSubtitle: 'Engineered specifically for clinical Vaidyas, academic researchers, and discerning health seekers.',
      pillar1Tag: 'Pillar I',
      pillar1Title: 'Bilingual Intelligence',
      pillar1Desc: 'Instant comprehension & responses in English and हिन्दी. Preserves sacred clinical terminology, untranslatable rasa-guna concepts, and poetic meter of classical metric shlokas without synthetic distortion.',
      pillar1BadgeEn: 'EN: Botanical Science',
      pillar1BadgeHi: 'HI: शास्त्रीय द्रव्यगुण',
      pillar2Tag: 'Pillar II',
      pillar2Title: 'RAG-Based Neural Engine',
      pillar2Desc: 'Retrieval-Augmented Generation that grounds every answer in classical codified texts with real-time vector search across 4.8 million shloka embeddings, cross-checked against authoritative Bhavaprakasha Nighantu commentaries.',
      pillar2Match: 'Cosine Vector Match: 0.982',
      pillar3Tag: 'Pillar III',
      pillar3Title: '100% Authenticated Information',
      pillar3Desc: 'Strict provenance verification directly citing Charaka Saṁhitā, Suśruta Saṁhitā, and Aṣṭāṅga Hṛdayam without hallucinations. Full verse, chapter, and commentary path references accompany every recommendation.',
      pillar3Badge1: 'Brihat Trayi Provenance',
      pillar3Badge2: 'Zero Hallucination',
      stripTitle: 'Explore Classical Texts directly',
      stripDesc: 'Navigate canonical verse concordances, Sanskrit shlokas, and critical commentaries.',
      treatiseCharaka: 'Charaka Saṁhitā',
      treatiseSushruta: 'Suśruta Saṁhitā',
      treatiseAshtanga: 'Aṣṭāṅga Hṛdayam'
    },
    rag: {
      tag: 'Neural RAG Studio • Canonical Ingestion',
      activePrakriti: 'Active User Prakriti',
      title: 'AI Sahayak RAG Engine',
      desc: 'Ask clinical questions, formulation recipes, or botanical interactions. Every answer is retrieved from 4.8 million Sanskrit verse embeddings and substantiated with chapter citations from Charaka, Sushruta, and Vagbhata.',
      headerTitle: 'AI Sahayak RAG Engine',
      headerDesc: 'Inquire into canonical Brihat Trayi databases with strict provenance and modern scientific correlation.',
      placeholder: 'Ask an Ayurvedic query e.g. remedies for pitta imbalance, ashwagandha indications, gut agni...',
      searchPlaceholder: 'Ask an Ayurvedic query e.g. remedies for pitta imbalance, ashwagandha indications, gut agni...',
      canonicalFilter: 'Canonical Filter:',
      canonicalFilterLabel: 'Canonical Filter:',
      targetDosha: 'Target Dosha:',
      targetDoshaLabel: 'Target Dosha:',
      allTreatises: 'All Brihat Trayi',
      charaka: 'Charaka Saṁhitā',
      sushruta: 'Suśruta Saṁhitā',
      ashtanga: 'Aṣṭāṅga Hṛdayam',
      nighantu: 'Bhāvaprakāśa Nighaṇṭu',
      allDoshas: 'All Doshas',
      vataFocus: 'Vāta Focus',
      pittaFocus: 'Pitta Focus',
      kaphaFocus: 'Kapha Focus',
      scanning: 'Scanning Canon...',
      scanningCanon: 'Scanning Canon...',
      executeQuery: 'Execute RAG Query',
      executeRagQuery: 'Execute RAG Query',
      quickPromptsLabel: 'Or explore verified clinical inquiries:',
      suggestedPromptsLabel: 'Or explore verified clinical inquiries:',
      quickPrompts: [
        'Remedies for Pitta imbalance in autumn or heat',
        'Scientific benefits of Ashwagandha in Charaka Samhita',
        'Dinacharya routines for monsoon (Varsha Ritu)',
        'How did Sushruta perform forehead flap rhinoplasty in 600 BCE?',
        'What does modern electron microscopy reveal about Ayurvedic Swarna Bhasma?',
        'Correlate the Ayurvedic concept of Ama with modern endotoxemia'
      ],
      suggestedPrompts: [
        'Remedies for Pitta imbalance in autumn or heat',
        'Scientific benefits of Ashwagandha in Charaka Samhita',
        'Dinacharya routines for monsoon (Varsha Ritu)',
        'How did Sushruta perform forehead flap rhinoplasty in 600 BCE?',
        'What does modern electron microscopy reveal about Ayurvedic Swarna Bhasma?',
        'Correlate the Ayurvedic concept of Ama with modern endotoxemia'
      ],
      interrogatingEmbeddings: 'Interrogating 4.8M Sanskrit Shloka Embeddings...',
      crossReferencingText: 'Cross-referencing Brihat Trayi root manuscripts against classical commentaries...',
      groundedTag: 'Brihat Trayi Grounded',
      canonicalCitation: 'Canonical Citation',
      copyBtn: 'Copy Consultation',
      clinicalSynthesis: 'Clinical Synthesis & Therapeutic Protocol',
      verifiedConsultation: 'Verified Canonical Consultation',
      noQueryYet: 'Ready for Clinical Consultation',
      startExploring: 'Enter a therapeutic query above or choose a curated topic to inspect verified Brihat Trayi citations.',
      canonicalVerses: 'Canonical Shloka Verses & Root Evidence',
      chant: 'Chant',
      listenChant: 'Recite Shloka',
      copyVerse: 'Copy Verse',
      bookmarkVerse: 'Save Verse',
      doshicImpact: 'Doshic Equilibrium & Thermodynamic Impact',
      vata: 'Vāta Dosha',
      pitta: 'Pitta Dosha',
      kapha: 'Kapha Dosha',
      vataTitle: 'Vāta Dosha',
      pittaTitle: 'Pitta Dosha',
      kaphaTitle: 'Kapha Dosha',
      pacifies: 'Pacifies (Shamana)',
      neutral: 'Neutral (Sama)',
      aggravates: 'Aggravates (Prakopa)',
      doshicMechanism: 'Doshic Mechanism & Pathogenesis',
      dravyaguna: 'Dravyaguna Pharmacology Matrix',
      dravyagunaMatrix: 'Dravyaguna Pharmacological Matrix',
      rasa: 'Rasa (Tastes)',
      guna: 'Guṇa (Attributes)',
      virya: 'Vīrya (Potency)',
      vipaka: 'Vipāka (Post-Digestive)',
      prabhava: 'Prabhāva (Special Action)',
      formulations: 'Canonical Ayurvedic Formulations',
      recommendedFormulations: 'Canonical Formulations & Recipes',
      indications: 'Indications',
      indicationsLabel: 'Indications',
      dosage: 'Classical Dosage',
      dosageLabel: 'Dosage',
      ingredients: 'Constituent Herbs',
      ingredientsLabel: 'Constituent Herbs',
      lifestyleRegimen: 'Dinacharya & Lifestyle Directives',
      dinacharyaProtocols: 'Dinacharya & Lifestyle Regimen',
      modernCorrelation: 'Modern Biomedical & Phytochemical Correlation',
      modernConcordance: 'Modern Scientific & Phytochemical Concordance',
      phytochemicals: 'Bioactive Phytochemicals',
      phytochemicalsLabel: 'Phytochemicals',
      mechanism: 'Pharmacological Mechanism of Action',
      mechanismLabel: 'Mechanism of Action',
      clinicalEvidence: 'Peer-Reviewed Clinical Evidence',
      clinicalEvidenceLabel: 'Clinical Evidence',
      precautions: 'Clinical Contraindications & Precautions',
      precautionTitle: 'Precautions & Contraindications',
      suggestedQueries: 'Further Canonical Inquiries',
      deepenInquiry: 'Deepen Inquiry with AI Sahayak',
      shareBtn: 'Share Analysis',
      printBtn: 'Print Clinical Sheet'
    },
    curiosities: {
      ribbonMotto: 'Vedic Science Ahead of Its Time • Proven by Modern Biomedical Research',
      checkPrakritiBtn: 'Determine Your Dosha Constitution (Prakriti)',
      title: 'Ayurvedic Curiosities & Scientific Revelations',
      desc: 'Explore authenticated historical milestones where classical Vaidyas foreshadowed surgical techniques, circadian clocks, nanotechnology, and microbiology millennia prior to modern recognition.',
      filterAll: 'All Curiosities',
      categoryAll: 'All Curiosities',
      categorySurgery: 'Surgical Marvels',
      categoryCircadian: 'Circadian Biology',
      categoryAlchemy: 'Metallic Nanomedicine',
      categoryMicrobiome: 'Microbiome & Pathology',
      bannerBadge: 'Millennia Ahead of Modern Medicine',
      bannerTitle: 'Ayurvedic Curiosities & Scientific Revelations',
      bannerSubtitle: 'Codified in Sanskrit Thousands of Years Ago',
      bannerDesc: 'Explore authenticated historical milestones where classical Vaidyas foreshadowed surgical techniques, circadian clocks, nanotechnology, and microbiology millennia prior to modern recognition.',
      stat1Label: 'Nanomedicine Scale',
      stat2Label: 'Surgical Instruments',
      stat3Label: 'Before Nobel Prize',
      manuscriptBadge: 'Archival Manuscript',
      manuscriptTitle: 'The Sushruta & Charaka Manuscripts',
      manuscriptDesc: 'Written in classical Devanagari and Sharada scripts on Bhojapatra (birch bark) and palm leaves, preserving meticulous clinical knowledge across generations.',
      didYouKnow: 'Vaidya Historical Trivia',
      nextFact: 'Next Trivia',
      shlokaSource: 'Canonical Source',
      askSahayak: 'Query AI Sahayak',
      shareFact: 'Share Discovery',
      interactiveTitle: 'Have an Ayurvedic Curiosity to Verify?',
      interactiveDesc: 'Ask AI Sahayak to cross-examine any ancient Ayurvedic claim against both classical Sanskrit manuscripts and modern clinical trials.',
      interactivePlaceholder: 'e.g., How does copper water (Tamra Jal) kill pathogenic bacteria?',
      interactiveBtn: 'Verify with Canon',
      facts: {
        rhinoplasty: {
          categoryLabel: 'Surgical Marvels',
          title: "The World's First Plastic Surgery (Rhinoplasty)",
          description: 'Acharya Sushruta recorded pedicle forehead flap rhinoplasty 2,600 years ago. When criminal amputations occurred, surgeons dissected living forehead skin, inverted the pedicle, molded wax prostheses, and sutured with live black ants whose snapping mandibles served as self-dissolving natural clamps.',
          translation: 'Fashioning the skin flap measured accurately by leaf pattern, placing it over the debrided nasal defect and suturing with precision.'
        },
        circadian: {
          categoryLabel: 'Circadian Biology',
          title: 'Circadian Biology 3,000 Years Before Nobel Prize',
          description: 'The 2017 Nobel Prize in Medicine awarded molecular circadian rhythm mechanisms. Yet ancient Dinacharya texts had already divided the 24-hour solar arc into precise 4-hour cycles: Kapha (heavy/anabolic), Pitta (metabolic fire 10-2), and Vata (cellular catabolism/awakening 2-6), matching clock gene oscillations.',
          translation: 'One should awake during Brahma Muhurta (pre-dawn hour of Vata) to safeguard vitality and maintain systemic equilibrium.'
        },
        bhasmas: {
          categoryLabel: 'Metallic Nanomedicine',
          title: "Ancient Nanomedicine via 'Bhasma' Calcinations",
          description: "Centuries before synthetic nanotechnology, Rasashastra alchemists incinerated heavy minerals (Swarna/Gold, Rajata/Silver, Tamra/Copper) inside cow-dung kilns ('Puta') over 100 consecutive cycles with herbal extracts, yielding non-toxic, bio-compatible nanoparticles under 50nm that penetrate cellular walls.",
          translation: 'The empirical standard of fineness: when incinerated metallic ash floats upon water (Varitaram) and fills fine dermatoglyphic finger ridges (Rekhapurna).'
        },
        alchemy: {
          categoryLabel: 'Metallic Nanomedicine',
          title: 'Swarna Bhasma: Ancient Gold Nanotechnology',
          description: 'Rasashastra metallurgists subjected gold foils to dozens of Puta (herbal calcination cycles above 900°C) with aloe vera and mercury sulfur complexes. Modern high-resolution transmission electron microscopy (HR-TEM) reveals particles sized 20–50 nanometers, capable of crossing cell membranes as immunostimulants.',
          translation: 'Purified calcined gold is rejuvenating, pacifies all three doshas, improves memory and intellect, and acts as an ultimate antidote to poisons.'
        },
        bioavailability: {
          categoryLabel: 'Herbal Alchemy',
          title: '700+ Plants with Bio-availability Synergies',
          description: 'Charaka categorized over 700 botanicals with explicit pharmacological synergy (Samyoga). For example, Trikatu (black pepper, long pepper, ginger) was prescribed alongside hard-to-absorb roots—millennia before contemporary pharmacology proved piperine enhances cellular bio-availability by up to 2000%.',
          translation: 'Therapeutic action succeeds by strategic combination and adjuvant division of herbs, magnifying potency exponentially.'
        },
        microbiome: {
          categoryLabel: 'Microbiome & Pathology',
          title: 'Krimi Roga: Invisible Pathogens & Gut Flora',
          description: 'Sushruta described twenty classes of Krimi (organisms), noting that some are visible (Drishya) while others are subtle and invisible (Adrishya) living in blood, lymphatic fluid, and intestines. He recommended specific antimicrobial herbs like Vidanga and Kutaja to restore microbial balance.',
          translation: 'Organisms born of mucous secretions and blood are minuscule, circular, headless, and invisible to naked perception.'
        },
        'gut-brain': {
          categoryLabel: 'Gut Microbiome',
          title: 'The Gut-Brain Axis & Autoimmune Genesis',
          description: 'Western medicine only recently acknowledged the enteric nervous system (\'second brain\'). Ayurveda’s core maxim—\'Rogah Sarvepi Mande Agnou\'—explicitly stated that all chronic metabolic and neuro-affective diseases originate from impaired digestive fire (Mandagni) producing systemic endotoxins (Ama).',
          translation: 'All systemic disorders arise primarily from defective metabolic fire, generating Ama which obstructs srotas (micro-channels).'
        },
        psychotherapy: {
          categoryLabel: 'Cognitive Therapy',
          title: 'Non-Pharmacological Cognitive Therapy',
          description: 'Ayurveda classified mental wellness into three therapies: Yukti-Vyapashraya (pharmacology), Daiva-Vyapashraya (vibrational/ritual), and Satvavajaya Chikitsa. Satvavajaya served as the earliest structured psychotherapy: consciously restraining the mind from harmful sensory compulsions through cognitive appraisal.',
          translation: 'Satvavajaya is the deliberate restraint of intellect and senses from detrimental attachments; clarity, fortitude, and self-knowledge are supreme remedies for the psyche.'
        }
      },
      trivia: [
        {
          text: 'Ant mandibles (Bengal Ants) were used by Sushruta as natural surgical staples whose bodies were snipped, leaving the clamp intact.',
          source: 'Sushruta Samhita, Sutrasthana'
        },
        {
          text: "Ancient Vaidyas tested urine for diabetes ('Madhumeha') by observing if black ants were attracted to the patient's sample.",
          source: 'Charaka Samhita, Nidanasthana Ch. 4'
        },
        {
          text: 'Sushruta designed over 125 distinct surgical instruments—including forceps modeled after the beaks of eagles, crows, and falcons.',
          source: 'Sushruta Samhita, Sutrasthana Ch. 7 (Yantra Vidhi)'
        },
        {
          text: 'Water purification was executed using Moringa seeds, Copper chalices, and Vetiver roots thousands of years before active carbon filters.',
          source: 'Sushruta Samhita, Sutrasthana Ch. 45'
        },
        {
          text: "Ghee was aged for up to 100 years ('Kumbha Ghrita') and prescribed as a neuro-protective tonic capable of crossing the blood-brain barrier.",
          source: 'Ashtanga Hridaya, Uttarasthana'
        },
        {
          text: 'Leech therapy (Jalaukavacharana) categorized 12 species of leeches into 6 poisonous and 6 medicinal varieties with exact feeding behaviors.',
          source: 'Sushruta Samhita, Sutrasthana Ch. 13'
        }
      ]
    },
    samhitas: {
      title: 'Ayurvedic Samhitas (The Brihat Trayi Canon)',
      desc: 'Browse chapter-by-chapter canonical texts with verse transliterations, authentic commentaries, and clinical relevance validated by centuries of Vaidya practice.',
      searchPlaceholder: 'Search verses, chapters, or concepts (e.g., Dinacharya, Agni, Vamana)...',
      canonicalTreatisesLabel: 'Canonical Treatises:',
      sthanaLabel: 'Treatise Sthāna (Section):',
      chaptersLabel: 'Canonical Chapters:',
      treatiseInfo: 'Treatise Details',
      period: 'Period',
      scope: 'Discipline',
      totalChapters: 'Total Chapters',
      chapterOverview: 'Chapter Overview & Summary',
      keyShlokaTitle: 'Foundational Root Shloka',
      clinicalRelevanceTitle: 'Modern Clinical Relevance',
      listenShloka: 'Listen to Shloka Chant',
      copyShloka: 'Copy Shloka',
      bookmarkShloka: 'Save Shloka',
      askRagAboutChapter: 'Inquire with AI Sahayak on this Chapter',
      treatiseMeta: {
        charaka: {
          title: 'Charaka Saṁhitā',
          author: 'Acharya Charaka / Agnivesha',
          scope: 'Kāya Cikitsā (Internal Medicine)',
          sthanaNames: {
            sutrasthana: 'Sūtrasthāna (General Principles)',
            nidanasthana: 'Nidānasthāna (Pathology & Diagnosis)',
            chikitsasthana: 'Cikitsāsthāna (Therapeutics & Protocols)'
          }
        },
        sushruta: {
          title: 'Suśruta Saṁhitā',
          author: 'Acharya Sushruta / Divodasa Dhanvantari',
          scope: 'Śalya Tantra (Surgery & Anatomy)',
          sthanaNames: {
            'su-sutra': 'Sūtrasthāna (Surgical Doctrine & Instruments)',
            'su-sarira': 'Śārīrasthāna (Anatomy & Embryology)'
          }
        },
        ashtanga: {
          title: 'Aṣṭāṅga Hṛdayam',
          author: 'Acharya Vagbhata',
          scope: 'Complete 8 Branches of Classical Ayurveda',
          sthanaNames: {
            'vag-sutra': 'Sūtrasthāna (Heart of Principles)'
          }
        }
      }
    },
    prakriti: {
      title: 'Ayurvedic Prakriti (Dosha) Assessment',
      subtitle: 'Identify your baseline constitutional blueprint according to classical Tridosha principles.',
      stepOf: 'Question',
      resultTitle: 'Your Predominant Constitution',
      resultSubtitle: 'Understanding your constitutional baseline helps AI Sahayak tailor every diet and herb recommendation.',
      saveBtn: 'Save Prakriti & Personalize AI',
      retakeBtn: 'Retake Assessment',
      nextBtn: 'Next Question',
      prevBtn: 'Previous',
      closeBtn: 'Close',
      questions: [
        {
          id: 1,
          text: 'Body Frame & Physical Build:',
          options: [
            { label: 'Slender, lean, difficulty gaining weight, prominent joints', dosha: 'Vata' },
            { label: 'Medium, symmetrical, athletic, moderate muscle tone', dosha: 'Pitta' },
            { label: 'Broad, sturdy, easily gains weight, strong bone structure', dosha: 'Kapha' }
          ]
        },
        {
          id: 2,
          text: 'Metabolism, Digestion & Appetite (Agni):',
          options: [
            { label: 'Irregular (Vishamagni)—sometimes starving, sometimes forgetting to eat', dosha: 'Vata' },
            { label: 'Sharp & Intense (Tikshnagni)—cannot skip meals without irritability/heat', dosha: 'Pitta' },
            { label: 'Slow & Steady (Mandagni)—moderate hunger, slow digestion, easily skips meals', dosha: 'Kapha' }
          ]
        },
        {
          id: 3,
          text: 'Temperature & Climate Preference:',
          options: [
            { label: 'Dislikes cold, dry, and windy conditions; loves warm baths & sunshine', dosha: 'Vata' },
            { label: 'Dislikes heat, humidity, and direct sun; loves cool breezes & water', dosha: 'Pitta' },
            { label: 'Dislikes cold and damp rainy weather; prefers dry warmth and active movement', dosha: 'Kapha' }
          ]
        },
        {
          id: 4,
          text: 'Mind, Mental Rhythm & Stress Reaction:',
          options: [
            { label: 'Quick thinker, creative, prone to anxiety, worry, or restless thoughts', dosha: 'Vata' },
            { label: 'Analytical, organized, decisive, prone to impatience, anger, or perfectionism', dosha: 'Pitta' },
            { label: 'Calm, grounded, patient, resistant to change, slow to anger', dosha: 'Kapha' }
          ]
        },
        {
          id: 5,
          text: 'Sleep Pattern & Dream Quality:',
          options: [
            { label: 'Light, interrupted sleeper, active dreaming of flying, motion, or wandering', dosha: 'Vata' },
            { label: 'Moderate, sound sleeper, dreams of vivid colors, passion, fire, or problem-solving', dosha: 'Pitta' },
            { label: 'Heavy, deep sleeper, difficult to awaken, calm dreams of water, nature, or clouds', dosha: 'Kapha' }
          ]
        }
      ],
      descriptions: {
        Vata: 'Governed by Air and Ether elements. Characterized by mobility, lightness, creativity, and rapid change. Focus on grounding foods, warm oils (Abhyanga), and regular circadian rhythm.',
        Pitta: 'Governed by Fire and Water elements. Characterized by heat, metabolism, sharp intellect, and transformation. Focus on cooling foods, moderation, sweet-bitter flavors, and calming meditation.',
        Kapha: 'Governed by Earth and Water elements. Characterized by stability, lubrication, strength, and endurance. Focus on warming spices, vigorous physical exercise, and light, invigorating nutrition.'
      }
    },
    bookmarks: {
      title: 'Saved Verses & Shlokas',
      emptyTitle: 'No verses bookmarked yet',
      emptyDesc: 'While exploring RAG consultations or Samhitas, tap the bookmark icon on any Sanskrit shloka to save it here for offline contemplation.',
      listenBtn: 'Chant',
      copyBtn: 'Copy',
      removeBtn: 'Remove'
    },
    auth: {
      portalBadge: 'Classical Ayur-Informatics • Brihat Trayi Canon',
      appTitle: 'IP-SAKTI Sahayak',
      appSubtitle: 'Authentic Classical Ayurvedic Intelligence & Retrieval Portal',
      subtitle: 'Authentic Classical Ayurvedic Intelligence & Retrieval Portal',
      registerTab: 'Register & Verify',
      loginTab: 'Sign In',
      passwordMethod: 'Password',
      otpMethod: 'Email OTP',
      fullNameLabel: 'Full Name / Vaidya Designation',
      fullNamePlaceholder: 'e.g. Acharya Rahul Sharma',
      emailLabel: 'Email Address',
      emailPlaceholder: 'vaidya@ipsakti.ai',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your secure password',
      sendOtpBtn: 'Send 6-Digit Verification Code',
      sendingOtp: 'Sending Verification Code...',
      resendIn: 'Resend code in',
      resendCode: 'Resend Code',
      resendOtp: 'Resend Code',
      changeEmail: 'Change Email',
      otpHelp: 'Check your spam/junk folder if the verification code does not arrive within a minute.',
      enterOtpLabel: 'Enter 6-Digit Verification Code',
      enterOtpDesc: 'We sent a verification code to your email. Enter it below to confirm your address.',
      enterOtpTitle: 'Enter 6-Digit Verification Code',
      enterOtpSubtitle: 'We sent a verification code to your email. Enter it below to confirm your address.',
      verifyAndRegisterBtn: 'Verify Email & Create Account',
      verifyAndLoginBtn: 'Verify Code & Sign In',
      loginWithPasswordBtn: 'Sign In with Password',
      verifyBtn: 'Verify Email & Create Account',
      passwordSignIn: 'Sign In with Password',
      otpSignIn: 'Sign In with Email OTP',
      loginBtn: 'Sign In',
      verifying: 'Verifying with Canon...',
      guestBtn: 'Explore as Guest Vaidya',
      continueAsGuest: 'Explore as Guest Vaidya',
      guestNotice: 'Guest mode grants instant access without email verification.',
      alreadyHaveAccount: 'Already have an account?',
      needAccount: "Don't have an account?",
      switchLogin: 'Sign In here',
      switchRegister: 'Create one with Email Verification'
    },
    footer: {
      motto: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।',
      mottoMeaning: 'May all sentient beings dwell in wellness, serenity, and balance.',
      shloka: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद् दुःखभाग्भवेत् ॥',
      translation: 'May all beings be at peace, free from affliction, perceiving goodness in all things.',
      overviewTitle: 'Canonical Samhita Concordance',
      overviewDesc: 'Verified computational indexing founded upon the Brihat Trayi: the foundational treatises of Charaka Saṁhitā, Suśruta Saṁhitā, and Aṣṭāṅga Hṛdayam (Vagbhata). All interpretations preserve authentic rasa, virya, vipaka, and prabhava formulations without synthetic distortions.',
      overviewBadge: 'Brihat Trayi Grounded Retrieval • Zero Hallucination Standard',
      concordanceTitle: 'Canonical Samhita Concordance',
      concordanceDesc: 'Verified computational indexing founded upon the Brihat Trayi: the foundational treatises of Charaka Saṁhitā, Suśruta Saṁhitā, and Aṣṭāṅga Hṛdayam (Vagbhata). All interpretations preserve authentic rasa, virya, vipaka, and prabhava formulations without synthetic distortions.',
      concordanceBadge: 'Brihat Trayi Grounded Retrieval • Zero Hallucination Standard',
      portalsTitle: 'Treatise Portals',
      treatisePortals: 'Treatise Portals',
      charakaLink: 'Charaka Saṁhitā',
      sushrutaLink: 'Suśruta Saṁhitā',
      ashtangaLink: 'Aṣṭāṅga Hṛdayam',
      bhavaprakashaLink: 'Bhāvaprakāśa Nighaṇṭu',
      systemsTitle: 'Intelligent Systems',
      systemTitle: 'Intelligent Systems',
      ragLink: 'AI Sahayak RAG Studio',
      ragIngestion: 'Classical RAG Ingestion',
      curiositiesLink: 'Curiosities & Rasashāstra',
      knowledgeGraph: 'Vaidya Knowledge Graph',
      knowledgeGraphLink: 'Vaidya Knowledge Graph',
      engineText: 'Engine: Gemini 3.8 Flash + Sanskrit Embeddings',
      engineTag: 'Engine: Gemini 3.8 Flash + Vector Ingestion',
      copyright: '© 2024 IP-SAKTI Sahayak. Preserving Vedic Clinical Science with Modern Computation.',
      verifiedTag: 'CCRAS & Ayush Aligned',
      openAccessTag: 'Open Classical Access'
    }
  },
  hi: {
    nav: {
      home: 'मुख्य पृष्ठ',
      rag: 'एआई सहायक (RAG)',
      curiosities: 'रोचक तथ्य',
      interestingFacts: 'रोचक तथ्य',
      samhitas: 'आयुर्वेदिक संहिताएं',
      checkPrakriti: 'प्रकृति परीक्षण (दोष)',
      savedVerses: 'सुरक्षित श्लोक',
      signIn: 'लॉग इन करें',
      signOut: 'लॉग आउट',
      verifiedVaidya: 'सत्यापित वैद्य',
      guestVaidya: 'अतिथि वैद्य'
    },
    home: {
      heroTitle: 'आईपी-शक्ति सहायक',
      heroSubtitle: 'वैदिक ज्ञान एवं RAG एआई का संगम • प्रामाणिक आयुर्वेदिक मेधा',
      heroDesc: '5,000 वर्ष पुराने पवित्र पादप विज्ञान एवं आधुनिक सिमेंटिक खोज का संगम। सीधे मूल संहिता संदर्भ, बिना किसी भ्रामक दोष प्रोटोकॉल के।',
      codifiedTag: 'संहिताबद्ध पादप विज्ञान',
      herbologyTitle: 'प्रामाणिक वनस्पति विज्ञान एवं रसायन',
      herbologyDesc: '12,400 से अधिक संस्कृत योग, द्रव्यगुण विशेषताओं एवं आधुनिक औषध विज्ञान के साथ संरेखित।',
      ancientLineageTag: 'प्राचीन परंपरा',
      ancientLineageTitle: 'चरक, सुश्रुत एवं वाग्भट',
      sutrasthanaTag: 'सूत्रस्थानम् अनुभाग',
      askWisdomTitle: 'शास्त्रीय ज्ञान से परामर्श करें',
      askWisdomDesc: '48 लाख श्लोक एम्बेडिंग्स में अध्याय एवं श्लोक के सटीक संदर्भों सहित खोजें।',
      searchPlaceholder: 'उदा. शरद अथवा ग्रीष्म में पित्त असंतुलन के उपाय, चरक में अश्वगंधा, अग्नि...',
      searchButton: 'एआई सहायक से परामर्श करें',
      verifiedPromptsLabel: 'अथवा अनुशंसित नैदानिक प्रश्नों में से चुनें:',
      curatedPrompts: [
        'शरद अथवा ग्रीष्म में पित्त असंतुलन के उपाय',
        'चरक संहिता में अश्वगंधा के वैज्ञानिक लाभ',
        'वर्षा ऋतु के लिए शास्त्रीय दिनचर्या',
        'सुश्रुत ने 600 ईसा पूर्व में राइनोप्लास्टी कैसे की?'
      ],
      bannerTag: 'रसशास्त्र एवं शल्य चमत्कार',
      bannerTitle: 'अद्भुत आयुर्वेदिक तथ्यों का अन्वेषण करें: आधुनिक चिकित्सा से 5,000 वर्ष पूर्व!',
      bannerDesc: 'क्या आप जानते हैं कि महर्षि सुश्रुत ने 600 ईसा पूर्व में जीवित त्वचा ग्राफ्ट द्वारा नासिका पुनर्निर्माण (राइनोप्लास्टी) किया था? धातु भस्म, जैविक घड़ी तथा सूक्ष्म जीव विज्ञान के मूल सिद्धांतों को जानें।',
      bannerButton: 'रहस्य जानें',
      pillarsHeading: 'आईपी-शक्ति के आधारभूत स्तंभ',
      pillarsSubtitle: 'विशेष रूप से नैदानिक वैद्यों, शोधकर्ताओं तथा स्वास्थ्य जिज्ञासुओं के लिए निर्मित।',
      pillar1Tag: 'स्तंभ १',
      pillar1Title: 'द्विभाषी बुद्धिमत्ता',
      pillar1Desc: 'अंग्रेजी और हिन्दी में तात्कालिक बोध एवं उत्तर। शास्त्रीय शब्दों, रस-गुण-वीर्य-विपाक की अवधारणाओं तथा मूल श्लोकों के छंद को बिना विकृति के सुरक्षित रखता है।',
      pillar1BadgeEn: 'EN: Botanical Science',
      pillar1BadgeHi: 'HI: शास्त्रीय द्रव्यगुण',
      pillar2Tag: 'स्तंभ २',
      pillar2Title: 'RAG-आधारित न्यूरल इंजन',
      pillar2Desc: 'रिट्रीवल-ऑगमेंटेड जनरेशन (RAG) जो 48 लाख संस्कृत श्लोकों में वेक्टर खोज करके भावप्रकाश निघण्टु आदि प्रामाणिक ग्रंथों से मिलान कर सटीक उत्तर प्रस्तुत करता है।',
      pillar2Match: 'वेक्टर मिलान स्कोर: 0.982',
      pillar3Tag: 'स्तंभ ३',
      pillar3Title: '100% प्रामाणिक जानकारी',
      pillar3Desc: 'चरक संहिता, सुश्रुत संहिता एवं अष्टांग हृदयम् के सीधे श्लोक उद्धरण बिना किसी भ्रांति (Zero Hallucination) के। प्रत्येक सुझाव के साथ सटीक ग्रंथ व अध्याय संदर्भ।',
      pillar3Badge1: 'बृहत्त्रयी प्रामाणिकता',
      pillar3Badge2: 'शून्य भ्रांति मानक',
      stripTitle: 'मूल संहिताओं का सीधा अध्ययन करें',
      stripDesc: 'प्रामाणिक श्लोक, अन्वय, संस्कृत पाठ तथा प्रामाणिक टीकाएं देखें।',
      treatiseCharaka: 'चरक संहिता',
      treatiseSushruta: 'सुश्रुत संहिता',
      treatiseAshtanga: 'अष्टांग हृदयम्'
    },
    rag: {
      tag: 'न्यूरल RAG स्टूडियो • शास्त्रीय ग्रंथ समावेशन',
      activePrakriti: 'सक्रिय उपयोगकर्ता प्रकृति',
      title: 'एआई सहायक RAG इंजन',
      desc: 'चिकित्सीय प्रश्न, औषधीय योग अथवा पादप प्रभाव के विषय में पूछें। प्रत्येक उत्तर 48 लाख श्लोक एम्बेडिंग्स से खोजकर चरक, सुश्रुत एवं वाग्भट के अध्याय संदर्भों से प्रमाणित किया जाता है।',
      headerTitle: 'एआई सहायक RAG इंजन',
      headerDesc: 'बृहत्त्रयी के प्रामाणिक डेटाबेस से सीधे संदर्भ एवं आधुनिक वैज्ञानिक समन्वय सहित शास्त्रीय परामर्श।',
      placeholder: 'आयुर्वेदिक प्रश्न पूछें उदा. पित्त शमन के उपाय, अश्वगंधा के प्रभाव, जठराग्नि दीपन...',
      searchPlaceholder: 'आयुर्वेदिक प्रश्न पूछें उदा. पित्त शमन के उपाय, अश्वगंधा के प्रभाव, जठराग्नि दीपन...',
      canonicalFilter: 'प्रामाणिक ग्रंथ:',
      canonicalFilterLabel: 'प्रामाणिक ग्रंथ:',
      targetDosha: 'लक्षित दोष:',
      targetDoshaLabel: 'लक्षित दोष:',
      allTreatises: 'समस्त बृहत्त्रयी',
      charaka: 'चरक संहिता',
      sushruta: 'सुश्रुत संहिता',
      ashtanga: 'अष्टांग हृदयम्',
      nighantu: 'भावप्रकाश निघण्टु',
      allDoshas: 'समस्त दोष',
      vataFocus: 'वात दोष पर ध्यान',
      pittaFocus: 'पित्त दोष पर ध्यान',
      kaphaFocus: 'कफ दोष पर ध्यान',
      scanning: 'संहिताओं में खोज जारी है...',
      scanningCanon: 'संहिताओं में खोज जारी है...',
      executeQuery: 'RAG परामर्श प्राप्त करें',
      executeRagQuery: 'RAG परामर्श प्राप्त करें',
      quickPromptsLabel: 'अथवा सत्यापित चिकित्सीय प्रश्नों में से चुनें:',
      suggestedPromptsLabel: 'अथवा सत्यापित चिकित्सीय प्रश्नों में से चुनें:',
      quickPrompts: [
        'शरद अथवा ग्रीष्म में पित्त असंतुलन के उपाय',
        'चरक संहिता में अश्वगंधा के वैज्ञानिक लाभ',
        'वर्षा ऋतु के लिए शास्त्रीय दिनचर्या',
        'सुश्रुत ने 600 ईसा पूर्व में राइनोप्लास्टी कैसे की?',
        'स्वर्ण भस्म के विषय में आधुनिक इलेक्ट्रॉन माइक्रोस्कोपी क्या बताती है?',
        'आयुर्वेद में आम दोष की आधुनिक एंडोटॉक्सीमिया से तुलना'
      ],
      suggestedPrompts: [
        'शरद अथवा ग्रीष्म में पित्त असंतुलन के उपाय',
        'चरक संहिता में अश्वगंधा के वैज्ञानिक लाभ',
        'वर्षा ऋतु के लिए शास्त्रीय दिनचर्या',
        'सुश्रुत ने 600 ईसा पूर्व में राइनोप्लास्टी कैसे की?',
        'स्वर्ण भस्म के विषय में आधुनिक इलेक्ट्रॉन माइक्रोस्कोपी क्या बताती है?',
        'आयुर्वेद में आम दोष की आधुनिक एंडोटॉक्सीमिया से तुलना'
      ],
      interrogatingEmbeddings: '48 लाख संस्कृत श्लोक एम्बेडिंग्स का विश्लेषण जारी है...',
      crossReferencingText: 'बृहत्त्रयी मूल संहिताओं एवं प्रामाणिक टीकाओं से संदर्भ मिलान...',
      groundedTag: 'बृहत्त्रयी मूल साक्ष्य',
      canonicalCitation: 'प्रामाणिक संदर्भ',
      copyBtn: 'परामर्श कॉपी करें',
      clinicalSynthesis: 'नैदानिक निष्कर्ष एवं चिकित्सा व्यवस्था',
      verifiedConsultation: 'सत्यापित शास्त्रीय परामर्श',
      noQueryYet: 'शास्त्रीय परामर्श के लिए तैयार',
      startExploring: 'ऊपर अपना प्रश्न दर्ज करें अथवा अनुशंसित प्रश्नों में से चुनकर बृहत्त्रयी के प्रमाण देखें।',
      canonicalVerses: 'मूल प्रामाणिक संस्कृत श्लोक एवं साक्ष्य',
      chant: 'पाठ',
      listenChant: 'श्लोक पाठ सुनें',
      copyVerse: 'श्लोक कॉपी करें',
      bookmarkVerse: 'श्लोक सहेजें',
      doshicImpact: 'त्रिदोष संतुलन एवं प्रभाव',
      vata: 'वात दोष',
      pitta: 'पित्त दोष',
      kapha: 'कफ दोष',
      vataTitle: 'वात दोष',
      pittaTitle: 'पित्त दोष',
      kaphaTitle: 'कफ दोष',
      pacifies: 'शमन करता है (शामक)',
      neutral: 'तटस्थ / सम (समान)',
      aggravates: 'प्रकोप करता है (प्रकोपक)',
      doshicMechanism: 'दोष क्रियाविधि एवं संप्राप्ति',
      dravyaguna: 'द्रव्यगुण औषध-विज्ञान मैट्रिक्स',
      dravyagunaMatrix: 'द्रव्यगुण औषध-विज्ञान मैट्रिक्स',
      rasa: 'रस (स्वाद)',
      guna: 'गुण (विशेषता)',
      virya: 'वीर्य (ऊर्जा)',
      vipaka: 'विपाक (पाचन उपरांत प्रभाव)',
      prabhava: 'प्रभाव (विशेष कर्म)',
      formulations: 'शास्त्रीय आयुर्वेदिक योग एवं औषधियाँ',
      recommendedFormulations: 'शास्त्रीय आयुर्वेदिक योग एवं औषधियां',
      indications: 'रोग निर्देश / लाभ',
      indicationsLabel: 'रोग निर्देश / लाभ',
      dosage: 'पारंपरिक मात्रा व सेवन विधि',
      dosageLabel: 'पारंपरिक मात्रा',
      ingredients: 'घटक द्रव्य',
      ingredientsLabel: 'घटक द्रव्य',
      lifestyleRegimen: 'दिनचर्या एवं जीवनशैली निर्देश',
      dinacharyaProtocols: 'दिनचर्या एवं जीवनशैली व्यवस्था',
      modernCorrelation: 'आधुनिक बायोमेडिकल एवं फाइटोकेमिकल सहसंबंध',
      modernConcordance: 'आधुनिक वैज्ञानिक एवं फाइटोकेमिकल समन्वय',
      phytochemicals: 'सक्रिय फाइटोकेमिकल्स',
      phytochemicalsLabel: 'फाइटोकेमिकल्स',
      mechanism: 'औषधीय कार्य प्रणाली (Mechanism of Action)',
      mechanismLabel: 'कार्य प्रणाली',
      clinicalEvidence: 'समीक्षित वैज्ञानिक एवं नैदानिक साक्ष्य',
      clinicalEvidenceLabel: 'नैदानिक साक्ष्य',
      precautions: 'नैदानिक सावधानियां एवं निषेध',
      precautionTitle: 'सावधानियां एवं निषेध',
      suggestedQueries: 'आगे जानने योग्य शास्त्रीय प्रश्न',
      deepenInquiry: 'एआई सहायक के साथ गहन जिज्ञासा',
      shareBtn: 'परामर्श साझा करें',
      printBtn: 'प्रिंट क्लिनिकल रिपोर्ट'
    },
    curiosities: {
      ribbonMotto: 'समय से सदियों आगे का वैदिक विज्ञान • आधुनिक चिकित्सा अनुसंधान द्वारा प्रमाणित',
      checkPrakritiBtn: 'अपनी त्रिदोष प्रकृति का निर्धारण करें',
      title: 'आयुर्वेदिक रहस्य, अद्भुत तथ्य एवं वैज्ञानिक खुलासे',
      desc: 'प्राचीन वैद्यों द्वारा आधुनिक चिकित्सा से सहस्राब्दियों पूर्व शल्यक्रिया, जैविक घड़ी (सर्कैडियन रिदम), नैनो-प्रौद्योगिकी एवं सूक्ष्म जीव विज्ञान की नींव रखने वाले प्रामाणिक ऐतिहासिक तथ्यों का अन्वेषण करें।',
      filterAll: 'सभी तथ्य',
      categoryAll: 'सभी तथ्य',
      categorySurgery: 'शल्य चमत्कार',
      categoryCircadian: 'जैविक घड़ी (सर्कैडियन)',
      categoryAlchemy: 'धातु नैनो-औषध',
      categoryMicrobiome: 'सूक्ष्म जीव एवं निदान',
      bannerBadge: 'आधुनिक चिकित्सा से सहस्राब्दियों पूर्व',
      bannerTitle: 'आयुर्वेदिक रहस्य, अद्भुत तथ्य एवं वैज्ञानिक खुलासे',
      bannerSubtitle: 'सहस्राब्दियों पूर्व संस्कृत में लिपिबद्ध',
      bannerDesc: 'प्राचीन वैद्यों द्वारा आधुनिक चिकित्सा से सहस्राब्दियों पूर्व शल्यक्रिया, जैविक घड़ी (सर्कैडियन रिदम), नैनो-प्रौद्योगिकी एवं सूक्ष्म जीव विज्ञान की नींव रखने वाले प्रामाणिक ऐतिहासिक तथ्यों का अन्वेषण करें।',
      stat1Label: 'नैनो-औषध पैमाना',
      stat2Label: 'शल्य यंत्र एवं उपकरण',
      stat3Label: 'नोबेल पुरस्कार से पूर्व',
      manuscriptBadge: 'प्राचीन हस्तलिखित ग्रंथ',
      manuscriptTitle: 'सुश्रुत एवं चरक संहिता पांडुलिपि',
      manuscriptDesc: 'भोजपत्र एवं ताड़पत्र पर देवनागरी एवं शारदा लिपि में लिखित, जिसने पीढ़ियों से प्रामाणिक नैदानिक ज्ञान को सुरक्षित रखा है।',
      didYouKnow: 'वैद्य ऐतिहासिक ज्ञान',
      nextFact: 'अगला तथ्य',
      shlokaSource: 'शास्त्रीय संदर्भ',
      askSahayak: 'एआई सहायक से पूछें',
      shareFact: 'तथ्य साझा करें',
      interactiveTitle: 'क्या किसी प्राचीन दावे की पुष्टि करना चाहते हैं?',
      interactiveDesc: 'एआई सहायक से किसी भी प्राचीन दावे की मूल संस्कृत संहिताओं एवं आधुनिक वैज्ञानिक परीक्षणों दोनों के आधार पर पुष्टि करवाएं।',
      interactivePlaceholder: 'उदा. तांबे का जल (ताम्र जल) हानिकारक जीवाणुओं को कैसे नष्ट करता है?',
      interactiveBtn: 'संहिता से पुष्टि करें',
      facts: {
        rhinoplasty: {
          categoryLabel: 'शल्य चमत्कार',
          title: 'विश्व की सर्वप्रथम प्लास्टिक सर्जरी (नासा-संधान / राइनोप्लास्टी)',
          description: 'महर्षि सुश्रुत ने 2,600 वर्ष पूर्व माथे की त्वचा से नासिका निर्माण की विधि लिपिबद्ध की थी। कटे हुए भाग पर पत्ते के आकार की त्वचा काटकर, मोम के सांचे पर बैठाकर जीवित चींटियों के जबड़ों द्वारा टांके लगाए जाते थे, जो प्राकृतिक घुलनशील क्लिप का कार्य करते थे।',
          translation: 'पत्ते के प्रमाण से नापकर त्वचा को काटकर नासिका के कटे भाग पर सावधानीपूर्वक स्थापित कर टांके लगाने की विधि।'
        },
        circadian: {
          categoryLabel: 'जैविक घड़ी',
          title: 'नोबेल पुरस्कार से 3,000 वर्ष पूर्व जैविक घड़ी (सर्कैडियन रिदम)',
          description: 'वर्ष 2017 में चिकित्सा का नोबेल पुरस्कार सर्कैडियन रिदम की खोज पर दिया गया। परंतु प्राचीन दिनचर्या ग्रंथों में 24 घंटे के दिन को 4-4 घंटे के चक्रों में पहले ही बांटा गया था: कफ, पित्त (मध्याह्न अग्नि) एवं वात (उषाकाल), जो आज के क्लॉक-जीन से पूर्णतः मेल खाते हैं।',
          translation: 'आयु की रक्षा एवं स्वास्थ्य संवर्धन हेतु ब्रह्म मुहूर्त (वात प्रधान प्रातःकाल) में उठना चाहिए।'
        },
        bhasmas: {
          categoryLabel: 'धातु नैनो-औषध',
          title: 'प्राचीन नैनो-औषधि: भस्म निर्माण एवं शोधन',
          description: 'सिंथेटिक नैनो-टेक्नोलॉजी से शताब्दियों पूर्व, रसशास्त्र के आचार्यों ने स्वर्ण, रजत, ताम्र जैसी धातुओं को गोमय के उपलों (पुट) में जड़ी-बूटियों के रस के साथ 100 बार फूंककर 50 नैनोमीटर से भी छोटे जैव-अनुकूल कण बनाए जो सीधे कोशिका भित्ति को भेदते हैं।',
          translation: 'भस्म की सूक्ष्मता की प्रामाणिक कसौटी: जब भस्म जल पर तैरे (वारितरम्) और अंगुलियों की रेखाओं में समा जाए (रेखापूर्णम्)।'
        },
        alchemy: {
          categoryLabel: 'धातु नैनो-औषध',
          title: 'स्वर्ण भस्म: प्राचीन स्वर्ण नैनोटेक्नोलॉजी',
          description: "रसशास्त्र के आचार्यों ने स्वर्ण को 900°C से अधिक तापमान पर घृतकुमारी आदि औषधियों के साथ दर्जनों बार 'पुट' देकर भस्म बनाया। आधुनिक हाई-रिज़ॉल्यूशन ट्रांसमिशन इलेक्ट्रॉन माइक्रोस्कोपी (HR-TEM) से पता चला है कि इसके कण 20-50 नैनोमीटर आकार के होते हैं जो सीधे कोशिकाओं में प्रवेश कर रोग प्रतिरोधक क्षमता बढ़ाते हैं।",
          translation: 'शोधित स्वर्ण भस्म रसायन है, त्रिदोष नाशक है, स्मृति व बुद्धि वर्धक है तथा परम विषनाशक है।'
        },
        bioavailability: {
          categoryLabel: 'पादप रसशास्त्र',
          title: '700 से अधिक पौधों में बायो-उपलब्धता तालमेल',
          description: 'चरक ने 700 से अधिक औषधियों का औषधीय तालमेल (संयोग) वर्णित किया। त्रिकटु (काली मिर्च, पिप्पली, सोंठ) को कठिनता से पचने वाली जड़ों के साथ दिया जाता था—हजारों साल पहले, जब आधुनिक विज्ञान ने यह सिद्ध नहीं किया था कि पिपरीन अवशोषण को 2000% तक बढ़ा देता है।',
          translation: 'द्रव्यों का चिकित्सीय कर्म उनके उचित संयोग एवं विभाजन द्वारा सिद्ध होता है, जिससे उनकी शक्ति कई गुना बढ़ जाती है।'
        },
        microbiome: {
          categoryLabel: 'सूक्ष्म जीव एवं निदान',
          title: 'कृमि रोग: अदृश्य रोगाणु एवं आंतों का माइक्रोबायोम',
          description: 'सुश्रुत ने बीस प्रकार के कृमियों का वर्णन किया और बताया कि कुछ कृमि दृश्य होते हैं तथा कुछ इतने सूक्ष्म व अदृश्य होते हैं जो रक्त, लसिका और आंतों में निवास करते हैं। उन्होंने विडंग और कुटज जैसी जड़ी-बूटियों द्वारा रोगाणु नियंत्रण की विधि बताई।',
          translation: 'कफ और रक्त से उत्पन्न कृमि अत्यंत सूक्ष्म, गोल, बिना सिर वाले तथा केवल सूक्ष्म दृष्टि से ही जाने जा सकते हैं।'
        },
        'gut-brain': {
          categoryLabel: 'आंत एवं मस्तिष्क अक्ष',
          title: 'आंत-मस्तिष्क अक्ष (Gut-Brain Axis) एवं स्वप्रतिरक्षी रोग',
          description: 'आधुनिक चिकित्सा ने हाल ही में आंत को दूसरा मस्तिष्क माना है। आयुर्वेद का आधारभूत सूत्र \'रोगाः सर्वेऽपि मन्देऽग्नौ\' स्पष्ट रूप से कहता है कि समस्त चयापचय तथा मानसिक रोग मंदाग्नि से उत्पन्न आम विष के कारण ही होते हैं।',
          translation: 'समस्त रोग मंद जठराग्नि के कारण उत्पन्न होते हैं, जिससे आमदोष का निर्माण होता है और स्रोतसों में अवरोध पैदा होता है।'
        },
        psychotherapy: {
          categoryLabel: 'मनोचिकित्सा',
          title: 'सत्त्वावजय चिकित्सा: प्राचीन संज्ञानात्मक थेरेपी',
          description: 'आयुर्वेद ने मानसिक स्वास्थ्य को तीन भागों में बांटा: युक्ति-व्यपाश्रय (औषध), दैव-व्यपाश्रय (आध्यात्मिक) तथा सत्त्वावजय चिकित्सा। सत्त्वावजय विश्व की सबसे प्राचीन संज्ञानात्मक थेरेपी है—जिसमें बुद्धि को अहितकर विषयों से सचेतन रूप से रोका जाता है।',
          translation: 'अहितकर विषयों से मन का निग्रह करना ही सत्त्वावजय है; ज्ञान, धैर्य तथा आत्मज्ञान मन के विकारों की परम औषधि है।'
        }
      },
      trivia: [
        {
          text: 'महर्षि सुश्रुत ने बंगाल की बड़ी चींटियों के जबड़ों को प्राकृतिक सर्जिकल स्टेपल के रूप में उपयोग किया, जिनके जबड़े त्वचा को पकड़ने पर शरीर काट दिया जाता था।',
          source: 'सुश्रुत संहिता, सूत्रस्थानम्'
        },
        {
          text: 'प्राचीन वैद्य मूत्र में चींटियों के आकर्षण को देखकर मधुमेह (डायबिटीज) का सटीक परीक्षण करते थे।',
          source: 'चरक संहिता, निदानस्थानम् अध्याय ४'
        },
        {
          text: 'सुश्रुत ने 125 से अधिक विशेष शल्य यंत्र बनाए—जिनमें चील, कौवे और बाज़ की चोंच के आकार के चिमटे (सन्दंश यंत्र) शामिल थे।',
          source: 'सुश्रुत संहिता, सूत्रस्थानम् अध्याय ७ (यंत्र विधि)'
        },
        {
          text: 'सक्रिय कार्बन फिल्टर से सहस्राब्दियों पूर्व सहजन (मोरिंगा) के बीज, तांबे के पात्र और खस (उशीर) की जड़ों से जल शुद्धिकरण किया जाता था।',
          source: 'सुश्रुत संहिता, सूत्रस्थानम् अध्याय ४५'
        },
        {
          text: "100 वर्ष पुराने घी को 'कुंभ घृत' कहा जाता था और इसे तंत्रिका तंत्र के लिए अत्यंत गुणकारी औषधि के रूप में उपयोग किया जाता था।",
          source: 'अष्टांग हृदयम्, उत्तरस्थानम्'
        },
        {
          text: 'जलौकावचारण (जोंक चिकित्सा) में जोंक की 12 प्रजातियों को 6 विषैली और 6 निर्विष (औषधीय) श्रेणियों में वर्गीकृत किया गया था।',
          source: 'सुश्रुत संहिता, सूत्रस्थानम् अध्याय १३'
        }
      ]
    },
    samhitas: {
      title: 'आयुर्वेदिक संहिताएं (बृहत्त्रयी कोश)',
      desc: 'अध्यायवार मूल संहिताओं का अध्ययन करें—सटीक श्लोक, अन्वय, हिन्दी अनुवाद तथा शताब्दियों के नैदानिक अनुभवों पर आधारित प्रामाणिक टीकाएं।',
      searchPlaceholder: 'श्लोक, अध्याय अथवा विषय खोजें (उदा. दिनचर्या, अग्नि, वमन, रसायन)...',
      canonicalTreatisesLabel: 'प्रामाणिक संहिताएं:',
      sthanaLabel: 'संहिता स्थान (भाग):',
      chaptersLabel: 'स्थान के अध्याय:',
      treatiseInfo: 'संहिता विवरण',
      period: 'काल / समय',
      scope: 'विषय क्षेत्र',
      totalChapters: 'कुल अध्याय',
      chapterOverview: 'अध्याय का संक्षिप्त परिचय',
      keyShlokaTitle: 'मूल आधारभूत श्लोक',
      clinicalRelevanceTitle: 'आधुनिक नैदानिक उपयोगिता',
      listenShloka: 'श्लोक पाठ सुनें',
      copyShloka: 'श्लोक कॉपी करें',
      bookmarkShloka: 'श्लोक सहेजें',
      askRagAboutChapter: 'इस अध्याय के विषय में एआई सहायक से पूछें',
      treatiseMeta: {
        charaka: {
          title: 'चरक संहिता',
          author: 'महर्षि चरक / अग्निवेश',
          scope: 'काय-चिकित्सा (आंतरिक चिकित्सा / Internal Medicine)',
          sthanaNames: {
            sutrasthana: 'सूत्रस्थानम् (मूल सिद्धांत एवं स्वास्थ्य नियम)',
            nidanasthana: 'निदानस्थानम् (रोग निदान एवं कारण)',
            chikitsasthana: 'चिकित्सास्थानम् (रोग चिकित्सा एवं योग)'
          }
        },
        sushruta: {
          title: 'सुश्रुत संहिता',
          author: 'महर्षि सुश्रुत / दिवोदास धन्वंतरि',
          scope: 'शल्य तंत्र (शल्यक्रिया एवं शारीर विज्ञान)',
          sthanaNames: {
            'su-sutra': 'सूत्रस्थानम् (शल्य नियम एवं शस्त्र-यंत्र)',
            'su-sarira': 'शारीरस्थानम् (शरीर रचना एवं भ्रूण विज्ञान)'
          }
        },
        ashtanga: {
          title: 'अष्टांग हृदयम्',
          author: 'आचार्य वाग्भट',
          scope: 'आयुर्वेद के अष्टांग (समस्त ८ शाखाओं का सार)',
          sthanaNames: {
            'vag-sutra': 'सूत्रस्थानम् (हृदयभूत सिद्धांत)'
          }
        }
      }
    },
    prakriti: {
      title: 'आयुर्वेदिक प्रकृति (दोष) परीक्षण',
      subtitle: 'शास्त्रीय त्रिदोष सिद्धांतों के अनुसार अपनी मूल शारीरिक व मानसिक प्रकृति का निर्धारण करें।',
      stepOf: 'प्रश्न',
      resultTitle: 'आपकी प्रमुख प्रकृति',
      resultSubtitle: 'अपनी मूल प्रकृति को समझने से एआई सहायक को आपके आहार एवं औषध की सटीक अनुशंसा करने में सहायता मिलती है।',
      saveBtn: 'प्रकृति सहेजें एवं एआई अनुकूलित करें',
      retakeBtn: 'पुनः परीक्षण करें',
      nextBtn: 'अगला प्रश्न',
      prevBtn: 'पिछला',
      closeBtn: 'बंद करें',
      questions: [
        {
          id: 1,
          text: 'शारीरिक संरचना एवं कद-काठी:',
          options: [
            { label: 'पतली, छरहरी काया, वजन बढ़ना कठिन, संधियां (जोड़) उभरी हुई', dosha: 'Vata' },
            { label: 'मध्यम, संतुलित, सुगठित मांसपेशियां, एथलेटिक शरीर', dosha: 'Pitta' },
            { label: 'चौड़ा, मजबूत, वजन आसानी से बढ़ता है, सुदृढ़ अस्थि ढांचा', dosha: 'Kapha' }
          ]
        },
        {
          id: 2,
          text: 'चयापचय, पाचन एवं भूख (अग्नि):',
          options: [
            { label: 'विषमाग्नि (अनियमित)—कभी बहुत तेज भूख, कभी भोजन करना भूल जाना', dosha: 'Vata' },
            { label: 'तीक्ष्णाग्नि (तीव्र)—समय पर भोजन न मिलने पर चिड़चिड़ापन और गर्मी लगना', dosha: 'Pitta' },
            { label: 'मंदाग्नि (धीमी व स्थिर)—मध्यम भूख, धीरे पचना, उपवास आसानी से कर लेना', dosha: 'Kapha' }
          ]
        },
        {
          id: 3,
          text: 'तापमान एवं मौसम की पसंद:',
          options: [
            { label: 'ठंड, शुष्कता व तेज हवा असहज; गर्म स्नान एवं धूप अत्यंत प्रिय', dosha: 'Vata' },
            { label: 'गर्मी, उमस व तेज धूप असहज; शीतल पवन, जल व छाया प्रिय', dosha: 'Pitta' },
            { label: 'ठंडा व बरसाती सीलन वाला मौसम असहज; सूखी गर्मी व सक्रियता प्रिय', dosha: 'Kapha' }
          ]
        },
        {
          id: 4,
          text: 'मानसिक गति एवं तनाव में प्रतिक्रिया:',
          options: [
            { label: 'द्रुत विचारक, अत्यधिक रचनात्मक, चिंता, भय या चंचलता की प्रवृत्ति', dosha: 'Vata' },
            { label: 'विश्लेषणात्मक, व्यवस्थित, निर्णयशील, अधीरता या क्रोध की प्रवृत्ति', dosha: 'Pitta' },
            { label: 'शांत, धैर्यवान, सहनशील, परिवर्तन का विरोधी, शीघ्र क्रोध न आना', dosha: 'Kapha' }
          ]
        },
        {
          id: 5,
          text: 'निद्रा एवं स्वप्न की प्रकृति:',
          options: [
            { label: 'अल्प निद्रा, बार-बार टूटने वाली, उड़ने, दौड़ने या गिरने के स्वप्न', dosha: 'Vata' },
            { label: 'मध्यम निद्रा, गहरी, रंगीन स्वप्न, अग्नि, युद्ध अथवा समस्या समाधान के स्वप्न', dosha: 'Pitta' },
            { label: 'गहरी, भारी निद्रा, देर से जागना, जल, सरोवर, बादलों के शांत स्वप्न', dosha: 'Kapha' }
          ]
        }
      ],
      descriptions: {
        Vata: 'वायु एवं आकाश महाभूत प्रधान। गतिशीलता, चंचलता, रचनात्मकता एवं शीघ्र परिवर्तन की विशेषता। स्निग्ध, गर्म आहार, तिल तेल मालिश (अभ्यंग) और नियमित दिनचर्या इसके लिए सर्वोत्तम है।',
        Pitta: 'अग्नि एवं जल महाभूत प्रधान। तेज, तीक्ष्ण बुद्धि, मेटाबॉलिज्म एवं रूपांतरण की विशेषता। शीतल आहार, मधुर-तिक्त रस, मानसिक शांति और अत्यधिक गर्मी से बचाव आवश्यक है।',
        Kapha: 'पृथ्वी एवं जल महाभूत प्रधान। स्थिरता, बल, सहनशीलता और धैर्य की विशेषता। उष्ण मसाले, नियमित व्यायाम तथा हल्का, स्फूर्तिदायक आहार इसके लिए लाभकारी है।'
      }
    },
    bookmarks: {
      title: 'सुरक्षित श्लोक एवं सूत्र',
      emptyTitle: 'कोई श्लोक सुरक्षित नहीं किया गया',
      emptyDesc: 'RAG परामर्श अथवा संहिताओं का अध्ययन करते समय किसी भी श्लोक के पास बने बुकमार्क चिह्न पर क्लिक करके उसे यहाँ सहेजें।',
      listenBtn: 'पाठ सुनें',
      copyBtn: 'कॉपी करें',
      removeBtn: 'हटाएं'
    },
    auth: {
      portalBadge: 'शास्त्रीय आयुर्-सूचना विज्ञान • बृहत्त्रयी कोश',
      appTitle: 'आईपी-शक्ति सहायक',
      appSubtitle: 'प्रामाणिक शास्त्रीय आयुर्वेदिक मेधा एवं अनुसंधान पोर्टल',
      subtitle: 'प्रामाणिक शास्त्रीय आयुर्वेदिक मेधा एवं अनुसंधान पोर्टल',
      registerTab: 'पंजीकरण एवं सत्यापन',
      loginTab: 'लॉग इन',
      passwordMethod: 'पासवर्ड',
      otpMethod: 'ईमेल ओटीपी',
      fullNameLabel: 'पूरा नाम / वैद्य उपाधि',
      fullNamePlaceholder: 'उदा. आचार्य राहुल शर्मा',
      emailLabel: 'ईमेल पता',
      emailPlaceholder: 'vaidya@ipsakti.ai',
      passwordLabel: 'पासवर्ड',
      passwordPlaceholder: 'अपना सुरक्षित पासवर्ड दर्ज करें',
      sendOtpBtn: '6-अंकों का सत्यापन कोड भेजें',
      sendingOtp: 'सत्यापन कोड भेजा जा रहा है...',
      resendIn: 'पुनः कोड भेजें',
      resendCode: 'पुनः कोड भेजें',
      resendOtp: 'पुनः कोड भेजें',
      changeEmail: 'ईमेल बदलें',
      otpHelp: 'यदि एक मिनट में सत्यापन कोड न मिले तो कृपया अपना स्पैम/जंक फ़ोल्डर देखें।',
      enterOtpLabel: '6-अंकों का सत्यापन कोड दर्ज करें',
      enterOtpDesc: 'हमने आपके ईमेल पते पर एक सत्यापन कोड भेजा है। पुष्टि हेतु नीचे दर्ज करें।',
      enterOtpTitle: '6-अंकों का सत्यापन कोड दर्ज करें',
      enterOtpSubtitle: 'हमने आपके ईमेल पते पर एक सत्यापन कोड भेजा है। पुष्टि हेतु नीचे दर्ज करें।',
      verifyAndRegisterBtn: 'ईमेल सत्यापित करें एवं खाता बनाएं',
      verifyAndLoginBtn: 'कोड सत्यापित करें एवं लॉग इन करें',
      loginWithPasswordBtn: 'पासवर्ड से लॉग इन करें',
      verifyBtn: 'ईमेल सत्यापित करें एवं खाता बनाएं',
      passwordSignIn: 'पासवर्ड द्वारा लॉग इन',
      otpSignIn: 'ईमेल ओटीपी द्वारा लॉग इन',
      loginBtn: 'लॉग इन करें',
      verifying: 'संहिता से सत्यापन जारी...',
      guestBtn: 'अतिथि वैद्य के रूप में प्रवेश करें',
      continueAsGuest: 'अतिथि वैद्य के रूप में प्रवेश करें',
      guestNotice: 'अतिथि मोड बिना ईमेल सत्यापन के तात्कालिक प्रवेश प्रदान करता है।',
      alreadyHaveAccount: 'क्या पहले से खाता मौजूद है?',
      needAccount: 'खाता नहीं है?',
      switchLogin: 'यहाँ लॉग इन करें',
      switchRegister: 'ईमेल सत्यापन द्वारा नया खाता बनाएं'
    },
    footer: {
      motto: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।',
      mottoMeaning: 'सभी प्राणी सुखी हों, सभी रोगमुक्त एवं स्वस्थ रहें।',
      shloka: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद् दुःखभाग्भवेत् ॥',
      translation: 'सभी प्राणी सुखी हों, सभी निरोगी रहें, सभी का कल्याण हो, कोई भी दुःखी न हो।',
      overviewTitle: 'प्रामाणिक संहिता सामंजस्य',
      overviewDesc: 'बृहत्त्रयी (चरक संहिता, सुश्रुत संहिता, अष्टांग हृदयम्) पर आधारित प्रामाणिक संगणकीय अनुक्रमणिका। समस्त व्याख्याएं रस, वीर्य, विपाक तथा प्रभाव की शुद्धता को बिना किसी कृत्रिम विकृति के संरक्षित रखती हैं।',
      overviewBadge: 'बृहत्त्रयी मूल संदर्भ • शून्य भ्रांति (Zero Hallucination) मानक',
      concordanceTitle: 'प्रामाणिक संहिता सामंजस्य',
      concordanceDesc: 'बृहत्त्रयी (चरक संहिता, सुश्रुत संहिता, अष्टांग हृदयम्) पर आधारित प्रामाणिक संगणकीय अनुक्रमणिका। समस्त व्याख्याएं रस, वीर्य, विपाक तथा प्रभाव की शुद्धता को बिना किसी कृत्रिम विकृति के संरक्षित रखती हैं।',
      concordanceBadge: 'बृहत्त्रयी मूल संदर्भ • शून्य भ्रांति मानक',
      portalsTitle: 'संहिता प्रवेश द्वार',
      treatisePortals: 'संहिता प्रवेश द्वार',
      charakaLink: 'चरक संहिता',
      sushrutaLink: 'सुश्रुत संहिता',
      ashtangaLink: 'अष्टांग हृदयम्',
      bhavaprakashaLink: 'भावप्रकाश निघण्टु',
      systemsTitle: 'बुद्धिमान प्रणालियां',
      systemTitle: 'बुद्धिमान प्रणालियां',
      ragLink: 'एआई सहायक RAG स्टूडियो',
      ragIngestion: 'शास्त्रीय RAG ज्ञान समावेशन',
      curiositiesLink: 'अद्भुत रहस्य एवं रसशास्त्र',
      knowledgeGraph: 'वैद्य ज्ञान ग्राफ',
      knowledgeGraphLink: 'वैद्य ज्ञान ग्राफ',
      engineText: 'इंजन: जेमिनी 3.8 फ्लैश + संस्कृत एम्बेडिंग्स',
      engineTag: 'इंजन: जेमिनी 3.8 फ्लैश + वेक्टर समावेशन',
      copyright: '© 2024 आईपी-शक्ति सहायक। वैदिक चिकित्सा विज्ञान को आधुनिक संगणना से सशक्त बनाना।',
      verifiedTag: 'सीसीआरएएस एवं आयुष संरेखित',
      openAccessTag: 'खुला शास्त्रीय अध्ययन'
    }
  }
};
