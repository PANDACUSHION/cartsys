import { decode } from 'jwt-decode';

export const getRoleFromToken = (token) => {
    try {
        const decodedToken = decode(token);
        return decodedToken.role;  // Assuming 'role' exists in the token
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};
