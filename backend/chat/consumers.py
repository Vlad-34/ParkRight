from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async

from user.models import User
from .models import Message
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    '''A consumer that handles chat messages. This consumer is responsible for:
    - Connecting to the websocket.
    - Disconnecting from the websocket.
    - Receiving messages from the websocket.
    - Handling chat messages.
    - Saving chat messages to the database.
    - Sending chat messages to the appropriate user.
    - Storing connected users in a dictionary.
    - The connected_users dictionary stores the connected users with their user IDs as keys and the ChatConsumer instances as values. This allows the ChatConsumer instances to send messages to the appropriate user when a message is received.'''
    connected_users = {}

    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['id']
        self.connected_users[self.id] = self 
        await self.accept()

    async def disconnect(self, close_code):
        del self.connected_users[self.id]

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        await self.handle_chat_message(text_data_json)

    async def handle_chat_message(self, text_data_json):
        content = text_data_json['content']
        receiver = text_data_json['receiver']
        timestamp = text_data_json['timestamp']
        sender = text_data_json['sender']

        userSender = await sync_to_async(User.objects.get)(id=sender)
        userReceiver = await sync_to_async(User.objects.get)(id=receiver)

        await self.save_message(userSender, userReceiver, content, timestamp)

        if str(receiver) in self.connected_users.keys():
            try:
                await self.connected_users[str(receiver)].send(text_data=json.dumps({
                    'content': content,
                    'sender': sender,
                    'receiver': receiver,
                    'timestamp': timestamp,
                }))
            except Exception as e:
                print(f"Error when sending message: {str(e)}")

    @database_sync_to_async
    def save_message(self, sender, receiver, content, timestamp):
        Message.objects.create(sender=sender, receiver=receiver, content=content, timestamp=timestamp)
            