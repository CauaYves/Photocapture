import React, { useEffect } from 'react';
import SuccessModal from './SuccessModal';
import { useModal } from '../../hooks/useModal';
import { SuccessMessages } from './SuccessMessages';

export const SuccessMessagesModal = () => {
    const { isModalOpen, modalMessage, modalInstruction, openModal, closeModal } = useModal();

    useEffect(() => {
        if (openModal && closeModal) {
            successMessages.init(openModal, closeModal);
        }
    }, [openModal, closeModal]);

    return (
        <SuccessModal
            isOpen={isModalOpen}
            onClose={() => successMessages.close()}
            message={modalMessage}
            instruction={modalInstruction}
        />
    );
};

export const successMessages = new SuccessMessages();