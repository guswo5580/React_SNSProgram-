//next 의 layout 설정 파일 (_app.js로 명명)
//전체에 공통적으로 들어갈 내용들에 대해서 작성
import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import AppLayout from "../components/AppLayout";

const PeaceOcean = ({ Component }) => {
  return (
    <>
      <Head>
        <title>PeaceOcean2</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.js" />
      </Head>
      <AppLayout>
        {/* next 에서 넣어주는 props */}
        <Component />
      </AppLayout>
    </>
  );
};
PeaceOcean.propTypes = {
  Component: PropTypes.elementType //jsx형식의 Component를 전달하는 경우
};

export default PeaceOcean;
