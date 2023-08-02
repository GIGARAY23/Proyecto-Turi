import { Steps, theme } from "antd";
import { useState, createContext } from "react";
import { AppProvider } from "../context/authContext";
import { ToastContainer } from "react-toastify";
import { CrudFirebaseRegister } from "./../crud/CrudFirebaseRegister";
import { CrudFirebaseMaintenance } from "./../crud/CrudFirebaseMaintenance";

import "./Step.css";

export const AppContext = createContext();

export function StepsRegister() {
  const [currentStep, setCurrentStep] = useState(1);
  const startStep = () => {
    setCurrentStep(currentStep - 2);
    setCurrent(current - 2);
  };
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrentStep(currentStep - 1);
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: <h1 className="">Registro</h1>,
      content: (
        <>
          <AppContext.Provider
            value={{ currentStep, nextStep, prev, startStep }}
          >
            <AppProvider>
              {currentStep === 1 && <CrudFirebaseRegister />}
            </AppProvider>
          </AppContext.Provider>
        </>
      ),
    },
  ];
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed orange`,
    marginTop: 16,
  };

  return (
    <>
      <Steps current={current} items={items} type="navigation" size="small" />
      <div className="arror border-none" style={contentStyle}>
        {steps[current].content}
      </div>
      <ToastContainer />
    </>
  );
}
