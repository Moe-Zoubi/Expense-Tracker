import React, { useEffect } from 'react'
import { useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useGetUserInfo } from './useUserGetInfo';


export const useGetBudgets = ()=> {

    const [budgets, setBudgets] = useState([]);
    const [budgetsTotal, setBudgetsTotal] = useState()
    const budgetCollectionRef = collection(db, "budgets");
    const {userID} = useGetUserInfo();

    const getBudgets = async() =>{
        let unsubscribe;
        try {
            const queryBudgets = query(budgetCollectionRef, where("userID", "==", userID), orderBy("createdAt"));

            

            unsubscribe = onSnapshot(queryBudgets, (snapshot)=>{
                let docs = [];
                let totalBudgets =0;
                snapshot.forEach((doc)=>{
                    const data = doc.data();
                    const id = doc.id;

                    docs.push({...data, id});

                    totalBudgets += Number(data.max);
                    
                });

                setBudgets(docs);
                setBudgetsTotal(totalBudgets);
            });
            
        } 
        catch (err){
            console.log(err)
        }

        return ()=> unsubscribe();
    };
    useEffect(()=>{
        getBudgets()
    },[])
  return {budgets, budgetsTotal}
}