import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Video, AlertTriangle, Activity } from "lucide-react";
import DetectionZone from "@/components/DetectionZone";
import DetectionGallery from "@/components/DetectionGallery";
import StatsPanel from "@/components/StatsPanel";

export interface DetectedFootage {
  id: string;
  timestamp: Date;
  imageData: string;
  confidence: number;
  weaponType: string;
}

const Index = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedFootages, setDetectedFootages] = useState<DetectedFootage[]>([]);
  const [totalDetections, setTotalDetections] = useState(0);

  const handleDetectionStart = () => {
    setIsDetecting(true);
  };

  const handleDetectionStop = () => {
    setIsDetecting(false);
  };

  const handleWeaponDetected = (footage: DetectedFootage) => {
    setDetectedFootages(prev => [footage, ...prev]);
    setTotalDetections(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Weapon Detection System</h1>
                <p className="text-sm text-muted-foreground">Real-time AI-powered surveillance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className={`w-5 h-5 ${isDetecting ? 'text-success animate-pulse' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium">
                {isDetecting ? 'Active' : 'Standby'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Detection Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" />
                  Live Detection Feed
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  YOLO-powered weapon detection with automatic capture
                </p>
              </div>
              {!isDetecting ? (
                <Button onClick={handleDetectionStart} className="bg-primary hover:bg-primary/90">
                  Start Detection
                </Button>
              ) : (
                <Button onClick={handleDetectionStop} variant="destructive">
                  Stop Detection
                </Button>
              )}
            </div>

            <DetectionZone 
              isActive={isDetecting} 
              onWeaponDetected={handleWeaponDetected}
            />

            {/* Alert Banner */}
            {isDetecting && totalDetections > 0 && (
              <div className="bg-alert/10 border border-alert/30 rounded-lg p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-alert pulse-alert" />
                <div>
                  <p className="font-semibold text-alert-foreground">Weapons Detected</p>
                  <p className="text-sm text-muted-foreground">
                    {totalDetections} detection{totalDetections !== 1 ? 's' : ''} recorded. Check gallery for details.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StatsPanel 
              totalDetections={totalDetections}
              isActive={isDetecting}
              recentDetections={detectedFootages.slice(0, 5)}
            />
            
            <DetectionGallery detections={detectedFootages} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            AI-Powered Weapon Detection System • Real-time Analysis • Secure & Private
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
