import React, { useState } from "react";
import { AuthProvider } from "./context/authContext.js";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoutes.js";
import { Login } from "./pages/Login.js";
import { Home } from "./components/Home";
import { Products } from "./pages/Products.js";
import { InsertProducts } from "./pages/InsertProducts";
import { MakePayment } from "./MakePayment.js";
import { Register } from "./components/Register";
import { TotalProvider } from "./context/TotalContext.jsx";
import PayPal from "./components/PayPal.jsx";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";
import { Spin } from "antd";
import { SaveHome } from "./pages/SaveHome.js";

function App() {
  const [usert, setUsert] = useState(null);

  const handleUserChange = (user, loading) => {
    if (user === null) {
      if (loading)
        return <Spin size="large" className="absolute justify-center" />;
    } else {
      // Realiza la consulta a Firestore
      const registrosRef = collection(db, "RegistrosTuri");
      const queryByEmail = query(
        registrosRef,
        where("email", "==", user.email)
      );

      getDocs(queryByEmail)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const email = data.email;
            const burner = data.state;
            console.log(burner);
            setUsert({
              correo: email,
              permissions: [burner],
            });
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  };
  const data = {
    correo: usert?.correo || "",
    permissions: usert?.permissions || [],
  };
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoute isAllowed={!!data} />}>
            <Route path="/" element={<Home />} />
            <Route path="/paypal" element={<PayPal />} />
            <Route
              path="/make"
              element={
                <TotalProvider>
                  <MakePayment />
                </TotalProvider>
              }
            />
            <Route
              path="/products"
              element={
                <TotalProvider>
                  <Products />
                </TotalProvider>
              }
            />
          </Route>

          <Route
            path="/insertproducts"
            element={
              <ProtectedRoute
                onUserChange={handleUserChange}
                isAllowed={data.permissions.includes("admin")}
              >
                <InsertProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/savehome"
            element={
              <ProtectedRoute
                onUserChange={handleUserChange}
                isAllowed={data.permissions.includes("admin")}
              >
                <SaveHome />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </>
  );
}
export default App;
