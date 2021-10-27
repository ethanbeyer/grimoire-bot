// @todo -- I think this could be an object of its own, right?
// why export all of these as their own variables if I am just going to `import *` later?
// dumb.

export const OAUTH_TOKEN = process.env.TWITCH_OAUTH_TOKEN;
export const CHANNEL = process.env.TWITCH_CHANNEL;
export const MOD_USERNAME = process.env.TWITCH_MOD_USERNAME;
export const USERNAME = process.env.TWITCH_USERNAME;
export const CSV_PATH = process.env.CSV_PATH;
export const TMI_CONFIGS = {
    options: { debug: false },
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: USERNAME,
        password: OAUTH_TOKEN
    },
    channels: [ CHANNEL ]
};
