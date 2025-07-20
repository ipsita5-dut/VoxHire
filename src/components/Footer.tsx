import { Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-6 ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        
        {/* Branding */}
        <div>
          <h2 className="text-white text-xl font-semibold">AI-Interview</h2>
          <p className="text-sm mt-1">
            © {new Date().getFullYear()} AI-Interview. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex gap-6 text-md">
          <a href="/" className="hover:text-white transition">Home</a>
          <a href="/about" className="hover:text-white transition">About</a>
          <a href="/auth?mode=signup" className="hover:text-white transition">Dashboard</a>
          <a href="/auth?mode=signin" className="hover:text-white transition">Resume</a>
        </div>

        {/* Contact or Social */}
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition"><Twitter size={20} />Twitter</a>
          <a href="#" className="hover:text-white transition"><Linkedin size={20} />LinkedIn</a>
          <a href="#" className="hover:text-white transition"><Mail size={20} />Email</a>
        </div>
      </div>
    </footer>
  );
}