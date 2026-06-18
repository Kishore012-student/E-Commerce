import { useState, useEffect, useRef } from 'react'
import { FaTruck, FaHeadset, FaUndo, FaShieldAlt } from 'react-icons/fa'

const stats = [
  { label: 'Years in Business', value: 8, suffix: '+' },
  { label: 'Happy Customers', value: 50000, suffix: '+' },
  { label: 'Products', value: 15000, suffix: '+' },
  { label: 'Orders Delivered', value: 100000, suffix: '+' },
]

const team = [
  { name: 'Sarah Johnson', role: 'CEO & Founder', image: 'https://via.placeholder.com/200x200?text=SJ' },
  { name: 'Mike Chen', role: 'CTO', image: 'https://via.placeholder.com/200x200?text=MC' },
  { name: 'Emily Davis', role: 'Head of Design', image: 'https://via.placeholder.com/200x200?text=ED' },
  { name: 'Raj Patel', role: 'VP of Marketing', image: 'https://via.placeholder.com/200x200?text=RP' },
]

const features = [
  { icon: FaTruck, title: 'Free Shipping', desc: 'Free shipping on all orders above ₹499' },
  { icon: FaHeadset, title: '24/7 Support', desc: 'Round-the-clock customer support via chat and email' },
  { icon: FaUndo, title: 'Easy Returns', desc: '30-day hassle-free return policy' },
  { icon: FaShieldAlt, title: 'Secure Payment', desc: '100% secure payment with encryption' },
]

function Counter({ target, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const counted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const duration = 2000
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="display-4 fw-bold text-primary">
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

function AboutPage() {
  return (
    <div>
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">About ShopHub</h1>
          <p className="lead mb-0">Your trusted destination for quality products since 2018</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="fw-bold mb-3">Our Mission</h2>
              <p className="text-muted lead">
                At ShopHub, we believe everyone deserves access to high-quality products at affordable prices.
                Our mission is to provide a seamless shopping experience with a vast selection of products,
                competitive pricing, and exceptional customer service.
              </p>
              <p className="text-muted">
                Founded in 2018, we have grown from a small startup to one of the most trusted online
                marketplaces. We work directly with brands and manufacturers to ensure authenticity and
                quality in every product we sell.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://via.placeholder.com/600x400?text=About+ShopHub"
                alt="About ShopHub"
                className="img-fluid rounded-4 shadow"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">ShopHub by the Numbers</h2>
          <div className="row g-4">
            {stats.map((stat) => (
              <div key={stat.label} className="col-6 col-lg-3">
                <Counter target={stat.value} suffix={stat.suffix} />
                <p className="text-muted mt-2 mb-0 fw-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-5">Why Choose Us</h2>
          <div className="row g-4">
            {features.map((feature) => (
              <div key={feature.title} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100 text-center p-4">
                  <div className="mb-3">
                    <feature.icon size={40} className="text-primary" />
                  </div>
                  <h5 className="fw-bold">{feature.title}</h5>
                  <p className="text-muted mb-0">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-5">Meet Our Team</h2>
          <div className="row g-4">
            {team.map((member) => (
              <div key={member.name} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center p-4 h-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-circle mx-auto mb-3"
                    style={{ width: 120, height: 120, objectFit: 'cover' }}
                  />
                  <h5 className="fw-bold mb-1">{member.name}</h5>
                  <p className="text-muted mb-0">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
