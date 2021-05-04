export default httpClient => ({
  accountCreate: async ({ name, lastName, email, password }) => {
    const response = await httpClient.post('/users', {
      name,
      lastName,
      email,
      password
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
  },
  login: async ({ email, password }) => {
    const response = await httpClient.post('/login', {
      email,
      password
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
