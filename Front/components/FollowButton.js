import React, { memo } from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

//팔로우 버튼을 눌렀을 때의 최적화를 위한 분리 컴포넌트
const FollowButton = memo(({ post, onUnfollow, onFollow }) => {
  const { me } = useSelector(state => state.user);

  // !me || post.User.id === me.id ? null -- 게시글이 내 게시글이라면 null
  // me.Followings && me.Followings.find(v => v.id === post.User.id)
  // 나의 Following 목록에 있는지의 여부에 따라 다른 버튼 적용
  return !me || post.User.id === me.id ? null : me.Followings &&
    me.Followings.find(v => v.id === post.User.id) ? (
    <Button onClick={onUnfollow(post.User.id)}>팔로잉 끊기</Button>
  ) : (
    <Button onClick={onFollow(post.User.id)}>팔로우</Button>
  );
});

FollowButton.displayName = "FollowButton";
//컴포넌트 display 이름 설정

FollowButton.propTypes = {
  post: PropTypes.object.isRequired,
  onUnfollow: PropTypes.func.isRequired,
  onFollow: PropTypes.func.isRequired
};

export default FollowButton;
