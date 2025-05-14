import 'reflect-metadata';
import 'dotenv/config';
import path from 'path';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { initializeApp, cert } from 'firebase-admin/app';

import { AppController } from './controllers/app.controller';

import * as serviceAccount from '../service-account-key.json';
import authConfig from './configs/auth.config';

useContainer(Container);

const PORT = process.env.APP_PORT || 3000;
console.info(`Starting server on http://localhost:${PORT}`);

// Initialize Firebase Admin SDK
// Ensure you have the service account key JSON file in the correct path
// and that the Firebase Admin SDK is properly configured.
// The service account key JSON file should be in the root directory of your project
// and should be named 'service-account-key.json'.
// You can generate this file from the Firebase Console under Project Settings > Service accounts > Generate new private key.
// Make sure to keep this file secure and not expose it in your version control system.
// The Firebase Admin SDK is used for server-side operations such as authentication,
// database access, and other Firebase services.
// The service account key is used to authenticate your server with Firebase services.
// The Firebase Admin SDK is initialized with the service account key,
// allowing your server to perform operations on behalf of your Firebase project.
const config: any = serviceAccount;
initializeApp({
  credential: cert(config),
});
console.info('Firebase Admin SDK initialized!');

const controllers = [
  path.join(__dirname, '/modules/**/*.controller{.ts,.js}'),
  path.join(__dirname, '/controllers/**/*.controller{.ts,.js}'),
  // Add your other controllers here
];

const app = createExpressServer(
  {
    cors: true,
    controllers,
    classTransformer: true,
    ...authConfig,
  }
);

app.listen(PORT);

export default app;