import React from "react";
import Link from "next/link"; //next의 링크 사용하는 방법
import { Menu, Input, Button } from "antd";

//각 라우터에도 변하지 않는 고정 UI를 적용할 경우
//Link를 통해 라우터만 바꿔주고, 나머지는 고정
const AppLayout = ({ children }) => {
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          {/* Link와 a태그를 이용하여 표현 - 자동으로 코드 스플리팅이 적용된 주소 시스템 이용 가능 */}
          {/* query, param 의 내용도 Link에 담아 전송 가능 */}
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="mail">
          <Input.Search enterButton style={{ verticalAlign: "middle" }} />
        </Menu.Item>
      </Menu>
      <Link href="/signup">
        <a>
          <Button>회원가입</Button>
        </a>
      </Link>
      {children}
    </div>
  );
};

export default AppLayout;
