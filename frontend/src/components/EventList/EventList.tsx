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

  return (
    <div className="event-list-container">
      <h2>All Events</h2>
      {events.length === 0 ? (
        <p className="no-events">No events scheduled yet.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
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
                <div className="event-date">{formatDate(event.date)}</div>
                <div className="event-time">
                  {event.startTime} - {event.endTime}
                </div>
              </div>
              <div className="event-actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(event)}
                  title="Edit event"
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(event.id!)}
                  title="Delete event"
                >
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