import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useRef } from 'react'
import { UNCATEGORIZED_BUDGET_ID } from '../contexts/BudgetsContext'
import { useGetBudgets } from '../hooks/useGetBudget'
import { useAddTransaction } from '../hooks/useAddTransactions'

export default function AddExpenseModal({show, handleClose, defaultBudgetID, onExpenseAdded}) {
    
    const expenseTypeRef= useRef()
    const descriptionRef= useRef()
    const amountRef= useRef()
    const budgetIDRef= useRef()
    const { addOnlineExpense } = useAddTransaction()
    const {budgets} = useGetBudgets()

    function handleSubmit(e){
        e.preventDefault()
        addOnlineExpense({
            description: descriptionRef.current.value,
            amount: parseFloat(amountRef.current.value),
            budgetID: budgetIDRef.current.value,
            expenseType: expenseTypeRef.current.value,
        })

        handleClose()
    }

  return (
    <Modal show={show} onHide={handleClose} >
        <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>New Expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className='mb-3' controlId='description'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control ref={descriptionRef} type='text' required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='amount'>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control ref={amountRef} type='number' min={0} step={0.01} required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='budgetID'>
                    <Form.Label>Expense Type</Form.Label>
                    <Form.Select
                    defaultValue={defaultBudgetID}
                    ref={expenseTypeRef}>
                        <option value="Uncategorized">Uncategorized</option>
                        <option value="Bills">Bills</option>
                        <option value="Food">Food</option>
                        <option value="Subscription">Subscription</option>
                        <option value="Digital-Content">Digital Content</option>
                        <option value="Sports">Sports</option>
                        <option value="Entertainment">Entertainment</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className='mb-3' controlId='budgetID'>
                    <Form.Label>Budget</Form.Label>
                    <Form.Select
                    defaultValue={defaultBudgetID}
                    ref={budgetIDRef}>
                        <option id={UNCATEGORIZED_BUDGET_ID}>Uncategorized</option>
                        {budgets.map(budget =>(
                            <option key={budget.budgetID} value={budget.budgetID}>{budget.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <div className='d-flex justify-content-end'>
                    <Button variant='primary' type='submit' onClick={onExpenseAdded}>Add</Button>
                </div>
            </Modal.Body>
        </Form>
    </Modal>
  )
}
