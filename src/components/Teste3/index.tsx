import { useEffect, useRef } from "react";
import "../Capture/Capture.css";
import "../Capture/Capture.Responsive.css";
import "./index.css";

export default function Teste3() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Erro ao acessar a câmera:", error);
      }
    };

    startCamera();

    return () => {
      // Parar o stream da câmera ao desmontar o componente
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="homeBody NoAI">
      <div className="captureBody">
        <div>
          <video ref={videoRef} autoPlay playsInline className="cameraFeed"></video>
        </div>
        <div>
          
        </div>
      </div>
    </div>
  );
}
