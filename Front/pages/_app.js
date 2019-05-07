//next 의 layout 설정 파일 (_app.js로 명명)
//전체에 공통적으로 들어갈 내용들에 대해서 작성
import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";

//Component import
import AppLayout from "../components/AppLayout";

//Redex import
import { Provider } from "react-redux";
import reducer from "../reducers";
import withRedux from "next-redux-wrapper"; //props로 store을 넣어주는 것을 선언
import { createStore } from "redux";

const PeaceOcean = ({ Component, store }) => {
  //Component를 props로 전달
  return (
    <Provider store={store}>
      <Head>
        <title>PeaceOcean2</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.js" />
      </Head>
      <AppLayout>
        {/* next 에서 넣어주는 props 
        Head부분이 Component에 포함되어 AppLayout에 전달됨을 의미*/}
        <Component />
      </AppLayout>
    </Provider>
  );
};
PeaceOcean.propTypes = {
  Component: PropTypes.elementType, //jsx형식의 Component를 전달하는 경우
  store: PropTypes.opject
};

export default withRedux((initialState, options) => {
  const store = createStore(reducer, initialState);
  //store = state + reducer 인 것으로 선언 & 붙임

  //store 커스터 마이징을 삽입 가능
  return store;
})(PeaceOcean);
