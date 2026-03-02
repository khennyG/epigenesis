import { motion } from 'framer-motion';

const CAMERA_PRESETS = [
  { id: 'default', label: 'Default' },
  { id: 'front', label: 'Front' },
  { id: 'top', label: 'Top' },
  { id: 'side', label: 'Side' },
];

export default function CameraControls({ 
  currentView, 
  onViewChange, 
  autoRotate, 
  onAutoRotateToggle,
  showLabels,
  onLabelsToggle 
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: 12,
      background: 'rgba(15, 23, 42, 0.9)',
      borderRadius: 12,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(129, 140, 248, 0.2)',
    }}>
      {/* View Presets */}
      <div style={{
        fontSize: 10,
        fontWeight: 600,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
      }}>
        Camera View
      </div>
      
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {CAMERA_PRESETS.map((preset) => (
          <motion.button
            key={preset.id}
            onClick={() => onViewChange(preset.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "'Sora', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: currentView === preset.id 
                ? 'rgba(129, 140, 248, 0.3)' 
                : 'rgba(30, 41, 59, 0.8)',
              color: currentView === preset.id ? '#a5b4fc' : '#94a3b8',
              transition: 'all 0.2s ease',
            }}
          >
            {preset.label}
          </motion.button>
        ))}
      </div>
      
      {/* Divider */}
      <div style={{
        height: 1,
        background: 'rgba(129, 140, 248, 0.1)',
        margin: '8px 0',
      }} />
      
      {/* Toggle Controls */}
      <div style={{ display: 'flex', gap: 8 }}>
        {/* Auto-rotate toggle */}
        <motion.button
          onClick={onAutoRotateToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 500,
            fontFamily: "'Sora', sans-serif",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: autoRotate 
              ? 'rgba(74, 222, 128, 0.2)' 
              : 'rgba(30, 41, 59, 0.8)',
            color: autoRotate ? '#4ade80' : '#94a3b8',
            transition: 'all 0.2s ease',
          }}
        >
          Auto Rotate
        </motion.button>
        
        {/* Labels toggle */}
        <motion.button
          onClick={onLabelsToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 500,
            fontFamily: "'Sora', sans-serif",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: showLabels 
              ? 'rgba(129, 140, 248, 0.2)' 
              : 'rgba(30, 41, 59, 0.8)',
            color: showLabels ? '#a5b4fc' : '#94a3b8',
            transition: 'all 0.2s ease',
          }}
        >
          Labels
        </motion.button>
      </div>
    </div>
  );
}
