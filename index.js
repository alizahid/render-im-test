const { join } = require("node:path");

const GM = require("gm");

const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("@fastify/static"), {
  root: join(__dirname, "public"),
  prefix: "/public/",
});

fastify.get("/convert", async (req, reply) => {
  const file = await convert();

  return reply.send(file);
});

fastify.listen(
  {
    host: "0.0.0.0",
    port: Number(process.env.PORT ?? 3000),
  },
  (err, address) => {
    if (err) {
      throw err;
    }
  }
);

const gm = GM.subClass({
  appPath: process.env.IMAGE_MAGICK_PATH,
  imageMagick: "7+",
});

async function convert() {
  return new Promise((resolve, reject) => {
    const document = join(__dirname, "public", "document.pdf");

    gm(document)
      .density(144)
      .stream("jpg", (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
  });
}
