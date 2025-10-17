import { Camera, Download, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetectedFootage } from "@/pages/Index";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DetectionGalleryProps {
  detections: DetectedFootage[];
}

const DetectionGallery = ({ detections }: DetectionGalleryProps) => {
  const downloadFootage = (footage: DetectedFootage) => {
    const link = document.createElement('a');
    link.href = footage.imageData;
    link.download = `weapon-detection-${footage.id}.jpg`;
    link.click();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Detected Footage</h3>
        </div>
        <Badge variant="secondary">{detections.length}</Badge>
      </div>

      {detections.length === 0 ? (
        <div className="text-center py-8">
          <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No detections yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Captured footage will appear here
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {detections.map((detection) => (
              <Card key={detection.id} className="p-3 bg-secondary/50 border-border hover:bg-secondary transition-colors">
                <div className="aspect-video rounded-md overflow-hidden mb-2 relative">
                  <img 
                    src={detection.imageData} 
                    alt={`Detection ${detection.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="destructive" className="bg-alert">
                      {detection.weaponType}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTime(detection.timestamp)}
                    </div>
                    <span className="font-medium text-success">
                      {detection.confidence.toFixed(1)}%
                    </span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full"
                    onClick={() => downloadFootage(detection)}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};

export default DetectionGallery;
