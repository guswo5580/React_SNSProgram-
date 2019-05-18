const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res) => { //로그인 시 자동으로 내 정보 가져오기
  if (!req.user) {
    return res.status(401).send('로그인이 필요합니다.');
  }
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

router.get('/:id', (req, res) => { //api/user/123

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

router.get('/:id/follow', (req, res) => { // /api/user/:id/follow

});
router.post('/:id/follow', (req, res) => {

});

router.delete('/:id/follow', (req, res) => {

});

router.delete('/:id/follower', (req, res) => {

});

router.get('/:id/posts', (req, res) => {

});

module.exports = router;
