type Props = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  type: 'text' | 'number';
};

export default function Input(props: Props) {
  const { value, onChange, label, placeholder, type } = props;
  return (
    <div className='flex w-full flex-col'>
      {label && <label>{label}</label>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='rounded-md border-none bg-coral-dark-grey p-2 outline-none focus:ring-0 focus:brightness-110'
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
}
