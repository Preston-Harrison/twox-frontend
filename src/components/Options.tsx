import ActiveOption, { ActiveOptionHeaders } from './ActiveOption';
import { useMarket } from '../context/MarketContext';

export default function Options() {
  const { options } = useMarket();
  return (
    <div className='h-full border-t border-coral-dark-grey bg-coral-blue'>
      <div className='border-b border-coral-dark-grey px-4 py-2'>Active</div>
      <ActiveOptionHeaders />
      <div>
        {options?.map((o) => (
          <ActiveOption option={o} key={o.id} />
        ))}
      </div>
    </div>
  );
}
