import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Form, Input, Button } from "antd";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const { Item } = Form;

export const Register = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [error, setError] = useState("");

  const onFinish = (values) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      password,
      confirmPassword,
    } = values;

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const { user } = userCredential;
        const { uid } = user;

        const registroData = {
          id: "",
          firstName,
          lastName,
          email,
          phone,
          location,
          state: "invitado",
        };

        addDoc(collection(db, "RegistrosTuri"), registroData)
          .then((docRef) => {
            updateDoc(doc(db, "RegistrosTuri", docRef.id), {
              id: docRef.id,
            });

            console.log("Registro exitoso");
            console.log("ID del documento guardado:", docRef.id);

            navigate("/");
          })
          .catch((error) => {
            setError("Error al guardar los datos en Firestore");
            console.error(error);
          });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <>
      <Form
        onFinish={onFinish}
        className="max-w-[400px] w-full mx-auto  p-8 px-8 rounded-lg justify-center items-center"
      >
        <h2 className=" text-black text-4xl  font-bold text-center">
          REGISTRO
        </h2>
        <br />
        <Item
          label={<h2 className="">Nombre</h2>}
          name="firstName"
          rules={[{ required: true, message: "Por favor ingresa tu nombre" }]}
        >
          <Input className="border-black" />
        </Item>

        <Item
          label={<h2 className="">Apellido</h2>}
          name="lastName"
          rules={[{ required: true, message: "Por favor ingresa tu apellido" }]}
        >
          <Input className="border-black" />
        </Item>

        <Item
          label={<h2 className="">Correo Electronico</h2>}
          name="email"
          rules={[
            {
              required: true,
              message: "Por favor ingresa tu correo electrónico",
            },
          ]}
        >
          <Input type="email" className="border-black" />
        </Item>

        <Item label={<h2 className="">Numero de Telefono</h2>} name="phone">
          <Input type="number" className="border-black" />
        </Item>

        <Item label={<h2 className="">Ubicacion</h2>} name="location">
          <Input className="border-black" />
        </Item>

        <Item
          label={<h2 className="">Contraseña</h2>}
          name="password"
          rules={[
            { required: true, message: "Por favor ingresa tu contraseña" },
          ]}
        >
          <Input.Password className="border-black" />
        </Item>

        <Item
          label={<h2 className="">Verificar Contraseña</h2>}
          name="confirmPassword"
          rules={[
            { required: true, message: "Por favor confirma tu contraseña" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Las contraseñas no coinciden")
                );
              },
            }),
          ]}
        >
          <Input.Password className="border-black" />
        </Item>

        {error && <p>{error}</p>}

        <Item className=" items-center text-center text-black ">
          <Button
            type=" primary"
            htmlType="submit"
            className="text-center bg-blue-500/50 text-black w-full my-5 py-2  shadow-lg shadow-blue-500/50 hover:shadow-blue-500/40 font-semibold rounded-lg"
          >
            Registrarte
          </Button>
          <Link to="/login">
            <Button className="text-black  ml-3  " type="ghost">
              Ya tengo una cuenta
            </Button>
          </Link>
        </Item>
      </Form>
    </>
  );
};
