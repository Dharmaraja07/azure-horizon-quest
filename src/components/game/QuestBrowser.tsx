import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Map, Clock, Users, Trophy, Coins, Zap } from "lucide-react";
import { useState } from "react";

interface Quest {
  id: string;
  title: string;
  description: string;
  location: string;
  difficulty: "easy" | "medium" | "hard" | "legendary";
  duration: string;
  requiredCrew: number;
  rewards: {
    experience: number;
    gold: number;
    items?: string[];
  };
  requirements: string[];
  status: "available" | "in-progress" | "completed";
  questType: "story" | "exploration" | "combat" | "treasure";
}

const quests: Quest[] = [
  {
    id: "crimson-tide",
    title: "The Crimson Tide Mystery",
    description: "Strange red waters have appeared near the Coral Islands. Local fishermen report seeing ghostly ships in the mist. Investigate this supernatural phenomenon and uncover its dark secrets.",
    location: "Coral Islands",
    difficulty: "legendary",
    duration: "3-4 hours",
    requiredCrew: 4,
    rewards: {
      experience: 2500,
      gold: 5000,
      items: ["Ancient Navigator's Compass", "Crimson Pearl", "Ghost Ship Blueprint"]
    },
    requirements: ["Level 15+", "Navigator", "Combat Specialist"],
    status: "available",
    questType: "story"
  },
  {
    id: "treasure-cove",
    title: "Lost Treasure of Captain Blackwater",
    description: "An old treasure map has surfaced, leading to the legendary hoard of Captain Blackwater. Navigate treacherous waters and solve ancient puzzles to claim the prize.",
    location: "Skeleton Bay",
    difficulty: "hard",
    duration: "2-3 hours",
    requiredCrew: 3,
    rewards: {
      experience: 1800,
      gold: 3500,
      items: ["Blackwater's Cutlass", "Treasure Map Fragment", "Gold Doubloons"]
    },
    requirements: ["Level 12+", "Treasure Hunter", "Strong Combat Skills"],
    status: "available",
    questType: "treasure"
  },
  {
    id: "storm-islands",
    title: "Expedition to the Storm Islands",
    description: "Chart the unexplored Storm Islands and discover new trade routes. Face dangerous weather and hostile wildlife in this challenging exploration mission.",
    location: "Storm Islands",
    difficulty: "medium",
    duration: "1-2 hours",
    requiredCrew: 2,
    rewards: {
      experience: 1200,
      gold: 2000,
      items: ["Weather Chart", "Storm Crystal"]
    },
    requirements: ["Level 8+", "Navigator", "Weather Experience"],
    status: "in-progress",
    questType: "exploration"
  },
  {
    id: "sea-monster",
    title: "The Leviathan's Challenge",
    description: "A massive sea creature has been attacking merchant vessels. Accept the bounty to hunt down this legendary beast and make the seas safe again.",
    location: "Deep Ocean",
    difficulty: "legendary",
    duration: "4-5 hours",
    requiredCrew: 4,
    rewards: {
      experience: 3000,
      gold: 6000,
      items: ["Leviathan Scale Armor", "Beast Hunter Title", "Epic Harpoon"]
    },
    requirements: ["Level 18+", "Master Combat", "Legendary Crew"],
    status: "available",
    questType: "combat"
  },
  {
    id: "merchant-escort",
    title: "Merchant Convoy Escort",
    description: "Escort a wealthy merchant convoy through pirate-infested waters. Protect the ships and ensure safe delivery for generous rewards.",
    location: "Trade Routes",
    difficulty: "easy",
    duration: "30-60 minutes",
    requiredCrew: 2,
    rewards: {
      experience: 600,
      gold: 1000,
      items: ["Merchant's Favor", "Trade Goods"]
    },
    requirements: ["Level 5+", "Basic Combat"],
    status: "available",
    questType: "exploration"
  }
];

interface QuestBrowserProps {
  onBack: () => void;
}

