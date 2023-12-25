import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useGetTransactions } from '../hooks/useGetTransactions';

const MonthlyExpenseChart = ({range}) => {

    const {transactions, transactionsTotal} = useGetTransactions();


    const currentMonth = new Date().getMonth()


    function calculateTotalForExpenseType(type, expenses) {
        let filteredTransactions
        if(range === 1){
            filteredTransactions = expenses.filter((expense) => {
                const transactionMonth = new Date(expense.createdAt?.toDate()).getMonth();
                return expense.expenseType === type && transactionMonth === currentMonth;
              });
        }else if(range === 3){
            filteredTransactions = expenses.filter((expense) => {
                const transactionMonth = new Date(expense.createdAt?.toDate()).getMonth();
                return expense.expenseType === type && (transactionMonth === currentMonth || transactionMonth === currentMonth - 1 || transactionMonth === currentMonth - 2);
              });
        }else{
            filteredTransactions = expenses.filter((expense) => {
                const transactionMonth = new Date(expense.createdAt?.toDate()).getMonth();
                return expense.expenseType === type 
                && (
                        transactionMonth === currentMonth 
                        || transactionMonth === currentMonth - 1 
                        || transactionMonth === currentMonth - 2
                        || transactionMonth === currentMonth - 3
                        || transactionMonth === currentMonth - 4
                        || transactionMonth === currentMonth - 5
                    );
              });
        }
        
  
      const totalAmount = filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  
      return totalAmount;
    }
  
  const data = {
    labels: ['Bills', 'Food', 'Subscription', 'Digital Content', 'Sports', 'Entertainment', 'Uncategorized'],
    datasets: [
      {
        data: [calculateTotalForExpenseType("Bills", transactions), calculateTotalForExpenseType("Food", transactions),
         calculateTotalForExpenseType("Subscription", transactions), calculateTotalForExpenseType("Digital-Content", transactions),
         calculateTotalForExpenseType("Sports", transactions), calculateTotalForExpenseType("Entertainment", transactions)
         , calculateTotalForExpenseType("Uncategorized", transactions)],
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0', '#FF6EC7', '#f34254'],
      },
    ],
  };

  // Calculate percentages
  const total = data.datasets[0].data.reduce((acc, value) => acc + value, 0);
  const percentages = data.datasets[0].data.map(value => ((value / total) * 100).toFixed(2));

  // Display information
  const chartInfo = data.labels.map((label, index) => ({
    label,
    amount: `$${data.datasets[0].data[index]}`,
    percentage: percentages[index] === "NaN" ? `0.00%` : `${percentages[index]}%`,
    bgColor: `${data.datasets[0].backgroundColor[index]}`
  }));

  // Chart options to remove labels
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    
  };

  return (
    <div>
        <div className='donut-chart white-card'>
            <Doughnut style={{padding:"20px 20px"}} data={data} options={options} className='display-chart'/>
            <div className='display-percentage'>
                {chartInfo.map(item => (
                    <div key={item.label} className='display-item white-card'>
                        <div className=' item label-item'>
                            <div className='label-color' style={{ backgroundColor: item.bgColor}}>{item.percentage}</div>
                            <p style={{ width: `90%`}}>{item.label}</p>
                        </div>
                        <p className='item'>{item.amount}</p>
                    </div>
                ))}
            </div>  
        </div>
    </div>
    
  );
};

export default MonthlyExpenseChart;
