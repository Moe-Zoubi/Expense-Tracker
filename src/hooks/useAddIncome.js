import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useUserGetInfo";
import {v4 as uuidV4} from "uuid";

export const useAddIncome = () => {
  const incomeCollectionRef = collection(db, "income");
  const { userID } = useGetUserInfo();
  const addIncome = async ({
    description,
    amount,
  }) => {
    await addDoc(incomeCollectionRef, {
      userID: userID,
      incomeID: uuidV4(),
      amount,
      description,
      createdAt: serverTimestamp(),
    });
  };
  return { addIncome };
};