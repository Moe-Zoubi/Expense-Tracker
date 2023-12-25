import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faUtensils, faFileInvoice, faTv } from "@fortawesome/free-solid-svg-icons";
import { useGetTransactions } from '../hooks/useGetTransactions';
import { toDate} from "date-fns";
import { currencyFormatter } from '../Utils';
import ViewExpensesTypeModal from './ViewExpensesTypeModal';

const MonthlyBarChart = () => {
  // Define the number of previous months to display
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const {transactions, transactionsTotal} = useGetTransactions();
  // Get the current date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  // Initialize the currently displayed month
  const [currentMonthIndex, setCurrentMonthIndex] = useState(currentMonth);
  const [clickedExpenseType, setClickedExpenseType] = useState("");
  const [showExpenseType, setShowExpenseType] = useState(false);


  function getTotalAmountForMonth(transactions, monthIndex) {
    const filteredTransactions = transactions
    .filter((transaction) => {
      const date = new toDate(transaction.createdAt.toDate());
      return date.getMonth() === monthIndex;
    }).map((transaction) => transaction.amount)
    
    const totalAmount = filteredTransactions.reduce((total, transaction) => {
      return total + transaction;
    }, 0);

    return totalAmount;
  }
  
  // Create an array to store the total amount for each of the last three months
  const data = {
    labels: [],
    datasets: [
      {
        label: 'Total Amount',
        data: [], // Initialize with zeros for each month
        backgroundColor: 'blue', // Bar color
        borderColor: 'blue',
        borderWidth: 1,
      },
    ],
  };

  

  // Calculate the total amount for each of the last three months
  for (let i = -1; i <= 1; i++) {
    const adjustedMonth = currentMonthIndex + i;
    const monthIndex = (adjustedMonth + 12) % 12; // Ensure it wraps around for January to December
    data.labels.push(months[monthIndex]);

    // Initialize total amount for the month
    const totalAmount = getTotalAmountForMonth(transactions, monthIndex);
    data.datasets[0].data.push(totalAmount);
  }

  const options = {
    scales: {
      y: {
        display: false,
        grid: {
          display: false, // This removes the grid lines on the Y-axis
        },
      },
      x: {
        grid: {
          display: false,
        },
        barPercentage: 0.1, // Adjust the bar width here (0.5 means 50% of the available space)
      },
    },
  };

  // Function to handle clicking the left icon
  const handleLeftIconClick = () => {
    if(currentMonthIndex === 0){
      setCurrentMonthIndex(11);
    }else{
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  // Function to handle clicking the right icon
  const handleRightIconClick = () => {
    if(currentMonthIndex === 11){
      setCurrentMonthIndex(0);
    }else{
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
    
  };
  return (
    <div className='white-card'>
      <h1>Monthly Expenses</h1>
      <div className="total-spend">
        <h2>{currencyFormatter.format(getTotalAmountForMonth(transactions, currentMonthIndex))}</h2>
        <p>Total Spend</p>
      </div>
      <div className='barChart'>
        <FontAwesomeIcon
          icon={faChevronLeft}
          size="2xl"
          style={{ color: "#000000" }}
          onClick={handleLeftIconClick}
        />
        <Bar className='chart' data={data} options={options}/>
        <FontAwesomeIcon
          icon={faChevronRight}
          size="2xl"
          style={{ color: "#000000" }}
          onClick={handleRightIconClick}
        />
      </div>
      <div className='expense-types'>
          <div className='expense-type-btns'>
            <button 
              onClick={() => {setShowExpenseType(true); setClickedExpenseType("bills");}}>
                <FontAwesomeIcon
                  icon={faFileInvoice}
                  style={{ color: "#ffffff" }}
                />
            </button>
            <p>Bills</p>
          </div> 
          <div className='expense-type-btns'>
            <button onClick={() => {setShowExpenseType(true); setClickedExpenseType("food");}}>
              <FontAwesomeIcon
                icon={faUtensils}
                style={{ color: "#ffffff" }}
              />
            </button>
            <p>Food</p>
          </div>     
          <div className='expense-type-btns'>
            <button onClick={() => {setShowExpenseType(true); setClickedExpenseType("entertainment");}}>
              <FontAwesomeIcon
                icon={faTv}
                style={{ color: "#ffffff" }}
              />
            </button>
            <p>Leisure</p>
          </div>
      </div>
      <ViewExpensesTypeModal 
            expenseType={clickedExpenseType}
            index = {currentMonthIndex} 
            show={showExpenseType}
            handleClose={() => setShowExpenseType(false)}
        />
    </div>
  );
};

export default MonthlyBarChart;
