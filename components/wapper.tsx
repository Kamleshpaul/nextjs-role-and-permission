"use client"

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { PropsWithChildren, ReactPropTypes } from 'react';

export default function Wrapper({
  children
}:PropsWithChildren){
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )

}
