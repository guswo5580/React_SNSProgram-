import React from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";

const Home = () => {
  return (
    <>
      {/* Next에서 css, script 등의 파일을 설정하고 싶을 때, index.html에 설정하는 것이 아니라 Head 속성을 이용하여 설정 */}
      <Head>
        <title>NodeBird</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
        />
      </Head>
      {/* 모든 화면에 AppLayout이 포함되기 때문에 모두 설정해주어야 한다 */}
      <AppLayout>
        <div>Hello, Next!</div>
      </AppLayout>
    </>

    // 위와 같은 중복은 후에 꼭 처리를 해주어야 함
  );
};

export default Home;
