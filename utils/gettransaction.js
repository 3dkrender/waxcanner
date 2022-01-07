const fetch = require('node-fetch'); // node only; not needed in browsers
const {
  URL,
  URLSearchParams
} = require('url');
const fs = require('fs');
const get_ticker = require('./tickertools');
const isToday = require('./tools');

const API = new URL('https://apiwax.3dkrender.com/v2/history/get_actions?');
const DIR = './csv';
const BASENAME = 'nft_waxcanner_';

const setValues = (account, date) => {
  return {
    'limit': '500',
    'account': account,
    'sort': 'asc',
    'after': date,
    'simple': 'true',
    'skip': '0'
  }
}
const markets = ['atomicmarket'];

const getNftTransactions = async (account, date) => {

  if(!fs.existsSync(DIR)) {
    fs.mkdirSync(DIR);
  }
  let nameFile = DIR + '/' + BASENAME + account + '_' + date.substr(0, 10) + '.csv';
  let headerCSV = 'date,from,to,amount,token,amount,token,amount,token,amount,token,amount,token,amount,token,memo,trx';
  fs.appendFile(nameFile, headerCSV + '\n', (err) => {
    if (err) throw err;
  });

  let values = setValues(account, date);
  let endLoop = false;
  let checkMemo = ''  // Aux for check duplicate actions

  while (!endLoop) {
    let actions = [];
    try {
      let response = await fetch(API + new URLSearchParams(values));
      response = await response.json();
      if (response['simple_actions'] == undeendLooped) {
        console.log('Something went wrong when trying to read. Check the format of the input data.');
        return false;
      }
      actions = response['simple_actions'];
    } catch (error) {
      throw error;
    }

    if (actions.length < values['limit']) {
      endLoop = true;
    }
    let oldDate = values['after'];
    let contaBlocks = 0;
    for (let action of actions) {
      let dataReg = '';
      values['after'] = action['timestamp'];
  
      if(isToday(new Date(values['after']))){
        return true;
      }

      // Avoid duplicate actions in transactions
      if(checkMemo == action['data']['memo']){
        continue;
      } else {
        checkMemo = action['data']['memo'];
      }

      if (action['action'] == 'transfer' && action['contract'] == 'eosio.token') {
        // Sales
        if (markets.indexOf(action['data']['from']) !== -1) {
          let usdteur = await get_ticker("USDT-EUR", action['timestamp']);
          let waxpusdt = await get_ticker("WAXP-USDT", action['timestamp']);
          dataReg = action['timestamp'] + ',' + action['data']['from'] + ',' + action['data']['to'] + ',' +
            Number.parseFloat(action['data']['amount']).toFixed(4) + ',WAX' + ',' +
            Number.parseFloat(waxpusdt.close * action['data']['amount']).toFixed(4) + ',USD' + ',' +
            Number.parseFloat((waxpusdt.close * action['data']['amount']) * usdteur.close).toFixed(4) + ',EUR,,,,,' + ',' +
            ',' + action['data']['memo'] + ',' + action['transaction_id'];
        }

        // buys
        if (markets.indexOf(action['data']['to']) !== -1) {
          let usdteur = await get_ticker("USDT-EUR", action['timestamp']);
          let waxpusdt = await get_ticker("WAXP-USDT", action['timestamp']);
          dataReg = action['timestamp'] + ',' + action['data']['from'] + ',' + action['data']['to'] + ',,,,,' +
            Number.parseFloat(action['data']['amount']).toFixed(4) + ',WAX' + ',' +
            Number.parseFloat(waxpusdt.close * action['data']['amount']).toFixed(4) + ',USD' + ',' +
            Number.parseFloat((waxpusdt.close * action['data']['amount']) * usdteur.close).toFixed(4) + ',EUR' + ',' +
            action['data']['memo'] + ',' + action['transaction_id'];
        }

        if (dataReg != '') {
          console.log(dataReg);
          fs.appendFile(nameFile, dataReg + '\n', (err) => {
            if (err) throw err;
          });
        }
      }
    }

    // CAUTION! More than values['limit'] actions on same date? Skip them next round
    if (oldDate == values['after']) {
      contaBlocks++;
      values['skip'] = (actions.length * contaBlocks).toString();
    } else {
      contaBlocks = 0;
      values['skip'] = '0';
    }

    // CAUTION! Take a breath to avoid being banned from public APIs!
    await new Promise(res => setTimeout(res, 250)); // 4 request/second limit
  }
}

module.exports = {
  getNftTransactions
}