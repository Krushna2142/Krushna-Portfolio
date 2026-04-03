'use client'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      })

      localStorage.setItem('token', res.data.data.token)
      router.push('/admin/dashboard')
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 bg-black/40 rounded-xl">
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  )
}