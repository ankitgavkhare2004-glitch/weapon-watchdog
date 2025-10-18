import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Video, AlertTriangle, Activity, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import DetectionZone from "@/components/DetectionZone";
import { DetectedFootage } from "./Index";

const Detection = () => {
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
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Live Detection</h1>
                <p className="text-sm text-muted-foreground">Real-time weapon detection</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className={`w-5 h-5 ${isDetecting ? 'text-success animate-pulse' : 'text-muted-foreground'}`} />
                <span className="text-sm font-medium">
                  {isDetecting ? 'Active' : 'Standby'}
                </span>
              </div>
              <Link to="/statistics">
                <Button variant="outline">View Statistics</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
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
                  {totalDetections} detection{totalDetections !== 1 ? 's' : ''} recorded. View in statistics page.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Detection;
