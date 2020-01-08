exports.module = function () {
  return {
    MONGO_DB_URI: 'mongodb+srv://<username>:<password>@cluster0-wijca.mongodb.net/<db_name>?retryWrites=true&w=majority',
    REDIS_URL: 'redis://127.0.0.1:6379',
    JWT_SECRET_KEY: 'jwtkey',
    JWT_EXPIRATION_TIME: '1d'
  }
}();
