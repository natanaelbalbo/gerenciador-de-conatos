import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/teste-tecnico');
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.warn('Falha ao conectar no MongoDB local. Iniciando banco em memória para o teste...');
    try {
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log('MongoDB em Memória iniciado com sucesso!');
    } catch (memError) {
      console.error(`Erro crítico no banco: ${memError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
