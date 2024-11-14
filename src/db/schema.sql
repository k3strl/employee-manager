\c postgres;

DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

\c company_db;

CREATE TABLE department(
    id SERIAL PRIMARY KEY NOT NULL,
    dept_name VARCHAR(30) UNIQUE NOT NULL
)

CREATE TABLE role(
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
-- holds reference to dept role belongs to
    department INTEGER REFERENCES department(id) ON DELETE SET NULL
)

CREATE TABLE employee(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    -- holds reference to employee role
    role_id INTEGER REFERENCES role(id) ON DELETE SET NULL,
    -- holds reference to another employee that is the manager of the current employee (and sets NULL if there is no manager of that employee [ie, if they ARE the dept manager])
    manager_id INTEGER REFERENCES employee(id) ON DELETE SET NULL

    -- FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    -- FOREIGN KEY  (manager_id) REFERENCES employee(id) ON DELETE SET NULL
    
)