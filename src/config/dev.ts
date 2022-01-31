import IConfig from '../common/IConfig.interface';
import * as dotenv from "dotenv";
import { readFileSync } from "fs";

const dotEnvResult = dotenv.config();

if (dotEnvResult.error) throw "Environment configuration file error: " + dotEnvResult.error;

const Config: IConfig = {
    server: {
        port: +(process.env?.SERVER_PORT),
        static: {
            route: "/static",
            path: "./static/",
            cacheControl: false,
            dotfiles: "deny",
            etag: false,
            index: false,
            maxAge: 360000,
        },
    },
    database: {
        host: process.env.DATABASE_HOST,
        port: +(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
        charset: process.env.DATABASE_CHARSET,
        timezone: process.env.DATABASE_TIMEZONE,
    },
    mail: {
        hostname: process.env?.MAIL_HOST,
        port: +(process.env?.MAIL_PORT),
        secure: process.env?.MAIL_SECURE === "true",
        username: process.env?.MAIL_USERNAME,
        password: process.env?.MAIL_PASSWORD,
        fromEmail: process.env?.MAIL_FROM,
        debug: true,
    },
    auth: {
        user: {
            algorithm: "RS256",
            issuer: "localhost",
            auth: {
                duration: 60 * 60 * 24 * 7, 
                public: readFileSync("keystore/user-auth.public", "utf-8"),
                private: readFileSync("keystore/user-auth.private", "utf-8"),
            },
            refresh: {
                duration: 60 * 60 * 24 * 7, 
                public: readFileSync("keystore/user-refresh.public", "utf-8"),
                private: readFileSync("keystore/user-refresh.private", "utf-8"),
            },
        },
        administrator: {
            algorithm: "RS256",
            issuer: "localhost",
            auth: {
                duration: 60 * 60 * 24 * 7,
                public: readFileSync("keystore/administrator-auth.public", "utf-8"),
                private: readFileSync("keystore/administrator-auth.private", "utf-8"),
            },
            refresh: {
                duration: 60 * 60 * 24 * 365,
                public: readFileSync("keystore/administrator-refresh.public", "utf-8"),
                private: readFileSync("keystore/administrator-refresh.private", "utf-8"),
            },
        },
        allowRequestsEvenWithoutValidTokens: false,
    },
};

export default Config;
