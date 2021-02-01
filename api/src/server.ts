import express from "express";

const port = process.env.NODE_PORT || 4848;

export function run () {
  const app = express();

  app.get("/", function(_, res) {
    res.type('text/plain').send("Food can be served");
  });

  return app.listen(port, function () {
    // Port is forwarded by docker to 80.
    console.log(`Listening on http://localhost:${port}`);
  })
}

if(process.env.NODE_ENV !== 'testing') {
  run();
}
