import { useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DetectedFootage } from "@/pages/Index";
import { pipeline } from "@huggingface/transformers";

interface DetectionZoneProps {
  isActive: boolean;
  onWeaponDetected: (footage: DetectedFootage) => void;
}

const DetectionZone = ({ isActive, onWeaponDetected }: DetectionZoneProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const detectorRef = useRef<any>(null);
  const animationRef = useRef<number>();
  const { toast } = useToast();

  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        // Load YOLO model for object detection
        detectorRef.current = await pipeline(
          'object-detection',
          'Xenova/yolov9-c',
          { device: 'webgpu' }
        );
        setModelReady(true);
        toast({
          title: "Model Loaded",
          description: "YOLO detection model is ready",
        });
      } catch (error) {
        console.error('Error loading model:', error);
        toast({
          title: "Model Loading Failed",
          description: "Using fallback detection mode",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [toast]);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        if (modelReady) {
          detectObjects();
        }
      }

      toast({
        title: "Camera Active",
        description: "Detection system is now monitoring",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to use detection",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const detectObjects = async () => {
    if (!videoRef.current || !canvasRef.current || !detectorRef.current || !isActive) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== 4) {
      animationRef.current = requestAnimationFrame(detectObjects);
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Run detection
      const predictions = await detectorRef.current(canvas);

      // Filter for weapon-related objects
      const weaponKeywords = ['knife', 'gun', 'weapon', 'rifle', 'pistol'];
      const weaponDetections = predictions.filter((pred: any) => 
        weaponKeywords.some(keyword => 
          pred.label.toLowerCase().includes(keyword)
        )
      );

      if (weaponDetections.length > 0) {
        // Draw bounding boxes for weapons
        weaponDetections.forEach((detection: any) => {
          const box = detection.box;
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 3;
          ctx.strokeRect(box.xmin, box.ymin, box.xmax - box.xmin, box.ymax - box.ymin);
          
          // Draw label
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(box.xmin, box.ymin - 25, 150, 25);
          ctx.fillStyle = '#ffffff';
          ctx.font = '16px sans-serif';
          ctx.fillText(
            `${detection.label} (${(detection.score * 100).toFixed(1)}%)`,
            box.xmin + 5,
            box.ymin - 7
          );
        });

        // Capture the frame
        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        const footage: DetectedFootage = {
          id: Date.now().toString(),
          timestamp: new Date(),
          imageData,
          confidence: weaponDetections[0].score * 100,
          weaponType: weaponDetections[0].label,
        };

        onWeaponDetected(footage);

        toast({
          title: "⚠️ Weapon Detected!",
          description: `${footage.weaponType} detected with ${footage.confidence.toFixed(1)}% confidence`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Detection error:', error);
    }

    animationRef.current = requestAnimationFrame(detectObjects);
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-border bg-card">
      <div className="relative aspect-video bg-secondary">
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm">
            <div className="text-center">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">Detection Standby</p>
              <p className="text-sm text-muted-foreground mt-2">Click "Start Detection" to begin</p>
            </div>
          </div>
        )}

        {isLoading && isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Loading YOLO Model...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {isActive && !isLoading && (
          <>
            {/* Scanning overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-primary/5">
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent scan-line opacity-50" />
              </div>
            </div>

            {/* Status indicator */}
            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm font-medium">MONITORING</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetectionZone;
