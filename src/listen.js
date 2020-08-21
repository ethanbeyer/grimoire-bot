// Logging Improvements
require('log-timestamp');

// Imports
import tmi from 'tmi.js';
import colors from 'colors';
import * as Configs from './configs';

// Connect to the Client
const client = new tmi.Client(Configs.TMI_CONFIGS);
client.connect();
console.clear();

// Message Listeners
client.on('message', (channel, tags, message, self) => {

    // Ignore echoed messages.
    if(self) return;

    // Logging from MOD_USERNAME
    if(tags.username.toLowerCase() === Configs.MOD_USERNAME) {
        console.log(`${tags.username}: ${message}`.blue);
    }

    // Some QoL information
    if(/^!raid|!grimoire/.test(message)) {
        console.log(`${tags.username}: ${message}`.magenta);
    }
});
