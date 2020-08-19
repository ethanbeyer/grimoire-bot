import colors from 'colors';
import * as Configs from '../configs';
import {csvAppend as CSV} from 'csv-append';

export default class Wager
{
    constructor(client, channel, username)
    {
        this.previous_grimoire = 0;
        this.grimoire = 0;
        this.difference = 0;
        this.wager;
        this.date;

        // this last in logs
        this.client = client;
        this.channel = channel;
        this.username = username;
    }

    prepare(message)
    {
        console.log("Calculating grimoire from message...".gray);

        var rule = /Grimoire : (?<total>\d{1,}(,\d{1,})?(,\d{1,})?) /;
        var grimoire_regex_matches = message.match(rule);
        var total_with_commas = grimoire_regex_matches['groups'].total;

        var percentage_as_integer = this._getRandomIntInclusive(20, 33);
        var percentage_as_decimal = percentage_as_integer / 100;

        // With these things in place we are ready to log.
        this.date = new Date().toISOString();

        if(this.grimoire > 0) this.previous_grimoire = this.grimoire;
        this.grimoire = Number(total_with_commas.replace(/,/g, ''));

        this.wager = Math.floor(this.grimoire * percentage_as_decimal);

        this.difference = (this.previous_grimoire > 0) ? this.grimoire - this.previous_grimoire : 0;

        this._logToCSV({
            "Date":             this.date,
            "Grimoire":         this.grimoire,
            "Wager":            this.wager,
            "Wager Percentage": `${percentage_as_integer}%`,
            "Difference":       this.difference
        });

        console.log(colors.green(`Total Grimoire: ${this.grimoire}`));
        console.log(colors.green(`Wagering ${percentage_as_integer}% : ${this.wager}`));
    }

    reset()
    {
        console.log("Resetting...".gray);
        this.date = '';
        this.wager = '';
        this.difference = 0;

        var minutes_to_sleep = this._getRandomIntInclusive(5, 20);

        console.log(colors.gray(`Sleeping for ${minutes_to_sleep} minutes...`));
        this._sleep(this._convertTime(minutes_to_sleep, 'minutes'));
    }


    _logToCSV(log_data)
    {
        console.log("Doing some reporting...".gray);
        console.log(log_data);
        CSV(Configs.CSV_PATH, true).append(log_data);
    }

    _sleep(milliseconds, show_message = false)
    {
        if(show_message) {
            console.log(colors.gray(`Sleeping ${milliseconds} milliseconds...`));
        }

        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    _getRandomIntInclusive(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);

        //The maximum is inclusive and the minimum is inclusive
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    _convertTime(number, unit)
    {
        let milliseconds = 1000,
            seconds      = milliseconds * 60,
            minutes      = seconds * 60,
            hours        = minutes * 60,
            days         = hours * 24;

        let conversions = {
            'milliseconds': milliseconds,
            'seconds': seconds,
            'minutes': minutes,
            'hours': hours,
            'days': days,
        };

        return number * conversions[unit];
    }
}
