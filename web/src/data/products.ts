export interface Product {
  slug: string;
  name: string;
  shortName: string;
  price: number; // in BRL cents
  description: string;
  longDescription: string;
  featured: boolean;
  available: boolean;
  images: string[]; // paths relative to src/assets/products/
  details: string[];
  category: string;
  /** Badges/seals to overlay on product images */
  badges?: string[];
  /** CTA button text (defaults to cart behavior) */
  ctaText?: string;
  /** CTA button link (if external, e.g. Instagram) */
  ctaLink?: string;
  /** Prominent notice to display on product page */
  notice?: string;
  /** Shipping: weight in kg */
  weight: number;
  /** Shipping: height in cm */
  height: number;
  /** Shipping: width in cm */
  width: number;
  /** Shipping: length in cm */
  length: number;
}

export const products: Product[] = [
  {
    slug: "mini-fichario",
    name: "Mini Journal",
    shortName: "Mini Journal",
    price: 6000, // R$60
    description:
      "Mini fichário A6 de couro sintético + arquivo de folhas personalizadas COGU.",
    longDescription: `O Mini Journal é perfeito para quem gosta de escrever à mão seus pensamentos, ideias, anotações, rabiscos e também para organizar a vida do jeitinho mais analógico possível. Ele vai ser sua companhia em todos os lugares.

*Não acompanha folhas impressas.`,
    featured: true,
    available: true,
    images: [
      "mini-fichario/product-1.png",
      "mini-fichario/product-2.png",
      "mini-fichario/product-3.png",
    ],
    details: [
      "Compacto — cabe na bolsa/mochila sem atrapalhar",
      "Bolsinhos internos + suporte para caneta",
      "Folhas removíveis, recarregáveis e personalizáveis",
      "Estoque limitado",
    ],
    badges: [
      "Estoque limitado",
      "Sem folhas inclusas",
      "+ Folhas personalizadas",
    ],
    ctaText: "Reserve o seu",
    ctaLink: "https://instagram.com/cogupaper",
    notice:
      "O seu Mini Journal apenas estará reservado após a confirmação do pagamento. Fale com a nossa equipe no Instagram.",
    category: "Papelaria",
    weight: 0.3,
    height: 4,
    width: 17,
    length: 22,
  },
  {
    slug: "stickers-set",
    name: "Kit de Adesivos Natureza",
    shortName: "Kit Adesivos",
    price: 0, // price TBD
    description:
      "Uma coleção de adesivos inspirados na natureza — cogumelos, borboletas e plantinhas para decorar seus cadernos, garrafas e o que mais a imaginação permitir.",
    longDescription: `Nossos adesivos são pequenos pedaços de natureza que você pode levar para qualquer lugar.
Cada ilustração foi desenhada com amor, inspirada nos cogumelos, borboletas 
e plantinhas que encontramos quando caminhamos devagar.

Perfeitos para decorar cadernos, fichários, garrafas, notebooks 
e tudo mais que precisar de um toque de encanto.`,
    featured: false,
    available: true,
    images: [
      "stickers-set/product-1.png",
      "stickers-set/product-2.png",
      "stickers-set/product-3.png",
      "stickers-set/product-4.png",
    ],
    details: [
      "Ilustrações originais",
      "Impressão de alta qualidade",
      "Resistente à água",
      "Inspirados na natureza",
    ],
    category: "Adesivos",
    weight: 0.1,
    height: 1,
    width: 16,
    length: 11,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function formatPrice(cents: number): string {
  if (cents === 0) return "Em breve";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}
