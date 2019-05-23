const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const {isLoggedIn} = require('./middleware');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res) => { //로그인 시 자동으로 내 정보 가져오기
  try{
    const FullUser = await db.User.findOne({
      where : {id : req.user.id},
      include : [{
        model:db.Post,
        as : 'Posts',
        attributes : ['id']
      },{
        model:db.User,
        as : 'Followings',
        attributes : ['id']
      },{
        model:db.User,
        as : 'Followers',
        attributes : ['id']
      }],
      attributes : ['id','nickname','userId']
    });
    console.log(FullUser);
    return res.json(FullUser);
  }catch(error){
    next(error)
  }
});

router.post('/', async (req, res, next) => { // POST /api/user 회원가입
  try {
    const exUser = await db.User.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // salt는 10~13 사이로
    const newUser = await db.User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword,
    });
    console.log(newUser);
    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    //추가적인 에러처리 구간
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  //다른 사람의 정보 가져오기
  try {
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },
      include: [{
        model: db.Post,
        as: 'Posts',
        attributes: ['id'],
      }, {
        model: db.User,
        as: 'Followings',
        attributes: ['id'],
      }, {
        model: db.User,
        as: 'Followers',
        attributes: ['id'],
      }],
      attributes: ['id', 'nickname'],
    });
    const jsonUser = user.toJSON();
    jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
    jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
    jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
    res.json(jsonUser);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/logout', (req, res) => { // /api/user/logout
  req.logout();
  req.session.destroy();
  res.send('logout 성공');
});

router.post('/login', (req, res, next) => { // POST /api/user/login
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      try {
        if (loginErr) {
          return next(loginErr);
        }
        const fullUser = await db.User.findOne({
          where: { id: user.id },
          include: [{
            model: db.Post,
            as: 'Posts',
            attributes: ['id'],
          }, {
            model: db.User,
            as: 'Followings',
            attributes: ['id'],
          }, {
            model: db.User,
            as: 'Followers',
            attributes: ['id'],
          }],
          attributes: ['id', 'nickname', 'userId'],
        });
        console.log(fullUser);
        return res.json(fullUser);
      } catch (e) {
        next(e);
      }
    });
  })(req, res, next);
  // passport.authenticate 이용 시 붙여줄 것
});

router.get('/:id/posts', async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      where: {
        UserId: parseInt(req.params.id, 10),
      },
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
      }],
    });
    res.json(posts);
    console.log("Send User", posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    //req.user로 가능하지만 시퀄라이즈 충돌이 발생할 경우가 생김  
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });
    await me.addFollowing(req.params.id); //Following목록에 전송 id 추가
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    //req.user로 가능하지만 시퀄라이즈 충돌이 발생할 경우가 생김  
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });
    await me.removeFollowing(req.params.id); //Following 목록에서 id 삭제
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
////////////////프로필 목록 팔로잉 팔로워 목록//////////////////
router.get('/:id/followings', isLoggedIn, async (req, res, next) => { 
  try {
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },
    });
    const followers = await user.getFollowings({
      attributes: ['id', 'nickname'],
    });
    res.json(followers);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id/followers', isLoggedIn, async (req, res, next) => { 
  try {
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },
    });
    const followers = await user.getFollowers({
      attributes: ['id', 'nickname'],
    });
    res.json(followers);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
///////////////프로필 목록 팔로워 삭제//////////////////
router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });
    await me.removeFollower(req.params.id);
    //나와 params로 전송받은 id의 follow관계 끊기 
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await db.User.update({
      nickname: req.body.nickname,
      //수정 위치 : 수정 내용 
    }, {
      where: { id: req.user.id },
    });
    res.send(req.body.nickname);
  } catch (e) {
    console.error(e);
    next(e);
  }
});


module.exports = router;
