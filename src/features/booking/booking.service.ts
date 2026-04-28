import { api } from '../../lib/axios';
import type { CourtAvailability, BookingResponse, Court, BookingDetail } from './booking.types';

export interface CreateBookingParams {
    courtId: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    coaches?: {
        coachId: number;
        durationHours: number;
    }[];
    equipment?: {
        equipmentId: number;
        quantity: number;
    }[];
}

export interface BookingSummaryResponse {
    court: Court;
    coaches: {
        id: number | null;
        coachCode: string;
        coachName: string;
        coachImgLink: string | null;
        pricePerHour: number;
        coachHour: number;
        bookingDate: string;
        startTime: string;
        endTime: string;
        coachPrice: number;
    }[];
    equipment: {
        id: number | null;
        equipmentName: string;
        brand: string;
        type: string;
        categoryName: string;
        pricePerUnit: number;
        quantity: number;
        startTime: string;
        endTime: string;
        equipmentPrice: number;
    }[];
    courtTotalPrice: number;
    coachesTotalPrice: number;
    equipmentTotalPrice: number;
    grandTotal: number;
    bookingCode: string | null;
    estimatedDuration: string;
}



export const bookingService = {
    getAllCourts: async (): Promise<BookingResponse<Court[]>> => {
        const response = await api.get('/booking/courts');
        return response.data;
    },

    checkAllCourtsAvailability: async (date: string): Promise<BookingResponse<CourtAvailability[]>> => {
        const response = await api.post('/booking/availability/courts', { date });
        return response.data;
    },

    checkCourtAvailability: async (date: string, courtId: number): Promise<BookingResponse<CourtAvailability[]>> => {
        const response = await api.post('/booking/availability/courts', { date, courtId });
        return response.data;
    },

    getAvailableCoaches: async (date: string, startTime: string, endTime: string): Promise<BookingResponse<any[]>> => {
        const response = await api.get('/booking/availability/coaches', {
            params: { date, startTime, endTime }
        });
        return response.data;
    },

    async getAvailableEquipment(date: string, startTime: string, endTime: string): Promise<BookingResponse<any[]>> {
        const response = await api.get('/booking/availability/equipment', {
            params: { date, startTime, endTime }
        });
        return response.data;
    },

    getPreBookingSummary: async (params: CreateBookingParams): Promise<BookingResponse<BookingSummaryResponse>> => {
        const response = await api.post('/booking/summary', params);
        return response.data;
    },

    getBookingSummary: async (bookingCode: string): Promise<BookingResponse<BookingSummaryResponse>> => {
        const response = await api.post(`/booking/summary/${bookingCode}`);
        return response.data;
    },

    createBooking: async (params: CreateBookingParams): Promise<BookingResponse<any>> => {
        const response = await api.post('/booking', params);
        return response.data;
    },

    getMyBookings: async (page: number = 0, size: number = 10): Promise<BookingResponse<{
        content: BookingDetail[];
        totalPages: number;
        totalElements: number;
        number: number;
        size: number;
    }>> => {
        const response = await api.get('/booking/my-bookings', {
            params: { page, size }
        });
        return response.data;
    },

    async getBookingDetails(bookingCode: string): Promise<BookingResponse<BookingDetail>> {
        const response = await api.get(`/booking/${bookingCode}`);
        return response.data;
    },

    async updateBookingStatus(bookingCode: string, status: number, cancellationReason?: string): Promise<BookingResponse<any>> {
        const response = await api.put(`/booking/${bookingCode}/status`, { status, cancellationReason });
        return response.data;
    },

    async startBooking(bookingCode: string): Promise<BookingResponse<any>> {
        const response = await api.put(`/booking/${bookingCode}/start`);
        return response.data;
    },

    async completeBooking(bookingCode: string): Promise<BookingResponse<any>> {
        const response = await api.put(`/booking/${bookingCode}/complete`);
        return response.data;
    }
};
