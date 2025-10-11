import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DeliveryType = "shipping" | "delivery" | "pickup";

export type TimeSlot = {
  time: string;
  available: boolean;
  maxOrders?: number;
  currentOrders?: number;
};

export type DeliveryDay = {
  date: string;
  dayName: string;
  available: boolean;
  timeSlots: TimeSlot[];
};

export type DeliveryOption = {
  type: DeliveryType;
  label: string;
  description: string;
  estimatedTime?: string;
  fee?: number;
};

export type DeliveryZoneConfig = {
  freeDeliveryZipCodes: string[];
  standardDeliveryFee: number;
};

type DeliveryStore = {
  selectedType: DeliveryType;
  selectedDate: string | null;
  selectedTime: string | null;
  selectedZipCode: string;
  isConfirmed: boolean;

  // Actions
  setDeliveryType: (type: DeliveryType) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setSelectedZipCode: (zipCode: string) => void;
  confirmSelection: () => void;
  resetSelection: () => void;
  resetDelivery: () => void;

  // Getters
  getAvailableDays: (type: DeliveryType) => DeliveryDay[];
  getTimeSlots: (date: string, type: DeliveryType) => TimeSlot[];
  isValidSelection: () => boolean;
  getDeliveryOptions: () => DeliveryOption[];
  getDeliveryFee: (zipCode?: string) => number;
  isZipCodeInFreeZone: (zipCode: string) => boolean;
  getDeliveryZoneConfig: () => DeliveryZoneConfig;
  updateDeliveryFee: (newFee: number) => void;
};

// Configuración de horarios
const DELIVERY_SCHEDULE = {
  delivery: {
    days: ["monday", "friday"], // Solo lunes y viernes
    timeSlots: [
      { time: "3:00 PM - 6:00 PM", available: true },
    ],
  },
  pickup: {
    days: ["tuesday", "thursday"], // Solo martes y jueves
    timeSlots: [
      { time: "4:00 PM", available: true },
      { time: "5:00 PM", available: true },
      { time: "6:00 PM", available: true },
    ],
  },
};

// Configuración de zonas de entrega basada en zip codes
const DELIVERY_ZONE_CONFIG: DeliveryZoneConfig = {
  freeDeliveryZipCodes: [
    "30517",
    "30548",
    "30519",
    "30542",
    "30011",
    "30507",
    "30522",
    "30563",
    "30537",
    "30601",
    "30512",
    "30534",
    "30043",
    "30518",
    "30024",
  ],
  standardDeliveryFee: 20,
};

const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    type: "shipping",
    label: "Shipping",
    description: "We ship nationwide Monday to Friday",
    estimatedTime: "3-5 business days",
    fee: 15,
  },
  {
    type: "delivery",
    label: "Schedule Delivery",
    description: "Local delivery within 25 miles",
    estimatedTime: "Same day or next day",
    fee: 15,
  },
  {
    type: "pickup",
    label: "Schedule Pickup",
    description: "Pick up at our bakery location",
    estimatedTime: "Same day available",
    fee: 0,
  },
];

export const useDeliveryStore = create<DeliveryStore>()(
  persist(
    (set, get) => ({
      selectedType: "shipping",
      selectedDate: null,
      selectedTime: null,
      selectedZipCode: "",
      isConfirmed: false,

      setDeliveryType: (type) => {
        set({
          selectedType: type,
          selectedDate: null,
          selectedTime: null,
          isConfirmed: false,
        });
      },

      setSelectedDate: (date) => {
        set({
          selectedDate: date,
          selectedTime: null,
          isConfirmed: false,
        });
      },

      setSelectedTime: (time) => {
        set({
          selectedTime: time,
          isConfirmed: false,
        });
      },

      setSelectedZipCode: (zipCode) => {
        set({
          selectedZipCode: zipCode,
          isConfirmed: false,
        });
      },

      confirmSelection: () => {
        const { selectedType, selectedDate, selectedTime } = get();

        // Validar que la selección sea completa para delivery/pickup
        if (selectedType === "delivery" || selectedType === "pickup") {
          if (!selectedDate || !selectedTime) {
            return;
          }
        }

        set({ isConfirmed: true });
      },

      resetSelection: () => {
        set({
          selectedType: "shipping",
          selectedDate: null,
          selectedTime: null,
          selectedZipCode: "",
          isConfirmed: false,
        });
      },

      resetDelivery: () => {
        set({
          selectedType: "shipping",
          selectedDate: null,
          selectedTime: null,
          selectedZipCode: "",
          isConfirmed: false,
        });
      },

      getAvailableDays: (type) => {
        if (type === "shipping") return [];

        const schedule = DELIVERY_SCHEDULE[type];
        const today = new Date();
        const availableDays: DeliveryDay[] = [];

        // Generar próximos 14 días
        for (let i = 1; i <= 14; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);

          const dayName = date
            .toLocaleDateString("en-US", { weekday: "long" })
            .toLowerCase();
          const isAvailable = schedule.days.includes(dayName);

          if (isAvailable) {
            availableDays.push({
              date: date.toISOString().split("T")[0],
              dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
              available: true,
              timeSlots: schedule.timeSlots,
            });
          }
        }

        return availableDays;
      },

      getTimeSlots: (date, type) => {
        if (type === "shipping") return [];

        const schedule = DELIVERY_SCHEDULE[type];
        return schedule.timeSlots;
      },

      isValidSelection: () => {
        const { selectedType, selectedDate, selectedTime, selectedZipCode } =
          get();

        if (selectedType === "shipping") {
          return true; // Shipping no requiere fecha/hora específica
        }

        if (selectedType === "delivery") {
          // Delivery requiere zip code, fecha y hora
          return (
            selectedZipCode !== "" &&
            selectedZipCode.length === 5 &&
            selectedDate !== null &&
            selectedTime !== null
          );
        }

        if (selectedType === "pickup") {
          // Pickup solo requiere fecha y hora
          return selectedDate !== null && selectedTime !== null;
        }

        return false;
      },

      getDeliveryOptions: () => DELIVERY_OPTIONS,

      getDeliveryFee: (zipCode) => {
        const code = zipCode || get().selectedZipCode;
        if (!code || get().isZipCodeInFreeZone(code)) {
          return 0;
        }
        return DELIVERY_ZONE_CONFIG.standardDeliveryFee;
      },

      isZipCodeInFreeZone: (zipCode) => {
        return DELIVERY_ZONE_CONFIG.freeDeliveryZipCodes.includes(zipCode);
      },

      getDeliveryZoneConfig: () => DELIVERY_ZONE_CONFIG,

      updateDeliveryFee: (newFee) => {
        DELIVERY_ZONE_CONFIG.standardDeliveryFee = newFee;
      },
    }),
    {
      name: "bliss-b-delivery",
      partialize: (state) => ({
        selectedType: state.selectedType,
        selectedDate: state.selectedDate,
        selectedTime: state.selectedTime,
        selectedZipCode: state.selectedZipCode,
        isConfirmed: state.isConfirmed,
      }),
    }
  )
);
