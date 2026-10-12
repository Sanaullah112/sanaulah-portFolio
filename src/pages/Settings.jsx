import { useState } from 'react';
import PageTitle from '../components/ui/PageTitle';
import Button from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { isVoiceFeedbackEnabled, setVoiceFeedbackEnabled, speak } from '../utils/speak';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [voiceEnabled, setVoiceEnabled] = useState(isVoiceFeedbackEnabled());

  const handleToggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    setVoiceFeedbackEnabled(next);
    if (next) speak('Voice feedback enabled.');
  };

  return (
    <div className="max-w-2xl">
      <PageTitle title="Settings" subtitle="Manage your admin preferences" />

      <div className="card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Admin Account</p>
            <p className="text-sm text-gray-500">{user?.email || 'admin.example.com'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-5">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-gray-500">Toggle the dashboard theme</p>
          </div>
          <Button variant="outline" onClick={toggleTheme}>
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </Button>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-5">
          <div>
            <p className="font-medium">Voice Feedback</p>
            <p className="text-sm text-gray-500">Spoken confirmation for admin actions</p>
          </div>
          <Button variant="outline" onClick={handleToggleVoice}>
            {voiceEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
