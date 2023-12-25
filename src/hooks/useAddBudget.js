import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useUserGetInfo";
import {v4 as uuidV4} from "uuid";

export const useAddBudget = () => {
  const budgetCollectionRef = collection(db, "budgets");
  const { userID } = useGetUserInfo();
  const addOnlineBudget = async ({
    name,
    max,
  }) => {
    await addDoc(budgetCollectionRef, {
      userID: userID,
      budgetID: uuidV4(),
      name: name,
      max: max,
      amount: 0,
      createdAt: serverTimestamp(),
    });
  };
  return { addOnlineBudget };
};