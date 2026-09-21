import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/apiInstance'

export const Register = () => {

    const navigate = useNavigate()

    const [formData, setFormData]= useState({
        name:"",
        email:"",
        password:""
    })

    const [error, setError] =useState("")

    const [loading, setLoading] = useState(false)

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError("")
        setLoading(true)
        try {
            await api.post("/auth/register",formData)
            navigate("/login")
        } catch (error) {
            setError(
                error.response?.data?.message || "Registration failed"
            )
        }finally{
            setLoading(false)
        }
    }

  return (
    <div>
        <h1>Create Account</h1>
        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
            <input type='text' name='name'
            placeholder='Name'
            value={formData.name}
            onChange={handleChange}
             />
            <input type='email' name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
             />
            <input type='password' name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
             />

            <button type='submit' disabled={loading}>
                {loading?"Creating...":"Register"}
            </button>
        </form>

        <button onClick={()=>navigate("/login")}>
            Already have an account? Login
        </button>
    </div>
  )
}
