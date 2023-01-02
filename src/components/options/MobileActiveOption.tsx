import { Option } from '../../context/MarketContext';

type Props = {
  option: Option;
};

export default function MobileActiveOption(props: Props) {
  const { option } = props;
  return <div className='bg-coral-dark-grey'>{option.id}</div>;
}
