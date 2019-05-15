import React, { useCallback, useState, useEffect } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import { SIGN_UP_REQUEST } from "../reducers/user";

//onChange 부분에 useCallback을 사용했어도
//id input 에서 작성 -> 전체 form이 rerendering
//하지만 이 이상 최적화를 하면 너무 지나침
//굳이 하자면..
// const TextInput = memo( {value, onChange}) => {
//     return (
//         <Input name='user-id' value={value} required onChange={onChange} />
//     );
//     로 표현 후 form 안에 삽입
// };

//기본 Form 커스텀 훅
export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue);
  //자식으로 넘겨주는 이벤트에는 useCallback을 붙여 리렌더링 방지
  const handler = useCallback(e => {
    //useCallback - memo와 같이 컴포넌트의 rerendering 영역을 최소로 설정
    setter(e.target.value);
  }, []);
  return [value, handler];
}; //모듈화로 재사용

const Signup = () => {
  // e.target.value로 전달 받는 커스텀 훅 이용 state
  const [id, onChangeId] = useInput("");
  const [nick, onChangeNick] = useInput("");
  const [password, onChangePassword] = useInput("");

  ////////////커스텀 훅으로 묶을 수 없는 나머지 영역은 useState로 선언//////////////
  const [passwordCheck, setPasswordCheck] = useState("");
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  const dispatch = useDispatch();
  const { isSigningUp, me } = useSelector(state => state.user);

  useEffect(() => {
    if (me) {
      alert("메인화면으로 이동합니다");
      Router.push("/");
    }
  }, [me && me.id]);
  //useEffect의 변화 state로 객체를 비교하는 것은 부적절
  //객체 여부와 객체 내부 내용으로 Effect 타이밍 잡기

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      if (password !== passwordCheck) return setPasswordError(true);

      if (!term) return setTermError(true);

      //회원가입 요청 시 action을 dispatch
      return dispatch({
        type: SIGN_UP_REQUEST,
        data: {
          id,
          password,
          nick
        }
      });
    },
    [password, passwordCheck, term]
  );
  //state 붙여 해당 state가 바뀔 때 rerendering
  //내부에서 state에 대해 이용을 하면 rerendering 할 수 있게 붙여주어야 한다

  const onChangePasswordCheck = useCallback(
    e => {
      setPasswordError(e.target.value !== password);
      setPasswordCheck(e.target.value);
    },
    [password]
  );
  const onChangeTerm = useCallback(e => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  return (
    <>
      <Form onSubmit={onSubmit} style={{ padding: 10 }}>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <Input name="user-id" value={id} required onChange={onChangeId} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input
            name="user-nick"
            value={nick}
            required
            onChange={onChangeNick}
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input
            name="user-password"
            value={password}
            type="password"
            required
            onChange={onChangePassword}
          />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호 확인</label>
          <br />
          <Input
            name="user-password-check"
            value={passwordCheck}
            type="password"
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && (
            <div style={{ color: "red" }}>비밀번호가 일치하지 않습니다</div>
          )}
        </div>
        <div>
          <Checkbox name="user-term" value={term} onChange={onChangeTerm}>
            깨끗하게 이용할 것에 동의 합니다
          </Checkbox>
          {termError && <div style={{ color: "red" }}>동의하셔야 합니다</div>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={isSigningUp}>
            가입하기
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Signup;
