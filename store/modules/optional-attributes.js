const actions = {
  save (ctx, data) {
    // Si las posiciones vienen vacias, dejar como null ya que dynamodb no permite array vacio '[]'
    // TODO: Revisar este comportamiento desde backend (mejorar)
    const positions = data.positions.length ? data.positions : null
    const params = {
      height: data.height,
      weight: data.weight,
      foot: data.foot,
      positions
    }
    // TODO: Revisar si los commit son asincronos y decidir si hay que esperarlos o no
    ctx.commit('user/setState', { params }, { root: true })
    this.$router.push('/optional_filters')
  }
}

export default {
  namespaced: true,
  actions
}
