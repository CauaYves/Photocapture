import axios from "axios";
import { Camera, Check, Image, ScanEye, CircleAlert } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import defaultUser from "../../assets/images/default-user.jpg";
import { loadAppSettings } from "../../config/configLoader";
import { cadasterMemberPhoto, getMemberPhoto, listMembers } from "../../services/api";
import { faultMessages } from "../Modal/FaultMessagesModal";
import { successMessages } from "../Modal/SuccessMessagesModal";

export interface Member {
	memberId: string;
	name: string;
	birthDate: string;
	document: string;
	hasActiveBiometricCadaster: boolean;
	isTitular: boolean;
	hasPhoto: boolean;
	imageUrl: string;
}

interface MemberCardProps {
	member: Member;
	name: string;
	birthDate: string;
	document: string;
	imageUrl: string;
	index: number;
	isTitular: boolean;
	hasPhoto: boolean;
	onTakePhotoClick: (index: number, memberId: string) => void;
	onTakePhotoClickNoAI: (index: number, memberId: string) => void;
	onUpdateImage: (newImageUrl: string) => Promise<void>;
	onUpdateHasPhoto: (index: number, hasPhoto: boolean) => void;
}

const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
};

const formatCPF = (cpf: string | null): string => {
	if (!cpf) return "sem documento";

	return cpf;
};

