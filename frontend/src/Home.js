import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Heading, HStack, VStack, Text } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import './Home.css';

function Home() {
  return (
    <Box py={16} textAlign="center">
      <Helmet>
        <title>Home • Student–Teacher Portal</title>
        <meta name="description" content="Welcome to the Student–Teacher Portal" />
      </Helmet>
      <VStack spacing={6}>
        <Heading size="2xl">Welcome to Student–Teacher Portal</Heading>
        <Text color="gray.600" _dark={{ color: 'gray.300' }}>
          Choose your role to continue
        </Text>
        <HStack spacing={4}>
          <Button as={RouterLink} to="/student" size="lg">
            Student
          </Button>
          <Button as={RouterLink} to="/teacher" size="lg" variant="outline">
            Teacher
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}

export default Home;
