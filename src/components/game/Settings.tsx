import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Bell, Volume2, Eye, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useGameData";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  onBack: () => void;
}

export const Settings = ({ onBack }: SettingsProps) => {
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    username: profile?.username || "",
    notifications: true,
    soundEffects: true,
    music: true,
    animations: true,
    autoSave: true,
  });

  const handleSaveSettings = () => {
    // In a real app, you'd save these to the database
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleDeleteAccount = () => {
    // In a real app, you'd implement account deletion
    toast({
      title: "Account Deletion",
      description: "This feature will be available soon. Contact support if needed.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={onBack} className="anime-slide-up">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hub
            </Button>
            <h1 className="text-4xl font-bold anime-slide-up">Settings</h1>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 anime-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Captain Name</Label>
                  <Input
                    id="username"
                    value={settings.username}
                    onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Your legendary name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <strong>Level:</strong> {profile?.level || 1}
                  </div>
                  <div>
                    <strong>Experience:</strong> {profile?.experience || 0} XP
                  </div>
                  <div>
                    <strong>Gold:</strong> {profile?.gold || 0}
                  </div>
                  <div>
                    <strong>Member Since:</strong> Just now
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Preferences */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 anime-slide-up" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Game Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Animations</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable smooth animations and visual effects
                    </div>
                  </div>
                  <Switch
                    checked={settings.animations}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, animations: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-Save</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically save your progress
                    </div>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSave: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Audio Settings */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 anime-slide-up" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Audio Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Background Music</Label>
                    <div className="text-sm text-muted-foreground">
                      Play epic adventure music
                    </div>
                  </div>
                  <Switch
                    checked={settings.music}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, music: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Sound Effects</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable combat and interaction sounds
                    </div>
                  </div>
                  <Switch
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundEffects: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 anime-slide-up" style={{ animationDelay: "300ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Quest Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Get notified about quest updates and rewards
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 anime-slide-up" style={{ animationDelay: "400ms" }}>
              <Button onClick={handleSaveSettings} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
              
              <Button variant="outline" onClick={signOut} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Danger Zone */}
            <Card className="bg-destructive/10 border-destructive/20 anime-slide-up" style={{ animationDelay: "500ms" }}>
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};