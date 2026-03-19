import React from 'react';
import './App.css';
import Routes from './Routes';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { ColorModeScript } from '@chakra-ui/react';
import { theme } from './theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ToastProvider from './components/ToastProvider';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ErrorBoundary>
        <Router>
          <Navbar />
          <Container maxW="6xl" py={6} minH="calc(100vh - 112px)">
            <Routes />
          </Container>
          <Footer />
          <ToastProvider />
        </Router>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default App;
