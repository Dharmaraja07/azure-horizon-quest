import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sword, Shield, Gem, Zap, Coins, ShoppingBag, Package } from "lucide-react";
import { useProfile } from "@/hooks/useGameData";
import { useToast } from "@/hooks/use-toast";

interface EquipmentItem {
  id: string;
  name: string;
  type: "weapon" | "armor" | "accessory";
  rarity: "common" | "rare" | "epic" | "legendary";
  stats: {
    strength?: number;
    defense?: number;
    agility?: number;
    energy?: number;
  };
  description: string;
  cost: number;
  icon: React.ReactNode;
}

interface EquipmentSlot {
  weapon?: EquipmentItem;
  armor?: EquipmentItem;
  accessory?: EquipmentItem;
}

interface EquipmentProps {
  onBack: () => void;
}

const shopItems: EquipmentItem[] = [
  {
    id: "wooden_sword",
    name: "Wooden Sword",
    type: "weapon",
    rarity: "common",
    stats: { strength: 5 },
    description: "A basic training sword",
    cost: 100,
    icon: <Sword className="h-5 w-5" />
  },
  {
    id: "iron_sword",
    name: "Iron Blade",
    type: "weapon",
    rarity: "rare",
    stats: { strength: 15, agility: 3 },
    description: "A well-crafted iron sword",
    cost: 500,
    icon: <Sword className="h-5 w-5" />
  },
  {
    id: "azure_blade",
    name: "Azure Blade",
    type: "weapon",
    rarity: "epic",
    stats: { strength: 30, agility: 10, energy: 5 },
    description: "A legendary blade forged from ocean crystals",
    cost: 2000,
    icon: <Sword className="h-5 w-5" />
  },
  {
    id: "storm_reaver",
    name: "Storm Reaver",
    type: "weapon",
    rarity: "legendary",
    stats: { strength: 50, agility: 20, energy: 15 },
    description: "A weapon that channels the power of storms",
    cost: 5000,
    icon: <Sword className="h-5 w-5" />
  },
  {
    id: "leather_armor",
    name: "Leather Armor",
    type: "armor",
    rarity: "common",
    stats: { defense: 5 },
    description: "Basic protective gear",
    cost: 100,
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: "chainmail",
    name: "Chainmail",
    type: "armor",
    rarity: "rare",
    stats: { defense: 15, strength: 3 },
    description: "Interlocking metal rings provide solid protection",
    cost: 500,
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: "dragon_scale",
    name: "Dragon Scale Armor",
    type: "armor",
    rarity: "epic",
    stats: { defense: 30, strength: 10, energy: 5 },
    description: "Armor crafted from dragon scales",
    cost: 2000,
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: "titan_guard",
    name: "Titan's Guard",
    type: "armor",
    rarity: "legendary",
    stats: { defense: 50, strength: 15, energy: 20 },
    description: "The ultimate defensive equipment",
    cost: 5000,
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: "speed_ring",
    name: "Ring of Speed",
    type: "accessory",
    rarity: "rare",
    stats: { agility: 10, energy: 5 },
    description: "Increases movement and reaction speed",
    cost: 800,
    icon: <Zap className="h-5 w-5" />
  },
  {
    id: "power_amulet",
    name: "Amulet of Power",
    type: "accessory",
    rarity: "epic",
    stats: { strength: 15, energy: 10 },
    description: "Amplifies your combat abilities",
    cost: 2500,
    icon: <Gem className="h-5 w-5" />
  },
  {
    id: "ocean_crown",
    name: "Crown of the Ocean",
    type: "accessory",
    rarity: "legendary",
    stats: { strength: 25, defense: 20, agility: 15, energy: 25 },
    description: "The crown of the ocean king",
    cost: 8000,
    icon: <Gem className="h-5 w-5" />
  }
];

