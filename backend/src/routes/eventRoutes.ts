import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByPriority
} from '../controllers/eventController';

const router = Router();

router.post('/events', createEvent);
router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/events/priority/:priority', getEventsByPriority);

export default router;