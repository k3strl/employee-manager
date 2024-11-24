import { pool } from "./connection.js";
import { QueryResult } from "pg";


export default class DB {
    constructor() {}

    async query(sql: string, args: any[] = []): Promise<QueryResult> {
        const client = await pool.connect();
// finally will happen no matter what; we still release the connection with client.release()
        try {
            return client.query(sql, args);
        } finally {
            client.release();
        }
    }
    
    // get/view all employees
    getAllEmployees() {
        return this.query(
            "SELECT id, first_name, last_name, role_id, manager_id FROM employee"
        );
    }
    
    // create/add employee
    addEmployee(first_name: string, last_name: string, role_id: number) {
        return this.query(
            "INSERT INTO employee(first_name, last_name, role_id) VALUES ($1, $2, $3)",
            [first_name, last_name, role_id]
        );

    }
    
    // get/view all roles
    getAllRoles() {
        return this.query(
            "SELECT title, salary, department_id FROM role"
        );
    }

    // create/add a role 
    addRole(title: string, salary: number, department_id: number) {
        return this.query(
            "INSERT INTO role(title, salary, department_id) VALUES ($1, $2, $3)",
            [title, salary, department_id]
        );
    }
    // update/change employee role (promotion!)
    updateEmployeeRole(employee_id: number, role_id: number) {
        return this.query(
            "UPDATE employee SET role_id = $1 WHERE id = $2",
            [role_id, employee_id]
        );
    }
    
    // add a department
    addDepartment(dept_name: string) {
        return this.query(
            "INSERT INTO department(dept_name) VALUES ($1)",
            [dept_name]
        );
    }
    // get/view all departments
    getAllDepartments() {
        return this.query(
            "SELECT * FROM department"
        );
    }

    // BONUS: delete employee (you're fired!)
    deleteEmployee(employee_id: number) {
        return this.query(
            "DELETE FROM employee WHERE id = $1",
            [employee_id]
        );
    }

}