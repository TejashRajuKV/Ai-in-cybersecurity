import { useEffect, useRef, useState } from "react";
import "../styles/Forensic3DScene.css";

export default function Forensic3DScene({ frameCount = 60, assetPath = "/assets/3d-frames" }) {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [frameIndex, setFrameIndex] = useState(0);

  // ── Preload Images ──
  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      // Using .webp as default, fallback to .jpg if needed
      img.src = `${assetPath}/${i}.webp`; 
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImages(loadedImages);
        }
      };
      loadedImages.push(img);
    }
  }, [frameCount, assetPath]);

  // ── Scroll Handling ──
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = window.innerHeight * 1.5; // Depth of the 3D experience
      const scrollFraction = Math.min(1, scrollTop / maxScroll);
      
      const nextFrame = Math.floor(scrollFraction * (frameCount - 1));
      setFrameIndex(nextFrame);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [frameCount]);

  // ── Render to Canvas ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext("2d");
    const img = images[frameIndex];
    
    // Scale to fit while maintaining aspect ratio
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }, [frameIndex, images]);

  return (
    <div className="three-d-container">
      <canvas 
        ref={canvasRef} 
        width={1920} 
        height={1080} 
        className="forensic-canvas"
      />
      
      <div className="hero-overlay">
        <h1 className="hero-title fade-in">CYBER<span>RAKSHAK</span></h1>
        <p className="hero-tagline mono">AI-POWERED FORENSIC INTELLIGENCE ENGINE</p>
        <div className="scroll-indicator">
          <div className="mouse"></div>
          <span>SCROLL TO INITIALIZE SCAN</span>
        </div>
      </div>

      {images.length === 0 && (
        <div className="loading-assets mono">
          [ WAITING FOR GOOGLE FLOW ASSETS... ]
          <br/>
          <small>Place frames in /public/assets/3d-frames/</small>
        </div>
      )}
    </div>
  );
}
