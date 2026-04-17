import express from 'express';
import ContactController from '../controllers/ContactController.js';

const router = express.Router();

router.post('/', ContactController.create);
router.get('/', ContactController.list);
router.get('/:id', ContactController.getById);
router.patch('/:id/deactivate', ContactController.deactivate);
router.delete('/:id', ContactController.delete);

export default router;
