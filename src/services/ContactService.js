import Contact from '../models/Contact.js';

class ContactService {
  async createContact(contactData) {
    const contact = new Contact(contactData);
    return await contact.save();
  }

  async getAllActiveContacts() {
    return await Contact.find({ isActive: true });
  }

  async getContactById(id) {
    const contact = await Contact.findOne({ _id: id, isActive: true });
    if (!contact) {
      throw new Error('Contato não encontrado ou está inativo');
    }
    return contact;
  }

  async deactivateContact(id) {
    const contact = await Contact.findByIdAndUpdate(
      id, 
      { isActive: false }, 
      { new: true }
    );
    if (!contact) {
      throw new Error('Contato não encontrado');
    }
    return contact;
  }

  async deleteContact(id) {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      throw new Error('Contato não encontrado');
    }
    return contact;
  }
}

export default new ContactService();
