import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Button, Space, DatePicker } from "antd";
import { NavBar } from "../components/NavBar";
import { Cards } from "../components/Cards";

export const ToDoList = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const { RangePicker } = DatePicker;
  const [registros, setRegistros] = useState([]);
  const [filter, setFilter] = useState("");

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onAcceptMaintenance = (id) => {
    if (window.confirm("¿Estás dispuesto a aceptar el mantenimiento?")) {
      const docRef = doc(db, "Registros", id, "Mantenimientos");
      updateDoc(docRef, {
        state: "aceptado",
      })
        .then(() => {
          console.log("Documento actualizado correctamente");
          // Actualizar el estado de registros
          const updatedRegistros = registros.map((registro) => {
            if (registro.id === id) {
              return { ...registro, state: "aceptado" };
            }
            return registro;
          });
          setRegistros(updatedRegistros);
        })
        .catch((error) => {
          console.error("Error al actualizar el documento: ", error);
        });
    }
  };

  const onDenyMaintenance = (id) => {
    if (window.confirm("¿Estás dispuesto a negar el mantenimiento?")) {
      const docRef = doc(db, "Registros", id,"Mantenimientos");
      updateDoc(docRef, {
        state: "negado",
      })
        .then(() => {
          console.log("Documento actualizado correctamente");
          // Actualizar el estado de registros
          const updatedRegistros = registros.map((registro) => {
            if (registro.id === id) {
              return { ...registro, state: "negado" };
            }
            return registro;
          });
          setRegistros(updatedRegistros);
        })
        .catch((error) => {
          console.error("Error al actualizar el documento: ", error);
        });
    }
  };
  const consultaPorRangoDeFechas = async (fechaInicio, fechaFin) => {
    const colRef = collection(db, "Registros");
    const q = query(
      colRef,
      where("fecha", ">=", fechaInicio),
      where("fecha", "<=", fechaFin)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.data().servicio);
      });
    } catch (error) {
      console.log("Error al realizar la consulta: ", error);
    }
  };
  const filterCalendar = async (dates, dateStrings) => {
    const fechaInicio = dateStrings[0];
    const fechaFin = dateStrings[1];
    setSelectedDateRange(dateStrings);

    const colRef = collection(db, "Registros");
    const q = query(
      colRef,
      where("state", "==", "agendado"),
      where("fecha", ">=", fechaInicio),
      where("fecha", "<=", fechaFin)
    );
    try {
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setRegistros(data);
      setShowDatePicker(false); // Oculta el RangePicker después de hacer la consulta
    } catch (error) {
      console.log("Error al realizar la consulta: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let q = query(collection(db, "Registros"));
      if (filter === "agendado") {
        const currentDate = getCurrentDate();
        q = query(
          q,
          where("state", "==", "agendado"),
          where("fecha", "==", currentDate)
        );
      } else if (filter === "aceptado") {
        q = query(q, where("state", "==", "aceptado"));
      } else if (filter === "negado") {
        q = query(q, where("state", "==", "negado"));
      }
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setRegistros(data);
    };

    fetchData();
  }, [filter]);
  const onShowAll = () => {
    setFilter("");
    setRegistros([]);
  };
  return (
    <>
      <div className="flex flex-col h-screen bg-gray-800  my-5">
        <Space
          wrap
          className="absolute top-2  flex items-center shadow-md text-center w-full justify-center "
        >
          <Button
            className="text-black  bg-yellow-500 shadow-lg shadow-yellow-500/50 hover:shadow-yellow-500/40 px-3 py-1 rounded-md mr-auto"
            onClick={() => {
              setFilter("agendado");
              setShowDatePicker(true);
            }}
          >
            Agendado
          </Button>
          <Button
            className="text-black bg-yellow-500 shadow-lg shadow-yellow-500/50 hover:shadow-yellow-500/40 px-3 py-1 rounded-md mr-auto"
            onClick={() => {
              setFilter("aceptado");
              setShowDatePicker(false);
            }}
          >
            Aceptado
          </Button>
          <Button
            className="text-black  bg-yellow-500 shadow-lg shadow-yellow-500/50 hover:shadow-yellow-500/40 px-3 py-1 rounded-md mr-auto"
            onClick={() => {
              setFilter("negado");
              setShowDatePicker(false);
            }}
          >
            Negado
          </Button>
          <Button
            className="text-black  bg-yellow-500 shadow-lg shadow-yellow-500/50 hover:shadow-yellow-500/40 px-3 py-1 rounded-md mr-auto"
            onClick={() => {
              onShowAll();
              setShowDatePicker(false);
            }}
          >
            Todos
          </Button>
        </Space>
        <br />
        <br />
        <br />
        {showDatePicker && (
          <RangePicker
            onChange={filterCalendar}
            className="border-none bg-slate-700 justify-center items-center mx-3 ml-[34px] mr-[34px]"
          />
        )}

        <Cards
          registros={registros}
          filter={filter}
          onAcceptMaintenance={onAcceptMaintenance}
          onDenyMaintenance={onDenyMaintenance}
          selectedDateRange={selectedDateRange}
        />
      </div>
      <NavBar />
    </>
  );
};
