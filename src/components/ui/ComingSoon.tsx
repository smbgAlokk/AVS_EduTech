import { Construction } from 'lucide-react';
import './ComingSoon.css';

interface ComingSoonProps {
  title: string;
  subtitle?: string;
}

export default function ComingSoon({ title, subtitle }: ComingSoonProps) {
  return (
    <div className="coming-soon">
      <div className="coming-soon-icon">
        <Construction size={48} />
      </div>
      <h2 className="coming-soon-title">{title}</h2>
      <p className="coming-soon-subtitle">{subtitle || 'This module is under development. Check back soon!'}</p>
      <div className="coming-soon-dots">
        <span className="dot dot--1" />
        <span className="dot dot--2" />
        <span className="dot dot--3" />
      </div>
    </div>
  );
}
