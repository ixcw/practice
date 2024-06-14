/**
 * 自动续费服务协议
 * @author:张江
 * date:2021年01月12日
 * */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Table } from 'antd';
import styles from './MSAgreement.less';

export default function MRAgreement({ hideModal, visible, closeModal, buttonVisible = true }) {

  return (<Modal width="950px" wrapClassName={styles.agreement}
    style={{ top: 50 }}
    visible={visible}
    onCancel={closeModal}
    maskClosable={false}
    title="自动续费服务协议"
    footer={null}>
    <div>
      <h3>尊敬的{window.$systemTitleName}用户：</h3>
      <p>本协议是{window.$systemTitleName}用户（下称“用户”）关于使用{window.$systemTitleName}提供的自动续费委托扣款服务（下称“本服务”）所订立的协议。本协议描述{window.$systemTitleName}与用户之间关于本服务的使用及相关方面的权利义务。“用户”及“您”均指代享受{window.$systemTitleName}提供本服务的个体。本协议构成用户使用{window.$systemTitleName}所提供的本服务之先决条件，除非用户接受本协议条款，否则用户无权使用本服务，用户选择使用本服务的行为将视为同意接受本协议当中的各项条款约束。</p>
      <h3>一、连续包月服务条款确认及接纳</h3>
      <p>1.1 连续包月服务涉及到的一切网络服务所有权及相关知识产权均归{window.$systemTitleName}依法所有，受中华人民共和国法律及国际公约的依法保护。本服务协议项下的条款效力范围及于{window.$systemTitleName}的一切网络服务，用户在完成注册程序并开始使用{window.$systemTitleName}所提供的自动续费服务时，均应当受本服务协议下的各项条款约束。
        <br />1.2 当用户使用自动续费服务时，用户的使用行为将被视为其对该服务的相关条款以及{window.$systemTitleName}在该服务中所发出的各类公告之同意及接受。</p>
      <h3>二、自动续费服务相关说明</h3>
      <p>2.1 本服务是基于用户对自动续费需求，在用户已开通本服务的前提下，为避免用户因疏忽或其他原因导致未能及时续费造成损失而推出的服务。用户开通该服务后，即同意{window.$systemTitleName}可在用户有效期即将过期时，依据支付渠道的扣款规则向用户账户发出扣款指令，并同意账户可以根据{window.$systemTitleName}发出的扣款指令，在不验证会员账户密码、支付密码、短信校验码等信息的情况下从账户中扣划下一个计费周期的费用。一旦扣款成功，{window.$systemTitleName}将为会员开通下一个计费周期的会员服务，且将在扣划成功的当天将扣划款项记入会员支付记录，并同时相应延长会员服务期限。该服务实现的前提是用户已将其{window.$systemTitleName}用户账号与上述账户绑定，且可成功从其上述账户中扣款。计费周期：月度（具体以{window.$systemTitleName}提供的为准），会员可自行选择。<br />
           2.2 自动续费具体指基于2.1的前提下，{window.$systemTitleName}通过上述账户收取用户下一计费周期费用的扣费方式。用户需保证{window.$systemTitleName}可以从上述账户扣款成功，如因账户可扣款余额不足等其他用户自身原因导致的续费失败，应由用户自行承担责任。<br />
          2.3 自动续费服务所涉及或可能衍生的相关一切知识产权权利均由{window.$systemTitleName}依法所有，用户不得因使用自动续费服务而自动获得其任一或全部权利。<br />
          2.4 {window.$systemTitleName}根据互联网的发展和中华人民共和国有关法律、法规的变化，不断地完善服务质量并依此修改服务条款。{window.$systemTitleName}有权就服务协议随时更新，毋须另行通知，且不因收回所述之使用而需承担任何的赔偿义务。<br />
          2.5 {window.$systemTitleName}建议用户，定期关注本服务协议的条款，当用户认为本服务协议之任一或全部条款的调整不可接受时，请及时终止对{window.$systemTitleName}所提供之相关服务。
      </p>
      <h3>三、自动续费服务协议有效期限及终止</h3>
      <p> 3.1 本服务长期有效，自您选择接受或使用本服务后生效，直至您终止（包括您主动终止及由于您违反相关协议、规则等而被终止）本服务或您通过本服务所接入的具体某项{window.$systemTitleName}在线服务时终止。<br />
        3.2 您有权随时根据本协议第四条的指引选择终止本服务，终止后本服务后，{window.$systemTitleName}将停止向您提供本服务。<br />
         3.3 您在选择终止本服务前已经委托{window.$systemTitleName}自动续费扣款的指令仍然有效，{window.$systemTitleName}对于基于该指令扣除的费用不予退还，由您承担相关责任。<br />
      </p>
      <h3>四、退订</h3>
      <p>{window.$systemTitleName}特别提醒用户：当用户开通使用自动续费服务后，即委托{window.$systemTitleName}在用户默认的支付渠道进行扣款，{window.$systemTitleName}将视为用户选择认购了{window.$systemTitleName}的相关付费服务。{window.$systemTitleName}将不以任何方式对用户所支付的费用予以退还。<br />
          4.1 支付宝客户端解约方式：“我的”--“设置”--“支付设置”--“免密支付”--“账户授权（新版本：自动扣款）”，找到{window.$systemTitleName}的业务并解约。<br />
          4.2 微信客户端解约方式：“钱包”-- 右上角“...”--“支付管理”--“扣费服务”，找到{window.$systemTitleName}的业务并停止扣费。<br />
          4.3 iOS系统解约方式：进入“iTunes App与App Store”，点击“Apple ID”，选择“查看Apple ID”，进入账号设置页面，点击“订阅”，选择对应的订阅项取消即可。<br />
      </p>
      <h3>五、自动续费服务双方的权利和义务</h3>
      <p>5.1 如在扣费过程出现问题，{window.$systemTitleName}应与用户密切配合查明原因，各自承担己方过错造成的损失；若因双方各自存在不均等过错造成损失，应由双方按过错程度承担对应程度的责任；双方共负责任的，由双方均摊责任。<br />
          5.2 本服务由用户自主选择是否取消，若用户未取消服务，则视为用户同意{window.$systemTitleName}继续按照一定规则进行续费扣款（长期有效、不受次数限制）。一旦完成扣款，{window.$systemTitleName}将为用户开通下一个计费周期服务。<br />
          5.3 若在自动续费时，{window.$systemTitleName}服务价格发生调整，应以当前有效的价格为准。<br />
          5.4 {window.$systemTitleName}对开通本服务不收取任何费用，但{window.$systemTitleName}有权根据未来业务需要或市场变化等相关原因，决定是否对本服务本身进行收费或调整自动续费周期及费用，并在相关页面向用户进行公示。<br />
          5.5 对于所选择的支付渠道，用户有义务定期关注并确保该支付方式的账户下有充足的余额用于满足自动续费服务的应用。如因前述原因（包括但不限于余额不足）而导致无法完成自动续费服务，则{window.$systemTitleName}有权在不再作另行通知的前提下，暂停用户通过自动续费服务所接入的相关服务。
      </p>
      <h3>六、合法性保证</h3>
      <p>您认可并保证：不使用本服务直接或间接地从事以下违反国家法律法规及社会公序良俗之道德保留之行为：</p>
      <p>（1）违反宪法确定的基本原则的；<br />
      （2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；<br />
      （3）损害国家荣誉和利益的；<br />
      （4）煽动民族仇恨、民族歧视，破坏民族团结的；<br />
      （5）破坏国家宗教政策，宣扬邪教和封建迷信的；<br />
      （6）散布谣言，扰乱社会秩序，破坏社会稳定的；<br />
      （7）散布淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的；<br />
      （8）侮辱或者诽谤他人，侵害他人合法权益的；<br />
      （9）煽动非法集会、结社、游行、示威、聚众扰乱社会秩序的；<br />
      （10）以非法民间组织名义活动的；<br />
（11）含有法律、行政法规禁止的其他内容的。</p>
      <p>{window.$systemTitleName}有权对您就使用本服务之行为进行不定期监督，一旦发现您涉及上述之行为，{window.$systemTitleName}有权收回您对本服务的使用权而不对您作出任何的赔偿。同时，{window.$systemTitleName}将依法向国家机关就您之行为进行举报并保留进一步追究您的行为而导致{window.$systemTitleName}损失之权利。</p>
      <h3>七、商业化禁止</h3>
      <p>您认可并同意：在未获得{window.$systemTitleName}正式书面公开许可之前，您不得就其所获得之本服务用于非{window.$systemTitleName}在线服务的其它领域，亦不得直接或间接地对本服务进行任何商业化（包括但不限于：转售、贩卖、等价置换等）的行为。一旦发现您涉及上述行为，{window.$systemTitleName}有权收回您对本服务的使用权而不对您作出任何的赔偿，并保留进一步追究您之行为而导致{window.$systemTitleName}损失之权利。</p>

    </div>
    {
      buttonVisible ? <Button type="primary" size="large" onClick={hideModal}>已阅读</Button>
        : <Button type="primary" size="large" onClick={() => { closeModal(1) }}>已阅读并同意付款协议</Button>
    }

  </Modal>);
}

MRAgreement.propTypes = {
  hideModal: PropTypes.func,
  closeModal: PropTypes.func,
  visible: PropTypes.bool,
};
