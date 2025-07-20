export interface IEvent {
  id?: number;
  title: string;
  description?: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  priority: 'low' | 'medium' | 'high';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}