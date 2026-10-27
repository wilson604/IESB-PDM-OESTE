
import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const temaSistema = useColorScheme();
  const [temaManual, setTemaManual] = useState(null);

  const temaEscuro =
    temaManual === null
      ? temaSistema === 'dark'
      : temaManual === 'dark';

  function alternarTema() {
    setTemaManual(temaEscuro ? 'light' : 'dark');
  }

  const cores = temaEscuro
    ? {
        background: '#121212',
        card: '#242424',
        text: '#FFFFFF',
        secondary: '#BBBBBB',
        border: '#555555',
        primary: '#7C9FFF',
      }
    : {
        background: '#F5F6FA',
        card: '#FFFFFF',
        text: '#222222',
        secondary: '#666666',
        border: '#DDDDDD',
        primary: '#4B7BEC',
      };

  return (
    <TemaContext.Provider value={{ temaEscuro, alternarTema, cores }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const contexto = useContext(TemaContext);

  if (!contexto) {
    throw new Error('useTema precisa estar dentro de TemaProvider.');
  }

  return contexto;
}
