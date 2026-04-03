'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get('http://localhost:5000/api/analytics/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setData(res.data.data)
    }
    fetch()
  }, [])

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}