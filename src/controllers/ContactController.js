import ContactService from '../services/ContactService.js';

class ContactController {
  async create(req, res) {
    try {
      const contact = await ContactService.createContact(req.body);
      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async list(req, res) {
    try {
      const contacts = await ContactService.getAllActiveContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const contact = await ContactService.getContactById(req.params.id);
      res.json(contact);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deactivate(req, res) {
    try {
      const contact = await ContactService.deactivateContact(req.params.id);
      res.json({ message: 'Contato desativado com sucesso', contact });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await ContactService.deleteContact(req.params.id);
      res.json({ message: 'Contato excluído com sucesso' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

export default new ContactController();
