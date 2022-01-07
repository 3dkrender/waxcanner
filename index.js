const {getNftTransactions} = require('./utils/gettransaction');

/**
 * Obtain a CSV of transactions with WAX markets for a user account as of a specified date.

    Disclaimer: This software is for educational purposes only. 
      If you want to use it for your own activity, you do so at your own risk. 
      We recommend to check the listed transactions in case any of them are missing. 
      Please note that some public APIs may take some time to update transaction data.
 */

// const account = 'your_wax_account';
// const date = 'start_date';  // sample format -> '2021-11-09T02:09:54.000'

const account = 'tarukcer';
const date = '2010-11-09T02:09:54.000'

getNftTransactions(account, date);