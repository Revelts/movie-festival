const { TITLE_ERROR, DESCRIPTION_ERROR, DURATION_ERROR, GENRE_ERROR, ARTIST_ERROR, INSERT_MOVIE_ERROR, FILE_NOT_FOUND } = require("../../../../Shared/constant");
const { movieModel, movieArtist, movieGenre } = require("../../../model/movieModel");

module.exports = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      genres,
      artist
    } = req.body;

    if(req.file == null) {
      return res.status(404).json({error: `${FILE_NOT_FOUND}`})
    }

    const {
      path
    } = req.file

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
      const movie = await movieModel.create(movieObject);
      if(movie) {
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

        const insertedData = {
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

        res.status(200).json(insertedData);

      } else {
        return res.status(404).json({error: `${INSERT_MOVIE_ERROR}`})
      }
    } catch(err) {
      return res.status(404).json({error: `${INSERT_MOVIE_ERROR}`})
    }
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};