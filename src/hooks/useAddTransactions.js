import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useUserGetInfo";
import {v4 as uuidV4} from "uuid";

export const useAddTransaction = () => {
  const transactionCollectionRef = collection(db, "transactions");
  const { userID } = useGetUserInfo();
  const addOnlineExpense = async ({
    description,
    amount,
    budgetID,
    expenseType,
  }) => {
    await addDoc(transactionCollectionRef, {
      userID: userID,
      expenseID: uuidV4(),
      budgetID,
      amount,
      description,
      expenseType,
      createdAt: serverTimestamp(),
    });
  };
  return { addOnlineExpense };
};