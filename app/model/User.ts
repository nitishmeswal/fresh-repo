import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  firstName: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide a email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
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
  firstName: string;
  lastName: string;
  email: string;
  // image?: string;
  // role: 'user' | 'admin' | 'superadmin';
  // subscriptions: Subscription[];
  password: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'suspended' | 'deleted';
}

export default mongoose.models.User || mongoose.model('User', UserSchema);