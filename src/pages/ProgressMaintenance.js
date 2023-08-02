import { useEffect, useState } from "react";
import { Tree, Select, Card } from "antd";
import { format } from "fecha";
import "./Progress.css";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { NavBar } from "../components/NavBar";

const { TreeNode } = Tree;

export function ProgressMaintenance() {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "YYYY-MM-DD");
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    obtenerRegistros();
  }, []);

  const obtenerRegistros = async () => {
    const q = query(
      collection(db, "Registros"),
      where("state", "==", "aceptado"),
      //where("fecha", "==", formattedDate)
    );
    const querySnapshot = await getDocs(q);

    const registrosData = [];
    querySnapshot.forEach((doc) => {
      registrosData.push({ id: doc.id, ...doc.data() });
    });

    setRegistros(registrosData);
  };

  const handleChangeEstado = async (estado, registroId) => {
    await updateDoc(doc(db, "Registros", registroId), {
      stateAccept: estado,
    });

    const nuevosRegistros = registros.map((registro) => {
      if (registro.id === registroId) {
        return { ...registro, stateAccept: estado };
      }
      return registro;
    });

    setRegistros(nuevosRegistros);
  };

  const renderTreeNodes = (data) => {
    return data.map((registro) => (
      <TreeNode className="relative "
        title={
          <Card className="h-full justify-center text-justify text-orange-400 border-gray-800 bg-gray-800  w-[280px]  shadow-md rounded px-3 ml-[-50px]"
          key={registro.id}
          title={<h1 className="text-orange-400">{registro.servicio}</h1>}
          >
            <div className="flex justify-between">
            <h3>{registro.placamoto}</h3>

            <Select
              
              value={registro.stateAccept}
              onChange={(value) => handleChangeEstado(value, registro.id)}
            >
              <Select.Option value="inicializado">
                <label className="text-orange-400">Inicializado</label>
              </Select.Option>
              <Select.Option value="proceso">
                <label className="text-orange-400">En Proceso</label>
              </Select.Option>
              <Select.Option value="finalizado">
                <label className="text-orange-400">Finalizado</label>
              </Select.Option>
            </Select>
            </div>
          </Card>
        }
        key={registro.id}
        data={registro}
      />
    ));
  };

  const filterDataByState = (data, state) => {
    return data.filter((registro) => registro.stateAccept === state);
  };

  return (
    <div className="my-6">
      <Tree
        className=" bg-gray-600 flex text-center w-full justify-center items-center shadow-md rounded px-5 pb-6 mb-3"
        defaultExpandAll
      >
        <TreeNode
          className="text-orange-400  w-[280px] mx-auto bg-gray-800 p-8 px-8 rounded-lg my-3"
          title="Iniciado"
          key="iniciado"
        >
          {renderTreeNodes(filterDataByState(registros, "inicializado"))}
        </TreeNode>

        <TreeNode
          title="En Proceso"
          key="proceso"
          className="text-orange-400  w-[280px] mx-auto bg-gray-800 p-8 px-8 rounded-lg my-3"
        >
          {renderTreeNodes(filterDataByState(registros, "proceso"))}
        </TreeNode>
        <TreeNode
          title="Finalizado"
          key="finalizado"
          className="text-orange-400  w-[280px] mx-auto bg-gray-800 p-8 px-8 rounded-lg my-3"
        >
          {renderTreeNodes(filterDataByState(registros, "finalizado"))}
        </TreeNode>
      </Tree>

      <NavBar />
    </div>
  );
}
