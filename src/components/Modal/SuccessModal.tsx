import { Check } from 'lucide-react';
import React from "react";
import "./Modal.scss";

interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	message: string;
	instruction: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, message, instruction }) => {
	if (!isOpen) return null;

	return (
		<div className="modalOverlay">
			<div className="wrapperSuccess">
				<div className="mb-2">
					<Check className="iconModal" />
				</div>
				<h2 className="titleModal">{message}</h2>
				<p className="textMutedModal">{instruction}</p>
				<button onClick={onClose} className="buttonModal">
					OK
				</button>
			</div>
		</div>
	);
};

export default SuccessModal;
