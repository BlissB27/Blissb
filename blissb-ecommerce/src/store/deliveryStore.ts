import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DeliveryType = "shipping" | "delivery" | "pickup";

// The actual delivery/pickup date+time isn't something the customer picks from a calendar —
// it's the single deterministic next slot computed by src/lib/deliverySchedule.ts based on the
// real cutoff rules. This store only holds what the customer actually chooses: the fulfillment
// type and the delivery address (for the Google Maps mileage quote).
type DeliveryStore = {
  selectedType: DeliveryType;
  address: string;

  setDeliveryType: (type: DeliveryType) => void;
  setAddress: (address: string) => void;
  resetDelivery: () => void;
};

export const useDeliveryStore = create<DeliveryStore>()(
  persist(
    (set) => ({
      selectedType: "pickup",
      address: "",

      setDeliveryType: (type) => set({ selectedType: type }),
      setAddress: (address) => set({ address }),
      resetDelivery: () => set({ selectedType: "pickup", address: "" }),
    }),
    {
      name: "bliss-b-delivery",
    }
  )
);
