INSERT INTO department (dept_name)
VALUES  ("Legal"),
        ("Sales"),
        ("Finance"),
        ("Engineering");

INSERT INTO role (id, title, department, salary)
VALUES  (1, "Sales Lead", 2, 10000),
        (2, "Salesperson", 2, 80000),
        (3, "Lead Engineer", 4, 150000),
        (4, "Software Engineer", 4 120000),
        (5, "Account Manager", 3, 160000),
        (6, "Accountant", 3, 12500),
        (7, "Legal Team Lead", 1, 250000),
        (8, "Lawyer", 1, 190000);

INSERT INTO employee (first_name, last_name, role_id, manager_id);
VALUES  ("Rafferty", "King", 1, 1),
        ("Natasha ", "Rosario", 2, 2),
        ("Jazmine", "Pace", 2, 3),
        ("Luther", "Stein", 3, 4),
        ("Ruben", "Rojas", 4, 3),
        ("Millicent", "Hogan", 4, 2),
        ("Aleksander", "Valencia", 5, 4),
        ("Blaine", "Hartley", 6, 1),
        ("Anas", "Wise", 7, 2),
        ("Laurie", "Heath", 8, NULL)

SELECT * FROM department