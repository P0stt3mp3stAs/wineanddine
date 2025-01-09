import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_ZwR49qIGv',
      userPoolClientId: '7dv6b0epj1bcfflhmsmg3qnm09',
      signUpVerificationMethod: 'code',
    }
  }
}, {
  ssr: true
})