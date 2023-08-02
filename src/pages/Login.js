import { useState } from "react";
import { useAuth } from "../context/authContext";
import { Form, Button, Input } from "antd";
import { useNavigate,Link } from "react-router-dom";
import { Alert } from "../components/Alert";
import { GoogleOutlined } from "@ant-design/icons";
import ecuador from "../img/ecuador.jpg";

export function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { login, loginwithGoogle } = useAuth();
  const navegate = useNavigate();
  const [error, setError] = useState();
  const handleChange = ({ target: { name, value } }) =>
    setUser({ ...user, [name]: value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(user.email, user.password);
      navegate("/");
    } catch (error) {
      switch (error.code) {
        case "auth/internal-error":
          setError("Correo Invalido");
          break;
        case "auth/wrong-password":
          setError("Contraseña Equivocada");
          break;
        case "auth/invalid-email":
          setError("Correo Invalido");
          break;
        case "auth/missing-password":
          setError("Contraseña Faltante");
          break;
        case "auth/user-not-found":
          setError("Correo no Registrado");
          break;
        default:
          console.log(error.code);
          break;
      }
    }
  };
  const handleGoogleSignin = async () => {
    try {
      await loginwithGoogle();
      navegate("/");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full  ">
      <div className="hidden sm:block">
        <img
          className="w-full h-full object-cover"
          src={ecuador}
          alt="no bale"
        />
      </div>

      <div className=" flex flex-col  justify-center">
        {error && <Alert message={error} />}
        <Form
          onSubmit={handleSubmit}
          className="max-w[400px] w-full mx-auto  p-8 px-8 rounded-lg"
        >
          <h2 className="  text-4xl  font-bold text-center">INGRESO</h2>
          <div className="flex flex-col  py-2">
            <label htmlFor="email">Correo Electrónico : </label>
            <Input
              className=" text-black rounded-lg  mt-2 p-2 border-black  focus:outline-none "
              type="email"
              name="email"
              placeholder=" tucorreo@compañia.dominio"
              onChange={handleChange}
            ></Input>
          </div>

          <div className="flex flex-col  py-2">
            <label htmlFor="password">Contraseña : </label>
            <Input
              className=" text-black p-2 rounded-lg  mt-2  border-black  focus:outline-none"
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              placeholder=" ******"
            ></Input>
          </div>

          <Button
            type="primary"
            onClick={handleSubmit}
            className="text-center bg-blue-500/50 text-black w-full my-5 py-2  shadow-lg shadow-blue-500/50 hover:shadow-blue-500/40 font-semibold rounded-lg"
          >
            Iniciar Sesión
          </Button>
          <Link to="/register">
          <Button className="text-black    " type="ghost">
            Aun no tengo una cuenta
          </Button>
        </Link>
        </Form>
      </div>
    </div>
  );
}
