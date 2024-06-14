// @ts-ignore
import buttonListCache from '@/caches/buttonList'

export default class PowerUtils {
	private static filterButton(buttons: any, buttonName: string) {
		// 过滤按钮
		let buttonList = buttonListCache(null)
		let isPower = false
		if (buttonList) {
			for (let item of buttonList) {
				// @ts-ignore
				if (item.name === buttonName) {
					isPower = true
					break
				}
			}
		} else if (Array.isArray(buttons) && buttons.length > 0) {
			for (let item of buttons) {
				// @ts-ignore
				if (item.name === buttonName) {
					isPower = true
					break
				}
			}
		}
		return isPower
		// return true;
	}
	// @ts-ignore 判断按钮权限
	public static judgeButtonAuth(buttons: any, buttonName: string) {
		return this.filterButton(buttons, buttonName)
	}
}
