import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
//component import
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_MAIN_POSTS_REQUEST } from "../reducers/post";

const Home = () => {
  //리렌더링의 효율에 따라 selector를 세분화하여 나누어 주는 것이 좋다
  const { me } = useSelector(state => state.user);
  const { mainPosts, hasMorePost } = useSelector(state => state.post);
  const dispatch = useDispatch();

  //Scroll 감지 - window 이벤트 리스너 이용
  const onScroll = useCallback(() => {
    //window.scrollY - 현재 화면 제일 상단의 위치(절대적)
    //clientHeight - 화면의 상단부터 하단까지의 높이(길이)
    //scrollHeight - (절대적)화면의 가장 상단부터 (절대적)화면의 가장 하단의 높이(길이)
    //scrollY + clientHeight = scrollHeight
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 300
      //화면의 끝에서 300 정도 남았을 때 Data를 요청
    ) {
      if (hasMorePost) {
        //게시글이 남아 있다면
        dispatch({
          //더 불러올 게시글이 있다면
          type: LOAD_MAIN_POSTS_REQUEST,
          lastId: mainPosts[mainPosts.length - 1].id
          //현재 화면에 렌더링 된 마지막 게시글의 id를 가져와
          //다음 게시글 요청의 기준점으로 잡는다
        });
      }
    }
  }, [hasMorePost, mainPosts.length]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts.length]);

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
