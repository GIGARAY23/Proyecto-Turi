import { useState } from "react";
import { NavBar } from "./../components/NavBar";
import { Header } from "../components/Header";
import { ProductList } from "../components/ProductList";
import "../pages/Products.css";
export function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [countProducts, setCountProducts] = useState(0);
  return (
    <>
      <div>
        <Header
          allProducts={allProducts}
          setAllProducts={setAllProducts}
          total={total}
          setTotal={setTotal}
          countProducts={countProducts}
          setCountProducts={setCountProducts}
        />

        <ProductList
          allProducts={allProducts}
          setAllProducts={setAllProducts}
          total={total}
          setTotal={setTotal}
          countProducts={countProducts}
          setCountProducts={setCountProducts}
        />
      </div>

      <NavBar />
    </>
  );
}
