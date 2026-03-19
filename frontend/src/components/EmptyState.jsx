import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export default function EmptyState({ title = 'No data yet', subtitle = 'Add some records to get started.' }) {
  return (
    <Box textAlign="center" py={16}>
      <Text fontSize="lg" fontWeight="semibold">{title}</Text>
      <Text color="gray.500" mt={2}>{subtitle}</Text>
    </Box>
  );
}
