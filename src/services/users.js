export default httpClient => ({
  getProfile: async () => {
    const response = await httpClient.get('/users/2')
    const { data } = response.data

    return {
      data
    }
  },
  updateProfile: async (user) => {
    const { first_name, last_name, email } = user
    const response = await httpClient.put('/users/2', {
      first_name, last_name, email
    })

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
