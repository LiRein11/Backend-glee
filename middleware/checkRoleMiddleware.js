const jwt = require('jsonwebtoken');

module.exports = function(role){
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    } // Интересны только методы put post get delete, поэтому если это не они, то скип
    try {
      const token = req.headers.authorization.split(' ')[1]; // Bearer fsafasfsafaw
      if (!token) {
        return res.status(403).json({ message: 'Не авторизован' });
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY); // Проверка токена на валидность
      req.user = decoded;
      if(decoded.role !==role){
        return res.status(403).json({message: 'Нет доступа'})
      }
      next();
    } catch (e) {
      res.status(401).json({ message: 'Не авторизован' });
    }
  };
}


