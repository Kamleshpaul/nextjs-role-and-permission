"use client"

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { PropsWithChildren } from 'react';
import { SocketProvider } from './SocketProvider';

export default function Wrapper({
  children
}: PropsWithChildren) {
  return (
    <SocketProvider>
      {children}
      <ToastContainer />
    </SocketProvider>

  )

}
