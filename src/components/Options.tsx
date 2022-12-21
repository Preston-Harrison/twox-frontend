import ActiveOption, { ActiveOptionHeaders } from './ActiveOption';
import { useMarket } from '../context/MarketContext';

export default function Options() {
  const { options } = useMarket();
  return (
    <div className='col-span-3 border-2 border-black'>
      <div className='border-b-2 border-black px-2 text-lg'>Active</div>
      <ActiveOptionHeaders />
      {options?.map((o) => (
        <ActiveOption option={o} key={o.id} />
      ))}
    </div>
  );
}
