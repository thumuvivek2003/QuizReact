import express from 'express';
import path from 'path';

const app = express();
const port = 9000; // You can use any port you like

// Serve static files from the 'dist' folder
app.use(express.static(path.join(process.cwd(), 'dist')));

// Catch-all route to serve index.html for any non-static request
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
