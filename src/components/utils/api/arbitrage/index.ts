import {AXIOS} from '../baseAxios'
export default class ArbitrageApi {
  getArbitrage(data: any) {
    return AXIOS.post(`api/arbitrage`, data)
      .then(response => {
        return response.data
      })
      .catch(e => ({errors: e.response.data}))
  }
}
