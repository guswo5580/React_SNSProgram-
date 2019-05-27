const express = require('express');
const db = require('../models');

const router = express.Router();

//접속 시, 모든 게시글을 가져오기

router.get('/', async (req, res, next) => { 
  try {
    let where = {};
    if(parseInt(req.query.lastId, 10)){
      where = {
        id : {
          [db.Sequelize.Op.lt] : parseInt(req.query.lastId, 10) //작은 것!! 
        }
      };
    }
    const posts = await db.Post.findAll({
      where,
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
        model: db.Image,
      }, {
        model: db.User,
        through: 'Like',
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: db.Post,
        as: 'Retweet',
        include: [{
          model: db.User,
          attributes: ['id', 'nickname'],
        }, {
          model: db.Image,
        }],
      }],
      order: [['createdAt', 'DESC']], // DESC는 내림차순, ASC는 오름차순
      limit : parseInt(req.query.limit, 10)
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
module.exports = router;
