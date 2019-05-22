const express = require('express');
const db = require('../models');
const {isLoggedIn} = require('./middleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

//게시글 작성
router.post('/', isLoggedIn, async (req, res, next) => { // POST /api/post
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

//댓글 가져오기
router.get('/:id/comments', async (req, res, next) => {
  try {
    //게시글 존재 여부 확인
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    const comments = await db.Comment.findAll({
      where: {
        PostId: req.params.id,
      },
      order: [['createdAt', 'ASC']],
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    });
    res.json(comments);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//댓글 작성하기
router.post('/:id/comment', isLoggedIn, async (req, res, next) => { // POST /api/post/1000000/comment
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    //새로운 댓글 저장
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });
    await post.addComment(newComment.id); //관계 설정
    //관계 설정된 것을 include 포함 재조회
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    });
    return res.json(comment);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});
///////multer 설정////////
const upload = multer({
  storage: multer.diskStorage({
    //diskStorage 서버 쪽에 저장하겠다는 의미 (구글 드라이브, S3 등으로 변형 가능)
    destination(req, file, done) {
      done(null, 'uploads'); //uploads 폴더에 저장
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); //확장자
      const basename = path.basename(file.originalname, ext); //basename
      done(null, basename + new Date().valueOf() + ext);
      //basename + 시간 값 + 확장자 -- file명이 같은 것을 방지!! 
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, //파일 사이즈 제한 옵션(byte 단위)
});

router.post('/images', upload.array('image'), (req, res) => {
  //('iamge') 는 Front에서 넘길 때, 동반하는 정보
  //이미지 여러 개 업로드 시 --- upload.array 옵션!! (한장 = sigle)
  //fields = 뒤의 name 값이 달라지는 경우 , none = 이미지가 없는 경우
  console.log(req.files); //이미지 저장 경로, single = file, array/fields = files
  res.json(req.files.map(v => v.filename));
});

module.exports = router;
