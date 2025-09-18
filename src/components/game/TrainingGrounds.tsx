import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Swords, Shield, Zap, Target, Trophy } from "lucide-react";
import { useState } from "react";
import { useCharacters, useProfile } from "@/hooks/useGameData";
import { useToast } from "@/hooks/use-toast";

interface TrainingGroundsProps {
  onBack: () => void;
}

export const TrainingGrounds = ({ onBack }: TrainingGroundsProps) => {
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const { data: characters = [] } = useCharacters();
  const { data: profile } = useProfile();
  const { toast } = useToast();

  const activeCharacter = characters.find(char => char.is_active);

  const trainingOptions = [
    {
      id: "strength",
      name: "Strength Training",
      description: "Increase your physical power and combat damage",
      icon: <Swords className="h-6 w-6" />,
      cost: 100,
      statBoost: "strength",
      color: "bg-red-500/20 text-red-400 border-red-500/30"
    },
    {
      id: "defense",
      name: "Defense Training", 
      description: "Improve your armor and damage resistance",
      icon: <Shield className="h-6 w-6" />,
      cost: 100,
      statBoost: "defense",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    {
      id: "agility",
      name: "Agility Training",
      description: "Enhance your speed and critical hit chance",
      icon: <Target className="h-6 w-6" />,
      cost: 100,
      statBoost: "agility",
      color: "bg-green-500/20 text-green-400 border-green-500/30"
    },
    {
      id: "energy",
      name: "Energy Training",
      description: "Boost your stamina and special ability power",
      icon: <Zap className="h-6 w-6" />,
      cost: 100,
      statBoost: "energy",
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    }
  ];

  const handleStartTraining = async (trainingType: string) => {
    if (!activeCharacter || !profile) return;

    const training = trainingOptions.find(t => t.id === trainingType);
    if (!training) return;

    if (profile.gold < training.cost) {
      toast({
        title: "Insufficient Gold",
        description: `You need ${training.cost} gold for this training.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedTraining(trainingType);
    setIsTraining(true);

    // Simulate training time
    setTimeout(() => {
      setIsTraining(false);
      toast({
        title: "Training Complete!",
        description: `Your ${training.statBoost} has improved!`,
      });
    }, 3000);
  };

  if (!activeCharacter) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Active Character</h2>
            <p className="text-muted-foreground mb-6">
              You need to create and select a character first.
            </p>
            <Button onClick={onBack}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold anime-slide-up">Training Grounds</h1>
          </div>

          {/* Character Stats */}
          <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {activeCharacter.name} - Level {activeCharacter.level}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{activeCharacter.strength}</div>
                  <div className="text-sm text-muted-foreground">Strength</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{activeCharacter.defense}</div>
                  <div className="text-sm text-muted-foreground">Defense</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{activeCharacter.agility}</div>
                  <div className="text-sm text-muted-foreground">Agility</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{activeCharacter.energy}</div>
                  <div className="text-sm text-muted-foreground">Energy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Progress */}
          {isTraining && selectedTraining && (
            <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">Training in Progress...</h3>
                  <p className="text-muted-foreground">
                    {trainingOptions.find(t => t.id === selectedTraining)?.name}
                  </p>
                </div>
                <Progress value={66} className="h-3" />
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Please wait while your character trains...
                </p>
              </CardContent>
            </Card>
          )}

          {/* Training Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainingOptions.map((training, index) => (
              <Card 
                key={training.id}
                className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-glow transition-epic anime-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${training.color}`}>
                        {training.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{training.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            +{Math.floor(Math.random() * 5) + 3} {training.statBoost}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Cost</div>
                      <div className="text-lg font-bold text-yellow-500">{training.cost} Gold</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {training.description}
                  </p>
                  
                  <Button 
                    className="w-full" 
                    disabled={isTraining || (profile?.gold || 0) < training.cost}
                    onClick={() => handleStartTraining(training.id)}
                  >
                    {isTraining ? "Training..." : "Start Training"}
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