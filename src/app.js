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
        password: Configs.TOKEN
    },
    channels: [ Configs.CHANNEL ]
};

// Connect to the Client
const client = new tmi.Client(client_options);
client.connect();

// Run the following listeners on a server that's actually connected...
client.on("connected", (address, port) => {

    console.log("Starting a dead horse...".gray);
    client.say(Configs.CHANNEL, "!raid 1");

    // set up the Wager, request the grimoire our account has
    let wager = new Wager(client, Configs.CHANNEL, Configs.USERNAME);

    // Message Listeners
    client.on('message', (channel, tags, message, self) => {
        // Ignore echoed messages.
        if(self) return;

        // Chat message that starts the process
        if(message == "Looks like the Cabal have given up the search ... the raid is open!") {
            console.log('The raid is open...'.green);
            wager.requestGrimoire();
        }

        // next stage, we look for messages about our grimoire total
        if(/Grimoire :/.test(message) && message.includes(Configs.USERNAME)) {
            console.log('Grimoire command found...'.green);
            var grimoire_matches = message.match(/(\d{1,})/);

            if(grimoire_matches) {
                wager.setGrimoireWager(grimoire_matches);
            }

            if(wager.grimoire > 10) {
                console.log('Joining the raid...'.green);
                wager.joinRaid();
            }

            wager.reset();
        }

        // dump loot message
        if(message.includes(Configs.USERNAME) && message.includes("loot")) {
            console.log("\n" + message + "\n".red);
        }
    });

});
