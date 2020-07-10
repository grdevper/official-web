module.exports = {
  checkAgent: function (ctx, next) {
    const deviceAgent = ctx.headers['user-agent'].toLowerCase();
    const agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if(agentID) {
       ctx.device = 'mobile';
    } else {
      ctx.device = 'pc';
    }
    next();
  }
};
