import * as dotenv from 'dotenv';

import { bootstrap } from './bootstrap';

void (async (): Promise<void> => {
  dotenv.config();

  await bootstrap();
})();
