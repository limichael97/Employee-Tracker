const db = require('./db');
const {prompt} = require('inquirer');
require("console.table")

// list of prompts when user first starts server
function mainQuestions() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View all employees",
          value: "viewEmployees"
        },

        {
          name: "View all departments",
          value: "viewDepartment"
        },

        {
          name: "View all roles",
          value: "viewRoles"
        },

        {
          name: "Add a department",
          value: "addDepartment"
        },

        {
          name: "Add a role",
          value: "addRole"
        },

        {
          name: "Add an employee",
          value: "addEmployee"
        },
        
        {
          name: "Update an employee role",
          value: "updateEmployeeRole"
        },

        {
          name: "Exit",
          value: "exitApp"
        },
      ]
    },
    
  ]).then(res => {
    let choice = res.choice 
    console.log(choice)
    if (choice == "viewEmployees") {
      viewEmployees()
    }

    if (choice == "viewDepartment") {
      viewDepartment()
    }

    if (choice == "viewRoles") {
      viewRoles()
    }

    if (choice == "addDepartment") {
      addDepartment()
    }

    if (choice == "addRole") {
      addRole()
    }

    if (choice == "addEmployee") {
      addEmployee()
    }

    if (choice == "updateEmployeeRole") {
      updateEmployeeRole()
    }

    if (choice == "exitApp") {
      exitApp()
    }
  })
}

// functions that get called when user picks that option
function viewEmployees() {
  db.viewAllEmployees().then(([rows]) =>{
    let employees = rows 
    console.table(employees)
  }).then(() =>{mainQuestions()})
}

function viewDepartment() {
  db.findAllDepartments().then(([rows]) =>{
    let departments = rows 
    console.table(departments)
  }).then(() =>{mainQuestions()})
}

function viewRoles() {
  db.findAllRoles().then(([rows]) =>{
    let roles = rows 
    console.table(roles)
  }).then(() =>{mainQuestions()})
}


function addDepartment() {
  prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the department?"
    }
  ]).then(res=>{
    let name = res
    db.createDepartment(name).then(()=>mainQuestions())
  })
}

function addRole() {
  db.findAllDepartments().then(([rows])=>{
    let departments = rows
    const departmentChoices = departments.map(({id, name})=>({
      name: name,
      value: id
    }))
    prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the role?"
      },
  
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?"
      },
  
      {
        type: "list",
        name: "department_id",
        message: "What department does the role belong to?",
        choices: departmentChoices
      }
    ]).then(res=>{
      db.createRole(res).then(()=>mainQuestions())
    })
  })
  
}

function addEmployee() {
  prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ])
    .then(res => {
      let first = res.first_name;
      let last = res.last_name;

      db.findAllRoles()
        .then(([rows]) => {
          let roles = rows;
          const roleList = roles.map(({ id, title }) => ({
            name: title,
            value: id
          }));

          prompt({
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleList
          })
            .then(res => {
              let roleId = res.roleId;

              db.viewAllEmployees()
                .then(([rows]) => {
                  let employees = rows;
                  const managers = employees.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                  }));

                  managers.unshift({ name: "None", value: null });

                  prompt({
                    type: "list",
                    name: "managerId",
                    message: "Who is the employee's manager?",
                    choices: managers
                  })
                    .then(res => {
                      let employee = {
                        manager_id: res.managerId,
                        role_id: roleId,
                        first_name: first,
                        last_name: last
                      }

                      db.createEmployee(employee);
                    })
                    .then(() => mainQuestions())
                })
            })
        })
    })
}

function updateEmployeeRole() {
  db.viewAllEmployees()
  .then(([rows]) => {
    let employees = rows;
    const employeeList = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));

    employeeList.unshift({ name: "None", value: null });
    prompt(
      {
        type: "rawlist",
        name: "id",
        message: "Which employee do you want to update role for?",
        choices: employeeList
      },
    ).then(res=>{
      let name = res.id
      db.findAllRoles()
      .then(([rows]) => {
        let roles = rows;
        const roleList = roles.map(({ id, title }) => ({
          name: title,
          value: id
        }));
        prompt(
          {
            type: "rawlist",
            name: "role_id",
            message: "What is the employee's new role?",
            choices: roleList
          }
        )
          .then(res => {
            let role = res.role_id
            db.updateEmployeeRole(name, role)
          })
          .then(()=>mainQuestions())
      })

    })
  })
}

function exitApp() {
  process.exit();
}

mainQuestions()