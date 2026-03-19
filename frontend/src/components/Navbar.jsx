import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Flex, HStack, Link, IconButton, Text, useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        as={RouterLink} to={to} px={3} py={2} rounded="md"
        fontWeight={isActive ? 'bold' : 'medium'}
        bg={isActive ? 'gray.200' : 'transparent'}
        _dark={{ bg: isActive ? 'gray.700' : 'transparent' }}
        _hover={{ textDecoration: 'none', bg: 'gray.200', _dark: { bg: 'gray.700' } }}
      >
        {children}
      </Link>
    );
  };

  return (
    <Box as="header" position="sticky" top="0" zIndex="100" bg="white" _dark={{ bg: 'gray.800' }} shadow="sm">
      <Flex as="nav" h={14} align="center" px={4} maxW="6xl" mx="auto" justify="space-between">
        <HStack spacing={4}>
          <Text fontWeight="bold">Student–Teacher Portal</Text>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/student">Student</NavLink>
          <NavLink to="/teacher">Teacher</NavLink>
        </HStack>
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
        />
      </Flex>
    </Box>
  );
}
