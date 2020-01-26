import {CocinaVintageApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {CocinaVintageApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new CocinaVintageApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
