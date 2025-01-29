// O código abaixo ajusta corretamente a rota base quando a aplicação está em uma subpasta.
// Esta situação pode ser observada ao acessar a aplicação pelo labs. EX.: http://192.168.29.72:11000/foto
// Sendo assim, capturamos dinamicamente o caminho base da URL do navegador quando a aplicação não está rodando localmente
// Isso garante que as rotas funcionem corretamente no labs
import { loadAppSettings } from "../config/configLoader";

export async function getBasename() {
	const appSettings = await loadAppSettings();
	const baseUrl = appSettings.baseUrl;
	return baseUrl;
}

// Caminho para a Logo do header
export async function getBaseUrlForThemes(config) {
	const basename = await getBasename();
	return `${basename}/App_Themes/${config.clientName}/`;
}

// Caminho para os arquivos de funcionamento da IA
export async function getBaseUrlForModels() {
	const basename = await getBasename();
	return `${basename}/models/`;
}
