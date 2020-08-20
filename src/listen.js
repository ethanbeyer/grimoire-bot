// Imports
import tmi from 'tmi.js';
import colors from 'colors';
import * as Configs from './configs';
import Wager from './classes/Wager';


// Client Configs
var client_options = {
    options: { debug: false },
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: Configs.USERNAME,
        password: Configs.OAUTH_TOKEN
    },
    channels: [ Configs.CHANNEL ]
};


// Connect to the Client
const client = new tmi.Client(client_options);
client.connect();


// Run the following listeners on a server that's actually connected...
client.on("connected", (address, port) => {
    console.clear();
    console.log("Starting a dead horse...".gray);

    let counter = 1;

    // set up the Wager, request the grimoire our account has
    let wager = new Wager(client, Configs.CHANNEL, Configs.USERNAME);

    // start off by saying this...
    // It's important because it forces the Cabal message to come back around if chat has been dead.
    setTimeout(() => {
        client.say(Configs.CHANNEL, '!raid 1')
    }, 1000);

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

});
