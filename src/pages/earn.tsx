import AddRemovePanel from '../components/earn/AddRemovePanel';
import LiquidityStats from '../components/earn/LiquidityStats';
import Layout from '../components/Layout';
import WalletProvider from '../context/WalletContext';

export default function EarnPage() {
  return (
    <WalletProvider>
      <Layout>
        <div className='flex flex-1 items-center justify-center'>
          <div className='grid min-w-[40%] grid-cols-2'>
            <LiquidityStats />
            <AddRemovePanel />
          </div>
        </div>
      </Layout>
    </WalletProvider>
  );
}
