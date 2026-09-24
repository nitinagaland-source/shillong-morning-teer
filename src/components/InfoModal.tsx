import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Info, Mail, Send, CheckCircle2 } from 'lucide-react';

interface InfoModalProps {
  type: 'about' | 'terms' | 'privacy' | 'contact' | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  const [formSent, setFormSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  if (!type) return null;

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#48c9c0] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-[#48c9c0] to-[#48c9c0] border-b border-[#48c9c0]">
          <div className="flex items-center gap-2.5">
            {type === 'about' && <Info className="w-5 h-5 text-[#48c9c0]" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-[#48c9c0]" />}
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-[#48c9c0]" />}
            {type === 'contact' && <Mail className="w-5 h-5 text-[#48c9c0]" />}
            <h3 className="font-extrabold text-[#48c9c0] text-lg">
              {type === 'about' && 'About Us'}
              {type === 'terms' && 'Terms & Conditions'}
              {type === 'privacy' && 'Privacy Policy'}
              {type === 'contact' && 'Contact Us'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-[#48c9c0] hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-sm leading-relaxed">
          {type === 'about' && (
            <div className="space-y-3">
              <p>
                Welcome to <strong>Shillong Morning Teer</strong>, the leading informational portal dedicated to providing accurate, real-time results and analytics for traditional archery sports in Meghalaya.
              </p>
              <h4 className="font-bold text-[#48c9c0] text-base pt-2">Our Mission</h4>
              <p>
                Our mission is to bring transparency, speed, and cultural appreciation to traditional Khasi archery games. Every morning, skilled archers shoot designated rounds in Shillong, and our reporters verify and deliver the official arrow hit counts directly to you.
              </p>
              <h4 className="font-bold text-[#48c9c0] text-base pt-2">Heritage &amp; Culture</h4>
              <p>
                Teer is rooted in centuries-old traditions of the Khasi community. We celebrate this indigenous sport and provide responsible numerical statistics and community updates.
              </p>
            </div>
          )}

          {type === 'terms' && (
            <div className="space-y-3">
              <p>
                By accessing and using <strong>Shillong Morning Teer</strong>, you agree to comply with and be bound by the following terms and conditions.
              </p>
              <h4 className="font-bold text-[#48c9c0] text-base pt-2">Informational Purposes Only</h4>
              <p>
                All data, including daily common numbers, dream numbers, formulas, and historical archives, are published strictly for informational, educational, and cultural preservation purposes.
              </p>
              <h4 className="font-bold text-[#48c9c0] text-base pt-2">No Financial Guarantees</h4>
              <p>
                Common numbers are calculated using mathematical models and historical frequencies. We make no representations or warranties regarding predictive certainty. We encourage all visitors to act responsibly.
              </p>
              <h4 className="font-bold text-[#48c9c0] text-base pt-2">Legal Age &amp; Jurisdiction</h4>
              <p>
                Users must ensure that viewing or participating in local archery clubs aligns with the regulations and age requirements of their respective state or region.
              </p>
            </div>
          )}

          {type === 'privacy' && (
            <div className="space-y-3">
              <p>
                Your privacy is paramount to us. This Privacy Policy details how we handle user data on our platform.
              </p>
              <h4 className="font-bold text-[#48c9c0] text-base pt-2">Information Collection</h4>
              <p>
                We do not collect personal identification information unless voluntarily submitted via our contact forms. Non-identifiable analytics (such as browser type and session timestamps) are used solely to optimize website speed.
              </p>
              <h4 className="font-bold text-[#48c9c0] text-base pt-2">Cookies &amp; Local Cache</h4>
              <p>
                We use lightweight browser storage to remember your display preferences and ensure fast loading of daily archery scores without unnecessary server pings.
              </p>
              <h4 className="font-bold text-[#48c9c0] text-base pt-2">Data Security</h4>
              <p>
                We implement robust security standards to safeguard our infrastructure and protect visitors against unauthorized interception.
              </p>
            </div>
          )}

          {type === 'contact' && (
            <div>
              {formSent ? (
                <div className="py-8 flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#b8e8e3] flex items-center justify-center text-[#48c9c0]">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-[#48c9c0] text-base">Message Sent Successfully!</h4>
                  <p className="text-xs text-slate-600">
                    Thank you for reaching out. Our support team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Have questions about Shillong Morning Teer results, schedules, or historical records? Send us a message below:
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-[#48c9c0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-[#48c9c0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Message</label>
                    <textarea
                      required
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="How can we help you today?"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-[#48c9c0] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#48c9c0] hover:bg-[#48c9c0] text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                  <div className="pt-2 text-[11px] text-slate-500 text-center">
                    Direct Email: <span className="font-semibold text-slate-700">support@shillongmorningteer.com</span>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



