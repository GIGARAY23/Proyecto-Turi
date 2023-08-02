import React from "react";
import ReactDOM from "react-dom";

const PayButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
export default function PayPal() {
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: "0.01" } }],
    });
  };
  const onApprove = (data, actions) => {
    return actions.order.capture();
  };
  return (
    <>
      <PayButton
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)}
      />
    </>
  );
}
