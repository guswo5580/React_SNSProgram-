import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

const PostCardContent = ({ postData }) => {
  return (
    // 정규표현식 포함, content에서 해시태그를 판별
    // /(#[^\s]+)/g = # 구분자 포함, /#[^\s]+/g = # 구분자 제외
    <div>
      {postData.split(/(#[^\s]+)/g).map(v => {
        if (v.match(/#[^\s]+/)) {
          return (
            <Link
              href={{ pathname: "/hashtag", query: { tag: v.slice(1) } }}
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
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired
};

export default PostCardContent;
