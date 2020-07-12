const router = require('koa-router')();

router.get('/index', async (ctx, next) => {
 console.log(ctx.render); 
 console.log(ctx.device);
  await ctx.render(`${ctx.device}/test`)
});

module.exports = router;
