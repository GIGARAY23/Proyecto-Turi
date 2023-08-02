import { Layout, Menu, Spin } from "antd";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

import {
  HomeOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  AppstoreAddOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";

export function NavBar() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("home");
  const onClick = (e) => {
    setCurrent(e.key);
  };
  const { user, logout, loading } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const obtainState = async () => {
      const q = query(
        collection(db, "RegistrosTuri"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const state = doc.data().state;
        setCurrent(state === "admin" ? "insertproducts" : "home");
      });
    };
    obtainState();
  }, []);
  const func = (e) => {
    navigate("/");
  };
  const func3 = (e) => {
    navigate("/products");
  };
  const func4 = (e) => {
    navigate("/insertproducts");
  };
  const func5 = (e) => {
    navigate("/savehome");
  };

  const items = [
    {
      key: "home",
      icon: <HomeOutlined />,
      onClick: func,
    },
    {
      key: "savehome",
      icon: <EditOutlined />,
      label: "Add",
      onClick: func5,
      style: { display: current === "insertproducts" ? "block" : "none" },
    },
    {
      key: "products",
      icon: <AppstoreOutlined />,
      label: "Productos",
      onClick: func3,
    },
    {
      key: "insertproducts",
      icon: <AppstoreAddOutlined />,
      label: "+ Productos",
      onClick: func4,
      style: { display: current === "insertproducts" ? "block" : "none" },
    },
    {
      key: "closed",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesion",
      onClick: handleLogout,
    },
  ];

  if (loading) return <Spin size="large" className="absolute justify-center" />;
  return (
    <>
      <Layout className="fixed w-full top-0 text-sm bg-gray-300/80 justify-between">
        <h6 className="text-center">{user.displayName || user.email}</h6>
      </Layout>

      <Layout className="fixed bottom-0 w-full ">
        <Menu
          className="text-black bg-blue-300/80 justify-between"
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        ></Menu>
      </Layout>
    </>
  );
}
