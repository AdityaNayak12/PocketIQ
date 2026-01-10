const budgetInput = document.querySelector(".monthly-budget");
const budgetSection = document.querySelector(".budget-section");
const setBudgetBtn = document.querySelector(".set-budget");
const updateBudgetBtn = document.querySelector(".update-budget");
const budgetDisplay = document.querySelector(".budget-display");
const remainingDisplay = document.querySelector(".remaining-display");
const budgetAdvice = document.querySelector(".advice-text");
const circularProgress = document.querySelector(".circular-progress");
const progressText = document.querySelector(".progress-text");
const addExpenseBtn = document.querySelector(".add-expense");
const expenseList = document.querySelector(".expenses");

let monthlyBudget = 0;
let isbudgetLocked = false;
let totalSpent = 0;
let expenseCount = 0;
let remainingBudget = 0;
const expenseObject = {};



function setMonthlyBudget() {
    setBudgetBtn.addEventListener("click", function () {
        const value = Number(budgetInput.value);
        if (value <= 0) {
            alert("Please enter a valid budget")
            return;
        }
        monthlyBudget = value;
        isbudgetLocked = true;
        budgetDisplay.textContent = `Monthly Budget: ₹${monthlyBudget}`;
        budgetAdvice.style.display = "none";
        disableSetBudgetBtn();
        updateBudgetBtn.disabled = false;
        updateProgressBar();
    })
}

function disableSetBudgetBtn() {
    setBudgetBtn.disabled = true;
    budgetInput.disabled = true;
    setBudgetBtn.style.cursor = "not-allowed";
    setBudgetBtn.textContent = "Budget Set";
}

function enableBudgetUpdate() {
    updateBudgetBtn.addEventListener("click", function () {
        isbudgetLocked = false;

        budgetInput.disabled = false;
        setBudgetBtn.disabled = false;

        setBudgetBtn.textContent = "Confirm Update";
        updateBudgetBtn.disabled = true;
    });
}

function addExpenseToList() {
    addExpenseBtn.addEventListener("click", function () {
        if (monthlyBudget == 0) {
            alert("Please set a monthly budget first");
            return;
        }
        const expense = document.querySelector(".expense-amount").value;
        const category = document.querySelector(".expense-category").value.trim().toLowerCase();

        if (expense === "" || category === "") {
            alert("Please enter expense and category");
            return;
        }
        expenseCount++;

        totalSpent += Number(expense);
        updateRemainingBudget();

        if (expenseObject[category]) {
            expenseObject[category] += Number(expense);
        } else {
            expenseObject[category] = Number(expense);
        }

        let existingItem = expenseList.querySelector(
            `li[data-category="${category}"]`
        );

        if (existingItem) {
            existingItem.textContent =
                `${category}: ₹${expenseObject[category]}`;
        } else {
            const li = document.createElement("li");
            li.setAttribute("data-category", category);
            li.textContent = `${category}: ₹${expenseObject[category]}`;
            expenseList.appendChild(li);
        }

        updateDailyAdivice();
        updateWarnings();
        updateProgressBar();
    });
}

function updateProgressBar() {
    if (monthlyBudget <= 0) return;

    let percentUsed = (totalSpent / monthlyBudget) * 100;
    percentUsed = Math.min(percentUsed, 100);

    const degrees = (percentUsed / 100) * 360;

    let color;
    if (percentUsed < 60) {
        color = "green";
    } else if (percentUsed < 85) {
        color = "orange";
    } else {
        color = "red";
    }

    if (percentUsed < 60) color = "#00e676";
    else if (percentUsed < 85) color = "#ff9100";
    else color = "#ff1744";

    circularProgress.style.background = `conic-gradient(${color} ${degrees}deg, #2c2c2c 0deg)`;

    progressText.textContent = `${percentUsed.toFixed(0)}%`;
}


function updateRemainingBudget() {
    remainingBudget = monthlyBudget - totalSpent;
    const remainingPercentage = Math.max(0,(remainingBudget / monthlyBudget) * 100);
    remainingDisplay.textContent = `Remaining Budget: ₹${remainingBudget}. You have used ${(100 - remainingPercentage).toFixed(2)}% of monthly budget `;

}

function calucatingMostSpent() {
    let maxCategory = null;
    let maxAmount = 0;

    for (let category in expenseObject) {
        if (expenseObject[category] > maxAmount) {
            maxAmount = expenseObject[category];
            maxCategory = category;
        }
    }
    return {
        category: maxCategory,
        amount: maxAmount
    }
}

function updateDailyAdivice() {

    if (monthlyBudget <= 0) {
        budgetAdvice.textContent = "Set a budget to get started.";
        budgetAdvice.style.display = "block";
        return;
    }

    const daysInMonth = daysInCurrentMonth();
    const today = new Date().getDate();
    const remainingDays = daysInMonth - today;

    if (remainingDays <= 0) {
        budgetAdvice.textContent = "Month is ending. Review your spending.";
        return;
    }

    const idealDailyBudget = monthlyBudget / daysInMonth;
    const perDayAllowed = remainingBudget / remainingDays;
    const ratio = perDayAllowed / idealDailyBudget;

    if (ratio >= 1.1) {
        showGreen(perDayAllowed);
    } else if (ratio >= 0.7) {
        showYellow(perDayAllowed);
    } else {
        showRed(perDayAllowed);
    }
}

function updateWarnings() {
    const warningsBox = document.querySelector(".warnings");
    warningsBox.innerHTML = "<h3>Insights</h3>";

    if (expenseCount < 3) {
        const p = document.createElement("p");
        p.textContent = "Add a few more expenses to see spending insights.";
        warningsBox.appendChild(p);
        return;
    }
    const result = calucatingMostSpent();

    if (!result || result.amount === 0) {
        const p = document.createElement("p");
        p.textContent = "No spending insights yet.";
        warningsBox.appendChild(p);
        return;
    }

    const highest = document.createElement("p");
    highest.textContent =
        `Highest spending category: ${result.category} (₹${result.amount})`;
    warningsBox.appendChild(highest);

    const percentage = (result.amount / totalSpent) * 100;

    if (percentage > 40) {
        const warning = document.createElement("p");
        warning.style.color = "red";
        warning.textContent =
            `You're spending a lot on ${result.category}. Consider reducing expenses here.`;
        warningsBox.appendChild(warning);
    }
}



function showGreen(perDayAllowed) {
    budgetAdvice.style.display = "block";
    budgetAdvice.textContent =
        `You're on track! You can safely spend around ₹${perDayAllowed.toFixed(0)} today.`;

    document.querySelector(".daily-advice").style.borderLeftColor = "green";
}


function showYellow(perDayAllowed) {
    budgetAdvice.style.display = "block";
    budgetAdvice.textContent =
        `You're doing okay, but spend cautiously today. Try to stay under ₹${perDayAllowed.toFixed(0)}.`;

    document.querySelector(".daily-advice").style.borderLeftColor = "orange";
}


function showRed(perDayAllowed) {
    budgetAdvice.style.display = "block";
    budgetAdvice.textContent =
        `Warning! Your budget is tight. Avoid extra spending today. Limit: ₹${perDayAllowed.toFixed(0)}.`;

    document.querySelector(".daily-advice").style.borderLeftColor = "red";
}

function daysInCurrentMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

setMonthlyBudget();
enableBudgetUpdate();
addExpenseToList();
updateDailyAdivice();
updateWarnings();
updateProgressBar();
