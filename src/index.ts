import inquirer from "inquirer";
import express from "express";
import { connectToDb } from "./db/connection";
import {
  viewAllDepartments,
  viewAllRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  changeRole,
} from "./actions.js";
import Db from "./db/index.js";

await connectToDb();

const db = new Db();

db.getAllEmployees()
    .then(({ rows }) => {
        console.table(rows);
    });

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use (express.json());

const startCli = (): void => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Change an employee role",
        ],
      },
    ])
    .then((answers) => {
      if (answers.action === "View all departments") {
        viewAllDepartments(startCli);
      } else if (answers.action === "View all roles") {
        viewAllRoles(startCli);
      } else if (answers.action === "View all employees") {
        viewEmployees(startCli);
      } else if (answers.action === "Add a department") {
        addDepartment(startCli);
      } else if (answers.action === "Add a role") {
        addRole(startCli);
      } else if (answers.action === "Add an employee") {
        addEmployee(startCli);
      } else if (answers.action === "Change an employee role") {
        changeRole(startCli);
      }
    });
};

startCli();
