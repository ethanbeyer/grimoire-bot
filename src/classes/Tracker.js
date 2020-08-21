export default class Tracker
{
    constructor()
    {
        this.cycles = 1;
        this.win_count = 0;
        this.loss_count = 0;
        this.win_streak = 0;
        this.loss_streak = 0;
        this.result = 0;
        this.done = 0;
        this.waiting_for_result = 0;
    }

    cycle()
    {
        this.cycles++;
        this.done = 0;
        this.result = 0;
        this.waiting_for_result = 0
    }

    win()
    {
        this.result = 1;
        this.done = 1;
        this.win_count++;
        this.win_streak++;
    }

    loss()
    {
        this.result = 0;
        this.done = 1;
        this.loss_count++;
        this.loss_streak++;
    }

    resetStreaks()
    {
        this.win_streak = 0;
        this.loss_streak = 0;
    }
}
