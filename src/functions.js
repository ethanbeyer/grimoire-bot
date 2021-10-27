export function sleep(milliseconds, show_message = false)
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

export function convertTime(number, unit)
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

export function numberNoCommas(str)
{
    return Number(str.replace(/,/g, ''));
}

export function numberWithCommas(int)
{
    return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getRandomIntInclusive(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);

    //The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
