// scraper.js

const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
require('dotenv').config();

const Store = require('./models/Store');

// ───────────────────────────────
// 🛒 StoreLeads Scraper
// ───────────────────────────────
async function scrapeFromStoreLeads() {
  console.log('🕵️ Scraping from StoreLeads...');

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

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

      if (domain) {
        stores.push({ name, domain, platform });
      }
    });

    for (const store of stores) {
      const exists = await Store.findOne({ domain: store.domain });
      if (!exists) {
        await Store.create(store);
      }
    }

    console.log(`✅ Added ${stores.length} stores from StoreLeads`);
  } catch (error) {
    console.error('❌ StoreLeads scraping failed:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

// ───────────────────────────────
// 🌍 MyIP.ms Scraper
// ───────────────────────────────
async function scrapeFromMyIP() {
  console.log('🌐 Scraping from MyIP.ms...');

  try {
    const { data } = await axios.get(
      'https://www.myip.ms/browse/sites/1/own/376377/shopify.com'
    );
    const $ = cheerio.load(data);
    const stores = [];

    $('table tbody tr').each((i, el) => {
      const domain = $(el).find('td:nth-child(2) a').text().trim();
      if (domain) {
        stores.push({
          name: domain.replace('www.', '').split('.')[0],
          domain,
          platform: 'Shopify',
        });
      }
    });

    for (const store of stores) {
      const exists = await Store.findOne({ domain: store.domain });
      if (!exists) {
        await Store.create(store);
      }
    }

    console.log(`✅ Added ${stores.length} stores from MyIP.ms`);
  } catch (error) {
    console.error('❌ MyIP.ms scraping failed:', error.message);
  }
}

// ───────────────────────────────
// 🏁 Run All Scrapers
// ───────────────────────────────
async function runScraper() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await scrapeFromStoreLeads();
    await scrapeFromMyIP();
  } catch (err) {
    console.error('❌ Error during scraping:', err.message);
  } finally {
    mongoose.connection.close();
  }
}

if (require.main === module) {
  runScraper();
}
