export interface IEvent {
  id?: number;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  priority: 'low' | 'medium' | 'high';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}