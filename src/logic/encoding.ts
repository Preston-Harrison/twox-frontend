import { BigNumberish, BytesLike, ethers } from 'ethers';

export type PushRound = {
  address: string;
  timestamp: BigNumberish;
  answer: BigNumberish;
};

export type OpenPosition = {
  priceFeed: string;
  duration: BigNumberish;
  isCall: boolean;
  deposit: BigNumberish;
};

export type ContractOpenPosition = [
  string,
  BigNumberish,
  boolean,
  BigNumberish
];

export function encodeOpenPosition(args: OpenPosition): string {
  const contractOpenPosition: ContractOpenPosition = [
    args.priceFeed,
    args.duration,
    args.isCall,
    args.deposit,
  ];
  return ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint40', 'bool', 'uint256'],
    contractOpenPosition
  );
}

export function encodeUpdateAggregator(
  args: PushRound & {
    signature: BytesLike;
    acceptable: BigNumberish;
    isCall: boolean;
  }
) {
  return ethers.utils.defaultAbiCoder.encode(
    ['address[]', 'uint256[]', 'int256[]', 'bytes[]', 'int256[]', 'bool[]'],
    [
      [args.address],
      [args.timestamp],
      [args.answer],
      [args.signature],
      [args.acceptable],
      [args.isCall],
    ]
  );
}
