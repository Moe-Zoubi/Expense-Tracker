import React, {useContext} from "react"
import { useGetTransactions } from "../hooks/useGetTransactions"
import { useGetBudgets } from "../hooks/useGetBudget"
import { toDate} from "date-fns"

const BudgetsContext = React.createContext()
export const UNCATEGORIZED_BUDGET_ID = "Uncategorized"

export function useBudgets(){
    return useContext(BudgetsContext)
}

export const BudgetsProvider = ({children}) =>{
    const {transactions} = useGetTransactions();
    const {budgets} = useGetBudgets();
    
    function getBudgetExpenses(budgetID){
        return transactions.filter(expense => expense.budgetID === budgetID)
    }

    function getBudgetExpensesForCurrentMonth(budgetID){
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        return transactions.filter((expense) => {
            const date = new toDate(expense.createdAt?.toDate());
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear && expense.budgetID === budgetID;
        })
    }

    function getTotalExpensesForCurrentMonth(){
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const filteredTransactions = transactions.filter((expense) => {
            const date = new toDate(expense.createdAt?.toDate());
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).map((expense) => expense.amount)

        return filteredTransactions.reduce((total, transaction) => {
            return total + transaction;
          }, 0);
    }

    function getTotalBudgetForCurrentMonth(){
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const filteredBudgets = budgets.filter((budget) => {
            const date = new toDate(budget.createdAt?.toDate());
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).map((budget) => budget.max)

        return filteredBudgets.reduce((total, budget) => {
            return total + budget;
          }, 0);
    }

    return(
        <BudgetsContext.Provider value={{
            getBudgetExpenses,
            getBudgetExpensesForCurrentMonth,
            getTotalExpensesForCurrentMonth,
            getTotalBudgetForCurrentMonth,
        }}>{children}</BudgetsContext.Provider>
    )
}