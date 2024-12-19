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
    {
      label: "Wallet",
      icon: "/wallet.svg",
      href: "/wallet",
    }
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
    description:
            `Access high-performance GPU computing on demand. Choose from our network 
             of 200+ verified GPU nodes. Pay only for what you use, starting at $0.30 
             per GPU hour - up to 80% cheaper than traditional cloud providers.`
            },
  {
    name: "Deploy Model",
    description: 
            `Deploy and scale AI models with just a few clicks. Choose from our pre-built
             models or deploy your custom models. Zero setup time, 
             instant deployment, and seamless integration with popular ML frameworks.`
    },
  {
    name: "Start Earning",
    description: 
            `Turn your idle GPU power into passive income through our browser-based mining 
             platform. No downloads required - just connect through your browser. Join our 
             network of providers earning rewards while supporting the AI revolution.`
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

export const chartData = [
  { activity: "Done", value: 28, color: "#818181" },
  { activity: "Overdue Work", value: 22, color: "#0055ff" },
  { activity: "Processing", value: 30, color: "#00ffbf" },
  { activity: "Work Finished Late", value: 20, color: "#356cf9" },
];

export const trafficData = [
  {
    activity: "Social Media", value: 22, color:"#F97316"
  },
  {
    activity: "Organic Search", value: 78, color:"#ffffff"
  }
]


import post1 from '@/public/pages/post-1.png';
import post2 from '@/public/pages/post-2.png';
import post3 from '@/public/pages/post-3.png';
import post4 from '@/public/pages/post-4.png';
import post5 from '@/public/pages/post-5.png';
import user1 from '@/public/pages/user1.png';
import user2 from '@/public/pages/user2.png';
import user3 from '@/public/pages/user3.png';
import behance from '@/public/pages/behance.png';
import dribbble from '@/public/pages/dribble.png';
import uihut from '@/public/pages/uihut.png';
import bronze from '@/public/pages/bronze.svg';
import silver from '@/public/pages/silver.svg';
import gold from '@/public/pages/gold.svg';
import profile from '@/public/pages/big-profile.png';
import { nan } from "zod";
import { Label } from "@radix-ui/react-dropdown-menu";

export const accountSummary = {
    name: 'Samantha Jeffery',
    rating: 4.3,
    image: profile,
    badges: [
      {
        type: 'gold',
        image: gold,
        active: true
      },
      {
        type: 'silver',
        image: silver,
        active: false
      },
      {
        type: 'bronze',
        image: bronze,
        active: false
      }
    ]
  };

export  const posts = [
    {
      id: 1,
      title: 'Blockchain developer best practices on innovation chain',
      author: {
        name: 'Peret Grey',
        avatar: user1,
        role: '1 week ago'
      },
      stats: {
        views: '89,324',
        likes: '26,565',
        comments: '56'
      },
      tags: ['#BTC', 'Block', 'Web3'],
      graph: post1
    },
    {
      id: 2,
      title: 'The 4-step SEO framework that led to a 1000% increase in traffic. Let\'s talk about blogging and SEO...',
      author: {
        name: 'Ali Juby',
        avatar: user2,
        role: '3 days ago'
      },
      stats: {
        views: '342,954',
        likes: '10,571',
        comments: '184'
      },
      tags: ['SEO', 'Blogging', 'Traffic'],
      graph: post2
    },
    {
      id: 3,
      title: 'OnePay - Online Payment Processing Web App - Download from ui8.net',
      author: {
        name: 'Mamunul Haque',
        avatar: user3,
        role: '1 week ago'
      },
      stats: {
        views: '670,606',
        likes: '29,751',
        comments: '209'
      },
      tags: ['payment', 'webapp', 'ui'],
      graph: post3
    },
    {
      id: 4,
      title: 'OnePay - Online Payment Processing Web App - Download from ui8.net',
      author: {
        name: 'Mamunul Haque',
        avatar: user1,
        role: '1 week ago'
      },
      stats: {
        views: '670,606',
        likes: '29,751',
        comments: '209'
      },
      tags: ['payment', 'webapp', 'ui'],
      graph: post4
    },
    {
      id: 5,
      title: 'OnePay - Online Payment Processing Web App - Download from ui8.net',
      author: {
        name: 'Mamunul Haque',
        avatar: user1,
        role: '1 week ago'
      },
      stats: {
        views: '670,606',
        likes: '29,751',
        comments: '209'
      },
      tags: ['payment', 'webapp', 'ui'],
      graph: post5
    },
    {
      id: 6,
      title: 'OnePay - Online Payment Processing Web App - Download from ui8.net',
      author: {
        name: 'Mamunul Haque',
        avatar: user3,
        role: '1 week ago'
      },
      stats: {
        views: '670,606',
        likes: '29,751',
        comments: '209'
      },
      tags: ['payment', 'webapp', 'ui'],
      graph: post5
    }
  ];

  export const meetups = [
    {
      id: 1,
      date: { month: 'FEB', day: '7' },
      title: 'UIHUT - Crunchbase Company Profile...',
      tags: ['Remote', 'Full Time', 'Available'],
      company: {
        name: 'UIHUT',
        state: 'Sylhet',
        country: 'Bangladesh',
        logo: uihut
      }
    },
    {
      id: 2,
      date: { month: 'FEB', day: '3' },
      title: 'Design Meetups USA | Dribbble',
      tags: ['Remote', 'Full Time'],
      company: {
        name: 'Dribbble',
        state: 'Austin',
        country: 'USA',
        logo: dribbble
      }
    },
    {
      id: 3,
      date: { month: 'FEB', day: '5' },
      title: 'Meetup Brand Identity Design - Behi...',
      tags: ['Full Time', 'Contract', 'Available'],
      company: {
        name: 'Behance',
        state: 'san jose, CA',
        country: 'USA',
        logo: behance
      }
    }
  ];


  export const dashboardDta = [
    {
      name: 'Total Nodes',
      value: 12,
    },
    {
      name: "Total GPUs",
      value: 415,
    },
    {
      name: "Total Rental Duration",
      value: 27000,
    },
    {
      nanme: "Average Rental Cost",
      value: 12.99,
    }
  ]
  

export const footer = [
  {
    name: "GitHub",
    href: "htpps://github.com",
    icon: "/github.svg",
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: "/twitter.svg",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: "/linkedin.svg",
  },
  {
    name: "Discord",
    href: "https://discord.com",
    icon: "/discord.svg",
  },
  {
    name: "Telegram",
    href: "https://telegram.com",
    icon: "/telegram.svg",
  }
]