/**
 * 直播开始结束推流工具类
 * @author: 张江
 * @creatTime :2022年04月27日
 * @version:v1.0.1 
 * @updateTime :2022年05月19日
 * @updateDescription :添加录制屏幕 创建并销毁实例等方法
 */
import { openNotificationWithIcon } from "./utils";

export default class LivePusherUtils {

    // @ts-ignore
    public static livePusher = new TXLivePusher();//实例完成
    public static deviceManager = {};//设备管理

    // 检验浏览器是否支持
    private static judgeWhetherSupported(callback: any) {
        // @ts-ignore
        TXLivePusher.checkSupport().then(function (data) {
            // 是否支持WebRTC  
            if (data.isWebRTCSupported) {
                // console.log('WebRTC Support');
            } else {
                // console.log('WebRTC Not Support');
                openNotificationWithIcon('warning', '提示', '', '当前浏览器不支持WebRTC,请切换浏览器或更新浏览器版本后再尝试！');
                return;
            }
            // 是否支持H264编码  
            if (data.isH264EncodeSupported) {
                // console.log('H264 Encode Support');
            } else {
                // console.log('H264 Encode Not Support');
                openNotificationWithIcon('warning', '提示', '', '当前浏览器不支持H264 Encode,请切换浏览器或更新浏览器版本后再尝试！');
                return;
            }
            // 当前设备是否支持音视频
            if (data.isMediaDevicesSupported) {
                // console.log('H264 Encode Support');
            } else {
                // console.log('H264 Encode Not Support');
                openNotificationWithIcon('warning', '提示', '', '当前设备不支持录制音视频或需要使用https安全协议访问,请检查无误后再尝试！');
                return;
            }

            if (data.isWebRTCSupported && data.isH264EncodeSupported && data.isMediaDevicesSupported) {
                if (callback && typeof callback == 'function') {
                    callback()
                }
            }
        });    //
    }
    
    //  @ts-ignore 创建实例
    public static createTXLivePusher() {
        //  @ts-ignore
        this.livePusher = new TXLivePusher();//实例完成
    };

    //  @ts-ignore 获取设备列表
    public static getDevicesList(callback) {
        const _self = this;
        const deviceManagerGetDevicesList = () => {
            _self.deviceManager = _self.livePusher.getDeviceManager();
            // 获取设备列表
            //  @ts-ignore
            _self.deviceManager.getDevicesList().then(function (data) {
                if (callback && typeof callback == 'function') {
                    callback(data)
                }
            });
        }
        _self.judgeWhetherSupported(deviceManagerGetDevicesList);
    };

    //  @ts-ignore 开启调试直播平台设备
    public static testLiveDevice(captureType) {
        const _self = this;
        const getLiveTestVideo = () => {
            // 设置视频质量
            _self.livePusher.setVideoQuality('1080p');
            // 设置音频质量
            _self.livePusher.setAudioQuality('standard');
            // 自定义设置帧率
            _self.livePusher.setProperty('setVideoFPS', 30);
            // 打开麦克风
            _self.livePusher.startMicrophone();
            // 屏幕采集
            if (captureType == 2) {
                // 开启屏幕采集
                _self.livePusher.startScreenCapture();
                return;
            }
            // 打开摄像头
            _self.livePusher.startCamera();
        }
        _self.judgeWhetherSupported(getLiveTestVideo);
    };

    //  @ts-ignore 切换直播平台设备
    public static switchLiveDevice(cameraDeviceId, microDeviceId) {
        const _self = this;
        const switchLiveDeviceFun = () => {
            if (cameraDeviceId) {
                //  @ts-ignore
                _self.deviceManager.switchCamera(cameraDeviceId)
            }
            if (microDeviceId) {
                //  @ts-ignore
                _self.deviceManager.switchMicrophone(microDeviceId)
            }
        }
        _self.judgeWhetherSupported(switchLiveDeviceFun);
    };

    //  @ts-ignore 开始直播推流
    public static startLivePush(data = {}, operLive, captureType) {
        const _self = this;
        // @ts-ignore
        let startPushUrl = data.pushStreamUrl;
        startPushUrl = startPushUrl && startPushUrl.includes('rtmp://') ? startPushUrl.replace('rtmp://', 'webrtc://') : startPushUrl;
        if (!startPushUrl) return;
        const operLivePusher = () => {
            // 设置视频质量
            _self.livePusher.setVideoQuality('1080p');
            // 设置音频质量
            _self.livePusher.setAudioQuality('standard');
            // 自定义设置帧率
            _self.livePusher.setProperty('setVideoFPS', 30);
            // 打开麦克风
            // @ts-ignore
            _self.livePusher.startMicrophone(data.microDeviceId);
            // 屏幕采集
            if (captureType == 2) {
                // 开启屏幕采集
                _self.livePusher.startScreenCapture();
            }else{
                // 打开摄像头
                // @ts-ignore
                _self.livePusher.startCamera(data.cameraDeviceId);
            }
            let hasVideo = false;
            let hasAudio = false;
            let isPush = false;
            _self.livePusher.setObserver({
                onCaptureFirstAudioFrame: function () {
                    hasAudio = true;
                    if (hasVideo && !isPush) {
                        isPush = true;
                        _self.livePusher.startPush(startPushUrl);
                    }
                    // else {
                    //     openNotificationWithIcon('warning', '提示', '', '未采集到视频,请检查视频配置是否正确后再尝试！');
                    // }
                },
                onCaptureFirstVideoFrame: function () {
                    hasVideo = true;
                    if (hasAudio && !isPush) {
                        isPush = true;
                        _self.livePusher.startPush(startPushUrl);
                    }
                    //  else {
                    //     openNotificationWithIcon('warning', '提示', '', '未采集到音频,请检查音频配置是否正确后再尝试！');
                    // }
                },
                // 推流警告信息
                onWarning: function (code, msg) {
                    openNotificationWithIcon('warning', '提示', '', msg);
                },
                onError: function (code, msg) {
                    console.log('onError' + code + '===' + msg);
                    openNotificationWithIcon('error', '提示', '', msg);
                },
                // 推流连接状态
                onPushStatusUpdate: function (status, msg) {
                    console.log('onPushStatusUpdate' + status + '===' + msg);
                    if (operLive && typeof operLive == 'function' && status==2) {
                        operLive(status)
                    }
                },
                // 推流统计数据
                onStatisticsUpdate: function (data) {
                    console.log('video fps is ' + data.video.framesPerSecond);
                }
            });
        }
        _self.judgeWhetherSupported(operLivePusher);
    };

    //  @ts-ignore 结束直播
    public static stopLivePush(data: any) {
        const _self = this;
        // 停止快直播推流
        _self.livePusher.stopPush();
        // 关闭摄像头
        _self.livePusher.stopCamera();
        // 关闭麦克风
        _self.livePusher.stopMicrophone();
        // 关闭屏幕采集
        _self.livePusher.stopScreenCapture();
    };

    //  @ts-ignore 结束直播后-销毁
    public static stopLiveToDestroy(data: any) {
        const _self = this;
        // 离开页面或者退出时，清理 SDK 实例
        _self.livePusher.destroy();
    };

    //  @ts-ignore 设置直播播放器容器
    public static setVideoRenderView(idString: string, muted = true) {
        const _self = this;
        // 指定本地视频播放器容器 div，浏览器采集到的音视频画面会渲染到这个 div 当中
        _self.livePusher.setRenderView(idString);
        //  @ts-ignore
        const videoTag = document.getElementById(idString).getElementsByTagName('video')[0];
        if (videoTag) {
            videoTag.muted = muted;
        }
    };


}
