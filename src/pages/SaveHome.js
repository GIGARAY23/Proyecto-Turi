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
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { uploadFile } from "../firebase";

export function SaveHome() {
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [comentario, setComentario] = useState("");
  const [result, setResult] = useState("");
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "home"));
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
      const docRef = await addDoc(collection(db, "home"), {
        imagen: result,
        title: title,
        comentario: comentario,
      });
      console.log("Documento creado con ID:", docRef.id);
      fetchProducts();
      setImageUrl(null);
      setTitle("");
      setComentario("");
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
      await deleteDoc(doc(db, "home", productId));
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
        await updateDoc(doc(db, "home", productId), {
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
        INGRESO DE HOME
      </h2>

      <div className="w-full justify-center items-center top-2 shadow-md rounded px-8 text-center">
        <form>
          <h1 className="">Ingrese una Imagen</h1>
          <input
            type="file"
            name="image"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </form>
        <br />
        <label className="">Titulo : </label>
        <Input
          type="text"
          className="my-3 "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder=" Ingrese un título para su información"
        />
        <label className="">Comentario : </label>
        <Input
          className="my-3 "
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder=" Ingrese un comentario para su información"
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
          MI HOME
        </h2>
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between py-2"
          >
            <div>
              <span className="">{product.title}</span>
              <br />
              <span className=" ml-2 cursor-pointer ml-2 mx-2">
                {product.comentario}
              </span>
            </div>
            <div>
              <DeleteOutlined
                className="text-red-500 cursor-pointer mx-2"
                onClick={() => handleDelete(product.id)}
              />
              <EditOutlined
                className="text-blue-500 cursor-pointer ml-2 mx-2"
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
