import React, { useState } from 'react';
import './Typedua.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CloudSun, Moon, BedDouble, Gem, ChevronRight, Utensils, Home } from 'lucide-react';

// Updated data structure with 'children'
const duaMenuData = [
  { 
    name: "Daily Routine", 
    subtitle: "ദൈനംദിന കാര്യങ്ങൾ", 
    id: 1, 
    icon: <CloudSun size={17}/>, 
    children: [
      { name: "Morning", subtitle: "പ്രഭാതത്തിൽ", id: 11, path: 'morning' },
      { name: "Evening", subtitle: "പ്രദോഷത്തിൽ", id: 12, path: 'evening' },
      { name: "Sleep", subtitle: "ഉറക്കവുമായി ബന്ധപ്പെട്ടവ", id: 13, path: 'sleep' },
      { name: "Food & Manners", subtitle: "ഭക്ഷണവും മര്യാദകളും", id: 14, path: 'food' },
      { name: "Dress", subtitle: "വസ്ത്രം ധരിക്കുമ്പോൾ", id: 15, path: 'dress' },
      { name: "Travel", subtitle: "യാത്രയിലായിരിക്കുമ്പോൾ", id: 16, path: 'travel' },
      { name: "Sneezing", subtitle: "തുമ്മുമ്പോൾ", id: 17, path: 'sneezing' },
      { name: "Home", subtitle: "വീട്ടിൽ പ്രവേശിക്കുമ്പോഴും പുറത്തിറങ്ങുമ്പോഴും", id: 18, path: 'home' },
      { name: "Excretion", subtitle: "ശൗചാലയത്തിൽ പ്രവേശിക്കുമ്പോൾ", id: 19, path: 'excretion' },
    ]
  },
  { 
    name: "Prayer", 
    subtitle: "നമസ്കാരം", 
    id: 2, 
    icon: <Gem size={17}/>, 
    children: [
      { name: "After Prayer", subtitle: "നമസ്കാരത്തിന് ശേഷം", id: 21, path: 'after_prayer' },
      { name: "Mosque Duas", subtitle: "പള്ളിയിൽ പ്രവേശിക്കുമ്പോൾ", id: 22, path: 'mosque' },
      { name: "Wudhu", subtitle: "വുളൂഅ് ചെയ്യുമ്പോൾ", id: 23, path: 'wudhu' },
      { name: "Adhan", subtitle: "ബാങ്കിന് ശേഷം", id: 24, path: 'adhan' },
      { name: "Isthikara", subtitle: "ഇസ്തിഖാറ നമസ്കാരം", id: 25, path: 'isthikara' },
    ]
  },
  {
    name: "Situations",
    subtitle: "വിവിധ സാഹചര്യങ്ങൾ",
    id: 3,
    icon: <Home size={17} />,
    children: [
        { name: "Hardship & Sorrow", subtitle: "പ്രയാസങ്ങളിലും വിഷമങ്ങളിലും", id: 31, path: 'hardship' },
        { name: "Parents", subtitle: "മാതാപിതാക്കൾക്ക് വേണ്ടി", id: 32, path: 'parents' },
        { name: "Success & Knowledge", subtitle: "വിജയത്തിനും അറിവിനും", id: 33, path: 'success' },
        { name: "Sick Visit", subtitle: "രോഗിയെ സന്ദർശിക്കുമ്പോൾ", id: 34, path: 'sick' },
      ]
  },
  {
    name: "Nature",
    subtitle: "പ്രകൃതി",
    id: 4,
    icon: <CloudSun size={17} />,
    children: [
        { name: "Rain", subtitle: "മഴ പെയ്യുമ്പോൾ", id: 41, path: 'rain' },
        { name: "Thunder & Wind", subtitle: "ഇടിമിന്നലും കാറ്റും", id: 42, path: 'thunder' },
      ]
  }
];
function Typedua() {
    const navigate = useNavigate();
    
    // State to track current list and navigation history
    const [viewStack, setViewStack] = useState([duaMenuData]);
    const currentList = viewStack[viewStack.length - 1];

    const handleItemClick = (item) => {
    if (item.children) {
        // If it has a sub-menu, go deeper
        setViewStack([...viewStack, item.children]);
    } else {
        // If it's a leaf node, navigate to the specific dua list filtered by path
        navigate(`/dua/${item.path}`);
    }
};

    const handleBack = () => {
        if (viewStack.length > 1) {
            // Go back one level in the nested menu
            setViewStack(viewStack.slice( -1));
        } else {
            // Exit back to home
            navigate(-1);
        }
    };

    return (
        <div>
            <header className="certificate-header">
                <button className="certificate-back-btn" onClick={handleBack}>
                    <ArrowLeft size={20} />
                </button>

                <div className="certificate-header-text">
                    <h1>Daily Duas</h1>
                    <p>{viewStack.length > 1 ? "Select a sub-category" : "Supplications for every occasion"}</p>
                </div>
            </header>

            <ul className='dua-ul'>
                {currentList.map((item) => (
                    <li 
                        className='dua-li p-3 rounded-4 d-flex align-items-center justify-content-between mb-3' 
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <span className='icon-box'>
                                <p className='m-0 p-0 dua-icon'>{item.icon || <ChevronRight size={17}/>}</p>
                            </span>
                            <div>
                                <h5 className='dua-h5 p-0 m-0'>{item.name}</h5>
                                <p className='m-0 dua-subtitle'  style={{ fontFamily: 'Manjari, sans-serif' }}>{item.subtitle}</p>
                            </div>
                        </div>
                        {item.children && <ChevronRight size={18} className="text-muted" />}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Typedua;