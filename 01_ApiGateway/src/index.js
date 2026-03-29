const express = require("express");
const morgan = require("morgan");
const { default: rateLimit } = require("express-rate-limit");
const cors = require("cors");

const {  FORTEND_URL, PORT } = require("./serverConfig/server.config");
const {  authRoutes, paymentRoutes, remainderRoutes, ecommerceRoutes } = require("./routes/index");

const app = express();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 50,
});

app.use(morgan("combined"));
app.use(limiter);


app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [FORTEND_URL];
     
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'], // Add OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
    optionsSuccessStatus: 200 
  })
);


app.use("/auth", authRoutes);
app.use("/payment", paymentRoutes);
app.use("/ecommerce", ecommerceRoutes);
app.use("/remainder", remainderRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'api gateway is good to go' });
});

app.listen(PORT, () => {
  console.log(`ApiGateway Server Start on http://localhost:${PORT}`);
});
