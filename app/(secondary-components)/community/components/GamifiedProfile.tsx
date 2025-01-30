'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Crown, ChevronDown, Trophy, Users, Gift, Copy, Medal, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface ReferralSlot {
  isActive: boolean;
  percentage: number;
  earnings: number;
}

export const GamifiedProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'referrals' | 'redeem' | 'collections'>('achievements');
  const [isExpanded, setIsExpanded] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Referral slots with percentages
  const referralSlots: ReferralSlot[] = [
    { isActive: false, percentage: 10, earnings: 0 },
    { isActive: false, percentage: 5, earnings: 0 },
    { isActive: false, percentage: 2.5, earnings: 0 },
    { isActive: false, percentage: 1, earnings: 0 }
  ];

  // Generate referral code
  const generateReferralCode = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    const code = `NEURO-${timestamp.slice(-4)}-${randomStr.toUpperCase()}`;
    setReferralCode(code);
  };

  // Copy referral code
  const copyReferralCode = async () => {
    if (referralCode) {
      await navigator.clipboard.writeText(referralCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Sample referral data
  const referrals: any[] = [
    { username: 'CryptoKing', level: 42, income: 5000, percentage: 10 },
    { username: 'BlockMaster', level: 28, income: 3000, percentage: 5 },
    { username: 'MiningPro', level: 15, income: 2000, percentage: 2.5 },
    { username: 'HashMaster', level: 8, income: 1000, percentage: 1 },
  ];

  const achievements = [
    { title: 'First Mining', description: 'Complete your first mining session', progress: 100 },
    { title: 'Power User', description: 'Mine for 100 hours', progress: 75 },
    { title: 'Community Leader', description: 'Refer 5 active users', progress: 80 },
    { title: 'Early Adopter', description: 'Join during beta phase', progress: 100 },
  ];

  const redeemCodes = [
    { code: 'NEURO2025', reward: '100 Credits', status: 'Available' },
    { code: 'WELCOME50', reward: '50 Credits', status: 'Used' },
    { code: 'MINING100', reward: 'Mining Boost', status: 'Expired' },
  ];

  const collections: any[] = [
    { 
      id: 1,
      name: 'BETA Champion',
      icon: '👑',
      rarity: 'BETA',
      description: 'Participated in closed beta testing',
      acquired: '2024-12-15'
    },
    { 
      id: 2,
      name: 'Neural Architect',
      icon: '🧠',
      rarity: 'Mythic',
      description: 'First to achieve 1M neural connections',
      acquired: '2024-12-25'
    },
    {
      id: 3,
      name: 'Early Pioneer',
      icon: '🚀',
      rarity: 'Legendary',
      description: 'One of the first 100 users',
      acquired: '2024-12-28'
    },
    {
      id: 4,
      name: 'Mining Master',
      icon: '⛏️',
      rarity: 'Epic',
      description: 'Mined 1000 blocks',
      acquired: '2025-01-15'
    },
    {
      id: 5,
      name: 'Community Guardian',
      icon: '🛡️',
      rarity: 'Rare',
      description: 'Helped 50 new users',
      acquired: '2025-01-20'
    },
    {
      id: 6,
      name: 'Network Node',
      icon: '🌐',
      rarity: 'Common',
      description: 'Successfully hosted a node for 24 hours',
      acquired: '2025-01-10'
    },
    {
      id: 7,
      name: 'Bug Slayer',
      icon: '🐛',
      rarity: 'Epic',
      description: 'Fixed 5 critical network issues',
      acquired: '2025-01-22'
    },
    {
      id: 8,
      name: 'BETA Explorer',
      icon: '🔍',
      rarity: 'BETA',
      description: 'Discovered a major feature during beta',
      acquired: '2024-12-20'
    }
  ];

  return (
    <div className="h-[calc(100vh-16rem)] flex flex-col">
      {/* Profile Header - Fixed */}
      <Card className="relative overflow-hidden border border-blue-500/20 bg-black/40 backdrop-blur-xl flex-shrink-0">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <span className="text-lg font-bold text-white">N</span>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Crown className="w-3 h-3 text-black" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  NeuroMiner
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Level 42</span>
                  <Progress value={75} className="w-20 h-1.5" />
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden flex-1"
          >
            <Card className="border border-blue-500/20 bg-black/40 backdrop-blur-xl h-full">
              <div className="p-3 h-full flex flex-col">
                {/* Navigation */}
                <div className="flex gap-2 mb-3 flex-shrink-0">
                  {(['achievements', 'referrals', 'redeem', 'collections'] as const).map((tab) => (
                    <Button
                      key={tab}
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "w-9 h-9 p-0",
                        activeTab === tab
                          ? "bg-blue-500/20 text-blue-400"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                      title={tab.charAt(0).toUpperCase() + tab.slice(1)}
                    >
                      {tab === 'achievements' && <Trophy className="w-4 h-4" />}
                      {tab === 'referrals' && <Users className="w-4 h-4" />}
                      {tab === 'redeem' && <Gift className="w-4 h-4" />}
                      {tab === 'collections' && <Medal className="w-4 h-4" />}
                    </Button>
                  ))}
                </div>

                {/* Content with individual scroll */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto no-scrollbar">
                    {activeTab === 'referrals' && (
                      <div className="space-y-4">
                        {/* Referral Code Generator */}
                        <Card className="bg-black/20 border-blue-500/10">
                          <div className="p-3 space-y-3">
                            <h4 className="text-sm font-semibold text-white">Your Referral Code</h4>
                            <div className="flex gap-2">
                              <Input
                                value={referralCode}
                                readOnly
                                placeholder="Generate your referral code"
                                className="bg-black/20 border-blue-500/20 text-sm"
                              />
                              {!referralCode ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={generateReferralCode}
                                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                                >
                                  Generate
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={copyReferralCode}
                                  className={cn(
                                    "min-w-[60px]",
                                    isCopied
                                      ? "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                                      : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                                  )}
                                >
                                  {isCopied ? "Copied!" : "Copy"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>

                        {/* Referral Slots */}
                        <div className="space-y-2">
                          {referralSlots.map((slot, index) => (
                            <Card key={index} className="bg-black/20 border-blue-500/10">
                              <div className="p-2">
                                {slot.isActive ? (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[1.5px]">
                                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                          <span className="text-xs font-bold text-white">U</span>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm text-white">User Name</p>
                                        <p className="text-xs text-gray-400">Level 1</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-green-400">+0 ₦</p>
                                      <p className="text-xs text-gray-400">{slot.percentage}% earnings</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-blue-500/20 flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-blue-400" />
                                      </div>
                                      <div>
                                        <p className="text-sm text-white">Empty Slot</p>
                                        <p className="text-xs text-blue-400">{slot.percentage}% of earnings</p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                                    >
                                      Invite
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'achievements' && (
                      <div className="space-y-2">
                        {achievements.map((achievement, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-white">{achievement.title}</span>
                              <span className="text-gray-400">{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} className="h-1" />
                            <p className="text-xs text-gray-400">{achievement.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'collections' && (
                      <div className="grid grid-cols-2 gap-2">
                        {collections.map((badge) => (
                          <Card key={badge.id} className="bg-black/20 border-blue-500/10 overflow-hidden group">
                            <motion.div 
                              className="p-3 relative"
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              {/* Animated background */}
                              <div className={cn(
                                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                                badge.rarity === 'BETA' && "bg-gradient-to-r from-orange-500/5 via-yellow-500/5 to-orange-500/5",
                                badge.rarity === 'Mythic' && "bg-gradient-to-r from-red-500/5 via-purple-500/5 to-red-500/5",
                                badge.rarity === 'Legendary' && "bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-yellow-500/5",
                                badge.rarity === 'Epic' && "bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5",
                                badge.rarity === 'Rare' && "bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5",
                                badge.rarity === 'Common' && "bg-gradient-to-r from-gray-500/5 via-slate-500/5 to-gray-500/5"
                              )} />
                              
                              {/* Badge content */}
                              <div className="relative">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center text-xl",
                                    badge.rarity === 'BETA' && "bg-gradient-to-r from-orange-500/20 to-yellow-500/20",
                                    badge.rarity === 'Mythic' && "bg-gradient-to-r from-red-500/20 to-purple-500/20",
                                    badge.rarity === 'Legendary' && "bg-gradient-to-r from-yellow-500/20 to-orange-500/20",
                                    badge.rarity === 'Epic' && "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
                                    badge.rarity === 'Rare' && "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
                                    badge.rarity === 'Common' && "bg-gradient-to-r from-gray-500/20 to-slate-500/20"
                                  )}>
                                    {badge.icon}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-white">{badge.name}</h4>
                                    <span className={cn(
                                      "text-xs px-1.5 py-0.5 rounded-full",
                                      badge.rarity === 'BETA' && "bg-orange-500/10 text-orange-400",
                                      badge.rarity === 'Mythic' && "bg-red-500/10 text-red-400",
                                      badge.rarity === 'Legendary' && "bg-yellow-500/10 text-yellow-400",
                                      badge.rarity === 'Epic' && "bg-purple-500/10 text-purple-400",
                                      badge.rarity === 'Rare' && "bg-blue-500/10 text-blue-400",
                                      badge.rarity === 'Common' && "bg-gray-500/10 text-gray-400"
                                    )}>
                                      {badge.rarity}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-400 mb-1">{badge.description}</p>
                                <p className="text-xs text-gray-500">Acquired: {new Date(badge.acquired).toLocaleDateString()}</p>
                              </div>

                              {/* Shine effect */}
                              <motion.div
                                className={cn(
                                  "absolute inset-0 -skew-x-45",
                                  badge.rarity === 'BETA' && "bg-gradient-to-r from-transparent via-orange-400/10 to-transparent",
                                  badge.rarity === 'Mythic' && "bg-gradient-to-r from-transparent via-red-400/10 to-transparent",
                                  badge.rarity === 'Legendary' && "bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent",
                                  badge.rarity === 'Epic' && "bg-gradient-to-r from-transparent via-purple-400/10 to-transparent",
                                  badge.rarity === 'Rare' && "bg-gradient-to-r from-transparent via-blue-400/10 to-transparent",
                                  badge.rarity === 'Common' && "bg-gradient-to-r from-transparent via-gray-400/10 to-transparent"
                                )}
                                animate={{
                                  x: ["100%", "-100%"]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatDelay: 3
                                }}
                              />
                            </motion.div>
                          </Card>
                        ))}
                      </div>
                    )}

                    {activeTab === 'redeem' && (
                      <div className="space-y-2">
                        {redeemCodes.map((code, index) => (
                          <Card key={index} className="bg-black/20 border-blue-500/10">
                            <div className="p-2 flex items-center justify-between">
                              <div>
                                <p className="text-sm text-white">{code.code}</p>
                                <p className="text-xs text-gray-400">{code.reward}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "text-xs px-2 py-0.5 rounded-full",
                                  code.status === 'Available' && "bg-green-500/10 text-green-400",
                                  code.status === 'Used' && "bg-gray-500/10 text-gray-400",
                                  code.status === 'Expired' && "bg-red-500/10 text-red-400"
                                )}>
                                  {code.status}
                                </span>
                                {code.status === 'Available' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-blue-500/10"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-blue-400" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Enter code"
                            className="w-full bg-black/20 border border-blue-500/20 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
                          />
                          <Button
                            size="sm"
                            className="absolute right-1 top-1 h-6 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs"
                          >
                            Redeem
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
