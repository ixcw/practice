/**
 * 通过crypto-js实现 加解密工具类
 * AES对称，md5等加密
 * @author: 张江
 * @creatTime :2020年03月11日
 * @version:v1.0.0
 */
// @ts-ignore
import CryptoJS from 'crypto-js';

export default class CryptoUtils {

    public static isEncryption = false;//是否加密

    private static KP = {
        key: process.env.APP_AES_KEY, // 秘钥 16*n:
        iv: process.env.APP_AES_IV  // 偏移量
    }

    private static getAesString(data: any, key: string, iv: any) { // 加密
        key = CryptoJS.enc.Utf8.parse(key);
        // alert(key）;
        iv = CryptoJS.enc.Utf8.parse(iv);
        let encrypted = CryptoJS.AES.encrypt(data, key,
            {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        return encrypted.toString();    // 返回的是base64格式的密文
    }

    private static getDAesString(encrypted: any, key: string, iv: any) { // 解密
        key = CryptoJS.enc.Utf8.parse(key);
        iv = CryptoJS.enc.Utf8.parse(iv);
        let decrypted = CryptoJS.AES.decrypt(encrypted, key,
            {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        return decrypted.toString(CryptoJS.enc.Utf8);      //
    }

    // @ts-ignore 加密
    public static aesEn(data: any) { return this.getAesString(data, this.KP.key, this.KP.iv) }
    //  @ts-ignore 解密
    public static aesDe(data: any) { return this.getDAesString(data, this.KP.key, this.KP.iv) }

    public static md5(data: any) {
        return CryptoJS.MD5(data).toString();
    };

    /**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
    public static aesEncrypt(word, keyWord = "XwKsGlMcdPMEhR1B") {
        var key = CryptoJS.enc.Utf8.parse(keyWord);
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return encrypted.toString();
    }
}
