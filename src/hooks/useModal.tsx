import { useState } from 'react';

export const useModal = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalInstruction, setModalInstruction] = useState('');
    const [onOkClick, setOnOkClick] = useState<(() => void) | undefined>(undefined);

    const openModal = (message: string, instruction?: string, onOkClick?: () => void) => {
        setModalOpen(true);
        setModalMessage(message);
        setModalInstruction(instruction || "");
        setOnOkClick(() => onOkClick);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalMessage("");
        setModalInstruction("");
        setOnOkClick(undefined);
    };

    return { isModalOpen, modalMessage, modalInstruction, openModal, closeModal, onOkClick };
};