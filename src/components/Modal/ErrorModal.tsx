import React from "react";
import { CircleAlert } from "lucide-react";
import "./Modal.scss";

interface ErrorModalProps {
	isOpen: boolean;
	onClose: () => void;
	message: string;
	instruction: string;
	onOkClick?: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, message, instruction, onOkClick }) => {
	if (!isOpen) return null;

	return (
		<div className="modalOverlay">
			<div className="wrapperError">
				<div className="mb-2">
					<CircleAlert className="iconModal" />
				</div>
				<h2 className="titleModal">{message}</h2>
				<p className="textMutedModal">{instruction}</p>
				<button
					onClick={onOkClick || onClose}
					className={`mb-3 ${"buttonModal"}`}
				>
					OK
				</button>
			</div>
		</div>
	);
};

export default ErrorModal;
