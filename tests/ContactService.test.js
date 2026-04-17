import Contact from '../src/models/Contact.js';
import ContactService from '../src/services/ContactService.js';
import mongoose from 'mongoose';
import { subYears } from 'date-fns';

import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

describe('ContactService', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Contact.deleteMany({});
  });

  it('deve criar um contato válido', async () => {
    const contactData = {
      name: 'João Silva',
      birthDate: subYears(new Date(), 20),
      gender: 'Masculino'
    };
    
    const contact = await ContactService.createContact(contactData);
    expect(contact.name).toBe('João Silva');
    expect(contact.age).toBe(20);
    expect(contact.isActive).toBe(true);
  });

  it('não deve criar um contato menor de 18 anos', async () => {
    const contactData = {
      name: 'Jovem Teste',
      birthDate: subYears(new Date(), 17),
      gender: 'Masculino'
    };
    
    await expect(ContactService.createContact(contactData))
      .rejects.toThrow('O contato deverá ser maior de idade (18 anos)');
  });

  it('não deve criar um contato com data de nascimento futura', async () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    
    const contactData = {
      name: 'Contato Futuro',
      birthDate: amanha,
      gender: 'Masculino'
    };
    
    await expect(ContactService.createContact(contactData))
      .rejects.toThrow('A data de nascimento não pode ser maior que a data de hoje');
  });

  it('deve listar apenas contatos ativos', async () => {
    await Contact.create({
      name: 'Ativo Um',
      birthDate: subYears(new Date(), 25),
      gender: 'Masculino',
      isActive: true
    });

    await Contact.create({
      name: 'Inativo Um',
      birthDate: subYears(new Date(), 30),
      gender: 'Feminino',
      isActive: false
    });

    const activeContacts = await ContactService.getAllActiveContacts();
    expect(activeContacts.length).toBe(1);
    expect(activeContacts[0].name).toBe('Ativo Um');
  });
});
