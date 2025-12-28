const budgetInput = document.querySelector(".monthly-budget");
const budgetSection = document.querySelector(".budget-section");
const setBudgetBtn = document.querySelector(".set-budget");
const budgetDisplay = document.querySelector(".budget-display");
const remainingDisplay = document.querySelector(".remaining-display");
const budgetAdvice = document.querySelector(".advice-text");

const addExpenseBtn = document.querySelector(".add-expense");
const expenseList = document.querySelector(".expenses");

let monthlyBudget = 0;
let totalSpent = 0;
let remainingBudget = 0;
const expenseObject = {};



function setMonthlyBudget(){
    setBudgetBtn.addEventListener("click", function(){
        const value = Number(budgetInput.value);
        monthlyBudget = value;
        budgetDisplay.textContent = `Monthly Budget: ₹${monthlyBudget}`;
        budgetAdvice.style.display = "none";
        
    } )
}

function addExpenseToList() {
    addExpenseBtn.addEventListener("click", function () {
        const expense = document.querySelector(".expense-amount").value;
        const category = document.querySelector(".expense-category").value;

        totalSpent+=Number(expense);
        updateRemainingBudget();
        if (expense === "" || category === "") {
            alert("Please enter expense and category");
            return;
        }

        if(expenseObject[category]){
            expenseObject[category]+=Number(expense);
        }else{
            expenseObject[category] = Number(expense);
        }
        console.log(expenseObject);

        const li = document.createElement("li");
        li.textContent = `₹${expense} - ${category}`;

        expenseList.appendChild(li);
    });
}

function updateRemainingBudget(){
    remainingBudget = monthlyBudget-totalSpent;
    remainingDisplay.textContent = `Remaining Budget: ₹${remainingBudget}`;
}

function calucatingMostSpent(){
    
}

setMonthlyBudget();
addExpenseToList();

