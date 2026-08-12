

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
}

const creatorSkills: Skill[] = [
  {
    id: "trend-spotter",
    name: "Trend Spotter",
    description: "Individua trend emergenti primo che diventino mainstream.",
    category: "Creator",
  },
  {
    id: "caption-generator",
    name: "Caption Generator",
    description: "Genero caption ad alto engagement per ogni piattaforma.",
    category: "Creator",
  },
  {
    id: "competitor-analyzer",
    name: "Competitor Analyzer",
    description: "Analizza competitor e trova gap di contenuto sfruttabili.",
    category: "Creator",
  },
  {
    id: "momentum-signals",
    name: "Momentum Signals",
    description: "Identifica il momento giusto per postare e engagement max.",
    category: "Creator",
  },
  {
    id: "opportunity-feed",
    name: "Opportunity Feed",
    description: "Feed di opportunità: collab, brand deal e formati virali.",
    category: "Creator",
  },
];

const traderSkills: Skill[] = [
  {
    id: "trend-spotter",
    name: "Trend Spotter",
    description: "Individua trend di mercato emergenti prima della massa.",
    category: "Trader",
  },
  {
    id: "market-sizing",
    name: "Market Sizing",
    description: "Calcola potenziale di mercato e TAM/SAM/SOM.",
    category: "Trader",
  },
  {
    id: "aura-mirror",
    name: "Aura Mirror",
    description: "Dashboard con sentiment di mercato e momentum real-time.",
    category: "Trader",
  },
  {
    id: "business-model-generator",
    name: "Business Model Generator",
    description: "Genera modelli di business per startup e scale-up.",
    category: "Trader",
  },
  {
    id: "caption-generator",
    name: "Caption Generator",
    description: "Crea messaggi di trading ad alto impatto psicologico.",
    category: "Trader",
  },
];

const ecommerceSkills: Skill[] = [
  {
    id: "market-sizing",
    name: "Market Sizing",
    description: "Analizza mercati nichia e stima potenziale di vendita.",
    category: "E-commerce",
  },
  {
    id: "caption-generator",
    name: "Caption Generator",
    description: "Crea copy persuasive che converte visitor in buyer.",
    category: "E-commerce",
  },
  {
    id: "competitor-analyzer",
    name: "Competitor Analyzer",
    description: "Analizza strategie di competitor e trova vantaggi.",
    category: "E-commerce",
  },
  {
    id: "business-model-generator",
    name: "Business Model Generator",
    description: "Disegna modelli di business sostenibili per e-shop.",
    category: "E-commerce",
  },
  {
    id: "momentum-signals",
    name: "Momentum Signals",
    description: "Identifica prodotti trending e stagioni di vendita.",
    category: "E-commerce",
  },
];

const startupSkills: Skill[] = [
  {
    id: "business-model-generator",
    name: "Business Model Generator",
    description: "Crea modelli di business scalabili da zero.",
    category: "Startup",
  },
  {
    id: "market-sizing",
    name: "Market Sizing",
    description: "Calcola TAM e opportunità di mercato per il tuo prodotto.",
    category: "Startup",
  },
  {
    id: "competitor-analyzer",
    name: "Competitor Analyzer",
    description: "Mappa competitor e identifica spazi vuoti di mercato.",
    category: "Startup",
  },
  {
    id: "trend-spotter",
    name: "Trend Spotter",
    description: "Scopri trend tecnologici e di mercato prima di altri.",
    category: "Startup",
  },
  {
    id: "opportunity-feed",
    name: "Opportunity Feed",
    description: "Feed di opportunità: partnership, funding e growth hacks.",
    category: "Startup",
  },
];

const consulenteSkills: Skill[] = [
  {
    id: "business-model-generator",
    name: "Business Model Generator",
    description: "Sviluppa strategie di business per clienti.",
    category: "Consulente",
  },
  {
    id: "competitor-analyzer",
    name: "Competitor Analyzer",
    description: "Analisi competitive dettagliate per posizionamento.",
    category: "Consulente",
  },
  {
    id: "market-sizing",
    name: "Market Sizing",
    description: "Valutazioni di mercato e sizing per consulenze.",
    category: "Consulente",
  },
  {
    id: "trend-spotter",
    name: "Trend Spotter",
    description: "Identifica trend e opportunità per clienti.",
    category: "Consulente",
  },
  {
    id: "momentum-signals",
    name: "Momentum Signals",
    description: "Timing di mercato e signal per decisioni strategiche.",
    category: "Consulente",
  },
];

const skillsByCategory: Record<string, Skill[]> = {
  Creator: creatorSkills,
  Trader: traderSkills,
  "E-commerce": ecommerceSkills,
  Startup: startupSkills,
  Consulente: consulenteSkills,
};

export function getSkillsByCategory(category: string): Skill[] {
  return skillsByCategory[category] || [];
}

export function getAllSkills(): Skill[] {
  const allSkills: Skill[] = [];
  
  Object.values(skillsByCategory).forEach((skills) => {
    allSkills.push(...skills);
  });
  
  return allSkills;
}