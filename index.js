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
    // .then((action) => {
    //     if (action === 'Quit') {
    //         console.log('Goodbye');
    //         connection.end();
    //     }
    // });
    .then((action) => {
        switch (action.action) {
            case 'Add employee':
                console.log('employee added');
                connection.end();
                break;
            case 'Add department':
                console.log('department added');
                connection.end();
                break;
            case 'Add role':
                console.log('role added');
                connection.end();
                break;
            case 'Quit':
                console.log('Goodbye');
                connection.end();
                break;
        }
    });
}

connection.connect((err) => {
  if (err) throw err;
  manageOrg();
});
