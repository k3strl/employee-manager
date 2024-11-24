INSERT INTO department (dept_name)
VALUES  ('Sales'),
        ('Finance'),
        ('Engineering');

INSERT INTO role (id, title, department, salary)
VALUES  (1, 'Sales Lead', 1, 10000),
        (2, 'Salesperson', 1, 80000),
        (6, 'Accountant', 2, 12500),
        (3, 'Lead Engineer', 3, 150000),
        (4, 'Software Engineer', 3, 120000),


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Rafferty', 'King', 1, 1),
        ('Natasha ', 'Rosario', 2, 2),
        ('Blaine', 'Hartley', 6, 1),


SELECT * FROM department;