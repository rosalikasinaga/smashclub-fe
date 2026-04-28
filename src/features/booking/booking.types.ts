export interface Court {
    id: number;
    courtCode: string;
    courtName: string;
    courtImgLink: string | null;
    openTime: string;
    closeTime: string;
    pricePerHour: number;
    status: number;
}

export interface AvailableSlot {
    startTime: string;
    endTime: string;
    available: boolean;
    price: number;
    status: string;
}

export interface CourtAvailability extends Court {
    availableSlots: AvailableSlot[];
}

export interface BookingResponse<T> {
    data: T;
    success: boolean;
    message: string;
    status: number;
    timestamp: string;
}

export interface BookingDetail {
    id: number;
    bookingCode: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    durationHour: number;
    basePrice: number;
    totalPrice: number;
    status: number;
    statusDescription: string;
    createdAt: string;
    respCreateTransactionDTO?: {
        paymentData: {
            invoiceUrl: string;
        };
        transactionCode: string;
        referenceCode: string;
    };
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
    user: {
        userId: string;
        fullName: string;
        email: string;
    };
}