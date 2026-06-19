'use client'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="relative z-10 py-12 px-6 md:px-12 border-t border-white/10 backdrop-blur-xl bg-black/40">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="text-2xl font-bold mb-2">
              Krushna <span className="text-[var(--accent)]">Pokharkar</span>
            </h3>
            <p className="text-[var(--muted)] text-sm">
              Full-Stack Developer & AI Engineer
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex gap-6"
          >
            {['Home', 'About', 'Services', 'Work', 'Skills', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors text-sm"
              >
                {item}
              </a>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] text-sm"
          >
            © {new Date().getFullYear()} All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  )
}