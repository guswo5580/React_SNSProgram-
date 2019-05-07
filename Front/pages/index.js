import React from "react";

//component import
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

const dummy = {
  isLoggedIn: true,
  imagePaths: [], //이미지 미리보기
  mainPosts: [
    {
      User: {
        id: 1,
        nickname: "현재"
      },
      content: "첫 번째 게시글",
      img:
        "https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726"
    }
  ]
};

const Home = () => {
  return (
    <div>
      {/* 로그인 정보가 없어도 게시글은 볼 수 있도록, 게시글은 올릴 수 없도록  */}
      {dummy.isLoggedIn && <PostForm />}
      {dummy.mainPosts.map(c => {
        return <PostCard key={c} post={c} />;
      })}
    </div>
  );
};

export default Home;
