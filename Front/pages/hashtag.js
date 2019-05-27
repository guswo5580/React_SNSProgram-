import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_HASHTAG_POSTS_REQUEST } from "../reducers/post";
import PostCard from "../components/PostCard";

//게시글에서 해시태그를 클릭하면 해시태그를 포함하고 있는 다른 게시글들이 나오는 페이지
const Hashtag = ({ tag }) => {
  const dispatch = useDispatch();
  const { mainPosts } = useSelector(state => state.post);

  useEffect(() => {
    dispatch({
      type: LOAD_HASHTAG_POSTS_REQUEST,
      data: tag
    });
  }, []);

  return (
    <div>
      {console.log("렌더 페이지", mainPosts)}
      {mainPosts.map(c => (
        <PostCard key={+c.createdAt} post={c} />
      ))}
    </div>
  );
};
Hashtag.propTypes = {
  tag: PropTypes.string.isRequired
};

//Hashtag = _app.js 의 context 내부의 Component로 전달됨!!
//context = _app.js 의 ctx
Hashtag.getInitialProps = async context => {
  // console.log(context.query.tag);
  //server.js 에서 받은 정보가 담기는 곳
  return { tag: context.query.tag };
};
//getInitialProps = 라이프 사이클의 일종
//다른 어떤 사이클 보다 먼저 실행되고, 프론트&서버에서도 사용 가능
//서버사이드 렌더링의 핵심요소!!!
export default Hashtag;
