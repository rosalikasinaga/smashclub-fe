import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-secret-key';

export const encrypt = (text: string): string => {
    try {
        return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        return '';
    }
};

export const decrypt = (encryptedText: string): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption error:', error);
        return '';
    }
};
