(async function() {
    const { formDataId, formData, formSchemaId, formSchema } = await getFormData()

    const survey = new Survey.Model(formSchema)
    survey.data = formData
    survey.onComplete.add((sender) => {
        fetch("/form", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({ formData: sender.data, formSchemaId, formDataId })
        })
            .then(async response => {
                if(response.ok) {
                    console.log(true)
                } else {
                    console.log(false)
                }
            })
            .catch(error => {
                console.log(error)
            })
    })

    $(function() {
        $("#surveyContainer").Survey({ model: survey })
    })
})()