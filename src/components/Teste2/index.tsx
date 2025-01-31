import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import "../Capture/Capture.css";
import "../Capture/Capture.Responsive.css";
import "./index.css";

export default function Teste2() {
	const navigate = useNavigate();
	return (
			<div className="homeBody NoAI">
				<div className="captureBody">					
					<div>
						<Webcam
						/>
					</div>
					<div><button className="buttondeteste" onClick={() => {
						navigate("/teste3")
					}}>Proximo teste</button></div>
				</div>
			</div>
	);
}
