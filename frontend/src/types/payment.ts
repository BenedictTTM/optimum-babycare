export interface Authorization {
    authorization_url: string;
    access_code: string;
    reference: string;
}

export interface OrderPaymentResponse {
    status: boolean;
    message: string;
    authorization?: Authorization;
    reference?: string;
}

export interface PaymentVerification {
    success: boolean;
    status: string;
    message: string;
    amount: number;
    reference: string;
    currency?: string;
    paid_at?: string;
    data?: any;
}

export interface PaymentInitialization {
    id: number;
    amount: number;
    currency: string;
    status: string;
    reference: string;
    createdAt: string;
    description?: string;
    metadata?: any;
}
