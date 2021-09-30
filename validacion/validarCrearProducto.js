export default function validarCrearProducto(valores) {
  let errores = {};

  //validar el nombre del usuario
  if (!valores.nombre) {
    errores.nombre = "El nombre es obligatorio";
  }
  //validar la empresa
  if (!valores.empresa) {
    errores.empresa = "La empresa es obligatoria";
  }
  //validar url
  if (!valores.url) {
    errores.url = "La URL del producot es obligatoria";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "URL con el formato incorrecto o no valida";
  }
  //validar descripcion
  if (!valores.descripcion) {
    errores.descripcion = "Agrega una descripcion de tu producto";
  }
  return errores;
}
