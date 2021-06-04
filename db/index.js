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