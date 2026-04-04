const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const FETCH_ERROR = 'FETCH_ERROR';
const PARSING_ERROR = 'PARSING_ERROR';

const JWT_CLAIMS = {
    ID: "id",
    EMAIL: "email",
    FIRST_NAME: "firstName",
    LAST_NAME: "lastName",
    IMAGE: "image",
    USERNAME: "username",
    PHONE_NUMBER: "phoneNumber",
    BIO: "bio",
    IS_PRIVATE: "isPrivate",
    CREATED_AT: "createdAt",
    UPDATED_AT: "updatedAt",
    ROLE: "role",
}

const APP_CONSTANTS = {
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    FETCH_ERROR,
    PARSING_ERROR,
    JWT_CLAIMS
};

export default APP_CONSTANTS;