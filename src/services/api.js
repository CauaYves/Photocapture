import axios from 'axios';
import { loadAppSettings, getAppSettings } from '../config/configLoader';

let api = null;

export const initializeApi = async () => {
    if (!api) {
        await loadAppSettings();
        const { apiUrl } = getAppSettings();

        api = axios.create({
            baseURL: apiUrl,
            timeout: 30000,
            withCredentials: true
        });
    }
};

export const signin = async (titleCode, cpf, birthDate) => {
    if (!api) {
        await initializeApi();
    }

    try {
        const response = await api.post('/biometric/facial/capture/signin', {
            titleCode,
            cpf,
            birthDate,
        });

        localStorage.setItem('titleCode', titleCode);
        localStorage.setItem('showSignOutHeader', 'true');

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const signOut = async () => {
    if (!api) {
        await initializeApi();
    }

    const response = await api.get('/biometric/facial/capture/signout');

    localStorage.removeItem('titleCode');
    localStorage.setItem('showSignOutHeader', 'false');
    localStorage.setItem('hasLoggedInBefore', 'false');
    api = null;

    return response;
};

export const isSignedIn = async () => {
    
    if (!api) {
        await initializeApi();
    }

    const response = await api.get('/biometric/facial/capture/issignedin');

    return response.data;
};

export const listMembers = async () => {
    if (!api) {
        await initializeApi();
    }

    try {
        const response = await api.get('/biometric/facial/capture/members');

        const members = response.data.value;
        return members.map(({ memberId, name, birthDate, document, hasPhoto, isCaptureEnabled, isTitular }) => ({
            memberId,
            name,
            birthDate,
            document,
            hasPhoto,
            hasActiveBiometricCadaster: isCaptureEnabled,
            isTitular
        }));
    } catch (error) {
        throw error;
    }
};

export const getMemberPhoto = async (memberId) => {
    if (!api) {
        await initializeApi();
    }

    console.log('getMemberPhoto', memberId);

    const response = await api.get(`/biometric/facial/capture/photo/${memberId}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer'
    });

    return response;

};

export const cadasterMemberPhoto = async (memberId, photo) => {
    if (!api) {
        await initializeApi();
    }

    try {
        if (!memberId) {
            throw new Error('memberId is undefined');
        }

        const formData = new FormData();
        formData.append('photo', photo);

        const response = await api.put(`/biometric/facial/capture/photo/${memberId}`, formData);

        console.error(response.data);
        return response.data;

    } catch (error) {
        console.error('Erro ao salvar a imagem:', error);
        throw error;
    }
};

export default initializeApi;