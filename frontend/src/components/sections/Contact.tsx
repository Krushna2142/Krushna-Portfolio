'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { portfolioApi } from '@/lib/api'
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const CONTACT_INFO = [
  { label: 'Email', value: 'krushnapokharkar4@gmail.com', color: '#00f5ff' },
  { label: 'Phone', value: '+91 7410796292', color: '#bf00ff' },
  { label: 'Location', value: 'Pune, Maharashtra 🇮🇳', color: '#00ff88' },
  { label: 'College', value: "AISSMS Polytechnic '26", color: '#ff0080' },
]
const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/krushnapokharkar2142",
    icon: FaLinkedin,
  },
  {
    label: "Email",
    href: "mailto:krushnapokharkar4@gmail.com",
    icon: MdEmail,
  },
  {
    label: "GitHub",
    href: "https://github.com/krushna2142",
    icon: FaGithub,
  },
];

export default function Contact() {
  const [sending, setSending] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setSending(true)
    try {
      await portfolioApi.sendContact(data)
      toast.success("Message sent! I'll reply within 24 hours.")
      reset()
    } catch {
      toast.error('Failed to send. Email me directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="section-padding relative">
      {/* Ambient */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at bottom right, rgba(255,0,128,0.05), transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-12">
          <p className="section-eyebrow text-[var(--neon-pink)]">// 05. LET&apos;S BUILD TOGETHER</p>
          <h2 className="section-title">
            <span className="text-white">Get In </span>
            <span className="neon-text-pink">Touch</span>
          </h2>
          <p className="section-subtitle">
            Open to SDE internships, AI research collabs, and freelance projects.
            Response guaranteed within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* Info column */}
          <div className="lg:col-span-2 space-y-3">
            {CONTACT_INFO.map(({ label, value, color }) => (
              <div
                key={label}
                className="flex items-center gap-4 hover:-translate-y-0.5 transition-transform duration-300"
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  backdropFilter: 'blur(16px)',
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${color}14`,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                <div
                  className="flex-shrink-0 w-2 h-2 rounded-full"
                  style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                />
                <div className="min-w-0">
                  <p className="font-mono text-[0.62rem] text-white/22 mb-0.5 tracking-widest uppercase">{label}</p>
                  <p className="font-mono text-[0.8rem] text-white/60 truncate leading-relaxed">{value}</p>
                </div>
              </div>
            ))}

            {/* Socials */}
            <div className="flex gap-2.5">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="group flex items-center justify-center text-white/40 hover:text-[var(--neon-cyan)] transition-all duration-300"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backdropFilter: "blur(12px)",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Icon
                    size={18}
                    className="transition-all duration-300 group-hover:scale-110"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-3 glass-card-elevated"
            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[0.62rem] text-white/30 tracking-widest uppercase block">
                  Your Name
                </label>
                <input
                  {...register('name', { required: true })}
                  placeholder="John Doe"
                  className={`input-field ${errors.name ? 'border-[rgba(255,0,128,0.4)]' : ''}`}
                />
                {errors.name && (
                  <p className="font-mono text-[0.65rem] text-[var(--neon-pink)]">Required</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[0.62rem] text-white/30 tracking-widest uppercase block">
                  Email
                </label>
                <input
                  {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                  placeholder="your@email.com"
                  className={`input-field ${errors.email ? 'border-[rgba(255,0,128,0.4)]' : ''}`}
                />
                {errors.email && (
                  <p className="font-mono text-[0.65rem] text-[var(--neon-pink)]">Valid email required</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[0.62rem] text-white/30 tracking-widest uppercase block">
                Subject
              </label>
              <input
                {...register('subject', { required: true })}
                placeholder="Project proposal / Internship / Collaboration"
                className={`input-field ${errors.subject ? 'border-[rgba(255,0,128,0.4)]' : ''}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[0.62rem] text-white/30 tracking-widest uppercase block">
                Message
              </label>
              <textarea
                {...register('message', { required: true, minLength: 20 })}
                placeholder="Tell me about your project or opportunity..."
                rows={6}
                className={`input-field resize-none ${errors.message ? 'border-[rgba(255,0,128,0.4)]' : ''}`}
                style={{ lineHeight: 1.75 }}
              />
              {errors.message && (
                <p className="font-mono text-[0.65rem] text-[var(--neon-pink)]">Min 20 characters required</p>
              )}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="btn-primary justify-center"
              style={{
                paddingTop: '0.875rem',
                paddingBottom: '0.875rem',
                opacity: sending ? 0.5 : 1,
                cursor: sending ? 'not-allowed' : 'pointer',
              }}
            >
              {sending ? '> Sending...' : '> Send Message →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}