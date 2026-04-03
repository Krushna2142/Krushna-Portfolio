'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([])

  const token = typeof window !== 'undefined' && localStorage.getItem('token')

  const fetchSkills = async () => {
    const res = await axios.get('http://localhost:5000/api/skills/admin', {
      headers: { Authorization: `Bearer ${token}` },
    })
    setSkills(res.data.data)
  }

  useEffect(() => { fetchSkills() }, [])

  const deleteSkill = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/skills/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchSkills()
  }

  return (
    <div>
      <h1>Skills</h1>
      {skills.map((s: any) => (
        <div key={s._id}>
          {s.name} - {s.category}
          <button onClick={() => deleteSkill(s._id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}