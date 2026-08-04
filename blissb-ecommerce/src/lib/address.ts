import type { ShippingAddress } from "@/store/deliveryStore";

export function isAddressComplete(a: ShippingAddress) {
  return a.street.trim().length > 0 && a.city.trim().length > 0 && a.state.trim().length > 0 && a.zip.trim().length > 0;
}

export function joinAddress(a: ShippingAddress) {
  return [a.street, `${a.city}, ${a.state} ${a.zip}`.trim()].filter(Boolean).join(", ");
}
