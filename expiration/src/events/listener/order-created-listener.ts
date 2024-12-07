import { Listener, OrderCreatedEvent, Subjects } from '@authtickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Calcula el tiempo hasta la expiración de la orden
    const timeUntilExpiration = new Date(data.expiresAt).getTime() - new Date().getTime();

    // Delay mínimo de 10 segundos o el tiempo hasta la expiración (lo que sea menor)
    const delay = 1000000
    
    console.log('Waiting this many milliseconds to process the job:', delay);

    // Agrega la tarea a la cola con el delay ajustado
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
console.log("sse va a publicar")
    // Reconoce el mensaje
    msg.ack();
  }
}
