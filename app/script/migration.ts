import mongoose from 'mongoose';
import User from '../model/User';
import dbConnect from '../lib/db';
import { Db } from 'mongodb';

// @ts-ignore
export async function migrateUsers() {
  try {
    await dbConnect();

    console.log('Connected to MongoDB');

    // Step 1: Delete all existing users
    await User.deleteMany({});
    console.log('Deleted all users');
    // // Step 2: Create new users
    // await User.create({
    //     name: 'Alice',
    //     email: 'johndoe@hotmail.com',
    //     password:   "dsfdlfkwnslk@knsdknfsnflk]dfs"
    // }).then(() => console.log('User created successfully'));
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateUsers();
