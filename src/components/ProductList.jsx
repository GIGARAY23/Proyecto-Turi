import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const ProductList = ({
  allProducts,
  setAllProducts,
  countProducts,
  setCountProducts,
  total,
  setTotal,
}) => {
  const [data, setData] = useState([]);

  const onAddProduct = (product) => {
    if (allProducts.find((item) => item.id === product.id)) {
      const products = allProducts.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setTotal(total + product.price * product.quantity);
      setCountProducts(countProducts + product.quantity);
      return setAllProducts([...products]);
    }

    setTotal(total + product.price * product.quantity);
    setCountProducts(countProducts + product.quantity);
    setAllProducts([...allProducts, product]);
  };

  useEffect(() => {
    const obtenerProductos = async () => {
      const productosRef = collection(db, "productos");
      const productosSnapshot = await getDocs(productosRef);

      const data = [];

      productosSnapshot.forEach((doc) => {
        const firestoreData = doc.data();

        const producto = {
          id: doc.id,
          img: firestoreData.imagen,
          nameProduct: firestoreData.name,
          price: firestoreData.precio,
          quantity: firestoreData.cantidad,
        };

        data.push(producto);
      });

      setData(data);
    };

    obtenerProductos();
  }, []);

  return (
    <>
      <div className="container-items">
        {data.map((product) => (
          <div className="item" key={product.id}>
            <figure>
              <img src={product.img} alt={product.nameProduct} />
            </figure>
            <div className="info-product">
              <h2>{product.nameProduct}</h2>
              <p className="price">${product.price}</p>
              <button onClick={() => onAddProduct(product)}>
                Añadir al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
