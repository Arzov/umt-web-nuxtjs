export default function ({ app, route, store, redirect }) {
  const currentPath = route.name
  const userState = store.getters['user/getUser']

  app.$AWS.Auth.currentSession()
    .then(() => {
      // Revisar rutas si esta fuera de la app
      if (['start', 'register', 'email_verification', 'recover_password',
        'reset_password'].includes(currentPath)) {
        // Si email es null significa que se debe esperar que Amplify Hub
        // termine de resolver el evento 'signIn' para guardar los estados
        // del usuario en el store, por lo tanto, no se redirecciona a la vista
        // Home. Esto sólo ocurre en la vista Start y sólo cuando se inicia con
        // redes sociales.
        if (userState.email) { redirect('/home') }

      // Revisar campos obligatorios y opcionales
      // FIXME: Revisar error que arroja cuando redirecciona. Para replicar el error,
      //        se debe manualemente ir a la vista 'start' cuando se esta en, por ejemplo,
      //        'required_attributes' con una sesion activa.
      } else if (!userState.birthdate) {
        // Se redirecciona solo si no se esta en la pagina correspondiente.
        // Esta validacion va en este punto y no en el 'else if' padre ya que
        // si la condicion es falsa seguiria al siguiente 'else if' y necesitamos
        // que cuando sea falsa la condicion se quede en la vista.
        if (currentPath !== 'required_attributes') { redirect('/required_attributes') }
      } else if (!userState.weight) {
        // TODO: Descomentar cuando vista este lista
        // if (currentPath !== 'optional_attributes') { redirect('/optional_attributes') }
        console.log('enviar a optional_attributes')
      } else if (!userState.ageMinFilter) {
        if (currentPath !== 'optional_filters') { redirect('/optional_filters') }
      }
    })
    .catch(function () {
      // Redireccionar hacia Start solo si esta dentro de la app
      if (!['start', 'register', 'email_verification', 'recover_password',
        'reset_password', 'mobile'].includes(currentPath)
      ) {
        redirect('/start')
      }
    })
}
