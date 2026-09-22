Vercel routing fix

1. Delete api/[...path].ts from the project.
2. Copy api/index.ts and vercel.json from this patch into the project root.
3. npm run lint
4. npm run build
5. git add -A && git commit && git push
6. vercel --prod

This routes every /api/* request through one stable Vercel function and reconstructs the original Express path.
