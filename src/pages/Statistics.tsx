import { useState, useEffect } from "react";
import { Shield, ArrowLeft, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DetectionGallery from "@/components/DetectionGallery";
import StatsPanel from "@/components/StatsPanel";
import { DetectedFootage } from "./Index";

const Statistics = () => {
  const [detectedFootages] = useState<DetectedFootage[]>([]);
  const [totalDetections] = useState(0);

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
                <h1 className="text-2xl font-bold tracking-tight">Detection Statistics</h1>
                <p className="text-sm text-muted-foreground">System analytics and history</p>
              </div>
            </div>
            <Link to="/detection">
              <Button className="bg-primary hover:bg-primary/90">Start Detection</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">System Overview</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <StatsPanel 
                totalDetections={totalDetections}
                isActive={false}
                recentDetections={detectedFootages.slice(0, 5)}
              />
            </div>
            
            <div className="lg:col-span-2">
              <DetectionGallery detections={detectedFootages} />
            </div>
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

export default Statistics;
