import React, { useEffect, useState } from "react";
import firebase from "../firebase/firebase";

function useAutenticacion() {
  const [usuarioAutenticado, guarrdarUsuarioAutenticado] = useState(null);

  useEffect(() => {
    const unsuscribe = firebase.auth.onAuthStateChanged((usuario) => {
      if (usuario) {
        guarrdarUsuarioAutenticado(usuario);
      } else {
        guarrdarUsuarioAutenticado(null);
      }
    });
    return () => unsuscribe();
  },[]);

  return usuarioAutenticado;
}

export default useAutenticacion;
