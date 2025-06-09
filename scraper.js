// scraper.js

const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
require('dotenv').config();

const Store = require('./models/Store');

async function scrapeFromStoreLeads() {
  console.log('🕵️ Scraping from StoreLeads...');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://storeleads.app/shopify-stores', {
    waitUntil: 'domcontentloaded',
  });

  const content = await page.content();
  const $ = cheerio.load(content);

  const stores = [];

  $('.store-row').each((i, el) => {
    const name = $(el).find('.store-name').text().trim();
    const domain = $(el).find('.store-link').text().trim();
    const platform = 'Shopify';

    stores.push({ name, domain, platform });
  });

  for (const store of stores) {
    const exists = await Store.findOne({ domain: store.domain });
    if (!exists) {
      await Store.create(store);
    }
  }

  await browser.close();
  console.log(`✅ Added ${stores.length} stores from StoreLeads`);
}

async function runScraper() {
  await mongoose.connect(process.env.MONGODB_URI);
  await scrapeFromStoreLeads();
  mongoose.connection.close();
}

if (require.main === module) {
  runScraper();
}
