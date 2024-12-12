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

    // Step 2: Optionally seed new data
    const newUsers = [
      {
        id: '1',
        name: 'Google Test User',
        email: 'test@example.com',
        password: 'hashed_password',
        image: 'https://example.com/image.png',
        provider: 'google',
        providerId: 'google_user_id',
        status: 'active',
      },
    ];

    await User.insertMany(newUsers);
    console.log('Inserted new users');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateUsers();
