// amplifyConfig.ts
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_daJbUvWzH',
      userPoolClientId: '5hlt0jspd175jnj3j8rf9hf2t2',
      signUpVerificationMethod: 'code',
      identityPoolId: 'us-east-1:0d0761fc-9d4f-4613-9efd-2a00eaab450c',
    }
  },
  Storage: {
    S3: {
      bucket: 'my-app-user-profiles', // Replace with your bucket name
      region: 'us-east-1', // Replace with your region
    }
  }
}, {
  ssr: true
});