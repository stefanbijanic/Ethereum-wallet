import Ajv from "ajv";

const ajv = new Ajv();

interface IEditWallet {
    walletName: string;
}

const IEditWalletVerificator = ajv.compile({
    type: "object",
    properties: {
        walletName: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
    },
    required: [
        "walletName",
    ],
    additionalProperties: false,
});

export {IEditWallet}
export {IEditWalletVerificator}