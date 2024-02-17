import path from 'path';
import dotenv from 'dotenv';

dotenv.config({path: path.resolve(__dirname, "./.env")})

interface ENV {
    SECRET: string | undefined;
}

interface Config {
    SECRET: string;
}

const getConfig = (): ENV => {
    return {
        SECRET: process.env.SECRET,
    }
}

const getSanitizedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config as Config;
}

const config = getConfig();

const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;