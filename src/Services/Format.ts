import { TbCliente } from '../models';
import { TbClienteRepository } from '../repositories';
import { occur } from './Occur'

//#region Expresiones regulares


const regexsNombre_Apellido = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]{1,60}$/

/*La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula.
NO puede tener otros símbolos. */
const regexPassword = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/

const regexsMail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
//#endregion



async function No_Vacio(objeto: TbCliente): Promise<occur> {
  var respuesta = new occur(true, 'todo bien')

  if (!regexsNombre_Apellido.test(objeto.sNombre)) {
    //false
    return respuesta = new occur(false, 'escriba un nombre de verdad')
  }
  if (!regexsNombre_Apellido.test(objeto.sApellido)) {
    //false
    return respuesta = new occur(false, 'escriba un apellido de verdad')
  }
  if (!regexsMail.test(objeto.sCorreo)) {
    //false
    return respuesta = new occur(false, 'escriba un correo real')
  }
  if (!regexPassword.test(objeto.sContrasena)) {
    //false
    return respuesta = new occur(false, ' al menos un dígito, al menos una minúscula y al menos una mayúscula.NO puede tener otros símbolos')
  }
  var today: Date = new Date()
  var nacimiento = new Date(objeto.dNacimiento)

  if (!(today > nacimiento)) {
    //   alert ("Error!");
    return new occur(false, '¿como le haces para haber nacido hoy y registrarte aqui?')
  }

  return respuesta;
}


async function checking(objeto: TbCliente): Promise<occur> {

  var respuesta = new occur(true, 'todo bien')


  respuesta = await No_Vacio(objeto);
  if (!respuesta.valid) {
    return respuesta;
  }


  return respuesta;
}


export = { isFine: checking };

