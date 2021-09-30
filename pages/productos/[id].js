import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { FirebaseContext } from "../../firebase/index";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import Error404 from "../../components/layout/404";
import Layout from "../../components/layout/Layout";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = (props) => {
  //state del componente
  const [producto, guardarProducto] = useState({});
  const [error, guardarError] = useState(false);
  const [comentario, guardarComentario] = useState({ mensaje: "" });
  const [consultarDB, guardarConsultarDB] = useState(true);

  //Routing para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  //constext de firebase
  const { firebase, usuario } = useContext(FirebaseContext);
  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.doc(firebase.db, "productos", id);
        const producto = await firebase.getDoc(productoQuery);

        if (producto.exists()) {
          guardarProducto(producto.data());
          guardarConsultarDB(false);
        } else {
          // doc.data() will be undefined in this case
          guardarError(true);
          console.log("No such document!");
        }
      };

      obtenerProducto();
    }
  }, [id]);
  if (Object.keys(producto).length === 0 && !error) return "Cargando....";
  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    haVotado,
  } = producto;

  const votarProducto = async () => {
    if (!usuario) {
      return router.push("./login");
    }
    //obtener y sumar nuevo voto
    const nuevoTotal = votos + 1;
    //verificar si el usuario actual ha votado
    if (haVotado.includes(usuario.uid)) return;

    //guardar el id del usuario que ha votado
    const nuevoHaVotado = [...haVotado, usuario.uid];
    //Actualizar en la base de datos
    const refDoc = await firebase.doc(firebase.db, "productos", id);
    firebase.updateDoc(refDoc, { votos: nuevoTotal, haVotado: nuevoHaVotado });

    //Actualizar el state
    guardarProducto({
      ...producto,
      votos: nuevoTotal,
    });

    guardarConsultarDB(true); //hay un voto por lo tanto consultar a la base de datos
  };

  //funciones para crear comentarios
  const comentarioChange = (e) => {
    guardarComentario({ ...comentario, [e.target.name]: e.target.value });
  };
  //identifica si el comentario es el creador del producto
  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    }
  };

  const agregarComentario = async (e) => {
    e.preventDefault();
    if (!usuario) {
      return router.push("./login");
    }
    //Informacion extra al comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    //tomar copia de ocmentario y agregarlos al arreglo
    const nuevosComentarios = [...comentarios, comentario];

    //Acutalizar la BD
    const refDoc = await firebase.doc(firebase.db, "productos", id);
    firebase.updateDoc(refDoc, { comentarios: nuevosComentarios });
    //Actualizar el state
    guardarProducto({ ...producto, comentarios: nuevosComentarios });
    guardarComentario({ mensaje: "" });

    guardarConsultarDB(true); //hay un comentario por lo tanto consultar a la base de datos
  };

  //funcion que revisa que el creador del producto sea el mismo que esta autenticado

  const puedeBorrar = () => {
    if (!usuario) return false;
    if (creador.id === usuario.uid) {
      return true;
    }
  };
  //elimina producto

  const eliminarProducto = async () => {
    if (!usuario) {
      return router.push("./login");
    }
    if (creador.id === usuario.uid) {
      return router.push("./login");
    }
    try {
      const refDoc = await firebase.doc(firebase.db, "productos", id);
      firebase.deleteDoc(refDoc);
      return router.push("./");
    } catch (error) {
      console.log("hubo un error" + error);
    }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div className="contenedor">
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>
            <ContenedorProducto>
              <div>
                <p>
                  Publicado hace:{" "}
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p>
                  Por: {creador.nombre} de {empresa}
                </p>

                <img src={urlimagen} alt={nombre} />
                <p>{descripcion}</p>
                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          type="text"
                          name="mensaje"
                          onChange={(e) => comentarioChange(e)}
                          value={comentario.mensaje}
                        />
                      </Campo>
                      <InputSubmit type="submit" value="Agregar Comentario" />
                    </form>
                  </>
                )}
                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  {" "}
                  Comentarios
                </h2>
                {comentarios.length === 0 ? (
                  "Aun no hay comentarios"
                ) : (
                  <ul>
                    {comentarios.map((comentario, index) => (
                      <li
                        css={css`
                          border: 1px solid #e1e1d1;
                          padding: 2rem;
                        `}
                        key={`${comentario.usuarioId}-${index}`}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>
                          Escrito por:
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {" "}
                            {comentario.usuarioNombre}
                          </span>
                        </p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>Es creador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <aside>
                <Boton target="_blank" bgColor="true" href={url}>
                  {" "}
                  Visitar Url
                </Boton>
                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                >
                  <p
                    css={css`
                      text-align: center;
                    `}
                  >
                    {votos} Votos
                  </p>
                  {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
                </div>
              </aside>
            </ContenedorProducto>

            {puedeBorrar() && (
              <Boton onClick={eliminarProducto}>Eliminar producto</Boton>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
