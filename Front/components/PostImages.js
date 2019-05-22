//이미지 렌더링 처리 - 이미지 개수에 따라 이미지 렌더링 방식 차이
import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import ImagesZoom from "./ImagesZoom";

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    //이미지 확대
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    //이미지 더보기 끄기
    //ImageZoom으로 prop 값을 넘겨, 하위 컴포넌트에서 실행할 수 있도록
    setShowImagesZoom(false);
  }, []);

  if (images.length === 1) {
    //이미지 1장
    return (
      <>
        <img src={`http://localhost:3065/${images[0].src}`} onClick={onZoom} />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    //이미지 2장
    return (
      <>
        <div>
          <img
            src={`http://localhost:3065/${images[0].src}`}
            width="50%"
            onClick={onZoom}
          />
          <img
            src={`http://localhost:3065/${images[1].src}`}
            width="50%"
            onClick={onZoom}
          />
        </div>
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  return (
    //이미지 3장 이상
    <>
      <div>
        <img
          src={`http://localhost:3065/${images[0].src}`}
          width="50%"
          onClick={onZoom}
        />
        <div
          style={{
            display: "inline-block",
            width: "50%",
            textAlign: "center",
            verticalAlign: "middle"
          }}
          onClick={onZoom}
        >
          <Icon type="plus" />
          <br />
          {images.length - 1} 개의 사진 더보기
        </div>
      </div>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string
    })
  ).isRequired
};

export default PostImages;
