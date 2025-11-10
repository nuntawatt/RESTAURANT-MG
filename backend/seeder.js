const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const MenuItem = require('./models/menuItem');

async function seed() {
  try {
    // connect to DB
    await connectDB();

    // load JSON from project root
    const jsonPath = path.join(__dirname, '..', 'json', 'foodData.json');
    const raw = fs.readFileSync(jsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    const items = parsed.allFood || [];

    if (!items.length) {
      console.log('No menu items found in JSON file.');
      process.exit(0);
    }

    // clear existing menu items to avoid duplicates
    await MenuItem.deleteMany({});

    const docs = items.map(i => ({
      name: i.name || 'No name',
      description: i.description || 'Delicious food prepared for you.',
      price: parseFloat(i.price) || 0,
      category: i.category || 'Other',
      image: i.image || ''
    }));

    const inserted = await MenuItem.insertMany(docs);
    console.log(`Inserted ${inserted.length} menu items.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

seed();
