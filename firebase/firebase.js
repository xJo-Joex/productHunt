import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import * as firebases from "firebase/app";
import app from "firebase/compat/app";
import storage from "firebase/compat/storage";
import {
  getFirestore,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./config";

class Firebase {
  constructor() {
    if (!app.apps.length) {
      app.initializeApp(firebaseConfig);
    }
    this.auth = getAuth();
    this.db = getFirestore();
    this.addDoc = addDoc;
    this.collection = collection;
    this.storage = app.storage();
    this.doc = doc;
    this.getDoc = getDoc;
    this.updateDoc = updateDoc;
    this.deleteDoc = deleteDoc;
    this.orderBy = orderBy;
    this.query = query;
  }
  //Registrar Usuario
  async registrar(nombre, email, password) {
    const nuevoUsuario = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return await updateProfile(nuevoUsuario.user, {
      displayName: nombre,
    });
  }
  //Iniciar Sesion
  async login(email, password) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  //Cerrar sesion del usuario
  async cerrarSesion() {
    await this.auth.signOut();
  }
}

const firebase = new Firebase();
export default firebase;
