import { TbCliente } from '../models';
import { TbClienteRepository } from '../repositories';


//#region Expresiones regulares


const regexsNombre_Apellido = /^[A-z]{1,60}$/

/*La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula.
NO puede tener otros símbolos. */
const regexPassword = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/

const regexsCorreo = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
//#endregion

class resultado {
  valido: boolean
  incidente: string
  constructor(valido: boolean, incidente: string) {
    this.valido = valido
    this.incidente = incidente
  }
}

async function No_Vacio(objeto: TbCliente): Promise<resultado> {
  var respuesta = new resultado(true, 'todo bien')

  if (!regexsNombre_Apellido.test(objeto.sNombre)) {
    //false
    return respuesta = new resultado(false, 'escriba un nombre de verdad')
  }
  if (!regexsNombre_Apellido.test(objeto.sApellido)) {
    //false
    return respuesta = new resultado(false, 'escriba un apellido de verdad')
  }
  if (!regexsCorreo.test(objeto.sCorreo)) {
    //false
    return respuesta = new resultado(false, 'escriba un correo real')
  }
  if (!regexPassword.test(objeto.sContrasena)) {
    //false
    return respuesta = new resultado(false, ' al menos un dígito, al menos una minúscula y al menos una mayúscula.NO puede tener otros símbolos')
  }
  var today: Date = new Date()
  var nacimiento = new Date(objeto.dNacimiento)

  if (!(today > nacimiento)) {
    //   alert ("Error!");
    return new resultado(false, '¿como le haces para haber nacido hoy y registrarte aqui?')
  }

  return respuesta;
}


async function checking(objeto: TbCliente): Promise<resultado> {

  var respuesta = new resultado(true, 'todo bien')


  respuesta = await No_Vacio(objeto);
  if (!respuesta.valido) {
    return respuesta;
  }



  return respuesta;
}


export = { isFine: checking };

