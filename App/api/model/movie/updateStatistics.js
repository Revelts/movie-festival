const { INVALID_MOST_VIEW_PARAMETER, MOVIE_NOT_FOUND, GENRE_NOT_FOUND, INVALID_TYPE_PROPERTY, ID_ERROR, INVALID_GENRE_PROPERTY } = require("../../../../Shared/constant");
const { movieGenreInfo, movieModel } = require("../../../model/movieModel");

module.exports = async (req, res) => {
  try {
    const {
      type,
      movieId,
      genreName
    } = req.body;
    
    if(type === 'movies') {

      if(movieId == null || movieId === '') {
        return res.status(404).json({error: `${ID_ERROR}`})
      }

      const id = parseInt(movieId, 10);
      const movie = await movieModel.findOne({where: {id: id}}) 
      
      if(movie == null) {
        return res.status(404).json({error: `${MOVIE_NOT_FOUND}`});
      }
      const currentView = movie.viewed;
      const newValue = currentView + 1;
      movie.update({viewed: newValue});
      movie.save();
      
      const currentMovieStatistic = {
        title: movie.title,
        description: movie.description,
        viewed: movie.viewed,
        updatedAt: movie.updatedAt,
      }
      return res.status(200).json({currentMovieStatistic});
    }

    if(type === 'genres') {

      if(genreName == null) {
        return res.status(404).json({error: `${INVALID_GENRE_PROPERTY}`});
      }

      const genre = await movieGenreInfo.findOne({where: {genreName: genreName}});
      if(genre == null) {
        return res.status(404).json({error: `${GENRE_NOT_FOUND}`});
      }
      const currentView = genre.viewed;
      const newValue = currentView + 1;
      genre.update({viewed: newValue});
      genre.save();

      const currentGenreStatistics = {
        genreName: genre.genreName,
        viewed: genre.viewed,
        updatedAt: genre.updatedAt,
      }
      return res.status(200).json({currentGenreStatistics});
    }

    return res.status(404).json({error: `${INVALID_TYPE_PROPERTY}`});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};