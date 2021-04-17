module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "testdb",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 3306,
    idle: 10000
  }
};