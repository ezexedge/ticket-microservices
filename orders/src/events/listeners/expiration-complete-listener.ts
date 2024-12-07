import {
    Listener,
    Subjects,
    ExpirationCompleteEvent,
    OrderStatus,
  } from '@authtickets/common';
  import { Message } from 'node-nats-streaming';
  import { queueGroupName } from './queue-group-name';
  import { Order } from '../../models/order';
  import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
  
  export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
      const order = await Order.findById(data.orderId).populate('ticket');
      if (!order) {
        throw new Error('Order not found');
      }
      console.log("order  listen eexpiration",order)

      order.set({
        status: OrderStatus.Cancelled,
      });
      await order.save();
      const order2 = await Order.findById(data.orderId).populate('ticket');
      console.log("order2",order2)
      await new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        version: 23,
        ticket: {
          id: order.ticket.id,
        },
      });
  
      msg.ack();
    }
  }
  