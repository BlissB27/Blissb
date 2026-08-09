import { getProductByIdAsync } from '@/data/products';

// Compact per-item snapshot stashed in the PaymentIntent's metadata (see
// chunkMetadata in lib/stripe.ts). A PaymentIntent has no line_items like a
// Checkout Session does, so the webhook needs *something* to re-fetch full
// product details (name/price/image) from Strapi with — this is deliberately
// minimal (no name/price here) since the webhook re-validates from Strapi
// anyway, which is more trustworthy than echoing back what the client sent.
export type CompactItem = {
  id: string;
  q: number;
  f?: string;
  bf?: { flavor: string; quantity: number }[];
  m?: string; // Mensaje corto en chocolate (solo cakes)
};

// Igual que CAKE_MESSAGE_MAX_LENGTH en el store — se re-aplica en el servidor
// para no confiar en el largo que mande el cliente.
const CAKE_MESSAGE_MAX_LENGTH = 13;

// 🔒 Re-validates every item against Strapi (price/stock/flavor selection) —
// shared by /api/checkout (which charges the customer) and /api/tax-quote
// (which only previews a total), so both always price line items identically.
export async function validateAndPriceItems(items: any[]): Promise<{
  validatedSubtotal: number;
  lineItemAmounts: number[]; // cents, parallel to compactItems — for Stripe Tax
  compactItems: CompactItem[];
}> {
  let validatedSubtotal = 0;
  const lineItemAmounts: number[] = [];
  const compactItems: CompactItem[] = await Promise.all(
    items.map(async (item: any) => {
      try {
        // Consultar precio real desde Strapi
        const strapiProduct = await getProductByIdAsync(item.product.id);

        if (!strapiProduct) {
          console.error(`Product not found in Strapi: ${item.product.id}`);
          throw new Error(`Product ${item.product.name} is no longer available`);
        }

        const realPrice = strapiProduct.price;

        // Verificar que el precio coincida (tolerancia de 0.01 por redondeo)
        if (Math.abs(realPrice - item.product.price) > 0.01) {
          console.warn(`Price mismatch detected for ${item.product.id}:`, {
            frontendPrice: item.product.price,
            strapiPrice: realPrice,
            productName: item.product.name,
          });

          // Usar el precio de Strapi (la fuente de verdad)
          // En producción, podrías rechazar la transacción o notificar al usuario
        }

        // 🔒 VALIDAR REPARTO DE SABORES POR CHECKBOXES (cajas y productos regulares con flavors)
        const boxFlavors = item.boxFlavors as { flavor: string; quantity: number }[] | undefined;
        if (boxFlavors) {
          const uniqueFlavors = new Set(boxFlavors.map((f) => f.flavor));
          const total = boxFlavors.reduce((sum, f) => sum + f.quantity, 0);
          const validFlavorNames = new Set(strapiProduct.flavors ?? []);

          const basicInvalid =
            boxFlavors.length === 0 ||
            boxFlavors.length > 3 ||
            uniqueFlavors.size !== boxFlavors.length ||
            boxFlavors.some((f) => !validFlavorNames.has(f.flavor)) ||
            total < 1;

          const boxInvalid =
            strapiProduct.isSoldInBox && (!strapiProduct.boxSize || total !== strapiProduct.boxSize);

          if (basicInvalid || boxInvalid) {
            throw new Error(`Invalid flavor selection for ${strapiProduct.name}`);
          }
        } else if (strapiProduct.isSoldInBox) {
          throw new Error(`Invalid flavor selection for ${strapiProduct.name}`);
        }

        // boxFlavors is the fixed recipe for ONE box (already validated above to
        // sum to boxSize) — it is never the purchase quantity. The real quantity
        // (how many boxes/units) is always item.quantity, same as any other product.
        const validQuantity = Math.max(1, Math.min(100, item.quantity));
        validatedSubtotal += realPrice * validQuantity;
        lineItemAmounts.push(Math.round(realPrice * validQuantity * 100));

        // 🔒 Disponibilidad real (sin exponer cantidades de stock al cliente)
        const availableStock = strapiProduct.stock ?? 0;
        if (validQuantity > availableStock) {
          throw new Error('One or more items in your cart are currently unavailable. Please remove them and try again.');
        }

        // El mensaje en chocolate solo aplica a cakes — se ignora en cualquier
        // otro producto aunque el cliente lo mande.
        const rawMessage = typeof item.message === 'string' ? item.message.trim() : '';
        const message =
          strapiProduct.category === 'cakes' && rawMessage.length > 0
            ? rawMessage.slice(0, CAKE_MESSAGE_MAX_LENGTH)
            : undefined;

        return {
          id: strapiProduct.id,
          q: validQuantity,
          f: item.flavor,
          bf: boxFlavors,
          m: message,
        };
      } catch (error) {
        console.error(`Error validating product ${item.product.id}:`, error);
        throw error instanceof Error ? error : new Error(`Unable to validate product: ${item.product.name}`);
      }
    })
  );

  return { validatedSubtotal, lineItemAmounts, compactItems };
}
