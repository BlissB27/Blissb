export type Product = {
  id: string;
  name: string;
  price: number;
  category: "cookies" | "cakes" | "desserts";
  image: string;
  description?: string;
  isNew?: boolean;
  isOnOffer?: boolean;
  originalPrice?: number;
  minQuantity?: number; // Ya no se usa para cookies, pero mantener por compatibilidad
  flavors?: string[]; // Para productos que requieren selección de sabor
  allowCustomMessage?: boolean; // Si permite mensaje personalizado (ej: cakes, algunos desserts)
  gallery?: string[]; // Galería de imágenes adicionales
  slug?: string; // URL slug para SEO friendly URLs
  stock?: number; // Cantidad disponible en inventario
};

export const PRODUCTS: Product[] = [
  // Cookies
  {
    id: "chocolate-chips",
    name: "Chocolate Chips",
    price: 5.00,
    category: "cookies",
    image: "/img/chips.jpg",
    description: "Classic chocolate chip cookies with premium chocolate chunks",
    isNew: true,
    slug: "chocolate-chips",
  },
  {
    id: "pirulin",
    name: "Pirulin",
    price: 5.00,
    category: "cookies",
    image: "/img/Pirulin.jpg",
    description: "Crispy wafer rolls with delicious cream filling",
    slug: "pirulin",
  },
  {
    id: "samba",
    name: "Samba",
    price: 5.00,
    category: "cookies",
    image: "/img/samba.JPG",
    description: "Rich chocolate cookies with coconut flakes",
    isOnOffer: true,
    originalPrice: 6.00,
    slug: "samba",
  },
  {
    id: "choco-brownie",
    name: "Choco Brownie",
    price: 5.00,
    category: "cookies",
    image: "/img/chocob.JPG",
    description: "Fudgy brownie cookies with chocolate chunks",
    slug: "choco-brownie",
  },
  // Cakes con sabores disponibles
  {
    id: "vanilla-cake",
    name: "Vanilla Cake",
    price: 25.00,
    category: "cakes",
    image: "/img/cakec.png",
    description: "Classic vanilla cake with buttercream frosting",
    flavors: ["Vanilla", "Strawberry", "Lemon", "Coconut"],
    slug: "vanilla-cake",
  },
  {
    id: "chocolate-cake",
    name: "Chocolate Cake",
    price: 28.00,
    category: "cakes",
    image: "/img/cake2.png",
    description: "Rich chocolate cake with chocolate ganache",
    flavors: ["Chocolate", "Red Velvet", "Mocha", "Dark Chocolate"],
    slug: "chocolate-cake",
  },
  // Desserts (sin sabores especiales)
  {
    id: "tiramisu",
    name: "Tiramisu",
    price: 8.00,
    category: "desserts",
    image: "/img/cakec.png",
    description: "Classic Italian dessert with coffee and mascarpone",
    slug: "tiramisu",
  },
  {
    id: "cheesecake",
    name: "Cheesecake",
    price: 7.00,
    category: "desserts",
    image: "/img/cake2.png",
    description: "New York style cheesecake with berry compote",
    slug: "cheesecake",
  },
];

// Funciones helper - DEPRECATED: Use services/products.ts instead
// Keeping these for backward compatibility during migration
export const getProductsByCategory = (category: Product['category']) => {
  return PRODUCTS.filter(product => product.category === category);
};

export const getProductById = (id: string) => {
  return PRODUCTS.find(product => product.id === id);
};

export const getFeaturedProducts = () => {
  return PRODUCTS.filter(product => product.isNew || product.isOnOffer);
};

// Re-export services for easy migration
export {
  getAllProducts,
  getProductsByCategory as getProductsByCategoryAsync,
  getProductById as getProductByIdAsync,
  getProductBySlug,
  getFeaturedProducts as getFeaturedProductsAsync,
  searchProducts,
} from '@/services/products';