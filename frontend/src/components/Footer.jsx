import React from 'react';
import { Box, Text, Link, HStack } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box as="footer" mt="auto" py={6} bg="white" _dark={{ bg: 'gray.800' }}>
      <HStack maxW="6xl" mx="auto" px={4} justify="center">
        <Text fontSize="sm">
          © {new Date().getFullYear()} Student–Teacher Portal
        </Text>
      </HStack>
    </Box>
  );
}
