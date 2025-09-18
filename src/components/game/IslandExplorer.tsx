import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Map, Compass, Gem, Anchor, Star, Coins } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useGameData";

interface IslandExplorerProps {
  onBack: () => void;
}

export const IslandExplorer = ({ onBack }: IslandExplorerProps) => {
  const [selectedIsland, setSelectedIsland] = useState<string | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [discoveredIslands, setDiscoveredIslands] = useState<string[]>(['starter_cove']);
  const { toast } = useToast();
  const { data: profile } = useProfile();

  const islands = [
    {
      id: "starter_cove",
      name: "Starter's Cove",
      description: "A peaceful bay perfect for new adventurers",
      level_requirement: 1,
      discovered: true,
      resources: ["fish", "seashells"],
      exploration_cost: 0,
      difficulty: "easy"
    },
    {
      id: "mystic_reef",
      name: "Mystic Reef",
      description: "Colorful coral formations hide ancient secrets",
      level_requirement: 3,
      discovered: discoveredIslands.includes('mystic_reef'),
      resources: ["pearls", "coral", "mystic_essence"],
      exploration_cost: 50,
      difficulty: "medium"
    },
    {
      id: "storm_peak",
      name: "Storm Peak",
      description: "A volcanic island wreathed in eternal storms",
      level_requirement: 8,
      discovered: discoveredIslands.includes('storm_peak'),
      resources: ["storm_crystals", "volcanic_glass", "lightning_essence"],
      exploration_cost: 150,
      difficulty: "hard"
    },
    {
      id: "lost_atlantis",
      name: "Lost Atlantis",
      description: "The legendary sunken city rises from the depths",
      level_requirement: 15,
      discovered: discoveredIslands.includes('lost_atlantis'),
      resources: ["atlantean_artifacts", "deep_pearls", "ancient_scrolls"],
      exploration_cost: 500,
      difficulty: "legendary"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "hard": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "legendary": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleExploreIsland = async (islandId: string) => {
    const island = islands.find(i => i.id === islandId);
    if (!island || !profile) return;

    if (profile.level < island.level_requirement) {
      toast({
        title: "Level Too Low",
        description: `You need to be level ${island.level_requirement} to explore this island.`,
        variant: "destructive",
      });
      return;
    }

    if (profile.gold < island.exploration_cost) {
      toast({
        title: "Insufficient Gold",
        description: `You need ${island.exploration_cost} gold to explore this island.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedIsland(islandId);
    setIsExploring(true);

    // Simulate exploration time
    setTimeout(() => {
      setIsExploring(false);
      
      if (!island.discovered) {
        setDiscoveredIslands(prev => [...prev, islandId]);
        toast({
          title: "New Island Discovered!",
          description: `You've discovered ${island.name}!`,
        });
      } else {
        const randomResource = island.resources[Math.floor(Math.random() * island.resources.length)];
        const resourceAmount = Math.floor(Math.random() * 5) + 1;
        toast({
          title: "Exploration Complete!",
          description: `You found ${resourceAmount}x ${randomResource}!`,
        });
      }
    }, 4000);
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={onBack} className="anime-slide-up">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hub
            </Button>
            <h1 className="text-4xl font-bold anime-slide-up">Island Explorer</h1>
          </div>

          {/* Exploration Progress */}
          {isExploring && selectedIsland && (
            <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">Exploring...</h3>
                  <p className="text-muted-foreground">
                    {islands.find(i => i.id === selectedIsland)?.name}
                  </p>
                </div>
                <Progress value={75} className="h-3" />
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Searching for treasures and secrets...
                </p>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Map className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{discoveredIslands.length}</div>
                <div className="text-sm text-muted-foreground">Islands Discovered</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Gem className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{Math.floor(Math.random() * 50) + 10}</div>
                <div className="text-sm text-muted-foreground">Treasures Found</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Compass className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{profile?.level || 1}</div>
                <div className="text-sm text-muted-foreground">Explorer Level</div>
              </CardContent>
            </Card>
          </div>

          {/* Islands Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {islands.map((island, index) => (
              <Card 
                key={island.id}
                className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-glow transition-epic anime-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 flex items-center gap-2">
                        <Anchor className="h-5 w-5" />
                        {island.name}
                        {island.discovered && <Star className="h-4 w-4 text-yellow-500" />}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getDifficultyColor(island.difficulty)}>
                          {island.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          Level {island.level_requirement}+
                        </Badge>
                        {island.discovered && (
                          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                            Discovered
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {island.description}
                  </p>

                  {/* Resources */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Resources:</h4>
                    <div className="flex flex-wrap gap-1">
                      {island.resources.map((resource) => (
                        <Badge key={resource} variant="secondary" className="text-xs">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Cost and Button */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{island.exploration_cost} Gold</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    disabled={
                      isExploring || 
                      (profile?.level || 0) < island.level_requirement ||
                      (profile?.gold || 0) < island.exploration_cost
                    }
                    onClick={() => handleExploreIsland(island.id)}
                  >
                    {isExploring && selectedIsland === island.id ? "Exploring..." :
                     island.discovered ? "Explore Again" : "Discover Island"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};