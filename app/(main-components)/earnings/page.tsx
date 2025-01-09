'use client';

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { Gift, Ticket, CreditCard, Trophy, Coins, DollarSign } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function ScratchCard() {
  const [isScratched, setIsScratched] = useState(false);

  const handleScratch = () => {
    setIsScratched(true);
    // Create sparkle effect using CSS animations instead
    const sparkles = Array.from({ length: 20 }).map((_, i) => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: gold;
        border-radius: 50%;
        pointer-events: none;
        animation: sparkleAnim 1s ease-out forwards;
        left: ${50 + Math.random() * 200}px;
        top: ${300 + Math.random() * 100}px;
      `;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1000);
    });
  };

  return (
    <DialogContent className="sm:max-w-md bg-black/50 backdrop-blur-xl border border-white/10">
      <DialogHeader>
        <DialogTitle>Scratch & Win!</DialogTitle>
      </DialogHeader>
      <div className="p-6 text-center">
        {!isScratched ? (
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-lg cursor-pointer transform hover:scale-105 transition-transform"
            onClick={handleScratch}
          >
            <p className="text-lg font-bold">Scratch Here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-green-400">You Won!</h3>
            <p className="text-3xl font-bold">50 Credits</p>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes sparkleAnim {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(180deg);
            opacity: 0;
          }
        }
        .sparkle {
          z-index: 9999;
        }
      `}</style>
    </DialogContent>
  );
}

export default function EarningsPage() {
  const { profile, credits } = useUser();

  const earningsCards = [
    {
      title: "Available Credits",
      value: credits || 0,
      icon: Coins,
      color: "from-green-400 to-emerald-600",
      description: "Your current balance"
    },
    {
      title: "Lifetime Earnings",
      value: "1,250",
      icon: DollarSign,
      color: "from-blue-400 to-cyan-600",
      description: "Total credits earned"
    },
    {
      title: "Pending Rewards",
      value: "150",
      icon: Gift,
      color: "from-purple-400 to-pink-600",
      description: "Unclaimed rewards"
    }
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Earnings & Rewards
          </h1>
          <p className="text-gray-400">Earn credits through various activities and rewards</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {earningsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-black/50 backdrop-blur-xl border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className="text-xs text-gray-500">{card.description}</p>
                  </div>
                  <card.icon className="h-8 w-8 text-gray-400" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Rewards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Scratch Cards */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="p-6 bg-black/50 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Ticket className="h-6 w-6 text-purple-400" />
                    <span className="text-xs text-purple-400">5 Available</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Scratch Cards</h3>
                    <p className="text-sm text-gray-400">Scratch & win instant credits</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20"
                  >
                    Try Your Luck
                  </Button>
                </div>
              </Card>
            </DialogTrigger>
            <ScratchCard />
          </Dialog>

          {/* Raffle Events */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="p-6 bg-black/50 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Trophy className="h-6 w-6 text-blue-400" />
                    <span className="text-xs text-blue-400">Event Live</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Weekly Raffle</h3>
                    <p className="text-sm text-gray-400">Win up to 1000 credits</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20"
                  >
                    Enter Raffle
                  </Button>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Weekly Raffle</DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <p>Enter the weekly raffle for a chance to win up to 1000 credits!</p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Promotions */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="p-6 bg-black/50 backdrop-blur-xl border border-white/10 hover:border-green-500/50 transition-colors cursor-pointer group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Gift className="h-6 w-6 text-green-400" />
                    <span className="text-xs text-green-400">3 Active</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Promotions</h3>
                    <p className="text-sm text-gray-400">Special offers & bonuses</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full bg-green-500/10 border-green-500/20 hover:bg-green-500/20"
                  >
                    View Offers
                  </Button>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Active Promotions</DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <p>Check out our latest promotions and special offers!</p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Redeem Credits */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="p-6 bg-black/50 backdrop-blur-xl border border-white/10 hover:border-red-500/50 transition-colors cursor-pointer group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <CreditCard className="h-6 w-6 text-red-400" />
                    <span className="text-xs text-red-400">{credits} Available</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Cash Out</h3>
                    <p className="text-sm text-gray-400">Convert credits to cash</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                  >
                    Redeem Now
                  </Button>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Redeem Credits</DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <p>Convert your credits to cash rewards!</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
