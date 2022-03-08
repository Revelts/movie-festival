const { INVALID_MOST_VIEW_PARAMETER } = require("../../../../Shared/constant");
const { movieGenreInfo, movieModel } = require("../../../model/movieModel");

module.exports = async (req, res) => {
  try {
    const {
      type
    } = req.params;
    
    if(type !== 'movies' && type !== 'genres') {
      return res.status(404).json({error: `${INVALID_MOST_VIEW_PARAMETER}`});
    }

    if(type === 'genres') {
      const getMostViewGenres = await movieGenreInfo.findAll({order: [
          ['viewed', 'DESC'],
        ],
        limit: 10
      });
      const mostViewGenres = getMostViewGenres.map((data) => {
        return {
          genreName: data.genreName,
          viewed: data.viewed
        }
      })
      return res.status(200).json({mostViewGenres});
    }

    const getMostViewMovie = await movieModel.findAll({order: [
        ['viewed', 'DESC'],
      ],
      limit: 10
    });

    const mostViewMovies = getMostViewMovie.map((data) => {
      return {
        movieName: data.title,
        duration: data.duration,
        viewed: data.viewed
      }
    })
    return res.status(200).json({mostViewMovies});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};