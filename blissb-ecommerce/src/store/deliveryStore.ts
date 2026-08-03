import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DeliveryType = "shipping" | "delivery" | "pickup";

export type ShippingAddress = { street: string; city: string; state: string; zip: string };

const EMPTY_ADDRESS: ShippingAddress = { street: "", city: "", state: "", zip: "" };

// The actual delivery/pickup date+time isn't something the customer picks from a calendar —
// it's the single deterministic next slot computed by src/lib/deliverySchedule.ts based on the
// real cutoff rules. This store only holds what the customer actually chooses: the fulfillment
// type, and the addresses.
//
// billingAddress is the primary one — collected once, right after contact info, since it's
// needed for the card regardless of fulfillment type. Delivery and Shipping each default to it
// (deliveryAddressSameAsBilling / shippingAddressSameAsBilling) with their own override address
// if the customer needs to send the order somewhere different from where their card bills to.
// Pickup needs no address at all — the bakery's own address is shown instead (not collected).
type DeliveryStore = {
  selectedType: DeliveryType;
  billingAddress: ShippingAddress;
  deliveryAddress: ShippingAddress;
  deliveryAddressSameAsBilling: boolean;
  shippingAddress: ShippingAddress;
  shippingAddressSameAsBilling: boolean;

  setDeliveryType: (type: DeliveryType) => void;
  setBillingAddress: (patch: Partial<ShippingAddress>) => void;
  setDeliveryAddress: (patch: Partial<ShippingAddress>) => void;
  setDeliveryAddressSameAsBilling: (same: boolean) => void;
  setShippingAddress: (patch: Partial<ShippingAddress>) => void;
  setShippingAddressSameAsBilling: (same: boolean) => void;
  resetDelivery: () => void;
};

export const useDeliveryStore = create<DeliveryStore>()(
  persist(
    (set) => ({
      selectedType: "pickup",
      billingAddress: EMPTY_ADDRESS,
      deliveryAddress: EMPTY_ADDRESS,
      deliveryAddressSameAsBilling: true,
      shippingAddress: EMPTY_ADDRESS,
      shippingAddressSameAsBilling: true,

      setDeliveryType: (type) => set({ selectedType: type }),
      setBillingAddress: (patch) => set((state) => ({ billingAddress: { ...state.billingAddress, ...patch } })),
      setDeliveryAddress: (patch) => set((state) => ({ deliveryAddress: { ...state.deliveryAddress, ...patch } })),
      setDeliveryAddressSameAsBilling: (same) => set({ deliveryAddressSameAsBilling: same }),
      setShippingAddress: (patch) => set((state) => ({ shippingAddress: { ...state.shippingAddress, ...patch } })),
      setShippingAddressSameAsBilling: (same) => set({ shippingAddressSameAsBilling: same }),
      resetDelivery: () =>
        set({
          selectedType: "pickup",
          billingAddress: EMPTY_ADDRESS,
          deliveryAddress: EMPTY_ADDRESS,
          deliveryAddressSameAsBilling: true,
          shippingAddress: EMPTY_ADDRESS,
          shippingAddressSameAsBilling: true,
        }),
    }),
    {
      name: "bliss-b-delivery",
    }
  )
);
