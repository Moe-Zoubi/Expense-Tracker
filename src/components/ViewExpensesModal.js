import React from 'react'
import { Button, Modal, Stack } from 'react-bootstrap'
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from '../contexts/BudgetsContext'
import { useGetBudgets } from '../hooks/useGetBudget'
import { currencyFormatter } from '../Utils'
import { useDeleteBudget } from '../hooks/useDeleteBudget'
import { useUpdateExpense } from '../hooks/useUpdateExpense'
import { useDeleteTransaction } from '../hooks/useDeleteTransaction'

export default function ViewExpensesModal({budgetID, handleClose, onExpenseDeleted}) {

    
    const {getBudgetExpensesForCurrentMonth} = useBudgets()
    const {budgets} = useGetBudgets();
    const expenses = getBudgetExpensesForCurrentMonth(budgetID);
    const { deleteBudget } = useDeleteBudget();
    const { updateExpense } = useUpdateExpense();
    const { deleteTransaction } = useDeleteTransaction();
    
    
    const budget = 
    UNCATEGORIZED_BUDGET_ID === budgetID 
        ? {name: "Uncategorized", id: UNCATEGORIZED_BUDGET_ID} 
        : budgets.find(b => b.budgetID === budgetID)

  return (
    <Modal show={budgetID != null} onHide={handleClose} >
            <Modal.Header closeButton>
                <Modal.Title>
                    <Stack direction='horizontal' gap="2">
                        <div>Expenses - {budget?.name}</div>
                        {budgetID !== UNCATEGORIZED_BUDGET_ID && (
                            <Button variant='outline-danger' onClick={()=>{
                                updateExpense(expenses.map(expense => expense.id))
                                deleteBudget(budget.id)
                                handleClose()
                            }}>Delete</Button>
                        )}
                    </Stack>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack direction='vertical' gap="3">
                    {expenses.map(expense =>(
                        <Stack direction='horizontal' gap="2" key={expense.id}>
                            <div className='me-auto fs-4'>{expense.description}</div>
                            <div className='fs-5'>{currencyFormatter.format(expense.amount)}</div>
                            <Button 
                                size='sm' 
                                variant='outline-danger'
                                onClick={()=> {
                                    deleteTransaction(expense.id)
                                    onExpenseDeleted()
                                }}
                                >&times;</Button>
                        </Stack>
                    ))}
                </Stack>
            </Modal.Body>
    </Modal>
  )
}
