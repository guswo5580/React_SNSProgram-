import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import withRedux from "next-redux-wrapper";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import withReduxSaga from "next-redux-saga";
import AppLayout from "../components/AppLayout";
import reducer from "../reducers";
import rootSaga from "../sagas";
import axios from "axios";

import LOAD_USER_REQUEST from "../reducers/user";

const PeaceOcean = ({ Component, store, pageProps }) => {
  //Component를 props로 전달
  return (
    <Provider store={store}>
      <Head>
        <title>PeaceOcean2</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
        />
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
        <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.js" />
      </Head>
      {/* next 에서 넣어주는 props 
        Head부분이 Component에 포함되어 AppLayout에 전달됨을 의미*/}
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </Provider>
  );
};
PeaceOcean.propTypes = {
  Component: PropTypes.elementType.isRequired, //jsx형식의 Component를 전달하는 경우
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired
};
//Next - Express의 동적 라우팅에서 전달 받은 값을
//각 Component로 보내는 중간 다리 역할
PeaceOcean.getInitialProps = async context => {
  const { ctx } = context;
  let pageProps = {};

  const state = ctx.store.getState();
  const cookie = ctx.isServer ? ctx.req.headers.cookie : "";
  if (ctx.isServer && cookie) {
    axios.defaults.headers.Cookie = cookie;
    //모든 axios에 대해 적용
  }
  if (!state.user.me) {
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST
    });
  }

  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(ctx);
  }

  return { pageProps };
  //Component의 props 해주는 역할!!!
};

//미들웨어 생성 예시
// const middleware = store => next => action => {
//   console.log(action); // 다른 작업들을 여기에
//   next(action);
// };

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware]; //미들웨어 삽입구간
  const enhancer =
    process.env.NODE_ENV === "production" //미들웨어 합침
      ? compose(applyMiddleware(...middlewares)) //미들웨어 적용
      : compose(
          applyMiddleware(...middlewares),
          !options.isServer &&
            window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : f => f //DevTools에 적용, 배포시 삭제
        );
  const store = createStore(reducer, initialState, enhancer);
  //store = state + reducer 인 것으로 선언 & 붙임
  store.sagaTask = sagaMiddleware.run(rootSaga);
  //생성한 saga미들웨어를 rootSaga를 통해 run
  return store;
};

export default withRedux(configureStore)(withReduxSaga)(PeaceOcean);
