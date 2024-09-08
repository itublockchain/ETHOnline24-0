import {useState} from 'react';

function useActiveTab() {
  const [activeTab, setActiveTab] = useState<'Wallet' | 'Activity'>('Wallet');

  const switchTab = (tab: 'Wallet' | 'Activity') => {
    setActiveTab(tab);
  };

  return {activeTab, switchTab};
}
export {useActiveTab};
