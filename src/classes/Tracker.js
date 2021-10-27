import colors from 'colors';

// @todo - move this into Wager, as a flags object
// @todo - do I need started, waiting, AND done? seems like there could just be a "raiding" flag that's true or false
export default class Tracker
{
    constructor()
    {
        // Flow Flags
        this.cycles = 1;

        // Results Flags
        this.win_count = 0;
        this.loss_count = 0;

        this.getStartValues();
    }

    getStartValues()
    {
        this.started = 0;
        this.waiting = 0;
        this.done = 0;
        this.result = 0;
    }

    win()
    {
        this.done = 1;
        this.result = 1;
        this.win_count++;
    }

    loss()
    {
        this.done = 1;
        this.result = 0;
        this.loss_count++;
    }

    cycle()
    {
        this.cycles++;
        this.getStartValues();

        console.log(
            colors.gray('Wins / Losses: ')
            + colors.green(`${this.win_count}`)
            + colors.gray(' / ')
            + colors.red(`${this.loss_count}`)
        );
    }
}
