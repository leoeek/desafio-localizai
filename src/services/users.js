export default httpClient => ({
  getProfile: async () => {
    const response = await httpClient.get('/users/2')
    const { data } = response.data

    return {
      data
    }
  },
  updateProfile: async (user) => {
    if (user.password.length === 0) {
      delete (user.password)
    }
    const response = await httpClient.put('/users/2', user)

    let errors = null
    if (!response.data) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      }
    }

    return {
      data: response.data,
      errors
    }
  }
})
