import ActiveOption, { ActiveOptionHeaders } from './ActiveOption';
import { useMarket } from '../context/MarketContext';

export default function Options() {
  const { options } = useMarket();
  return (
    <div className='min-h-[25%] border-t border-coral-dark-grey bg-coral-blue'>
      <ActiveOptionHeaders />
      <div>
        {options?.map((o) => (
          <ActiveOption option={o} key={o.id} />
        ))}
      </div>
    </div>
  );
}
