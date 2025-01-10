function organizeQuestionListByParentId(questionList) {
  const questionMap = new Map()
  questionList.forEach(question => {
    question.childrenList = []
    questionMap.set(question.id, question)
  })
  for (let i = questionList.length -1; i >= 0; i--) {
    if (questionList[i].parentId) {
      const parent = questionMap.get(questionList[i].parentId)
      if (parent) {
        parent.childrenList.unshift(questionList[i])
        questionList.splice(i, 1)
      }
    }
  }
}

function organizeMaterialQuestionList(materialQuestionList) {
  if (Array.isArray(materialQuestionList) && materialQuestionList.length > 0) {
    organizeQuestionListByParentId(materialQuestionList)
    materialQuestionList.forEach(materialQuestion => {
      if (Array.isArray(materialQuestion.materialQuestionList) && materialQuestion.materialQuestionList.length > 0) {
        organizeMaterialQuestionList(materialQuestion.materialQuestionList)
      }
    })
  }
}

function organizeCategoryQuestionList(categoryQuestionList) {
  categoryQuestionList.forEach(categoryQuestion => {
    if (Array.isArray(categoryQuestion.questionList) && categoryQuestion.questionList.length > 0) {
      const questionList = categoryQuestion.questionList
      organizeQuestionListByParentId(questionList)
      questionList.forEach(question => {
        if (Array.isArray(question.materialQuestionList) && question.materialQuestionList.length > 0) {
          const materialQuestionList = question.materialQuestionList
          organizeQuestionListByParentId(materialQuestionList)
        }
      })
    }
  })
  return categoryQuestionList
}

const organizedList = organizeCategoryQuestionList(categoryQuestionList)
console.log(organizedList)