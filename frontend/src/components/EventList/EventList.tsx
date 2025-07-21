import React from 'react';
import { format, parseISO } from 'date-fns';
import { IEvent } from '../../types';
import './EventList.css';

interface EventListProps {
  events: IEvent[];
  onEdit: (event: IEvent) => void;
  onDelete: (id: number) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onEdit, onDelete }) => {
  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM d, yyyy');
  };

  // Sort events by date and time
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = typeof a.date === 'string' ? parseISO(a.date) : a.date;
    const dateB = typeof b.date === 'string' ? parseISO(b.date) : b.date;
    const dateCompare = dateA.getTime() - dateB.getTime();
    
    if (dateCompare === 0) {
      return a.startTime.localeCompare(b.startTime);
    }
    
    return dateCompare;
  });

  return (
    <div className="event-list-container">
      <h2>Event List</h2>
      {events.length === 0 ? (
        <div className="no-events-container">
          <svg className="no-events-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="no-events">No events found matching your filters.</p>
          <p className="no-events-hint">Try adjusting your filters or create a new event.</p>
        </div>
      ) : (
        <div className="events-grid">
          {sortedEvents.map((event) => (
            <div key={event.id} className={`event-card priority-${event.priority}`}>
              <div className="event-header">
                <h3>{event.title}</h3>
                <span className={`priority-badge priority-${event.priority}`}>
                  {getPriorityLabel(event.priority)}
                </span>
              </div>
              {event.description && (
                <p className="event-description">{event.description}</p>
              )}
              <div className="event-details">
                <div className="event-date">
                  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                  {formatDate(event.date)}
                </div>
                <div className="event-time">
                  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  {event.startTime} - {event.endTime}
                </div>
              </div>
              <div className="event-actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(event)}
                  title="Edit event"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(event.id!)}
                  title="Delete event"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};