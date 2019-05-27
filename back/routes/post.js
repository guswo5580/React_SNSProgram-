const express = require('express');
const db = require('../models');
const {isLoggedIn} = require('./middleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

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

//게시글 작성
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // POST /api/post
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
    
    if (req.body.image) { 
      if (Array.isArray(req.body.image)) {
        //이미지 주소가 여러 개 일 때, --- 배열 형식
        const images = await Promise.all(req.body.image.map((image) => {
          //배열을 map으로 나누어 쿼리 작업 후 Promise.all을 하면 한방에 처리 가능!! 
          return db.Image.create({ src: image });
        }));

        await newPost.addImages(images);
      } else { 
        //이미지 주소가 하나일 때 --- 배열 X 
        const image = await db.Image.create({ src: req.body.image });
        await newPost.addImage(image);
      }
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
      },{
        model : db.Image
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

router.post('/images', upload.array('image'), (req, res) => {
  //('iamge') 는 Front에서 넘길 때, 동반하는 정보
  //이미지 여러 개 업로드 시 --- upload.array 옵션!! (한장 = sigle)
  //fields = 뒤의 name 값이 달라지는 경우 , none = 이미지가 없는 경우
  console.log(req.files); //이미지 저장 경로, single = file, array/fields = files
  res.json(req.files.map(v => v.filename));
});

router.delete('/:id', isLoggedIn, async(req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where : { id : req.params.id}
    });
    if(!post){
      return res.status(404).send('게시글이 존재하지 않습니다');
    }
    await db.Post.destroy({
      where : { id : req.params.id }
    });
    res.send(req.params.id);
  }catch(error) {
    console.error(error);
    next(error);
  }
});

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id }});
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    await post.addLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id }});
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    await post.removeLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [{
        model: db.Post,
        as: 'Retweet',
      }],
    });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }

    if (req.user.id === post.UserId 
      || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
    }

    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await db.Post.findOne({
      //리트윗 여부 검사
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send('이미 리트윗했습니다.');
    }
    const retweet = await db.Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });
    
    //리트윗을 한 게시글에 이미 저정되어 있는 글의 정보를 가져옴
    const retweetWithPrevPost = await db.Post.findOne({
      where: { id: retweet.id },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
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
    });
    res.json(retweetWithPrevPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
module.exports = router;
