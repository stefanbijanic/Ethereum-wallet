import Ajv from "ajv";

const ajv = new Ajv();

interface IEditUser {
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean,
}

const IEditUserVerificator = ajv.compile({
    type: "object",
    properties: {
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
        isActive: {
            type: "boolean",
        }
    },
    required: [
        "password",
        "firstName",
        "lastName",
        "email",
        "isActive",
    ],
    additionalProperties: false,
});

export {IEditUser}
export {IEditUserVerificator}