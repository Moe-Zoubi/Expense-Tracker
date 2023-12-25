import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faChartLine, faMoneyBillTransfer, faPiggyBank, faDollarSign, faClockRotateLeft, faWallet, faArrowRightFromBracket, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useGetUserInfo } from '../hooks/useUserGetInfo';
import { useGetIncome } from '../hooks/useGetIncome';
import { useGetTransactions } from '../hooks/useGetTransactions';
import { currencyFormatter } from '../Utils';
import {useNavigate} from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config';


const Sidebar = ({children}) => {
    const [currentBalance, setCurrentBalance] = useState()
    const [transactionAdded, setTransactionAdded] = useState(false)
    const[isOpen ,setIsOpen] = useState(true);
    const toggle = () => setIsOpen (!isOpen);

    
    const {income, incomeTotal} = useGetIncome();
    const {transactions, transactionsTotal} = useGetTransactions();

    
    const { name, profilePhoto} = useGetUserInfo();
    const navigate = useNavigate();

    const menuItem=[
        {
            path:"/dashboard",
            name:"Dashboard",
            icon:<FontAwesomeIcon icon={faChartLine}/>,
        },
        {
            path:"transactions",
            name:"Transactions",
            icon:<FontAwesomeIcon icon={faMoneyBillTransfer}/>,
        },
        {
            path:"budgets",
            name:"Budgets",
            icon:<FontAwesomeIcon icon={faPiggyBank}/>,
        },
        {
            path:"history",
            name:"History",
            icon:<FontAwesomeIcon icon={faClockRotateLeft}/>,
        }
    ]
    useEffect(() => {
        if (transactionAdded) {
          setCurrentBalance((prevBalance) => prevBalance - transactionsTotal + incomeTotal);
          setTransactionAdded(false);
        }
      }, [transactionAdded, transactionsTotal, incomeTotal]);
    
    useEffect(() => {
        if (incomeTotal !== undefined && transactionsTotal !== undefined) {
          const totalBalance = incomeTotal - transactionsTotal;
          setCurrentBalance(totalBalance);
        }
      }, [incomeTotal, transactionsTotal]);

    const signOutUser = async () => {
        try {
          await signOut(auth);
          localStorage.removeItem("auth"); // Remove the authentication information from local storage.
          navigate("/"); // Redirect the user to the login page or any other desired page.
        } catch (error) {
          console.error("Error signing out:", error);
        }
      };

    
    return (
        <div className="flex-container bg">
           <div className="sidebar white-card" style={{width: isOpen ? "220px" : "50px"}}>
                <div className="top-section">
                  <div style={{marginLeft: isOpen ? "165px" : "-10px"}} className="bars">
                    {isOpen 
                    ? <FontAwesomeIcon icon={faXmark} size='2xl' style={{color: '#000066',}} onClick={toggle}/>
                    : <FontAwesomeIcon icon={faBars } size='2xl' style={{color: '#000066',}} onClick={toggle}/>
                    }
                  </div>
                  <img style={{display: isOpen ? "" : "none"}}className="profile-photo" src={profilePhoto} />
                  <p style={{display: isOpen ? "" : "none"}} className='profile-name'>{name}</p>
                  <p style={{display: isOpen ? "" : "none"}} className='balance'><FontAwesomeIcon icon={faWallet}/> {currencyFormatter.format(currentBalance)}</p>
                </div>
                {
                   menuItem.map((item, index)=>(
                    <NavLink style={{marginLeft: isOpen ? "" : "-15px"}} to={item.path} key={index} className="link" activeclassName="active">
                        <div style={{marginLeft: isOpen ? "" : "-12px"}}className="icon">{item.icon}</div>
                        <div style={{display: isOpen ? "" : "none", marginLeft: isOpen ? "" : "0px"}} className="link_text">{item.name}</div>
                    </NavLink>
                   ))
                }
                <button style={{display: isOpen ? "" : "none"}} className='signout-btn' onClick={signOutUser}>sign out <FontAwesomeIcon icon={faArrowRightFromBracket} style={{color: "#000000",}}/></button>
           </div>
           <main>{children}</main>
        </div>
    );
};

export default Sidebar;