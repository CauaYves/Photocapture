import { isValid, parse, isAfter } from "date-fns";

export const validateCPF = (cpf) => {
	cpf = cpf.replace(/[^\d]+/g, "");
	if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
	let sum = 0;
	for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
	let remainder = (sum * 10) % 11;
	if (remainder === 10 || remainder === 11) remainder = 0;
	if (remainder !== parseInt(cpf.substring(9, 10))) return false;
	sum = 0;
	for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
	remainder = (sum * 10) % 11;
	if (remainder === 10 || remainder === 11) remainder = 0;
	if (remainder !== parseInt(cpf.substring(10, 11))) return false;
	return true;
};

export const validadeBirthDate = (birthDate, today) => {
	const parsedDate = parse(birthDate, "dd/MM/yyyy", new Date());

	if (!isValid(parsedDate)) {
		if (/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
			return { isValid: false, errorCode: "INVALID_DATE" }; // Data inválida (ex: 12/30/2018)
		} else {
			return { isValid: false, errorCode: "FORMAT_ERROR" }; // Erro de formatação (ex: 12/03/20__)
		}
	}

	if (isAfter(parsedDate, today)) {
		return { isValid: false, errorCode: "FUTURE_DATE" }; // Data no futuro (ex: 12/09/2043)
	}

	return { isValid: true };
};
