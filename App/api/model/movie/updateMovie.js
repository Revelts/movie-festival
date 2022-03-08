const { TITLE_ERROR, DESCRIPTION_ERROR, DURATION_ERROR, GENRE_ERROR, ARTIST_ERROR, INVALID_MOVIE_ID, MOVIE_NOT_FOUND } = require("../../../../Shared/constant");
const { movieModel, movieArtist, movieGenre } = require("../../../model/movieModel");

module.exports = async (req, res) => {
  try {
    const { movieId } = req.params;

    const {
      title,
      description,
      duration,
      genres,
      artist
    } = req.body;

    const {
      path
    } = req.file

    if(movieId == null) {
      return res.status(404).json({error: `${INVALID_MOVIE_ID}`});
    }
    if(title == null || title === '') {
      return res.status(404).json({error: `${TITLE_ERROR}`})
    }
    if(description == null || description === '') {
      return res.status(404).json({error: `${DESCRIPTION_ERROR}`})
    }
    if(duration == null || duration === '') {
      return res.status(404).json({error: `${DURATION_ERROR}`})
    }
    if(genres == null || genres.length === 0) {
      return res.status(404).json({error: `${GENRE_ERROR}`})
    }
    if(artist == null || artist.length === 0) {
      return res.status(404).json({error: `${ARTIST_ERROR}`});
    }
    
    const movieObject = {
      title: title,
      description: description,
      duration: parseInt(duration, 10),
      url: path
    }

    try {
      const movie = await movieModel.findOne({where: {id :movieId}});
      if(movie) {
        await movie.update(movieObject);
        await movie.save();
  
        await Promise.all([
          movieArtist.destroy({where: {movieId: movie.id}}),
          movieGenre.destroy({where: {movieId: movie.id}})
        ]);
  
        const arrMappedArtiest = artist.map((data) => {
          return {
            movieId: movie.id,
            artistName: data.name
          }
        });

        const arrMappedGenres = genres.map((data) => {
          return {
            movieId: movie.id,
            genre: data.genre
          }
        });

        const [arrMovieArist, arrMovieGenres] = await Promise.all([
          movieArtist.bulkCreate(arrMappedArtiest),
          movieGenre.bulkCreate(arrMappedGenres)
        ]);

        const updatedData = {
          id: movie.id,
          title: movie.title,
          description: movie.description,
          duration: movie.duration,
          url: movie.url,
          createdAt: movie.createdAt,
          updatedAt: movie.updatedAt,
          genres: arrMovieGenres.map((data) => {
            return data.genre;
          }),
          artists: arrMovieArist.map((data) => {
            return data.artistName;
          })
        }
        return res.status(200).json(updatedData);
      }

      return res.status(404).json({error: `${MOVIE_NOT_FOUND}`})
      
    } catch (error) {
      return res.status(500).json({error: error.message});
    }


  } catch (error) {
    res.status(500).json({error: error.message});
  }
};