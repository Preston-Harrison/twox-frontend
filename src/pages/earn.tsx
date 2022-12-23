import Layout from '../components/Layout';
import LiquidityPanel from '../components/LiquidityPanel';
import WalletProvider from '../context/WalletContext';

export default function EarnPage() {
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
