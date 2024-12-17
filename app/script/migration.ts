import mongoose from 'mongoose';
import User from '../model/User';
import dbConnect from '../lib/db';

// @ts-ignore
export async function migrateUsers() {
  try {
    await dbConnect();

    console.log('Connected to MongoDB');

    // Step 1: Delete all existing users
    await User.deleteMany({});
    console.log('Deleted all users');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateUsers();
