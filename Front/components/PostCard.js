import React, { useCallback, useState, memo } from "react";
import { Avatar, Button, Card, Comment, Icon, List, Popover } from "antd";
import Link from "next/link";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  LIKE_POST_REQUEST,
  LOAD_COMMENTS_REQUEST,
  REMOVE_POST_REQUEST,
  RETWEET_REQUEST,
  UNLIKE_POST_REQUEST
} from "../reducers/post";
import PostImages from "../components/PostImages";
import PostCardContent from "../components/PostCardContent";
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from "../reducers/user";
import CommentForm from "./CommentForm";
import styled from "styled-components";
import FollowButton from "./FollowButton";

const CardWrapper = styled.div`
  margin-bottom: 20px;
`;

//게시글
const PostCard = memo(({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const id = useSelector(state => state.user.me && state.user.me.id);
  //me의 모든 객체 내용을 가져오는 것보다 원하는 내용만 가져오는 것이 좋다
  const dispatch = useDispatch();

  const liked = id && post.Likers && post.Likers.find(v => v.id === id);
  //Liker 배열 안에 나의 id 가 있는지를 확인하여 게시글에 대한 좋아요 여부 확인

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

  const onToggleLike = useCallback(() => {
    //좋아요 버튼 Toogle
    if (!id) {
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
  }, [id, post && post.id, liked]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다");
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id
    });
  }, [id, post && post.id]);

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

  const onRemovePost = useCallback(userId => () => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: userId
    });
  });

  return (
    <CardWrapper>
      <Card
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
          <Popover
            key="ellipsis"
            content={
              <Button.Group>
                {id && post.UserId === id ? (
                  <>
                    <Button>수정</Button>
                    <Button type="danger" onClick={onRemovePost(post.id)}>
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <Icon type="ellipsis" />
          </Popover>
        ]}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗 하였습니다` : null
        }
        extra={
          <FollowButton
            post={post}
            onUnfollow={onUnfollow}
            onFollow={onFollow}
          />
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
          <CommentForm post={post} />
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
          />
        </>
      )}
    </CardWrapper>
  );
});

PostCard.displayName = "PostCard";

//PropType을 Object 변수에 이용할 때
PostCard.propTypes = {
  post: PropTypes.shape({
    User: PropTypes.object,
    content: PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.string
  }).isRequired
};

export default PostCard;
