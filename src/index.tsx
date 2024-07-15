// src/index.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, NumberInput, Button, Box } from '@mantine/core';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type FormData = z.infer<typeof schema>;

const MyForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = data => console.log(data);

  return (
    <Box style={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Name"
          placeholder="Enter your name"
          {...register('name')}
          error={errors.name && errors.name.message}
        />
        <Button type="submit" mt="md">Submit</Button>
      </form>
    </Box>
  );
};

export default MyForm;
