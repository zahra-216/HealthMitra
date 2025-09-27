// server/src/app.js
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log("Authorization:", req.headers.authorization);
  next();
});
