import { useServer } from '../context/ServerContext';

type Props = {
  aggregator: string;
  className?: string;
};

export default function AggregatorIcon(props: Props) {
  const { aggregatorData } = useServer();
  const { aggregator, className } = props;

  return (
    <div className={className}>
      {/* eslint-disable @next/next/no-img-element */}
      <img
        src={aggregatorData[aggregator].icon}
        alt={aggregatorData[aggregator].pair}
        className='max-h-full max-w-full rounded-full object-contain'
      />
    </div>
  );
}
