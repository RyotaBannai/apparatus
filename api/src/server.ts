import express from "express";
import path from "path";
import router from "./router";
import "reflect-metadata";

const app: express.Express = express();

// CORSの許可: ローカル環境以外からAPIを実行したい時に必要
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// body-parserに基づいたリクエストの解析: クライアントのデータを取得する際に必要. 従来はbody-parserパッケージをインストールして実装していたが、Express標準に組み込まれた
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("views", path.join(__dirname, "resources/views/"));
app.set("view engine", "ejs");

app.use(router);

// 3000 番ポートで API サーバー起動
app.listen(3000, () => {
  console.log("API server listening on part 3000");
});
