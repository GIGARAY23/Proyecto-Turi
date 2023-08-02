import React, { useContext, useEffect } from "react";
import { TotalContext } from "./context/TotalContext";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ReactDOM from "react-dom";

export function MakePayment() {
  const navigate = useNavigate();
  const { totalPay } = useContext(TotalContext);
  const uuid = uuidv4();

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: totalPay } }],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture();
  };

  const sendRequest = async (transaccion, client) => {
    const url = "https://pay.payphonetodoesposible.com/api/button/V2/Confirm";
    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const container = document.getElementById("pp-button");
    container.innerHTML = "";

    window.payphone
      .Button({
        token:
          "W8bT22gWpCrZx6Nh8V5NffGwry9wvOBFnQIv8RTSNVULviJfKSjQmKyqNqbqPcj34j8NzZQOT6DbOHfCvej1ECSeZPMzr0CFvbri2FEsh_akpw6sjYYdY9aMxw4IGFG4Lo4igVWjye2zJvpK-pkqpK21r6969o7bxULyqBLjdBEJvqvM4kuKKM92a2UY9XivsLLuJn_7VIs55Gy8Pp4Yks_EFTdcoIY8wyZsmveG1DMWYdCCzm40r_n3-OdhcXasb7yeeS363MrKkp_QI_8OEe5kdu9JFGzL4pywDVinnk1vMeycb3vjeIY2don0Hwu-An-7ilqTy-f1uQ2AwUkJCLFo0_w",
        btnHorizontal: true,
        btnCard: true,
        createOrder: (actions) => {
          return actions
            .prepare({
              amount: totalPay * 100,
              amountWithoutTax: totalPay * 100,
              currency: "USD",
              clientTransactionId: uuid,
              lang: "es",
            })
            .then((paramlog) => {
              return paramlog;
            })
            .catch((paramlog2) => {
              if (paramlog2.errors[0].message === "Amount") {
                alert("Monto invalido");
                navigate("/products");
              }

              return paramlog2;
            });
        },
        onComplete: (model, actions) => {
          const transaccion = model.data.id;
          const client = model.data.clientTransactionId;
          console.log("model ", model);
          alert("model ", model);
          console.log("actions ", actions);
          alert("model ", model);
          sendRequest(transaccion, client);
          alert(sendRequest());
        },
      })
      .render("#pp-button");
  }, [totalPay]);

  return (
    <>
      <div className="bg-gray-200 w-full min-h-screen flex justify-center items-center">
        <div className="w-[700px] p-2 bg-white rounded-xl">
          <h1 className="my-3 flex justify-center item text-4xl  font-bold text-center">
            MÉTODO DE PAGO
          </h1>
          <h4 className=" flex justify-center item text-2xl  font-bold text-center">
            SU VALOR A PAGAR ES DE
            <h1 className="text-red-600 ml-4">${totalPay}</h1>
          </h4>
          <br />
          <div className="ml-4 " id="pp-button"></div>
        </div>
      </div>
    </>
  );
}
