import { Option } from '../../context/MarketContext';

type Props = {
  option: Option;
};

export default function MobileClosedOption(props: Props) {
  const { option } = props;
  return <div>{option.id}</div>;
}
