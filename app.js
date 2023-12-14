const express = require('express');
const app = express();
const tasks = require('./routes/tasks');
const connectDB = require('./db/connect');
require('dotenv').config();
const notFound = require('./Middleware/not-found');
const errorHandlerMiddleware = require('./Middleware/error-handler');
//cors
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, //15 mins
    max: 100, //limit each ip to 100 requests per windowMs
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

//swagger

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('swagger.yaml');

//port
const port = process.env.PORT || 5000;

//middleware
// app.use(express.static('./public'));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('<h1>TASK API</h1><a href="/api/v1/docs">Documentation</a>');
});
app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
//routes
app.use('/api/v1/tasks', tasks);
app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Listening on port ${port} ...`));
  } catch (error) {
    console.log(error);
  }
};

start();
