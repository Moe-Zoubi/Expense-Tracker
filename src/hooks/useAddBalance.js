import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useUserGetInfo";
import {v4 as uuidV4} from "uuid";

export const useAddBalance = () => {
  const balanceCollectionRef = collection(db, "balance");
  const { userID } = useGetUserInfo();
  const addBalance = async (amount) => {
    await addDoc(balanceCollectionRef, {
      userID: userID,
      balanceID: uuidV4(),
      amount,
      createdAt: serverTimestamp(),
    });
  };
  return { addBalance };
};