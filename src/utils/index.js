import { database } from "configs";

export const toggleStatus = async (dbRef, updatedStatus) => {
  try {
    await database
      .ref(dbRef)
      .update({ isAccepted: updatedStatus, updatedAt: new Date().toString() });
  } catch (error) {
    console.log(error);
  }
};
