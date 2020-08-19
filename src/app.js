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
        if(tags.username.toLowerCase() === Configs.MOD_USERNAME && message.includes(Configs.USERNAME)) {
            console.log(`${message}`.blue);
        }

        // Some QoL information
        if(/We need to sit in orbit for \d minutes before we can raid again/.test(message)) {
            console.log(colors.magenta(message));
        }

        // the raid is open
        if(message == "Looks like the Cabal have given up the search ... the raid is open!") {
            console.log(colors.magenta(`\n${counter}`));
            console.log("The raid is open...");

            if(counter % 3 === 0) {
                console.log('Safety wager...'.gray);
                client.say(Configs.CHANNEL, '!raid 21');
            } else {
                // 5 seconds after "Looks like..." run this...
                setTimeout(() =>
                {
                    client.say(Configs.CHANNEL, '!grimoire');

                    // and then 3.5 seconds after that, run the raid command.
                    // this gives time for the grimoire processing and so forth.
                    setTimeout(() =>
                    {
                        // this can fail. that doesn't matter: the next time the raid is open the loop starts over.
                        // do it 3 seconds after the Cabal message.
                        console.log('Joining the raid...'.gray);
                        client.say(Configs.CHANNEL, `!raid ${wager.wager}`);
                        wager.reset();
                    }, 3500);

                }, 5000);
            }

            counter++;
        }

        // look for messages about our grimoire total
        if(/Grimoire :/.test(message) && message.includes(Configs.USERNAME)) {
            wager.prepare(message);
        }
    });

});
