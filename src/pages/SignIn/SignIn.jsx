import { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { useNavigate } from "react-router";
import Header from "../../components/Header/Header";
import { faultMessages } from "../../components/Modal/FaultMessagesModal";
import { loadAppSettings } from "../../config/configLoader";
import { useFormState } from "../../hooks/useFormState";
import { signin } from "../../services/api";
import { TitleCodeHandler } from "../../utils/TitleCodeHandler";
import "./SignIn.scss";

function SignInPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [terms, setTerms] = useState("");
	const {
		titleCode,
		cpf,
		birthDate,
		errors,
		handleTitleChange,
		handleCpfChange,
		handleBirthDateChange,
		handleNumberInput,
		handleCheckboxChange,
		validateForm,
	} = useFormState();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchConfig = async () => {
			try {
				const { terms } = await loadAppSettings();
				setTerms(terms);
			} catch (error) {
				faultMessages.showError(error);
			}
		};
		fetchConfig();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (validateForm()) {
			setIsLoading(true);
			try {
				const formattedBirthDate = new Date(
					birthDate.split("/").reverse().join("-")
				)
					.toISOString()
					.split("T")[0];
				const response = await signin(titleCode, cpf, formattedBirthDate);

				if (response.isFailure) {
					faultMessages.showError(
						response.error,
						"Se o problema continuar, é só entrar em contato com o suporte. Eles estão aqui para te salvar."
					);
					console.error(response.error);
				} else if (response.isSuccess) {
					navigate("/"); //homepage
				}
			} catch (error) {
				faultMessages.showError(
					"Problema na conexão",
					"Algo parece não estar funcionando como deveria. Pode ser um problema na sua internet ou na nossa conexão. Dá uma conferida na sua enquanto ajustamos as coisas por aqui."
				);
			} finally {
				setIsLoading(false);
			}
		}
	};

	localStorage.setItem("showSignOutHeader", "false");
	localStorage.removeItem("titleCode");

	// Para não executar a cada interação com a página
	useEffect(() => {
		TitleCodeHandler(navigate);
	}, [navigate]);

	return (
		<div>
			<Header ShowSignOutHeader={false} />
			<div className="wrapperContainerSignIn">
				<div className="wrapperSignIn">
					<div className="centeredContent">
						<svg
							className="cameraIconSignIn"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path
								d="M15.8539 6.14569C15.9377 6.2298 16.016 6.31886 16.0883 6.41228C16.2851 6.66664 16.4378 6.95331 16.539 7.26037L16.9868 8.63711C17.0242 8.74322 17.0937 8.8351 17.1856 8.9001C17.2776 8.9651 17.3874 9 17.5 9C17.6126 9 17.7224 8.9651 17.8144 8.9001C17.8964 8.84212 17.9605 8.76273 18 8.67093C18.0048 8.65983 18.0092 8.64855 18.0132 8.63711L18.461 7.26037C18.6003 6.84181 18.8353 6.46147 19.1474 6.14959C19.4595 5.8377 19.8402 5.60285 20.259 5.46372L21.6368 5.01628C21.743 4.97884 21.835 4.90942 21.9 4.81756C21.9651 4.72571 22 4.61596 22 4.50344C22 4.39092 21.9651 4.28117 21.9 4.18932C21.835 4.09747 21.743 4.02804 21.6368 3.99061L21.6093 3.98372L20.2315 3.53628C19.8126 3.39715 19.432 3.1623 19.1198 2.85041C18.8077 2.53853 18.5727 2.15819 18.4335 1.73963L17.9857 0.362894C17.9482 0.256782 17.8787 0.164895 17.7868 0.0998993C17.6949 0.0349035 17.5851 0 17.4724 0C17.3598 0 17.25 0.0349035 17.1581 0.0998993C17.0662 0.164895 16.9967 0.256782 16.9592 0.362894L16.5114 1.73963L16.5 1.77372C16.3623 2.17595 16.1357 2.54224 15.837 2.84537C15.7307 2.95329 15.6162 3.05219 15.4947 3.14131L15.4937 3.14032C15.3882 3.21803 15.2776 3.28852 15.1626 3.35132C15.0277 3.42406 14.8867 3.48599 14.741 3.53628L14.1402 3.73138L13.3605 3.97999C13.2561 4.01974 13.1657 4.08929 13.1005 4.17999C13.0357 4.26734 13.0007 4.37296 13.0002 4.48136C13.0001 4.48642 13 4.49149 13 4.49656C13 4.50393 13.0002 4.5113 13.0004 4.51864C13.0021 4.6133 13.0306 4.70546 13.0825 4.78443C13.0881 4.79333 13.0939 4.80208 13.1 4.81068C13.1481 4.87869 13.2111 4.93441 13.2836 4.97395C13.3082 4.9878 13.3339 4.99986 13.3605 5.00999L14.7405 5.45999C14.9983 5.54473 15.2417 5.66584 15.4637 5.81896C15.6028 5.91566 15.7335 6.02493 15.8539 6.14569ZM23.0175 9.9646L23.7829 10.2132L23.7982 10.217C23.8572 10.2378 23.9083 10.2764 23.9445 10.3274C23.9806 10.3784 24 10.4394 24 10.5019C24 10.5644 23.9806 10.6254 23.9445 10.6764C23.9083 10.7275 23.8572 10.766 23.7982 10.7868L23.0328 11.0354C22.8001 11.1127 22.5886 11.2432 22.4152 11.4164C22.2418 11.5897 22.1113 11.801 22.0339 12.0335L21.7851 12.7984C21.7643 12.8573 21.7257 12.9084 21.6746 12.9445C21.6236 12.9806 21.5626 13 21.5 13C21.4669 13 21.4341 12.9946 21.4031 12.9841C21.3621 12.9752 21.3235 12.9567 21.2905 12.93C21.2358 12.8982 21.1935 12.8489 21.1705 12.79L21.0787 12.3797L20.9661 12.0335C20.8893 11.8003 20.7589 11.5882 20.5855 11.4143C20.412 11.2403 20.2003 11.1093 19.9672 11.0316L19.2018 10.783C19.1428 10.7622 19.0917 10.7236 19.0555 10.6726C19.0194 10.6216 19 10.5606 19 10.4981C19 10.4356 19.0194 10.3746 19.0555 10.3236C19.0917 10.2725 19.1428 10.234 19.2018 10.2132L19.9672 9.9646C20.1971 9.88529 20.4055 9.75392 20.5761 9.58076C20.7467 9.40761 20.875 9.19736 20.9508 8.96646L21.1996 8.20161C21.2204 8.14266 21.259 8.09161 21.31 8.0555C21.3611 8.01939 21.4221 8 21.4847 8C21.5473 8 21.6083 8.01939 21.6593 8.0555C21.7104 8.09161 21.749 8.14266 21.7698 8.20161L22.0186 8.96646C22.0959 9.199 22.2265 9.41029 22.3999 9.58356C22.5733 9.75683 22.7848 9.8873 23.0175 9.9646ZM15 12.5C15 10.8431 13.6569 9.5 12 9.5C10.3431 9.5 9 10.8431 9 12.5C9 14.1569 10.3431 15.5 12 15.5C13.6569 15.5 15 14.1569 15 12.5ZM22 17.75V13.8922C21.8317 13.9697 21.6477 14.0104 21.4605 14.0104C21.1915 14.0104 20.9293 13.9264 20.7105 13.77C20.4841 13.6089 20.313 13.3819 20.2205 13.12L19.9805 12.36C19.9522 12.2736 19.9042 12.1948 19.8405 12.13C19.776 12.0707 19.7015 12.0233 19.6205 11.99L18.8305 11.74C18.576 11.6488 18.3559 11.4812 18.2005 11.26C18.0424 11.0421 17.9583 10.7792 17.9605 10.51C17.9595 10.2777 18.0217 10.0496 18.1405 9.84999C17.9302 9.95794 17.6968 10.0129 17.4605 10.01C17.1423 10.009 16.8319 9.91136 16.5705 9.72999C16.3054 9.5385 16.1062 9.26946 16.0005 8.95999L15.5605 7.57999C15.4942 7.38219 15.3962 7.19645 15.2705 7.02999L15.1205 6.85999C14.9187 6.65835 14.6719 6.50754 14.4005 6.41999L13.0005 5.95999C12.7026 5.84783 12.445 5.64937 12.2605 5.38999C12.0791 5.12855 11.9815 4.81818 11.9805 4.49999C11.9813 4.17868 12.0789 3.86507 12.2605 3.59999C12.4551 3.33802 12.7231 3.13966 13.0305 3.02999L14.3905 2.58999C14.4124 2.58262 14.4343 2.57482 14.4559 2.5666C14.284 2.52485 14.1059 2.50305 13.9247 2.50305H10.1224C9.34026 2.50305 8.61425 2.90921 8.205 3.57571L7.33042 5H5.25C3.45507 5 2 6.45508 2 8.25V17.75C2 19.5449 3.45507 21 5.25 21H18.75C20.5449 21 22 19.5449 22 17.75ZM7.5 12.5C7.5 10.0147 9.51472 8 12 8C14.4853 8 16.5 10.0147 16.5 12.5C16.5 14.9853 14.4853 17 12 17C9.51472 17 7.5 14.9853 7.5 12.5Z"
								fill="var(--form-icon-color)"
							/>
						</svg>
						<h1 className="title">Biometria facial</h1>
						<p className="description">Para entrar, confirme seus dados</p>
					</div>
					<form className="form" onSubmit={handleSubmit}>
						<div className="formGroup">
							<label htmlFor="inputTitleCode" className="formLabel">
								Título
							</label>
							<input
								type="text"
								className={`inputCustom ${errors.titleCode ? "isInvalid" : ""}`}
								id="inputTitleCode"
								placeholder="Digite o código"
								value={titleCode}
								onChange={handleTitleChange}
								maxLength={20}
							/>
							{errors.titleCode && (
								<div className="invalidFeedback">{errors.titleCode}</div>
							)}
						</div>

						<div className="formGroup">
							<label htmlFor="inputCPF" className="formLabel">
								CPF
							</label>
							<ReactInputMask
								type="text"
								inputMode="numeric"
								mask="999.999.999-99"
								className={`inputCustom ${errors.cpf ? "isInvalid" : ""}`}
								id="inputCPF"
								placeholder="Digite seu CPF"
								value={cpf}
								onChange={handleCpfChange}
							/>
							{errors.cpf && (
								<div className="invalidFeedback">{errors.cpf}</div>
							)}
						</div>

						<div className="formGroup">
							<label htmlFor="inputBirthDate" className="formLabel">
								Data de nascimento
							</label>
							<ReactInputMask
								type="text"
								inputMode="numeric"
								mask="99/99/9999"
								className={`inputCustom ${errors.birthDate ? "isInvalid" : ""}`}
								id="inputBirthDate"
								placeholder="dd/mm/aaaa"
								value={birthDate}
								onInput={handleNumberInput}
								onChange={handleBirthDateChange}
								maskChar={null}
							/>
							{errors.birthDate && (
								<div className="invalidFeedback">{errors.birthDate}</div>
							)}
						</div>

						<div className="formGroup">
							<div class="checkbox-wrapper">
								<input
									className="inputCheckbox"
									id="checkboxTerms"
									type="checkbox"
									onChange={handleCheckboxChange}
								/>
								<label className="checkbox" for="checkboxTerms">
									<span>
										<svg width="12px" height="10px" viewbox="0 0 12 10">
											<polyline points="1.5 6 4.5 9 10.5 1"></polyline>
										</svg>
									</span>
									<span>
										Li e aceito a 
										<a href={terms} target="_blank">
											política de privacidade
										</a>
									</span>
								</label>
							</div>
							{errors.termsAccepted && (
								<div className="invalidFeedback">{errors.termsAccepted}</div>
							)}
						</div>

						<button type="submit" className="submitButton" disabled={isLoading}>
							<svg
								className="submitArrow"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
							>
								<path
									d="M13.7045 4.28377C13.3111 3.89615 12.678 3.90084 12.2904 4.29424C11.9027 4.68765 11.9074 5.3208 12.3008 5.70842L17.6712 10.9998H4C3.44771 10.9998 3 11.4475 3 11.9998C3 12.5521 3.44772 12.9998 4 12.9998H17.6646L12.3008 18.2847C11.9074 18.6723 11.9027 19.3055 12.2904 19.6989C12.678 20.0923 13.3111 20.097 13.7045 19.7094L20.6287 12.887C21.1256 12.3974 21.1256 11.5958 20.6287 11.1062L13.7045 4.28377Z"
									fill="var(--form-button-icon-color)"
								/>
							</svg>
							{isLoading && <div className="loader"></div>}
							{!isLoading && "Entrar"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default SignInPage;
