import { apiClient } from '@/api/clients';

export interface NewsletterCampaign {
  id: number;
  title: string;
  subject: string;
  content: any;
  status: string;
  scheduledAt?: string;
  createdAt: string;
}

export const newsletterService = {
  fetchCampaigns: async (): Promise<NewsletterCampaign[]> => {
    try {
      const response = await apiClient.get('/newsletter');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch campaigns');
    }
  },

  createCampaign: async (data: { title: string; subject: string; content: any }): Promise<NewsletterCampaign> => {
    try {
      const response = await apiClient.post('/newsletter/create', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create campaign');
    }
  },

  updateCampaign: async (id: number, data: { title?: string; subject?: string; content?: any }): Promise<NewsletterCampaign> => {
    try {
      const response = await apiClient.put(`/newsletter/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update campaign');
    }
  },

  sendCampaign: async (id: number): Promise<any> => {
    try {
      const response = await apiClient.post(`/newsletter/${id}/send`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send campaign');
    }
  },
  
  getPreviewUrl: (id: number) => {
    // Assuming backend is at process.env.NEXT_PUBLIC_BASE_URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return `${baseUrl}/newsletter/${id}/preview`; // NOTE limits on CORS depend on API config
  }
};
