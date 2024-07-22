'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page({ }) {
  
  const { push } = useRouter();

  useEffect(() => {
    if (navigator.language.includes('zh')){
        push('/tw');
    } else {
        push('/en');
    }

  }, []);
};