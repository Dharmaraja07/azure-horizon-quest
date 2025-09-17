-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  experience INTEGER NOT NULL DEFAULT 0,
  gold INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create characters table
CREATE TABLE public.characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id TEXT NOT NULL, -- references the character template
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  experience INTEGER NOT NULL DEFAULT 0,
  strength INTEGER NOT NULL DEFAULT 70,
  agility INTEGER NOT NULL DEFAULT 70,
  defense INTEGER NOT NULL DEFAULT 70,
  energy INTEGER NOT NULL DEFAULT 70,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crew members table  
CREATE TABLE public.crew_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  experience INTEGER NOT NULL DEFAULT 0,
  strength INTEGER NOT NULL DEFAULT 50,
  agility INTEGER NOT NULL DEFAULT 50,
  defense INTEGER NOT NULL DEFAULT 50,
  energy INTEGER NOT NULL DEFAULT 50,
  specialty TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  recruitment_cost INTEGER NOT NULL DEFAULT 500,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quests table
CREATE TABLE public.quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'legendary')),
  reward_experience INTEGER NOT NULL DEFAULT 100,
  reward_gold INTEGER NOT NULL DEFAULT 100,
  requirements JSONB NOT NULL DEFAULT '{}',
  is_story_quest BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user quest progress table
CREATE TABLE public.user_quest_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in_progress', 'completed', 'failed')),
  progress JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Create islands table for exploration
CREATE TABLE public.islands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  level_requirement INTEGER NOT NULL DEFAULT 1,
  coordinates JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}',
  resources JSONB NOT NULL DEFAULT '[]',
  is_discovered BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user island discoveries
CREATE TABLE public.user_island_discoveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  island_id UUID NOT NULL REFERENCES public.islands(id) ON DELETE CASCADE,
  discovered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, island_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.islands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_island_discoveries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for characters
CREATE POLICY "Users can view their own characters" ON public.characters
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own characters" ON public.characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters" ON public.characters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters" ON public.characters
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for crew members
CREATE POLICY "Users can view their own crew" ON public.crew_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can recruit crew members" ON public.crew_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their crew" ON public.crew_members
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can dismiss crew members" ON public.crew_members
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for quests (public read)
CREATE POLICY "Anyone can view quests" ON public.quests
  FOR SELECT USING (true);

-- Create RLS policies for user quest progress
CREATE POLICY "Users can view their own quest progress" ON public.user_quest_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quest progress" ON public.user_quest_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quest progress" ON public.user_quest_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for islands (public read)
CREATE POLICY "Anyone can view islands" ON public.islands
  FOR SELECT USING (true);

-- Create RLS policies for user island discoveries
CREATE POLICY "Users can view their own discoveries" ON public.user_island_discoveries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own discoveries" ON public.user_island_discoveries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON public.characters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crew_members_updated_at
  BEFORE UPDATE ON public.crew_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', 'Captain_' || substr(NEW.id::text, 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert some default quests
INSERT INTO public.quests (title, description, difficulty, reward_experience, reward_gold, is_story_quest) VALUES
('The First Adventure', 'Begin your journey as a pirate captain. Recruit your first crew member and set sail!', 'easy', 200, 300, true),
('Treasure Hunt', 'Search for buried treasure on a mysterious island. Beware of ancient guardians!', 'medium', 500, 750, false),
('Storm Navigation', 'Navigate through a dangerous storm to reach the next island. Test your seamanship!', 'medium', 400, 600, false),
('The Sea King''s Challenge', 'Face off against a legendary sea creature in epic combat!', 'hard', 1000, 1500, false),
('Ancient Ruins', 'Explore mysterious ruins and uncover the secrets of an ancient civilization.', 'hard', 800, 1200, false),
('The Pirate King''s Legacy', 'Follow clues to discover a legendary treasure that could change everything.', 'legendary', 2000, 5000, true);

-- Insert some default islands
INSERT INTO public.islands (name, description, level_requirement, coordinates, resources) VALUES
('Windward Port', 'A bustling port town where your adventure begins. Perfect for new captains.', 1, '{"x": 0, "y": 0}', '["wood", "food", "basic_supplies"]'),
('Coral Bay', 'A tropical paradise with crystal clear waters and hidden caves.', 3, '{"x": 100, "y": 50}', '["pearls", "coral", "tropical_fruits"]'),
('Storm Island', 'A dangerous island constantly battered by storms, but rich in rare minerals.', 5, '{"x": -80, "y": 120}', '["iron_ore", "storm_crystals", "rare_metals"]'),
('Ancient Atoll', 'Mysterious ruins dot this island, holding secrets of a lost civilization.', 8, '{"x": 200, "y": -100}', '["ancient_artifacts", "mystical_stones", "old_texts"]'),
('Dragon''s Lair', 'A volcanic island said to be home to legendary sea dragons.', 15, '{"x": -150, "y": -200}', '["dragon_scales", "volcanic_glass", "fire_crystals"]');