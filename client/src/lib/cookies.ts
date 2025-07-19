import Cookies from 'js-cookie';

export const cookieUtils = {
    // Set cookie with default options
    set: (name: string, value: string, options?: Cookies.CookieAttributes) => {
        const defaultOptions: Cookies.CookieAttributes = {
            expires: 7, // 7 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            ...options
        };
        return Cookies.set(name, value, defaultOptions);
    },

    // Get cookie value
    get: (name: string) => {
        return Cookies.get(name);
    },

    // Remove cookie
    remove: (name: string) => {
        return Cookies.remove(name);
    },

    // Set tokens with specific expiration
    setTokens: (accessToken: string, refreshToken: string) => {
        cookieUtils.set('accessToken', accessToken, { expires: 1 }); // 1 day for access token
        cookieUtils.set('refreshToken', refreshToken, { expires: 30 }); // 30 days for refresh token
    },

    // Get tokens
    getTokens: () => {
        return {
            accessToken: cookieUtils.get('accessToken'),
            refreshToken: cookieUtils.get('refreshToken')
        };
    },

    // Clear all auth tokens
    clearTokens: () => {
        cookieUtils.remove('accessToken');
        cookieUtils.remove('refreshToken');
    }
}; 