import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DeliveryType = "shipping" | "delivery" | "pickup";

export type ShippingAddress = { street: string; city: string; state: string; zip: string };

const EMPTY_SHIPPING_ADDRESS: ShippingAddress = { street: "", city: "", state: "", zip: "" };

// The actual delivery/pickup date+time isn't something the customer picks from a calendar —
// it's the single deterministic next slot computed by src/lib/deliverySchedule.ts based on the
// real cutoff rules. This store only holds what the customer actually chooses: the fulfillment
// type, the delivery address (for the Google Maps mileage quote), and the structured shipping
// address (collected in our own UI now that Stripe's hosted page no longer does it).
type DeliveryStore = {
  selectedType: DeliveryType;
  address: string;
  shippingAddress: ShippingAddress;

  setDeliveryType: (type: DeliveryType) => void;
  setAddress: (address: string) => void;
  setShippingAddress: (patch: Partial<ShippingAddress>) => void;
  resetDelivery: () => void;
};

export const useDeliveryStore = create<DeliveryStore>()(
  persist(
    (set) => ({
      selectedType: "pickup",
      address: "",
      shippingAddress: EMPTY_SHIPPING_ADDRESS,

      setDeliveryType: (type) => set({ selectedType: type }),
      setAddress: (address) => set({ address }),
      setShippingAddress: (patch) => set((state) => ({ shippingAddress: { ...state.shippingAddress, ...patch } })),
      resetDelivery: () => set({ selectedType: "pickup", address: "", shippingAddress: EMPTY_SHIPPING_ADDRESS }),
    }),
    {
      name: "bliss-b-delivery",
    }
  )
);
