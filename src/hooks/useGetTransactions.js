import React, { useEffect } from 'react'
import { useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useGetUserInfo } from './useUserGetInfo';


export const useGetTransactions = ()=> {

    const [transactions, setTransactions] = useState([]);
    const [transactionsTotal, setTransactionsTotal] = useState()
    const transactionCollectionRef = collection(db, "transactions");
    const {userID} = useGetUserInfo();

    const getTransactions = async() =>{
        let unsubscribe;
        try {
            const queryTransactions = query(transactionCollectionRef, where("userID", "==", userID), orderBy("createdAt", "desc"));

            

            unsubscribe = onSnapshot(queryTransactions, (snapshot)=>{
                let docs = [];
                let totalExpenses = 0;
                snapshot.forEach((doc)=>{
                    const data = doc.data();
                    const id = doc.id;

                    docs.push({...data, id});

                    totalExpenses += Number(data.amount);
                    

                });

                setTransactions(docs);
                setTransactionsTotal(totalExpenses);
            });
            
        } 
        catch (err){
            console.log(err)
        }

        return ()=> unsubscribe();
    };
    useEffect(()=>{
        getTransactions()
    },[])
  return {transactions, transactionsTotal}
}