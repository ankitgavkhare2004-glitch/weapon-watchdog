import { Button } from "@/components/ui/button";
import { Shield, Video, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

export interface DetectedFootage {
  id: string;
  timestamp: Date;
  imageData: string;
  confidence: number;
  weaponType: string;
}

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Weapon Detection System</h1>
              <p className="text-sm text-muted-foreground">Real-time AI-powered surveillance</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-12">
            <h2 className="text-4xl font-bold tracking-tight">
              Advanced Security Monitoring
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leverage cutting-edge YOLO AI technology for real-time weapon detection and comprehensive analytics
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/detection">
              <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group border-primary/20 hover:border-primary/50">
                <div className="space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <Video className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Live Detection</h3>
                    <p className="text-muted-foreground">
                      Start real-time weapon detection with automatic footage capture
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                    <span className="font-medium">Start Recording</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/statistics">
              <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group border-primary/20 hover:border-primary/50">
                <div className="space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <BarChart3 className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Statistics & Analytics</h3>
                    <p className="text-muted-foreground">
                      View detection history, analytics, and system performance
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                    <span className="font-medium">View Statistics</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>
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
