import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'USER_SERVICE',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.BROCKER_URL],
            queue: 'user-service',
            queueOptions: { durable: false },
          },
        } as any), // Cast to any to bypass type error if using legacy config
    },
  ],
})
export class UserModule {}