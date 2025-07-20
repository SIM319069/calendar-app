import axios from 'axios';
import { IEvent, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventApi = {
  getAll: async (): Promise<IEvent[]> => {
    const response = await api.get<ApiResponse<IEvent[]>>('/events');
    return response.data.data || [];
  },

  getById: async (id: number): Promise<IEvent | null> => {
    const response = await api.get<ApiResponse<IEvent>>(`/events/${id}`);
    return response.data.data || null;
  },

  create: async (event: Omit<IEvent, 'id'>): Promise<IEvent> => {
    const response = await api.post<ApiResponse<IEvent>>('/events', event);
    return response.data.data!;
  },

  update: async (id: number, event: Partial<IEvent>): Promise<IEvent> => {
    const response = await api.put<ApiResponse<IEvent>>(`/events/${id}`, event);
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`);
  },

  getByPriority: async (priority: string): Promise<IEvent[]> => {
    const response = await api.get<ApiResponse<IEvent[]>>(`/events/priority/${priority}`);
    return response.data.data || [];
  },
};