const puppeteer = require('puppeteer');

//Simple helper function to get text from an ElementHandle
async function readRawValue(encoded) {
    const raw = await encoded.getProperty('textContent');
    const arg = raw.jsonValue();
    return arg;
}

//Scrapes tourny rankings from the url specified.
//TODO put rankings into a meaningful format.
async function scrapeRankings(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    //This just gets every single table element. We then need to use the knowlege that each team has 6 elements of data to procede
    const vals = await page.$x('//*[@id="page-wrapper"]/div/div/div/table/tbody/tr/td');

    console.log(vals.length); //test code

    //Stepping by 6 makes it so the for loop executes 1 time per team. We can then just work within the team with
    //i = rank, i+1 = team#, i+2 = team name, i+3 = w-l-t, i+4 = WP, i+5 = SP
    //TODO AP are missing, this will be an issue later, might be because my tm is outdated.
    for (i = 0; i < vals.length; i += 6) {
        rank = await readRawValue(vals[i]);
        number = await readRawValue(vals[i + 1]);
        console.log("Rank " + rank + " number " + number);
    }
    browser.close();
}

//Scrapes skills rankings and information from the url specified
//Like tourny rankings needs to be put into a meaningful format
async function scrapeSkills(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    //This just gets every single table element. We then need to use the knowlege that each team has 6 elements of data to procede
    const vals = await page.$x('//*[@id="page-wrapper"]/div/div/div/table/tbody/tr/td');

    console.log(vals.length); //test code
    console.log(vals.length / 8); //Number of teams

    teams = vals.length / 8;

    //Stepping by 8 makes it so the for loop executes 1 time per team. We can then just work within the team with
    //i = rank, i+1 = team#, i+2 = team name, i+3 = Total score, i+4 = high prog, i+5 = prog attempts, i+6 = high driving, i+7 = driving attempts
    for (i = 0; i < vals.length; i += 8) {
        rank = await readRawValue(vals[i]);
        number = await readRawValue(vals[i + 1]);
        console.log("Rank " + rank + " number " + number);
    }
    browser.close();
}

console.log('Hello world');

//Tourny rankings on my curret configuration
scrapeRankings('http://10.0.0.217/division1/rankings');
scrapeSkills('http://10.0.0.217/skills/rankings');

console.log('Press any key to exit');

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));