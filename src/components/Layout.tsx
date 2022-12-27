import Link from 'next/link';
import * as React from 'react';
import { ToastContainer } from 'react-toastify';

import WalletConnect from './WalletConnect';

type Props = {
  children: React.ReactNode;
};

export default function Layout(props: Props) {
  return (
    <div className='flex h-screen flex-col bg-coral-blue'>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme='dark'
      />
      <header className='flex w-full items-center justify-between px-4'>
        <div className='flex gap-2'>
          <Link href='/'>Trade</Link>
          <Link href='/earn'>Earn</Link>
        </div>
        <WalletConnect />
      </header>
      {props.children}
    </div>
  );
}
