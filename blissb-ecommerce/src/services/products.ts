import { strapiGet, getStrapiMediaUrl } from '@/lib/strapi';
import { StrapiResponse, StrapiProduct } from '@/types/strapi';
import type { Product } from '@/data/products';

// Convert Strapi product to our app's product format
export function transformStrapiProduct(strapiProduct: any): Product {
  console.log('Transforming Strapi product:', strapiProduct);

  // Strapi v5 format - no attributes wrapper, direct fields
  const transformed = {
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
    // Agregar galería de imágenes
    gallery: strapiProduct.gallery?.map((img: any) => getStrapiMediaUrl(img.url)) || [],
    slug: strapiProduct.slug || '',
  };

  console.log('Transformed product:', transformed);
  return transformed;
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
export async function getProductsByCategory(category: Product['category']): Promise<Product[]> {
  try {
    console.log(`Fetching products for category: ${category}`);
    console.log(`Strapi URL: ${process.env.NEXT_PUBLIC_STRAPI_URL}`);

    // Get all products first
    const response: any = await strapiGet('/products', {
      'populate': '*',
      'sort': 'createdAt:desc'
    });

    console.log(`Found ${response.data?.length || 0} total products`);

    // Transform all products
    const allProducts = response.data.map(transformStrapiProduct);

    // Filter by category on client side
    const filteredProducts = allProducts.filter((product: Product) => product.category === category);

    console.log(`Found ${filteredProducts.length} products for category ${category}`);
    console.log('Filtered products:', filteredProducts);

    return filteredProducts;
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
    return [];
  }
}

// Get single product by ID (using documentId for Strapi v5)
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response: any = await strapiGet(`/products/${id}`, {
      'populate': '*'
    });

    return transformStrapiProduct(response.data);
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