import { ExpirationCompleteEvent, Publisher, Subjects } from "@authtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
subject: Subjects.ExpirationComplete  = Subjects.ExpirationComplete
}