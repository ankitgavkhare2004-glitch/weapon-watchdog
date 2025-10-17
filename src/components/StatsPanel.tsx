import { Card } from "@/components/ui/card";
import { AlertTriangle, Activity, Clock, TrendingUp } from "lucide-react";
import { DetectedFootage } from "@/pages/Index";
import { Badge } from "@/components/ui/badge";

interface StatsPanelProps {
  totalDetections: number;
  isActive: boolean;
  recentDetections: DetectedFootage[];
}

const StatsPanel = ({ totalDetections, isActive, recentDetections }: StatsPanelProps) => {
  const avgConfidence = recentDetections.length > 0
    ? recentDetections.reduce((sum, d) => sum + d.confidence, 0) / recentDetections.length
    : 0;

  const stats = [
    {
      label: "Total Detections",
      value: totalDetections,
      icon: AlertTriangle,
      color: "text-alert",
      bgColor: "bg-alert/10",
    },
    {
      label: "System Status",
      value: isActive ? "Active" : "Standby",
      icon: Activity,
      color: isActive ? "text-success" : "text-muted-foreground",
      bgColor: isActive ? "bg-success/10" : "bg-muted/10",
    },
    {
      label: "Avg Confidence",
      value: `${avgConfidence.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">System Statistics</h3>
      </div>

      <div className="grid gap-3">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold mt-0.5">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {recentDetections.length > 0 && (
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold">Recent Activity</h4>
          </div>
          <div className="space-y-2">
            {recentDetections.slice(0, 3).map((detection) => (
              <div 
                key={detection.id}
                className="flex items-center justify-between text-xs py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                    {detection.weaponType}
                  </Badge>
                  <span className="text-muted-foreground">
                    {detection.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <span className="font-medium text-success">
                  {detection.confidence.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StatsPanel;
