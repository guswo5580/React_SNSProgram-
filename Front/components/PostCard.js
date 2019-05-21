import React, { useState, useCallback, useEffect } from "react";
import { Card, Icon, Button, Avatar, Form, Input, List, Comment } from "antd";
import Link from "next/link";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { ADD_COMMENT_REQUEST } from "../reducers/post";

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
  }, []);

  const onSubmitComment = useCallback(e => {
    e.preventDefault();
    if (!me) return alert("로그인이 필요합니다");

    return dispatch(
      {
        type: ADD_COMMENT_REQUEST,
        data: {
          postId: post.id
        }
      },
      [me && me.id]
    );
  });

  useEffect(() => {
    setCommentText("");
    //댓글 입력 완료가 확인될 때, 입력 창 초기화
  }, [commentAdded === true]);

  const onChangeCommentText = useCallback(e => {
    setCommentText(e.target.value);
  });

  return (
    <div>
      <Card
        key={+post.createdAt}
        cover={post.img && <img alt="example" src={post.img} />}
        actions={[
          <Icon type="retweet" key="retweet" />,
          <Icon type="heart" key="heart" />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />
        ]}
        extra={<Button> 팔로우 </Button>}
      >
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
          description={
            // 정규표현식 포함, content에서 해시태그를 판별
            // /(#[^\s]+)/g = # 구분자 포함, /#[^\s]+/g = # 구분자 제외
            <div>
              {post.content.split(/(#[^\s]+)/g).map(v => {
                if (v.match(/#[^\s]+/)) {
                  return (
                    <Link
                      href={{
                        pathname: "/hashtag",
                        query: { tag: v.slice(1) }
                      }}
                      as={`/hashtag/${v.slice(1)}`}
                      key={v}
                    >
                      <a>{v}</a>
                    </Link>
                  );
                }
                return v;
              })}
            </div>
          }
        />
      </Card>{" "}
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
  })
};

export default PostCard;
