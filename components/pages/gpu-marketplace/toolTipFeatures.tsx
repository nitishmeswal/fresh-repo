"use client"

import { Shield, Coins, Star } from "lucide-react";

const TooltipFeatures = () => (
  <div className="space-y-4">
    {[
      {
        icon: <Shield className="h-4 w-4 text-[#20A5EF]" />,
        title: "Neurolov Assured",
        description: "Verified GPUs with guaranteed performance, reliability, and security. Backed by Neurolov's quality assurance."
      },
      {
        icon: <Coins className="h-4 w-4 text-[#20A5EF]" />,
        title: "Pay with $NLOV",
        description: "Get 30% discount on all GPU rentals by paying with $NLOV tokens, Neurolov's native cryptocurrency."
      },
      {
        icon: <Star className="h-4 w-4 text-[#20A5EF]" />,
        title: "High Rated GPUs",
        description: "We recommend choosing GPUs with 5★ ratings for the best computing experience, as rated by our community."
      }
    ].map((feature, index) => (
      <div key={index} className="space-y-2">
        <div className="flex items-center gap-2">
          {feature.icon}
          <p className="text-sm font-semibold text-white">{feature.title}</p>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          {feature.description}
        </p>
      </div>
    ))}
  </div>
);

export default TooltipFeatures;