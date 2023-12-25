import React, { useEffect } from 'react'
import { useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useGetUserInfo } from './useUserGetInfo';


export const useGetIncome = ()=> {

    const [income, setIncome] = useState([]);
    const [incomeTotal, setIncomeTotal] = useState()
    const incomeCollectionRef = collection(db, "income");
    const {userID} = useGetUserInfo();

    const getIncome = async() =>{
        let unsubscribe;
        try {
            const queryBudgets = query(incomeCollectionRef, where("userID", "==", userID), orderBy("createdAt", "desc"));

            

            unsubscribe = onSnapshot(queryBudgets, (snapshot)=>{
                let docs = [];
                let totalIncome = 0;
                snapshot.forEach((doc)=>{
                    const data = doc.data();
                    const id = doc.id;

                    docs.push({...data, id});

                    totalIncome += Number(data.amount);
                });

                setIncome(docs);
                setIncomeTotal(totalIncome);
            });
            
        } 
        catch (err){
            console.log(err)
        }

        return ()=> unsubscribe();
    };
    useEffect(()=>{
        getIncome()
    },[])
  return {income, incomeTotal}
}