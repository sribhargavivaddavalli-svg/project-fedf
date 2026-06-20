import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg';

function HomePage() {
  const navigate = useNavigate();
  const services = [
    'Certificates', 'Revenue & Land Records', 'Social Welfare Schemes',
    'Education System', 'Utility & Bill Payments', 'Commercial & Trade Services',
    'Agriculture Services', 'Transport & RTO Services', 'Health Services',
    'Police & Legal Services', 'Employment & Labor', 'Housing & Urban Department',
    'Minority & Backward Classes', 'Digital Infrastructure Services', 'Tourism & Culture'
  ];

  return (
    <>
      <section className="container">
        <img src={logo} alt="SevaTrack Logo" />
        <h1>SevaTrack - Meeseva Citizen Registration Portal</h1>
        <h4><i>“Track. Stay Updated. Never Miss a Service.”</i></h4>
        <button className="explore-services" onClick={() => navigate('/services')}>
          Explore Services
        </button>
      </section>

      <section className="services-section">
        <h2>Our Services</h2>
        <div className="Main_Services">
          {services.map((svc, idx) => (
            <div className="Service" key={idx}>{svc}</div>
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;