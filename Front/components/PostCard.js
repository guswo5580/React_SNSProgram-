import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Button, Card, Comment, Form, Icon, Input, List } from "antd";
import Link from "next/link";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import {
  ADD_COMMENT_REQUEST,
  LIKE_POST_REQUEST,
  LOAD_COMMENTS_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_REQUEST
} from "../reducers/post";
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from "../reducers/user";
import PostImages from "./PostImages";
import PostCardContent from "./PostCardContent";
//게시글
const PostCard = ({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState("");

  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const onToggleComment = useCallback(() => {
    //댓글 창을 오픈 여부, 이전 state 값에 따라 열고 닫고
    setCommentFormOpened(prev => !prev);

    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id
      });
    }
  }, []);

  const onSubmitComment = useCallback(e => {
    e.preventDefault();
    if (!me) return alert("로그인이 필요합니다");

    return dispatch(
      {
        type: ADD_COMMENT_REQUEST,
        data: {
          postId: post.id,
          content: commentText
        }
      },
      [me && me.id, commentText]
    );
  });

  useEffect(() => {
    setCommentText("");
    //댓글 입력 완료가 확인될 때, 입력 창 초기화
  }, [commentAdded === true]);

  const onChangeCommentText = useCallback(e => {
    setCommentText(e.target.value);
  });

  const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);
  //Liker 배열 안에 나의 id 가 있는지를 확인하여 게시글에 대한 좋아요 여부 확인
  const onToggleLike = useCallback(() => {
    //좋아요 버튼 Toogle
    if (!me) {
      return alert("로그인이 필요합니다!");
    }
    if (liked) {
      // 좋아요 누른 상태
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id
      });
    } else {
      // 좋아요 안 누른 상태
      dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id
      });
    }
  }, [me && me.id, post && post.id, liked]);

  const onRetweet = useCallback(() => {
    if (!me) {
      return alert("로그인이 필요합니다");
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id
    });
  }, [me && me.id, post && post.id]);

  const onFollow = useCallback(
    userId => () => {
      dispatch({
        type: FOLLOW_USER_REQUEST,
        data: userId
      });
    },
    []
  );

  const onUnfollow = useCallback(
    userId => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId
      });
    },
    []
  );

  return (
    <div>
      <Card
        key={+post.createdAt}
        cover={
          post.Images && post.Images[0] && <PostImages images={post.Images} />
        }
        actions={[
          <Icon type="retweet" key="retweet" onClick={onRetweet} />,
          <Icon
            type="heart"
            key="heart"
            theme={liked ? "twoTone" : "outlined"}
            twoToneColor="#eb2f96"
            onClick={onToggleLike}
          />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />
        ]}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗 하였습니다` : null
        }
        extra={
          //내 게시글일 경우 - null
          //내 Following 목록에 있을 경우 취소
          !me || post.User.id === me.id ? null : me.Followings &&
            me.Followings.find(v => v.id === post.User.id) ? (
            <Button onClick={onUnfollow(post.User.id)}>팔로우 취소</Button>
          ) : (
            <Button onClick={onFollow(post.User.id)}>팔로우</Button>
          )
        }
      >
        {post.RetweetId && post.Retweet ? (
          //Retweet 으로 생성된 게시글인지 여부에 따른 구분
          <Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <Card.Meta
              avatar={
                <Link
                  href={{
                    pathname: "/user",
                    query: { id: post.Retweet.User.id }
                  }}
                  as={`/user/${post.Retweet.User.id}`}
                >
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />}
            />
          </Card>
        ) : (
          <Card.Meta
            avatar={
              <Link
                href={{ pathname: "/user", query: { id: post.User.id } }}
                as={`/user/${post.User.id}`}
              >
                <a>
                  <Avatar>{post.User.nickname[0]}</Avatar>
                </a>
              </Link>
            }
            title={post.User.nickname}
            description={<PostCardContent postData={post.content} />}
          />
        )}
      </Card>
      {commentFormOpened && (
        <>
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea
                rows={4}
                value={commentText}
                onChange={onChangeCommentText}
              />{" "}
            </Form.Item>{" "}
            <Button type="primary" htmlType="submit" loading={isAddingComment}>
              보내기{" "}
            </Button>{" "}
          </Form>{" "}
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={
                    <Link
                      href={{ pathname: "/user", query: { id: item.User.id } }}
                      as={`/user/${item.User.id}`}
                    >
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
                  content={item.content}
                />
              </li>
            )}
          />{" "}
        </>
      )}{" "}
    </div>
  );
};

//PropType을 Object 변수에 이용할 때
PostCard.propTypes = {
  post: PropTypes.shape({
    User: PropTypes.object,
    content: PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.object
  }).isRequired
};

export default PostCard;
