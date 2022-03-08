const data = require('./json/genres_name.json');

const tableName = 'movie_genres_info';

module.exports = {
  up: async (queryInterface, _) => {
    await queryInterface.bulkInsert(tableName, data);
  },

  down: async (queryInterface, _) => {
    await queryInterface.bulkDelete(tableName, null, {});
  }
};
