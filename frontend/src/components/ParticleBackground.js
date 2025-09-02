const ParticleBackground = () => {


  return (
    <div 
      id="particles"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
        zIndex: -1,
        overflow: 'hidden'
      }}
    >
      {/* Floating musical notes */}
      <div className="musical-notes">
        {[...Array(20)].map((_, i) => {
          // Create more random positioning
          const randomX = Math.sin(i * 3.7) * 40 + Math.cos(i * 2.3) * 20 + 50
          const randomY = Math.cos(i * 4.1) * 30 + Math.sin(i * 1.8) * 25 + 40
          const randomSize = 16 + Math.abs(Math.sin(i * 2.1)) * 12
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                fontSize: `${randomSize}px`,
                color: `rgba(99, 102, 241, ${0.12 + (Math.abs(Math.sin(i * 1.5)) * 0.15)})`,
                animation: `musicFloat${(i % 8) + 1} ${6 + Math.abs(Math.cos(i * 2.2)) * 4}s ease-in-out infinite`,
                left: `${Math.max(5, Math.min(90, randomX))}%`,
                top: `${Math.max(5, Math.min(80, randomY))}%`,
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(99, 102, 241, 0.3)',
                animationDelay: `${i * 0.8}s`
              }}
            >
              {['♪', '♫', '♬', '♩', '♭', '♯', '𝄞', '𝄢'][i % 8]}
            </div>
          )
        })}
      </div>

      {/* Animated waveform visualization */}
      <div className="waveform">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: '8%',
              left: `${10 + i * 3.2}%`,
              width: '3px',
              height: `${25 + Math.sin(i * 0.8) * 20}px`,
              background: `linear-gradient(to top, 
                rgba(99, 102, 241, ${0.4 + (i % 3) * 0.1}), 
                rgba(139, 92, 246, ${0.3 + (i % 2) * 0.1})
              )`,
              animation: `waveform${(i % 3) + 1} ${1.5 + (i % 4) * 0.3}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.08}s`,
              borderRadius: '2px',
              boxShadow: '0 0 8px rgba(99, 102, 241, 0.3)'
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes musicFloat1 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.4; }
          25% { transform: translateY(-35px) rotate(60deg) scale(1.2); opacity: 0.8; }
          50% { transform: translateY(-10px) rotate(120deg) scale(0.8); opacity: 0.5; }
          75% { transform: translateY(-45px) rotate(180deg) scale(1.3); opacity: 0.9; }
        }

        @keyframes musicFloat2 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.3; }
          33% { transform: translateY(-25px) rotate(-75deg) scale(0.9); opacity: 0.7; }
          66% { transform: translateY(-40px) rotate(-150deg) scale(1.4); opacity: 0.8; }
        }

        @keyframes musicFloat3 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.5; }
          20% { transform: translateY(-20px) rotate(45deg) scale(1.1); opacity: 0.6; }
          40% { transform: translateY(-35px) rotate(90deg) scale(0.7); opacity: 0.9; }
          60% { transform: translateY(-15px) rotate(135deg) scale(1.2); opacity: 0.4; }
          80% { transform: translateY(-50px) rotate(180deg) scale(0.9); opacity: 0.8; }
        }

        @keyframes musicFloat4 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.4; }
          30% { transform: translateY(-30px) rotate(-90deg) scale(1.3); opacity: 0.7; }
          70% { transform: translateY(-20px) rotate(-180deg) scale(0.8); opacity: 0.9; }
        }

        @keyframes musicFloat5 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.6; }
          25% { transform: translateY(-18px) rotate(72deg) scale(0.9); opacity: 0.3; }
          50% { transform: translateY(-42px) rotate(144deg) scale(1.4); opacity: 0.8; }
          75% { transform: translateY(-12px) rotate(216deg) scale(1.1); opacity: 0.5; }
        }

        @keyframes musicFloat6 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.5; }
          40% { transform: translateY(-38px) rotate(-108deg) scale(0.7); opacity: 0.9; }
          80% { transform: translateY(-25px) rotate(-216deg) scale(1.2); opacity: 0.4; }
        }

        @keyframes musicFloat7 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.4; }
          15% { transform: translateY(-22px) rotate(36deg) scale(1.1); opacity: 0.6; }
          35% { transform: translateY(-45px) rotate(108deg) scale(0.8); opacity: 0.8; }
          55% { transform: translateY(-8px) rotate(180deg) scale(1.3); opacity: 0.3; }
          85% { transform: translateY(-35px) rotate(252deg) scale(0.9); opacity: 0.7; }
        }

        @keyframes musicFloat8 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.3; }
          50% { transform: translateY(-50px) rotate(180deg) scale(1.5); opacity: 0.9; }
        }

        @keyframes waveform1 {
          0% { height: 15px; opacity: 0.4; transform: scaleY(1); }
          50% { height: 45px; opacity: 0.8; transform: scaleY(1.2); }
          100% { height: 25px; opacity: 0.6; transform: scaleY(0.9); }
        }

        @keyframes waveform2 {
          0% { height: 20px; opacity: 0.3; transform: scaleY(0.8); }
          50% { height: 35px; opacity: 0.7; transform: scaleY(1.1); }
          100% { height: 30px; opacity: 0.5; transform: scaleY(1); }
        }

        @keyframes waveform3 {
          0% { height: 10px; opacity: 0.5; transform: scaleY(1.1); }
          50% { height: 50px; opacity: 0.9; transform: scaleY(0.9); }
          100% { height: 18px; opacity: 0.4; transform: scaleY(1.2); }
        }

        .musical-notes {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .waveform {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

export default ParticleBackground