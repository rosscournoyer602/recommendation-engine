const { JogooClient, JogooInstall } = require("jogoo");

(async () => {
  let jogooClient = new JogooClient();
  await jogooClient.connect();
  const jogooInstall = new JogooInstall(jogooClient);
  await jogooInstall.do();
  jogooClient.end();
})();
