const fastify = require('fastify')();
const cors = require('@fastify/cors');
const fs = require('fs');

console.log(new Date().toTimeString())

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
  allowedHeaders: ['Content-Type'],
});

fastify.get("/list", (req, reply) => {
  const datazz = fs.readFileSync('license.json');
  const tokens = JSON.parse(datazz);
  reply.send(tokens)
})

fastify.post('/auth', (req, reply) => {
  const { ip, token } = req.body;

  const datazz = fs.readFileSync('license.json');
  const tokens = JSON.parse(datazz);
  console.log(tokens)
  for (const data of tokens) {
    if (data.key === token) {
      let expdate = new Date(data.exp)
      let currentDate = new Date()
      currentDate.setHours(currentDate.getHours()+10)
      if (currentDate >= expdate) {
        reply.send({
          "auth":"DENIED",
          "message":"Token is expired",
          "colorCode":"#b90000"
        })
      }
      reply.send({
        auth: 'SUCCESS',
        message: `Access Granted - Welcome back ${data.name}`,
        exp: 'TRUE',
        pexp: data.exp,
        ct: new Date().toISOString(),
        msg: 'Welcome back!',
        color: 'red'
      });
    }
  }
  reply.send({
    "auth":"DENIED",
    "message":"Invalid Token.",
    "colorCode":"#b90000"
  })
});

fastify.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server started on port 3000');
});