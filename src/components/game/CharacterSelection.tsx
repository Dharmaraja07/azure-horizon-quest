import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Zap, Shield, Sword, Heart, Users } from "lucide-react";
import { useState } from "react";
import { useCharacters, useCreateCharacter } from "@/hooks/useGameData";
import kaiaImage from "@/assets/character-kaia.jpg";
import ziroImage from "@/assets/character-ziro.jpg";

interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  abilities: string[];
  stats: {
    strength: number;
    agility: number;
    defense: number;
    energy: number;
  };
  specialPower: string;
  rarity: "common" | "rare" | "legendary";
  image?: string;
}

const characters: Character[] = [
  {
    id: "azure-blade",
    name: "Kaia Stormwind",
    title: "Azure Blade Master",
    description: "A skilled swordsman who commands the power of ocean currents. Born on the floating islands of Nimbus Bay, she seeks to restore balance to the seas.",
    abilities: ["Tidal Strike", "Current Dash", "Wave Barrier"],
    stats: { strength: 85, agility: 90, defense: 70, energy: 80 },
    specialPower: "Tsunami Blade - Unleashes a devastating water-based attack",
    rarity: "legendary",
    image: kaiaImage
  },
  {
    id: "ember-fist",
    name: "Ziro Flameheart",
    title: "Ember Fist Warrior",
    description: "A fierce fighter who harnesses volcanic energy. From the lava islands of Ignis Ridge, he burns with determination to protect his homeland.",
    abilities: ["Lava Punch", "Fire Shield", "Magma Boost"],
    stats: { strength: 95, agility: 75, defense: 85, energy: 85 },
    specialPower: "Volcanic Eruption - Creates explosive fire attacks",
    rarity: "legendary",
    image: ziroImage
  },
  {
    id: "wind-dancer",
    name: "Luna Skyweaver",
    title: "Wind Dancer",
    description: "An agile fighter who moves like the wind. From the sky islands of Aether Peak, she dances through battles with grace and precision.",
    abilities: ["Gale Strike", "Wind Walk", "Tornado Spin"],
    stats: { strength: 70, agility: 95, defense: 65, energy: 90 },
    specialPower: "Hurricane Force - Controls massive wind currents",
    rarity: "rare"
  },
  {
    id: "stone-guardian",
    name: "Rex Ironhold",
    title: "Stone Guardian",
    description: "A defensive specialist with earth-based powers. From the mountain islands of Terra Firma, he stands as an unbreakable shield for his allies.",
    abilities: ["Rock Wall", "Stone Fist", "Earth Armor"],
    stats: { strength: 80, agility: 60, defense: 95, energy: 70 },
    specialPower: "Mountain's Fury - Creates devastating earth attacks",
    rarity: "rare"
  }
];

interface CharacterSelectionProps {
  onBack: () => void;
}

