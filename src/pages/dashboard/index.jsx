import "./style.css";
import { currencyFormatter } from '../../Utils';
import { useGetIncome } from "../../hooks/useGetIncome";
import { useGetBudgets } from "../../hooks/useGetBudget";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useEffect, useState } from "react";
import DonutChart from "../../components/DashboardDonutChart";
import LineChart from "../../components/LineChart";



const Dashboard = () =>{
    const {budgets, budgetsTotal} = useGetBudgets();
    const {income, incomeTotal} = useGetIncome();
    const {transactions, transactionsTotal} = useGetTransactions();

    const [currentBalance, setCurrentBalance] = useState()
    const [transactionAdded, setTransactionAdded] = useState(false)

    

    useEffect(() => {
        if (transactionAdded) {
          setCurrentBalance((prevBalance) => prevBalance - transactionsTotal + incomeTotal);
          setTransactionAdded(false);
        }
      }, [transactionAdded, transactionsTotal, incomeTotal]);
    
    useEffect(() => {
        if (incomeTotal !== undefined && transactionsTotal !== undefined) {
          const totalBalance = incomeTotal - transactionsTotal;
          setCurrentBalance(totalBalance);
        }
      }, [incomeTotal, transactionsTotal]);
    
      
    return( 
        <div className="dashboard bg">
            <p className="page-title">Dashboard</p>
            <div className="totals-container">
                <div className="total white-card">
                    <p className="amount total-income">{currencyFormatter.format(incomeTotal)}</p>
                    <p className="title">Income</p>
                </div>
                <div className="total white-card">
                    <p className="amount total-expenses">{currencyFormatter.format(transactionsTotal)}</p>
                    <p className="title">Expenses</p>
                </div>
                <div className="total white-card">
                    <p className="amount total-balance">{currencyFormatter.format(currentBalance)}</p>
                    <p className="title">Balance</p>
                </div>
                <div className="total white-card">
                    <p className="amount total-budgets">{currencyFormatter.format(budgetsTotal)}</p>
                    <p className="title">Budgets</p>
                </div>
            </div>
            <DonutChart />
            <LineChart />
        </div>
    );
};

export default Dashboard