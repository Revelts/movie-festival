const { Op } = require('sequelize');
const { movieModel, movieGenre, movieArtist } = require("../../../model/movieModel");

module.exports = (req, res) => {
  try {
    const {
      page, 
      pageSize,
      search
    } = req.query;
    
    const getPagination = (page, size) => {
      const limit = size ? +size : 5;
      const offset = page ? page * limit : 0;
      return { limit, offset };
    };

    const getPagingData = (data, page, limit) => {
      const { count: totalItems, rows: movieList } = data;
      const currentPage = page ? +page : 0;
      const totalPages = Math.ceil(totalItems / limit);
      return { totalItems, movieList, totalPages, currentPage };
    };
    
    let condition = search ? { [Op.or]: [{
      title: { [Op.like]: `%${search}%` },
    },{
      description: { [Op.like]: `%${search}%` } 
    }]} : null;

    let joinQuery = [
      {
        model: movieGenre,
        as: 'genreList',
        attributes: ['genre'],
      },{
        model: movieArtist,
        as: 'artistList',
        attributes: ['artistName'],
      }
    ]

    const { limit, offset } = getPagination(page, pageSize);
    movieModel.findAndCountAll({where: condition, include: joinQuery, limit, offset, logging: console.log})
      .then((data) => {
        const response = getPagingData(data, page, limit)
        res.status(200).json({data: response});
      })
      .catch((err) => {
        res.status(500).json({error: err.message});
      });

  } catch (error) {
    res.status(500).json({error: error.message});
  }
};