import ActiveOption, { ActiveOptionHeaders } from './ActiveOption';
import { useMarket } from '../context/MarketContext';

export default function Options() {
  const { options } = useMarket();
  return (
    <div className='h-full border-t border-coral-dark-grey bg-coral-blue'>
      <div className='border-b border-coral-dark-grey px-2 text-lg'>Active</div>
      <ActiveOptionHeaders />
      {options?.map((o) => (
        <ActiveOption option={o} key={o.id} />
      ))}
    </div>
  );
}
