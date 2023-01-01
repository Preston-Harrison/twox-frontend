import LiquidityPanel from '../components/invest/LiquidityPanel';
import Layout from '../components/Layout';
import WalletProvider from '../context/WalletContext';

export default function InvestPage() {
  return (
    <WalletProvider>
      <Layout>
        <div className='flex flex-1 items-center justify-center'>
          <LiquidityPanel />
        </div>
      </Layout>
    </WalletProvider>
  );
}
