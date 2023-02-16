import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => {
  return {
    siteTitle: process.env.SWAGGER_SITE_TITLE,
    docTitle: process.env.SWAGGER_DOC_TITLE,
    docDescription: process.env.SWAGGER_DOC_DESCRIPTION,
    docVersion: process.env.SWAGGER_DOC_VERSION,
  };
});
