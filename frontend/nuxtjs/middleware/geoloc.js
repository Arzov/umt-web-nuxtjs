export default ({ app, store }) => {
  const userState = store.getters['user/get']
  const globalState = store.getters['global/allowGeoloc']

  if ('geolocation' in navigator) {
    if (globalState.allowGeoloc) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const moveDistance = app.$UTILS.getDistance(
          position.coords.latitude,
          position.coords.longitude,
          userState.coords.LAT.N,
          userState.coords.LON.N
        )

        if (moveDistance >= 5) {
          const params = {
            api: 'umt',
            email: userState.email,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            genderFilter: userState.genderFilter,
            matchFilter: userState.matchFilter,
            ageMinFilter: userState.ageMinFilter,
            ageMaxFilter: userState.ageMaxFilter,
            positions: userState.positions,
            skills: userState.skills,
            foot: userState.foot,
            weight: userState.weight,
            height: userState.height
          }

          store.dispatch('user/update', params)
        }
      }, function (err) {
        const params = {
          allowGeoloc: false
        }

        switch (err.code) {
          case err.PERMISSION_DENIED:
            // TODO: Mostrar popup para que el usuario configure la ubicacion
            store.dispatch('global/setGeoloc', params)
            break

          default:
            // TODO: Error desconocido
            console.log('¡Error desconocido!')
            break
        }
      })
    }
  } else {
    // TODO: Deberia desplegarse el popup de que no es posible usar la app
    console.log('La geolocalozacion no esta disponible en el dispositivo!')
  }
}
