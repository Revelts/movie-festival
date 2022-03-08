const Sequelize = require('sequelize');
const db = require('../connection/connection');

const movieModel = db.define('movie_list_model', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
    title: { type: Sequelize.STRING(255) },
    description: { type: Sequelize.TEXT },
    duration: { type : Sequelize.INTEGER },
    url: {type: Sequelize.TEXT },
    viewed: {type: Sequelize.INTEGER, defaultValue: 0},
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    deletedAt: { type: Sequelize.DATE }
}, {
    tableName: 'movie_list',
    paranoid: true
});

const movieArtist = db.define('movie_artist_model', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
    movieId: { type: Sequelize.INTEGER },
    artistName: { type: Sequelize.TEXT },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
}, {
    tableName: 'movie_artist',
});

const movieGenre = db.define('movie_genre_model', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
    movieId: { type: Sequelize.INTEGER },
    genre: { type: Sequelize.TEXT },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
}, {
    tableName: 'movie_genres',
});

const movieGenreInfo = db.define('movie_genre_info_model', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
    genreName: { type: Sequelize.TEXT },
    viewed: { type: Sequelize.INTEGER },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
}, {
    indexes: [
        {
            name: 'movie_unique_information',
            unique: true,
            fields: ['genreName']
        }
    ],
    tableName: 'movie_genres_info',
});

movieModel.hasMany(movieArtist, {as : 'artistList', foreignKey: 'movieId'});
movieArtist.belongsTo(movieModel);

movieModel.hasMany(movieGenre, {as : 'genreList', foreignKey: 'movieId'});
movieGenre.belongsTo(movieModel);

movieGenreInfo.hasMany(movieGenre, {as: 'genreListInfo', foreignKey: 'genreName'});

(async () => {    
    await Promise.all([
        movieModel.sync(),
        movieArtist.sync(),
        movieGenre.sync(),
        movieGenreInfo.sync()
    ]);
})();




module.exports = {movieModel, movieArtist, movieGenre, movieGenreInfo};