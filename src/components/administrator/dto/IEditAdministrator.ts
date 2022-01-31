import Ajv from "ajv";

const ajv = new Ajv();

interface IEditAdministrator {
    password: string;
    isActive: boolean;
}

const IEditAdministratorValidator = ajv.compile({
    type: "object",
    properties: {
        password: {
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
        "isActive",
    ],
    additionalProperties: false
});

export {IEditAdministrator}
export {IEditAdministratorValidator}