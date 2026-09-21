import { useDispatch } from "react-redux";
import AppRouter from "./routes/AppRouter";
import { useEffect } from "react";
import { fetchProfileThunk } from "./store/authSlice";
import { refreshAccessToken, setAccessToken } from "./api/apiInstance";

function App() {
  const dispatch = useDispatch()
  useEffect(()=>{
    const  intializeAuth = async()=>{
      try {
        const token = await refreshAccessToken()
        setAccessToken(token)
        dispatch(fetchProfileThunk())
      } catch (error) {
        
      }
    }
    intializeAuth()
  },[dispatch])
  return <AppRouter />;
}

export default App;