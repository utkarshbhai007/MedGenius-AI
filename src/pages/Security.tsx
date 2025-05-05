import * as React from "react";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import GlassCard from "@/components/ui/GlassCard";
import { Save, ShieldAlert, KeyRound, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Security = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Security settings saved",
      description: "Your security settings have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <main className="flex-grow pt-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/10 bg-primary/5 text-primary-600 mb-4">
              <ShieldAlert className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Security</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              Security Settings
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your account security and authentication preferences
            </p>
          </div>

          <div className="space-y-8">
            <GlassCard>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-2 rounded-full">
                  <KeyRound className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Authentication</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch 
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
                
                {twoFactorEnabled && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-sm">Setup Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          To enable two-factor authentication, you need to link your account to an authenticator app.
                        </p>
                        <Button variant="outline" size="sm">
                          Setup Authenticator
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Session Timeout (minutes)
                    </label>
                    <Input 
                      type="number" 
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(Number(e.target.value))}
                      min={5}
                      max={120}
                      className="max-w-[120px]"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Security Settings
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Security;
