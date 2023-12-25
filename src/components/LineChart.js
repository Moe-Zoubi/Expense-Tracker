import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useGetIncome } from '../hooks/useGetIncome';
import { useGetTransactions } from '../hooks/useGetTransactions';
import { currencyFormatter } from '../Utils';

const LineChart = () => {
  const { income } = useGetIncome();
  const { transactions } = useGetTransactions();
  
  const currentYear = new Date().getFullYear()

  const [chosenYear, setChosenYear] = useState(currentYear)
  const [history, setHistory] = useState([])

  

  function getTotalAmountForMonth(transactions, year, monthIndex) {
    const filteredTransactions = transactions
      .filter((transaction) => {
        const date = new Date(transaction.createdAt.toDate());
        return date.getFullYear() === year && date.getMonth() === monthIndex;
      })
      .map((transaction) => transaction.amount);

    const totalAmount = filteredTransactions.reduce((total, transaction) => {
      return total + transaction;
    }, 0);

    return totalAmount;
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

  const recentHistory = history.slice(0, 3).map((transaction) => (
    <div key={transaction.id} className="recent-transaction white-card">
      <p className={transaction.transactionType === 'income' ? 'type-income' : 'type-expense'}>
        {transaction.description}
      </p>
      <p className={transaction.transactionType === 'income' ? 'type-income' : 'type-expense'}>
      {transaction.transactionType === 'income' ? '+' : '-'}{currencyFormatter.format(transaction.amount)}
      </p>
    </div>
  ));
  // Generate data for 12 months dynamically using getTotalAmountForMonth
  const lineChartData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Income',
        data: Array.from({ length: 12 }, (_, monthIndex) => getTotalAmountForMonth(income, chosenYear, monthIndex)),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
      },
      {
        label: 'Expenses',
        data: Array.from({ length: 12 }, (_, monthIndex) => getTotalAmountForMonth(transactions, chosenYear, monthIndex)),
        borderColor: '#FF5722',
        backgroundColor: 'rgba(255, 87, 34, 0.2)',
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
      <div className='total-transactions'>
        <p className='heading-title'>Total Transactions</p>
            <select onChange={(e) => setChosenYear(parseInt(e.target.value))} className='year-select'>
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear - 1}>{currentYear - 1}</option>
              <option value={currentYear - 2}>{currentYear - 2}</option>
              <option value={currentYear - 3}>{currentYear - 3}</option>
              <option value={currentYear - 4}>{currentYear - 4}</option>
          </select>
      </div>
      <div className="transaction-Chart">
        <div className='line-chart stat-item white-card'>
            <Line data={lineChartData} options={lineChartOptions} />
        </div>
        <div className='stat-item'>
            <div className='summary-item'>
                <h2 className='heading-title'>Recent History</h2>
                <div className='display-recent-history'>
                    {recentHistory}
                </div>
            </div>
            <div className="summary-item">
                <h2 className='heading-title'>Transaction Stats</h2>
                <div className="stat mb">
                    <div className="transaction-header">
                        <p>Min</p>
                        <h4>Income</h4>
                        <p>Max</p>
                    </div>
                    <div className="display-min-max white-card padding-5">
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
                    <div className="display-min-max white-card padding-5">
                        <p>{currencyFormatter.format(findLowestTransaction(transactions))}</p>
                        <p>{currencyFormatter.format(findHighestTransaction(transactions))}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default LineChart;
