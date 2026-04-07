import { Zap } from 'lucide-react';

export default function MobileHeader() {
  return (
    <header className="mobile-header">
      <div className="mobile-header-logo">
        <Zap size={22} color="white" fill="white" />
      </div>
      <span className="mobile-header-title">HABITUATOR</span>
    </header>
  );
}
