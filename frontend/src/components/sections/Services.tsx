'use client'
import { motion } from 'framer-motion'

const services = [
  {
    icon: '🚀',
    title: 'Web Development',
    description: 'Full-stack web applications using React, Next.js, Node.js, and modern technologies. Scalable, performant, and beautiful.',
    features: ['Frontend Development', 'Backend APIs', 'Database Design', 'Cloud Deployment'],
  },
  {
    icon: '🤖',
    title: 'AI Integration',
    description: 'Intelligent automation, LLM integration, and agentic AI systems that transform your business processes.',
    features: ['LLM Integration', 'Workflow Automation', 'AI Agents', 'NLP Solutions'],
  },
  {
    icon: '📱',
    title: 'Mobile Development',
    description: 'Cross-platform mobile applications using React Native and Flutter. Native performance with web efficiency.',
    features: ['React Native', 'Flutter', 'iOS & Android', 'Mobile UI/UX'],
  },
  {
    icon: '☁️',
    title: 'Cloud Architecture',
    description: 'Scalable cloud infrastructure on AWS and GCP. DevOps, CI/CD, and containerization expertise.',
    features: ['AWS/GCP', 'Docker & K8s', 'CI/CD Pipelines', 'Infrastructure as Code'],
  },
  {
    icon: '🎨',
    title: 'UI/UX Design',
    description: 'Modern, user-centric design with glassmorphism, animations, and intuitive interfaces that convert.',
    features: ['UI Design', 'UX Research', 'Prototyping', 'Design Systems'],
  },
  {
    icon: '🔒',
    title: 'API Development',
    description: 'RESTful and GraphQL APIs with proper authentication, rate limiting, and comprehensive documentation.',
    features: ['REST APIs', 'GraphQL', 'Authentication', 'API Documentation'],
  },
]

export default function Services() {
  return (
    <section id="services" className="py-32 px-6 md:px-12 relative z-10">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            My <span className="text-[var(--accent)]">Services</span>
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            Comprehensive solutions tailored to your needs, from concept to deployment
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[var(--accent)]/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,229,255,0.15)]"
              data-cursor-hover
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-[var(--accent)] transition-colors">
                {service.title}
              </h3>
              <p className="text-[var(--muted)] mb-6 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}