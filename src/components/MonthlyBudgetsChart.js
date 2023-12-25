import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useGetBudgets } from '../hooks/useGetBudget';

const MonthlyBudgetsChart = ({range}) => {

    const {budgets, budgetsTotal} = useGetBudgets();

    

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();


    function labelsForMonthRange(monthRange){

      const filterByMonth = (budget, month, year) => {
        const budgetMonth = new Date(budget.createdAt?.toDate()).getMonth();
        const budgetYear = new Date(budget.createdAt?.toDate()).getFullYear();
        return budgetYear === year && budgetMonth === month;
      };

      if (monthRange === 1) {
        return budgets.filter((budget) => filterByMonth(budget, currentMonth, currentYear));
      } else if (monthRange === 3) {
        return budgets.filter((budget) =>
          [
            currentMonth,
            currentMonth - 1,
            currentMonth - 2,
          ].some((month) => filterByMonth(budget, month, currentYear))
        );
      } else {
        return budgets.filter((budget) =>
          [
            currentMonth,
            currentMonth - 1,
            currentMonth - 2,
            currentMonth - 3,
            currentMonth - 4,
            currentMonth - 5,
          ].some((month) => filterByMonth(budget, month, currentYear))
        );
      }
    }

    function calculateTotalForExpenseType(type) {
      const filterByMonth = (budget, month) => {
        const budgetMonth = new Date(budget.createdAt?.toDate()).getMonth();
        return budget.name === type && budgetMonth === month;
      };
  
      let filteredBudget;
      if (range === 1) {
        filteredBudget = budgets.filter((budget) => filterByMonth(budget, currentMonth));
      } else if (range === 3) {
        filteredBudget = budgets.filter(
          (budget) =>
            filterByMonth(budget, currentMonth) ||
            filterByMonth(budget, currentMonth - 1) ||
            filterByMonth(budget, currentMonth - 2)
        );
      } else {
        filteredBudget = budgets.filter((budget) =>
          [
            currentMonth,
            currentMonth - 1,
            currentMonth - 2,
            currentMonth - 3,
            currentMonth - 4,
            currentMonth - 5,
          ].some((month) => filterByMonth(budget, month))
        );
      }
  
      const totalAmount = filteredBudget.reduce((total, budget) => total + budget.max, 0);
  
      return totalAmount;
    }
  
    const budgetLabels = [...new Set(labelsForMonthRange(range).map((budget) => budget.name))];

  const data = {
    labels: budgetLabels,
    datasets: [
      {
        data: budgetLabels.map((budgetlabel) => (calculateTotalForExpenseType(budgetlabel))),
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0', '#FF6EC7'],
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

export default MonthlyBudgetsChart;
