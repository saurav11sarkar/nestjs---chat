import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import type { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  ROOM = 'group';

  @SubscribeMessage('joinRoom')
  async handleMessage(client: Socket, payload: any): Promise<string> {
    await client.join(this.ROOM);

    // broastcast
    client.to(this.ROOM).emit('roomNotice', payload);
    console.log('Received:', payload);

    return 'Hello world';
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(client: Socket, payload: any): void {
    client.to(this.ROOM).emit('chatMessage', payload);
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, payload: any): void {
    client.to(this.ROOM).emit('typing', payload);
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(client: Socket, payload: any): void {
    client.to(this.ROOM).emit('stopTyping', payload);
  }

  handleConnection(client: Socket) {
    console.log(`new client cennect ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`client disconnected ${client.id}`);
  }
}
