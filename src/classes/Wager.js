import colors from 'colors';

export default class Wager
{
    client;
    channel;
    username;
    grimoire;
    wager;
    raid_ready = false;

    constructor(client, channel, username)
    {
        this.client = client;
        this.channel = channel;
        this.username = username;
    }

    requestGrimoire()
    {
        this._sleep(3000);

        // send the !grimoire command
        console.log('Sending !grimoire...'.gray);
        this.client.say(this.channel, "!grimoire");
    }

    setGrimoireWager(grimoire_array)
    {
        console.log("Calculating grimoire...\n".gray);
        this.grimoire = Number(grimoire_array[0]);
        this.wager = Math.floor(this.grimoire * 0.20);

        console.log(colors.green("Total Grimoire: " + this.grimoire));
        console.log(colors.green("Wagering: " + this.wager + "\n"));
        this.raid_ready = true;
    }

    joinRaid()
    {
        this._sleep(7000);

        var command_to_send = "!raid " + this.wager;
        this.client.say(this.channel, command_to_send);
    }

    reset()
    {
        this.grimoire = '';
        this.wager = '';
        this.raid_ready = false;
    }

    _sleep(milliseconds)
    {
        console.log(colors.gray('Sleeping ' + milliseconds + " milliseconds...\n"));
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }
}
