import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Event } from '../models/Event';
import { IEvent, ApiResponse } from '../types';

const eventRepository = () => AppDataSource.getRepository(Event);

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventData: IEvent = req.body;
    const event = eventRepository().create(eventData);
    const savedEvent = await eventRepository().save(event);
    
    const response: ApiResponse<Event> = {
      success: true,
      data: savedEvent
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create event'
    };
    res.status(500).json(response);
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    // For now, we'll fetch all events and let the frontend handle filtering
    // This can be optimized later with query parameters
    const events = await eventRepository().find({
      order: {
        date: 'ASC',
        startTime: 'ASC'
      }
    });
    
    const response: ApiResponse<Event[]> = {
      success: true,
      data: events
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch events'
    };
    res.status(500).json(response);
  }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await eventRepository().findOne({
      where: { id: parseInt(id) }
    });
    
    if (!event) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Event not found'
      };
      res.status(404).json(response);
      return;
    }
    
    const response: ApiResponse<Event> = {
      success: true,
      data: event
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch event'
    };
    res.status(500).json(response);
  }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const eventData: Partial<IEvent> = req.body;
    
    const event = await eventRepository().findOne({
      where: { id: parseInt(id) }
    });
    
    if (!event) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Event not found'
      };
      res.status(404).json(response);
      return;
    }
    
    eventRepository().merge(event, eventData);
    const updatedEvent = await eventRepository().save(event);
    
    const response: ApiResponse<Event> = {
      success: true,
      data: updatedEvent
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update event'
    };
    res.status(500).json(response);
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await eventRepository().delete(parseInt(id));
    
    if (result.affected === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Event not found'
      };
      res.status(404).json(response);
      return;
    }
    
    const response: ApiResponse<null> = {
      success: true
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete event'
    };
    res.status(500).json(response);
  }
};

export const getEventsByPriority = async (req: Request, res: Response): Promise<void> => {
  try {
    const { priority } = req.params;
    const events = await eventRepository().find({
      where: { priority: priority as 'low' | 'medium' | 'high' },
      order: {
        date: 'ASC',
        startTime: 'ASC'
      }
    });
    
    const response: ApiResponse<Event[]> = {
      success: true,
      data: events
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch events by priority'
    };
    res.status(500).json(response);
  }
};