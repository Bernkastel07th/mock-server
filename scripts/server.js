/*
 * @file JSON-serverの構成を制御する
 */

const jsonServer = require("json-server");
const mergeMockJson = require("./merge_mock_json");
const routes = require("../routes.json");

// Expressをインスタンス化する
const server = jsonServer.create();

// routes.jsonの内容を記載
server.use(jsonServer.rewriter(routes));

// ミドルウェアの設定（コンソール出力やLogger、キャッシュの設定）
const middlewares = jsonServer.defaults();
server.use(middlewares);

// JSON-serverを通してPOST処理をすると、リソースが書き換わってしまうのでPOSTリクエストをGETリクエストに偽装する
server.use(function(req, res, next) {
  if (req.method === "POST") {
    // POST送信を受ける場合、受けたPOSTレスポンスをGETに変更する
    req.method = "GET";
  }
  // Continue to JSON-server router
  next();
});

// db.jsonを生成する
mergeMockJson();
// db.jsonを基にデフォルトのルーティングを設定する
const db = require("../db.json");
const router = jsonServer.router(db);
server.use(router);

// サーバーをポート3001で起動する
server.listen(3001, () => {
  console.log("JSON-server is running");
});
