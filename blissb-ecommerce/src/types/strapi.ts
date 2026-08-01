// Strapi common types
export interface StrapiMedia {
  id: number;
  attributes: {
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: any;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity {
  id: number;
  attributes: Record<string, any> & {
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}

// Product types for Strapi
export interface StrapiProductAttributes {
  name: string;
  price: number;
  category: "cookies" | "cakes" | "desserts";
  description?: string;
  isNew?: boolean;
  isOnOffer?: boolean;
  originalPrice?: number;
  flavors?: string[];
  flavorOptions?: { name: string; image: { url: string } }[];
  slug: string;
  image: {
    data: StrapiMedia | null;
  };
  gallery?: {
    data: StrapiMedia[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiProduct extends StrapiEntity {
  attributes: StrapiProductAttributes;
}

// Category types for Strapi
export interface StrapiCategoryAttributes {
  name: string;
  slug: string;
  description?: string;
  image?: {
    data: StrapiMedia | null;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiCategory extends StrapiEntity {
  attributes: StrapiCategoryAttributes;
}