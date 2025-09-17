import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Users, Plus, Star, Sword, Shield, Zap, Heart, Coins } from "lucide-react";
import { useState } from "react";
import { useCrewMembers, useRecruitCrewMember, useProfile } from "@/hooks/useGameData";

interface AvailableCrewMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  cost: number;
  description: string;
}

const availableRecruits: AvailableCrewMember[] = [
  {
    id: "navigator-1",
    name: "Elena Stormwind",
    role: "Navigator",
    specialty: "Ocean Navigation",
    cost: 800,
    description: "Expert navigator with knowledge of dangerous waters and hidden islands."
  },
  {
    id: "gunner-1", 
    name: "Drake Cannonball",
    role: "Gunner",
    specialty: "Artillery Combat",
    cost: 1000,
    description: "Master gunner with exceptional aim and explosive expertise."
  },
  {
    id: "cook-1",
    name: "Chef Marina",
    role: "Cook",
    specialty: "Healing Cuisine", 
    cost: 600,
    description: "Talented cook who can prepare meals that boost crew stats and morale."
  },
  {
    id: "engineer-1",
    name: "Gears Ironwright",
    role: "Engineer",
    specialty: "Ship Maintenance",
    cost: 900,
    description: "Skilled engineer who keeps your ship running at peak performance."
  },
  {
    id: "lookout-1",
    name: "Hawk Sharpeye",
    role: "Lookout",
    specialty: "Enemy Detection",
    cost: 500,
    description: "Sharp-eyed lookout who can spot threats and treasures from great distances."
  }
];

interface CrewManagementProps {
  onBack: () => void;
}

export const CrewManagement = ({ onBack }: CrewManagementProps) => {
  const [selectedTab, setSelectedTab] = useState<"crew" | "recruit">("crew");
  const { data: crewMembers = [] } = useCrewMembers();
  const { data: profile } = useProfile();
  const recruitMutation = useRecruitCrewMember();

  const handleRecruitMember = async (memberData: {
    name: string;
    role: string;
    specialty: string;
    recruitment_cost: number;
  }) => {
    await recruitMutation.mutateAsync(memberData);
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

            {profile && (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
                <div className="text-sm">Gold: {profile.gold}</div>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8">
            <Button
              variant={selectedTab === "crew" ? "default" : "outline"}
              onClick={() => setSelectedTab("crew")}
            >
              <Users className="h-4 w-4 mr-2" />
              My Crew ({crewMembers.length})
            </Button>
            <Button
              variant={selectedTab === "recruit" ? "default" : "outline"}
              onClick={() => setSelectedTab("recruit")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Recruit Members
            </Button>
          </div>

          <div className="space-y-6">
            {/* Current Crew */}
            {selectedTab === "crew" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crewMembers.map((member, index) => (
                  <Card 
                    key={member.id} 
                    className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-glow transition-epic anime-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <Badge className="bg-primary text-primary-foreground">
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {/* Level & Experience */}
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Level {member.level}</span>
                            <span>{member.experience}/{member.experience + 100} XP</span>
                          </div>
                          <Progress value={(member.experience / (member.experience + 100)) * 100} className="h-2" />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Sword className="h-3 w-3 text-red-500" />
                            <span>STR: {member.strength}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            <span>AGI: {member.agility}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-blue-500" />
                            <span>DEF: {member.defense}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-green-500" />
                            <span>VIT: {member.energy}</span>
                          </div>
                        </div>

                        {/* Specialty */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Specialty:</p>
                          <Badge variant="outline" className="text-xs">{member.specialty}</Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Train
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className={member.is_active ? "bg-primary/20" : ""}
                          >
                            {member.is_active ? "Active" : "Deploy"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {crewMembers.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold mb-2">No Crew Members</h3>
                    <p className="text-muted-foreground mb-4">Start building your crew by recruiting new members!</p>
                    <Button onClick={() => setSelectedTab("recruit")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Recruit First Member
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Recruitment */}
            {selectedTab === "recruit" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableRecruits.map((member, index) => (
                  <Card 
                    key={member.id} 
                    className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-glow transition-epic anime-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {member.description}
                        </p>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Specialty:</p>
                          <Badge variant="outline" className="text-xs">{member.specialty}</Badge>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1 text-lg font-bold text-yellow-500">
                            <Coins className="h-4 w-4" />
                            {member.cost}
                          </div>
                          <Badge variant="secondary">Available</Badge>
                        </div>

                        <Button 
                          className="w-full" 
                          disabled={recruitMutation.isPending || (profile && profile.gold < member.cost)}
                          onClick={() => handleRecruitMember({
                            name: member.name,
                            role: member.role,
                            specialty: member.specialty,
                            recruitment_cost: member.cost
                          })}
                        >
                          <Coins className="h-4 w-4 mr-2" />
                          {recruitMutation.isPending ? "Recruiting..." : 
                           profile && profile.gold < member.cost ? "Not enough gold" :
                           `Recruit (${member.cost} Gold)`}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};