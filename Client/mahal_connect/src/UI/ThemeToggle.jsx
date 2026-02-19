import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../Theme/UseTheme';
import './ThemeToggle.css'
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    // <button className='toggle-button'  onClick={toggleTheme}>
    //   {theme === 'light' ? <Moon size={18} color='grey' /> : <Sun size={18} color='white' />}
    // </button>
    <div className="theme-switch-wrapper">
      <label className="toggle-switch">
        <input 
          type="checkbox" 
          checked={theme === 'dark'} 
          onChange={toggleTheme} 
        />
        <div className="toggle-switch-background">
          <div className="toggle-switch-handle d-flex align-items-center justify-content-center">
            {theme === 'light' ? (
              <Moon size={14} color="#666" />
            ) : (
              <Sun size={14} color="#f1c40f" />
            )}
          </div>
        </div>
      </label>
    </div>
    
  );
};

export default ThemeToggle