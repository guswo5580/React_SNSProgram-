import React from "react";
import { useSelector } from "react-redux";
//component import
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_MAIN_POSTS_REQUEST } from "../reducers/post";

const Home = () => {
  //리렌더링의 효율에 따라 selector를 세분화하여 나누어 주는 것이 좋다
  const { me } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);

  return (
    <div>
      {/* 로그인 정보가 없어도 게시글은 볼 수 있도록, 게시글은 올릴 수 없도록  */}
      {me && <PostForm />}
      {mainPosts.map(c => {
        return <PostCard key={c} post={c} />;
      })}
    </div>
  );
};

Home.getInitialProps = async context => {
  context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST
  });
};
export default Home;
