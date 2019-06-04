//Next 설정 변경 파일!!!
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});
//웹펙 번들링 과정 체킹
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
//파일 확장자를 .gz 를 붙여 작성가능 main.js.gz
//원래 용량을 줄일 수 있도록

module.exports = withBundleAnalyzer({
  distDir: ".next",

  // 공식문서의 내용 덮어쓰기
  // @zeit/bundle-analyzer -> @next/bundle-analyzer로 변경!! 설정이 알아서 작동
  // analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
  // analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
  // client , server 두개의 파일 생성
  // html 파일을 통해 각 코드의 용량(parsing 전 후)을 체크 가능
  // bundle 하나하나가 1메가를 넘지 않도록... 넘으면 코드 스플리팅...
  // bundleAnalyzerConfig: {
  //   server: {
  //     analyzerMode: "static",
  //     reportFilename: "../bundles/server.html"
  //   },
  //   browser: {
  //     analyzerMode: "static",
  //     reportFilename: "../bundles/client.html"
  //   }
  // },

  webpack(config) {
    //기본 next의 webpack 설정에 덧붙여서 업데이트
    const prod = process.env.NODE_ENV === "production";
    const plugins = [
      ...config.plugins,
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/)
      //모멘트의 언어 지원 다운 예시 -- treeshaking 설정
    ];
    if (prod) {
      plugins.push(new CompressionPlugin());
      //.gz 파일로 압축시키는 과정
      //배포시에만 적용하면 OK
      //배포 모드일 때 plugins에 추가!!!
    }

    return {
      ...config, //기본 내용
      mode: prod ? "production" : "development", //배포, 개발 모드
      devtool: prod ? "hidden-source-map" : "eval",
      //hidden-soure-map : 소스코드 숨김, 에러 시 소스맵 제공
      //eval : 빠르게 웹펙 적용
      module: {
        //antd의 icon의 큰 용량을 tree shaking 할 수 있는 방법
        //npm i webpack-ant-icon-loader
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            loader: "webpack-ant-icon-loader",
            enforce: "pre",
            include: [require.resolve("@ant-design/icons/lib/dist")]
          }
        ]
      },
      plugins
      //설정한 plugin 모드를 제공
    };
  }
});
