import { useState } from "react";
import { useGetBudgets } from "../../hooks/useGetBudget";
import "./style.css"
import { useAddIncome } from "../../hooks/useAddIncome";
import { useAddTransaction } from "../../hooks/useAddTransactions";



const Transactions = () =>{

    const {addIncome} = useAddIncome()
    const { addOnlineExpense } = useAddTransaction()

    const [incomeForm, setIncomeForm] = useState({
        description: "",
        amount: 0,
    })
    const [expenseForm, setExpenseForm] = useState({
        description: "",
        amount: 0,
        budgetID: "Uncategorized",
        expenseType: "Uncategorized",
    })

    const {budgets} = useGetBudgets()

    function handleExpenseChange(event) {
        const {name, value} = event.target
        setExpenseForm(prevExpenseData => {
            return {
                ...prevExpenseData,
                [name]: value
            }
        })
    }
    function handleIncomeChange(event) {
        const {name, value} = event.target
        setIncomeForm(prevIncomeData => {
            return {
                ...prevIncomeData,
                [name]: value
            }
        })
    }
    const handleExpenseForm = (e) => {
        e.preventDefault();
    
        addOnlineExpense({
            description: expenseForm.description,
            amount: parseFloat(expenseForm.amount),
            budgetID: expenseForm.budgetID,
            expenseType: expenseForm.expenseType,
        })
        
        setExpenseForm({
            description: "",
            amount: 0,
            budgetID: "",
            expenseType: "",
          });
        
      };
    const handleIncomeForm = (e) => {
        e.preventDefault();
        
        addIncome({
            description: incomeForm.description,
            amount: parseFloat(incomeForm.amount),
        })
        
        setIncomeForm({
            description: "",
            amount: 0,
          });
        
      };  

    return(
        <div className="transactions bg">
            <p className="page-title">Add Transactions</p>
            <div className="transaction-container">
                <div className="transaction-form">
                    <p className="heading-title">Income</p>
                    <form onSubmit={handleIncomeForm} className="white-card">
                        <label htmlFor="income-description">Description</label>
                        <input
                            id="income-description"
                            name="description"
                            type="text"
                            placeholder="Enter Description here"
                            required
                            value={incomeForm.description}
                            onChange={handleIncomeChange}
                        />
                        <label htmlFor="income-amount">Amount</label>
                        <input
                            id="income-amount"
                            name="amount"
                            type="number"
                            placeholder="Enter Amount here"
                            min="0"
                            step="0.01"
                            required
                            value={incomeForm.amount}
                            onChange={handleIncomeChange}
                        />
                        <button type="submit">Add Income</button>
                    </form>
                </div>
                <div className="transaction-form">
                    <p className="heading-title">Expense</p>
                    <form onSubmit={handleExpenseForm} className="white-card ">
                        <label htmlFor="description">Description</label>
                        
                        <input
                            id="description"
                            name="description"
                            type="text"
                            placeholder="Enter Description here"
                            required
                            value={expenseForm.description}
                            onChange={handleExpenseChange}
                        />
                        

                        <label htmlFor="amount">Amount</label>
                        
                        <input
                            id="amount"
                            name="amount"
                            type="number"
                            placeholder="Enter Amount here"
                            min="0"
                            step="0.01"
                            required
                            value={expenseForm.amount}
                            onChange={handleExpenseChange}
                        />
                        
                        

                        <label htmlFor="expenseType">Expense Type</label>
                        
                        <select
                            id="expenseType"
                            name="expenseType"
                            required
                            value={expenseForm.expenseType}
                            onChange={handleExpenseChange}
                            >
                            <option value="Uncategorized">Uncategorized</option>
                            <option value="Bills">Bills</option>
                            <option value="Food">Food</option>
                            <option value="Sports">Sports</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Subscription">Subscription</option>
                            <option value="Digital-Content">Digital Content</option>
                        </select>
                        

                        <label htmlFor="budget">Budget</label>
                        
                        <select
                            id="budget"
                            name="budgetID"
                            required
                            value={expenseForm.budgetID}
                            onChange={handleExpenseChange}
                            >
                            <option value="Uncategorized">Uncategorized</option>
                            {budgets.map(budget =>(
                                    <option key={budget.budgetID} value={budget.budgetID}>{budget.name}</option>
                                ))}
                        </select>
                        

                        <button type="submit">Add Expense</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Transactions