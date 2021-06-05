//Import mysql and inquirer dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');

//Create the conexion with mysql
const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port, if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: 'root',
    database: 'employees',
    multipleStatements: true,
  });

//Connect and start the functionality
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    startPrompt();
  });

  //Prompt all the options using inquirer dependency
const startPrompt = () => {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View All Employees', 
          'View All Employees By Department',
          'View All Employees By Manager',
          'Add Employee',
          'Remove Employee',
          'Update Employee Role',
          'Update Employee Manager',
          'View All Roles',
          'Add Role',
          'Remove Role',
          'View All Departments',
          'Add Department',//Done
          'Remove Department',//Done
          'View the total utilized budget of a department',
          'Quit',//Done
  
        ],
      })
      .then((answer) => {
        //With the selected option call its function 
        switch (answer.action) {
          case 'View All Employees':
            allEmployees(); 
            break;
  
          case 'View All Employees By Department':
            departmentEmployees();
            break;
  
          case 'View All Employees By Manager':
            managerEmployees(); 
            break;
  
          case 'Add Employee':
            addEmployee();
            break;
  
          case 'Remove Employee':
            //removeEmployee();
            break;
  
          case 'Update Employee Role':
            //updateEmployeeRole();
            break;
  
          case 'Update Employee Manager':
            //updateEmployeeManager();
            break;
  
          case 'View All Roles':
            //allRoles(); 
            break;
  
          case 'Add Role':
            //addRole();
            break;
  
          case 'Remove Role':
            //removeRole();
            break;
  
          case 'View All Departments':
            //allDepartments();
            break;
  
          case 'Add Department':
            //addDepartment();
            break;
  
          case 'Remove Department':
            //removeDepartment();
            break;
  
          case 'View the total utilized budget of a department':
            //budgetDepartment();
            break;
  
          case 'Quit':
            connection.end();
            break;
  
          default:
            console.log(`Invalid action: ${answer.action}`);
            //connection.end();
            break;
        }
      });
  };

  //Show a table join the employee role and department table
  const allEmployees = () => {
    let query = 'SELECT  employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, concat(m.first_name," ", m.last_name) as manager FROM employee LEFT OUTER JOIN employee m ON employee.manager_id = m.id INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id ORDER by employee.id';
    connection.query(query, (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      const transformed = res.reduce((acc, {id, ...x }) => { acc[id] = x; return acc }, {})
      console.table(transformed);
      startPrompt();
    });
  };

  //Show all employees by selected department
  const departmentEmployees = () => {
    connection.query('SELECT * FROM department', (err, results) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: 'choice',
            type: 'list',
            choices() {
              return results.map((item) => item.name);
            },
            message: 'Which department would you like to see employees for ?',
          },
        ])
        .then((answer) => {
          let query = 'SELECT  employee.id, employee.first_name, employee.last_name, role.title, role.salary, concat(m.first_name," ", m.last_name) as manager FROM employee LEFT OUTER JOIN employee m ON employee.manager_id = m.id INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id WHERE department.name = ? ORDER by employee.id ';
          connection.query(query, [answer.choice], (err, res) => {
            if (err) throw err;
            const transformed = res.reduce((acc, { id, ...x }) => { acc[id] = x; return acc }, {})
            console.table(transformed)
            startPrompt();
          });
        });
    });
  };

  //Show all employees by selected manager
  const managerEmployees = () => {
    let query = 'SELECT  employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, concat(m.first_name," ", m.last_name) as manager FROM employee LEFT OUTER JOIN employee m ON employee.manager_id = m.id INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id WHERE employee.manager_id IS NOT NULL GROUP by employee.manager_id ORDER by employee.id';
    connection.query(query, (err, results) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: 'choice',
            type: 'list',
            choices() {
              return results.map((item) => item.manager);
            },
            message: 'What manager would you like to choose?',
          },
        ])
        .then((answer) => {
          let query = 'SELECT id, first_name, last_name, title, department, salary  FROM (SELECT  employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, concat(m.first_name," ", m.last_name) as manager FROM employee LEFT OUTER JOIN employee m ON employee.manager_id = m.id INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id  ORDER by employee.id ) AS r  WHERE r.manager= ?'
          connection.query(query, [answer.choice], (err, res) => {
            if (err) throw err;
            const transformed = res.reduce((acc, { id, ...x }) => { acc[id] = x; return acc }, {})
            console.table(transformed)
            startPrompt();
          });
        });
    });
  };

  //Add an employee
  const addEmployee = () => {
    connection.query('SELECT concat(id," ",title) as rolid FROM role; SELECT concat(man_id," ", manager) as manid FROM (SELECT  employee.id, employee.first_name, employee.last_name, role.title, role.salary, concat(m.first_name," ", m.last_name) as manager, m.id as man_id  FROM employee LEFT OUTER JOIN employee m ON employee.manager_id = m.id INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id GROUP by employee.manager_id ORDER by employee.id ) as manager LEFT OUTER JOIN employee r ON manager.man_id = r.id;', (err, results) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: 'first_name',
            type: 'input',
            message: "What is the employee's first name?",
          },
          {
            name: 'last_name',
            type: 'input',
            message: "What is the employee's last name?",
          },
          {
            name: 'role_id',
            type: 'list',
            choices() {
              return results[0].map((item) => item.rolid);
            },
            message: "What is the employee's role?",
          },
          {
            name: 'manager_id',
            type: 'list',
            choices() {
              const choiceArray = [];
              results[1].forEach(({ manid }) => {
                if (manid == null) {
                  choiceArray.push('None');
                } else {
                  choiceArray.push(manid);
                }
              });
              return choiceArray;
            },
  
            message: "What is the employee's manager?",
          },
        ])
        .then((answer) => {
          const strman = answer.manager_id;
          var strmanid = null;
          if (strman !== 'None') {
            strmanid = parseInt(strman.slice(0, strman.indexOf(' ')));
            console.log(strmanid);
          }
  
          const strrol = answer.role_id;
          const strrolid = parseInt(strrol.slice(0, strrol.indexOf(' ')));
          let query = 'INSERT INTO employee SET ?';
          connection.query(
            query,
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: strrolid,
              manager_id: strmanid,
            },
            (err) => {
              if (err) {
                throw err,
                console.log("Make sure that the role id and manager id exist")
              };
              console.log('A new employee was created successfully!');
              startPrompt();
            }
          );
        });
    });
  };