'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, UserPlus, Gift, Rocket, Bot, Cpu, Star, Zap, Send, ZoomIn, ZoomOut, Search, RotateCcw, Locate } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// World map coordinates (simplified representation of continents)
const worldMapCoordinates = {
  northAmerica: [
    // West Coast
    { x: 15, y: 25 }, { x: 18, y: 23 }, { x: 20, y: 22 },
    // Central
    { x: 22, y: 25 }, { x: 25, y: 24 }, { x: 27, y: 23 },
    // East Coast
    { x: 30, y: 25 }, { x: 28, y: 28 }, { x: 25, y: 30 },
    // Canada
    { x: 20, y: 20 }, { x: 25, y: 18 }, { x: 30, y: 19 },
    // Alaska
    { x: 12, y: 15 }, { x: 15, y: 17 }, { x: 10, y: 18 },
  ],
  southAmerica: [
    // Northern region
    { x: 28, y: 45 }, { x: 30, y: 43 }, { x: 32, y: 44 },
    // Brazil
    { x: 33, y: 48 }, { x: 35, y: 50 }, { x: 32, y: 52 },
    // Southern region
    { x: 28, y: 55 }, { x: 30, y: 58 }, { x: 25, y: 60 },
    // West Coast
    { x: 25, y: 45 }, { x: 24, y: 50 }, { x: 26, y: 55 },
  ],
  europe: [
    // Western Europe
    { x: 45, y: 20 }, { x: 47, y: 22 }, { x: 46, y: 24 },
    // Central Europe
    { x: 50, y: 20 }, { x: 52, y: 22 }, { x: 51, y: 24 },
    // Eastern Europe
    { x: 55, y: 20 }, { x: 57, y: 22 }, { x: 56, y: 24 },
    // Northern Europe
    { x: 48, y: 15 }, { x: 52, y: 16 }, { x: 50, y: 18 },
    // Southern Europe
    { x: 48, y: 25 }, { x: 52, y: 26 }, { x: 50, y: 28 },
  ],
  africa: [
    // Northern Africa
    { x: 45, y: 35 }, { x: 48, y: 33 }, { x: 52, y: 34 },
    // Western Africa
    { x: 42, y: 38 }, { x: 44, y: 40 }, { x: 43, y: 42 },
    // Central Africa
    { x: 48, y: 42 }, { x: 50, y: 44 }, { x: 49, y: 46 },
    // Eastern Africa
    { x: 54, y: 40 }, { x: 55, y: 42 }, { x: 53, y: 44 },
    // Southern Africa
    { x: 48, y: 50 }, { x: 50, y: 52 }, { x: 49, y: 54 },
  ],
  asia: [
    // Middle East
    { x: 58, y: 30 }, { x: 60, y: 28 }, { x: 62, y: 29 },
    // Central Asia
    { x: 65, y: 25 }, { x: 68, y: 24 }, { x: 70, y: 26 },
    // South Asia
    { x: 70, y: 32 }, { x: 72, y: 30 }, { x: 74, y: 31 },
    // East Asia
    { x: 80, y: 25 }, { x: 82, y: 28 }, { x: 78, y: 30 },
    // Southeast Asia
    { x: 75, y: 38 }, { x: 78, y: 40 }, { x: 80, y: 42 },
    // Russia
    { x: 70, y: 18 }, { x: 75, y: 15 }, { x: 80, y: 17 },
  ],
  oceania: [
    // Australia
    { x: 82, y: 55 }, { x: 85, y: 53 }, { x: 88, y: 54 },
    { x: 83, y: 58 }, { x: 86, y: 57 }, { x: 84, y: 60 },
    // New Zealand
    { x: 92, y: 62 }, { x: 93, y: 64 }, { x: 91, y: 63 },
    // Pacific Islands
    { x: 88, y: 45 }, { x: 90, y: 48 }, { x: 92, y: 47 },
  ]
};

interface Node {
  id: string;
  name: string;
  region: string;
  x: number;
  y: number;
  isCurrentUser: boolean;
  isActive: boolean;
  isFriend: boolean;
  lastSeen: string;
  tokens: number;
  customIcon?: string;
  leaderboardPosition: number;
  stats: {
    computePower: number;
    tasksCompleted: number;
    uptime: string;
  }
}

const availableIcons = [
  { id: 'rocket', icon: Rocket, label: 'Rocket' },
  { id: 'bot', icon: Bot, label: 'Robot' },
  { id: 'cpu', icon: Cpu, label: 'CPU' },
  { id: 'star', icon: Star, label: 'Star' },
  { id: 'zap', icon: Zap, label: 'Lightning' },
];

