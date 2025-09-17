import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Users, Plus, Star, Anchor, Crown } from "lucide-react";
import { useState } from "react";

interface CrewMember {
  id: string;
  name: string;
  role: string;
  level: number;
  experience: number;
  maxExperience: number;
  specialty: string;
  loyalty: number;
  status: "active" | "resting" | "training";
  abilities: string[];
  rarity: "common" | "rare" | "legendary";
}

const crewMembers: CrewMember[] = [
  {
    id: "navigator",
    name: "Marina Seacrest",
    role: "Navigator",
    level: 15,
    experience: 750,
    maxExperience: 1000,
    specialty: "Ocean Navigation",
    loyalty: 95,
    status: "active",
    abilities: ["Chart Reading", "Weather Prediction", "Safe Passage"],
    rarity: "legendary"
  },
  {
    id: "cook",
    name: "Chef Saltbeard",
    role: "Ship's Cook",
    level: 12,
    experience: 400,
    maxExperience: 800,
    specialty: "Healing Cuisine",
    loyalty: 88,
    status: "active",
    abilities: ["Energy Boost Meals", "Poison Cure", "Strength Food"],
    rarity: "rare"
  },
  {
    id: "gunner",
    name: "Boom McGillicuddy",
    role: "Master Gunner",
    level: 18,
    experience: 950,
    maxExperience: 1200,
    specialty: "Artillery Combat",
    loyalty: 92,
    status: "training",
    abilities: ["Cannon Mastery", "Explosive Rounds", "Rapid Fire"],
    rarity: "rare"
  },
  {
    id: "mechanic",
    name: "Gears Ironwright",
    role: "Ship Engineer",
    level: 10,
    experience: 200,
    maxExperience: 600,
    specialty: "Ship Maintenance",
    loyalty: 78,
    status: "resting",
    abilities: ["Quick Repairs", "Engine Boost", "Defensive Systems"],
    rarity: "common"
  }
];

interface CrewManagementProps {
  onBack: () => void;
}

export const CrewManagement = ({ onBack }: CrewManagementProps) => {
  const [selectedMember, setSelectedMember] = useState<CrewMember | null>(null);

  const getRarityColor = (rarity: CrewMember["rarity"]) => {
    switch (rarity) {
      case "legendary": return "text-accent";
      case "rare": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const getStatusColor = (status: CrewMember["status"]) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "training": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "resting": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "navigator": return <Anchor className="h-4 w-4" />;
      case "master gunner": return <Star className="h-4 w-4" />;
      case "ship engineer": return <Users className="h-4 w-4" />;
      default: return <Crown className="h-4 w-4" />;
    }
  };

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
              <h1 className="text-4xl font-bold anime-slide-up">Crew Management</h1>
            </div>
            
            <Button className="anime-pulse">
              <Plus className="h-4 w-4 mr-2" />
              Recruit Member
            </Button>
          </div>

          {/* Crew Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 anime-slide-up">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">Active Crew</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 anime-slide-up" style={{ animationDelay: "100ms" }}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent">87%</div>
                <div className="text-sm text-muted-foreground">Avg Loyalty</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 anime-slide-up" style={{ animationDelay: "200ms" }}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary">14</div>
                <div className="text-sm text-muted-foreground">Avg Level</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 anime-slide-up" style={{ animationDelay: "300ms" }}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Ready for Quest</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Crew List */}
            <div className="xl:col-span-2">
              <div className="space-y-4">
                {crewMembers.map((member, index) => (
                  <Card
                    key={member.id}
                    className={`group cursor-pointer transition-epic hover:scale-[1.02] hover:shadow-glow border-border/50 bg-card/80 backdrop-blur-sm anime-slide-up ${
                      selectedMember?.id === member.id ? "ring-2 ring-primary shadow-glow" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedMember(member)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="gradient-ocean w-12 h-12 rounded-lg flex items-center justify-center">
                            {getRoleIcon(member.role)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold group-hover:text-primary transition-smooth">
                              {member.name}
                            </h3>
                            <p className="text-muted-foreground text-sm">{member.role}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(member.status)} variant="outline">
                            {member.status}
                          </Badge>
                          <div className="text-right">
                            <div className="text-sm font-semibold">Level {member.level}</div>
                            <div className={`text-xs ${getRarityColor(member.rarity)}`}>
                              {member.rarity}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Experience Bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Experience</span>
                            <span>{member.experience}/{member.maxExperience}</span>
                          </div>
                          <Progress 
                            value={(member.experience / member.maxExperience) * 100} 
                            className="h-2"
                          />
                        </div>

                        {/* Loyalty Bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Loyalty</span>
                            <span>{member.loyalty}%</span>
                          </div>
                          <Progress 
                            value={member.loyalty} 
                            className="h-2"
                          />
                        </div>

                        {/* Specialty */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Specialty:</span>
                          <Badge variant="secondary" className="text-xs">
                            {member.specialty}
                          </Badge>
                        </div>

                        {/* Abilities Preview */}
                        <div className="flex flex-wrap gap-1">
                          {member.abilities.slice(0, 3).map((ability) => (
                            <Badge key={ability} variant="outline" className="text-xs">
                              {ability}
                            </Badge>
                          ))}
                          {member.abilities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.abilities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Member Details */}
            <div className="xl:col-span-1">
              {selectedMember ? (
                <Card className="sticky top-8 bg-card/80 backdrop-blur-sm border-border/50 anime-fade-in">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="gradient-ocean w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3">
                        {getRoleIcon(selectedMember.role)}
                      </div>
                      <h2 className="text-xl font-bold mb-1">{selectedMember.name}</h2>
                      <p className="text-muted-foreground">{selectedMember.role}</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Badge className={getStatusColor(selectedMember.status)} variant="outline">
                          {selectedMember.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Level & Experience */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Level {selectedMember.level}</span>
                          <span className={getRarityColor(selectedMember.rarity)}>
                            {selectedMember.rarity}
                          </span>
                        </div>
                        <Progress 
                          value={(selectedMember.experience / selectedMember.maxExperience) * 100} 
                          className="h-3"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {selectedMember.experience}/{selectedMember.maxExperience} XP
                        </div>
                      </div>

                      {/* Loyalty */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Loyalty</span>
                          <span className="text-sm">{selectedMember.loyalty}%</span>
                        </div>
                        <Progress value={selectedMember.loyalty} className="h-3" />
                      </div>

                      {/* Specialty */}
                      <div>
                        <h3 className="font-semibold mb-2">Specialty</h3>
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                          <p className="text-sm text-primary font-medium">
                            {selectedMember.specialty}
                          </p>
                        </div>
                      </div>

                      {/* All Abilities */}
                      <div>
                        <h3 className="font-semibold mb-2">Abilities</h3>
                        <div className="space-y-2">
                          {selectedMember.abilities.map((ability) => (
                            <div key={ability} className="p-2 rounded bg-muted/50 text-sm">
                              {ability}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 pt-4">
                        <Button className="w-full" variant="default">
                          Train Member
                        </Button>
                        <Button className="w-full" variant="outline">
                          Assign to Quest
                        </Button>
                        <Button className="w-full" variant="outline">
                          Give Rest
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="sticky top-8 bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a crew member to view details</p>
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