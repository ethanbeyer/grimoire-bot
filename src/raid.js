// Imports
import tmi from 'tmi.js';
import colors from 'colors';
import * as Configs from './configs';
import Wager from './classes/Wager';
import Tracker from './classes/Tracker';
import Logger from './classes/Logger';

// Connect to the Client
const client = new tmi.Client(Configs.TMI_CONFIGS);
client.connect();

// set up the Wager, request the grimoire our account has
const wager = new Wager(client, Configs.CHANNEL, Configs.USERNAME);
const trk = new Tracker();
const logger = new Logger();

// Run the following listeners on a server that's actually connected...
client.on("connected", (address, port) => {
    console.clear();
    console.log("Starting a dead horse...".gray);

    // start off by saying this...
    // It's important because it forces the Cabal message to come back around if chat has been dead.
    setTimeout(() => {
        client.say(Configs.CHANNEL, '!raid 1');
    }, 1000);
});

// Message Listeners
client.on('message', (channel, tags, message, self) => {

    var from_mod_bot = tags.username.toLowerCase() === Configs.MOD_USERNAME,
        mentions_me = message.includes(Configs.USERNAME);

    // Logging from MOD_USERNAME to ME
    if(from_mod_bot && mentions_me) {
        console.log(`${message}`.blue);
    }

    // the raid is open
    if(message == "Looks like the Cabal have given up the search ... the raid is open!") {
        console.log(colors.magenta(`\n${trk.cycles}`));
        console.log("The raid is open...");

        // 5 seconds after "Looks like..." run this...
        setTimeout(() => {
            client.say(Configs.CHANNEL, '!grimoire');

            // and then 3.5 seconds after that, run the raid command.
            // this gives time for the grimoire processing and so forth.
            setTimeout(() => {
                console.log('Joining the raid...'.gray);
                client.say(Configs.CHANNEL, `!raid ${wager.wager}`);
            }, 20000);

        }, 5000);
    }

    // look for messages about our grimoire total
    if(/Grimoire :/.test(message) && mentions_me) {
        wager.wager_override = (trk.cycles % 3 > 0) ? false : 21;
        wager.prepare(message);
    }

    // This message is broadcast every time a raid starts, so it
    // is a good place to begin looking for a result from the mod_bot
    if(/is planning to raid/.test(message) && from_mod_bot) {
        console.log("Looks like someone is getting the raid started. Waiting for a result...".gray);
        trk.waiting_for_result = 1;
        return;
    }

    // Raid Wrap-up
    // This is where we do all the end-of-raid actions:
    // determining win/loss, pausing in case of streaks, resetting helper classes.
    if(trk.waiting_for_result && from_mod_bot) {

        // determine win/loss based on the message and my presence in it
        if(/The raid loot drops:/.test(message)) {
            mentions_me ? trk.win() : trk.loss();
        } else if(/executed the raid flawlessly/.test(message) && mentions_me) {
            trk.win();
        } else if(/We lootless af rn/.test(message)) {
            trk.loss();
        } else if(/wiped dat ass/.test(message) && mentions_me) {
            trk.loss();
        } else {
            return;
        }

        if(trk.done) {
            // stop waiting for a result - we got it, we got it...!
            logger.logToCSV({
                "Date":     wager.date,
                "Grimoire": wager.grimoire,
                "Wager":    wager.wager
            });

            // Tell user what happened
            var result = trk.result ? "won! :)" : "lost. :(";
            var result_color = trk.result ? "green" : "red";
            console.log(colors[result_color](`It looooooks like you ${result}`));

            // reset the support classes and trackers
            trk.cycle();
            wager.reset();

            // Handle Streaks
            if((trk.win_streak || trk.loss_streak) === 2) {
                trk.resetStreaks();
                wager.wager_override = 9;
            }
        }
    }
});
