import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export const useCompleteQuest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (questId: string) => {
      if (!user) throw new Error('Not authenticated');

      // Complete the quest
      const { data: questProgress, error: questError } = await supabase
        .from('user_quest_progress')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          progress: { completed: true }
        })
        .eq('user_id', user.id)
        .eq('quest_id', questId)
        .select('*, quest:quests(*)')
        .single();

      if (questError) throw questError;

      // Get quest details for rewards
      const quest = questProgress.quest;
      if (!quest) throw new Error('Quest not found');

      // Update profile with rewards
      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      const newExperience = currentProfile.experience + quest.reward_experience;
      const newGold = currentProfile.gold + quest.reward_gold;
      const newLevel = Math.floor(newExperience / 1000) + 1; // Level up every 1000 XP

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          experience: newExperience,
          gold: newGold,
          level: newLevel
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      return { questProgress, quest, rewards: { experience: quest.reward_experience, gold: quest.reward_gold, levelUp: newLevel > currentProfile.level } };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user_quest_progress'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast({
        title: "Quest Completed! 🎉",
        description: `Gained ${data.rewards.experience} XP and ${data.rewards.gold} Gold${data.rewards.levelUp ? ' • LEVEL UP!' : ''}`,
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to complete quest",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
};

export const useAbandonQuest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (questId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_quest_progress')
        .update({
          status: 'available',
          started_at: null,
          progress: {}
        })
        .eq('user_id', user.id)
        .eq('quest_id', questId);

      if (error) throw error;
      return questId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_quest_progress'] });
      toast({
        title: "Quest Abandoned",
        description: "You can start this quest again later.",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to abandon quest",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
};