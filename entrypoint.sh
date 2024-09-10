#!/bin/sh
npx prisma migrate dev --preview-feature
npm run start:prod
npx prisma migrate deploy