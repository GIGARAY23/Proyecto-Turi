import { useState, useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./../firebase";
import { format } from "fecha";
import "./Savemain.css";

export function SaveMaintenance(props) {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "YYYY-MM-DD");
  const [options, setOptions] = useState([]);
  const initialStateValues = {
    fecha: formattedDate,
    servicio: "",
    comentario: "",
    state: "agendado",
    stateAccept: "inicializado",
  };
  const [values, setValues] = useState(initialStateValues);
  const handleImputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const sds = (e) => {
    setValues({ ...values, servicio: e });
  };
  const { TextArea } = Input;

  const fetchOptions = async () => {
    const querySnapshot = await getDocs(collection(db, "Servicios"));
    const newOptions = querySnapshot.docs.map((doc) => {
      return {
        value: doc.data().servicio,
        label: doc.data().servicio,
      };
    });
    setOptions(newOptions);
  };

  const hSubmit = (e) => {
    e.preventDefault();
    props.addOrEditLink(values);
    setValues({ ...initialStateValues });
  };

  const returnC = (e) => {
    e.preventDefault();
    props.addOrPrev(values);
    setValues({ ...initialStateValues });
  };

  useEffect(() => {
    fetchOptions();
  }, []);
  return (
    <>
      <div>
        <Form
          className=" flex flex-col  justify-center  bg-gray-800   shadow-md rounded px-8 py-6 pb-8 mb-4 "
          onSubmit={hSubmit}
        >
          <label
            htmlFor="text"
            className="block text-orange-300 text-sm font-fold mb-2"
          >
            Servicios Ofrecidos:
          </label>
          <Select
            className="text-orange-300"
            defaultValue="Seleccione un Servicio"
            options={options}
            onChange={sds}
            name="target.servicio"
          />
          <br />
          <label
            htmlFor="text"
            className="block text-orange-300 text-sm font-fold mb-2"
          >
            Comentario:
          </label>
          <TextArea
            className="textarea"
            rows={5}
            placeholder="Ponga un Comentario u Observación"
            allowClear
            onChange={handleImputChange}
            name="comentario"
          />
          <div className=" flex  my-3 gap-3 justify-center">
          <Button
              size="large"
              className="text-orange-300 "
              type="ghost"
              shape="default"
              onClick={returnC}
            >
              <DoubleLeftOutlined className="text-4xl" />
            </Button>
            <Button
              size="large"
              className="text-orange-300"
              type="ghost"
              shape="default"
              onClick={hSubmit}
            >
              <DoubleRightOutlined className="text-4xl" />
            </Button>
            
          </div>
        </Form>
      </div>
    </>
  );
}
