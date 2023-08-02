import { Result, Button } from "antd";
import { AppContext } from "./StepsRegister";
import React, { useContext } from "react";

export function Gratitude() {
  const { startStep } = useContext(AppContext);
  const startRegister = () => {
    startStep();
  };

  return (
    <>
      <Result
        className="leading-none"
        status="success"
        title={
          <label className="text-orange-300">
            ¡Su Mantenimiento se ha registrado Correctamente!
          </label>
        }
        subTitle={
          <label className="text-orange-300">
            Espere una respuesta de su Mantenimiento, Recibirá una llamada
          </label>
        }
      />
      <Button
        type="primary "
        shape="default"
        className=" absolute mx-[-30px] mt-[-42px] justify-center"
        onClick={startRegister}
      >
        Done
      </Button>
    </>
  );
}
