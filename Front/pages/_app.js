import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import axios from "axios";

import AppLayout from "../components/AppLayout";
import reducer from "../reducers";
import rootSaga from "../sagas";
import { LOAD_USER_REQUEST } from "../reducers/user";

const PeaceOcean = ({ Component, store, pageProps }) => (
  <Provider store={store}>
    <Head>
      <title>PeaceOcean2</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
      />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.js" />
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
    </Head>
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
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
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps };
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
