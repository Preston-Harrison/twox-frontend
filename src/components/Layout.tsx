import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import WalletConnect from './WalletConnect';

type Props = {
  children: React.ReactNode;
};

export default function Layout(props: Props) {
  const { pathname } = useRouter();
  return (
    <div className='flex min-h-screen flex-col bg-coral-blue'>
      <Head>
        <title>TwoX Exchange</title>
        <link rel='icon' href='/images/logo.png' />
      </Head>
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
      <header className='flex w-full items-center justify-between border-b border-coral-dark-grey px-4'>
        <div className='flex items-center'>
          <div className='flex items-center gap-3 border-r border-coral-dark-grey pr-4 font-bold'>
            <Image
              src='/images/logo.png'
              alt='coral finance logo'
              width='28'
              height='28'
            />
            TwoX Exchange
          </div>
          <Link
            href='/'
            className={classNames(
              'mx-2 rounded-md px-3 py-2 transition-all hover:text-white max-laptop:hidden',
              {
                'bg-coral-dark-blue text-white': pathname === '/',
                'hover:bg-coral-dark-grey': pathname !== '/',
              }
            )}
          >
            Trade
          </Link>
          <Link
            href='/invest'
            className={classNames(
              'mx-2 rounded-md px-3 py-2 transition-all hover:text-white max-laptop:hidden',
              {
                'bg-coral-dark-blue text-white': pathname === '/earn',
                'hover:bg-coral-dark-grey': pathname !== '/earn',
              }
            )}
          >
            Invest
          </Link>
        </div>
        <WalletConnect />
      </header>
      {props.children}
    </div>
  );
}
