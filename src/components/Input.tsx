import classNames from 'classnames';

type Props = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type: 'text' | 'number';
};

export default function Input(props: Props) {
  const { value, onChange, label, placeholder, type, disabled } = props;
  return (
    <div className='flex w-full flex-col'>
      {label && <label className='mb-1'>{label}</label>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={classNames(
          'rounded-md border-none bg-coral-dark-grey p-2 outline-none transition-all focus:ring-0 focus:brightness-110',
          {
            'cursor-not-allowed': disabled,
          }
        )}
        placeholder={placeholder}
        type={type}
        disabled={!!disabled}
      />
    </div>
  );
}
