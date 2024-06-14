import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { StudentData as namespace } from '@/utils/namespace'
import { useEffect, useState, memo } from 'react'
import { Drawer, Button, Transfer, Select, Icon, Input, message, Row, Col, Radio, TreeSelect, Cascader } from 'antd'
import { getIcon, doHandleYear } from '@/utils/utils'
import userInfoCache from '@/caches/userInfo' //权限组件

const IconFont = getIcon()

function index(props) {
	const loginUserInfo = userInfoCache() || {}

	const { dispatch, topDrawerVisible, topDrawerIncident } = props
	const [tempStudentList, setTempStudentList] = useState([]) // 数据源
	const [targetKeys, setTargetKeys] = useState([]) // 右侧的数据
	const [selectedKeys, setSelectedKeys] = useState([]) //选中的条目
	const [leftStudent, setLeftStudent] = useState([]) //左侧学生列表

	const [spoceList, setSpoceList] = useState([]) //存储学校学级左
	const [classOptions, setClassOptions] = useState([]) // 存储班级下拉框

	const [selectedValue, setSelectedValue] = useState(null) //存储转班类型

	const [spoceList1, setSpoceList1] = useState([]) //存储班主任班级学级右
	const [classOptions1, setClassOptions1] = useState([]) // 存储班级下拉框

	const [allClass, setAllClass] = useState([]) //存储班主任管理得班级信息
	const [gradeId, setGradeId] = useState() //存储左侧年级id
	const [spoceDate, setSpoceDate] = useState(null)
	const [spoceDate1, setSpoceDate1] = useState(null)

	const [newClass, setNewClass] = useState(null)
	const [oldClass, setOldClass] = useState(null)

	useEffect(() => {
		if (loginUserInfo.code == 'SCHOOL_ADMIN') {
			//学校管理员
			//获取当前学校学级班级信息
			dispatch({
				type: namespace + '/getGrateStatusClassData',
				callback: res => {
					if (res?.result) {
						setSpoceList(
							res?.result?.spoceList.map(item => {
								return {
									label: item.id,
									value: item.id
								}
							})
						)
					}
				}
			})
		}
		if (loginUserInfo.code == 'CLASS_HEAD') {
			// 班主任

			//请求班级列表
			dispatch({
				type: namespace + '/getTeacherManegeClass',
				callback: res => {
					setAllClass(res.result)
					const list = res.result
						.map(item => {
							return {
								label: item.spoce,
								value: item.spoce
							}
						})
						.filter((item, index, self) => index === self.findIndex(obj => JSON.stringify(obj) === JSON.stringify(item)))
					setSpoceList(list)
				}
			})
		}

		setClassValue1(null)
		setClassValue(null)
		setClassLabel1(null)
		setClassLabel(null)
		setRightStudent([])
		setLeftStudent([])
		setSpoceList1([])
		setSpoceList([])
		setSelectedValue(null)
		setTempStudentList([])
		setSelectedKeys([])
		setClassOptions([])
		setClassOptions1([])
		setTargetKeys([])
		setNewClass(null)
		setOldClass(null)
		setSpoceDate1(null)
	}, [topDrawerVisible])

	//关闭抽槽
	const onCloseStudentMigration = () => {
		topDrawerIncident(!topDrawerVisible)
	}

	const [rightStudent, setRightStudent] = useState([])
	//左侧事件

	const handleChange = (nextTargetKeys, direction, moveKeys) => {
		setTargetKeys(nextTargetKeys)
		if (direction == 'right') {
			setRightStudent([...rightStudent, ...moveKeys])
		}
		if (direction == 'left') {
			setRightStudent(rightStudent.filter(item => !moveKeys.includes(item)))
		}
	}
	//点击右侧选中
	const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
		setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
	}

	//点击保存时
	const saveTransferData = () => {
		if (selectedValue == null) {
			message.error('请选择迁移类型')
			return
		}
		dispatch({
			type: namespace + '/postStudentMessageBatchAdjust',
			payload: {
				studentIds: rightStudent,
				classId: classValue1,
				operate: selectedValue,
				oldName: oldClass,
				newName: newClass
			},
			callback: res => {
				if (res.result == 'success') {
					message.success('批量迁移成功')

					topDrawerIncident(!topDrawerVisible)
				} else {
					// message.error("批量迁移失败")
				}
			}
		})
	}
	//点击转班还是跳级
	const radioChange = e => {
		setSelectedValue(e.target.value)

		setClassLabel1(null)
		setClassOptions1([])
		setSpoceDate1(null)
		setTargetKeys([])
		setNewClass(null)
		setTempStudentList([...leftStudent])

		if (e.target.value == '转班') {
			if (loginUserInfo.code == 'SCHOOL_ADMIN') {
				//学校管理员
				dispatch({
					type: namespace + '/getGrateStatusClassData',
					callback: res => {
						if (res?.result) {
							setSpoceList1(
								res?.result?.spoceList.map(item => {
									return {
										label: item.id,
										value: item.id
									}
								})
							)
						}
					}
				})
			}
			if (loginUserInfo.code == 'CLASS_HEAD') {
				// 班主任

				setSpoceList1(spoceList)
			}
		}
		if (e.target.value == '跳级') {
			//获取当前学校学级班级信息
			dispatch({
				type: namespace + '/getGrateStatusClassData',
				callback: res => {
					if (res?.result) {
						setSpoceList1(
							res?.result?.spoceList.map(item => {
								return {
									label: item.id,
									value: item.id
								}
							})
						)
					}
				}
			})
		}
	}

  const [classValue, setClassValue] = useState(null);
  // 左侧学级改变
  const handleLeftSpoceChange = (e) => {
    setSpoceDate(e);
    setClassValue(null);
    setClassLabel(null);
    setTempStudentList([]);
    setOldClass(null);
    setNewClass(null);
    setClassLabel1(null);

    if (loginUserInfo.code == "SCHOOL_ADMIN") {
      //学校管理员
      dispatch({
        type: namespace + "/getSpoceGradeClass",
        payload: { spoceId: e },
        callback: (res) => {
          const tem = res.result?.studyList
            ?.map((item) => {
              return {
                label: item.name,
                value: item.name,
                children: item.stuGradeList
                  ?.filter((e) => e.stuCalssList.length != 0)
                  .map((item1) => {
                    return {
                      label: item1.name,
                      value: item1.id,
                      children: item1.stuCalssList?.map((item2) => {
                        return {
                          label: item2.name,
                          value: item2.id,
                        };
                      }),
                    };
                  }),
              };
            })
            .filter((e) => e.children.length != 0);

					setClassOptions(tem)
				}
			})
		}
		if (loginUserInfo.code == 'CLASS_HEAD') {
			// 班主任

			const tem = allClass
				?.filter(item => item.spoce == e)
				.map(item => {
					return {
						label: item.name,
						value: item.id
					}
				})
			setClassOptions(tem)
		}
	}

  //左侧班级改变
  const [classLabel, setClassLabel] = useState(null);

  const classStudentData = (value, selectedOptions) => {
    setClassLabel1(null);
    setTempStudentList([]);

    // 班主任
    if (loginUserInfo.code == "CLASS_HEAD") {
      if (value[0] == classValue1) {
        message.error("不能选择相同班级");
        return;
      }
      setClassLabel(value);
      setClassValue(value[0]);
      //存储年级id
      const gradeData = allClass.filter((item) => item.id == value[0]);
      setGradeId(gradeData[0].gradeId);
      setOldClass(selectedOptions[0].label);
    }
    if (loginUserInfo.code == "SCHOOL_ADMIN") {
      if (value[1] == classValue1) {
        message.error("不能选择相同班级");
        return;
      }
      setClassLabel(value);
      setClassValue(value[2]);
      //存储年级id
      setGradeId(value[1]);
      setOldClass(selectedOptions[2].label);
    }

    dispatch({
      type: namespace + "/getQueryAllStudentMessage",
      payload: {
        spoce: spoceDate,
        classId: loginUserInfo.code == "CLASS_HEAD" ? value[0] : value[2],
      },
      callback: (res) => {
        if (JSON.stringify(res.result) !== "{}") {
          setLeftStudent(
            res.result.map((item) => {
              return {
                key: item.id,
                name: item.userName,
              };
            })
          );
          setTempStudentList(
            res.result.map((item) => {
              return {
                key: item.id,
                name: item.userName,
              };
            })
          );
        }
      },
    });
  };

  const [classValue1, setClassValue1] = useState(null);
  const [classLabel1, setClassLabel1] = useState(null);

  //右侧学级改变

	const handleRightSpoceChange = value => {
		setSpoceDate1(value)
		setClassValue1(null)
		setClassLabel1(null)
		setNewClass(null)
		setTargetKeys([])
		setTempStudentList([...leftStudent])

    if (selectedValue != null) {
      dispatch({
        type: namespace + "/getSpoceGradeClass",
        payload: { spoceId: value },
        callback: (res) => {
          if (selectedValue == "转班") {
            const tem1 = res.result?.studyList
              ?.map((element) => {
                return {
                  stuGradeList: element.stuGradeList.filter(
                    (item) => item.id == gradeId
                  ),
                  name: element.name,
                };
              })
              .filter((item) => item.stuGradeList.length > 0);

						const tem = tem1
							?.map(item => {
								return {
									label: item.name,
									value: item.name,
									children: item.stuGradeList
										?.filter(e => e.stuCalssList.length != 0)
										.map(item1 => {
											return {
												label: item1.name,
												value: item1.name,
												children: item1.stuCalssList?.map(item2 => {
													return {
														label: item2.name,
														value: item2.id
													}
												})
											}
										})
								}
							})
							.filter(e => e.children.length != 0)

						setClassOptions1(tem)
					}

					if (selectedValue == '跳级') {
						const tem1 = res.result?.studyList
							?.map(element => {
								return {
									stuGradeList: element.stuGradeList.filter(item => item.id !== gradeId),
									name: element.name
								}
							})
							.filter(item => item.stuGradeList.length > 0)

            const tem = tem1
              ?.map((item) => {
                return {
                  label: item.name,
                  value: item.name,
                  children: item.stuGradeList
                    ?.filter((e) => e.stuCalssList.length != 0)
                    .map((item1) => {
                      return {
                        label: item1.name,
                        value: item1.name,
                        children: item1.stuCalssList?.map((item2) => {
                          return {
                            label: item2.name,
                            value: item2.id,
                          };
                        }),
                      };
                    }),
                };
              })
              .filter((e) => e.children.length != 0);

						setClassOptions1(tem)
					}
				}
			})
		} else {
			message.error('请先选择迁移类型')
		}
	}

  //右侧班级改变
  const [status1, setStatus1] = useState(null);
  const classStudentData1 = (value, selectedOptions) => {
    if (value[2] == classValue) {
      setStatus1("error");
      message.error("不能选择相同班级");
      return;
    } else {
      setStatus1(null);
    }
    setClassValue1(value[2]);
    setClassLabel1(value);
    setNewClass(selectedOptions[2].label);

		dispatch({
			type: namespace + '/getQueryAllStudentMessage',
			payload: { spoce: spoceDate1, classId: value[2] },
			callback: res => {
				if (JSON.stringify(res.result) !== '{}') {
					const rightData = res.result.map(item => {
						return {
							key: item.id,
							name: item.userName,
							disabled: 'false'
						}
					})
					setTempStudentList([...leftStudent, ...rightData])
					setTargetKeys(rightData.map(item => item.key))
				}
			}
		})
	}
	const displayRender = labels => {
		if (!classLabel1) {
			return null // 清空时不显示任何内容
		}
		return labels[labels.length - 1] // 显示子节点的标签
	}
	const displayRender1 = labels => {
		if (!classLabel) {
			return null // 清空时不显示任何内容
		}
		return labels[labels.length - 1] // 显示子节点的标签
	}
	return (
		<Drawer
			destroyOnClose
			className={'student-migration-box'}
			title={
				<div>
					<IconFont type={'icon-shujuqianyi'} />
					<span> 学生迁移</span>
				</div>
			}
			width={660}
			closable={false}
			onClose={onCloseStudentMigration}
			visible={topDrawerVisible}>
			<div>
				<span style={{ fontSize: '20px', fontWeight: '500' }}>迁移类型：</span>
				<Radio.Group onChange={radioChange} defaultChecked={false} value={selectedValue}>
					<Radio value='转班'> 转班 </Radio>
					<Radio value='跳级'> 跳级 </Radio>
				</Radio.Group>
			</div>
			<div className={'class-info-box'}>
				<div className={'class-info-title'}>班级信息</div>
				<div className={'class-form-box'} style={{ padding: 0 }}>
					<Row>
						<Col span={12}>
							<div style={{ marginBottom: '10px' }}>
								届别：
								<Select options={spoceList} onChange={handleLeftSpoceChange} getCalendarContainer={triggerNode => triggerNode.parentNode} style={{ width: 'calc(100% - 100px)' }}></Select>
							</div>
							<div style={{ marginBottom: '10px' }}>
								班级：
								<Cascader value={classLabel} allowClear={false} displayRender={displayRender1} options={classOptions} onChange={classStudentData} style={{ width: 'calc(100% - 100px)' }}></Cascader>
							</div>
						</Col>
						<Col span={12} push={1}>
							<div style={{ marginBottom: '10px' }}>
								届别：
								<Select
									value={spoceDate1}
									options={spoceList1}
									notFoundContent='请先选择迁移类型和左侧数据'
									onChange={handleRightSpoceChange}
									getCalendarContainer={triggerNode => triggerNode.parentNode}
									style={{ width: 'calc(100% - 100px)' }}></Select>
							</div>
							<div style={{ marginBottom: '10px' }}>
								班级：
								<Cascader
									value={classLabel1}
									allowClear={false}
									notFoundContent='请选择'
									displayRender={displayRender}
									options={classOptions1}
									onChange={classStudentData1}
									style={{ width: 'calc(100% - 100px)' }}></Cascader>
							</div>
						</Col>
					</Row>
				</div>
			</div>

			<div>
				<Transfer
					dataSource={tempStudentList}
					titles={[oldClass, newClass]}
					listStyle={{
						width: 280,
						height: 600
					}}
					showSearch={true}
					locale={{
						itemUnit: '名学生',
						itemsUnit: '名学生',
						searchPlaceholder: '请输入搜索内容'
					}}
					targetKeys={targetKeys}
					selectedKeys={selectedKeys}
					onChange={handleChange}
					onSelectChange={handleSelectChange}
					render={item => item.name}
				/>
			</div>

			<div
				style={{
					position: 'absolute',
					bottom: 0,
					width: '100%',
					borderTop: '1px solid #e8e8e8',
					padding: '10px 16px',
					textAlign: 'right',
					left: 0,
					background: '#fff',
					borderRadius: '0 0 4px 4px'
				}}>
				<Button
					style={{
						marginRight: 8
					}}
					onClick={onCloseStudentMigration}>
					取消
				</Button>
				<Button onClick={saveTransferData} type='primary'>
					保存
				</Button>
			</div>
		</Drawer>
	)
}

const mapStateToProps = state => {
	return {
		DictionaryDictGroups: state[namespace].DictionaryDictGroups,
		DictionaryAddress: state[namespace].DictionaryAddress
	}
}
export default memo(connect(mapStateToProps)(index))
