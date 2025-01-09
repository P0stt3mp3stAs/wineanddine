import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION
});

const docClient = DynamoDBDocumentClient.from(client);

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Assuming you're using DynamoDB for reservations
    const command = new QueryCommand({
      TableName: process.env.RESERVATIONS_TABLE_NAME,
      KeyConditionExpression: 'user_id = :userId',
      ExpressionAttributeValues: {
        ':userId': user.userId
      },
    });

    const response = await docClient.send(command);
    
    // Sort reservations by date
    const reservations = response.Items?.sort((a, b) => 
      new Date(a.reservation_date).getTime() - new Date(b.reservation_date).getTime()
    );

    return NextResponse.json(reservations || []);
    
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
