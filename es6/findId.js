const updateFirstCommentListById = (firstCommentList, targetId, property, newValue) => {
  let commentIndex = -1
  let secondCommentIndex = -1
  commentIndex = firstCommentList.findIndex(comment => comment.id === targetId)
  // 第一层找到
  if (commentIndex !== -1) {
    const updatedComment = firstCommentList[commentIndex]
    if (property === 'isLike') {
      if (newValue) {
        updatedComment.likeNum++
      } else {
        updatedComment.likeNum--
      }
    } else if (property === 'isDisLike') {
      if (newValue) {
        updatedComment.disLikeNum++
      } else {
        updatedComment.disLikeNum--
      }
    }
    updatedComment[property] = newValue
    // 更新第一层的特定元素
    console.log('firstCommentList[commentIndex]:', firstCommentList[commentIndex])
  } else {
    // 第一层未找到，循环遍历，寻找第二层
    for(let i = 0; i < firstCommentList.length; i++) {
      if (firstCommentList[i].commentList.length > 0) {
        secondCommentIndex = firstCommentList[i].commentList.findIndex(comment => comment.id === targetId)
        if (secondCommentIndex !== -1) {
          // 记录第一层的index
          commentIndex = i
          console.log(commentIndex)
          console.log(secondCommentIndex)
          const updatedComment = firstCommentList[commentIndex].commentList[secondCommentIndex]
          console.log('updatedComment:', updatedComment)
          if (property === 'isLike') {
            if (newValue) {
              updatedComment.likeNum++
            } else {
              updatedComment.likeNum--
            }
          } else if (property === 'isDisLike') {
            if (newValue) {
              updatedComment.disLikeNum++
            } else {
              updatedComment.disLikeNum--
            }
          }
          updatedComment[property] = newValue
          // 更新第二层的特定元素
          console.log('secondCommentIndex:', firstCommentList[commentIndex].commentList[secondCommentIndex], updatedComment)
          break
        }
      }
    }
  }
}

const data = [
  {
    id: 1,
    likeNum: 0,
    disLikeNum: 0,
    isLike: false,
    isDisLike: false,
    commentList: [
      { id: 2, likeNum: 0, disLikeNum: 0, isLike: false, isDisLike: false },
      { id: 3, likeNum: 0, disLikeNum: 0, isLike: false, isDisLike: false }
    ]
  },
  {
    id: 4,
    likeNum: 0,
    disLikeNum: 0,
    isLike: false,
    isDisLike: false,
    commentList: [
      { id: 5, likeNum: 0, disLikeNum: 0, isLike: false, isDisLike: false },
      { id: 6, likeNum: 0, disLikeNum: 0, isLike: false, isDisLike: false }
    ]
  }
]

// updateFirstCommentListById(data, 4, 'isLike', true)
// updateFirstCommentListById(data, 1, 'isDisLike', true)
updateFirstCommentListById(data, 3, 'isLike', true)
// updateFirstCommentListById(data, 6, 'isLike', true)
console.log(JSON.stringify(data))