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
        console.log('sleeping 3 seconds');
        this._sleep(3000);

        // send the !grimoire command
        console.log('sending !grimoire');
        this.client.say(this.channel, "!grimoire");
    }

    setGrimoireWager(grimoire_array)
    {
        console.log('calculating grimoire');
        this.grimoire = Number(grimoire_array[0]);
        this.wager = Math.floor(this.grimoire * 0.20);

        console.log("Total Grimoire: " + this.grimoire);
        console.log("Wagering: " + this.wager);
        this.raid_ready = true;
    }

    joinRaid()
    {
        console.log('sleeping 7 seconds\n\n');
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
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }
}
