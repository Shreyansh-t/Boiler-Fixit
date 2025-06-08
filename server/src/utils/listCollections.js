const mongoose = require('mongoose');

async function listCollections() {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(collection => {
      console.log('-', collection.name);
    });
  } catch (error) {
    console.error('Error listing collections:', error);
  }
}

module.exports = listCollections; 