import classNames from 'classnames';

type Props = {
  value: boolean;
  onChange: (v: boolean) => void;
};

const className = 'flex-1 rounded-md border-[3px] py-2 transition-all';

export default function CallOrPut(props: Props) {
  const { value: isCall, onChange } = props;
  return (
    <div className='flex w-full'>
      <button
        onClick={() => onChange(false)}
        className={classNames(className, {
          'border-coral-dark-blue bg-coral-dark-blue': isCall,
          ' border-coral-red text-coral-red': !isCall,
        })}
      >
        Put
      </button>
      <button
        onClick={() => onChange(true)}
        className={classNames(className, {
          'border-coral-dark-blue bg-coral-dark-blue': !isCall,
          ' border-coral-green text-coral-green': isCall,
        })}
      >
        Call
      </button>
    </div>
  );
}
