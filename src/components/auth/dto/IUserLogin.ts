import Ajv from "ajv";

interface IUserLogin {
    username: string;
    email: string;
    password: string;
}

const ajv = new Ajv();

const IUserLoginValidator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        email: {
            type: "string",
            minLength: 2,
            maxLength: 128,
        },
        password: {
            type: "string",
            minLength: 8,
            maxLength: 255,
        }
    },
    required: [
        "email",
        "password"
    ],
    additionalProperties: false,
});

export { IUserLogin };
export { IUserLoginValidator };
