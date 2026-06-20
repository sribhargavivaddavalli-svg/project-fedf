import React, { useEffect } from 'react';

function AboutPage() {
  // Replicate the FAQ toggle and intersection observer from original script
  useEffect(() => {
    // FAQ toggles
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', function() {
          faqItems.forEach(other => {
            if (other !== item && other.classList.contains('open')) {
              other.classList.remove('open');
            }
          });
          item.classList.toggle('open');
        });
      }
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.mv-card, .problem-card, .step-card, .stat-item, .badge').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="about-hero">
        <h1>About SevaTrack</h1>
        <p>Making Government Services Accessible to Every Citizen</p>
      </section>

      <section className="about-content">
        <div className="intro-text">
          <p>SevaTrack started as a small initiative to help citizens track their Meeseva applications without visiting government offices repeatedly. Today, we serve thousands of citizens across the state.</p>
        </div>

        <div className="mission-vision-grid">
          <div className="mv-card">
            <div className="mv-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>Deliver every government service with transparency and real-time tracking. No queues, no middlemen.</p>
          </div>
          <div className="mv-card">
            <div className="mv-icon">👁️</div>
            <h3>Our Vision</h3>
            <p>A digitally empowered India where every citizen can access certificates and schemes from their phone.</p>
          </div>
        </div>

        <div className="highlight-card">
          <h3>📌 What is SevaTrack?</h3>
          <p>We're a simple tracking layer on top of Meeseva. We don't replace government systems — we just make them easier to use with status updates, reminders, and a clean dashboard.</p>
        </div>

        <h2 className="section-title">Problems We Solve</h2>
        <div className="problems-grid">
          <div className="problem-card"><div className="problem-icon">❓</div><strong>"Where is my application?"</strong><p>Live tracking with officer remarks at every stage.</p></div>
          <div className="problem-card"><div className="problem-icon">⏰</div><strong>"Missed renewal deadlines"</strong><p>SMS/Email reminders 15, 7, and 3 days before expiry.</p></div>
          <div className="problem-card"><div className="problem-icon">🧾</div><strong>"Lost my receipt"</strong><p>All applications and receipts stored in your digital dashboard.</p></div>
          <div className="problem-card"><div className="problem-icon">📑</div><strong>"Don't know what documents to submit"</strong><p>Clear checklist and sample uploads for every service.</p></div>
        </div>

        <h2 className="section-title">What We Cover</h2>
        <div className="services-tags">
          {['📄 Certificates','🏞️ Land Records','🤝 Welfare Schemes','🎓 Education','💡 Bill Payments','🚗 RTO Services','🏥 Health Services','⚖️ Police & Legal','👷 Employment','🌾 Agriculture','🏘️ Housing','🕌 Minority Welfare'].map(tag => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>

        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          {[{num:1,title:'Sign Up',desc:'Create account with mobile number'},{num:2,title:'Apply',desc:'Select service and upload documents'},{num:3,title:'Track',desc:'Get real-time status updates'},{num:4,title:'Receive',desc:'Get certificate delivered to your door'}].map(step => (
            <div className="step-card" key={step.num}>
              <div className="step-number">{step.num}</div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="stats-section">
          <div className="stat-item"><div className="stat-number">50,000+</div><div className="stat-label">Happy Citizens</div></div>
          <div className="stat-item"><div className="stat-number">98%</div><div className="stat-label">On-Time Delivery</div></div>
          <div className="stat-item"><div className="stat-number">3.5 Days</div><div className="stat-label">Average Turnaround</div></div>
        </div>

        <div className="trust-badges">
          {['🔒 Secure','⏱️ 24/7 Support','📱 Mobile Friendly','💰 No Hidden Fees','⭐ 4.8 Rating','🏛️ Govt Authorized'].map(b => (
            <div className="badge" key={b}><span className="badge-icon">{b.split(' ')[0]}</span><span>{b.split(' ').slice(1).join(' ')}</span></div>
          ))}
        </div>

        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-container">
          {[
            { q: 'Is SevaTrack free to use?', a: 'Yes! Registration and tracking are completely free. You only pay the government service fee, same as at Meeseva centers.' },
            { q: 'Do I need to visit a government office?', a: 'Most services are fully online. For biometric verification, we\'ll guide you to the nearest center.' },
            { q: 'What if my application gets rejected?', a: 'We\'ll show you the exact reason and allow free resubmission within 7 days.' },
            { q: 'Is my data secure?', a: 'Absolutely. We use government APIs and never store your biometric data. All information is encrypted.' }
          ].map((faq, idx) => (
            <div className="faq-item" key={idx}>
              <div className="faq-question">{faq.q} <span className="faq-toggle">+</span></div>
              <div className="faq-answer">{faq.a}</div>
            </div>
          ))}
        </div>

        <div className="cta-section">
          <h3>Ready to get started?</h3>
          <p>Join thousands of citizens who trust SevaTrack</p>
          <a href="/register" className="cta-button">Register Now →</a>
        </div>
      </section>
    </>
  );
}

export default AboutPage;