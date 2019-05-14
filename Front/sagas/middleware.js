import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();

export default sagaMiddleware;
//saga에서 제공하는 기본 골격에 따라 작성
//_app.js 의 middleware 부분에 연결
