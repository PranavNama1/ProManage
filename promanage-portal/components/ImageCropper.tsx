
import React, { useRef, useState, useEffect } from 'react';

interface ImageCropperProps {
  imageFile: File;
  onCropped: (base64: string) => void;
  targetWidth: number;
  targetHeight: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageFile, onCropped, targetWidth, targetHeight }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    if (image && canvasRef.current) {
      draw();
    }
  }, [image, offset]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image centered with offset
    // Calculate scaling to fill the target size (cover)
    const scale = Math.max(targetWidth / image.width, targetHeight / image.height);
    const w = image.width * scale;
    const h = image.height * scale;
    
    ctx.drawImage(image, offset.x, offset.y, w, h);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onCropped(canvas.toDataURL('image/jpeg', 0.8));
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-xl shadow-lg border border-slate-200">
      <div className="text-sm font-medium text-slate-600 mb-2">Drag to adjust the crop</div>
      <div 
        className="overflow-hidden border-2 border-dashed border-indigo-400 cursor-move relative"
        style={{ width: targetWidth, height: targetHeight }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas 
          ref={canvasRef} 
          width={targetWidth} 
          height={targetHeight}
          className="pointer-events-none"
        />
      </div>
      <button
        onClick={handleCrop}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
      >
        Apply Crop
      </button>
    </div>
  );
};

export default ImageCropper;
