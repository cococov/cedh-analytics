"use client";

import { useReducer } from 'react';
/* Own */
import BaseNavBar from './base';
import PhoneNavBar from './phone';

export default function NavBar() {
  const [isOpen, toggle] = useReducer((state: boolean) => !state, false);

  return (
    <>
      <BaseNavBar />
      <PhoneNavBar isOpen={isOpen} toggleOpen={toggle} />
    </>
  )
};
