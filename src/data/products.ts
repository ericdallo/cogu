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
}

export const products: Product[] = [
  {
    slug: "mini-fichario",
    name: "Mini Fichário Cogu",
    shortName: "Mini Fichário",
    price: 0, // price TBD
    description:
      "Um fichário compacto e aconchegante, feito à mão com carinho para organizar seus pensamentos, listas e rabiscos do dia a dia.",
    longDescription: `Nosso mini fichário nasceu da vontade de criar algo que cabe na bolsa, 
mas que guarda o mundo inteiro. Feito à mão com materiais escolhidos a dedo, 
ele é perfeito para quem gosta de anotar, rabiscar e organizar a vida com leveza.

Cada fichário é único — porque coisas feitas com as mãos carregam 
a imperfeição bonita de quem as fez.`,
    featured: true,
    available: true,
    images: [
      "mini-fichario/product-1.png",
      "mini-fichario/product-2.png",
      "mini-fichario/product-3.png",
    ],
    details: [
      "Feito à mão com carinho",
      "Compacto — cabe na bolsa",
      "Folhas removíveis e recarregáveis",
      "Materiais selecionados",
    ],
    category: "Papelaria",
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
