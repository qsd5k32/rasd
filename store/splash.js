export const state = () => ({
  splashScreen: true,
})
export const getters = {
  getData(state) {
    return state.splashScreen
  },
}
export const mutations = {
  hideSplashScreen (state, status = false) {
    state.splashScreen = false
  }
}
export const actions = {
  hideSplashScreen(store,example_id)
  {
    store.commit('hideSplashScreen',false)
  }
}
