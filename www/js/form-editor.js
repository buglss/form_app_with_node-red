(async function() {
  const creatorOptions = {
    showLogicTab: true,
    isAutoSave: false
  }

  const { formSchemaId, formSchema } = await getFormSchema()

  const creator = new SurveyCreator.SurveyCreator(creatorOptions)
  creator.text = JSON.stringify(formSchema)
  creator.saveSurveyFunc = (saveNo, callback) => {
    fetch("/form-schema", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({ formSchema: creator.JSON, formSchemaId: formSchemaId })
    })
      .then(async response => {
        if(response.ok) {
          const data = await response.json()
          location.search = "formSchemaId=" + data.id
          callback(saveNo, true)
        } else {
          callback(saveNo, false)
        }
      })
      .catch(error => {
        callback(saveNo, false)
      })
  }

  $(function() {
    creator.render("surveyCreator")
  })
})()