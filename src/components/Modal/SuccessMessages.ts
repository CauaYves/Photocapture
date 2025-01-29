export class SuccessMessages {
    private openModal: ((message: string, instruction?: string) => void) | null;
    private closeModal: (() => void) | null;

    constructor() {
        this.openModal = null;
        this.closeModal = null;
    }

    init(openModal: (message: string, instruction?: string) => void, closeModal: () => void) {
        this.openModal = openModal;
        this.closeModal = closeModal;
    }

    handleClose() {
        if (this.closeModal) {
            this.closeModal();
        }
    }

    showSuccess(message: string, instruction: string): void {
        if (this.openModal) {
            this.openModal(message, instruction);
        }
    }

    close() {
        this.handleClose();
    }
} 