// Generate nodes for each region
const generateRegionalNodes = () => {
  const nodes: Node[] = [];
  let id = 1;
  const totalNodesWanted = 100; // We want 100 nodes in total
  
  // Calculate nodes per region based on region size
  const regionWeights = {
    northAmerica: 0.2,  // 20%
    southAmerica: 0.15, // 15%
    europe: 0.2,        // 20%
    africa: 0.15,       // 15%
    asia: 0.2,          // 20%
    oceania: 0.1        // 10%
  };

  Object.entries(worldMapCoordinates).forEach(([region, coordinates]) => {
    const nodeCount = Math.floor(totalNodesWanted * regionWeights[region as keyof typeof regionWeights]);
    
    for (let i = 0; i < nodeCount; i++) {
      const baseCoordinate = coordinates[Math.floor(Math.random() * coordinates.length)];
      // Add more randomness to position but keep within region bounds
      const randomOffset = 3;
      const x = baseCoordinate.x + (Math.random() * randomOffset * 2 - randomOffset);
      const y = baseCoordinate.y + (Math.random() * randomOffset * 2 - randomOffset);
      
      nodes.push({
        id: `node-${id}`,
        name: `${region.charAt(0).toUpperCase() + region.slice(1)} Node ${i + 1}`,
        region: region.charAt(0).toUpperCase() + region.slice(1),
        x,
        y,
        isCurrentUser: false,
        isActive: Math.random() > 0.3,
        isFriend: Math.random() > 0.7, // Make friends more rare
        lastSeen: Math.random() > 0.7 ? 'Now' : `${Math.floor(Math.random() * 60)} mins ago`,
        tokens: Math.floor(Math.random() * 5000),
        leaderboardPosition: id,
        stats: {
          computePower: (Math.random() * 20 + 5).toFixed(1),
          tasksCompleted: Math.floor(Math.random() * 2000) + 500,
          uptime: `${(Math.random() * 2 + 97).toFixed(1)}%`
        }
      });
      id++;
    }
  });

  return nodes;
};

const mockNodes = generateRegionalNodes();

const currentUser: Node = {
  id: 'current-user',
  name: 'Your Node',
  region: 'Asia',
  x: 70,
  y: 25,
  isCurrentUser: true,
  isActive: true,
  isFriend: false,
  lastSeen: 'Now',
  tokens: 1500,
  customIcon: 'rocket',
  leaderboardPosition: 15,
  stats: {
    computePower: 10.5,
    tasksCompleted: 850,
    uptime: '97.8%'
  }
};

