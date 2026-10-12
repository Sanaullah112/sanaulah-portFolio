import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ message = 'No data found', icon: Icon = FiInbox }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
    <Icon size={40} />
    <p className="text-sm">{message}</p>
  </div>
);

export default EmptyState;
