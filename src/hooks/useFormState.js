import { parseISO } from "date-fns";
import { useState } from "react";
import { validadeBirthDate, validateCPF } from "../utils/Validators";

export const useFormState = () => {
	const [titleCode, setTitleCode] = useState("");
	const [cpf, setCpf] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [termsAccepted, setTermsAccepted] = useState();
	const [errors, setErrors] = useState({});

	const today = parseISO(new Date().toISOString().split("T")[0]);

	const handleTitleChange = (e) => {
		setTitleCode(e.target.value);
		if (errors.titleCode) {
			setErrors((prev) => ({ ...prev, titleCode: "" }));
		}
	};

	const handleCpfChange = (e) => {
		setCpf(e.target.value);
		if (errors.cpf) {
			setErrors((prev) => ({ ...prev, cpf: "" }));
		}
	};

	const handleBirthDateChange = (e) => {
		setBirthDate(e.target.value);
		if (errors.birthDate) {
			setErrors((prev) => ({ ...prev, birthDate: "" }));
		}
	};

	const handleNumberInput = (e) => {
		const value = e.target.value.replace(/[^0-9]/g, ""); // Remove qualquer caractere que não seja número
		setBirthDate(value);
	};

	const handleCheckboxChange = (e) => {
		const isChecked = e.target.checked;
		setTermsAccepted(isChecked);

		if (errors.termsAccepted) {
			setErrors((prev) => ({ ...prev, termsAccepted: "" }));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!titleCode) {
			newErrors.titleCode = "Preencha com seu título.";
		}
		if (!cpf) {
			newErrors.cpf = "Preencha com seu CPF.";
		} else if (!validateCPF(cpf)) {
			newErrors.cpf = "Esse CPF é inválido.";
		}

		if (!birthDate) {
			newErrors.birthDate = "Preencha com sua data de nascimento.";
		} else {
			const validation = validadeBirthDate(birthDate, today);

			if (!validation.isValid) {
				if (validation.errorCode === "FUTURE_DATE") {
					newErrors.birthDate = "Parece que você nasceu no futuro.";
				} else if (validation.errorCode === "FORMAT_ERROR") {
					newErrors.birthDate = "É importante usar o formato dia/mês/ano.";
				} else if (validation.errorCode === "INVALID_DATE") {
					newErrors.birthDate = "Calma ai, essa data não existe.";
				}
			}
		}

		if (!termsAccepted) {
			newErrors.termsAccepted =
				"Aceite a política de privacidade para prosseguir.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	return {
		titleCode,
		cpf,
		birthDate,
		errors,
		today,
		handleTitleChange,
		handleCpfChange,
		handleBirthDateChange,
		handleNumberInput,
		validateForm,
		handleCheckboxChange,
	};
};
