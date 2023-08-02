import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function PayphoneButton() {
  const navigate = useNavigate();
  const uuid = uuidv4();
  const sendRequest = async (transaccion, client) => {
    const url = ` https://pay.payphonetodoesposible.com/api/button/V2/Confirm `;

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.payphone
      .Button({
        token:
          "W8bT22gWpCrZx6Nh8V5NffGwry9wvOBFnQIv8RTSNVULviJfKSjQmKyqNqbqPcj34j8NzZQOT6DbOHfCvej1ECSeZPMzr0CFvbri2FEsh_akpw6sjYYdY9aMxw4IGFG4Lo4igVWjye2zJvpK-pkqpK21r6969o7bxULyqBLjdBEJvqvM4kuKKM92a2UY9XivsLLuJn_7VIs55Gy8Pp4Yks_EFTdcoIY8wyZsmveG1DMWYdCCzm40r_n3-OdhcXasb7yeeS363MrKkp_QI_8OEe5kdu9JFGzL4pywDVinnk1vMeycb3vjeIY2don0Hwu-An-7ilqTy-f1uQ2AwUkJCLFo0_w",
        btnHorizontal: true,
        btnCard: true,
        createOrder: (actions) => {
          return actions
            .prepare({
              amount: 100,
              amountWithoutTax: 100,
              currency: "USD",
              clientTransactionId: uuid,
              lang: "es",
            })
            .then((paramlog) => {
              console.log("PREPARE > ", paramlog);
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
          console.log("actions ", actions);
          sendRequest(transaccion, client);
        },
      })
      .render("#pp-button");
  }, []);

  return <div id="pp-button"></div>  ;
}
