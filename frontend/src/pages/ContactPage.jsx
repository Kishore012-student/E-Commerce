import { useState } from 'react'
import { toast } from 'react-toastify'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'
import Breadcrumb from '../components/Breadcrumb'

const contactInfo = [
  { icon: FaMapMarkerAlt, label: 'Address', value: '123 Business Park, MG Road, Bangalore - 560001, India' },
  { icon: FaPhone, label: 'Phone', value: '+91 1800-123-4567' },
  { icon: FaEnvelope, label: 'Email', value: 'support@shophub.com' },
  {
    icon: FaClock,
    label: 'Business Hours',
    value: 'Mon - Sat: 9:00 AM - 9:00 PM\nSunday: 10:00 AM - 6:00 PM',
  },
]

const socialLinks = [
  { icon: FaFacebook, url: '#', color: '#1877F2', label: 'Facebook' },
  { icon: FaTwitter, url: '#', color: '#1DA1F2', label: 'Twitter' },
  { icon: FaInstagram, url: '#', color: '#E4405F', label: 'Instagram' },
  { icon: FaYoutube, url: '#', color: '#FF0000', label: 'YouTube' },
]

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    setTimeout(() => {
      toast.success('Thank you! Your message has been sent successfully.')
      setForm({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="container py-4">
      <Breadcrumb items={[{ name: 'Home', link: '/' }, { name: 'Contact Us' }]} />

      <h2 className="fw-bold mb-4">Contact Us</h2>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Get in Touch</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium">Message</label>
                    <textarea
                      name="message"
                      className="form-control"
                      rows="5"
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="d-flex flex-column gap-3">
            {contactInfo.map((item) => (
              <div key={item.label} className="card border-0 shadow-sm">
                <div className="card-body d-flex align-items-start gap-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                    <item.icon size={22} className="text-primary" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">{item.label}</h6>
                    {item.value.split('\n').map((line, i) => (
                      <p key={i} className="text-muted mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Follow Us</h6>
              <div className="d-flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    className="d-inline-flex align-items-center justify-content-center rounded-circle text-white"
                    style={{ width: 40, height: 40, backgroundColor: link.color }}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <link.icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 card border-0 shadow-sm">
            <div className="card-body p-0 overflow-hidden rounded-3" style={{ height: 200 }}>
              <iframe
                title="Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.905318961973!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
