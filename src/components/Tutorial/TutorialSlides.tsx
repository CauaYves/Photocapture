import "./Home.Tutorial.css";
import "./Home.Responsive.Tutorial.css";


export const closeTutorialButton = () => {
    document.querySelector('.homeTutorial')?.classList.remove('opacityControl');
    localStorage.setItem('hasSeenTutorial', 'true');
    window.dispatchEvent(new Event('tutorialClosed'));
};


export const TutorialSlides = [
	{
		id: 1,
		content: (
			<div className="homeTutorialContent">
				<div className="homeTutorialTitle">
					<h2>Bem-Vindo</h2>
					<button onClick={closeTutorialButton}>
						<svg className="closeTutorialButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path d="M11.8834 3.00673L12 3C12.5128 3 12.9355 3.38604 12.9933 3.88338L13 4V11H20C20.5128 11 20.9355 11.386 20.9933 11.8834L21 12C21 12.5128 20.614 12.9355 20.1166 12.9933L20 13H13V20C13 20.5128 12.614 20.9355 12.1166 20.9933L12 21C11.4872 21 11.0645 20.614 11.0067 20.1166L11 20V13H4C3.48716 13 3.06449 12.614 3.00673 12.1166L3 12C3 11.4872 3.38604 11.0645 3.88338 11.0067L4 11H11V4C11 3.48716 11.386 3.06449 11.8834 3.00673L12 3L11.8834 3.00673Z" />
						</svg>
					</button>
				</div>
				<div className="homeTutorialText">
					<p>
						Nesta página, você poderá cadastrar sua foto para a biometria facial. Você pode escolher enviar uma foto diretamente do seu computador
						ou smartphone ou, se preferir, tirar uma nova foto agora mesmo. A seguir, um breve manual de boas práticas para escolher ou capturar uma
						foto.
					</p>
				</div>
			</div>
		),
	},
	{
		id: 2,
		content: (
			<div className="homeTutorialContent">
				<div className="homeTutorialTitle">
					<h2>Boas práticas</h2>
					<button onClick={closeTutorialButton}>
						<svg className="closeTutorialButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path d="M11.8834 3.00673L12 3C12.5128 3 12.9355 3.38604 12.9933 3.88338L13 4V11H20C20.5128 11 20.9355 11.386 20.9933 11.8834L21 12C21 12.5128 20.614 12.9355 20.1166 12.9933L20 13H13V20C13 20.5128 12.614 20.9355 12.1166 20.9933L12 21C11.4872 21 11.0645 20.614 11.0067 20.1166L11 20V13H4C3.48716 13 3.06449 12.614 3.00673 12.1166L3 12C3 11.4872 3.38604 11.0645 3.88338 11.0067L4 11H11V4C11 3.48716 11.386 3.06449 11.8834 3.00673L12 3L11.8834 3.00673Z" />
						</svg>
					</button>
				</div>
				<div className="homeTutorialText">
					<p>Para garantir que sua foto tenha a melhor qualidade, siga estas recomendações:</p>
					<ul>
						<li>
							<b>Mantenha uma distância adequada da câmera,</b> evitando ficar muito perto ou muito longe.
						</li>
						<li>
							<b>Centralize seu rosto dentro do círculo</b>, o mantendo reto, paralelo à câmera.
						</li>
						<li>
							<b>Mantenha os olhos abertos</b>, visíveis e direcionados para a câmera.
						</li>
					</ul>
				</div>
			</div>
		),
	},
	{
		id: 3,
		content: (
			<div className="homeTutorialContent">
				<div className="homeTutorialTitle">
					<h2>Boas práticas</h2>
					<button onClick={closeTutorialButton}>
						<svg className="closeTutorialButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path d="M11.8834 3.00673L12 3C12.5128 3 12.9355 3.38604 12.9933 3.88338L13 4V11H20C20.5128 11 20.9355 11.386 20.9933 11.8834L21 12C21 12.5128 20.614 12.9355 20.1166 12.9933L20 13H13V20C13 20.5128 12.614 20.9355 12.1166 20.9933L12 21C11.4872 21 11.0645 20.614 11.0067 20.1166L11 20V13H4C3.48716 13 3.06449 12.614 3.00673 12.1166L3 12C3 11.4872 3.38604 11.0645 3.88338 11.0067L4 11H11V4C11 3.48716 11.386 3.06449 11.8834 3.00673L12 3L11.8834 3.00673Z" />
						</svg>
					</button>
				</div>
				<div className="homeTutorialText">
					<p>Para evitar possíveis problemas no reconhecimento facial, siga estas recomendações:</p>
					<ul>
						<li>
							<b>Não use óculos de sol, chapéus</b> ou qualquer objeto que cubra ou distorça o rosto.
						</li>
						<li>
							<b>Envie uma foto nítida e de boa qualidade</b> para assegurar um bom reconhecimento facial.
						</li>
						<li>
							<b>Evite usar filtros na foto,</b> mantendo-a o mais natural possível.
						</li>
					</ul>
				</div>
			</div>
		),
	},
	{
		id: 4,
		content: (
			<div className="homeTutorialContent">
				<div className="homeTutorialTitle">
					<h2>Boas práticas</h2>
					<button onClick={closeTutorialButton}>
						<svg className="closeTutorialButton" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path d="M11.8834 3.00673L12 3C12.5128 3 12.9355 3.38604 12.9933 3.88338L13 4V11H20C20.5128 11 20.9355 11.386 20.9933 11.8834L21 12C21 12.5128 20.614 12.9355 20.1166 12.9933L20 13H13V20C13 20.5128 12.614 20.9355 12.1166 20.9933L12 21C11.4872 21 11.0645 20.614 11.0067 20.1166L11 20V13H4C3.48716 13 3.06449 12.614 3.00673 12.1166L3 12C3 11.4872 3.38604 11.0645 3.88338 11.0067L4 11H11V4C11 3.48716 11.386 3.06449 11.8834 3.00673L12 3L11.8834 3.00673Z" />
						</svg>
					</button>
				</div>
				<div className="homeTutorialText">
					<p>Para obter um bom resultado no reconhecimento facial, siga estas dicas:</p>
					<ul>
						<li>
							<b>Garanta uma boa iluminação</b> ao tirar ou enviar a foto, evitando sombras no rosto.
						</li>
						<li>
							<b>Mantenha uma expressão facial neutra</b> para facilitar o reconhecimento.
						</li>
						<li>
							<b>Escolha um fundo neutro</b> para que seu rosto se destaque mais facilmente na imagem.
						</li>
					</ul>
				</div>
			</div>
		),
	},
];