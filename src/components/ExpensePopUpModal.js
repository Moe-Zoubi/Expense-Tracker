import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { currencyFormatter } from '../Utils';
import { toDate} from "date-fns";
import { format } from "date-fns";



function ExpensePopUpModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  function formatDate(date) {
    const createdAtDate = toDate(date.toDate()); // Convert to JavaScript Date
    const createdDate = format(createdAtDate, "EEE, do MMM");
    console.log(createdAtDate)
    return createdDate;
  }
  
  function formatTime(date){
    const createdAtDate = toDate(date.toDate()); // Convert to JavaScript Date
    const time = format(createdAtDate, "HH:mm a");

    return time;
   }
  return (
    <>
      <h3 className='date'>{formatDate(props.createdAt)}</h3>
      
        <Button variant="outline-info" size="1g" className="w-100 d-block" onClick={handleShow}>
            <div className='expense-item'>
                <h3>{props.description}</h3>
                <h4>-{currencyFormatter.format(props.amount)}</h4>
            </div>
        </Button>
      
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Expense Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='expense-item'>
                <h3>{props.description}</h3>
                <h4>-{currencyFormatter.format(props.amount)}</h4>
            </div>
            <p>Purchase on: {formatDate(props.createdAt)}, {formatTime(props.createdAt)}</p>
        </Modal.Body>
      </Modal>  
    </>
  );
}

export default ExpensePopUpModal;