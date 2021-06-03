const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'EmpManSys_DB',
});

function manageOrg() {
    inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'Select an action...',
      choices: ['Add employee', 'Add department', 'Add role', 'Quit'],
    })
    .then((action) => {
        switch (action.action) {
            case 'Add employee':
                console.log('employee added');
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Add role':
                console.log('role added');
                break;
            case 'Quit':
                console.log('Goodbye');
                connection.end();
                break;
        }
    });
}

function addDepartment() {
    inquirer
    .prompt([
      {
        name: 'department',
        type: 'input',
        message: 'Department name...',
      }])
    .then((data) => {
      connection.query(
        'INSERT INTO department SET ?',
        {
          name: data.department
        },
        (err) => {
          if (err) throw err;
          console.log('Department created.');
          manageOrg();
        }
      );
    });

}

connection.connect((err) => {
  if (err) throw err;
  manageOrg();
});
