import App from "next/app";
import {FirebaseContext}  from "../firebase/index";
import firebase from "../firebase/index";
import useAutenticacion from "../hooks/useAutenticacion";
import "../public/static/css/app.css";

// console.log(FirebaseContext);
const MyApp = (props) => {
  const usuario = useAutenticacion();
  const { Component, pageProps } = props;
  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        usuario,
      }}
    >
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  );
};

export default MyApp;
