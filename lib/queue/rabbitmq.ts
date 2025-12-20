import amqp from 'amqplib';

let connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
let channel: amqp.Channel | null = null;

export async function getRabbitMQChannel(): Promise<amqp.Channel | null> {
  try{
    if(!process.env.RABBITMQ_URL){
      console.warn('RABBITMQ_URL not configured. Queue disabled.');
      return null;
    }

    if (channel){
      return channel;
    }

    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertExchange('notifications', 'direct', { durable: true });
    await channel.assertQueue('email_queue', { durable: true });
    await channel.bindQueue('email_queue', 'notifications', 'email');

    console.log('RabbitMQ connected successfully');

    return channel;
  } 
  catch(error){
    console.error('RabbitMQ connection failed:', error);
    return null;
  }
}

export async function closeRabbitMQ(){
  try{
    if (channel) await channel.close();
    if (connection) await connection.close();
  } 
  catch(error){
    console.error('Error closing RabbitMQ:', error);
  }
}
