"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsByPriority = exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getEvents = exports.createEvent = void 0;
const database_1 = require("../config/database");
const Event_1 = require("../models/Event");
const eventRepository = () => database_1.AppDataSource.getRepository(Event_1.Event);
const createEvent = async (req, res) => {
    try {
        const eventData = req.body;
        const event = eventRepository().create(eventData);
        const savedEvent = await eventRepository().save(event);
        const response = {
            success: true,
            data: savedEvent
        };
        res.status(201).json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to create event'
        };
        res.status(500).json(response);
    }
};
exports.createEvent = createEvent;
const getEvents = async (req, res) => {
    try {
        const events = await eventRepository().find({
            order: {
                date: 'ASC',
                startTime: 'ASC'
            }
        });
        const response = {
            success: true,
            data: events
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch events'
        };
        res.status(500).json(response);
    }
};
exports.getEvents = getEvents;
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await eventRepository().findOne({
            where: { id: parseInt(id) }
        });
        if (!event) {
            const response = {
                success: false,
                error: 'Event not found'
            };
            res.status(404).json(response);
            return;
        }
        const response = {
            success: true,
            data: event
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch event'
        };
        res.status(500).json(response);
    }
};
exports.getEventById = getEventById;
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const eventData = req.body;
        const event = await eventRepository().findOne({
            where: { id: parseInt(id) }
        });
        if (!event) {
            const response = {
                success: false,
                error: 'Event not found'
            };
            res.status(404).json(response);
            return;
        }
        eventRepository().merge(event, eventData);
        const updatedEvent = await eventRepository().save(event);
        const response = {
            success: true,
            data: updatedEvent
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to update event'
        };
        res.status(500).json(response);
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await eventRepository().delete(parseInt(id));
        if (result.affected === 0) {
            const response = {
                success: false,
                error: 'Event not found'
            };
            res.status(404).json(response);
            return;
        }
        const response = {
            success: true
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to delete event'
        };
        res.status(500).json(response);
    }
};
exports.deleteEvent = deleteEvent;
const getEventsByPriority = async (req, res) => {
    try {
        const { priority } = req.params;
        const events = await eventRepository().find({
            where: { priority: priority },
            order: {
                date: 'ASC',
                startTime: 'ASC'
            }
        });
        const response = {
            success: true,
            data: events
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch events by priority'
        };
        res.status(500).json(response);
    }
};
exports.getEventsByPriority = getEventsByPriority;
