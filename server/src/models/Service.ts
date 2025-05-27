import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  provider: mongoose.Types.ObjectId;
  category: string;
  price: number;
  availability: boolean;
  location: string;
  createdAt: Date;
}

const serviceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['plumbing', 'haircut', 'bike_repair', 'tutoring', 'cleaning', 'other'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IService>('Service', serviceSchema); 