import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useRef } from 'react'
import { useAddBudget } from '../hooks/useAddBudget'
import { useGetBudgets } from '../hooks/useGetBudget'

export default function AddBudgetModal({show, handleClose}) {
    
    const nameRef= useRef()
    const maxRef= useRef()
    const {budgets} = useGetBudgets()
    const { addOnlineBudget } = useAddBudget()
    
    const currentMonth = new Date().getMonth()
    

    function handleSubmit(e){
        e.preventDefault()
        if(budgets.find((budget)  => {
            const budgetMonth = new Date(budget.createdAt.toDate()).getMonth();
            return budget.name === nameRef.current.value && budgetMonth === currentMonth;
        })){
            console.log("already exists")
        }else{
            addOnlineBudget({name: nameRef.current.value, max: parseFloat(maxRef.current.value)})
        }

        handleClose()
    }

  return (
    <Modal show={show} onHide={handleClose} >
        <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>New Budget</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control ref={nameRef} type='text' required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='max'>
                    <Form.Label>Maximum Spending</Form.Label>
                    <Form.Control ref={maxRef} type='number' min={0} step={0.01} required />
                </Form.Group>
                <div className='d-flex justify-content-end'>
                    <Button variant='primary' type='submit'>Add</Button>
                </div>
            </Modal.Body>
        </Form>
    </Modal>
  )
}
