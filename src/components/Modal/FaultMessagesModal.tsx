import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorModal from "./ErrorModal";
import { useModal } from "../../hooks/useModal";
import { FaultMessages } from "./FaultMessages";

export const FaultMessagesModal = () => {
	const { isModalOpen, modalMessage, modalInstruction, openModal, closeModal, onOkClick } = useModal();
	const navigate = useNavigate();
	const [shouldReload, setShouldReload] = useState(false);

	useEffect(() => {
		if (openModal && closeModal) {
			faultMessages.init(openModal, closeModal, navigate);
		}
	}, [openModal, closeModal, navigate]);

	const handleOkClick = useCallback(() => {
		if (shouldReload) {
			window.location.reload();
		} else {
			faultMessages.close();
		}
	}, [shouldReload]);

	useEffect(() => {
		const handleShowError = (message: string, instruction?: string, onOkClick?: () => void, reload?: boolean) => {
			setShouldReload(!!reload);
			openModal(message, instruction, onOkClick || handleOkClick);
		};

		faultMessages.init(handleShowError, closeModal, navigate);
	}, [openModal, closeModal, navigate, handleOkClick]);

	return (
		<ErrorModal
			isOpen={isModalOpen}
			onClose={() => faultMessages.close()}
			message={modalMessage}
			instruction={modalInstruction}
			onOkClick={onOkClick || handleOkClick}
		/>
	);
};

export const faultMessages = new FaultMessages();
