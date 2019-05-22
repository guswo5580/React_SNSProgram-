const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next) => {
    try {
        const posts = await db.Post.findAll({
            include : [{
                model : db.Hashtag,
                where : { name : decodedURIComponent(req.params.tag) }
                //HashTag는 Post 테이블에서 도출되어 나오는 것이므로 
                //Post 내부에서 Where을 작성 
                //param 으로 전달되는 값은 한글일 수도 있음 
                //한글 -> URI로 인코딩 되어 값이 들어오므로 decoded를 해준다 
            }, {
                model : db.Image
            }]
        });
        res.json(posts);
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;