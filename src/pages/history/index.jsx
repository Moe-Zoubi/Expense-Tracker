import { useEffect, useState } from "react";
import "./style.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { currencyFormatter } from '../../Utils';
import { toDate} from "date-fns";
import { format } from "date-fns";
import { useGetIncome } from "../../hooks/useGetIncome";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import FilterModal from "../../components/FilterModal";



const History = () =>{


    const {income, incomeTotal} = useGetIncome();
    const {transactions, transactionsTotal} = useGetTransactions();


    const [history, setHistory] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showHistory, setShowHistory] = useState("all");
    const [selectedFilters, setSelectedFilters] = useState({
      transactionType: 'all',
      expenseType: 'Uncategorized',
    });


    const handleApplyFilters = (filters) => {
      setSelectedFilters(filters);
    };

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

       function displayHistory(type) {
        return (
          <table>
            <thead>
              <tr>
                <th rowSpan="2">Date</th>
                <th rowSpan="2">Item</th>
                <th rowSpan="2">Transaction Type</th>
                <th rowSpan="2">Amount</th>
                <th colSpan="2">Wallet</th>
              </tr>
              <tr>
                <th className="center">Change</th>
                <th className="center">Balance</th>
              </tr>
            </thead>
            <tbody>
              {history
                .filter((transaction) => {
                  if (selectedFilters.transactionType === "all") {
                    return true;
                  } else if (selectedFilters.transactionType === "income") {
                    return transaction.transactionType === "income";
                  } else if (
                    selectedFilters.transactionType === "expense" &&
                    selectedFilters.expenseType === "all"
                  ) {
                    return transaction.transactionType === "expense";
                  } else {
                    return (
                      transaction.transactionType === "expense" &&
                      transaction.expenseType === selectedFilters.expenseType
                    );
                  }
                })
                .map((transaction, index) => (
                  <tr key={index}>
                    <td>
                      {transaction.createdAt
                        ? formatDate(transaction.createdAt)
                        : "N/A"}
                    </td>
                    <td className="left-align">
                      <div className="bold">{transaction.description}</div>
                      <div>{transaction.id}</div>
                      <div>{`${formatDate(transaction.createdAt)} - ${formatTime(transaction.createdAt)}`}</div>
                    </td>
                    <td>
                      {transaction.transactionType === "expense"
                        ? transaction.expenseType
                        : transaction.transactionType}
                    </td>
                    <td>{currencyFormatter.format(transaction.amount)}</td>
                    <td>
                      {transaction.transactionType === "income"
                        ? `+${currencyFormatter.format(transaction.amount)}`
                        : `-${currencyFormatter.format(transaction.amount)}`}
                    </td>
                    <td>
                      {transaction.balance}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        );
      }


      useEffect(() => {
        const incomeHistory = income.map((i) => ({
          id: i.incomeID,
          transactionType: "income",
          description: i.description,
          amount: i.amount,
          createdAt: i.createdAt,
        }));
        const expenseHistory = transactions.map((transaction) => ({
          id: transaction.expenseID,
          transactionType: "expense",
          description: transaction.description,
          expenseType: transaction.expenseType,
          amount: transaction.amount,
          createdAt: transaction.createdAt,
        }));
        const transactionHistory = [...incomeHistory, ...expenseHistory];
        
        transactionHistory.sort((a, b) => {
          const dateA = a.createdAt;
          const dateB = b.createdAt;
      
          if (!dateA || !dateB) {
            return !dateA ? 1 : -1;
          }
      
          return dateA.toMillis() - dateB.toMillis();
        });

        let balance = 0;
        const transactionsWithBalance = transactionHistory.map((transaction) => {
          const { amount, transactionType } = transaction;
          balance = transactionType === "income" ? balance + amount : balance - amount;
          return { ...transaction, balance };
        });

        setHistory(transactionsWithBalance.reverse());
      }, [income, transactions]);
      
      

    return(
        <div className="transaction-history bg">
          <div className="transaction-header">
            <p className="page-title">Transaction History</p>
              <div className="transaction-filter">
                  <button onClick={()=>{setShowFilterModal(true)}}>
                    <FontAwesomeIcon icon={faPlus}/> Filter Options
                  </button>
                  <FilterModal 
                    show={showFilterModal}
                    handleApplyFilters={handleApplyFilters}
                    handleClose={() => setShowFilterModal(false)}
                  />
              </div>
          </div>
            <div className="history" id="history">
                
                    
                    <div className="history-list">
                        {history.length === 0 ? (
                                <h2>Empty</h2>
                                ) : (
                                    displayHistory(selectedFilters)
                                )}
                        
                    </div>
                
            </div>
        </div>
    );
};

export default History