import React, { useState } from 'react'
import { api } from '../api/apiInstance'
import { RepositoryResult } from '../components/RepositoryResult'

export const Dashboard = () => {
  const [url, setUrl]= useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [error, setError] = useState("")

  const handleSubmit = async(e)=>{
    e.preventDefault()
    if (!url.trim()) {
    setError("GitHub URL is required");
    return;
}
    setError("")
    setLoading(true)

    try {
      const response = await api.post("/repositories/analyze",{ url})
      console.log("REPOSITORY:", response.data);
      setData(response.data.repo)
      console.log("API RESPONSE:", response);

    } catch (error) {
      setError(error.response?.data?.message || "Github Calling Failed")
    }finally{
      setLoading(false)
    }
  }
  return (
    <div>
      <h1>Dashboard</h1>

      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input name='text'
        placeholder='url'
        type='text'
        value={url}
        onChange={(e)=>setUrl(e.target.value)}/>
        <button type='submit' disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Repository"}
        </button>
       

      </form>
      {data.name && <RepositoryResult repository={data}/>}
      </div>
  )
}
