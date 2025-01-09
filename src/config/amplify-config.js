import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_ZwR49qIGv',
    userPoolWebClientId: '7dv6b0epj1bcfflhmsmg3qnm09',
  },
  ssr: true
});