const express = require('express');
const db = require('../models');

const router = express.Router();

//게시글 작성
router.post('/', async (req, res, next) => { // POST /api/post
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g); //#뒤의 글자 추출
    const newPost = await db.Post.create({
      content: req.body.content, 
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
        //없으면 만들고, 있으면 아무 일 X
        where: { name: tag.slice(1).toLowerCase() },
      })));
      console.log(result);
      //Post ~ Hashtag와 관계 설정
      await newPost.addHashtags(result.map(r => r[0]));
    }

    // 시퀄라이즈에서 제공하는 방식을 이용하여 합쳐 보내기
    // const User = await newPost.getUser();
    // newPost.User = User;
    // res.json(newPost);
    
    //다시 한번 DB조회를 통해 합쳐 보내기 
    const FullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [{
        model: db.User,
      }],
    });
    res.json(FullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/images', (req, res) => {

});

module.exports = router;
