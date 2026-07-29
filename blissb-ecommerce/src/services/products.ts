import { strapiGet, strapiPut, getStrapiMediaUrl } from '@/lib/strapi';
import { StrapiResponse, StrapiProduct } from '@/types/strapi';
import type { Product } from '@/data/products';

// Convert Strapi product to our app's product format
export function transformStrapiProduct(strapiProduct: any): Product {
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
    flavors: strapiProduct.flavors || [],
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
      'populate': '*',
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
    'populate': '*',
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
          'populate': '*'
        })
      : await strapiGet(`/products/${id}`, {
          'populate': '*'
        });

    const product = Array.isArray(response.data) ? response.data[0] : response.data;
    return product ? transformStrapiProduct(product) : null;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

// Get single product by slug (preferred method)
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response: any = await strapiGet('/products', {
      'filters[slug][$eq]': slug,
      'populate': '*'
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
      'populate': '*',
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
      'populate': '*',
      'sort': 'name:asc'
    });

    return response.data.map(transformStrapiProduct);
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    return [];
  }
}
