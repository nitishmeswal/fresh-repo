import rtx3090 from "@/public/RTX 3090 vector model_1.png";
import { StaticImageData } from "next/image";


export const FeatureOptions = [
    {
      label: "Dashboard",
      icon: "/dashboard.svg",
      href: "/",
    },
    {
      label: "GPU Marketplace",
      icon: "/gpu-marketplace.svg",
      href: "/gpu-marketplace",
    },
    {
      label: "AI Models",
      icon: "/ai-models.svg",
      href: "/ai-models",
    },
    {
      label: "Earnings",
      icon: "/earnings.svg",
      href: "/earnings",
    },
    {
      label: "Connect to Earn",
      icon: "/connect-to-earn.svg",
      href: "/connect-to-earn",
    },
  ];

export const SettingsOptions = [
    {
      label: "Community",
      icon: "/community.svg",
      href: "/community",
    },
    {
      label: "Settings",
      icon: "/settings.svg",
      href: "/settings",
    },
    {
      label: "More info",
      icon: "/info.svg",
      href: "/more-info",
    },
  ];

export const filters = [
  {
    name: "Availability",
    options: ["In Stock", "Out of Stock"],
  },
  {
    name: "GPU",
    options: ["NVIDIA", "AMD", "Intel"],
  },
  {
    name: "Location",
    options: ["USA", "Europe", "Asia"],
  },
  {
    name: "Demand",
    options: ["High", "Medium", "Low"],
  },
  {
    name: "GPU Resources",
    options: ["100", "500", "1000", "2000"],
  }
]

export const AIModelData = [
  {
    name: "Generation",
    options: ["GPT-3", "GPT-4", "GPT-5"],
  },
  {
    name: "Category",
    options: ["Text", "Image", "Audio"],
  }
]

export const mainServices: {name:string, description:string}[] = [
  {
    name: "Rent GPU",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat quam, bibendum nec gravida at"
  },
  {
    name: "Deploy Model",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat quam, bibendum nec gravida at",
  },
  {
    name: "Start Earning",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat quam, bibendum nec gravida at"
  }
]

type GPUDataType = {
  gpuModel: string;
  host: string;
  location: string;
  imgSrc: string | StaticImageData;
  computeMode: number;
  cores: number;
  gpuMemory: string;
  maxCudaVersion: string;
  cpuModel: string;
  totalMemory: string;
  storageSpeed: string;
  storageSize: string;
  motherboard: string;
  smClock: string;
  rentPrice: string;
};

export const GPUData: GPUDataType[] = [
  {
    gpuModel: "1x NVIDIA GeForce RTX 3090",
    host: "Cc23fb45-1276-497a-8349-259659fa6b80",
    location: "Kanayannur Kerala IN (Asia/Kolkata)",
    imgSrc: rtx3090,
    computeMode: 0,
    cores: 10496,
    gpuMemory: "0 GB",
    maxCudaVersion: "535.183.01",
    cpuModel: "AMD Ryzen 9 7900X",
    totalMemory: "61.95 GB",
    storageSpeed: "2252.6 MB/s",
    storageSize: "344 GB",
    motherboard: "ASUSTek Computer INC.",
    smClock: "210 MHz",
    rentPrice: "1001 $NLOV/Hr",
  },
  {
    gpuModel: "1x NVIDIA GeForce RTX 3090",
    host: "Cc23fb45-1276-497a-8349-259659fa6b80",
    location: "Kanayannur Kerala IN (Asia/Kolkata)",
    imgSrc: rtx3090,
    computeMode: 0,
    cores: 10496,
    gpuMemory: "0 GB",
    maxCudaVersion: "535.183.01",
    cpuModel: "AMD Ryzen 9 7900X",
    totalMemory: "61.95 GB",
    storageSpeed: "2252.6 MB/s",
    storageSize: "344 GB",
    motherboard: "ASUSTek Computer INC.",
    smClock: "210 MHz",
    rentPrice: "1001 $VLOV/Hr",
  },
];

