export type PlanId = "standard" | "pro";

export type Plan = {
  id: PlanId;
  name: "Standard" | "Pro";
  price: number;
  priceLabel: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
};

export const PLANS: Record<PlanId, Plan> = {
  standard: {
    id: "standard",
    name: "Standard",
    price: 49,
    priceLabel: "€49",
    tagline: "Il radar essenziale per partire.",
    features: [
      "Accesso a 2 skill della tua categoria",
      "Chat AI illimitata (fair use)",
      "Cronologia conversazioni",
      "Aggiornamenti skill mensili",
      "Supporto email",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 97,
    priceLabel: "€97",
    tagline: "Massima copertura per professionisti.",
    highlighted: true,
    features: [
      "Tutto di Standard",
      "Priority response Alpha Radar",
      "Prompt avanzati per skill",
      "Export conversazioni",
      "Supporto prioritario",
      "Accesso early a nuove skill",
    ],
  },
};

export function getPlan(planId: string): Plan | null {
  if (planId === "standard" || planId === "pro") {
    return PLANS[planId];
  }
  return null;
}

export function planNameFromId(planId: string): "Standard" | "Pro" {
  return planId === "pro" ? "Pro" : "Standard";
}
