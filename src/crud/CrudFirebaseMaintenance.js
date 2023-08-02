import { db } from "../firebase";
import { toast } from "react-toastify";
import React, { useState, useContext } from "react";
import { SaveMaintenance } from "../components/SaveMaintenance";
import { AppContext } from "../components/StepsRegister";
import { AppContextS } from "../context/authContext";

import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

export const CrudFirebaseMaintenance = () => {
  const { miValor } = useContext(AppContextS);
  const { nextStep } = useContext(AppContext);
  const { prev } = useContext(AppContext);
  const [links, setLinks] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const getLinks = async () => {
    const dataCollection = collection(db, "Mantenimientos");
    const docs = [];
    const unsubscribe = onSnapshot(dataCollection, (QuerySnapshot) => {
      QuerySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setLinks(docs);
    });
  };
  const addOrPrev = () => {
    prev();
  };
  const addOrEditLink = async (linkObject) => {
    try {
      if (currentId === "") {
        try {
          const docRef = doc(db, "Registros", miValor);
          await updateDoc(docRef, {
            fecha: linkObject.fecha,
            comentario: linkObject.comentario,
            servicio: linkObject.servicio,
            state: linkObject.state,
            stateAccept: linkObject.stateAccept,
          });
          toast("Tarea actualizada", { type: "success", autoClose: 2000 });
          nextStep();
        } catch (e) {
          toast("Error al actualizar la tarea", {
            type: "error",
            autoClose: 2000,
          });
        }
      } else {
        const updateRef = doc(db, "Mantenimientos", currentId);
        await updateDoc(updateRef, linkObject);
        toast("Tarea Actualizada Correctamente", {
          type: "info",
          autoClose: 2000,
        });
        setCurrentId("");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="col-md-4 p-2">
        <SaveMaintenance {...{ addOrEditLink, addOrPrev, currentId, links }} />
      </div>
    </>
  );
};
