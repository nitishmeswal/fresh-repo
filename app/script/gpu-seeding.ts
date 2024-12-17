import mongoose from "mongoose";
import { GpuModel } from "../model/cpu-model";
import dbConnect from "../lib/db";

// Helper function to generate random values
function getRandomElement(array:any) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: any, max: any, decimalPlaces = 0) {
  const rand = Math.random() * (max - min) + min;
  return parseFloat(rand.toFixed(decimalPlaces));
}

// High-end GPU models
const gpuModels = [
  "NVIDIA GeForce RTX 3090",
  "NVIDIA GeForce RTX 4080",
  "NVIDIA GeForce RTX 4090",
  "AMD Radeon RX 7900 XTX",
  "AMD Radeon RX 7800 XT",
  "NVIDIA Quadro RTX 6000",
  "NVIDIA Tesla A100",
  "AMD Radeon Pro W6800",
  "Intel Arc A770",
  "NVIDIA TITAN RTX",
];

// High-end CPU models
const cpuModels = [
  "AMD Ryzen 9 7900X",
  "Intel Core i9-13900K",
  "AMD Ryzen Threadripper PRO 5995WX",
  "Intel Xeon W-2295",
  "AMD EPYC 7763",
  "Intel Core i7-13700K",
  "Intel Core i5-12600K",
  "AMD Ryzen 7 5800X",
  "Intel Xeon Platinum 8376H",
  "AMD Ryzen 5 7600X",
];

// Locations
const locations = [
  "Kanayannur Kerala IN (Asia/Kolkata)",
  "Bengaluru Karnataka IN (Asia/Kolkata)",
  "San Francisco CA US (America/Los_Angeles)",
  "New York NY US (America/New_York)",
  "London UK (Europe/London)",
  "Berlin DE (Europe/Berlin)",
  "Tokyo JP (Asia/Tokyo)",
  "Seoul KR (Asia/Seoul)",
  "Sydney AU (Australia/Sydney)",
  "Dubai UAE (Asia/Dubai)",
];

// Generate 50 GPU data entries
const gpuData = Array.from({ length: 50 }, (_, index) => {
  const gpuModel = getRandomElement(gpuModels);
  const gpuMemory = `${getRandomNumber(8, 24, 0)} GB`;
  const cores = getRandomNumber(2000, 11000, 0);
  const totalMemory = `${getRandomNumber(32, 128, 2)} GB`;
  const storageSpeed = `${getRandomNumber(1000, 7000, 1)} MB/s`;
  const storageSize = `${getRandomNumber(256, 2048, 0)} GB`;
  const smClock = `${getRandomNumber(200, 2500, 0)} MHz`;
  const rentPrice = `${getRandomNumber(500, 3000, 2)} $VLOV/Hr`;

  return {
    gpuModel: `1x ${gpuModel}`,
    host: `Host-${index + 1}-${Math.random().toString(36).substring(2, 10)}`,
    location: getRandomElement(locations),
    imgSrc: `gpu-image-${index + 1}.png`, // Replace with actual image paths or URLs
    computeMode: Math.floor(Math.random() * 2),
    cores,
    gpuMemory,
    maxCudaVersion: `${getRandomNumber(500, 600, 3)}`,
    cpuModel: getRandomElement(cpuModels),
    totalMemory,
    storageSpeed,
    storageSize,
    motherboard: `Motherboard Model ${index + 1}`,
    smClock,
    rentPrice,
  };
});

// Seed function
async function seedDatabase() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");
    await GpuModel.deleteMany({});
    console.log("Cleared the GPU data collection");
    const result = await GpuModel.insertMany(gpuData);
    console.log(`${result.length} GPU data entries have been seeded successfully`);
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seed function
seedDatabase();
