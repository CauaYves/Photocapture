import { useState, useEffect } from "react";

export const useUploadMessage = (uploadingPhoto: boolean) => {
	const [sendingMessage, setSendingMessage] = useState({
		title: "Carregando sua foto...",
		description: "Não saia dessa página, espere o carregamento concluir.",
	});
	const [isTransitioning, setIsTransitioning] = useState(false); // Controle de transição

	useEffect(() => {
		if (uploadingPhoto) {
			setSendingMessage({
				title: "Carregando sua foto...",
				description: "Não saia dessa página, espere o carregamento concluir.",
			});

			const timeout1 = setTimeout(() => {
				setIsTransitioning(true);

				setTimeout(() => {
					setSendingMessage({
						title: "Isso pode demorar...",
						description: "A imagem parece pesada, ou sua conexão é um pouco lenta. Aguarde um pouco mais...",
					});
					setIsTransitioning(false);
				}, 300);
			}, 10000);

			const timeout2 = setTimeout(() => {
				setIsTransitioning(true);

				setTimeout(() => {
					setSendingMessage({
						title: "Ainda carregando...",
						description: "O tempo está acabando... Se sua imagem não carregar, tente outra ou use uma conexão mais rápida.",
					});
					setIsTransitioning(false);
				}, 300);
			}, 20000);

			return () => {
				clearTimeout(timeout1);
				clearTimeout(timeout2);
			};
		}

		return () => {
			setSendingMessage({
				title: "Carregando sua foto...",
				description: "Não saia dessa página, espere o carregamento concluir.",
			});
		};
	}, [uploadingPhoto]);

	return { sendingMessage, isTransitioning };
};
