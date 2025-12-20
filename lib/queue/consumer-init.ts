import { notificationQueue } from './NotificationQueue';

let consumerStarted = false;

export async function initializeConsumer(){
  if (consumerStarted){
    return;   
  }

  try{
    await notificationQueue.startConsumer();
    consumerStarted = true;
    console.log('Email notification consumer started');
  } 
  catch (error){
    console.error('Failed to start consumer:', error);
    console.log('Emails will be sent directly without queue');
  }
}

if (typeof window === 'undefined'){
  initializeConsumer().catch(console.error);
}
