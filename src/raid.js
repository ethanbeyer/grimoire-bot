// Imports
import tmi from 'tmi.js';
import colors from 'colors';
import dateFormat from 'dateFormat';
import * as Configs from './configs';
import Wager from './classes/Wager';
import Tracker from './classes/Tracker';
import Logger from './classes/Logger';
import { numberNoCommas, numberWithCommas } from './functions';

// Connect to the Client
const client = new tmi.Client(Configs.TMI_CONFIGS);
client.connect();

// set up the Wager, request the grimoire our account has
const wager = new Wager();
const trkr = new Tracker();
const logger = new Logger();

// `npm run raid [anything_after_that]`
// by default, we start by sending "!raid 1" in order to make sure that the mod_bot's
// game cycle has started. But by passing any argument after `raid`, you can turn off
// this functionality.
const send_raid_command_at_start = process.argv[3] ? true : false;

// Run the following listeners on a server that's actually connected...
client.on('connected', (address, port) => {
    console.clear();
    console.log("Connected to the channel's chat...".gray);

    // start off by saying this...
    // It's important because it forces the Cabal message to come back around if chat has been dead.
    if(send_raid_command_at_start) {
        console.log("Starting a dead horse...".gray);
        setTimeout(() => {
            client.say(Configs.CHANNEL, `!raid ${process.argv[3]}`);
        }, 1000);
    }
});

// Message Listeners
client.on('message', (channel, tags, message, self) => {
    // If one of the following "if" statements has a `return;`,
    // it's because that action is the only thing that should happen for that message.

    var from_mod_bot = tags.username.toLowerCase() === Configs.MOD_USERNAME,
        mentions_me = message.includes(Configs.USERNAME),
        is_me = tags.username.toLowerCase() === Configs.USERNAME,
        cycle_started = trkr.started;

    // Logging from:MOD_USERNAME mentions:ME
    if(from_mod_bot && mentions_me) {
        console.log(`${message}`.blue);
    }

    // the raid is open
    if(message == "Looks like the Cabal have given up the search ... the raid is open!") {
        console.log(colors.magenta(`\n${trkr.cycles}`));
        console.log("The raid is open...");
        trkr.started = 1;

        // 10 seconds after "Looks like..." run this...
        setTimeout(() => {
            client.say(Configs.CHANNEL, '!grimoire');
        }, 10000);

        return;
    }

    // Just konk out if we're not in the cycle -- all the following message conditions only apply to when the cycle has begun.
    if(!cycle_started) return;

    // track raid partcipants...
    if(/^!raid/.test(message) && !is_me) {
        console.log(`${tags.username} joined the raid!`.black);
    }

    // look for messages about our grimoire total
    if(/Grimoire :/.test(message) && mentions_me) {
        // most of this can get moved to the Wager class
        // Date
        var now = new Date();
        wager.date = dateFormat(now, 'yyyy-mm-dd HH:MM:ss');

        // Grimoire
        console.log("Calculating grimoire from message...".gray);
        wager.calcCurrency(message);
        console.log(colors.green(`Total Grimoire: ${numberWithCommas(wager.currency)}`));

        // Wager
        if(wager.wager) {
            console.log(`Override Wager: ${wager.wager}`.green);
        } else {
            wager.calcWager();
        }

        // and then 10 seconds after that, run the raid command.
        // this gives time for the grimoire processing and so forth.
        setTimeout(() => {
            client.say(Configs.CHANNEL, `!raid ${wager.wager}`);
            console.log('I joined the raid!'.black);
        }, 10000);

        return;
    }

    // This message is broadcast every time a raid starts, so it
    // is a good place to begin looking for a result from the mod_bot
    if(/is planning to raid/.test(message) && from_mod_bot) {
        console.log("Waiting for a result...".gray);
        trkr.waiting = 1;

        return;
    }

    // Raid Wrap-up
    // This is where we do all the end-of-raid actions:
    // determining win/loss, pausing in case of streaks, resetting helper classes.
    if(trkr.waiting && from_mod_bot) {

        // determine win/loss based on the message and my presence in it
        // this has to be really specific, because if we're only waiting for a message from
        // MODBOT and it comes in, but doesn't happen to be one of these
        // so...I think as a @todo, this could be refactored/simplified
        if(/The raid loot drops:/.test(message)) {
            if(mentions_me) {
                trkr.win();
            } else {
                trkr.loss();
            }
        } else if(/executed the raid flawlessly/.test(message) && mentions_me) {
            trkr.win();
        } else if(/We lootless af rn/.test(message)) {
            trkr.loss();
        } else if(/wiped dat ass/.test(message) && mentions_me) {
            trkr.loss();
        }

        if(trkr.result) wager.parseWinMessage(message, Configs.USERNAME);

        if(trkr.done) {
            console.log("Done. Doing the teardown now...".gray);

            // stop waiting for a result - we got it, we got it...!
            logger.logToCSV({
                "Date":     wager.date,
                "Grimoire": wager.currency,
                "Wager":    wager.wager
            });

            // Tell user what happened
            var result = trkr.result ? "won! :)" : "lost. :(";
            var result_color = trkr.result ? "green" : "red";

            var new_total = (wager.currency - wager.wager);
            if(trkr.result) new_total += wager.winnings;

            console.log(colors[result_color](`It looooooks like you ${result} // New Total: ${numberWithCommas(new_total)}`));

            // if there is some level of result-dependent logic to do, it needs to be done here.

            // reset the support classes and trackers
            trkr.cycle();
            wager.cycle();
        }

        return;
    }
});
