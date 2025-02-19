const process = require('process');
const puppeteer = require('puppeteer');
const setting = require('../setting');


const {fileDir} = setting.get()

const MAX_WSE = 4;  //启动4个浏览器
let WSE_LIST = []; //存储browserWSEndpoint列表
init();


function init() {
    (async () => {
        for (var i = 0; i < MAX_WSE; i++) {
            const browser = await puppeteer.launch({
                headless: true,
                // dumpio : true,
                args: [
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-first-run',
                    '--no-sandbox',
                    '--no-zygote',
                    '--single-process'
                ]
            });
            browserWSEndpoint = await browser.wsEndpoint();
            WSE_LIST[i] = browserWSEndpoint;
        }
        console.log(WSE_LIST);
    })();
}

class PuppeteerService {

  constructor() {
    this.initCount = 0
    this.browser = null
  }

  /**
   * 内容渲染为 pdf
   * @param fileName 生成 pdf 文件名
   * @param content 待渲染内容，可能为 html 或 url
   * @param option
   * @param contentType 待渲染内容 0 为 html 1 为 url
   * @returns {Promise<{path: string, pdf: Buffer}>}
   */
  async content2Pdf(fileName, content, option = null, renderOption = null) {
    let contentType = renderOption ? (renderOption.contentType || 0) : 0;
    let calFunction = renderOption ? renderOption.calFunction : null;
    let options = setting.renderOptions
    let filePath = fileDir + fileName + '.pdf'
    options.path = filePath;
    if (option) {
      Object.keys(option).map(it => {
        options[it] = option[it]
      })
    }
    // 计算渲染耗时
    let t = process.uptime();
    // 创建 websocket 连接
    let tmp = Math.floor(Math.random() * MAX_WSE);
    let browserWSEndpoint = WSE_LIST[tmp];
    // 创建 browser 并连接至 websocket，确保 browser 存在，避免重复创建
    let page = null;
    if (!this.browser) {
      if (this.initCount === 0) {
        console.log('浏览器实例初始化中...');
        await puppeteer.connect({browserWSEndpoint}).then(async res => {
          this.browser = res;
          console.log('浏览器实例初始化成功');
          page = await this.browser.newPage();
          this.initCount++;
        }).catch(err => {
          throw new Error("浏览器实例初始化失败");
        })
      } else {
        console.log('浏览器实例已不存在，重新创建中...');
        await puppeteer.connect({browserWSEndpoint}).then(async res => {
          this.browser = res;
          console.log('浏览器实例重新创建成功');
          page = await this.browser.newPage();
        }).catch(err => {
          throw new Error('浏览器实例重新创建失败');
        })
      }
    } else {
      page = await this.browser.newPage();
    }
    if (contentType == 0) {
      // 待渲染内容为 html
      try {
        // 将 html 设置给 page
        await page.setContent(content, {waitUntil: ['networkidle0', 'load'], timeout: 180000});
      } catch (error) {
        console.error('页面设置html超时或出错：', error);
      }
    } else {
      // 待渲染内容为 url，注意此时 content 不再是 html 而是 url
      const sessionStorageData = renderOption ? renderOption.sessionData : null;
      const localStorageData = renderOption ? renderOption.localStorageData : null;
      if (sessionStorageData || localStorageData) {
        const baseUrl = content.replace(content.replace(new RegExp("(https?:\\/\\/[^\\/]+)", "g"), ""), "")
        try {
          // 将 page 导航至 url
          await page.goto(baseUrl, {waitUntil: ['networkidle0', 'load'], timeout: 180000});
        } catch (error) {
          console.error(`页面导航至 ${baseUrl} 超时或出错：`, error);
        }
        // 导航 url 成功后设置 sessionStorage 和 localStorageData
        if (sessionStorageData) {
          await page.evaluate(async(tokenData) => {
            for (const key in tokenData) {
              sessionStorage.setItem(key, tokenData[key]);
            }
          }, sessionStorageData);
        }
        if (localStorageData) {
          await page.evaluate(async(tokenData) => {
            for (const key in tokenData) {
              localStorage.setItem(key, tokenData[key]);
            }
          }, localStorageData);
        }
      } else {
        // 优化，避免重复导航
        try {
          await page.goto(content, {waitUntil: ['networkidle0', 'load'], timeout: 180000});
        } catch (error) {
          console.error(`页面导航至 ${content} 超时或出错（no storage）：`, error);
        }
      }
    }

    // 增强渲染模式下超时时间设置为 10s
    if (renderOption && renderOption.pdfEnhance) {
      let timeout = renderOption.timeout || 120000
      await this.waitPdfRenderComplete(page, timeout).then(res => {
        console.log('pdf 已增强渲染')
      }).catch(error => {
        console.error(`pdf 增强渲染失败：`, error)
      })
    }

    await page.waitForTimeout(1000)

    let data = null
    if (calFunction) {
      // 若有计算功能则执行计算（铺码）
      try {
        data = await calFunction(page)
      } catch (error) {
        console.log('数据计算出错：', error)
      }
    }
    // 渲染生成 pdf 文件
    let pdf = null
    try {
      pdf = await page.pdf(options)
      console.log('渲染选项：', options)
    } catch (error) {
      console.log('page 渲染 pdf 功能出错：', error)
    }
    // 渲染结束，打印耗时
    t = process.uptime() - t
    console.log(`pdf 渲染成功：共计花费 ${t} 秒`)
    // 关闭 page
    await page.close()
    console.log('渲染结果：', { path: options.path, pdf: pdf, data: data })
    return {path: options.path, pdf: pdf, data: data}
  }



