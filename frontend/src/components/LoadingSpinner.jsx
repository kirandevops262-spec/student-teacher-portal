import React from 'react';
import { Center, Spinner } from '@chakra-ui/react';

export default function LoadingSpinner() {
  return (
    <Center py={20}>
      <Spinner size="xl" thickness="4px" />
    </Center>
  );
}
