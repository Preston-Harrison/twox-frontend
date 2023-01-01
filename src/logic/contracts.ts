import { provider } from './alchemy';
import {
  ERC20__factory,
  LiquidityPool__factory,
  Market__factory,
  Router__factory,
} from '../contracts/typechain';

export const Market = Market__factory.connect(
  process.env.NEXT_PUBLIC_MARKET_ADDRESS!,
  provider
);

export const Router = Router__factory.connect(
  process.env.NEXT_PUBLIC_ROUTER_ADDRESS!,
  provider
);

export const UsdToken = ERC20__factory.connect(
  process.env.NEXT_PUBLIC_USD_TOKEN!,
  provider
);
export const USD_TOKEN_DECIMALS = 18;
export const USD_TOKEN_SYMBOL = 'MOCK';

export const LiquidityPool = LiquidityPool__factory.connect(
  process.env.NEXT_PUBLIC_LIQUIDITY_POOL_ADDRESS!,
  provider
);
export const LP_TOKEN_SYMBOL = '2XLP';
