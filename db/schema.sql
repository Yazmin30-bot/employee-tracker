DROP DATABASE IF EXISTS employees;
--Create a employees database
CREATE DATABASE employees;

USE employees;

--Create a department table
CREATE TABLE department (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);