import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";

//Component import
import AppLayout from "../components/AppLayout";

//Redux import
import { Provider } from "react-redux";
import reducer from "../reducers";
import withRedux from "next-redux-wrapper"; //props로 store을 넣어주는 것을 선언
import { createStore, compose, applyMiddleware } from "redux";
//using Redux middleware
import sagaMiddleware from "../sagas/middleware";
import rootSaga from "../sagas/index";
import createSagaMiddleware from "redux-saga";

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
      {/* next 에서 넣어주는 props 
        Head부분이 Component에 포함되어 AppLayout에 전달됨을 의미*/}
      <AppLayout>
        <Component />
      </AppLayout>
    </Provider>
  );
};
PeaceOcean.propTypes = {
  Component: PropTypes.elementType.isRequired, //jsx형식의 Component를 전달하는 경우
  store: PropTypes.object.isRequired
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
  sagaMiddleware.run(rootSaga);
  //생성한 saga미들웨어를 rootSaga를 통해 run

  return store;
};

export default withRedux(configureStore)(PeaceOcean);
