import React, { useEffect } from "react";
import Link from "next/link"; //Router 로 전환되는 것을 next/link를 통해 설정
import PropTypes from "prop-types";
import { Col, Input, Menu, Row } from "antd";

//Component import
import LoginForm from "./LoginForm";
import UserProfile from "./UserProfile";

import { useSelector, useDispatch } from "react-redux";
import { LOAD_USER_REQUEST } from "../reducers/user";

const AppLayout = ({ children }) => {
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!me) {
      //유저 정보가 존재하지 않을 때, LOAD_USER_REQUEST요청을 보냄
      dispatch({
        type: LOAD_USER_REQUEST
      });
    }
  }, []);

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a>피스오션</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="mail">
          <Input.Search enterButton style={{ verticalAlign: "middle" }} />
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {/* 로그인 여부에 따라 컴포넌트를 다르게!!  */}
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
          {/* children으로 선언된 부분에서만 import된 해당 컴포넌트의 내용을 담고, 
          다른 부분은 AppLayout의 형태를 그대로 유지 */}
        </Col>
        <Col xs={24} md={6}>
          <Link href="http://peaceocean.cf">
            <a target="_blank">Made by guswo</a>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node
};

export default AppLayout;
