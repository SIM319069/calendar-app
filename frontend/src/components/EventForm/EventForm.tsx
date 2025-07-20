import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { IEvent } from '../../types';
import './EventForm.css';

interface EventFormProps {
  event?: IEvent | null;
  selectedDate?: Date;
  onSubmit: (event: Omit<IEvent, 'id'>) => void;
  onCancel: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  selectedDate,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<IEvent, 'id'>>({
    title: '',
    description: '',
    date: selectedDate || new Date(),
    startTime: '09:00',
    endTime: '10:00',
    priority: 'medium',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        priority: event.priority,
      });
    } else if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
    }
  }, [event, selectedDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const dateValue = typeof formData.date === 'string' 
    ? formData.date 
    : format(formData.date, 'yyyy-MM-dd');

  return (
    <div className="event-form-overlay">
      <div className="event-form-container">
        <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter event description (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={dateValue}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time *</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time *</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};