export const Equipment = ({ onBack }: EquipmentProps) => {
  const { data: profile } = useProfile();
  const { toast } = useToast();
  const [equipped, setEquipped] = useState<EquipmentSlot>({});
  const [inventory, setInventory] = useState<EquipmentItem[]>([]);

  const getRarityColor = (rarity: EquipmentItem["rarity"]) => {
    switch (rarity) {
      case "legendary": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "epic": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "rare": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const handlePurchase = (item: EquipmentItem) => {
    if (!profile) return;
    if (profile.gold < item.cost) {
      toast({
        title: "Insufficient Gold",
        description: `You need ${item.cost} gold to purchase this item.`,
        variant: "destructive",
      });
      return;
    }

    setInventory([...inventory, item]);
    toast({
      title: "Item Purchased!",
      description: `${item.name} has been added to your inventory.`,
    });
  };

  const handleEquip = (item: EquipmentItem) => {
    const newEquipped = { ...equipped };
    newEquipped[item.type] = item;
    setEquipped(newEquipped);
    toast({
      title: "Item Equipped!",
      description: `${item.name} has been equipped.`,
    });
  };

  const handleUnequip = (type: "weapon" | "armor" | "accessory") => {
    const newEquipped = { ...equipped };
    if (newEquipped[type]) {
      setInventory([...inventory, newEquipped[type]!]);
      delete newEquipped[type];
      setEquipped(newEquipped);
      toast({
        title: "Item Unequipped",
        description: "Item has been moved to inventory.",
      });
    }
  };

  const calculateTotalStats = () => {
    const stats = { strength: 0, defense: 0, agility: 0, energy: 0 };
    Object.values(equipped).forEach(item => {
      if (item.stats.strength) stats.strength += item.stats.strength;
      if (item.stats.defense) stats.defense += item.stats.defense;
      if (item.stats.agility) stats.agility += item.stats.agility;
      if (item.stats.energy) stats.energy += item.stats.energy;
    });
    return stats;
  };

  const totalStats = calculateTotalStats();

  return (
    <div className="min-h-screen gradient-hero">
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={onBack} className="anime-slide-up">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hub
            </Button>
            <h1 className="text-4xl font-bold anime-slide-up">Equipment & Shop</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Equipped Items */}
            <div className="lg:col-span-1">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Equipped Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(["weapon", "armor", "accessory"] as const).map((type) => (
                    <div key={type} className="space-y-2">
                      <div className="text-sm font-semibold capitalize">{type}</div>
                      {equipped[type] ? (
                        <Card className="p-3 bg-muted/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {equipped[type]!.icon}
                              <div>
                                <div className="font-semibold">{equipped[type]!.name}</div>
                                <Badge className={getRarityColor(equipped[type]!.rarity)}>
                                  {equipped[type]!.rarity}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnequip(type)}
                            >
                              Unequip
                            </Button>
                          </div>
                        </Card>
                      ) : (
                        <div className="p-3 border-2 border-dashed border-muted rounded-lg text-center text-sm text-muted-foreground">
                          No {type} equipped
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Stat Bonuses */}
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Equipment Bonuses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {totalStats.strength > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Sword className="h-4 w-4 text-red-400" />
                          Strength
                        </span>
                        <span className="font-semibold text-green-400">+{totalStats.strength}</span>
                      </div>
                    )}
                    {totalStats.defense > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Shield className="h-4 w-4 text-blue-400" />
                          Defense
                        </span>
                        <span className="font-semibold text-green-400">+{totalStats.defense}</span>
                      </div>
                    )}
                    {totalStats.agility > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          Agility
                        </span>
                        <span className="font-semibold text-green-400">+{totalStats.agility}</span>
                      </div>
                    )}
                    {totalStats.energy > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Gem className="h-4 w-4 text-purple-400" />
                          Energy
                        </span>
                        <span className="font-semibold text-green-400">+{totalStats.energy}</span>
                      </div>
                    )}
                    {Object.values(totalStats).every(v => v === 0) && (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No equipment bonuses
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shop & Inventory */}
            <div className="lg:col-span-2">
              <div className="flex gap-2 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">{profile?.gold || 0} Gold</span>
                </div>
              </div>

              {/* Inventory */}
              {inventory.length > 0 && (
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Inventory ({inventory.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {inventory.map((item) => (
                        <Card key={item.id} className="p-3 bg-muted/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              {item.icon}
                              <div className="flex-1">
                                <div className="font-semibold">{item.name}</div>
                                <Badge className={getRarityColor(item.rarity)}>
                                  {item.rarity}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleEquip(item)}
                              disabled={!!equipped[item.type]}
                            >
                              Equip
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shop */}
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Equipment Shop
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shopItems.map((item, index) => (
                      <Card
                        key={item.id}
                        className="bg-muted/50 hover:shadow-glow transition-epic anime-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {item.icon}
                              <div>
                                <div className="font-semibold">{item.name}</div>
                                <Badge className={getRarityColor(item.rarity)}>
                                  {item.rarity}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                                <Coins className="h-4 w-4" />
                                {item.cost}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {Object.entries(item.stats).map(([stat, value]) => (
                              <Badge key={stat} variant="outline" className="text-xs">
                                {stat}: +{value}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button
                            className="w-full"
                            disabled={(profile?.gold || 0) < item.cost}
                            onClick={() => handlePurchase(item)}
                          >
                            Purchase
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

