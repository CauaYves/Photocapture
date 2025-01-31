import { Camera, ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { TutorialBorderIcon } from "../../assets/icons/tutorial-box-icon";
import { TutorialFaceIcon } from "../../assets/icons/tutorial-face-icon";
import { TutorialHairIcon } from "../../assets/icons/tutorial-hair-icon";
import { TutorialUserIcon } from "../../assets/icons/tutorial-user-icon";
import { isSignedIn } from '../../services/api';
import "../Capture/Capture.css";
import "../Capture/Capture.Responsive.css";
import Header from "../Header/Header";
import { faultMessages } from "../Modal/FaultMessagesModal";
import TextCarousel from "../Tutorial/HomeTutorialCarousel";
import { TutorialSlides } from "../Tutorial/TutorialSlides";

export const resetTutorial = () => {
	localStorage.setItem("hasSeenTutorial", "false");
	window.dispatchEvent(new CustomEvent("resetTutorial"));
};

export default function FaceCaptureNoAi() {
    const [hasError] = useState<undefined | string>();
    const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
    const WebCamRef = useRef<Webcam>(null);
    const [isSending, setIsSending] = useState(false);
    const [isTutorialActive, setIsTutorialActive] = useState(false);
    const [hasSeenTutorial, setHasSeenTutorial] = useState(localStorage.getItem("hasSeenTutorial") === "true");
	const [hasShownAlert, setHasShownAlert] = useState(false);
	const [isOuterContainerExpanded, setIsOuterContainerExpanded] = useState(false);
	const isSigninRef = useRef(false);
    const navigate = useNavigate();


	const takeScreenshot = useCallback(() => {
		if (WebCamRef.current) {
			const _img = WebCamRef.current.getScreenshot();
			setImgSrc(_img as string);
			setIsOuterContainerExpanded(true);
		}
	}, [WebCamRef, setImgSrc]);

	const onMediaError = useCallback(async () => {
		try {
			const response = await isSignedIn();

			if (response.isSuccess) {
				isSigninRef.current = true;
			} else {
				isSigninRef.current = false;
			}

			if (!hasShownAlert && isSigninRef.current) {
				setHasShownAlert(true);
				faultMessages.showError(
					"Opa, precisamos da sua câmera",
					"Para seguir em frente, você precisa liberar o acesso à câmera. \n\nComo fazer isso:\n\n1. Clique no ícone à esquerda do link da página (pode ser um cadeado, um 'i' ou outro dependendo do seu navegador).\n2. Encontre a permissão da câmera e selecione 'Permitir'.\n3. Atualize a página e tente de novo.",
					undefined,
					true
				);
			}
		} catch (error) {
			console.error(error);
		}
	}, [hasShownAlert, isSigninRef]);


    const onLikePressed = async () => {
		const img = imgSrc;

		document.querySelector(".popupBackgroundBlur")?.classList.add("opacityControl");
		setIsSending(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 3000));
			if (img) {
				localStorage.setItem("capturedImage", img);
				const memberIndex = localStorage.getItem("memberIndex");
				window.dispatchEvent(new CustomEvent("handleUpdate", { detail: { index: memberIndex, newImageUrl: img } }));
			}
		} finally {
			setIsSending(false);
			document.querySelector(".popupBackgroundBlur")?.classList.remove("opacityControl");
			localStorage.removeItem("takePhotoClicked");
			navigate("/");
		}
	};

    const onResetCapturePressed = () => {
        setImgSrc(undefined);
        setIsSending(false);
		setIsOuterContainerExpanded(false); 
    };

    useEffect(() => {
		// Lógica para abrir o tutorial quando a página é carregada
		if (localStorage.getItem("hasSeenTutorial") !== "true") {
			document.querySelector(".homeTutorial")?.classList.add("opacityControl");
		}
	}, []);

	useEffect(() => {
		if (hasSeenTutorial) {
			setIsTutorialActive(false);
		}
	}, [hasSeenTutorial]);

	const handleTutorialComplete = () => {
		setIsTutorialActive(false);
		setHasSeenTutorial(true);
		localStorage.setItem("hasSeenTutorial", "true");
	};

    useEffect(() => {
        const takePhotoClicked = localStorage.getItem("takePhotoClicked");
        if (!takePhotoClicked) {
            navigate("/"); //homepage
        }
    }, [navigate]);

    return (
		<div>
			<Header ShowSignOutHeader={true} />
			<div className="homeBody NoAI">
				<div className="popupBackgroundBlur">
					{isSending && (
						<div className="popupWrapper">
							<div className="recoginitionPopup">
								<span className="loaderIcon"></span>
								<div className="sendingMessage">
									<h5>Carregando sua foto...</h5>
								</div>
							</div>
						</div>
					)}
				</div>
				<div className="homeTutorial">
					<div className="homeTutorialWrapper">
						<div className="homeTutorialFace">
							<TutorialFaceIcon />
							<TutorialUserIcon />
							<TutorialHairIcon />
							<TutorialBorderIcon />
						</div>
						<TextCarousel slides={TutorialSlides} onComplete={handleTutorialComplete} />
					</div>
				</div>
				<div className="homeTutorialButton">
					<button
						onClick={() => {
							setIsTutorialActive(!isTutorialActive);
							resetTutorial();
						}}
					>
						<svg className="tutorialIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path d="M12 4C9.23772 4 7 6.23772 7 9C7 9.55228 7.44772 10 8 10C8.55228 10 9 9.55228 9 9C9 7.34228 10.3423 6 12 6C13.6577 6 15 7.34228 15 9C15 9.81648 14.8014 10.2945 14.5621 10.6286C14.3004 10.9938 13.9373 11.2671 13.4335 11.6135L13.3183 11.6923C12.8712 11.9977 12.2953 12.391 11.8493 12.9392C11.3224 13.5869 11 14.4061 11 15.5V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V15.5C13 14.8439 13.1776 14.4756 13.4007 14.2014C13.6567 13.8868 14.0026 13.6491 14.5137 13.2978L14.5665 13.2615C15.0627 12.9204 15.6996 12.4749 16.1879 11.7933C16.6986 11.0805 17 10.1835 17 9C17 6.23772 14.7623 4 12 4ZM12 21.25C12.6904 21.25 13.25 20.6904 13.25 20C13.25 19.3096 12.6904 18.75 12 18.75C11.3096 18.75 10.75 19.3096 10.75 20C10.75 20.6904 11.3096 21.25 12 21.25Z" />
						</svg>
					</button>
				</div>
				<div className="captureBody">
					{!imgSrc && <div className="helpTextContainer">Posicione seu rosto no centro</div>}
					<div
						className={`outerContainer ${isOuterContainerExpanded ? "expanded" : ""}`}
						style={{
							borderRadius: imgSrc ? undefined : "0",
						}}
					>
						<div className="innerContainer">
							{!imgSrc && (
								<div className="faceLandmarksContainer">
									<div className="bound" style={{ borderColor: "var(--capture-bound-color-no-ai)" }} />
								</div>
							)}
							<div className="webcamContainer">
								{hasError && (
									<div className="errorText">
										{hasError}
										<button onClick={() => window.location.reload()}>Recarregar</button>
									</div>
								)}
								{imgSrc ? (
									<img src={imgSrc} width={500} height={500} alt="print" className="imageSrc" />
								) : (
									!isTutorialActive && (
										<Webcam
											autoPlay
											audio={false}
											ref={WebCamRef}
											videoConstraints={{
												facingMode: "user",
												
											}}
											mirrored
											onUserMediaError={onMediaError}
										/>
									)
								)}
							</div>
						</div>
					</div>
					{imgSrc && (
						<div className="buttonsContainer">
							<button
								className="btn buttonOk"
								onClick={(e) => {
									e.preventDefault();
									onLikePressed();
								}}
							>
								Gostei
								<ThumbsUp size={20} />
							</button>
							<button
								className="btn buttonRetake"
								onClick={(e) => {
									e.preventDefault();
									onResetCapturePressed();
								}}
							>
								Tirar outra
								<Camera size={20} />
							</button>
						</div>
					)}
					{!imgSrc && (
						<div className="buttonsContainer">
							<button
								className="btn buttonTakePhoto"
								onClick={(e) => {
									e.preventDefault();
									takeScreenshot();
								}}
							>
								Tirar Foto
								<Camera />
							</button>
						</div>
					)}
				</div>
				<Link to="/" className="linkToHome">
					<svg className="arrowIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path d="M15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L9.41421 12L15.7071 18.2929C16.0976 18.6834 16.0976 19.3166 15.7071 19.7071C15.3166 20.0976 14.6834 20.0976 14.2929 19.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289Z" />
					</svg>
					<div>Mudei de ideia</div>
				</Link>
			</div>
		</div>
	);
}
