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
        const content = parent.content
        const lastIndex = content.lastIndexOf('____')
        if (lastIndex !== -1) {
          questionList[i].lastContent = content.slice(lastIndex + 4)
        }
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

function organizeQuestionListByChildrenList(questionList) {
  questionList.forEach(question => {
    if (Array.isArray(question.childrenList) && question.childrenList.length > 0) {
      questionList.push(...question.childrenList)
    }
    if (Array.isArray(question.materialQuestionList) && question.materialQuestionList.length > 0) {
      organizeQuestionListByChildrenList(question.materialQuestionList)
    }
  })
}

function restoreCategoryListByTemplate(categoryQuestionList, templateList) {
  const categoryMap = categoryQuestionList.reduce((acc, category) => (acc[category.name] = category, acc), {})
  templateList.forEach(template => {
    if (template.smallItem === 1) {
      const category = categoryMap[template.categoryName]
      if (category) {
        organizeQuestionListByChildrenList(category.questionList)
      }
    }
  })
  return categoryQuestionList
}

const organizedList = organizeCategoryQuestionList(categoryQuestionList)
const restoredList = restoreCategoryListByTemplate(organizedList, templateList)
console.log('organizedList: ', organizedList)
console.log('restoredList: ', restoredList)