export const QuestBrowser = ({ onBack }: QuestBrowserProps) => {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const getDifficultyColor = (difficulty: Quest["difficulty"]) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "hard": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "legendary": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: Quest["status"]) => {
    switch (status) {
      case "available": return "bg-primary/20 text-primary border-primary/30";
      case "in-progress": return "bg-accent/20 text-accent border-accent/30";
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: Quest["questType"]) => {
    switch (type) {
      case "story": return <Zap className="h-4 w-4" />;
      case "exploration": return <Map className="h-4 w-4" />;
      case "combat": return <Trophy className="h-4 w-4" />;
      case "treasure": return <Coins className="h-4 w-4" />;
      default: return <Map className="h-4 w-4" />;
    }
  };

  const filteredQuests = filter === "all" ? quests : quests.filter(quest => quest.questType === filter);

  return (
    <div className="min-h-screen gradient-hero">
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack} className="anime-slide-up">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hub
              </Button>
              <h1 className="text-4xl font-bold anime-slide-up">Quest Board</h1>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["all", "story", "exploration", "combat", "treasure"].map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "outline"}
                onClick={() => setFilter(filterType)}
                className="capitalize anime-slide-up"
              >
                {filterType === "all" ? "All Quests" : filterType}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Quest List */}
            <div className="xl:col-span-2">
              <div className="space-y-4">
                {filteredQuests.map((quest, index) => (
                  <Card
                    key={quest.id}
                    className={`group cursor-pointer transition-epic hover:scale-[1.02] hover:shadow-glow border-border/50 bg-card/80 backdrop-blur-sm anime-slide-up ${
                      selectedQuest?.id === quest.id ? "ring-2 ring-primary shadow-glow" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedQuest(quest)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="gradient-adventure w-12 h-12 rounded-lg flex items-center justify-center">
                            {getTypeIcon(quest.questType)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold group-hover:text-primary transition-smooth">
                              {quest.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">{quest.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Badge className={getDifficultyColor(quest.difficulty)} variant="outline">
                            {quest.difficulty}
                          </Badge>
                          <Badge className={getStatusColor(quest.status)} variant="outline">
                            {quest.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {quest.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{quest.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{quest.requiredCrew} crew</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          <span>{quest.rewards.experience} XP</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          <span>{quest.rewards.gold} gold</span>
                        </div>
                      </div>

                      {quest.rewards.items && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {quest.rewards.items.slice(0, 2).map((item) => (
                            <Badge key={item} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                          {quest.rewards.items.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{quest.rewards.items.length - 2} items
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quest Details */}
            <div className="xl:col-span-1">
              {selectedQuest ? (
                <Card className="sticky top-8 bg-card/80 backdrop-blur-sm border-border/50 anime-fade-in">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="gradient-adventure w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3">
                        {getTypeIcon(selectedQuest.questType)}
                      </div>
                      <h2 className="text-xl font-bold mb-2">{selectedQuest.title}</h2>
                      <p className="text-muted-foreground">{selectedQuest.location}</p>
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <Badge className={getDifficultyColor(selectedQuest.difficulty)} variant="outline">
                          {selectedQuest.difficulty}
                        </Badge>
                        <Badge className={getStatusColor(selectedQuest.status)} variant="outline">
                          {selectedQuest.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Description */}
                      <div>
                        <h3 className="font-semibold mb-2">Mission Brief</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {selectedQuest.description}
                        </p>
                      </div>

                      {/* Quest Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <div className="font-semibold">{selectedQuest.duration}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Required Crew:</span>
                          <div className="font-semibold">{selectedQuest.requiredCrew} members</div>
                        </div>
                      </div>

                      {/* Requirements */}
                      <div>
                        <h3 className="font-semibold mb-2">Requirements</h3>
                        <div className="space-y-1">
                          {selectedQuest.requirements.map((req) => (
                            <div key={req} className="p-2 rounded bg-muted/50 text-sm">
                              {req}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rewards */}
                      <div>
                        <h3 className="font-semibold mb-2">Rewards</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 rounded bg-primary/10">
                            <span className="text-sm">Experience</span>
                            <span className="font-semibold text-primary">
                              {selectedQuest.rewards.experience} XP
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded bg-accent/10">
                            <span className="text-sm">Gold</span>
                            <span className="font-semibold text-accent">
                              {selectedQuest.rewards.gold} coins
                            </span>
                          </div>
                          {selectedQuest.rewards.items && (
                            <div>
                              <span className="text-sm text-muted-foreground">Items:</span>
                              <div className="space-y-1 mt-1">
                                {selectedQuest.rewards.items.map((item) => (
                                  <div key={item} className="p-1 rounded bg-muted/30 text-xs">
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4">
                        {selectedQuest.status === "available" && (
                          <Button className="w-full anime-pulse" size="lg">
                            Accept Quest
                          </Button>
                        )}
                        {selectedQuest.status === "in-progress" && (
                          <Button className="w-full" variant="outline" size="lg">
                            Continue Quest
                          </Button>
                        )}
                        {selectedQuest.status === "completed" && (
                          <Button className="w-full" variant="secondary" size="lg" disabled>
                            Quest Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="sticky top-8 bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="text-muted-foreground">
                      <Map className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a quest to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};