import { NavBar } from "../components/NavBar";
import { Upload, Input, Button, Form } from "antd";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { uploadFile } from "../firebase";
import { v4 } from "uuid";

const { TextArea } = Input;

export function InsertProducts() {
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [ubication, setUbication] = useState("");
  const [detail, setDetail] = useState("");
  const [result, setResult] = useState("");
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "productos"));
    const productsData = [];
    querySnapshot.forEach((doc) => {
      productsData.push({ id: doc.id, ...doc.data() });
    });
    setProducts(productsData);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleImageChange = (e) => {
    setImageUrl(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await uploadFile(imageUrl);
      console.log(result);
      setResult(result);
      const docRef = await addDoc(collection(db, "productos"), {
        imagen: result,
        name: name,
        precio: parseFloat(price),
        cantidad: 1,
        ubicacion: ubication,
        detalle: detail,
      });
      console.log("Documento creado con ID:", docRef.id);
      fetchProducts();
      setImageUrl(null);
      setPrice("");
      setName("");
      setUbication("");
      setDetail("");
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.error(error);
      alert("Fallo interno, intente más tarde");
    }
  };
  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, "productos", productId));
      fetchProducts();
      console.log("Producto eliminado:", productId);
    } catch (error) {
      console.error(error);
      alert("Fallo interno, intente más tarde");
    }
  };

  const handleEdit = async (productId, name, price) => {
    try {
      const updatedName = prompt("Ingrese el nuevo nombre:", name);
      const updatedPrice = parseFloat(
        prompt("Ingrese el nuevo precio:", price)
      );

      if (updatedName && updatedPrice) {
        await updateDoc(doc(db, "productos", productId), {
          name: updatedName,
          precio: updatedPrice,
        });
        fetchProducts();
        console.log("Producto actualizado:", productId);
      }
    } catch (error) {
      console.error(error);
      alert("Fallo interno, intente más tarde");
    }
  };

  return (
    <>
      <h2 className=" my-10 text-black text-4xl  font-bold text-center">
        INGRESO DE PRODUCTOS
      </h2>

      <div className="w-full justify-center items-center top-2 shadow-md rounded px-8 text-center">
        <form>
          <h1 className="">Ingrese un Producto</h1>
          <input
            type="file"
            name="image"
            ref={fileInputRef} // Asociar la referencia al campo de entrada de tipo archivo
            onChange={handleImageChange}
          />
        </form>
        <br />
        <label className="">Precio : </label>
        <Input
          type="number"
          className="my-3 "
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder=" $$$"
        />
        <label className="">Nombre : </label>
        <Input
          className="my-3 "
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder=" Inserte el nombre"
        />
        <label className="">Ubicacion : </label>
        <Input
          className="my-3 "
          value={ubication}
          onChange={(e) => setUbication(e.target.value)}
          placeholder=" Describa su Ubicacion"
        />
        <label className="">Detalle :</label>
        <TextArea
          className="my-3"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder=" Inserte informacion de su producto"
        />

        <Button
          cla
          type="primary"
          className="my-3 bg-blue-500 "
          onClick={handleSubmit}
        >
          Guardar
        </Button>
      </div>

      <div className=" my-10 pr-3 w-full justify-center items-center top-2 shadow-md rounded px-8">
        <h2 className=" my-10 text-black text-4xl  font-bold text-center">
          INGRESO DE PRODUCTOS
        </h2>
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between py-2"
          >
            <div>
              <span className="">{product.name}</span>
              <span className=" ml-2">${product.precio}</span>
            </div>
            <div>
              <DeleteOutlined
                className="text-red-500 cursor-pointer"
                onClick={() => handleDelete(product.id)}
              />
              <EditOutlined
                className="text-blue-500 cursor-pointer ml-2"
                onClick={() =>
                  handleEdit(product.id, product.name, product.precio)
                }
              />
            </div>
          </div>
        ))}
      </div>

      <NavBar />
    </>
  );
}
