import React, { useEffect, useCallback, useRef } from "react";
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
  const countRef = useRef([]); //Front에서 request가 일어나는 횟수를 체크할 배열

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
        const lastId =
          mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id; //보호 연산자 적용
        if (!countRef.current.includes(lastId)) {
          //countRef 배열 안에 lastId(10)가 있다면 요청을 보내지 않겠다
          //같은 lastId를 이용하는 요청은 Front에서 실행하지 않도록 하겠다
          dispatch({
            //더 불러올 게시글이 있다면
            type: LOAD_MAIN_POSTS_REQUEST,
            lastId
            //현재 화면에 렌더링 된 마지막 게시글의 id를 가져와
            //다음 게시글 요청의 기준점으로 잡는다
          });
          countRef.current.push(lastId);
          //lastId 현재의 lastId 값을 저장 ex. 10
        }
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
      {" "}
      {/* 로그인 정보가 없어도 게시글은 볼 수 있도록, 게시글은 올릴 수 없도록  */}{" "}
      {me && <PostForm />}{" "}
      {mainPosts.map(c => {
        return <PostCard key={c.id} post={c} />;
      })}{" "}
    </div>
  );
};

Home.getInitialProps = async context => {
  // console.log(Object.keys(context));
  context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST
  });
};
export default Home;
