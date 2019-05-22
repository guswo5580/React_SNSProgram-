const express = require('express');
const db = require('../models');

const router = express.Router();

//접속 시, 모든 게시글을 가져오기

router.get('/', async (req, res, next) => { 
  try {
    const posts = await db.Post.findAll({
      include: [{
        model: db.User, 
        attributes: ['id', 'nickname'], //비밀번호 제외
      },{
        model: db.Image
      },{
        model : db.User,
        through : 'Like',
        as : 'Likers',
        attributes : ['id']
      }],
      order: [['createdAt', 'DESC']], 
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
module.exports = router;
