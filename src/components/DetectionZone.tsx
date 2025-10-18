import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DetectedFootage } from "@/pages/Index";
import { supabase } from "@/integrations/supabase/client";

interface DetectionZoneProps {
  isActive: boolean;
  onWeaponDetected: (footage: DetectedFootage) => void;
}

const DetectionZone = ({ isActive, onWeaponDetected }: DetectionZoneProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const detectionTimeoutRef = useRef<NodeJS.Timeout>();
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
      }
    };
  }, []);

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
        await videoRef.current.play();
      }

      toast.success("Camera activated - Detection starting");
      
      const video = videoRef.current;
      if (video && isActive) {
        startDetectionLoop();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Camera access denied. Please allow camera access.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (detectionTimeoutRef.current) {
      clearTimeout(detectionTimeoutRef.current);
    }
  };

  const startDetectionLoop = () => {
    if (!isActive) return;
    
    const detectFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !isActive) {
        return;
      }

      try {
        setIsDetecting(true);
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current frame
        ctx.drawImage(video, 0, 0);

        // Convert canvas to base64
        const imageData = canvas.toDataURL('image/jpeg', 0.8);

        console.log('Sending frame to backend for detection...');

        // Call backend detection function
        const { data, error } = await supabase.functions.invoke('detect-weapon', {
          body: { imageData }
        });

        if (error) {
          console.error('Detection error:', error);
          toast.error('Detection failed: ' + error.message);
        } else if (data?.detections && data.detections.length > 0) {
          console.log('Detections received:', data.detections);

          // Clear canvas and redraw frame
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0);

          // Draw bounding boxes for each detection
          data.detections.forEach((detection: any) => {
            const { label, confidence, bbox } = detection;
            
            // Check if detected weapon matches our classes
            const weaponKeywords = ['Pistol', 'knife', 'Handgun'];
            const isWeapon = weaponKeywords.some(keyword => 
              label.toLowerCase().includes(keyword.toLowerCase())
            );

            if (isWeapon) {
              // Draw red bounding box
              ctx.strokeStyle = '#ef4444';
              ctx.lineWidth = 3;
              ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);

              // Draw label background
              ctx.fillStyle = '#ef4444';
              ctx.fillRect(bbox.x, bbox.y - 25, bbox.width, 25);

              // Draw label text
              ctx.fillStyle = '#ffffff';
              ctx.font = '16px Arial';
              ctx.fillText(
                `${label} ${(confidence * 100).toFixed(1)}%`,
                bbox.x + 5,
                bbox.y - 7
              );

              // Capture detection
              const capturedImage = canvas.toDataURL('image/jpeg');
              const footage: DetectedFootage = {
                id: Date.now().toString(),
                timestamp: new Date(),
                imageData: capturedImage,
                weaponType: label,
                confidence: confidence,
              };

              onWeaponDetected(footage);
              toast.error(`⚠️ ${label} detected! Confidence: ${(confidence * 100).toFixed(1)}%`);
            }
          });
        }

        setIsDetecting(false);

        // Schedule next detection (every 1 second)
        if (isActive) {
          detectionTimeoutRef.current = setTimeout(detectFrame, 1000);
        }

      } catch (error) {
        console.error("Detection error:", error);
        setIsDetecting(false);
        
        // Retry after delay
        if (isActive) {
          detectionTimeoutRef.current = setTimeout(detectFrame, 2000);
        }
      }
    };

    detectFrame();
  };

  return (
    <div className="relative rounded-lg overflow-hidden border-2 border-border bg-black">
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {!isActive && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary/40 rounded-full" />
                </div>
                <p className="text-lg font-semibold text-white">Detection Standby</p>
                <p className="text-sm text-gray-300">Click "Start Detection" to begin monitoring</p>
              </div>
            </div>
          )}
          
          {isDetecting && isActive && (
            <div className="absolute top-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-semibold">ANALYZING...</span>
            </div>
          )}

          {isActive && !isDetecting && (
            <div className="absolute top-4 left-4 bg-green-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-semibold">MONITORING</span>
            </div>
          )}

          {/* Scanning animation */}
          {isActive && (
            <div className="absolute inset-0 scan-animation opacity-30">
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-scan" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetectionZone;
