import React, { useState, useEffect, useContext } from "react";
import { doc, onSnapshot, getDocs, collection } from "firebase/firestore";

import { FirebaseContext } from "../firebase/index";
import { getAuth } from "@firebase/auth";

const useProductos = (orden) => {
  const [productos, guardarProductos] = useState([]);
  const { firebase } = useContext(FirebaseContext);
  useEffect(() => {
    const obtenerProductos = async () => {
      const q = await firebase.query(
        collection(firebase.db, "productos"),
        firebase.orderBy(orden, "desc")
      );
      const querySnapshot = await getDocs(q);

      manejadorSnapshot(querySnapshot);
    };
    obtenerProductos();
  }, []);
  function manejadorSnapshot(snapShot) {
    const productos = snapShot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    guardarProductos(productos);
    // console.log(productos);
  }
  return { productos };
};

export default useProductos;
