import { useRef } from 'react';
import gsap from 'gsap';

const StatCard = ({ title, value, icon: Icon, color = 'blue', trend }) => {
  const cardRef = useRef(null);
  const colors = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => gsap.to(cardRef.current, { y: -3, duration: 0.25 })}
      onMouseLeave={() => gsap.to(cardRef.current, { y: 0, duration: 0.25 })}
      className="card p-5 flex items-center justify-between"
    >
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
      </div>
      {Icon && (
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
