import mongoose from 'mongoose';
import { differenceInYears, isAfter, startOfDay } from 'date-fns';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  birthDate: {
    type: Date,
    required: [true, 'Data de nascimento é obrigatória'],
    validate: {
      validator: function(value) {
        return !isAfter(startOfDay(value), startOfDay(new Date()));
      },
      message: 'A data de nascimento não pode ser maior que a data de hoje'
    }
  },
  gender: {
    type: String,
    enum: {
      values: ['Masculino', 'Feminino', 'Outro'],
      message: '{VALUE} não é um sexo válido'
    },
    required: [true, 'Sexo é obrigatório']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

contactSchema.virtual('age').get(function() {
  if (!this.birthDate) return null;
  return differenceInYears(new Date(), this.birthDate);
});

contactSchema.pre('save', function() {
  const age = differenceInYears(new Date(), this.birthDate);
  
  if (age < 0) {
    throw new Error('A idade não pode ser menor que 0');
  }
  
  if (age < 18) {
    throw new Error('O contato deverá ser maior de idade (18 anos)');
  }
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
