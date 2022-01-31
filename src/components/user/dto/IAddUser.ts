import Ajv from "ajv";

const ajv = new Ajv();

interface IAddUser {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
}

const IAddUserVerificator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
        password: {
            type: "string",
            minLength: 8,
            maxLength: 255,
        },
        firstName: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
        lastName: {
            type: "string",
            minLength: 2,
            maxLength: 255,
        },
        email: {
            type: "string",
            minLength: 8,
            maxLength: 255,
        },
    },
    required: [
        "username",
        "password",
        "firstName",
        "lastName",
        "email",
    ],
    additionalProperties: false,
});

export {IAddUser}
export {IAddUserVerificator}