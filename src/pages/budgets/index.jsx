import { useEffect, useState } from "react";
import "./style.css"
import { useBudgets, UNCATEGORIZED_BUDGET_ID } from "../../contexts/BudgetsContext";
import { Button, Container, Stack } from "react-bootstrap";
import BudgetCard from "../../components/BudgetCard";
import TotalBudgetCard from "../../components/TotalBudgetCard";
import UncategorizedBudgetCard from "../../components/UncategorizedBudgetCard";
import AddBudgetModal from "../../components/AddBudgetModal";
import AddExpenseModal from "../../components/AddExpenseModal";
import ViewExpensesModal from "../../components/ViewExpensesModal";
import { useGetBudgets } from "../../hooks/useGetBudget";
import MonthlyExpenseChart from "../../components/MonthlyExpenseChart";
import MonthlyBudgetsChart from "../../components/MonthlyBudgetsChart";
import BudgetsLineChart from "../../components/BudgetsLineChart";




const Budgets = () =>{

    const {getBudgetExpensesForCurrentMonth} = useBudgets();
    const {budgets, budgetsTotal} = useGetBudgets();

    const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)

    const [transactionAdded, setTransactionAdded] = useState(false)

    const [viewExpensesModalBudgetID, setViewExpensesModalBudgetID] = useState()
    const [addExpenseModalBudgetID, setAddExpenseModalBudgetID] = useState()

    const [range, setRange] = useState(1)

    const [displayDonutChart, setDisplayDonutChart] = useState("Budgets")


    const handleTransactionAdded = () => {
        setTransactionAdded(true);
      };

    function openAddExpenseModal(budgetID){
        setShowAddExpenseModal(true)
        setAddExpenseModalBudgetID(budgetID)
    }
    
    const handleToggle = () => {
        const newDisplay = displayDonutChart === "Budgets" ? "Expenses" : "Budgets";
        setDisplayDonutChart(newDisplay);
      };
    

    return(
        <div className="budget bg">
            <p className="page-title">Budgets</p>
            <Container className="my-4">
                <Stack direction="horizontal" gap="2" className="mb-4">
                    <h1 className="me-auto" id="budgets">Budgets</h1>
                    <Button 
                        variant="primary"
                        onClick={()=> setShowAddBudgetModal(true)}
                    >
                        Add Budget
                    </Button>
                    <Button 
                        variant="outline-primary"
                        onClick={openAddExpenseModal}>
                        Add Expense
                    </Button>
                </Stack>
                <div className="budget-container" style={{height:"auto"}}>
                    {budgets.filter((budget) => {
                        const currentMonth = new Date().getMonth();
                        const createdAtDate = budget.createdAt?.toDate(); // Check if createdAt exists
                        if (createdAtDate) {
                        const date = new Date(createdAtDate);
                        return date.getMonth() === currentMonth;
                        }
                        return false;
                    })
                    .map((budget) => {
                        const amount = getBudgetExpensesForCurrentMonth(budget.budgetID).reduce(
                        (total, expense) => total + expense.amount,
                        0
                        );
                        return (
                        <BudgetCard
                            key={budget.budgetID}
                            name={budget.name}
                            amount={amount}
                            max={budget.max}
                            onAddExpenseClick={() => openAddExpenseModal(budget.budgetID)}
                            onViewExpensesClick={() => setViewExpensesModalBudgetID(budget.budgetID)}
                        />
                        );
                    })}

                    <UncategorizedBudgetCard 
                        onAddExpenseClick={openAddExpenseModal}
                        onViewExpensesClick={() => setViewExpensesModalBudgetID(UNCATEGORIZED_BUDGET_ID)}
                    />
                    <TotalBudgetCard />
                </div>
            </Container>
            <AddBudgetModal 
                show={showAddBudgetModal}
                handleClose={() => setShowAddBudgetModal(false)}
            />
            <AddExpenseModal 
                show={showAddExpenseModal}
                defaultBudgetID={addExpenseModalBudgetID}
                handleClose={() => setShowAddExpenseModal(false)}
                onExpenseAdded={handleTransactionAdded}
            />
            <ViewExpensesModal 
                budgetID={viewExpensesModalBudgetID}
                handleClose={() => setViewExpensesModalBudgetID()}
                onExpenseDeleted={handleTransactionAdded}
            />
            <div className="chart-card">
                <div className="chart-options">
                    <p className='heading-title'>{displayDonutChart} By Categories</p>
                    <div className='range-picker '>
                        <select onChange={(e) => setRange(parseInt(e.target.value))} className='year-select'>
                        <option value={1}>Last month</option>
                        <option value={3}>Last 3 month</option>
                        <option value={6}>Last 6 month</option>
                        </select>
                    </div>
                </div>
                {displayDonutChart === "Budgets" 
                ? <div className="white-card">
                    <div className="toggle-options left">
                        <p>Budgets</p>
                        <div className="toggle" onClick={handleToggle}>
                            {
                                displayDonutChart === "Budgets"
                                ? <div className="toggle-left"></div>
                                : <div className="toggle-right"></div>
                            }
                        </div>
                        <p>Expense</p>
                    </div>
                    <MonthlyBudgetsChart range = {range} /> 
                </div>
                : <div className="white-card">
                <div className="toggle-options">
                    <p>Budgets</p>
                    <div className="toggle" onClick={handleToggle}>
                        {
                            displayDonutChart === "Budgets"
                            ? <div className="toggle-left"></div>
                            : <div className="toggle-right"></div>
                        }
                    </div>
                    <p>Expense</p>
                </div>
                <MonthlyExpenseChart range = {range} /> 
            </div>}
            </div>
            
            <BudgetsLineChart />
        </div>
    );
};

export default Budgets