const WorldMap: React.FC = () => {
  const INITIAL_SCALE = 1;
  const INITIAL_POSITION = { x: 0, y: 0 };

  const [nodes, setNodes] = useState<Node[]>([currentUser, ...mockNodes]);
  const [selectedIcon, setSelectedIcon] = useState(currentUser.customIcon);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [scale, setScale] = useState(INITIAL_SCALE);
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = nodes.filter(node => 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, nodes]);

  const handleNodeSelect = (node: Node) => {
    setSelectedNode(node);
    setSearchTerm('');
    setSearchResults([]);
    
    // Center the map on the selected node
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      setPosition({
        x: -(node.x / 100 * containerWidth * scale - containerWidth / 2),
        y: -(node.y / 100 * containerHeight * scale - containerHeight / 2)
      });
    }
    
    // Show node details
    handleNodeClick(node);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    const zoomSpeed = 0.1; // Slower zoom for more control
    const newScale = Math.min(Math.max(scale + delta * zoomSpeed, 0.5), 5);
    setScale(newScale);
  };

  // Calculate node size based on zoom level
  const getNodeSize = () => {
    // Base size in pixels that will be scaled
    const baseSize = 32;
    const scaledSize = baseSize / (scale * 1.5); // Reduce size more aggressively as we zoom in
    
    // Convert to tailwind classes based on pixel size
    if (scaledSize <= 8) return 'w-2 h-2';
    if (scaledSize <= 12) return 'w-3 h-3';
    if (scaledSize <= 16) return 'w-4 h-4';
    if (scaledSize <= 24) return 'w-6 h-6';
    return 'w-8 h-8';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: position.x + e.movementX,
      y: position.y + e.movementY
    });
  };

  const handleNodeClick = (node: Node) => {
    if (node.isCurrentUser) {
      setShowIconPicker(true);
      return;
    }
    
    const actions = [];
    
    if (!node.isFriend) {
      actions.push(
        <Button 
          key="friend"
          size="sm"
          onClick={() => {
            toast.success(`Friend request sent to ${node.name}`);
            setNodes(nodes.map(n => 
              n.id === node.id 
                ? { ...n, isFriend: true }
                : n
            ));
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Friend
        </Button>
      );
    }
    
    if (node.isFriend && !node.isActive) {
      actions.push(
        <Button
          key="ping"
          size="sm"
          onClick={() => {
            toast.success(`Pinged ${node.name}!`);
            // Simulate ping response after 2 seconds
            setTimeout(() => {
              setNodes(nodes.map(n => 
                n.id === node.id 
                  ? { ...n, isActive: true, lastSeen: 'Just now' }
                  : n
              ));
              toast.success(`${node.name} is now online!`);
            }, 2000);
          }}
          className="bg-yellow-500 hover:bg-yellow-600"
        >
          <Send className="w-4 h-4 mr-2" />
          Ping
        </Button>
      );
    }

    if (node.isFriend && node.isActive) {
      actions.push(
        <Button
          key="gift"
          size="sm"
          onClick={() => toast.success(`Sent 100 tokens to ${node.name}`)}
          className="bg-green-500 hover:bg-green-600"
        >
          <Gift className="w-4 h-4 mr-2" />
          Gift Tokens
        </Button>
      );
    }

    toast.custom((t) => (
      <div className="bg-black/90 border border-gray-800 rounded-lg p-6 shadow-xl min-w-[300px]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{node.name}</h3>
            <div className="text-sm text-gray-400 mb-4">#{node.leaderboardPosition} on Leaderboard</div>
          </div>
          <div className={`p-2 rounded-full ${node.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
            <MapPin className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Location:</span>
            <span className="text-white">{node.region}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Last Seen:</span>
            <span className="text-white">{node.lastSeen}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Compute Power:</span>
            <span className="text-white">{node.stats.computePower} TFLOPs</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tasks Completed:</span>
            <span className="text-white">{node.stats.tasksCompleted}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Uptime:</span>
            <span className="text-white">{node.stats.uptime}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          {actions}
        </div>
      </div>
    ), { duration: 0 });
  };

  const getNodeIcon = (node: Node) => {
    if (node.isCurrentUser && node.customIcon) {
      const IconComponent = availableIcons.find(i => i.id === node.customIcon)?.icon || MapPin;
      return <IconComponent className={`w-4 h-4 text-white`} />;
    }
    return <MapPin className={`w-4 h-4 text-white`} />;
  };

  const getNodeColor = (node: Node) => {
    if (node.isCurrentUser) return 'bg-purple-500 hover:bg-purple-600';
    if (node.isFriend && node.isActive) return 'bg-green-500 hover:bg-green-600';
    if (node.isFriend && !node.isActive) return 'bg-gray-500 hover:bg-gray-600';
    return 'bg-blue-500 hover:bg-blue-600';
  };

  const handleReset = () => {
    setScale(INITIAL_SCALE);
    setPosition(INITIAL_POSITION);
    setSelectedNode(null);
    setSearchTerm('');
    setSearchResults([]);
    toast.success('Map view reset to default');
  };

  const handleFindMe = () => {
    const myNode = nodes.find(node => node.isCurrentUser);
    if (!myNode) return;

    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // Set position to center on current user's node
      setPosition({
        x: -(myNode.x / 100 * containerWidth * scale - containerWidth / 2),
        y: -(myNode.y / 100 * containerHeight * scale - containerHeight / 2)
      });

      // Set zoom to a good level for viewing
      setScale(1.5);
      
      // Highlight the node
      setSelectedNode(myNode);
      
      toast.success('Found your node!');
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createWorldMap = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = container.clientWidth || 800;
      canvas.height = container.clientHeight || 600;

      // Draw dark background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(1, '#001529');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw continents with dots
      Object.values(worldMapCoordinates).forEach(coordinates => {
        coordinates.forEach(coord => {
          // Create dense clusters of dots for each coordinate
          for (let i = 0; i < 30; i++) {
            const dotX = (coord.x / 100) * canvas.width + (Math.random() * 30 - 15);
            const dotY = (coord.y / 100) * canvas.height + (Math.random() * 30 - 15);
            
            // Create a gradient for each dot
            const dotGradient = ctx.createRadialGradient(
              dotX, dotY, 0,
              dotX, dotY, 2
            );
            dotGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
            dotGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = dotGradient;
            ctx.beginPath();
            ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Add some connecting lines between nearby coordinates
          coordinates.forEach(nextCoord => {
            const distance = Math.sqrt(
              Math.pow(coord.x - nextCoord.x, 2) + Math.pow(coord.y - nextCoord.y, 2)
            );
            if (distance < 10) { // Only connect nearby points
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
              ctx.beginPath();
              ctx.moveTo((coord.x / 100) * canvas.width, (coord.y / 100) * canvas.height);
              ctx.lineTo((nextCoord.x / 100) * canvas.width, (nextCoord.y / 100) * canvas.height);
              ctx.stroke();
            }
          });
        });
      });

      return canvas.toDataURL();
    };

    const worldMap = createWorldMap();
    container.style.backgroundImage = `url(${worldMap})`;
  }, []);

  const getIconSize = (scale: number) => {
    if (scale <= 1) return 'w-4 h-4';
    if (scale <= 2) return 'w-3 h-3';
    if (scale <= 3) return 'w-2 h-2';
    return 'w-1 h-1';
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Search bar */}
      <div className="absolute top-4 left-4 z-30 w-64">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/80 border-gray-700 text-white pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          
          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-gray-700 rounded-lg max-h-60 overflow-y-auto">
              {searchResults.map((node) => (
                <button
                  key={node.id}
                  onClick={() => handleNodeSelect(node)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-800 text-white flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{node.name}</div>
                    <div className="text-sm text-gray-400">{node.region}</div>
                  </div>
                  <div className={`
                    w-2 h-2 rounded-full
                    ${node.isCurrentUser ? 'bg-purple-500' :
                      node.isFriend && node.isActive ? 'bg-green-500' :
                      node.isFriend ? 'bg-gray-500' :
                      'bg-blue-500'}
                  `} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute right-4 top-4 flex flex-col space-y-2 z-20">
        {/* Find Me button */}
        <button
          onClick={handleFindMe}
          className="p-2 bg-purple-500/80 hover:bg-purple-600/80 rounded-lg text-white group relative"
          title="Find my node"
        >
          <Locate size={20} />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Find my node
          </span>
        </button>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="p-2 bg-gray-500/80 hover:bg-gray-600/80 rounded-lg text-white group relative"
          title="Reset view"
        >
          <RotateCcw size={20} />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Reset view
          </span>
        </button>

        <div className="w-full h-px bg-gray-700/50"></div>

        {/* Existing zoom controls */}
        <button
          onClick={() => setScale(Math.min(scale + 0.5, 5))}
          className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white group relative"
          title="Zoom in"
        >
          <ZoomIn size={20} />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Zoom in
          </span>
        </button>
        
        <div className="px-2 py-1 bg-black/50 rounded-lg text-white text-xs text-center">
          {Math.round(scale * 100)}%
        </div>
        
        <button
          onClick={() => setScale(Math.max(scale - 0.5, 0.5))}
          className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white group relative"
          title="Zoom out"
        >
          <ZoomOut size={20} />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Zoom out
          </span>
        </button>
      </div>

      {/* Icon picker */}
      {showIconPicker && (
        <div className="absolute top-20 left-4 bg-black/90 border border-gray-800 rounded-lg p-4 z-20">
          <h3 className="text-white font-semibold mb-3">Choose Your Icon</h3>
          <div className="grid grid-cols-3 gap-2">
            {availableIcons.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => {
                  setSelectedIcon(id);
                  setNodes(nodes.map(n => 
                    n.isCurrentUser ? { ...n, customIcon: id } : n
                  ));
                  setShowIconPicker(false);
                  toast.success(`Icon updated to ${label}`);
                }}
                className={`p-2 rounded-lg border ${
                  selectedIcon === id 
                    ? 'border-purple-500 bg-purple-500/20' 
                    : 'border-gray-700 hover:border-purple-500/50'
                }`}
              >
                <Icon className="w-6 h-6 text-white" />
              </button>
            ))}
          </div>
        </div>
      )}

      <motion.div
        style={{
          scale,
          x: position.x,
          y: position.y,
          transition: { type: 'spring', stiffness: 100 }
        }}
        className="absolute inset-0"
      >
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className={`absolute cursor-pointer ${
              selectedNode?.id === node.id ? 'z-10' : ''
            }`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: `translate(-50%, -50%)`
            }}
            whileHover={{ scale: 1.2 }}
            onClick={() => handleNodeClick(node)}
          >
            <div 
              className={`
                flex items-center justify-center
                ${getNodeSize()}
                rounded-full
                ${getNodeColor(node)}
                shadow-lg shadow-blue-500/20
                transition-all duration-200
                ${selectedNode?.id === node.id ? 'ring-2 ring-white' : ''}
              `}
            >
              <div className={`
                ${scale <= 2 ? 'scale-75' : scale <= 3 ? 'scale-50' : 'scale-25'}
                transition-transform duration-200
              `}>
                {getNodeIcon(node)}
              </div>
            </div>
            {(scale > 1.2 || selectedNode?.id === node.id) && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                <div className="text-xs text-white whitespace-nowrap bg-black/50 px-2 py-1 rounded">
                  {node.name}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default WorldMap;
