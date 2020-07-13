const router = require('koa-router')();
const {render} = require('../util/index');

router.get('/index', async (ctx, next) => {
  await render(ctx, `${ctx.device}/index`, {})
});

module.exports = router;
