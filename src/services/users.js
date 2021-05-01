export default httpClient => ({
  getProfile: async () => {
    const response = await httpClient.get('/users/2')
    const { data } = response.data

    return {
      data
    }
  }
})
