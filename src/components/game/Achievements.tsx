import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Star, Target, Zap, Sword, Shield, Coins } from "lucide-react";
import { useProfile } from "@/hooks/useGameData";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "combat" | "quest" | "exploration" | "collection";
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  reward: {
    gold?: number;
    experience?: number;
  };
  unlocked: boolean;
}

interface AchievementsProps {
  onBack: () => void;
}

const achievements: Achievement[] = [
  {
    id: "first_blood",
    name: "First Blood",
    description: "Win your first battle",
    icon: <Sword className="h-5 w-5" />,
    category: "combat",
    rarity: "common",
    progress: 0,
    maxProgress: 1,
    reward: { gold: 100, experience: 50 },
    unlocked: false
  },
  {
    id: "warrior",
    name: "Warrior",
    description: "Win 10 battles",
    icon: <Sword className="h-5 w-5" />,
    category: "combat",
    rarity: "rare",
    progress: 0,
    maxProgress: 10,
    reward: { gold: 500, experience: 200 },
    unlocked: false
  },
  {
    id: "champion",
    name: "Champion",
    description: "Win 50 battles",
    icon: <Trophy className="h-5 w-5" />,
    category: "combat",
    rarity: "epic",
    progress: 0,
    maxProgress: 50,
    reward: { gold: 2000, experience: 1000 },
    unlocked: false
  },
  {
    id: "boss_slayer",
    name: "Boss Slayer",
    description: "Defeat 5 boss enemies",
    icon: <Target className="h-5 w-5" />,
    category: "combat",
    rarity: "legendary",
    progress: 0,
    maxProgress: 5,
    reward: { gold: 5000, experience: 2500 },
    unlocked: false
  },
  {
    id: "quest_master",
    name: "Quest Master",
    description: "Complete 20 quests",
    icon: <Star className="h-5 w-5" />,
    category: "quest",
    rarity: "epic",
    progress: 0,
    maxProgress: 20,
    reward: { gold: 3000, experience: 1500 },
    unlocked: false
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Discover 5 islands",
    icon: <Zap className="h-5 w-5" />,
    category: "exploration",
    rarity: "rare",
    progress: 0,
    maxProgress: 5,
    reward: { gold: 1000, experience: 500 },
    unlocked: false
  },
  {
    id: "collector",
    name: "Collector",
    description: "Own 10 pieces of equipment",
    icon: <Shield className="h-5 w-5" />,
    category: "collection",
    rarity: "rare",
    progress: 0,
    maxProgress: 10,
    reward: { gold: 1500, experience: 750 },
    unlocked: false
  },
  {
    id: "legendary_collector",
    name: "Legendary Collector",
    description: "Own 5 legendary items",
    icon: <Trophy className="h-5 w-5" />,
    category: "collection",
    rarity: "legendary",
    progress: 0,
    maxProgress: 5,
    reward: { gold: 10000, experience: 5000 },
    unlocked: false
  },
  {
    id: "wealthy",
    name: "Wealthy",
    description: "Accumulate 10,000 gold",
    icon: <Coins className="h-5 w-5" />,
    category: "collection",
    rarity: "epic",
    progress: 0,
    maxProgress: 10000,
    reward: { gold: 2000, experience: 1000 },
    unlocked: false
  },
  {
    id: "level_master",
    name: "Level Master",
    description: "Reach level 20",
    icon: <Star className="h-5 w-5" />,
    category: "quest",
    rarity: "legendary",
    progress: 0,
    maxProgress: 20,
    reward: { gold: 5000, experience: 2500 },
    unlocked: false
  }
];

export const Achievements = ({ onBack }: AchievementsProps) => {
  const { data: profile } = useProfile();
  const { toast } = useToast();

  // Update progress based on profile (this would normally come from database)
  const updatedAchievements = achievements.map(achievement => {
    if (achievement.id === "wealthy") {
      return { ...achievement, progress: Math.min(profile?.gold || 0, achievement.maxProgress) };
    }
    if (achievement.id === "level_master") {
      return { ...achievement, progress: Math.min(profile?.level || 0, achievement.maxProgress) };
    }
    return achievement;
  });

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "legendary": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "epic": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "rare": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getCategoryColor = (category: Achievement["category"]) => {
    switch (category) {
      case "combat": return "bg-red-500/20 text-red-400";
      case "quest": return "bg-blue-500/20 text-blue-400";
      case "exploration": return "bg-green-500/20 text-green-400";
      case "collection": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleClaimReward = (achievement: Achievement) => {
    if (achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
      toast({
        title: "Achievement Unlocked! 🎉",
        description: `You earned ${achievement.reward.gold || 0} gold and ${achievement.reward.experience || 0} XP!`,
      });
    }
  };

  const unlockedCount = updatedAchievements.filter(a => a.progress >= a.maxProgress).length;
  const totalProgress = updatedAchievements.reduce((sum, a) => sum + (a.progress / a.maxProgress), 0) / updatedAchievements.length;

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
            <h1 className="text-4xl font-bold anime-slide-up">Achievements</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{unlockedCount}</div>
                <div className="text-sm text-muted-foreground">Unlocked</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{updatedAchievements.length}</div>
                <div className="text-sm text-muted-foreground">Total Achievements</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{Math.round(totalProgress * 100)}%</div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {updatedAchievements.map((achievement, index) => {
              const isUnlocked = achievement.progress >= achievement.maxProgress;
              const progressPercent = (achievement.progress / achievement.maxProgress) * 100;

              return (
                <Card
                  key={achievement.id}
                  className={`bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-glow transition-epic anime-slide-up ${
                    isUnlocked ? "ring-2 ring-accent" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getCategoryColor(achievement.category)}`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{achievement.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                            <Badge variant="outline" className={getCategoryColor(achievement.category)}>
                              {achievement.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {isUnlocked && (
                        <Trophy className="h-6 w-6 text-yellow-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {achievement.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress} / {achievement.maxProgress}</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        {achievement.reward.gold && (
                          <div className="flex items-center gap-1">
                            <Coins className="h-4 w-4 text-yellow-500" />
                            <span>{achievement.reward.gold}</span>
                          </div>
                        )}
                        {achievement.reward.experience && (
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-blue-500" />
                            <span>{achievement.reward.experience} XP</span>
                          </div>
                        )}
                      </div>
                      {isUnlocked && (
                        <Button size="sm" onClick={() => handleClaimReward(achievement)}>
                          Claim Reward
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

