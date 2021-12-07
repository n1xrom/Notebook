import { collection, getDocs, doc, setDoc } from "@firebase/firestore";
import { dataBase, FireBaseListProps } from "modules";
import { NoteElement } from "providers";
import { createGuard } from "utils";

const noteElementGuardian = createGuard<FireBaseListProps>("list");

export const getNotesFromCloud = async (
  userId: string,
  middleware: (data: NoteElement[]) => void
) => {
  const firebaseSnapshot = await getDocs(collection(dataBase, userId));
  const notes = [...firebaseSnapshot.docs].find(value => noteElementGuardian(value.data()))
  const noteList = notes?.data()?.list;
  if (noteList) {
    middleware(noteList);
  }
};

export const addNotesToCloud = (userId: string, notes: NoteElement[]) => {
  setDoc(doc(dataBase, userId, "notes"), {
    list: notes,
  });
};
