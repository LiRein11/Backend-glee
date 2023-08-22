require('dotenv').config();
const sequelize = require('./db');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');
const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors()); // Для того, чтобы отправлять запросы с браузера
app.use(express.json()); // Для того, чтобы приложение могло парсить json формат
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

// Обработка ошибок. Middleware с ошибками должен регистрироваться в самом конце(на нём работа прекращается и next не будет)
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate(); // С помощью этой функции будет устанавливаться подключение к БД
    await sequelize.sync(); // Функция будет сверять состояние БД со схемой данных
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
