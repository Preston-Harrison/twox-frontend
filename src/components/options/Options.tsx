import dynamic from 'next/dynamic';
import React from 'react';
import { useAccount } from 'wagmi';

import DesktopOptions from './DesktopOptions';
import MobileOptions from './MobileOptions';
import { Option, useMarket } from '../../context/MarketContext';
import usePromise from '../../hooks/usePromise';
import { getClosedOptions } from '../../logic/complexCalls';

export type OptionProps = {
  tab: 'active' | 'closed';
  setTab: (tab: 'active' | 'closed') => void;
  options: Option[] | undefined;
  closedOptions: Option[] | undefined;
};

function Options() {
  const [tab, setTab] = React.useState<'active' | 'closed'>('active');
  const { options } = useMarket();
  const { address } = useAccount();

  const fetchClosed = React.useCallback(async () => {
    if (!address) return;
    const closed = await getClosedOptions(address);
    return closed.reverse();
  }, [address]);

  const { data: closedOptions, refresh } = usePromise(fetchClosed, 500);

  React.useEffect(() => {
    refresh();
  }, [options, refresh]);

  return (
    <>
      <DesktopOptions
        tab={tab}
        setTab={setTab}
        closedOptions={closedOptions}
        options={options}
      />
      <MobileOptions
        tab={tab}
        setTab={setTab}
        closedOptions={closedOptions}
        options={options}
      />
    </>
  );
}

export default dynamic(() => Promise.resolve(Options), { ssr: false });
