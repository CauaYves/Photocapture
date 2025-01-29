import * as faceapi from "@vladmandic/face-api/dist/face-api.esm.js";
import { Camera, ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { getBaseUrlForModels } from "../../utils/BasenameHandler";
import Header from "../Header/Header";
import { isSignedIn } from "../../services/api";
import { faultMessages } from "../Modal/FaultMessagesModal";
import TextCarousel from "../Tutorial/HomeTutorialCarousel";
import { TutorialSlides } from "../Tutorial/TutorialSlides";
import { TutorialFaceIcon } from "../../assets/icons/tutorial-face-icon";
import { TutorialUserIcon } from "../../assets/icons/tutorial-user-icon";
import { TutorialHairIcon } from "../../assets/icons/tutorial-hair-icon";
import { TutorialBorderIcon } from "../../assets/icons/tutorial-box-icon";
import "./Capture.css";
import "./Capture.Responsive.css";

export const resetTutorial = () => {
	localStorage.setItem("hasSeenTutorial", "false");
	window.dispatchEvent(new CustomEvent("resetTutorial"));
};

type postionsProps = "far" | "adjust to center" | "near" | "keep";

interface IFaceRecoginitionsWithPosV2 {
	callback?: (imgSrc: string | undefined) => void;
}

export default function FaceRecoginitionsWithPosV2(props: IFaceRecoginitionsWithPosV2) {
	const [isLoading, setLoading] = useState(true);
	const [hasError] = useState<undefined | string>();
	const [adjustPosition, setadjustPosition] = useState<postionsProps>();
	const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
	const WebCamRef = useRef<Webcam>(null);
	const [isSending, setIsSending] = useState(false);
	const [isTutorialActive, setIsTutorialActive] = useState(false);
	const [hasSeenTutorial, setHasSeenTutorial] = useState(localStorage.getItem("hasSeenTutorial") === "true");
	const [hasShownAlert, setHasShownAlert] = useState(false);
	const isSigninRef = useRef(false);

	const tolerance = isMobile ? 20 : 15;
	const isFaceNearDistance = isMobile ? 58 : 48;
	const isFaceFarDistance = isMobile ? 70 : 60;
	const angleTolerance = 2;
	//Center
	const desiredEyeX = isMobile ? 235 : 246;
	const desiredEyeY = isMobile ? 227 : 243;
	const desiredMouthX = isMobile ? 236 : 246;
	const desiredMouthY = isMobile ? 336 : 344;

	const takeScreenshoot = useCallback(() => {
		if (WebCamRef.current) {
			//@ts-ignore
			const _img = WebCamRef.current.getScreenshot();
			setImgSrc(_img as string);
			if (props.callback) props.callback(_img as string);
		}
	}, [WebCamRef, setImgSrc, props]);

	const onMedia = async (e: any) => {};

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
		setadjustPosition(undefined);
		setLoading(true);
		setIsSending(false);
		console.log("imgsrc =", imgSrc);
		console.log("position =", adjustPosition);
		if (props.callback) props.callback(undefined);
	};

	useEffect(() => {
		let trackingProcess: any;
		let isModelsLoaded = false;
		let hasModel: any = false;
		let counting = 0;

		const loadModels = async () => {
			const baseUrlModels = await getBaseUrlForModels();

			await faceapi.nets.tinyFaceDetector.loadFromUri(baseUrlModels);
			await faceapi.nets.faceLandmark68TinyNet.loadFromUri(baseUrlModels);
			await faceapi.nets.faceRecognitionNet.loadFromUri(baseUrlModels);
			await faceapi.nets.ssdMobilenetv1.loadFromUri(baseUrlModels);
		};

		const loadModelsWithCheck = async () => {
			try {
				await loadModels();
				isModelsLoaded = true;
			} catch (e) {
				console.error(e);
				faultMessages.showError("Alguns arquivos desapareceram", "Recarregar a página pode nos ajudar a encontrá-los novamente.", undefined, true);
			}
		};

		if (WebCamRef.current) {
			loadModelsWithCheck();

			const trackFace = async (_hasMedia: boolean) => {
				isLoading && setLoading(false);
				if (WebCamRef.current?.video) {
					try {
						const detection: any = await faceapi
							.detectSingleFace(
								//@ts-ignore
								WebCamRef.current?.video,
								new faceapi.TinyFaceDetectorOptions()
							)
							.withFaceLandmarks(true);

						if (detection) {
							const landmarks = detection.landmarks;
							const angle = detection.angle;

							const leftEye = landmarks.getLeftEye();
							const rightEye = landmarks.getRightEye();
							const mouth = landmarks.getMouth();

							const eyesCenterX = (leftEye[0].x + rightEye[3].x) / 2;
							const eyesCenterY = (leftEye[0].y + rightEye[3].y) / 2;
							const mouthCenterX = (mouth[0].x + mouth[6].x) / 2;
							const mouthCenterY = (mouth[0].y + mouth[6].y) / 2;

							const distanceBetweenEyes = Math.sqrt(Math.pow(rightEye[0]._x - leftEye[3]._x, 2) + Math.pow(rightEye[0]._y - leftEye[3]._y, 2));

							const eyesWithinTolerance = Math.abs(eyesCenterX - desiredEyeX) < tolerance && Math.abs(eyesCenterY - desiredEyeY) < tolerance;
							const mouthWithinTolerance =
								Math.abs(mouthCenterX - desiredMouthX) < tolerance && Math.abs(mouthCenterY - desiredMouthY) < tolerance;

							const angleWithTolerance =
								angle.row > -angleTolerance &&
								angle.row < angleTolerance &&
								angle.pitch > -angleTolerance &&
								angle.pitch < angleTolerance &&
								angle.yaw > -angleTolerance &&
								angle.yaw < angleTolerance;

							return [eyesWithinTolerance, mouthWithinTolerance, distanceBetweenEyes, angleWithTolerance];
						}
					} catch (e) {
						console.error(e);
						faultMessages.showError(
							"Arquivo indecifrável",
							"Alguns arquivos esqueceram como se comunicar com nosso site. Recarregar a página pode faze-los lembrar.",
							undefined,
							true
						);
					}
				}
			};

			const validateFace = async (pos: any) => {
				if (pos[0] && pos[1] && pos[2] > isFaceNearDistance && pos[2] < isFaceFarDistance && angleTolerance) {
					setadjustPosition("keep");
					return true;
				} else {
					if (pos[2] > isFaceNearDistance) setadjustPosition("near");
					if (pos[2] < isFaceFarDistance) setadjustPosition("far");
					if (pos[2] > isFaceNearDistance && pos[2] < isFaceFarDistance) setadjustPosition("adjust to center");
					return false;
				}
			};

			const startService = async () => {
				trackingProcess = setInterval(async () => {
					if (isModelsLoaded) {
						if (WebCamRef.current && WebCamRef.current?.video?.readyState === 4) {
							const result = await trackFace(true);
							if (result) {
								hasModel = await validateFace(result);
								if (hasModel) {
									counting = counting + 1;
									console.log(counting);
									if (counting > 5) {
										clearInterval(trackingProcess);
										takeScreenshoot();
									}
								}
							}
						}
					}
					console.log("Tracking...");
				}, 300);
			};

			const Reset = async () => {
				clearInterval(trackingProcess);
				setHasShownAlert(false);
				window.location.reload();
			};

			document.addEventListener("visibilitychange", Reset);

			startService();

			return () => {
				clearInterval(trackingProcess);
				document.removeEventListener("visibilitychange", Reset);
			};
		}
	}, [
		takeScreenshoot,
		isFaceNearDistance,
		isFaceFarDistance,
		angleTolerance,
		desiredEyeX,
		desiredEyeY,
		desiredMouthX,
		desiredMouthY,
		tolerance,
		isLoading,
		onMediaError,
	]);

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

	const navigate = useNavigate();
	useEffect(() => {
		const takePhotoClicked = localStorage.getItem("takePhotoClicked");
		if (!takePhotoClicked) {
			navigate("/"); //homepage
		}
	}, [navigate]);

	return (
		<div>
			<Header ShowSignOutHeader={true} />
			<div className="HomeBody">
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
					<div
						className="outerContainer"
						style={{
							borderBottomLeftRadius: isLoading ? undefined : "0",
							borderBottomRightRadius: isLoading ? undefined : "0",
						}}
					>
						<div className="innerContainer">
							{isLoading && <div className="spinnerContainer"></div>}
							<div className="faceLandmarksContainer">
								{!isLoading && !hasError && !imgSrc && adjustPosition && (
									<div
										className="bound"
										style={{
											borderColor: adjustPosition === "keep" ? "var(--capture-bound-color-good)" : "var(--capture-bound-color-bad)",
										}}
									/>
								)}
							</div>
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
												width: 500,
												height: 500,
											}}
											width={500}
											height={500}
											mirrored
											onUserMedia={onMedia}
											onUserMediaError={onMediaError}
										/>
									)
								)}
							</div>
						</div>
					</div>
					{!isLoading && !imgSrc && (
						<div className="helpTextContainer">
							{adjustPosition === "far" && <> Aproxime-se </>}
							{adjustPosition === "near" && <> Afaste-se </>}
							{adjustPosition === "adjust to center" && <>Centralize o rosto</>}
							{adjustPosition === "keep" && <div style={{ color: "var(--capture-bound-color-good)" }}>Quase lá...</div>}
							{adjustPosition === undefined && (
								<div>
									<p className="adjustPositionText">Posicione seu rosto na tela</p>
								</div>
							)}
						</div>
					)}
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
								<ThumbsUp />
							</button>
							<button
								className="btn buttonRetake"
								onClick={(e) => {
									e.preventDefault();
									onResetCapturePressed();
								}}
							>
								Tirar outra
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
