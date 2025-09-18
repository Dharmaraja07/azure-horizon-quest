import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Map, Clock, Trophy, Star, Coins, Zap, X } from "lucide-react";
import { useState } from "react";
import { useQuests, useUserQuestProgress, useStartQuest } from "@/hooks/useGameData";
import { useCompleteQuest, useAbandonQuest } from "@/hooks/useQuestSystem";

type QuestCategory = "all" | "story" | "easy" | "medium" | "hard" | "legendary" | "available" | "completed";

interface QuestBrowserProps {
  onBack: () => void;
}

export const QuestBrowser = ({ onBack }: QuestBrowserProps) => {
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory>("all");
  const { data: quests = [] } = useQuests();
  const { data: questProgress = [] } = useUserQuestProgress();
  const startQuestMutation = useStartQuest();
  const completeQuestMutation = useCompleteQuest();
  const abandonQuestMutation = useAbandonQuest();

  const getQuestStatus = (questId: string) => {
    const progress = questProgress.find(p => p.quest_id === questId);
    return progress?.status || 'available';
  };

  const handleStartQuest = async (questId: string) => {
    await startQuestMutation.mutateAsync(questId);
  };

  const handleCompleteQuest = async (questId: string) => {
    await completeQuestMutation.mutateAsync(questId);
  };

  const handleAbandonQuest = async (questId: string) => {
    await abandonQuestMutation.mutateAsync(questId);
  };

  const filteredQuests = quests.filter(quest => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "story") return quest.is_story_quest;
    if (selectedCategory === "available") return getQuestStatus(quest.id) === "available";
    if (selectedCategory === "completed") return getQuestStatus(quest.id) === "completed";
    return quest.difficulty === selectedCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "hard": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "legendary": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-primary/20 text-primary border-primary/30";
      case "in_progress": return "bg-accent/20 text-accent border-accent/30";
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

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
            <h1 className="text-4xl font-bold anime-slide-up">Quest Board</h1>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(["all", "story", "available", "completed", "easy", "medium", "hard", "legendary"] as QuestCategory[]).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize anime-slide-up"
              >
                {category === "all" ? "All Quests" : category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredQuests.map((quest, index) => {
              const status = getQuestStatus(quest.id);
              const progress = questProgress.find(p => p.quest_id === quest.id);
              
              return (
                <Card 
                  key={quest.id} 
                  className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-glow transition-epic anime-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 flex items-center gap-2">
                          <Map className="h-5 w-5" />
                          {quest.title}
                          {quest.is_story_quest && <Star className="h-4 w-4 text-yellow-500" />}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getDifficultyColor(quest.difficulty)}>
                            {quest.difficulty}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {quest.description}
                    </p>

                    {status === "in_progress" && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>In Progress</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            onClick={() => handleCompleteQuest(quest.id)}
                            disabled={completeQuestMutation.isPending}
                          >
                            Complete Quest
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAbandonQuest(quest.id)}
                            disabled={abandonQuestMutation.isPending}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Abandon
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Rewards */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-blue-500" />
                          <span>{quest.reward_experience} XP</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-yellow-500" />
                          <span>{quest.reward_gold} Gold</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      variant={status === "available" ? "default" : status === "completed" ? "secondary" : "outline"}
                      disabled={status === "completed" || startQuestMutation.isPending || completeQuestMutation.isPending || abandonQuestMutation.isPending}
                      onClick={() => status === "available" && handleStartQuest(quest.id)}
                    >
                      {startQuestMutation.isPending ? "Starting..." :
                       completeQuestMutation.isPending ? "Completing..." :
                       abandonQuestMutation.isPending ? "Abandoning..." :
                       status === "available" ? "Start Quest" :
                       status === "in_progress" ? "In Progress" :
                       status === "completed" ? "✓ Completed" : "Locked"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}

            {filteredQuests.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Quests Available</h3>
                <p className="text-muted-foreground">Check back later for new adventures!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};