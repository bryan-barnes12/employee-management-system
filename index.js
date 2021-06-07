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
      choices: ['Add employee', 'Add department', 'Add role', 'View employees', 'View departments', 'View roles', 'Update employee role', 'Quit'],
    })
    .then((action) => {
        switch (action.action) {
            case 'Add employee':
                addEmployee();
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Add role':
                addRole();
                break;
            case 'View employees':
                viewEmployees();
                break;
            case 'View departments':
                viewDepartments();
                break;
            case 'View roles':
                viewRoles();
                break;
            case 'Update employee role':
                updateEmployee();
                break;
            case 'Quit':
                console.log('Goodbye');
                connection.end();
                break;
        }
    });
}

function addEmployee() {
    connection.query('SELECT * FROM role', (err, roleData) => {
      if (err) throw err;
      connection.query('SELECT * FROM employee', (err, managerData) => {
        if (err) throw err;
        inquirer
        .prompt([
            {
            name: 'role',
            type: 'rawlist',
            choices() {
                const roleArray = [];
                roleData.forEach(({ title }) => {
                roleArray.push(title);
                });
                return roleArray;
            },
            message: 'Role...',
            },
            {
            name: 'manager',
            type: 'rawlist',
            choices() {
                    const managerArray = [];
                    managerData.forEach(({ first_name, last_name }) => {
                    managerArray.push(first_name + ' ' + last_name);
                    })
                    managerArray.push('None')
                    return managerArray;
            },
            message: 'Manager...',
          },
          {
            name: 'first_name',
            type: 'input',
            message: 'First Name...',
          },
          {
            name: 'last_name',
            type: 'input',
            message: 'Last Name...',
          },
          ])
        .then((answer) => {
            const roleId = roleData.filter(el => el.title === answer.role)
            const managerId = managerData.filter(el => (el.first_name + ' ' + el.last_name) == answer.manager)
            if (managerId.length) {
                connection.query('INSERT INTO employee SET ?',
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: roleId[0].id,
                    manager_id: managerId[0].id
                },
                (err) => {
                    if (err) throw err;
                    console.log('Employee created.');
                    manageOrg();
                })
            } else {
                connection.query('INSERT INTO employee SET ?',
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: roleId[0].id,
                    manager_id: null
                },
                (err) => {
                    if (err) throw err;
                    console.log('Employee created.');
                    manageOrg();
                })

            }
        });
    });
});
}

function viewEmployees() {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(b.first_name, " ", b.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.id=department.id LEFT JOIN employee AS b ON employee.manager_id=b.id', (err, data) => {
        if (err) throw err;
        console.table(data);
        manageOrg();
    })
}

function updateEmployee() {
    connection.query('SELECT * FROM role', (err, roleData) => {
    if (err) throw err;
    connection.query('SELECT * FROM employee', (err, employeeData) => {
      if (err) throw err;
      inquirer
      .prompt([
        {
            name: 'employee',
            type: 'rawlist',
            choices() {
                    const empArray = [];
                    employeeData.forEach(({ first_name, last_name }) => {
                    empArray.push(first_name + ' ' + last_name);
                    })
                    empArray.push('None')
                    return empArray;
            },
            message: 'Manager...',
          },
            {
          name: 'newRole',
          type: 'rawlist',
          choices() {
              const roleArray = [];
              roleData.forEach(({ title }) => {
              roleArray.push(title);
              });
              return roleArray;
          },
          message: 'New role...',
          },
        ])
      .then((answer) => {
          const roleId = roleData.filter(el => el.title === answer.newRole);
          const employeeId = employeeData.filter(el => (el.first_name + ' ' + el.last_name) == answer.employee)
            connection.query('UPDATE employee SET ? WHERE ?',
            [
                {
                    role_id: roleId[0].id
                },
                {
                    id: employeeId[0].id
                }
            ],
              (err) => {
                  if (err) throw err;
                  console.log('Employee role updated.');
                  manageOrg();
              })
        });
  });
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

function viewRoles() {
    connection.query('SELECT role.title, role.salary, department.name FROM role LEFT JOIN department ON role.department_id=department.id', (err, data) => {
        if (err) throw err;
        console.table(data);
        manageOrg();
    })
}

connection.connect((err) => {
  if (err) throw err;
  manageOrg();
});
