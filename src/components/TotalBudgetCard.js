import { useBudgets } from "../contexts/BudgetsContext";
import BudgetCard from "./BudgetCard"

export default function TotalBudgetCard() {

    const { getTotalExpensesForCurrentMonth, getTotalBudgetForCurrentMonth } = useBudgets()

    
    if (getTotalBudgetForCurrentMonth() === 0) return null

    return <BudgetCard amount={getTotalExpensesForCurrentMonth()} name="Total" gray max={getTotalBudgetForCurrentMonth()} hideButtons />
}
