import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import "../Capture/Capture.css";
import "../Capture/Capture.Responsive.css";
import "./index.css";

export default function Teste1() {
    const WebCamRef = useRef<Webcam>(null);
	const navigate = useNavigate();

    return (
			<div className="homeBody NoAI">
				<div className="captureBody">					
					<div>
						<Webcam
							autoPlay
							audio={false}
							ref={WebCamRef}
							videoConstraints={{
								facingMode: "environment",
								width: 500,
								height: 500,
							}}
							width={500}
							height={500}
							mirrored
						/>
						
						<Webcam
							autoPlay
							audio={false}
							ref={WebCamRef}
							videoConstraints={{
								facingMode: "user",
								width: 500,
								height: 500,
							}}
							width={500}
							height={500}
							mirrored
						/>
					</div>
					<div><button className="buttondeteste" onClick={() => {
						navigate("/teste2")
					}}>Proximo teste</button></div>
				</div>
			</div>
	);
}
