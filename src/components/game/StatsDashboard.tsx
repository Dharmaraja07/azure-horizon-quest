import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Sword, Shield, Zap, Heart, Trophy, Coins, Target, Star } from "lucide-react";
import { useProfile, useCharacters } from "@/hooks/useGameData";

interface StatsDashboardProps {
  onBack: () => void;
}

export const StatsDashboard = ({ onBack }: StatsDashboardProps) => {
  const { data: profile } = useProfile();
  const { data: characters = [] } = useCharacters();
  
  const activeCharacter = characters.find(char => char.is_active);
  
  // Calculate stats (these would normally come from database)
  const stats = {
    battlesWon: 0,
    battlesLost: 0,
    questsCompleted: 0,
    islandsDiscovered: 1,
    totalDamageDealt: 0,
    totalGoldEarned: profile?.gold || 0,
    totalExperience: profile?.experience || 0,
    highestLevel: profile?.level || 1,
    equipmentOwned: 0,
    achievementsUnlocked: 0
  };

  const winRate = stats.battlesWon + stats.battlesLost > 0 
    ? Math.round((stats.battlesWon / (stats.battlesWon + stats.battlesLost)) * 100) 
    : 0;

  const nextLevelXP = (profile?.level || 1) * 1000;
  const currentLevelProgress = ((profile?.experience || 0) % 1000) / 10;

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
            <h1 className="text-4xl font-bold anime-slide-up">Stats Dashboard</h1>
          </div>

          {/* Profile Overview */}
          {profile && (
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Player Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Level</div>
                    <div className="text-3xl font-bold">{profile.level}</div>
                    <div className="mt-2">
                      <Progress value={currentLevelProgress} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">
                        {profile.experience} / {nextLevelXP} XP
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Gold</div>
                    <div className="text-3xl font-bold text-yellow-500 flex items-center gap-2">
                      <Coins className="h-6 w-6" />
                      {profile.gold.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
                    <div className="text-3xl font-bold text-green-500">{winRate}%</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {stats.battlesWon} wins / {stats.battlesLost} losses
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Character Stats */}
          {activeCharacter && (
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sword className="h-5 w-5" />
                  Active Character: {activeCharacter.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Sword className="h-6 w-6 mx-auto mb-2 text-red-400" />
                    <div className="text-2xl font-bold">{activeCharacter.strength}</div>
                    <div className="text-xs text-muted-foreground">Strength</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl font-bold">{activeCharacter.defense}</div>
                    <div className="text-xs text-muted-foreground">Defense</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
                    <div className="text-2xl font-bold">{activeCharacter.agility}</div>
                    <div className="text-xs text-muted-foreground">Agility</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Heart className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                    <div className="text-2xl font-bold">{activeCharacter.energy}</div>
                    <div className="text-xs text-muted-foreground">Energy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Combat Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Battles Won</span>
                  <span className="font-semibold">{stats.battlesWon}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Battles Lost</span>
                  <span className="font-semibold">{stats.battlesLost}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Damage</span>
                  <span className="font-semibold">{stats.totalDamageDealt.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Quest Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quests Completed</span>
                  <span className="font-semibold">{stats.questsCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Islands Discovered</span>
                  <span className="font-semibold">{stats.islandsDiscovered}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Achievements</span>
                  <span className="font-semibold">{stats.achievementsUnlocked}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progression
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Experience</span>
                  <span className="font-semibold">{stats.totalExperience.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Gold Earned</span>
                  <span className="font-semibold">{stats.totalGoldEarned.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Equipment Owned</span>
                  <span className="font-semibold">{stats.equipmentOwned}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

