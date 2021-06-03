const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'EmpManSys_DB',
});

connection.connect((err) => {
  if (err) throw err;
  connection.end();
});
