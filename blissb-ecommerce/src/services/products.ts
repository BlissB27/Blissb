import { strapiGet, strapiPut, getStrapiMediaUrl, isStrapiNotFound } from '@/lib/strapi';
import { StrapiResponse, StrapiProduct } from '@/types/strapi';
import type { Product } from '@/data/products';

// Strapi v5's populate=* only goes one level deep, so it picks up the
// flavorOptions component itself but not the media file nested inside each
// entry — has to be requested explicitly or every flavor photo comes back empty.
const PRODUCT_POPULATE = {
  'populate[image]': 'true',
  'populate[gallery]': 'true',
  'populate[flavorOptions][populate][image]': 'true',
};

// Convert Strapi product to our app's product format
export function transformStrapiProduct(strapiProduct: any): Product {
  // flavorOptions (nombre + foto) es la única fuente de verdad del selector de
  // sabores: la lista de nombres `flavors` que consume el resto de la app se
  // deriva de aquí, así en Strapi solo se llena este campo (el viejo campo
  // `flavors` ya no existe en el schema).
  const flavorOptions = (strapiProduct.flavorOptions || [])
    .filter((f: any) => f?.name && f?.image?.url)
    .map((f: any) => ({ name: f.name, image: getStrapiMediaUrl(f.image.url) }));

  // Strapi v5 format - no attributes wrapper, direct fields
  return {
    id: strapiProduct.documentId || strapiProduct.id.toString(),
    name: strapiProduct.name || '',
    price: strapiProduct.price || 0,
    category: strapiProduct.category || 'cookies',
    image: getStrapiMediaUrl(strapiProduct.image?.url || ''),
    description: Array.isArray(strapiProduct.description)
      ? strapiProduct.description.map((p: any) =>
          p.children?.map((c: any) => c.text).join('')
        ).join(' ')
      : strapiProduct.description || '',
    isNew: strapiProduct.isNew || false,
    isOnOffer: strapiProduct.isOnOffer || false,
    originalPrice: strapiProduct.originalPrice,
    flavors: flavorOptions.map((f: { name: string }) => f.name),
    flavorOptions,
    allowCustomMessage: strapiProduct.allowCustomMessage || false,
    // Agregar galería de imágenes
    gallery: strapiProduct.gallery?.map((img: any) => getStrapiMediaUrl(img.url)) || [],
    slug: strapiProduct.slug || '',
    stock: strapiProduct.stock ?? 0,
    isSoldInBox: strapiProduct.isSoldInBox ?? false,
    boxSize: strapiProduct.boxSize ?? undefined,
  };
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    const response: any = await strapiGet('/products', {
      ...PRODUCT_POPULATE,
      'sort': 'createdAt:desc'
    });

    return response.data.map(transformStrapiProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array as fallback
    return [];
  }
}

// Get products by category
// Note: does NOT swallow fetch errors into an empty array — callers must
// distinguish "the fetch failed" from "this category genuinely has no products".
export async function getProductsByCategory(category: Product['category']): Promise<Product[]> {
  const response: any = await strapiGet('/products', {
    ...PRODUCT_POPULATE,
    'sort': 'createdAt:desc'
  });

  // Transform all products and filter by category on client side
  const allProducts = response.data.map(transformStrapiProduct);
  return allProducts.filter((product: Product) => product.category === category);
}

// Get single product by ID (using documentId for Strapi v5)
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const isNumericId = /^\d+$/.test(id);
    const response: any = isNumericId
      ? await strapiGet('/products', {
          'filters[id][$eq]': id,
          ...PRODUCT_POPULATE
        })
      : await strapiGet(`/products/${id}`, {
          ...PRODUCT_POPULATE
        });

    const product = Array.isArray(response.data) ? response.data[0] : response.data;
    return product ? transformStrapiProduct(product) : null;
  } catch (error) {
    // A 404 here just means "no product with this id" — a routine lookup
    // miss (e.g. the slug fallback path), not something worth logging.
    if (!isStrapiNotFound(error)) {
      console.error(`Error fetching product ${id}:`, error);
    }
    return null;
  }
}

// Get single product by slug (preferred method)
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response: any = await strapiGet('/products', {
      'filters[slug][$eq]': slug,
      ...PRODUCT_POPULATE
    });

    if (response.data.length === 0) {
      return null;
    }

    return transformStrapiProduct(response.data[0]);
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return null;
  }
}

// Get featured products (new or on offer)
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response: any = await strapiGet('/products', {
      'filters[$or][0][isNew][$eq]': 'true',
      'filters[$or][1][isOnOffer][$eq]': 'true',
      ...PRODUCT_POPULATE,
      'sort': 'createdAt:desc',
      'pagination[limit]': '8'
    });

    return response.data.map(transformStrapiProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

// Descuenta stock tras un pago exitoso. Best-effort: si falla, no debe tumbar el webhook
// que la llama (el pago ya se cobró) — el caller es responsable de atrapar errores.
export async function decrementProductStock(productId: string, quantity: number): Promise<boolean> {
  try {
    const response: any = await strapiGet(`/products/${productId}`);
    const currentStock = response?.data?.stock ?? 0;
    const newStock = Math.max(0, currentStock - quantity);

    await strapiPut(`/products/${productId}`, { data: { stock: newStock } });
    return true;
  } catch (error) {
    console.error(`Error decrementing stock for product ${productId}:`, error);
    return false;
  }
}

// Search products by name
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response: any = await strapiGet('/products', {
      'filters[name][$containsi]': query,
      ...PRODUCT_POPULATE,
      'sort': 'name:asc'
    });

    return response.data.map(transformStrapiProduct);
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    return [];
  }
}
