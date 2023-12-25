import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useDeleteTransaction = () => {
  const deleteTransaction = async (transactionId) => {
    const transactionRef = doc(db, "transactions", transactionId);

    try {
      console.log(transactionId)
      await deleteDoc(transactionRef);
      console.log("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return { deleteTransaction };
};
