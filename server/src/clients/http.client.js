import axios from "axios"

const  createHttpClient = (config ={}) => {
    return axios.create({
  timeout: 5000,
  headers: {
    Accept: "application/vnd.github+json",
  },
  ...config
})
}

export default createHttpClient