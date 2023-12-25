import { useState } from "react";
import { useGetTransactions } from "../hooks/useGetTransactions";
import { useGetBudgets } from "../hooks/useGetBudget";
import { Line } from "react-chartjs-2";
import { toDate} from "date-fns";
import { currencyFormatter } from '../Utils';

const BudgetsLineChart = () => {
    const { transactions, transactionsTotal } = useGetTransactions();
    const {budgets, budgetsTotal} = useGetBudgets();
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
  
    
    const [chosenMonth, setChosenMonth] = useState(currentMonth);
    
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      function getTotalBudgetsForMonth(budgets, year, monthIndex) {
        const filteredTransactions = budgets
          .filter((budget) => {
            const date = new Date(budget.createdAt?.toDate());
            return date.getFullYear() === year && date.getMonth() === monthIndex;
          })
          .map((budget) => budget.max);
    
        const totalAmount = filteredTransactions.reduce((total, budget) => {
          return total + budget;
        }, 0);
    
        return totalAmount;
      }

      function getTotalExpensesForMonth(transactions, year, monthIndex) {
        const filteredTransactions = transactions
          .filter((transaction) => {
            const date = new Date(transaction.createdAt?.toDate());
            return date.getFullYear() === year && date.getMonth() === monthIndex;
          })
          .map((transaction) => transaction.amount);
    
        const totalAmount = filteredTransactions.reduce((total, transaction) => {
          return total + transaction;
        }, 0);
    
        return totalAmount;
      }

      function findLargestTransaction(transactions, year, month) {
        const filteredTransactions = transactions.filter(transaction => {
          const transactionDate = new Date(transaction.createdAt?.toDate());
          return (
            transactionDate.getFullYear() === year &&
            transactionDate.getMonth() === month
          );
        });
        const largestTransaction = filteredTransactions.reduce((maxTransaction, transaction) => {
          return transaction.amount > maxTransaction.amount ? transaction : maxTransaction;
        }, transactions[0]);
      
        return largestTransaction;
      }
      

      function findSmallestTransaction(transactions, year, month) {
        const filteredTransactions = transactions.filter(transaction => {
          const transactionDate = new Date(transaction.createdAt?.toDate());
          return (
            transactionDate.getFullYear() === year &&
            transactionDate.getMonth() === month
          );
        });
        const largestTransaction = filteredTransactions.reduce((maxTransaction, transaction) => {
          return transaction.amount < maxTransaction.amount ? transaction : maxTransaction;
        }, transactions[0]);
      
        return largestTransaction;
      }

      function getBudgetName(budgets, budgetID, year, month){
        return budgets.filter((budget) =>{
          const createdAtDate = budget.createdAt?.toDate();
          if (createdAtDate) {
            const date = new Date(createdAtDate);
            return date.getFullYear() === year && date.getMonth() === month && budget.budgetID === budgetID;
          }
        }).map(budget => budget.name)
      }
      
      function getBudgetAmount(budgetName, year, month){
        return budgets.filter((budget) => {
          const createdAtDate = budget.createdAt?.toDate(); // Check if createdAt exists
          if (createdAtDate) {
            const date = new Date(createdAtDate);
            return date.getFullYear() === year && date.getMonth() === month && budget.name === budgetName;
          }
          return console.log("err");
        }).map((budget) => budget.max);
      }
    
      function getTotalExpenseForBudget(budgetName, year, month) {
        const budget = budgets.find((budget) => {
          const createdAtDate = budget.createdAt?.toDate(); // Check if createdAt exists
          if (createdAtDate) {
            const date = new Date(createdAtDate);
            return date.getFullYear() === year && date.getMonth() === month && budget.name === budgetName;
          }
          return console.log("err");
        });
      
        const id = budget.budgetID;
      
        const filteredTransactions = transactions.filter((transaction) => {
          const date = transaction.createdAt?.toDate(); // Check if createdAt exists
          if (date) {
            const transactionDate = new Date(date);
            return transactionDate.getFullYear() === year && transactionDate.getMonth() === month && transaction.budgetID === id;
          }
        }).map((transaction) => transaction.amount);
      
        const totalAmount = filteredTransactions.reduce((total, transaction) => {
          return total + transaction;
        }, 0);
      
        return totalAmount;
      }
    
    const getBudgetLabelForMonth = () =>{
      return budgets.filter((budget) => {
        const date = new Date(budget.createdAt?.toDate());
        return date.getFullYear() === currentYear && date.getMonth() === chosenMonth; 
      }).map((budget) => budget.name)
    }
  
   
    const expensesData = getBudgetLabelForMonth().map((budgetName) => {
      return getTotalExpenseForBudget(budgetName, currentYear, chosenMonth);
    });
    
    const budgetsData =  getBudgetLabelForMonth().reduce((acc, budgetName) => {
      const budgetAmount = getBudgetAmount(budgetName, currentYear, chosenMonth);
      return [...acc, ...budgetAmount];
    }, []);
    
    const maxExpense = findLargestTransaction(transactions, currentYear, chosenMonth);
    const minExpense = findSmallestTransaction(transactions, currentYear, chosenMonth);
    

    const lineChartData = {
      labels: getBudgetLabelForMonth(),
      datasets: [
        {
          label: 'Expenses',
          data: expensesData,
          borderColor: '#FF5722',
          backgroundColor: 'rgba(255, 87, 34, 0.2)',
        },
        {
            label: 'Budgets',
            data: budgetsData,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
        },
      ],
    };
  
    // Line chart options
    const lineChartOptions = {
      scales: {
        x: {
          type: 'category',
          position: 'bottom',
        },
        y: {
          beginAtZero: true,
        },
      },
    };
  
    return (
        <div className='chart-card'>
            <div className="chart-options">
              <p className="heading-title">Budgets & Expenses</p>
              <div className='range-picker '>
                <select defaultValue={currentMonth} onChange={(e) => setChosenMonth(parseInt(e.target.value))} className='year-select'>
                  {monthNames.map((month,index) =>{
                    return(<option key={index} value={index} >{month}</option>)
                  })}
                </select>
              </div>
            </div>
            <div className="chart-stats">
                <div className='budget-line-chart stat-item  white-card'> 
                    <Line data={lineChartData} options={lineChartOptions} />
                </div>
                {maxExpense && minExpense && (
                  <div className="stat-item">
                    <div>
                      <p className="heading-title">Largest Expense</p>
                      <div className="expense-stats">
                        <p>Budget Name</p>
                        <p>description</p>
                        <p>Amount</p>
                      </div>
                      <div className="expense-stats white-card">
                        <p>{maxExpense.budgetID === "Uncategorized" ? "Uncategorized" : getBudgetName(budgets, maxExpense.budgetID, currentYear, chosenMonth)}</p>
                        <p>{maxExpense.description}</p>
                        <p>{currencyFormatter.format(maxExpense.amount)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="heading-title">Smallest Expense</p>
                      <div className="expense-stats">
                        <p>Budget Name</p>
                        <p>description</p>
                        <p>Amount</p>
                      </div>
                      <div className="expense-stats white-card">
                        <p>{minExpense.budgetID === "Uncategorized" ? "Uncategorized" : getBudgetName(budgets, minExpense.budgetID, currentYear, chosenMonth)}</p>
                        <p>{minExpense.description}</p>
                        <p>{currencyFormatter.format(minExpense.amount)}</p>
                      </div>
                    </div>
                    <div className="monthly-container">
                      <div className="monthly-total">
                        <p className="monthly-title">Total Budgets</p>
                        <p className="amount total-budgets white-card large">{currencyFormatter.format(getTotalBudgetsForMonth(budgets, currentYear, chosenMonth))}</p>
                      </div>
                      <div className="monthly-total">
                        <p className="monthly-title">Total Expenses</p>
                        <p className="amount total-expenses white-card large">{currencyFormatter.format(getTotalExpensesForMonth(transactions, currentYear, chosenMonth))}</p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
        </div>
    );
  };
  
  export default BudgetsLineChart;
  