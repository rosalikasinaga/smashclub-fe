import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Coach {
    id: string;
    name: string;
    specialization: string;
    price: number;
    image: string;
}

export interface Equipment {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    unit: string;
}

export interface Booking {
    id: string;
    courtName: string;
    courtType: string;
    date: string;
    timeRange: string;
    totalPrice: number;
    status: 'SELESAI' | 'MENUNGGU BAYAR' | 'DIBATALKAN';
    image: string;
    coachName?: string;
    equipments?: { name: string; quantity: number; price: number }[];
    courtPrice: number;
    coachPrice: number;
    equipmentPrice: number;
    serviceFee: number;
}

interface BookingState {
    courtId: string | null;
    selectedDate: string;
    selectedSlots: string[];
    selectedCoach: Coach | null;
    selectedEquipments: Equipment[];
    bookingHistory: Booking[];

    // Actions
    setCourtId: (id: string | null) => void;
    setSelectedDate: (date: string) => void;
    setSelectedSlots: (slots: string[]) => void;
    setSelectedCoach: (coach: Coach | null) => void;
    setSelectedEquipments: (equipments: Equipment[]) => void;
    addBookingToHistory: (booking: Booking) => void;
    cancelBooking: (id: string) => void;
    resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
    persist(
        (set) => ({
            courtId: null,
            selectedDate: new Date().toISOString().split('T')[0],
            selectedSlots: [],
            selectedCoach: null,
            selectedEquipments: [],
            bookingHistory: [],

            setCourtId: (id) => set({ courtId: id }),
            setSelectedDate: (date) => set({ selectedDate: date }),
            setSelectedSlots: (slots) => set({ selectedSlots: slots }),
            setSelectedCoach: (coach) => set({ selectedCoach: coach }),
            setSelectedEquipments: (equipments) => set({ selectedEquipments: equipments }),
            addBookingToHistory: (booking) => set((state) => ({
                bookingHistory: [booking, ...state.bookingHistory]
            })),
            cancelBooking: (id) => set((state) => ({
                bookingHistory: state.bookingHistory.map(b =>
                    b.id === id ? { ...b, status: 'DIBATALKAN' } : b
                )
            })),
            resetBooking: () => set({
                courtId: null,
                selectedDate: new Date().toISOString().split('T')[0],
                selectedSlots: [],
                selectedCoach: null,
                selectedEquipments: []
            }),
        }),
        {
            name: 'smashclub-booking-storage',
        }
    )
);

