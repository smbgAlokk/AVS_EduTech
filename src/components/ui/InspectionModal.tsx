import { useState, useEffect } from 'react';
import { 
  X, Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, 
  ShieldAlert, Users, TrendingUp, AlertCircle, FileText, CheckCircle2 
} from 'lucide-react';
import type { School } from '../../types';
import './InspectionModal.css';

interface InspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School | null;
}

export default function InspectionModal({ isOpen, onClose, school }: InspectionModalProps) {
  const [callState, setCallState] = useState<'calling' | 'connected'>('calling');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCallState('calling');
      // Simulate ringing for 3 seconds, then connect
      const timer = setTimeout(() => {
        setCallState('connected');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !school) return null;

  return (
    <div className="inspection-overlay" onClick={onClose}>
      <div className="inspection-container" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="inspection-header">
          <div className="inspection-school-info">
            <div className="inspection-status-pulse">
              <div className="pulse-ring"></div>
              <div className="pulse-dot"></div>
            </div>
            <div className="inspection-title">
              Surprise Inspection: {school.name}
            </div>
            <span className="inspection-subtitle">| Initiated by Super Admin</span>
          </div>
          <button className="inspection-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Main Video Area */}
          <div className="inspection-body">
            
            {callState === 'calling' ? (
              <div className="calling-state">
                <div className="calling-avatar">
                  {school.principal.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="calling-text">Connecting to {school.principal}...</div>
                <div className="calling-subtext">Initiating secure video link to {school.name}</div>
              </div>
            ) : (
              <>
                <div className="video-main">
                  <div className="video-overlay-text">
                    <div className="video-principal-name">{school.principal}</div>
                    <div className="video-principal-role">
                      <div className="stdb-status-dot" style={{ background: 'var(--success)' }}></div>
                      Principal, {school.name}
                    </div>
                  </div>
                </div>
                
                {/* Self View */}
                {!isVideoOff && <div className="video-self"></div>}
              </>
            )}

            {/* Call Controls */}
            <div className="inspection-controls">
              <button 
                className={`control-btn ${isMuted ? 'active' : ''}`} 
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button 
                className={`control-btn ${isVideoOff ? 'active' : ''}`} 
                onClick={() => setIsVideoOff(!isVideoOff)}
                title={isVideoOff ? "Start Video" : "Stop Video"}
              >
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>
              <button className="control-btn" title="Share Screen">
                <MonitorUp size={20} />
              </button>
              <button className="control-btn control-btn--danger" onClick={onClose} title="End Inspection">
                <PhoneOff size={20} />
              </button>
            </div>
          </div>

          {/* Side Panel for Live Stats */}
          {callState === 'connected' && (
            <div className="inspection-sidebar">
              
              <div className="sidebar-section">
                <h4>Live School Metrics</h4>
                <div className="stat-row">
                  <div className="stat-row-label"><Users size={16} /> Present Today</div>
                  <div className="stat-row-value">{Math.round(school.totalStudents * (school.attendanceRate / 100))} / {school.totalStudents}</div>
                </div>
                <div className="stat-row">
                  <div className="stat-row-label"><TrendingUp size={16} /> Attendance Rate</div>
                  <div className={`stat-row-value ${school.attendanceRate >= 90 ? 'good' : 'bad'}`}>
                    {school.attendanceRate}%
                  </div>
                </div>
                <div className="stat-row">
                  <div className="stat-row-label"><CheckCircle2 size={16} /> Fee Collection</div>
                  <div className="stat-row-value">{school.feeCollectionRate}%</div>
                </div>
              </div>

              <div className="sidebar-section">
                <h4>System Alerts</h4>
                <div className="action-list">
                  <div className="quick-action-btn" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <ShieldAlert size={18} color="var(--danger)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>Security Camera 4 Offline</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Main Gate • 10 mins ago</div>
                    </div>
                  </div>
                  <div className="quick-action-btn" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                    <AlertCircle size={18} color="var(--warning)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>Staff Absenteeism Spike</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>5 Teachers on leave today</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sidebar-section" style={{ marginTop: 'auto' }}>
                <h4>Admin Actions</h4>
                <div className="action-list">
                  <button className="quick-action-btn">
                    <FileText size={16} />
                    <span style={{ fontSize: '13px' }}>Issue Formal Notice</span>
                  </button>
                  <button className="quick-action-btn">
                    <TrendingUp size={16} />
                    <span style={{ fontSize: '13px' }}>Request Performance Audit</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
