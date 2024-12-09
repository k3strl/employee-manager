\c company_db;

INSERT INTO department (department_name)
VALUES  ('Sales'),
        ('Finance'),
        ('Engineering');

INSERT INTO role (id, title, salary, department_id)
VALUES  (1, 'Sales Lead', 10000, 1),
        (2, 'Salesperson', 80000, 1),
        (3, 'Lead Engineer', 150000, 3),
        (4, 'Software Engineer', 120000, 3),
        (6, 'Accountant', 12500, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Rafferty', 'King', 1, NULL),
        ('Natasha ', 'Rosario', 2, NULL),
        ('Blaine', 'Hartley', 6, NULL);

SELECT * FROM department;