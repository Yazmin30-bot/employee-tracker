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
            //departmentEmployees();
            break;
  
          case 'View All Employees By Manager':
            //managerEmployees(); 
            break;
  
          case 'Add Employee':
            //addEmployee();
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