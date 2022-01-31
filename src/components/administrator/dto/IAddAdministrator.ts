import Ajv from "ajv";

const ajv = new Ajv();

interface IAddAdministrator {
    username: string;
    password: string;
}

const IAddAdministratorValidator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        password: {
            type: "string",
            minLength: 8,
            maxLength: 255,
        },
    },
    required: [
        "username",
        "password",
    ],
    additionalProperties: false
});

export {IAddAdministrator}
export {IAddAdministratorValidator}