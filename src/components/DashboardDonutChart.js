import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useGetTransactions } from '../hooks/useGetTransactions';

const DonutChart = () => {

    
    const {transactions, transactionsTotal} = useGetTransactions();


    const currentYear = new Date().getFullYear()

    const [chosenYear, setChosenYear] = useState(currentYear)

    function calculateTotalForExpenseType(type) {
      const filteredTransactions = transactions.filter((transaction) => {
        const transactionYear = new Date(transaction.createdAt.toDate()).getFullYear();
        return transaction.expenseType === type && transactionYear === chosenYear;
      });
  
      const totalAmount = filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  
      return totalAmount;
    }
  
  const data = {
    labels: ['Bills', 'Food', 'Subscription', 'Digital Content', 'Sports', 'Entertainment', 'Uncategorized'],
    datasets: [
      {
        data: [calculateTotalForExpenseType("Bills"), calculateTotalForExpenseType("Food"),
         calculateTotalForExpenseType("Subscription"), calculateTotalForExpenseType("Digital-Content"),
         calculateTotalForExpenseType("Sports"), calculateTotalForExpenseType("Entertainment")
         , calculateTotalForExpenseType("Uncategorized")],
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
    <div className='chart-card'>
        <div className='total-transactions'>
            <p className='heading-title'>Total Expenses</p>
            <select onChange={(e) => setChosenYear(parseInt(e.target.value))} className='year-select'>
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear - 1}>{currentYear - 1}</option>
              <option value={currentYear - 2}>{currentYear - 2}</option>
              <option value={currentYear - 3}>{currentYear - 3}</option>
              <option value={currentYear - 4}>{currentYear - 4}</option>
          </select>
        </div>
        <div className='donut-chart white-card'>
            <Doughnut style={{padding:"20px 20px"}} data={data} options={options} className='display-chart'/>
            <div className='display-percentage'>
                {chartInfo.map(item => (
                    <div key={item.label} className='display-item white-card'>
                        <div className=' item label-item'>
                            <div className='label-color' style={{ backgroundColor: item.bgColor}}>{item.percentage}</div>
                            <p style={{ width: `65%`}}>{item.label}</p>
                        </div>
                        <p className='item'>{item.amount}</p>
                    </div>
                ))}
            </div>  
        </div>
    </div>
    
  );
};

export default DonutChart;
