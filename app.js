import path from 'path';
import express from 'express';
import ejs from 'ejs';
import { fileURLToPath } from 'url';

import indexRouter from './routes/index.js';
import adminRouter from './routes/admin.js';
import loginRouter from './routes/login.js';
import joinRouter from './routes/join.js';
import itemsRouter from './routes/items.js';
import cartRouter from './routes/cart.js';
import mypageRouter from './routes/mypage.js';
import errorPageRouter from './routes/error.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', ejs.__express);

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/login', loginRouter);
app.use('/join', joinRouter);
app.use('/items', itemsRouter);
app.use('/cart', cartRouter);
app.use('/mypage', mypageRouter);
app.use('/error', errorPageRouter);

app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
});
