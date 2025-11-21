import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  level: number;
  experience: number;
  gold: number;
}

export interface GameCharacter {
  id: string;
  user_id: string;
  character_id: string;
  name: string;
  level: number;
  experience: number;
  strength: number;
  agility: number;
  defense: number;
  energy: number;
  is_active: boolean;
}

export interface CrewMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
  level: number;
  experience: number;
  strength: number;
  agility: number;
  defense: number;
  energy: number;
  specialty: string;
  is_active: boolean;
  recruitment_cost: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  reward_experience: number;
  reward_gold: number;
  requirements: Record<string, unknown>;
  is_story_quest: boolean;
}

export interface UserQuestProgress {
  id: string;
  user_id: string;
  quest_id: string;
  status: 'available' | 'in_progress' | 'completed' | 'failed';
  progress: Record<string, unknown>;
  started_at?: string;
  completed_at?: string;
  quest?: Quest;
}

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });
};

export const useCharacters = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['characters', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (error) throw error;
      return data as GameCharacter[];
    },
    enabled: !!user,
  });
};

export const useCrewMembers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['crew_members', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('crew_members')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (error) throw error;
      return data as CrewMember[];
    },
    enabled: !!user,
  });
};

export const useQuests = () => {
  return useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .order('difficulty', { ascending: true });

      if (error) throw error;
      return data as Quest[];
    },
  });
};

export const useUserQuestProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user_quest_progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_quest_progress')
        .select(`
          *,
          quest:quests(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as UserQuestProgress[];
    },
    enabled: !!user,
  });
};

export const useCreateCharacter = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (characterData: {
      character_id: string;
      name: string;
      strength?: number;
      agility?: number;
      defense?: number;
      energy?: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // First set all other characters as inactive
      await supabase
        .from('characters')
        .update({ is_active: false })
        .eq('user_id', user.id);

      const { data, error } = await supabase
        .from('characters')
        .insert({
          user_id: user.id,
          character_id: characterData.character_id,
          name: characterData.name,
          strength: characterData.strength || 70,
          agility: characterData.agility || 70,
          defense: characterData.defense || 70,
          energy: characterData.energy || 70,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      toast({
        title: "Character created!",
        description: "Your legendary character has joined your crew.",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to create character",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
};

export const useRecruitCrewMember = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (crewData: {
      name: string;
      role: string;
      specialty: string;
      recruitment_cost?: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('crew_members')
        .insert({
          user_id: user.id,
          name: crewData.name,
          role: crewData.role,
          specialty: crewData.specialty,
          recruitment_cost: crewData.recruitment_cost || 500,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crew_members'] });
      toast({
        title: "Crew member recruited!",
        description: "A new member has joined your crew.",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to recruit crew member",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
};

export const useStartQuest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (questId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_quest_progress')
        .upsert({
          user_id: user.id,
          quest_id: questId,
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_quest_progress'] });
      toast({
        title: "Quest started!",
        description: "Your adventure begins now.",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to start quest",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
};