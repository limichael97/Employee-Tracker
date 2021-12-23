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


}

function updateEmployeeRole() {
  db.viewAllEmployees().then(([rows])=>{
    let employees = rows
    let employeesChoices = employees.map(({id,first_name,last_name})=>({
      first_name: first_name,
      last_name: last_name,
      value:id
    }))
    prompt([
      {
        type: "list",
        name: "title",
        message: "Which employee's role do you want to update?",
        choices: employeesChoices
      }
    ]).then(res=>{
      let name = res
      db.createDepartment(name).then(()=>mainQuestions())
    })
  })

}

mainQuestions()