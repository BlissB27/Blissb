export type Product = {
    id: string;
    name: string;
    price: number;
    category: "cookies" | "cakes" | "desserts";
    image: string;
    description?: string;
    isNew?: boolean;
    isOnOffer?: boolean;
    originalPrice?: number; // Para productos en oferta
    minQuantity?: number; // Para cookies (cantidad mínima)
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
      
    },
    {
      id: "pirulin",
      name: "Pirulin",
      price: 5.00,
      category: "cookies",
      image: "/img/Pirulin.jpg",
      description: "Crispy wafer rolls with delicious cream filling",
      
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
      
    },
    {
      id: "choco-brownie",
      name: "Choco Brownie",
      price: 5.00,
      category: "cookies",
      image: "/img/chocob.JPG",
      description: "Fudgy brownie cookies with chocolate chunks",
     
    },
    // Cakes (sin cantidad mínima)
    {
      id: "vanilla-cake",
      name: "Vanilla Cake",
      price: 25.00,
      category: "cakes",
      image: "/img/cakec.png",
      description: "Classic vanilla cake with buttercream frosting",
    },
    {
      id: "chocolate-cake",
      name: "Chocolate Cake",
      price: 28.00,
      category: "cakes",
      image: "/img/cake2.png",
      description: "Rich chocolate cake with chocolate ganache",
    },
    // Desserts (sin cantidad mínima)
    {
      id: "tiramisu",
      name: "Tiramisu",
      price: 8.00,
      category: "desserts",
      image: "/img/cakec.png",
      description: "Classic Italian dessert with coffee and mascarpone",
    },
    {
      id: "cheesecake",
      name: "Cheesecake",
      price: 7.00,
      category: "desserts",
      image: "/img/cake2.png",
      description: "New York style cheesecake with berry compote",
    },
  ];
  
  // Funciones helper
  export const getProductsByCategory = (category: Product['category']) => {
    return PRODUCTS.filter(product => product.category === category);
  };
  
  export const getProductById = (id: string) => {
    return PRODUCTS.find(product => product.id === id);
  };
  
  export const getFeaturedProducts = () => {
    return PRODUCTS.filter(product => product.isNew || product.isOnOffer);
  };