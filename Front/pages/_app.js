import React from "react";
import PropTypes from "prop-types";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import axios from "axios";
import Helmet from "react-helmet";
import AppLayout from "../components/AppLayout";
import reducer from "../reducers";
import rootSaga from "../sagas";
import { LOAD_USER_REQUEST } from "../reducers/user";

///////_ 파일의 기본 구조 Class 형식의 extends가 필요한 경우도 존재//////////////
// import App, { Container } from "next/app";
// class PeaceOcean extends App {
//   static getInitialProps(context){

//   }
//   render () {

//   }
//   공식적으로는 넣어야 맞지만 넣지 않아도 실행은 가능
//   실행 여부에 따라 추가적인 사항
// }

const PeaceOcean = ({ Component, store, pageProps }) => (
  <Provider store={store}>
    <Helmet
      // Helmet으로 검색엔진에 노출할 수 있도록 페이지 정의!!
      title="PeaceOcean"
      htmlAttributes={{
        lang: "ko"
      }}
      meta={[
        {
          charset: "UTF-8"
        },
        {
          name: "viewport",
          content:
            "width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover"
        },
        {
          "http-equiv": "X-UA-Compatible",
          content: "IE=edge"
        },
        {
          name: "description",
          content: "PeaceOcean 2"
        },
        {
          name: "og:title",
          content: "NodeBird"
        },
        {
          name: "og:description",
          content: "PeaceOcean 2"
        },
        {
          property: "og:type",
          content: "website"
        },
        {
          property: "og:image",
          content: "http://localhost:3060/favicon.ico"
          //검색엔진 노출 시, 첫 번째 이미지를 보여주기로 설정
          //이미지가 없을 경우, favicon을 기본이미지로 하여 보여주기
        }
      ]}
      // link 및 script 는 객체 배열로 적용
      link={[
        {
          rel: "shortcut icon",
          href: "/favicon.ico"
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
        },
        {
          rel: "stylesheet",
          href:
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        },
        {
          rel: "stylesheet",
          href:
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        }
      ]}
      script={[
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.js"
        }
      ]}
    />{" "}
    <AppLayout>
      <Component {...pageProps} />{" "}
    </AppLayout>{" "}
  </Provider>
);
PeaceOcean.propTypes = {
  //jsx형식의 Component를 전달하는 경우
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired
};

//Next - Express의 동적 라우팅에서 전달 받은 값을
//각 Component로 보내는 중간 다리 역할
PeaceOcean.getInitialProps = async context => {
  // console.log(context);
  const { ctx, Component } = context;
  let pageProps = {};

  const state = ctx.store.getState(); //state 값 가져오기
  const cookie = ctx.isServer ? ctx.req.headers.cookie : "";
  //서버 사이드의 요청이라면 쿠키를 가져오기
  // console.log("cookie", cookie);
  if (ctx.isServer && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  if (!state.user.me) {
    //me의 정보가 없다면
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST
    });
  }

  //_app.js 하위의 다른 컴포넌트에서 getInitialProps를 했을 경우 실행 구간
  if (Component.getInitialProps) {
    pageProps = (await Component.getInitialProps(ctx)) || {};
    //pageProps.isRequired 문제를 위해 기본값을 지정
  }
  return {
    pageProps
  };
};

// 커스텀 미들웨어 생성 예시
// const middleware = store => next => action => {
//   console.log(action); // 다른 작업들을 여기에
//   next(action);
// };

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [
    sagaMiddleware,
    store => next => action => {
      // console.log(action);
      next(action);
    }
  ];
  //미들웨어 삽입구간
  const enhancer =
    process.env.NODE_ENV === "production" //미들웨어 합침
      ? compose(applyMiddleware(...middlewares)) //미들웨어 추가
      : compose(
          applyMiddleware(...middlewares),
          !options.isServer &&
            window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : f => f
        );
  const store = createStore(reducer, initialState, enhancer);
  //store = state + reducer 인 것으로 선언 & 붙임
  store.sagaTask = sagaMiddleware.run(rootSaga);
  //생성한 saga미들웨어를 rootSaga를 통해 run
  return store;
};

export default withRedux(configureStore)(withReduxSaga(PeaceOcean));
