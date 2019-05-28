import React, { useCallback, useState, useEffect, useRef } from "react";
import { Form, Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  ADD_POST_REQUEST,
  REMOVE_IMAGE,
  UPLOAD_IMAGES_REQUEST
} from "../reducers/post";

//게시글 업로드 부분
const PostForm = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const { imagePaths, isAddingPost, postAdded } = useSelector(
    state => state.post
  );
  const imageInput = useRef();

  useEffect(() => {
    //게시글 업로드 완료 확인 후 초기화
    setText("");
  }, [postAdded === true]);

  //////텍스트///////
  const onSubmitForm = useCallback(
    e => {
      e.preventDefault();
      if (!text || !text.trim()) {
        //게시글이 없는 경우, 공백만 있는 경우
        return alert("게시글을 작성해주세요");
        //return으로 중간에 끊기!!!
      }
      //Text와 Image를 FormData 형식으로 보내기
      const formData = new FormData();
      imagePaths.forEach(i => {
        formData.append("image", i);
      });
      formData.append("content", text);
      dispatch({
        type: ADD_POST_REQUEST,
        data: formData
      });
    },
    [text, imagePaths]
  );

  const onChangeText = useCallback(e => {
    setText(e.target.value);
  }, []);

  //////이미지///////
  const onChangeImages = useCallback(e => {
    // console.log(e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, f => {
      imageFormData.append("image", f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData
    });
  }, []);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  //고차함수 적용 구간 ( => 2번 적용 )
  const onRemoveImage = useCallback(
    //미리보기 이미지 제거 버튼
    index => () => {
      dispatch({
        type: REMOVE_IMAGE,
        index
      });
    },
    []
  );

  return (
    <Form
      style={{ margin: "10px 0 20px" }}
      encType="multipart/form-data"
      onSubmit={onSubmitForm}
    >
      <Input.TextArea
        maxLength={140}
        placeholder="어떤 일이 있었나요?"
        value={text}
        onChange={onChangeText}
      />
      <div>
        <input
          type="file"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button
          type="primary"
          style={{ float: "right" }}
          htmlType="submit"
          loading={isAddingPost}
        >
          게시
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => {
          return (
            <div key={v} style={{ display: "inline-block" }}>
              <img
                src={`http://localhost:3065/${v}`}
                style={{ width: "200px" }}
                alt={v}
              />
              <div>
                <Button onClick={onRemoveImage(i)}>삭제</Button>
              </div>
            </div>
          );
        })}
      </div>
    </Form>
  );
};

export default PostForm;
