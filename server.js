const db = require('./db');
const {prompt} = require('inquirer');
require("console.table")


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
  db.viewAllEmployees().then(([rows])=>{
    let employeeNew = rows
    const employeeList = employeeNew.map(({id,first_name,last_name,role_id, manager_id})=>({
      first_name: first_name,
      last_name: last_name,
      role_id:role_id,
      value:id,
      manager_id: manager_id
    }))
    prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?"
      },

      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
      },
  
      {
        type: "list",
        name: "role_id",
        message: "What is the employee's role?",
        choices:employeeList
      },
  
      {
        type: "list",
        name: "manager_id",
        message: "Who is the employee's manager?",
        choices: employeeList
      }
    ]).then(res=>{
      db.createEmployee(res).then(()=>mainQuestions())
    })
  })

}

function updateEmployeeRole() {
  db.viewAllEmployees().then(([rows])=>{
    let employees = rows
    let employeesChoices = employees.map(({id,first_name,last_name, role_id, manager_id})=>({
      first_name: first_name,
      last_name: last_name,
      role_id:role_id,
      value:id,
      manager_id: manager_id
    }))
    prompt([
      {
        type: "rawlist",
        name: "id",
        message: "Which employee's role do you want to update?",
        choices: employeesChoices
      },

      {
        type: "rawlist",
        name: "role_id",
        message: "What is the employee's new role?",
        choices: employeesChoices
      }
    ]).then(res=>{
      let name = res.id
      let role = res.role_id
      db.updateEmployeeRole(name, role).then(()=>mainQuestions())
    })
  })

}

function exitApp() {
  process.exit();
}

mainQuestions()