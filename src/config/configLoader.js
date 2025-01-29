let appSettings = null;

export const loadAppSettings = async () => {

    if (!appSettings) {
        try {
            const response = await fetch('appSettings.json');
            appSettings = await response.json();
            return appSettings
        } catch (error) {
            console.error('Erro ao carregar appSettings.json:', error);
            throw error;
        }
    }
    return appSettings;
};

export const getAppSettings = () => {

    if (!appSettings) {
        throw new Error('As configurações ainda não foram carregadas. Chame "loadAppSettings" primeiro.');
    }

    return appSettings;
};
