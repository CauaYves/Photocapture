import React, { useState, useEffect } from "react";

interface TextCarouselProps {
	slides: { id: number; content: React.ReactNode }[]; // Lista de slides com textos personalizados
	duration?: number; // Tempo em milissegundos para cada slide
	onComplete: () => void; // Callback para quando o tutorial for concluído
}

const TextCarousel: React.FC<TextCarouselProps> = ({ slides, duration = 5000, onComplete }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [progress, setProgress] = useState(0);
	const [showTutorial, setShowTutorial] = useState(true); // Controla a exibição do tutorial

	useEffect(() => {
		const handleResetTutorial = () => {
			// Mostrar e resetar o tutorial quando o usuário clicar no "?"
            document.querySelector(".homeTutorial")?.classList.add("opacityControl");
			setShowTutorial(true);
			setCurrentIndex(0);
			setProgress(0);
		};
		const handleTutorialClosed = () => {
			// Lidar com o botão de fechamento da "Aba" tutorial
			setShowTutorial(false);
			onComplete(); // Chama o callback quando o tutorial é fechado
		};

		window.addEventListener("resetTutorial", handleResetTutorial);
		window.addEventListener("tutorialClosed", handleTutorialClosed);

		return () => {
			window.removeEventListener("resetTutorial", handleResetTutorial);
			window.removeEventListener("tutorialClosed", handleTutorialClosed);
		};
	}, [onComplete]);

	useEffect(() => {
        const hasSeenTutorial = localStorage.getItem("hasSeenTutorial") === "true";
		if (hasSeenTutorial) {
			setShowTutorial(false);
		} else {
			document.querySelector(".homeTutorial")?.classList.add("opacityControl");
		}
	}, []);

	// Avança automaticamente após a duração
	useEffect(() => {
		if (!showTutorial) return;
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					if (currentIndex === slides.length - 1) {
						document.querySelector(".homeTutorial")?.classList.remove("opacityControl");
						localStorage.setItem("hasSeenTutorial", "true");
						setShowTutorial(false);
						onComplete(); // Chama o callback quando o tutorial é concluído
					} else {
						setCurrentIndex((prevIndex) => prevIndex + 1);
					}
				}
				return prev + 1;
			});
		}, duration / 33); // Atualiza o progresso gradualmente

		return () => clearInterval(interval);
	}, [currentIndex, slides.length, duration, showTutorial, onComplete]);

	// Reseta o progresso quando o slide muda
	useEffect(() => {
		setProgress(0);
	}, [currentIndex, showTutorial]);

	useEffect(() => {
		const prevButton = document.querySelector(".carouselControl.prev");
		const nextButton = document.querySelector(".carouselControl.next");
		if (currentIndex === 0) {
			prevButton?.classList.add("disabled");
		} else {
			prevButton?.classList.remove("disabled");
		}
		if (currentIndex === slides.length - 1) {
			nextButton?.classList.add("last");
			nextButton?.classList.add("active");
		} else {
			nextButton?.classList.remove("last");
			nextButton?.classList.remove("active");
		}
	}, [currentIndex, slides.length]);

	// Função para avançar manualmente
	const nextSlide = () => {
		if (currentIndex === slides.length - 1) {
			// Faz o tutorial desaparecer se estiver no último slide e clicar para avançar
			document.querySelector(".homeTutorial")?.classList.remove("opacityControl");
			localStorage.setItem("hasSeenTutorial", "true");
			setShowTutorial(false);
			onComplete(); // Chama o callback quando o tutorial é concluído
		} else {
			setCurrentIndex((prevIndex) => prevIndex + 1);
			setProgress(0);
		}
	};

	// Função para retroceder manualmente
	const prevSlide = () => {
		if (currentIndex === 0) {
			setCurrentIndex(slides.length - 1);
		} else {
			setCurrentIndex((prevIndex) => prevIndex - 1);
		}
		setProgress(0);
	};

	// Função para ir para um slide específico
	const goToSlide = (index: number) => {
		setCurrentIndex(index);
		setProgress(0);
	};

	if (!showTutorial) {
		document.querySelector(".homeTutorial")?.classList.remove("opacityControl");
	}

	return (
		<div className="textCarousel">
			<div className="carouselContent">
				{slides[currentIndex].content} {/* "Renderizando os slides" */}
			</div>

			<div className="carouselProps">
				<button className={`carouselControl prev ${currentIndex === 0 ? "disabled" : ""}`} onClick={prevSlide}>
					<svg className="prevSlide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path 
							d="M15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L9.41421 12L15.7071 18.2929C16.0976 18.6834 16.0976 19.3166 15.7071 19.7071C15.3166 20.0976 14.6834 20.0976 14.2929 19.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289Z" 
						/>
					</svg>
				</button>

				<div className="carouselIndicators">
					<div>
						{slides.map((slide, index) => (
							<div key={slide.id} className={`indicator ${index === currentIndex ? "active" : ""}`} onClick={() => goToSlide(index)}></div>
						))}
					</div>
					<div className="progressDiv">
						<div className="progressBar" style={{ transform: `translate(${progress}%)` }}></div>
					</div>
				</div>

				<button className="carouselControl next" onClick={nextSlide}>
					<svg className="nextSlide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path
							d={
								document.querySelector(".carouselControl.next")?.classList.contains("last")
									? "M11.8834 3.00673L12 3C12.5128 3 12.9355 3.38604 12.9933 3.88338L13 4V11H20C20.5128 11 20.9355 11.386 20.9933 11.8834L21 12C21 12.5128 20.614 12.9355 20.1166 12.9933L20 13H13V20C13 20.5128 12.614 20.9355 12.1166 20.9933L12 21C11.4872 21 11.0645 20.614 11.0067 20.1166L11 20V13H4C3.48716 13 3.06449 12.614 3.00673 12.1166L3 12C3 11.4872 3.38604 11.0645 3.88338 11.0067L4 11H11V4C11 3.48716 11.386 3.06449 11.8834 3.00673L12 3L11.8834 3.00673Z"
									: "M8.29289 4.29289C7.90237 4.68342 7.90237 5.31658 8.29289 5.70711L14.5858 12L8.29289 18.2929C7.90237 18.6834 7.90237 19.3166 8.29289 19.7071C8.68342 20.0976 9.31658 20.0976 9.70711 19.7071L16.7071 12.7071C17.0976 12.3166 17.0976 11.6834 16.7071 11.2929L9.70711 4.29289C9.31658 3.90237 8.68342 3.90237 8.29289 4.29289Z"
							}
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default TextCarousel;
