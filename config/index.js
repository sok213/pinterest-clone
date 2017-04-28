// Retrieves the JSON object from config.json file.
const configValues = require('./config');

// Exports the mLab URI by getting values from configValues and parsing it 
// into a string.
module.exports = {
  getDbConnectionString: () => {
    return 'mongodb://admin:admin@ds045618.mlab.com:45618/pinterest-clone';
  }
};
