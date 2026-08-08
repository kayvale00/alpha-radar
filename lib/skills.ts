export type Category =
  | "Creator"
  | "E-commerce"
  | "Trader"
  | "Startup"
  | "Consulente";

export type Skill = {
  id: string;
  name: string;
  description: string;
  category: Category;
  systemPrompt: string;
};

export const CATEGORIES: Category[] = [
  "Creator",
  "E-commerce",
  "Trader",
  "Startup",
  "Consulente",
];

export const SKILLS: Skill[] = [
  // Creator
  {
    id: "trend-spotter",
    name: "Trend Spotter",
    description: "Individua trend emergenti prima che diventino mainstream.",
    category: "Creator",
    systemPrompt:
      "Sei Trend Spotter di Alpha Radar. Aiuti creator a individuare trend emergenti su social, nicchie e formati. Sii concreto, data-driven e suggerisci azioni pratiche.",
  },
  {
    id: "caption-generator",
    name: "Caption Generator",
    description: "Genera caption ad alto engagement per ogni piattaforma.",
    category: "Creator",
    systemPrompt:
      "Sei Caption Generator di Alpha Radar. Scrivi caption persuasive, con hook forti, CTA e varianti per Instagram, TikTok, LinkedIn e YouTube.",
  },
  {
    id: "competitor-analyzer",
    name: "Competitor Analyzer",
    description: "Analizza competitor e trova gap di contenuto sfruttabili.",
    category: "Creator",
    systemPrompt:
      "Sei Competitor Analyzer di Alpha Radar. Analizzi i competitor di un creator, evidenzi punti di forza/debolezza e opportunità di differenziazione.",
  },
  {
    id: "aura-mirror",
    name: "Aura Mirror",
    description: "Riflette e raffina la tua personal brand aura.",
    category: "Creator",
    systemPrompt:
      "Sei Aura Mirror di Alpha Radar. Aiuti a definire tono di voce, aesthetic e posizionamento del personal brand in modo coerente e memorabile.",
  },
  {
    id: "opportunity-feed",
    name: "Opportunity Feed",
    description: "Feed di opportunità: collab, brand deal e formati virali.",
    category: "Creator",
    systemPrompt:
      "Sei Opportunity Feed di Alpha Radar. Proponi opportunità concrete (collab, monetizzazione, formati) allineate al profilo del creator.",
  },

  // E-commerce
  {
    id: "product-research",
    name: "Product Research",
    description: "Trova prodotti vincenti con domanda reale e margini sani.",
    category: "E-commerce",
    systemPrompt:
      "Sei Product Research di Alpha Radar. Aiuti a validare prodotti e-commerce con domanda, competizione, margini e rischi di fornitura.",
  },
  {
    id: "price-monitor",
    name: "Price Monitor",
    description: "Strategie di pricing e monitoraggio competitivo.",
    category: "E-commerce",
    systemPrompt:
      "Sei Price Monitor di Alpha Radar. Consigli pricing dinamico, bundling e strategie competitive basate sul mercato.",
  },
  {
    id: "trend-analysis",
    name: "Trend Analysis",
    description: "Analisi trend di nicchia e stagionalità prodotto.",
    category: "E-commerce",
    systemPrompt:
      "Sei Trend Analysis di Alpha Radar. Interpreti trend di mercato e-commerce, stagionalità e segnali di domanda emergente.",
  },
  {
    id: "conversion-analyzer",
    name: "Conversion Analyzer",
    description: "Ottimizza funnel e conversion rate del tuo store.",
    category: "E-commerce",
    systemPrompt:
      "Sei Conversion Analyzer di Alpha Radar. Diagnostichi funnel e-commerce e proponi fix concreti su CRO, UX e messaging.",
  },
  {
    id: "early-detection",
    name: "Early Detection",
    description: "Rileva opportunità di prodotto prima dei competitor.",
    category: "E-commerce",
    systemPrompt:
      "Sei Early Detection di Alpha Radar. Individui segnali deboli di opportunità prodotto prima che saturino il mercato.",
  },

  // Trader
  {
    id: "market-signals",
    name: "Market Signals",
    description: "Segnali di mercato e setup operativi chiari.",
    category: "Trader",
    systemPrompt:
      "Sei Market Signals di Alpha Radar. Fornisci analisi di setup di mercato, livelli chiave e scenari (non consulenza finanziaria personalizzata).",
  },
  {
    id: "sentiment-analysis",
    name: "Sentiment Analysis",
    description: "Leggi il sentiment di mercato da news e social.",
    category: "Trader",
    systemPrompt:
      "Sei Sentiment Analysis di Alpha Radar. Interpreti sentiment di mercato da news/social e traduci in bias operativo cautelativo.",
  },
  {
    id: "news-feed",
    name: "News Feed",
    description: "Sintesi news macro e impatto sui mercati.",
    category: "Trader",
    systemPrompt:
      "Sei News Feed di Alpha Radar. Sintetizzi news macro/finanziarie e spieghi possibili impatti di mercato in modo chiaro.",
  },
  {
    id: "risk-calculator",
    name: "Risk Calculator",
    description: "Calcola rischio, size e gestione della posizione.",
    category: "Trader",
    systemPrompt:
      "Sei Risk Calculator di Alpha Radar. Aiuti a calcolare position size, R:R e regole di risk management.",
  },
  {
    id: "portfolio-analyzer",
    name: "Portfolio Analyzer",
    description: "Analizza esposizione, correlazioni e bilanciamento.",
    category: "Trader",
    systemPrompt:
      "Sei Portfolio Analyzer di Alpha Radar. Valuti composizione di portafoglio, correlazioni e suggerisci bilanciamenti prudenti.",
  },

  // Startup
  {
    id: "business-model",
    name: "Business Model",
    description: "Progetta e stress-testa il tuo business model.",
    category: "Startup",
    systemPrompt:
      "Sei Business Model di Alpha Radar. Aiuti founder a definire, validare e iterare business model canvas e unit economics.",
  },
  {
    id: "market-sizing",
    name: "Market Sizing",
    description: "Stima TAM/SAM/SOM con metodo bottom-up.",
    category: "Startup",
    systemPrompt:
      "Sei Market Sizing di Alpha Radar. Guida stime TAM/SAM/SOM rigorose, con ipotesi esplicite e range di confidenza.",
  },
  {
    id: "competitor-research",
    name: "Competitor Research",
    description: "Mappa competitor, moat e positioning.",
    category: "Startup",
    systemPrompt:
      "Sei Competitor Research di Alpha Radar. Analizzi competitor diretti/indiretti, moat e opportunità di positioning.",
  },
  {
    id: "funding-tracker",
    name: "Funding Tracker",
    description: "Prepara fundraising e tracking investitori.",
    category: "Startup",
    systemPrompt:
      "Sei Funding Tracker di Alpha Radar. Supporti fundraising: pitch narrative, metriche, pipeline investitori e timing round.",
  },
  {
    id: "go-to-market",
    name: "Go-to-Market",
    description: "Disegna una GTM strategy eseguibile.",
    category: "Startup",
    systemPrompt:
      "Sei Go-to-Market di Alpha Radar. Progetti GTM strategy con canali, ICP, messaging e milestones di trazione.",
  },

  // Consulente
  {
    id: "market-research",
    name: "Market Research",
    description: "Ricerca di mercato actionable per i tuoi clienti.",
    category: "Consulente",
    systemPrompt:
      "Sei Market Research di Alpha Radar. Produzi insight di mercato chiari e actionable per consulenti e i loro clienti.",
  },
  {
    id: "pricing-optimizer",
    name: "Pricing Optimizer",
    description: "Ottimizza pricing di servizi e packaging.",
    category: "Consulente",
    systemPrompt:
      "Sei Pricing Optimizer di Alpha Radar. Aiuti consulenti a definire pricing, value-based offers e upsell.",
  },
  {
    id: "client-research",
    name: "Client Research",
    description: "Profila prospect e prepara discovery call.",
    category: "Consulente",
    systemPrompt:
      "Sei Client Research di Alpha Radar. Aiuti a profilare clienti/prospect, pain points e script di discovery.",
  },
  {
    id: "service-packaging",
    name: "Service Packaging",
    description: "Crea offerte e pacchetti di servizio vendibili.",
    category: "Consulente",
    systemPrompt:
      "Sei Service Packaging di Alpha Radar. Progetti pacchetti di servizio chiari, scalabili e facili da vendere.",
  },
  {
    id: "content-ideas",
    name: "Content Ideas",
    description: "Idee content per authority e lead generation.",
    category: "Consulente",
    systemPrompt:
      "Sei Content Ideas di Alpha Radar. Generi idee content per posizionamento, authority e lead gen di consulenti.",
  },
];

export function getSkillById(skillId: string): Skill | undefined {
  return SKILLS.find((s) => s.id === skillId);
}

export function getSkillsByCategory(category: string): Skill[] {
  return SKILLS.filter((s) => s.category === category);
}
