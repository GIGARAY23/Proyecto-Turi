import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../components/StepsRegister";
import { AppContextS } from "../context/authContext";
import { Register } from "../components/Register";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {} from "@ant-design/icons";
import { toast } from "react-toastify";

export const CrudFirebaseRegister = () => {
  const { miValor, setMiValor } = useContext(AppContextS);
  const { nextStep } = useContext(AppContext);
  const [links, setLinks] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const getLinks = async () => {
    const dataCollection = collection(db, "Registros");
    const docs = [];
    const unsubscribe = onSnapshot(dataCollection, (QuerySnapshot) => {
      QuerySnapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({ ...doc.data(), id: doc.id });
      });
      setLinks(docs);
    });
  };
  const addOrEditLinkRegister = async (linkObject, idenviar) => {
    try {
      if (currentId === "") {
        try {
          const docRef = await addDoc(collection(db, "Registros"), {
            id: "",
            email: linkObject.email,
            nombreyapellido: linkObject.nombreyapellido,
            cedula: linkObject.cedula,
            numerocelular: linkObject.numerocelular,
            placamoto: linkObject.placamoto,
          });

          await updateDoc(doc(db, "Registros", docRef.id), {
            id: docRef.id,
          });
          const idvalues = docRef.id;
          toast("Nueva Usuario Agregada", { type: "success", autoClose: 2000 });
          nextStep();
          setMiValor(idvalues);
        } catch (e) {
          toast("Error al enviar Tarea", { type: "error", autoClose: 2000 });
        }
      } else {
        const updateRef = doc(db, "Registros", currentId);
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

  useEffect(() => {
    getLinks();
  }, []);
  return (
    <>
      <div className="col-md-4 p-2">
        <Register {...{ addOrEditLinkRegister, currentId, links }} />
      </div>
    </>
  );
};
