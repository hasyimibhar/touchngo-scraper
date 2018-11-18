import puppeteer from 'puppeteer';
import request from 'request';
import strftime from 'strftime';
import util from 'util';

const baseUrl = 'https://tngportal.touchngo.com.my/tngPortal';
const usernameSelector = '#j_username';
const passwordSelector = '#j_password';
const loginSelector = '#proceed';
const historyAccordionSelector = '#c_transactions';
const transactionsSelector = '#fi_transactions_datetypeequalsandcardserialnumberequalsandposteddatebetween > a';
const proceedButtonSelector = '#proceed';
const allTransactionsButtonSelector = '#allTxn';
const cardSerialNumberSelector = '#_cardSerialNumber_id';
const minPostedDateSelector = '#_minPostedDate_id';
const maxPostedDateSelector = '#_maxPostedDate_id';
const transactionsPanelEmptySelector = '#_title__id';
const transactionsPanelSelector = '#_title_pl_com_xerox_ts_domain_all_transactions_id';

export default async function scrape(req) {
    const encodedCreds = req.headers['authorization'].split(' ')[1];
    const credentials = (new Buffer(encodedCreds, 'base64')).toString().split(':');

    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();
    await page.goto(baseUrl + '/login');

    await page.content();

    await page.click(usernameSelector);
    await page.keyboard.type(credentials[0]);

    await page.click(passwordSelector);
    await page.keyboard.type(credentials[1]);

    await page.click(loginSelector);
    await page.waitForNavigation();

    await page.click(historyAccordionSelector);
    await page.waitForSelector(transactionsSelector);

    await page.click(transactionsSelector);
    await page.waitForSelector(proceedButtonSelector);

    if (req.query.card_serial_number) {
        const el = await page.$(cardSerialNumberSelector);

        await el.focus();
        await el.click({ clickCount: 2 });
        await page.keyboard.press('Backspace');

        await el.type(req.query.card_serial_number);
    }

    if (req.query.from) {
        const el = await page.$(minPostedDateSelector);
        
        await el.focus();
        for (let i = 0; i < 11; i++) {
            await page.keyboard.press('Backspace');
        }

        const fromDate = new Date(req.query.from);
        await el.type(strftime('%d-%b-%Y', fromDate));
    }

    if (req.query.to) {
        const el = await page.$(maxPostedDateSelector);

        await el.focus();
        for (let i = 0; i < 11; i++) {
            await page.keyboard.press('Backspace');
        }

        const toDate = new Date(req.query.to);
        await el.type(strftime('%d-%b-%Y', toDate));
    }

    await page.click(proceedButtonSelector);
    await page.waitForSelector(allTransactionsButtonSelector);

    await page.click(allTransactionsButtonSelector);

    const hasTransactions = await new Promise((resolve, reject) => {
        page.waitForSelector(transactionsPanelEmptySelector).then(() => resolve(false)).catch(() => reject());
        page.waitForSelector(transactionsPanelSelector).then(() => resolve(true)).catch(() => reject());
    });

    if (!hasTransactions) {
        return [];
    }

    const cookies = await page.cookies();
    let jar = request.jar();
    for (const cookie of cookies) {
        jar.setCookie(`${cookie.name}=${cookie.value}`, baseUrl + '/transactionses');
    }

    const downloadUrl = util.format(
        baseUrl + '/transactionses?find=txReport&cardSerialNumber=%s&minPostedDate=20-Aug-2018&maxPostedDate=18-Nov-2018&findBy=All+Transactions&dateType=[Transaction+Date]&ttype=&format=csv',
        req.query.card_serial_number
    );

    const body = await new Promise((resolve, reject) => {
        request
            .get({ url: downloadUrl, jar }, (error, response, body) => {
                resolve(body);
            });
    });

    browser.close();
    
    return body.trim().split('\n').slice(1).map(s => {
        const col = s.split(',').map(s => s.trim());
        return {
            'number': col[0],
            'timestamp': col[1],
            'posted_date': col[2],
            'type': col[3],
            'entry_location': col[4],
            'entry_sp': col[5],
            'exit_location': col[6],
            'exit_sp': col[7],
            'reload_location': col[8] == '-' ? null : col[8],
            'amount': col[9],
            'balance': col[10],
            'class': col[11],
            'tag_number': col[12]
        };
    });
}
