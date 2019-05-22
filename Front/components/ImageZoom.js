//이미지 클릭 시, 크게 볼 수 있도록 하는 컴포넌트
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import Slick from "react-slick"; //이미지 슬라이더 역할

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  //모달 형식의 전체화면으로
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 5000,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <header
        style={{
          height: 44,
          background: "white",
          position: "relative",
          padding: 0,
          textAlign: "center"
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "17px",
            color: "#333",
            lineHeight: "44px"
          }}
        >
          상세 이미지
        </h1>
        <Icon
          type="close"
          onClick={onClose}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            padding: 15,
            lineHeight: "14px",
            cursor: "pointer"
          }}
        />
      </header>
      <div style={{ height: "calc(100% - 44px)", background: "#090909" }}>
        <div>
          <Slick
            initialSlide={0}
            afterChange={slide => setCurrentSlide(slide)}
            infinite={false}
            arrows
            slidesToShow={1} //한번에 한장
            slidesToScroll={1} //한번에 하나씩 스크롤
          >
            {/* slick 내부에 반복문으로 이미지 표현 -> 슬라이더 구현  */}
            {images.map(v => {
              return (
                // eslint-disable-next-line react/jsx-key
                <div style={{ padding: 32, textAlign: "center" }}>
                  <img
                    src={`http://localhost:3065/${v.src}`}
                    style={{ margin: "0 auto", maxHeight: 750 }}
                  />
                </div>
              );
            })}
          </Slick>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 75,
                height: 30,
                lineHeight: "30px",
                borderRadius: 15,
                background: "#313131",
                display: "inline-block",
                textAlign: "center",
                color: "white",
                fontSize: "15px"
              }}
            >
              {currentSlide + 1} / {images.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired //함수 props
};

export default ImagesZoom;
