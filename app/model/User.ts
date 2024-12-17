import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide a email'],
    unique: true,
  },
  isVeerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [false],
  },
  provider: {
    type: String,
  },
  providerId: {
    type: String,
  },
  image: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  location: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male','femal','other']
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    required: [true, 'Please provide a status'],
    default: 'active',
  },
});

export interface UserType  {
  id: string;
  name:string
  email: string;
  isVeerified: boolean;
  image?: string;
  // role: 'user' | 'admin' | 'superadmin';
  // subscriptions: Subscription[];
  birthday?: Date;
  location?: string;
  gender?: string;
  password: string;
  provider?: string;
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'suspended' | 'deleted';
}

export default mongoose.models.User || mongoose.model('User', UserSchema);