export const CharacterSelection = ({ onBack }: CharacterSelectionProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const { data: userCharacters = [] } = useCharacters();
  const createCharacterMutation = useCreateCharacter();

  const handleSelectCharacter = async () => {
    if (!selectedCharacter) return;

    await createCharacterMutation.mutateAsync({
      character_id: selectedCharacter.id,
      name: selectedCharacter.name,
      strength: selectedCharacter.stats.strength,
      agility: selectedCharacter.stats.agility,
      defense: selectedCharacter.stats.defense,
      energy: selectedCharacter.stats.energy,
    });
    
    onBack();
  };

  const getRarityColor = (rarity: Character["rarity"]) => {
    switch (rarity) {
      case "legendary": return "bg-accent text-accent-foreground";
      case "rare": return "bg-primary text-primary-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case "strength": return <Sword className="h-4 w-4" />;
      case "agility": return <Zap className="h-4 w-4" />;
      case "defense": return <Shield className="h-4 w-4" />;
      case "energy": return <Heart className="h-4 w-4" />;
      default: return null;
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
            <h1 className="text-4xl font-bold anime-slide-up">Choose Your Legend</h1>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Character List */}
            <div className="xl:col-span-2">
              {userCharacters.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">Your Characters</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userCharacters.map((char) => (
                      <Card key={char.id} className="bg-card/80 backdrop-blur-sm border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold">{char.name}</h3>
                              <p className="text-sm text-muted-foreground">Level {char.level}</p>
                            </div>
                            {char.is_active && (
                              <Badge className="bg-accent text-accent-foreground">Active</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              <h2 className="text-2xl font-bold mb-4">Available Characters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {characters.map((character, index) => (
                  <Card
                    key={character.id}
                    className={`group cursor-pointer transition-epic hover:scale-105 hover:shadow-glow border-border/50 bg-card/80 backdrop-blur-sm anime-slide-up ${
                      selectedCharacter?.id === character.id ? "ring-2 ring-primary shadow-glow" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedCharacter(character)}
                  >
                    <CardContent className="p-6">
                      {character.image && (
                        <div className="mb-4 relative overflow-hidden rounded-lg aspect-square">
                          <img 
                            src={character.image} 
                            alt={character.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <Badge className={`absolute top-2 right-2 ${getRarityColor(character.rarity)}`}>
                            {character.rarity}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-smooth">
                            {character.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">{character.title}</p>
                        </div>
                        {!character.image && (
                          <Badge className={getRarityColor(character.rarity)}>
                            {character.rarity}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {character.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {character.abilities.map((ability) => (
                          <Badge key={ability} variant="outline" className="text-xs">
                            {ability}
                          </Badge>
                        ))}
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(character.stats).map(([stat, value]) => (
                          <div key={stat} className="flex items-center gap-1">
                            {getStatIcon(stat)}
                            <span className="capitalize">{stat}:</span>
                            <span className="font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Character Details */}
            <div className="xl:col-span-1">
              {selectedCharacter ? (
                <Card className="sticky top-8 bg-card/80 backdrop-blur-sm border-border/50 anime-fade-in">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      {selectedCharacter.image && (
                        <div className="w-24 h-24 mx-auto mb-4 relative overflow-hidden rounded-xl">
                          <img 
                            src={selectedCharacter.image} 
                            alt={selectedCharacter.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                      )}
                      <h2 className="text-2xl font-bold mb-2">{selectedCharacter.name}</h2>
                      <p className="text-muted-foreground">{selectedCharacter.title}</p>
                      <Badge className={`mt-2 ${getRarityColor(selectedCharacter.rarity)}`}>
                        {selectedCharacter.rarity.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="font-semibold mb-2">Background</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {selectedCharacter.description}
                        </p>
                      </div>

                      {/* Stats */}
                      <div>
                        <h3 className="font-semibold mb-3">Combat Stats</h3>
                        <div className="space-y-2">
                          {Object.entries(selectedCharacter.stats).map(([stat, value]) => (
                            <div key={stat} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getStatIcon(stat)}
                                <span className="capitalize text-sm">{stat}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full gradient-ocean transition-all duration-1000"
                                    style={{ width: `${value}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold w-8">{value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Special Power */}
                      <div>
                        <h3 className="font-semibold mb-2">Special Power</h3>
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                          <p className="text-sm text-primary font-medium">
                            {selectedCharacter.specialPower}
                          </p>
                        </div>
                      </div>

                      {/* Abilities */}
                      <div>
                        <h3 className="font-semibold mb-2">Combat Abilities</h3>
                        <div className="space-y-2">
                          {selectedCharacter.abilities.map((ability) => (
                            <div key={ability} className="p-2 rounded bg-muted/50 text-sm">
                              {ability}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        className="w-full anime-pulse" 
                        size="lg"
                        onClick={handleSelectCharacter}
                        disabled={createCharacterMutation.isPending}
                      >
                        {createCharacterMutation.isPending ? "Creating..." : "Select This Character"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="sticky top-8 bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a character to view details</p>
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