const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./Routes/chat');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/', userRoutes);

app.listen(4000); 