import { apiClient } from "../api/clients";

export interface OrderPayload {
    productId?: number;
    quantity?: number;
    items?: { productId: number; quantity: number }[];
    whatsappNumber: string;
    callNumber: string;
    location?: string;
    message?: string;
}

export const placeOrder = async (payload: OrderPayload) => {
    try {
        const response = await apiClient.post('/orders', payload);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Place order error:", error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to place order'
        };
    }
};

export const fetchMyOrders = async () => {
    try {
        const response = await apiClient.get('/orders');
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Fetch orders error:", error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch orders',
            status: error.response?.status
        };
    }
};

export const cancelOrder = async (orderId: number) => {
    try {
        const response = await apiClient.delete(`/orders/${orderId}/cancel`);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Cancel order error:", error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to cancel order'
        };
    }
};

export const updateOrderStatus = async (orderId: number, status: string) => {
    try {
        const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Update order status error:", error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update order status'
        };
    }
};

export const deleteOrder = async (orderId: number) => {
    try {
        const response = await apiClient.delete(`/orders/${orderId}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Delete order error:", error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete order'
        };
    }
};
