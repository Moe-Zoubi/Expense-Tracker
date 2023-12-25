import { useGetUserInfo } from "../../hooks/useUserGetInfo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faArrowRightFromBracket, faWallet } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import { Button, Card, Stack } from "react-bootstrap";
import BudgetCard from "../../components/BudgetCard";
import AddBudgetModal from "../../components/AddBudgetModal";
import { useEffect, useState } from "react";
import { useGetBudgets } from "../../hooks/useGetBudget";
import AddExpenseModal from "../../components/AddExpenseModal";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../../contexts/BudgetsContext";
import UncategorizedBudgetCard from "../../components/UncategorizedBudgetCard";
import TotalBudgetCard from "../../components/TotalBudgetCard";
import ViewExpensesModal from "../../components/ViewExpensesModal";
import { signOut } from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {auth} from "../../config/firebase-config"
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { currencyFormatter } from '../../Utils';
import { useGetIncome } from "../../hooks/useGetIncome";
import { toDate} from "date-fns";
import { format } from "date-fns";







export const HomePage = ()=>{

    const {budgets, budgetsTotal} = useGetBudgets();
    const {income, incomeTotal} = useGetIncome();
    const {transactions, transactionsTotal} = useGetTransactions();
    const {getBudgetExpenses} = useBudgets();

    
    
    
    const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
    const [showAddIncomeModal, setShowAddIncomeModal] = useState(false)
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)

    const [currentBalance, setCurrentBalance] = useState()
    const [recentHistory, setRecentHistory] = useState([])
    const [history, setHistory] = useState([])
    const [showHistory, setShowHistory] = useState("all")
    const [transactionAdded, setTransactionAdded] = useState(false)
    
    const [viewExpensesModalBudgetID, setViewExpensesModalBudgetID] = useState()
    const [addExpenseModalBudgetID, setAddExpenseModalBudgetID] = useState()

    const { name, profilePhoto} = useGetUserInfo();
    const navigate = useNavigate();
    
    

    
    
    
    const handleTransactionAdded = () => {
        setTransactionAdded(true);
      };
    
     
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
    
      useEffect(() => {
        const incomeHistory = income.map(i => ({
          id: i.incomeID,
          transactionType: "income",
          description: i.description,
          amount: i.amount,
          createdAt: i.createdAt,
        }));
        const expenseHistory = transactions.map(transaction => ({
            id: transaction.expenseID,
            transactionType: "expense",
            description: transaction.description,
            amount: transaction.amount,
            createdAt: transaction.createdAt,
          }));
        const transactionHistory = [...incomeHistory, ...expenseHistory];
        transactionHistory.sort((a, b) => {
            const dateA = a.createdAt;
            const dateB = b.createdAt;
        
            if (!dateA || !dateB) {
              return !dateA ? 1 : -1; // Place null values at the end
            }
        
            return b.createdAt.toMillis() - a.createdAt.toMillis();
          });
        setHistory(transactionHistory);
      }, [income, transactions]);

    function openAddExpenseModal(budgetID){
        setShowAddExpenseModal(true)
        setAddExpenseModalBudgetID(budgetID)
    }
    
    function findHighestTransaction(arr) {
        if (arr.length === 0) {
          return 0;
        }
      
        let highest = arr[0].amount;
      
        for (let i = 1; i < arr.length; i++) {
          const amount = arr[i].amount;
          if (amount > highest) {
            highest = amount;
          }
        }
      
        return highest;
      }

      function findLowestTransaction(arr) {
        if (arr.length === 0) {
          return 0;
        }
      
        let lowest = arr[0].amount;
      
        for (let i = 1; i < arr.length; i++) {
          const amount = arr[i].amount;
          if (amount < lowest) {
            lowest = amount;
          }
        }
      
        return lowest;
      }
      
    

      function formatDate(date) {
        const createdAtDate = toDate(date.toDate()); // Convert to JavaScript Date
        const createdDate = format(createdAtDate, "EEE, do MMM");

        return createdDate;
      }
      
      function formatTime(date){
        const createdAtDate = toDate(date.toDate()); // Convert to JavaScript Date
        const time = format(createdAtDate, "HH:mm a");
    
        return time;
       }  
    function recentTransaction(arr, transactionType){
        let history =[]
        for(let i = 0; i <  Math.min(3, arr.length); i++){
            history.push({...arr[i], transactionType: transactionType})
        }
        setRecentHistory(history)
    }
    function displayHistory(type) {
        if(type === "all"){
            return history.map((transaction, index) => (
                <div key={index} className="transaction-item ">
                  <div className="transaction-info">
                    <p className="wrap-date">
                      {transaction.createdAt ? formatDate(transaction.createdAt) : 'N/A'}
                    </p>
                    <div>
                      <p className="id">{transaction.id}</p>
                      <p className="info">{transaction.description}</p>
                      <p>
                        {transaction.createdAt
                          ? `${formatDate(transaction.createdAt)} - ${formatTime(transaction.createdAt)}`
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div>
                    {transaction.transactionType === "income" ? (
                      <p className="income-transaction">
                        {currencyFormatter.format(transaction.amount)}
                      </p>
                    ) : (
                      <p className="expense-transaction">
                        {currencyFormatter.format(transaction.amount)}
                      </p>
                    )}
                  </div>
                </div>
              ));
        }else if(type === "income"){
            return history
            .filter(transaction => transaction.transactionType === "income") 
            .map((transaction, index) => (
                <div key={index} className="transaction-item">
                <div className="transaction-info">
                    <p className="wrap-date">
                    {transaction.createdAt ? formatDate(transaction.createdAt) : 'N/A'}
                    </p>
                    <div>
                    <p className="id">{transaction.id}</p>
                    <p className="info">{transaction.description}</p>
                    <p>
                        {transaction.createdAt
                        ? `${formatDate(transaction.createdAt)} - ${formatTime(transaction.createdAt)}`
                        : 'N/A'}
                    </p>
                    </div>
                </div>
                <div>
                    <p className="income-transaction">
                    {currencyFormatter.format(transaction.amount)}
                    </p>
                </div>
                </div>
            ));
        }else{
            return history
            .filter(transaction => transaction.transactionType === "expense")
            .map((transaction, index) => (
                <div key={index} className="transaction-item">
                <div className="transaction-info">
                    <p className="wrap-date">
                    {transaction.createdAt ? formatDate(transaction.createdAt) : 'N/A'}
                    </p>
                    <div>
                    <p className="id">{transaction.id}</p>
                    <p className="info">{transaction.description}</p>
                    <p>
                        {transaction.createdAt
                        ? `${formatDate(transaction.createdAt)} - ${formatTime(transaction.createdAt)}`
                        : 'N/A'}
                    </p>
                    </div>
                </div>
                <div>
                    <p className="expense-transaction">
                    {currencyFormatter.format(transaction.amount)}
                    </p>
                </div>
                </div>
            ));
        }
        
      }

    const signOutUser = async () => {
        try {
          await signOut(auth);
          localStorage.removeItem("auth"); // Remove the authentication information from local storage.
          navigate("/"); // Redirect the user to the login page or any other desired page.
        } catch (error) {
          console.error("Error signing out:", error);
        }
      };

    return (
    <div className="home-page">
        <div className="profile">
            <div className="header">
                <img className="profile-photo" src={profilePhoto} />
                <p>Wise Wallet <FontAwesomeIcon icon={faWallet} style={{color: "#ffffff",}}/></p>
                <button onClick={signOutUser}><FontAwesomeIcon icon={faArrowRightFromBracket} size="2xl" style={{color: "#ffffff",}}/></button>
            </div>
            <h2>{name}'s Financial Tracker</h2>
        </div>
        <div className="user-info">
            <div className="container">
                <div className="balance">
                    <h2>{currencyFormatter.format(currentBalance)}</h2>
                    <p>Current Balance</p>
                </div>
                <div className="nav-buttons">
                    <a href="#latets-transactions" className="decoration">
                        <Button variant="outline-primary" className="btn-item">
                            latest Transactions
                        </Button>
                    </a>
                    <a href="#budgets" className="decoration">
                        <Button variant="outline-primary" className="btn-item">
                            Budgets
                        </Button>
                    </a>
                    <a href="#history" className="decoration">
                        <Button variant="outline-primary" className="btn-item">
                             Transactions History
                         </Button>
                    </a>
                    <a href="" className="decoration">
                        <Button variant="outline-primary" className="btn-item" onClick={() => navigate("/spending")}>
                             Spending
                         </Button>
                    </a>
                </div>
            </div>
        </div>
        <Container className="my-4">
            <Stack direction="horizontal" gap="2" className="mb-4">
                <h1 className="me-auto" id="latest-transactions">Latest Transactions</h1>
                <Button 
                    variant="primary"
                    onClick={()=> setShowAddIncomeModal(true)}
                >
                    Add Income
                </Button>
                <Button 
                    variant="outline-primary"
                    onClick={openAddExpenseModal}>
                    Add Expense
                </Button>
            </Stack>
            <div className="transaction-container">
                <div className="transaction-total">
                    <Card border="primary" style={{ borderRadius: '15px' }}>
                        <Card.Header className="transaction-title">Total Income</Card.Header>
                        <Card.Body>
                            <Card.Text className="transaction-amount">{currencyFormatter.format(incomeTotal)}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <div className="transaction-total">
                    <Card border="primary" style={{ borderRadius: '15px' }}>
                        <Card.Header className="transaction-title">Total Expenses</Card.Header>
                        <Card.Body>
                            <Card.Text className="transaction-amount">{currencyFormatter.format(transactionsTotal)}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <div className="transaction-stats">
                <div className="summary-item">
                    <h2>Recent History</h2>
                    <div className="history-btns">
                        <button className="income-btn" onClick={() => recentTransaction(income, "income")}>Income</button>
                        <button className="expense-btn" onClick={() => recentTransaction(transactions, "expense")}>Expenses</button>
                    </div>
                    {recentHistory.length === 0 ? (
                        <p>Choose From the Above Options</p>
                        ) : (
                        recentHistory.map((transaction, index) => (
                            <div key={index} className="transaction-item ">
                                <div className="transaction-info">
                                    <p className="wrap-date">{formatDate(transaction.createdAt)}</p>
                                    <div>
                                        <p className="id">{transaction.transactionType === "income" ? transaction.incomeID : transaction.expenseID}</p>
                                        <p className="info">{transaction.description}</p>
                                        <p>{`${formatDate(transaction.createdAt)} - ${formatTime(transaction.createdAt)}`}</p>
                                    </div>
                                </div>
                                <div>
                                    {transaction.transactionType === "income" 
                                    ? <p  className="income-transaction">{currencyFormatter.format(transaction.amount)}</p> 
                                    : <p  className="expense-transaction">{currencyFormatter.format(transaction.amount)}</p>  }
                                </div>                          
                            </div>
                        ))
                        )}
                </div>
                <div className="summary-item">
                    <h2>Transaction Stats</h2>
                    <div className="stat mb">
                        <div className="transaction-header">
                            <p>Min</p>
                            <h4>Income</h4>
                            <p>Max</p>
                        </div>
                        <div className="display-min-max">
                            <p>{currencyFormatter.format(findLowestTransaction(income))}</p>
                            <p>{currencyFormatter.format(findHighestTransaction(income))}</p>
                        </div>
                    </div>
                    <div className="stat">
                        <div className="transaction-header">
                            <p>Min</p>
                            <h4>Expense</h4>
                            <p>Max</p>
                        </div>
                        <div className="display-min-max">
                            <p>{currencyFormatter.format(findLowestTransaction(transactions))}</p>
                            <p>{currencyFormatter.format(findHighestTransaction(transactions))}</p>
                        </div>
                    </div>
                </div>
            </div>
        
        </Container>
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
            <div className="budget-container">
                {budgets.map(budget => {
                    const amount = getBudgetExpenses(budget.budgetID).reduce(
                    (total, expense) => total + expense.amount,
                    0
                    )
                    return (
                    <BudgetCard
                        key={budget.budgetID}
                        name={budget.name}
                        amount={amount}
                        max={budget.max}
                        onAddExpenseClick={() => openAddExpenseModal(budget.budgetID)}
                        onViewExpensesClick={() => setViewExpensesModalBudgetID(budget.budgetID)}
                    />
                    )
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
        <div className="history" id="history">
            <h1>Expenses History</h1>
            <div className="expenses-history">
                <div className="transaction-btns">
                    <button className="history-btn left-btn" onClick={()=>{setShowHistory("income")}}>Income</button>
                    <button className="history-btn" onClick={()=>{setShowHistory("all")}}>All</button>
                    <button className="history-btn right-btn" onClick={()=>{setShowHistory("expense")}}>Expenses</button>
                </div>
                <div className="history-list">
                    {history.length === 0 ? (
                            <h2>Empty</h2>
                            ) : (
                                displayHistory(showHistory)
                            )}
                    
                </div>
            </div>
        </div>
    </div>
    )
}