    /**
     * 内容渲染为image
     * @param fileName 生成png文件名
     * @param fileName
     * @param content
     * @param screenshotOptions
     * @param contentType
     * @returns {Promise<{path: (*|string), img: Buffer | string | void, data: null}>}
     */
    async content2Img(fileName, content, screenshotOptions = null, contentType = 0) {
        contentType = contentType || 0;
        let options = screenshotOptions || {fullPage:true};
        options.type = options.type || "png";
        let filePath = `${fileDir}${fileName}.${options.type}`;
        console.log("===>", filePath)
        options.path = options.path || filePath;
        let t = process.uptime();
        let tmp = Math.floor(Math.random() * MAX_WSE);
        let browserWSEndpoint = WSE_LIST[tmp];
        const browser = await puppeteer.connect({browserWSEndpoint});
        const page = await browser.newPage();
        if (contentType == 0) {
            await page.setContent(content, {waitUntil: ['networkidle0', 'load']});
        } else {
            try {
              await page.goto(content, {waitUntil: ['networkidle0', 'load'], timeout: 60000});
            } catch (error) {
              console.error('页面加载超时或出错：', error);
            }
        }

        let image = await page.screenshot(options);
        t = process.uptime() - t;
        console.log(`rend2Img time cost: ${t} msec`);
        await page.close();
        return {path: options.path, type: options.type, img: image}
    }


    /**
     * Html内容渲染为pdf
     * @param fileKey
     * @param html
     * @param option
     * @param timeout
     * @returns {Promise<{path: string, pdf: Buffer}>}
     */
    async html2Pdf(fileKey, html, option = null, renderOption) {
      return await this.content2Pdf(fileKey, html, option, renderOption)
    }


    /**
     * Html内容渲染为图片
     * @param fileKey
     * @param html
     * @param option
     * @returns {Promise<{path: (*|string), img: (Buffer|string|void), data: null}>}
     */
    async html2Image(fileKey, html, option = null) {
        return await this.content2Img(fileKey, html, option, 0)
    }

    async waitPdfRenderComplete(page, timeout) {
        let time = 0;
        return new Promise(function (resolve, reject) {
            let t = setInterval(function () {
                time += 500;
                page.evaluate(('window.status === "PDFComplete"' || 'window.document.readyState === "complete"'))
                    .then(function (isOk) {
                        if (isOk) {
                            clearInterval(t);
                            resolve();
                        }
                    });

                if (time > timeout) {
                    setTimeout(function () {
                        clearInterval(t);
                        reject('timeout');
                    }, 20);
                }
            }, 500)
        });
    };

    /**
     * url 渲染为pdf
     * @param fileKey
     * @param url
     * @param options
     * @param renderOption
     * @returns {Promise<{path: string, pdf: Buffer}>}
     */
    async url2Pdf(fileKey, url, options = null, renderOption) {
        console.log(url)
        return await this.content2Pdf(fileKey, url, options, renderOption)
    }


    /**
     * url 渲染为img
     *
     * @param fileKey
     * @param url
     * @param options
     * @returns {Promise<{path: (*|string), img: (Buffer|string|void), data: null}>}
     */
    async url2Img(fileKey, url, options = null) {
        return await this.content2Img(fileKey, url, options, 1)
    }


}

module.exports = new PuppeteerService()


