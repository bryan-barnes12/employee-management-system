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
      choices: ['Add employee', 'Add department', 'Add role', 'View departments', 'Quit'],
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
                addRole();
                break;
            case 'View departments':
                viewDepartments();
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

function viewDepartments() {
    connection.query('SELECT name FROM department', (err, data) => {
        if (err) throw err;
        console.table(data);
        manageOrg();
    })
}

function addRole() {
  connection.query('SELECT * FROM department', (err, data) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'department',
          type: 'rawlist',
          choices() {
            const deptArray = [];
            data.forEach(({ name }) => {
              deptArray.push(name);
            });
            return deptArray;
          },
          message: 'Department...',
        },
        {
            name: 'title',
            type: 'input',
            message: 'Title...',
          },
        {
          name: 'salary',
          type: 'input',
          message: 'Salary...',
        },
        ])
      .then((answer) => {
          const deptId = data.filter(el => el.name === answer.department)
          connection.query('INSERT INTO role SET ?',
          {
              title: answer.title,
              salary: answer.salary,
              department_id: deptId[0].id
          },
          (err) => {
              if (err) throw err;
              console.log('Role created.');
              manageOrg();
          })

      });
  });
}

connection.connect((err) => {
  if (err) throw err;
  manageOrg();
});
