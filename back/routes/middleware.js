const db = require('../models');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next(); //다음 라우터 구문을 실행
    } else {
      res.status(401).send('로그인이 필요합니다.');
    }
  };
  
  exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.status(401).send('로그인한 사용자는 접근할 수 없습니다.');
    }
  };

  // const post = await db.Post.findOne({ where: { id: req.params.id } });
  //   if (!post) {
  //     return res.status(404).send('게시글가 존재하지 않습니다.');
  //   }

  exports.isPosts = async (req, res, next) => {
    const post = await db.Post.findOne({
      where : { id : req.params.id}
    });
    if(post){
      next();
    }
    else {
      return res.status(404).send('게시글가 존재하지 않습니다')
    }
  }