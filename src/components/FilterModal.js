import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useRef } from 'react'

export default function FilterModal({show, handleClose, handleApplyFilters}) {
    
    const transactionTypeRef= useRef()
    const expenseTypeRef= useRef()


    const [currentExpenseType, setCurrentExpenseType] = useState()

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedFilters = {
          transactionType: transactionTypeRef.current.value,
          expenseType: expenseTypeRef.current ? expenseTypeRef.current.value : 'Uncategorized',
        };
        handleApplyFilters(selectedFilters);
        handleClose();
        setCurrentExpenseType("all")
      };

      function handleTransactionTypeChange(event) {
        setCurrentExpenseType(event.target.value);
      }


    return (
        <Modal show={show} onHide={handleClose}>
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Filter Options</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className='mb-3' controlId='budgetID'>
                <Form.Label>Transaction Type</Form.Label>
                <Form.Select defaultValue='All' ref={transactionTypeRef} onChange={handleTransactionTypeChange}>
                  <option value='all'>All</option>
                  <option value='income'>Income</option>
                  <option value='expense'>Expense</option>
                </Form.Select>
              </Form.Group>
              {currentExpenseType === 'expense' && (
                <Form.Group className='mb-3' controlId='budgetID'>
                  <Form.Label>Expense Type</Form.Label>
                  <Form.Select defaultValue='All' ref={expenseTypeRef}>
                    <option value='all'>All</option>
                    <option value='Uncategorized'>Uncategorized</option>
                    <option value='Bills'>Bills</option>
                    <option value='Food'>Food</option>
                    <option value='Subscription'>Subscription</option>
                    <option value='Digital-Content'>Digital Content</option>
                    <option value='Sports'>Sports</option>
                    <option value='Entertainment'>Entertainment</option>
                  </Form.Select>
                </Form.Group>
              )}
              <div className='d-flex justify-content-end'>
                <Button variant='primary' type='submit'>
                  Filter
                </Button>
              </div>
            </Modal.Body>
          </Form>
        </Modal>
      );
}
