import React from 'react'
import { Button, Modal, Stack } from 'react-bootstrap'
import { currencyFormatter } from '../Utils'
import { useGetTransactions } from '../hooks/useGetTransactions'
import { toDate} from "date-fns";

export default function ViewExpensesModal({expenseType, index, show, handleClose}) {

    
    
    const {transactions} = useGetTransactions();

    function getTotalAmountForExpenseType(transactions, monthIndex, expenseType) {
        if(expenseType === "entertainment"){
            const filteredTransactions = transactions
            .filter((transaction) => {
            const date = new toDate(transaction.createdAt.toDate());
            return date.getMonth() === monthIndex && (transaction.expenseType === "digital-content" || transaction.expenseType === "subscription" || transaction.expenseType === expenseType);
            }).map((transaction) => (
                <Stack direction='horizontal' gap="2" key={transaction.id}>
                            <div className='me-auto fs-4'>{transaction.description}</div>
                            <div className='fs-5'>{currencyFormatter.format(transaction.amount)}</div>
                        </Stack>
            ))
            
        
            return filteredTransactions;
        } else{
            const filteredTransactions = transactions
            .filter((transaction) => {
            const date = new toDate(transaction.createdAt.toDate());
            return date.getMonth() === monthIndex && transaction.expenseType === expenseType;
            }).map((transaction) => (
                <Stack direction='horizontal' gap="2" key={transaction.id}>
                            <div className='me-auto fs-4'>{transaction.description}</div>
                            <div className='fs-5'>{currencyFormatter.format(transaction.amount)}</div>
                        </Stack>
            ))
            
        
            return filteredTransactions;
        }
        
      }
      function amountDifference(amount){
        if(amount > 0){
          return(
            <p>You spent <span className='highlighted-red'>{currencyFormatter.format(compareTotalExpenses)} </span> more than the previous month</p>
          )
        }else if(amount === 0){
          return(
            <p>You spent <span className='highlighted-green'>{currencyFormatter.format(compareTotalExpenses)} </span> less than the previous month</p>
          )
        }else{
          return(
            <p>You spent <span className='highlighted-green'>{currencyFormatter.format(compareTotalExpenses * -1)} </span> less than the previous month</p>
          )
        }
      }
      function compareTotalAmountForExpenseType(transactions, monthIndex, expenseType) {
        let filteredTransactions;
        if( monthIndex < 0){
            monthIndex = 12
        }
        if (expenseType === "entertainment") {
          filteredTransactions = transactions.filter((transaction) => {
            const date = new toDate(transaction.createdAt.toDate());
            return (
              date.getMonth() === monthIndex &&
              (transaction.expenseType === "digital-content" ||
                transaction.expenseType === "subscription" ||
                transaction.expenseType === expenseType) 
            );
          });
        } else {
          filteredTransactions = transactions.filter((transaction) => {
            const date = new toDate(transaction.createdAt.toDate());
            return date.getMonth() === monthIndex && transaction.expenseType === expenseType;
          });
        }
      
        const totalAmount = filteredTransactions.reduce((total, transaction) => {
          return total + transaction.amount;
        }, 0);
        return totalAmount;
      }
      
    
      const compareTotalExpenses = compareTotalAmountForExpenseType(transactions, index, expenseType) - compareTotalAmountForExpenseType(transactions, index - 1, expenseType)

  return (
    <Modal show={show} onHide={handleClose} >
            <Modal.Header closeButton>
                <Modal.Title>
                    <Stack direction='horizontal' gap="2">
                        <div>{expenseType} - Expenses</div>
                    </Stack>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {amountDifference(compareTotalExpenses)}
                <Stack direction='vertical' gap="3">
                    {getTotalAmountForExpenseType(transactions, index, expenseType)}
                </Stack>
            </Modal.Body>
    </Modal>
  )
}
