const router = require('koa-router')();

router.get('/', async (ctx, next) => {
 console.log(ctx.device);
  await ctx.render(`${ctx.device}/index`)
});

module.exports = router;
