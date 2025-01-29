export class FaultMessages {
	private openModal: ((message: string, instruction?: string, onOkClick?: () => void) => void) | null;
	private closeModal: (() => void) | null;
	private navigate: (path: string) => void;
	private isUnauthorized = false;

	constructor() {
		this.openModal = null;
		this.closeModal = null;
		this.navigate = () => {};
	}

	init(openModal: (message: string, instruction?: string, onOkClick?: () => void) => void, closeModal: () => void, navigate: (path: string) => void) {
		this.openModal = openModal;
		this.closeModal = closeModal;
		this.navigate = navigate;
	}

	handleUnauthorized() {
		if (this.isUnauthorized) {
			localStorage.removeItem("titleCode");
			localStorage.setItem("showSignOutHeader", "false");
			localStorage.setItem("hasLoggedInBefore", "false");
			this.navigate("/entrar");
		}

		if (this.closeModal) {
			this.closeModal();
		}
	}

	showError(error: string | any, instruction?: string, callback?: () => void, shouldReload?: boolean): void {
		if (callback) {
			callback();
		}

		console.log("showError chamado com:", { error, instruction, callback, shouldReload });
		this.isUnauthorized = false;

		const onOkClick = shouldReload ? () => window.location.reload() : undefined;

		if (typeof error === "string") {
			instruction = instruction || "Tente novamente.";

			if (this.openModal) {
				this.openModal(error, instruction, onOkClick);
				console.log("Abrindo modal com:", { error, instruction, onOkClick });
			}
		} else {
			let message = "";
			let instruction = "";

			if (error.response && error.response.status) {
				const { status } = error.response;
				console.warn("Error code:", status);
				if (status === 401) {
					this.isUnauthorized = true;
					return;
				} else if (status === 500) {
					message = "Pegamos um impostor";
					instruction = "Nosso servidor estava cochilando durante expediente, já estamos acordando ele. Tenta voltar daqui a pouco!";
				} else {
					message = "Algo aconteceu!";
					instruction = "Mas não sabemos exatamente o que. Tente recarregar a página, geralmente funciona.";
				}
			} else {
				message = "Perdemos você!";
				instruction = "Não conseguimos estabelecer uma conexão com você, uma pena. Recarregar a página pode ajudar nisso, vamos tentar novamente!";
				this.isUnauthorized = true;
			}

			if (this.openModal) {
				this.openModal(message, instruction, onOkClick);
			}
		}
	}

	close() {
		this.handleUnauthorized();
	}
}
