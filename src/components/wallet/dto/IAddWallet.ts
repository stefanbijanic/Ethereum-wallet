import Ajv from "ajv";

const ajv = new Ajv();

interface IAddWallet {
    walletName: string;
}

const IAddWalletVerificator = ajv.compile({
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

export {IAddWallet}
export {IAddWalletVerificator}