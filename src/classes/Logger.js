import colors from 'colors';
import * as Configs from '../configs';
import {csvAppend as CSV} from 'csv-append';

export default class Logger
{
    logToCSV(log_data)
    {
        console.log("Saving to CSV...".gray);
        CSV(Configs.CSV_PATH, true).append(log_data);
    }
}
