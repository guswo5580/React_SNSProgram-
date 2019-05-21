import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card } from "antd";
import { LOAD_USER_POSTS_REQUEST } from "../reducers/post";
import { LOAD_USER_REQUEST } from "../reducers/user";
import PostCard from "../components/PostCard";

//게시글에서 유저를 클릭하면 해당 유저의 정보와 게시글이 나오는 페이지
const User = ({ id }) => {
  const dispatch = useDispatch();
  const { mainPosts } = useSelector(state => state.post);
  const { userInfo } = useSelector(state => state.user);

  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST,
      data: id
    });
    dispatch({
      type: LOAD_USER_POSTS_REQUEST,
      data: id
    });
  }, []);

  return (
    <div>
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">
              트윗
              <br />
              {userInfo.Posts}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
          />
        </Card>
      ) : null}
      {mainPosts.map(c => {
        <PostCard key={+c.createdAt} post={c} />;
      })}
    </div>
  );
};
User.propTypes = {
  id: PropTypes.number.isRequired
};

User.getInitialProps = async context => {
  console.log(context.query.id);

  //서버에서 넘겨받은 context 값을 Front에서 이용할 수 있는 값!!
  return {
    id: parseInt(context.query.id, 10)
  };
};
export default User;
