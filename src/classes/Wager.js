import colors from 'colors';
import * as Configs from '../configs';
import  { getRandomIntInclusive, numberNoCommas, numberWithCommas } from '../functions';

export default class Wager
{
    constructor()
    {
        this.date;
        this.getStartValues();
    }

    getStartValues()
    {
        this.currency = 0;
        this.wager = 0;
        this.winnings = 0;
    }

    cycle()
    {
        console.log("Resetting Wager...".gray);
        this.date = '';
        this.getStartValues();
    }

    calcCurrency(message)
    {
        var rule = /Grimoire : (?<total>\d{1,3}(,\d{3})?(,\d{3})?(,\d{3})?) /;
        var matches = message.match(rule);
        var currency_with_commas = matches['groups'].total;
        this.setCurrency(numberNoCommas(currency_with_commas));
    }

    setCurrency(value)
    {
        this.currency = value;
    }

    calcWager()
    {
        if(!this.currency) throw new Error("Currency is not set!");

        var wager_percentage_bands = function(g) {
            var limits = {};

            if(g > 0 && g <= 9999999) {                     // 0 - 9,999,999
                limits.low = 10; limits.high = 14;
            } else if(g >= 10000000 && g <= 39999999) {     // 10,000,000 - 39,999,999
                limits.low = 14; limits.high = 21;
            } else if(g >= 40000000 && g <= 99999999) {     // 40,000,000 - 99,999,999
                limits.low = 21; limits.high = 27;
            } else if(g >= 100000000 && g <= 999999999) {   // 100,000,000 - 999,999,999
                limits.low = 27; limits.high = 75;
            } else {                                        // 1,000,000,000+
                limits.low = 1; limits.high = 3;
            }

            return getRandomIntInclusive(limits.low, limits.high);
        }

        var wager_perc = wager_percentage_bands(this.currency);
        var calculated_wager = Math.floor(this.currency * (wager_perc / 100));

        this.setWager(calculated_wager);
        console.log(colors.green(`Wagering ${wager_perc}% : ${numberWithCommas(this.wager)}`));
    }

    setWager(value)
    {
        this.wager = value;
    }

    // @todo
    parseWinMessage(message, username)
    {
        var rule = (message.includes("The raid loot drops"))
            ? `${username} - (?<winnings>[0-9,]{1,}) ` // group message has commas in the number
            : `(?<winnings>[0-9]{1,})`; // solo message does not have commas

        var regex = new RegExp(rule);
        var matches = message.match(regex);
        this.winnings = numberNoCommas(matches['groups'].winnings);
    }
}
