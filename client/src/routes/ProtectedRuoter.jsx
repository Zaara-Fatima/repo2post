import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRuoter = () => {
  const {isAuthenticated, loading} = useSelector((state)=>state.auth)
 if(loading){
  return <div>Checking authentication ...</div>
 }if(!isAuthenticated){
  return <Navigate to="/login" replace/>
 }

 return <Outlet/>
}