const MemberCard: React.FC<MemberCardProps> = ({
	member,
	name,
	birthDate,
	document,
	imageUrl,
	index,
	isTitular,
	hasPhoto,
	onTakePhotoClick,
	onTakePhotoClickNoAI,
	onUpdateHasPhoto,
}) => {
	const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
	const [config, setConfig] = useState({ enableFaceDetection: false });
	const [isUploading, setIsUploading] = useState(false);
	const [imageLoading, setImageLoading] = useState(true);
	const [errorType, setErrorType] = useState<string | null>(null);

	useEffect(() => {
		const fetchConfig = async () => {
			try {
				const appSettings = await loadAppSettings();
				setConfig(appSettings);
			} catch (error) {
				faultMessages.showError(error);
			}
		};
		fetchConfig();
	}, []);

	const handleMemberPhoto = useCallback(async () => {
		setImageLoading(true);
		try {
			var response = await getMemberPhoto(member.memberId);

			if (response.status === 200) {
				const base64String = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ""));
				const newImageUrl = `data:image/jpeg;base64,${base64String}`;
				setCurrentImageUrl(newImageUrl);
				onUpdateHasPhoto(index, true);
				console.log("hasPhoto -> true");
			}
		} catch (error) {
			// Não é exatamente um erro, um usúario sem foto vai cair aqui por exemplo
			if (axios.isAxiosError(error) && error.response) {
				if (error.response.status === 400) {
					console.error("Requisição inválida", error);
				} else if (error.response.status === 404) {
					console.warn("Nenhuma imagem encontrada", error);
				} else {
					console.error("Erro ao buscar imagem", error);
				}
			} else {
				console.error("Erro ao buscar imagem", error);
				setErrorType("unexpected");
			}
		} finally {
			setImageLoading(false);
		}
	}, [index, member.memberId, onUpdateHasPhoto]);

	useEffect(() => {
		setCurrentImageUrl(imageUrl);
		handleMemberPhoto();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageUrl, index, member.memberId]); // Com o handleMemberPhoto, a execução fica em loop. Além de que ele não precisa ser adicionado aqui para funcionar.

	// Redefine o input (remove o efeito de :focus / :active)
	const removeInputStyles = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event && event.target) {
			event.target.blur();
			event.target.value = "";
			return;
		}
		return;
	};

	const handleImageLoad = () => {
		setImageLoading(false); // A imagem foi carregada, então o loading é escondido.
	};

	const handleUploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
		window.removeEventListener("photoUploadStarted", () => {});
		window.removeEventListener("photoUploadFinished", () => {});

		if (isUploading) return;
		setIsUploading(true);

		const uploadingPhotoEvent = new Event("photoUploadStarted");
		const uploadedPhotoEvent = new Event("photoUploadFinished");

		window.dispatchEvent(uploadingPhotoEvent);

		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			const newImageUrl = URL.createObjectURL(file);

			// Converte a imagem para base64 para envio
			const reader = new FileReader();
			reader.onloadend = async () => {
				try {
					// Chama a API para salvar a imagem no servidor
					const response = await cadasterMemberPhoto(member.memberId, file);

					if (response.isFailure) {
						// Tratamento de erro
						if (response.error === "Not Found") {
							faultMessages.showError(
								"Isso foi... Inesperado",
								"Tente recarregar a página e tirar outra foto, isso deve arrumar esse problema que tivemos.",
								undefined,
								true
							);
							console.error(response.error);
						} else {
							faultMessages.showError("Falha no envio", response.error);
							console.error(response.error);
						}

						handleMemberPhoto();
					} else {
						console.info("Imagem salva com sucesso");
						successMessages.showSuccess("Tudo certo", "Sua foto foi salva, ela está segura com a gente agora.");
						setCurrentImageUrl(newImageUrl);
						onUpdateHasPhoto(index, true);
					}
				} catch (error) {
					// Especificamente o código do erro:timeout
					if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
						faultMessages.showError(
							"Tempo esgotado",
							"Sua foto demorou tanto tempo para chegar, que o nosso servidor cansou de esperar. Isso geralmente é causado por uma conexão lenta ou instável.\n Iremos recarregar a página agora para verificar se sua foto realmente não foi enviada.",
							undefined,
							true
						);
						console.error("Erro ao salvar a imagem:", error);
					} else {
						faultMessages.showError(
							"Isso é... novo",
							"Parece que você foi premiado com um erro novo. Tente recarregar a página, funciona 90% das vezes.",
							undefined,
							true
						);
						console.error(error);
					}
				} finally {
					removeInputStyles(event);
					window.dispatchEvent(uploadedPhotoEvent);
					setIsUploading(false);
					handleMemberPhoto();
				}
			};
			// Inicia a leitura do arquivo como base64
			reader.readAsDataURL(file);
		}
	};

	const handleTakePhotoClick = async (index: number, memberId: string) => {
		onTakePhotoClick(index, memberId);
	};

	const handleTakePhotoClickNoAI = async (index: number, memberId: string) => {
		onTakePhotoClickNoAI(index, memberId);
	};

	return (
		<div className="wrapperCard">
			<div className="homeCardImage">
				{imageLoading ? (
					<div className="loaderIcon"></div>
				) : errorType === "unexpected" ? (
					<div className="errorIcon">
						<CircleAlert className="iconImage" />
						<p>Ocorreu um erro ao tentar carregar a imagem.</p>
					</div>
				) : (
					<img src={currentImageUrl || defaultUser} alt={name} onLoad={handleImageLoad} />
				)}
			</div>
			<div className="homeCardContent">
				<div className="homeCardMember">
					<b title={name}>{name}</b>
					<p>{isTitular ? "Titular" : "Dependente"}</p>
				</div>
				<div className="homeCardMemberInfo">
					<div className="homeMemberBirth">
						<p>Data de nascimento</p>
						<b>{formatDate(birthDate)}</b>
					</div>
					<div className="homeMemberDoc">
						<p>Documento</p>
						<b>{formatCPF(document)}</b>
					</div>
				</div>
				<div className="homeCardButton">
					{config.enableFaceDetection ? (
						<button className="homeTakePhoto" onClick={() => handleTakePhotoClick(index, member.memberId)}>
							<ScanEye className="iconImage" />
						</button>
					) : (
						<button style={{ display: "none" }}></button>
					)}

					<label htmlFor={`upload-photo-${index}`} className="homeUploadPhoto">
						<input
							type="file"
							id={`upload-photo-${index}`}
							accept=".jpg, .jpeg, .png, .tiff, .tif"
							onChange={(e) => handleUploadPhoto(e)}
							className="homeUploadPhotoInput"
						/>
						<Image className="iconImage" />
						<p>Galeria</p>
					</label>

					<button className="homeTakePhotoNoAi" onClick={() => handleTakePhotoClickNoAI(index, member.memberId)}>
						<Camera className="iconImage" />
						<p>Câmera</p>
					</button>
				</div>
			</div>
		</div>
	);
};

export default MemberCard;
