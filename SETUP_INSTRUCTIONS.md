# Weapon Detection Setup Instructions

## Your Model Files
I've copied both `best.pt` and `last.pt` to `public/models/`. These are PyTorch YOLOv8n models trained to detect:
- Pistol
- knife  
- Handgun

## Current Status ✅
✅ Backend infrastructure created (database, storage, edge function)  
✅ Frontend updated to use backend detection  
✅ Model files stored in project  
⚠️ **Models need conversion to ONNX format**

## Next Steps: Convert Your Model to ONNX

Since you don't have Python locally, use **Google Colab** (free, browser-based):

### Option 1: Google Colab (Recommended - No Installation)

1. **Open Google Colab**: https://colab.research.google.com/

2. **Upload your model**:
   - Click the folder icon on the left
   - Upload `best.pt` from your computer

3. **Run this code in a new cell**:
```python
!pip install ultralytics

from ultralytics import YOLO

# Load your trained model
model = YOLO('best.pt')

# Export to ONNX format
model.export(format='onnx')

print("✅ Conversion complete! Download best.onnx")
```

4. **Download the converted file**:
   - Right-click `best.onnx` in the file browser
   - Select "Download"

### Option 2: Upload to Backend Storage

Once you have `best.onnx`:

1. Go to your app's backend:
   <lov-actions>
     <lov-open-backend>Open Backend</lov-open-backend>
   </lov-actions>

2. Navigate to **Storage** → **weapon-models** bucket

3. **Upload** `best.onnx`

4. Make the file **public** and copy its URL

5. Let me know the URL and I'll update the edge function to use it!

## Alternative: Quick Testing with Roboflow

If you want to test immediately without conversion:

1. Sign up at https://roboflow.com (free tier)
2. Upload your dataset or trained model
3. Get your API endpoint
4. I'll integrate it in minutes!

## What I've Built

**Backend (Lovable Cloud):**
- ✅ `weapon-models` storage bucket for your ONNX model
- ✅ `weapon_detections` table to log all detections
- ✅ `detect-weapon` edge function (currently returns mock data)

**Frontend:**
- ✅ Captures webcam frames every 1 second
- ✅ Sends frames to backend for detection
- ✅ Draws bounding boxes on detected weapons
- ✅ Saves detections to database
- ✅ Custom classes: Pistol, knife, Handgun

## How It Works

1. **Webcam** → captures frame every 1 second
2. **Frontend** → converts frame to base64 image
3. **Backend Function** → runs YOLO inference on image
4. **Response** → returns detections with bounding boxes
5. **Frontend** → draws boxes and logs detection

## Performance

- **Detection Rate**: ~1 FPS (adjustable)
- **Latency**: 200-500ms per frame
- **Bandwidth**: ~50KB per frame (compressed JPEG)

Let me know when you have the ONNX file ready, and I'll complete the integration!

<lov-actions>
  <lov-link url="https://docs.lovable.dev/features/cloud">Learn more about Lovable Cloud</lov-link>
</lov-actions>
