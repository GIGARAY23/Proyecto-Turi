// import { getFirestore, collection, getDocs } from "firebase/firestore";
// const db = getFirestore();

// // Crea una función asincrónica para obtener los datos de Firestore
// async function obtenerProductos() {
//   const productosRef = collection(db, "productos");
//   const productosSnapshot = await getDocs(productosRef);

//   const data = [];

//   productosSnapshot.forEach((doc) => {
//     const firestoreData = doc.data();

//     // Extrae los campos específicos de Firestore y crea un nuevo objeto
//     const producto = {
//       id: doc.id,
//       img: firestoreData.imagen,
//       nameProduct: firestoreData.name,
//       price: firestoreData.precio,
//       quantity: firestoreData.cantidad,
//     };

//     data.push(producto);
//   });

//   return data;
// }
// export { obtenerProductos as data };
// // Función principal para ejecutar y mostrar los datos
// async function ejecutarYMostrarDatos() {
//   try {
//     // Obtén los productos de Firestore
//     const productos = await obtenerProductos();

//     // Muestra los productos en la consola
//     console.log(productos);
//   } catch (error) {
//     console.error("Error al obtener los productos:", error);
//   }
// }

// // Ejecuta la función principal
// ejecutarYMostrarDatos();

// export const data = [
//   {
//     id: 1,
//     img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//     nameProduct: "Zapatos Nike",
//     price: 80,
//     quantity: 1,
//   },
//   {
//     id: 2,
//     img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//     nameProduct: "Zapatos Nike",
//     price: 80,
//     quantity: 1,
//   },
// ];
