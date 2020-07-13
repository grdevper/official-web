const axios = require('axios');
const ejs = require('ejs');
const config = require('../../build/config');
const isDev = process.env.NODE_ENV === 'development';
const send = require('koa-send');

async function checkAgent (ctx, next)  {
  const deviceAgent = ctx.headers['user-agent'].toLowerCase();
  const agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
  if(agentID) {
  	ctx.device = 'mobile';
  } else {
  	ctx.device = 'pc';
  }
  return next();
}

function getTemplateString (filename) {
  return new Promise((resolve, reject) => {
  	const {port, path, dir} = config;
    axios.get(`http://localhost:${port}${path.public}${dir.chunk}/${filename}`)
	  .then(res => {
		resolve(res.data)
	  })
	 .catch(reject)
  })
}

/**
 * render 方法
 * @param ctx koa 的 ctx 对象
 * @param filename 需要渲染的文件名
 * @param data ejs 渲染时需要用到的附加对象
 * @returns {Promise<*|undefined>}
 */
async function render (ctx, filename, data) {
 const {extensions} = config;
  filename = filename.indexOf(extensions) > -1 ? filename.split(extensions)[0] : filename;
  try {
	if (isDev) {
		const template = await getTemplateString(`${filename}.${extensions}`);
		let html = ejs.render(template, data);
		ctx.type = 'text/html; charset=utf-8';
		ctx.body = html;
	} else {
		await ctx.render(filename, data)
	}
	return Promise.resolve()
  } catch (e) {
	return Promise.reject(e)
  }
}

module.exports = {
  checkAgent,
  getTemplateString,
  render
};
