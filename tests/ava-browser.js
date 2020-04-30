const test = require('ava');
const puppeteer = require('puppeteer');
const TEST_URL = 'http://localhost:8080/tests/index.html';

test.before('Launch a browser', async t => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    t.context = { browser };
});

test.beforeEach('Open a test page', async t => {
    t.context.page = await t.context.browser.newPage();
    t.context.page.on('console', msg => console.log(...msg.args().map(a => a.toString())));
    t.context.open = url => t.context.page.goto(url);
    t.context.run = fn => t.context.page.evaluate(fn);

    const response = await t.context.open(TEST_URL + '?' + Math.random()); // no HTTP 304
    t.is(response.status(), 200);
});

test.afterEach('Close the test page', t => {
    return t.context.page.close();
});

test.after.always('Close the browser', t => {
    return t.context.browser.close();
});

(require('ava'))('Skip warning', t => t.pass());

module.exports = test;