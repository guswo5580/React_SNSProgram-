const express = require("express");
const next = require("next");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");

const dev = process.env.NODE_ENV !== "production";
const prod = process.env.NODE_ENV === "production";

//Next에 Express 서버 입히기
const app = next({ dev });
const handle = app.getRequestHandler();
dotenv.config();

app.prepare().then(() => {
  const server = express();
  server.use(morgan("dev"));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  //COOKIE_SECRET 은 Back 부분과 같은 걸로
  server.use(cookieParser(process.env.COOKIE_SECRET));
  server.use(
    expressSession({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
        secure: false
      }
    })
  );
  // 동적 Routing을 위한 Front의 Routing 추가!!!
  server.get("/hashtag/:tag", (req, res) => {
    return app.render(req, res, "/hashtag", { tag: req.params.tag });
    //주소는 :tag가 붙어있지만!! 실제로 보여주는 페이지는 pages에 있는 해당 페이지
    //params로 Data를 전달 ---> hashtag 내부에서 getInitialProps로 전달됨!!
  });

  server.get("/user/:id", (req, res) => {
    return app.render(req, res, "/user", { id: req.params.id });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3060, () => {
    console.log("next_express running on port 3060");
  });
});
