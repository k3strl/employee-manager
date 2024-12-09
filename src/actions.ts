import { QueryResult } from "pg";
import { pool } from "./db/connection.js";
import Table from "cli-table3";
import inquirer from "inquirer";
// import { v4 as uuidv4 } from 'uuid';

export const viewAllDepartments = (startCli: () => void): void => {
  pool.query(
    `SELECT id, department_name AS name FROM department`,
    (err: Error, result: QueryResult) => {
      console.log(err);
      if (err) {
        console.log("error viewing departments");
        startCli();
      } else if (result) {
        const table = new Table({
          head: ["ID", "Name"],
          colWidths: [5, 20],
        });
        result.rows.forEach((row) => {
          table.push([row.id, row.name]);
        });
        console.log(table.toString());
        startCli();
      }
    }
  );
};

export const viewAllRoles = (startCli: () => void): void => {
  pool.query(
    `SELECT id, title, department_id AS department, salary FROM role`,
    (err: Error, result: QueryResult) => {
      if (err) {
        console.log("error viewing roles");
        startCli();
      } else if (result) {
        const table = new Table({
          head: ["ID", "Title", "Department", "Salary"],
          colWidths: [5, 20, 15, 10],
        });
        result.rows.forEach((row) => {
          table.push([row.id, row.title, row.department, row.salary]);
        });
        console.log(table.toString());
        startCli();
      }
    }
  );
};

export const getAllEmployees = (startCli: () => void): void => {
  pool.query(
    `SELECT
           employee.id, 
           employee.first_name, 
           employee.last_name,
           role.title, role.salary, 
           department.department_name AS department, 
           COALESCE(manager.first_name || ' ' || manager.last_name, 'None') AS manager
     FROM 
           employee 
     JOIN
           role ON employee.role_id = role.id 
     JOIN
           department ON role.department_id = department.id
     LEFT JOIN
           employee AS manager ON employee.manager_id = manager.id`,
    (err: Error, result: QueryResult) => {
      if (err) {
        console.log("error viewing employees");
        startCli();
      } else if (result) {
        const table = new Table({
          head: [
            "ID",
            "First Name",
            "Last Name",
            "Title",
            "Department",
            "Salary",
            "Manager",
          ],
          colWidths: [5, 15, 15, 20, 15, 15, 15],
        });
        result.rows.forEach((row) => {
          table.push([
            row.id,
            row.first_name,
            row.last_name,
            row.title,
            row.department,
            row.salary,
            row.manager,
          ]);
        });
        console.log(table.toString());
        startCli();
      }
    }
  );
};

export const addDepartment = (startCli: () => void): void => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "response",
        message: "What is the name of the department?",
      },
    ])
    .then((answer) => {
      const departmentName = answer.response;

      pool.query(
        `INSERT INTO department (department_name) VALUES ($1) RETURNING id, department_name`,
        [departmentName],
        (err: Error, result: QueryResult) => {
          if (err) {
            console.log("error adding department");
          } else {
            const department = result.rows[0];
            console.log(
              `${department.department_name} was added successfully!`
            );
            startCli(); // Moved inside the else block
          }
        }
      );
    });
};

export const getDepartments = async (): Promise<string[]> => {
  try {
    const result: QueryResult = await pool.query(
      `SELECT department_name FROM department`
    );
    const departments = result.rows.map((row) => row.department_name);
    return departments;
  } catch (err) {
    console.log("error fetching departments");
    throw err;
  }
};

export const addRole = async (callback: () => void) => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter the role title:",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the role salary:",
    },
    {
      type: "input",
      name: "department_id",
      message: "Enter the department ID (integer):",
      validate: (input) => !isNaN(parseInt(input)) || "Please enter a valid number",
    },
  ]);

  try {
    await pool.query(
      "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
      [answers.title, answers.salary, parseInt(answers.department_id)]
    );
    console.log("Role added successfully!");
    callback();
  } catch (err) {
    console.error("Error adding role:", err);
  }
};

const getRoles = async (): Promise<string[]> => {
  try {
    const result: QueryResult = await pool.query(`SELECT title FROM role`);
    const roles = result.rows.map((row) => row.title);
    return roles;
  } catch (err) {
    console.log("error fetching roles");
    throw err;
  }
};

// const getAllEmployees = async (): Promise<string[]> => {
//   try {
//     const result: QueryResult = await pool.query(
//       `SELECT first_name, last_name FROM employee`
//     );
//     const managers = result.rows.map(
//       (row) => `${row.first_name} ${row.last_name}`
//     );
//     return managers;
//   } catch (err) {
//     console.log("error fetching employees");
//     throw err;
//   }
// };

export const addEmployee = (startCli: () => void): void => {
  Promise.all([getRoles(), getEmployeesInfo()]).then(([roles, managers]) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employee's last name?",
        },
        {
          type: "list",
          name: "role",
          message: "What is the employee's role?",
          choices: roles,
        },
        {
          type: "list",
          name: "managers",
          message: "Who is the employee's manager?",
          choices: managers,
        },
      ])
      .then((answer) => {
        Promise.all([
          pool.query(`SELECT id FROM role WHERE title = $1`, [answer.role]),
          pool.query(
            `SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = $1`,
            [answer.managers]
          ),
        ]).then(([roleAnswer, managerAnswer]) => {
          const roleId = roleAnswer.rows[0].id;
          const managerId = managerAnswer.rows[0].id;

          pool.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES  ($1, $2, $3, $4)`,
            [answer.firstName, answer.lastName, roleId, managerId],
            (err: Error) => {
              if (err) {
                console.log("error adding employee");
                throw err;
              } else {
                console.log(
                  `Employee ${answer.firstName} ${answer.lastName} was added successfully!`
                );
              }
              startCli();
            }
          );
        });
      });
  });
};

const getEmployeesInfo = async (): Promise<{ name: string; id: string }[]> => {
  try {
    const result: QueryResult = await pool.query(
      `SELECT id, first_name, last_name FROM employee`
    );
    return result.rows.map((row) => ({
      id: `${row.id}`,
      name: `${row.first_name} ${row.last_name}`,
    }));
  } catch (err) {
    console.log("error fetching employees");
    throw err;
  }
};

export const changeRole = async (startCli: () => void): Promise<void> => {
  try {
    const [employees, roles] = await Promise.all([
      getEmployeesInfo(),
      getRoles(),
    ]);

    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Choose an employee",
        choices: employees.map((employee) => ({
          name: employee.name,
          value: employee.id,
        })),
      },
      {
        type: "list",
        name: "role",
        message: "Choose a role to switch to",
        choices: roles,
      },
    ]);

    const roleResult = await pool.query(
      `SELECT id FROM role WHERE title = $1`,
      [answers.role]
    );

    await pool.query(`UPDATE employee SET role_id = $1 WHERE id = $2`, [
      roleResult.rows[0].id,
      answers.employeeId,
    ]);

    console.log("Employee's role updated successfully!");
    startCli();
  } catch (err) {
    console.log("error updating employee's role");
    throw err;
  }
};
