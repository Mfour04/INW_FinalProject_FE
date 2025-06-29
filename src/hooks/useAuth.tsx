import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext/AuthProvider'

export const useAuth = () => {
  return useContext(AuthContext)
}
