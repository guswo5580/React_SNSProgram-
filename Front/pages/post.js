import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { LOAD_POST_REQUEST } from "../reducers/post";

//원하는 게시글 하나만 가져오는 예시 --- 서버 사이드 렌더링의 목적을 확인!!!
const Post = ({ id }) => {
  const { singlePost } = useSelector(state => state.post);
  return (
    <>
      {/* 사이트의 내용들에 대해 어떤 것이 어떤 역할을 하는지 하나하나 명시해주는 과정!! */}
      {/* 검색엔진이 페이지 내용을 잘 가져갈 수 있도록 설정하는 것을 말함  */}
      {/* 페이지 렌더링 시, HEAD 태그 내에 포함되는 것!!! */}
      {/* _app.js에서 선언한 부분에 대해 title 등의 중복은 해당 페이지가 로드됨에 따라 자동으로 바뀐다 */}
      <Helmet
        title={`${singlePost.User.nickname}님의 글`}
        description={singlePost.content}
        meta={[
          {
            name: "description",
            content: singlePost.content
          },
          {
            property: "og:title",
            content: `${singlePost.User.nickname}님의 게시글`
          },
          {
            property: "og:description",
            content: singlePost.content
          },
          {
            property: "og:image",
            content:
              singlePost.Images[0] &&
              `http://localhost:3065/${singlePost.Images[0].src}`
          },
          {
            property: "og:url",
            content: `http://localhost:3060/post/${id}`
          }
        ]}
      />
      {/* 스키마.org 를 이용하는 모습 */}
      <div itemScope="content">{singlePost.content}</div>
      <div itemScope="author">{singlePost.User.nickname}</div>
      <div>
        {singlePost.Images[0] && (
          <img src={`http://localhost:3065/${singlePost.Images[0].src}`} />
        )}
      </div>
    </>
  );
};

Post.getInitialProps = async context => {
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.query.id
  });
  return { id: parseInt(context.query.id, 10) };
};

Post.propTypes = {
  id: PropTypes.number.isRequired
};

export default Post;
