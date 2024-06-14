/**
 * 默认的分页组件配置
 * @param query
 * @param total
 * @returns {{total: *, pageSize: (Number|number), current: (Number|number), showSizeChanger: boolean, showTotal: (function(*): string), pageSizeOptions: string[]}}
 */
export default function (query, total, showSizeChanger, showQuickJumper, position = ['bottomCenter'],isShowTotal=false) {
    return {
        total: total,
        pageSize: parseInt(query.s, 10) || 10,
        current: parseInt(query.p, 10) || 1,
        showSizeChanger: showSizeChanger === undefined ? false : true,
        showTotal: total => showSizeChanger || isShowTotal ? `共 ${total} 条` : '',
        showQuickJumper: showQuickJumper === undefined ? false : true,
        // pageSizeOptions:['10', '30', '50', '100'],
        position
    }
}
