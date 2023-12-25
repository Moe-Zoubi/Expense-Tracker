import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useDeleteBudget = () => {
  const deleteBudget = async (budgetID) => {
    const budgetRef = doc(db, "budgets", budgetID);

    try {
      console.log(budgetID)
      await  deleteDoc(budgetRef);
      console.log("Budget deleted successfully");
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  return { deleteBudget };
};
