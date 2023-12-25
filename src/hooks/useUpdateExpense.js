import { collection, doc, query, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useUpdateExpense = () => {
    const updateExpense = async (transactionIDArr) => {
      for(let i= 0; i<transactionIDArr.length; i++){
        const transactionRef = doc(db, "transactions", transactionIDArr[i]);
  
          try {
            await updateDoc(transactionRef, {
                budgetID: "Uncategorized",
              });
              console.log("Budget updated to 'Uncategorized' successfully");
          } catch (error) {
            console.error("Error updating transaction:", error);
          }
        };
      }
      
  
    return { updateExpense };
  };
  