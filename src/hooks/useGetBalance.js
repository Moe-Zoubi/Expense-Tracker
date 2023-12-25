import React, { useEffect } from 'react'
import { useState } from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useGetUserInfo } from './useUserGetInfo';


export const useGetBalance = ()=> {

    const [balance, setBalance] = useState([]);
    const balanceCollectionRef = collection(db, "balance");
    const {userID} = useGetUserInfo();

    const getBalance = async() =>{
        let unsubscribe;
        try {
            const queryBudgets = query(balanceCollectionRef, where("userID", "==", userID), orderBy("createdAt"));

            let docs = []

            unsubscribe = onSnapshot(queryBudgets, (snapshot)=>{
                snapshot.forEach((doc)=>{
                    const data = doc.data();
                    const id = doc.id;

                    docs.push({...data, id});
                });

                setBalance(docs)
            });
            
        } 
        catch (err){
            console.log(err)
        }

        return ()=> unsubscribe();
    };
    useEffect(()=>{
        getBalance()
    },[])
  return {balance}
}