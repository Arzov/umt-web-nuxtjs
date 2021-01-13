// FUNCIONES
// function authValidation (app, route, store, redirect) {
//   // Ruta actual
//   const currentPath = route.name

//   // Rutas
//   const path = {
//     home_path: process.env.routes.home.path,
//     start: process.env.routes.start.name,
//     start_path: process.env.routes.start.path,
//     login: process.env.routes.login.name,
//     register: process.env.routes.register.name,
//     required_attributes: process.env.routes.required_attributes.name,
//     required_attributes_path: process.env.routes.required_attributes.path,
//     required_filters: process.env.routes.required_filters.name,
//     required_filters_path: process.env.routes.required_filters.path,
//     email_verification: process.env.routes.email_verification.name,
//     recover_password: process.env.routes.recover_password.name,
//     reset_password: process.env.routes.reset_password.name
//   }

//   // Obtener sesion actual
//   app.$AWS.Auth.currentSession()
//     // Sesion iniciada
//     .then((data) => {
//       // Si se encuentra en Star enviar a Home
//       if (
//         currentPath === path.start ||
//         currentPath === path.login ||
//         currentPath === path.register ||
//         currentPath === path.verification ||
//         currentPath === path.recover_password ||
//         currentPath === path.reset_password
//       ) {
//         // Obtener datos del usuario
//         store.dispatch('user/fetchUserData', data)

//       // Esta dentro de la app
//       } else {
//         // Datos del usuario
//         const userData = store.getters['user/userData']

//         /**
//          * Revisar atributos obligatorios (fecha de nacimiento y sexo)
//          */

//         // No existen atributos
//         if (userData.birthdate === ' ' || userData.gender === ' ') {
//           // Si no esta en la vista RequiredAttributes entonces redireccionar
//           if (currentPath !== path.required_attributes)
//             redirect(path.required_attributes_path)

//         // Los atributos existen y esta en RequiredAttr entonces ir a Home
//         } else if (currentPath === path.required_attributes)
//           redirect(path.home_path)

//         /**
//          * Revisar filtros obligatorios (tramo de edad, tipo de match y sexo)
//          */

//         // No existen filtros
//         if (!userData.matchFilter || !userData.genderFilter || !userData.ageMinFilter || !userData.ageMaxFilter) {
//           // Reenviar a RequiredFilters siempre y cuando no se este en la vista de filtros o atributos
//           if (currentPath !== path.required_filters && currentPath !== path.required_attributes)
//             redirect(path.required_filters_path)

//         // Los filtros existen y esta en RequiredFilters entonces ir a Home
//         } else if (currentPath === path.required_filters)
//           redirect(path.home_path)
//       }
//     })

//     // No hay sesion
//     .catch(function (err) {
//       // eslint-disable-next-line no-console
//       console.log(err)

//       // Si se encuentra en la app entonces enviar a Start
//       if (
//         currentPath !== path.start &&
//         currentPath !== path.login &&
//         currentPath !== path.register &&
//         currentPath !== path.recover_password &&
//         currentPath !== path.reset_password
//       ) {
//         // Datos del usuario
//         const userData = store.getters['user/userData']

//         // Si el usuario no necesita verificar su email entonces enviar a Start
//         if (userData.verified || currentPath !== path.email_verification) {
//           redirect(path.start_path)
//         }
//       }
//     })
// }
// import { Hub } from '@aws-amplify/core'

export default function ({ app }) {
  app.$AWS.Hub.listen('auth', ({ payload: { event, data } }) => {
    switch (event) {
      case 'signIn':
        /* console.log('inicio') */
        // authValidation(app, route, store, redirect)
        break
      case 'signOut':
        // store.dispatch('user/resetStates')
        break
    }
  })

  // authValidation(app, route, store, redirect)
}
