import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ship, Users, Map, Settings, Trophy, Sword } from "lucide-react";
import { CharacterSelection } from "./CharacterSelection";
import { CrewManagement } from "./CrewManagement";
import { QuestBrowser } from "./QuestBrowser";
import heroImage from "@/assets/hero-banner.jpg";

type GameSection = "hub" | "character" | "crew" | "quests" | "settings";

export const GameHub = () => {
  const [activeSection, setActiveSection] = useState<GameSection>("hub");

  const renderSection = () => {
    switch (activeSection) {
      case "character":
        return <CharacterSelection onBack={() => setActiveSection("hub")} />;
      case "crew":
        return <CrewManagement onBack={() => setActiveSection("hub")} />;
      case "quests":
        return <QuestBrowser onBack={() => setActiveSection("hub")} />;
      default:
        return (
          <div className="min-h-screen gradient-hero">
            {/* Epic Hero Section */}
            <div className="relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
              
              <div className="relative z-10 px-6 pt-20 pb-32">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="anime-slide-up">
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white drop-shadow-2xl">
                      Ocean's Edge
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg">
                      Embark on an epic adventure across mystical islands. Build your crew, master legendary powers, and become the ultimate sea legend.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <Button size="lg" className="anime-pulse text-lg px-8 py-6 shadow-epic">
                      <Ship className="mr-2 h-5 w-5" />
                      Start Adventure
                    </Button>
                    <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20">
                      <Trophy className="mr-2 h-5 w-5" />
                      View Achievements
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Sections Grid */}
            <div className="px-6 pb-20">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Choose Your Path</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <GameSectionCard
                    title="Characters"
                    description="Create and customize your legendary adventurer"
                    icon={<Users className="h-8 w-8" />}
                    onClick={() => setActiveSection("character")}
                    gradient="gradient-ocean"
                  />
                  
                  <GameSectionCard
                    title="Crew Management"
                    description="Recruit and train your trusted companions"
                    icon={<Ship className="h-8 w-8" />}
                    onClick={() => setActiveSection("crew")}
                    gradient="gradient-sunset"
                  />
                  
                  <GameSectionCard
                    title="Quest Board"
                    description="Discover thrilling adventures and epic battles"
                    icon={<Map className="h-8 w-8" />}
                    onClick={() => setActiveSection("quests")}
                    gradient="gradient-adventure"
                  />
                  
                  <GameSectionCard
                    title="Training Grounds"
                    description="Master combat techniques and special abilities"
                    icon={<Sword className="h-8 w-8" />}
                    onClick={() => {}}
                    gradient="gradient-ocean"
                  />
                  
                  <GameSectionCard
                    title="Island Explorer"
                    description="Navigate mysterious seas and hidden treasures"
                    icon={<Map className="h-8 w-8" />}
                    onClick={() => {}}
                    gradient="gradient-sunset"
                  />
                  
                  <GameSectionCard
                    title="Settings"
                    description="Customize your gaming experience"
                    icon={<Settings className="h-8 w-8" />}
                    onClick={() => setActiveSection("settings")}
                    gradient="gradient-adventure"
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return <div className="min-h-screen">{renderSection()}</div>;
};

interface GameSectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  gradient: string;
}

const GameSectionCard = ({ title, description, icon, onClick, gradient }: GameSectionCardProps) => {
  return (
    <Card 
      className="group cursor-pointer transition-epic hover:scale-105 hover:shadow-epic border-border/50 bg-card/80 backdrop-blur-sm"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className={`${gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-epic`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-smooth">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};