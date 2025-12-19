
import React, { useState, useEffect } from 'react';
import { Project, Client, ContactResponse, Subscription } from '../types';
import { storageService } from '../services/storageService';

const LandingPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    city: ''
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [notif, setNotif] = useState<string | null>(null);

  useEffect(() => {
    setProjects(storageService.getProjects());
    setClients(storageService.getClients());
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.fullName || !contactForm.email) return;

    const newContact: ContactResponse = {
      id: crypto.randomUUID(),
      ...contactForm,
      createdAt: new Date().toISOString()
    };

    storageService.saveContact(newContact);
    setContactForm({ fullName: '', email: '', mobile: '', city: '' });
    showNotification('Thank you! We will contact you soon.');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    const newSub: Subscription = {
      id: crypto.randomUUID(),
      email: newsletterEmail,
      createdAt: new Date().toISOString()
    };

    storageService.saveSubscription(newSub);
    setNewsletterEmail('');
    showNotification('Subscribed successfully!');
  };

  const showNotification = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {notif && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-bounce">
          {notif}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://picsum.photos/seed/bg/1600/900" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Consultation, Design, & <span className="text-indigo-400">Construction</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Providing expert management and high-end execution for your most ambitious projects. We build trust through quality.
          </p>
          <a href="#contact" className="bg-indigo-500 hover:bg-indigo-400 text-white px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl">
            Get a Free Quote
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <img src="https://picsum.photos/seed/const/700/500" alt="About Us" className="rounded-2xl shadow-2xl object-cover w-full h-[400px]" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 border-l-4 border-indigo-600 pl-4 uppercase tracking-widest text-sm">About Us</h2>
            <h3 className="text-4xl font-bold mb-6 text-slate-800">We Build Your Dreams Into Reality</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              With over 20 years of experience in the industry, we specialize in delivering projects that stand the test of time. From modern urban skyscrapers to cozy community centers, our commitment to excellence is unwavering.
            </p>
            <div className="flex gap-8">
              <div>
                <span className="block text-3xl font-bold text-indigo-600">200+</span>
                <span className="text-slate-500 text-sm">Completed Projects</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-indigo-600">150+</span>
                <span className="text-slate-500 text-sm">Happy Clients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Projects Section */}
      <section id="projects" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-2">Portfolio</h2>
            <h3 className="text-4xl font-bold text-slate-900">Our Projects</h3>
            <p className="text-slate-600 mt-4 max-w-xl mx-auto">Discover our recent works across various sectors from high-end residential to complex commercial hubs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map(project => (
              <div key={project.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                <div className="h-64 overflow-hidden relative">
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-white font-semibold">View Details</span>
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="text-2xl font-bold text-slate-800 mb-3">{project.name}</h4>
                  <p className="text-slate-600 mb-6 line-clamp-2">{project.description}</p>
                  <button className="text-indigo-600 font-bold hover:text-indigo-800 transition flex items-center gap-2">
                    Read More 
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Happy Clients Section */}
      <section id="clients" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-2">Testimonials</h2>
            <h3 className="text-4xl font-bold text-slate-900">Happy Clients</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clients.map(client => (
              <div key={client.id} className="bg-slate-50 p-8 rounded-2xl relative border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <img src={client.image} alt={client.name} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" />
                  <div>
                    <h4 className="font-bold text-slate-900">{client.name}</h4>
                    <p className="text-indigo-600 text-sm">{client.designation}</p>
                  </div>
                </div>
                <p className="text-slate-600 italic leading-relaxed">"{client.description}"</p>
                <div className="absolute top-8 right-8 text-indigo-200 opacity-50">
                   <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8v8h6v-8h-6zM20 8v8h6v-8h-6zM10 18h6v8h-6v-8zM20 18h6v8h-6v-8z"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4">Get In Touch</h2>
              <h3 className="text-5xl font-bold mb-8">Let's Talk About Your Next Project</h3>
              <p className="text-slate-400 text-lg mb-12">
                Have a question or a project in mind? Our team of experts is ready to assist you in every phase of development.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div>
                    <span className="block text-sm text-slate-400 uppercase tracking-widest font-semibold">Phone</span>
                    <span className="text-xl">+1 (555) 000-0000</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <span className="block text-sm text-slate-400 uppercase tracking-widest font-semibold">Email</span>
                    <span className="text-xl">hello@promanage.com</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <form onSubmit={handleContactSubmit} className="bg-white p-10 rounded-3xl shadow-2xl text-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      value={contactForm.fullName}
                      onChange={e => setContactForm({...contactForm, fullName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="john@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      value={contactForm.email}
                      onChange={e => setContactForm({...contactForm, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Mobile Number</label>
                    <input 
                      type="tel" 
                      placeholder="+1 234 567 890"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      value={contactForm.mobile}
                      onChange={e => setContactForm({...contactForm, mobile: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">City</label>
                    <input 
                      type="text" 
                      placeholder="New York"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      value={contactForm.city}
                      onChange={e => setContactForm({...contactForm, city: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.02] active:scale-95"
                >
                  Submit Details
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-indigo-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to our newsletter</h2>
          <p className="text-indigo-100 mb-10 max-w-xl mx-auto">Get the latest updates on our projects and industry insights delivered straight to your inbox.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              required
              placeholder="Your email address"
              className="flex-1 bg-white rounded-xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-slate-900 text-white font-bold px-10 py-4 rounded-xl hover:bg-slate-800 transition shadow-xl"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">ProManage</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2024 ProManage Services. All rights reserved. Built with precision.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition">LinkedIn</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
