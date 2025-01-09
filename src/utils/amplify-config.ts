// src/utils/amplify-config.ts
import { Amplify } from 'aws-amplify';

Amplify.configure({
  // Remove Auth configuration if you're not using it yet
  Storage: {
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
  }
});
