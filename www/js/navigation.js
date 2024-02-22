(async function() {
    const onhashchangeFunc = function(event = { newURL: window.location }) {
        const newURL = new URL(event.newURL)

        const [hash, queryString] = newURL.hash.substring(1).split("?")
        const parameters = new URLSearchParams(queryString)
        const paths = hash.split("/")

        const base = paths[0]

        $(async function() {
            const spinnerHTML = `<div class="spinner-border" role="status"><span class="visually-hidden">Yükleniyor...</span></div>`

            const contentContainer = $("#contentContainer")
            contentContainer.html(spinnerHTML)

            const contentTitle = $("#contentTitle")

            if(base === "form") {
                const formSchemaId = parameters.get("formSchemaId")
                const formDataId = parameters.get("formDataId")
                const remove = parameters.get("remove")
                const formSchemaRes = await fetch("/form-schema/" + formSchemaId)
                const formSchema = await formSchemaRes.json()
                const formDataRes = await fetch("/form/" + formSchemaId + "/" + formDataId)
                const formData = await formDataRes.json()

                contentTitle.text("FORM")

                if(remove) {
                    fetch("/form/" + formSchemaId, {
                        method: 'DELETE'
                    })
                        .then(async response => {
                            contentContainer.html(`<div class="alert alert-success" role="alert">Silme işlemi başarıyla tamamlandı.</div>`)
                            if(response.ok) {
                                console.log(true)
                            } else {
                                console.log(false)
                            }
                        })
                        .catch(error => {
                            contentContainer.html(`<div class="alert alert-danger" role="alert">Silme işlemi başarısız oldu.</div>`)
                            console.log(error)
                        })
                    return 0
                }

                let survey = new Survey.Model(formSchema)
                survey.data = formData.formData
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

                const surveyContainerHTML = $(`<div />`, { id: "surveyContainer" })
                contentContainer.html(surveyContainerHTML)
                if(surveyContainerHTML.Survey) {
                    surveyContainerHTML.Survey({ model: survey })
                } else {
                    survey.render("surveyContainer")
                }
            } else if(base === "form-editor") {
                const formSchemaId = parameters.get("formSchemaId")
                const formSchemaRes = await fetch("/form-schema/" + formSchemaId)
                const formSchema = await formSchemaRes.json()

                let creatorOptions = {
                    showLogicTab: true,
                    isAutoSave: false
                }

                contentTitle.text("FORM EDITOR")

                let creator = new SurveyCreator.SurveyCreator(creatorOptions)
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

                const surveyCreatorHTML = $(`<div />`, {
                    id: "surveyCreator", css: {
                        "height": "100vh"
                    }
                })
                contentContainer.html(surveyCreatorHTML)
                if(surveyCreatorHTML.Survey) {
                    creator.Survey({ model: survey })
                } else {
                    creator.render("surveyCreator")
                }
            } else if(base === "table") {
                const tableSchemaId = parameters.get("tableSchemaId")
                const remove = parameters.get("remove")
                const tableSchemaRes = await fetch("/table-schema/" + tableSchemaId)
                const tableSchema = await tableSchemaRes.json()

                contentTitle.text("TABLE")

                if(remove) {
                    fetch("/table/" + tableSchemaId, {
                        method: 'DELETE'
                    })
                        .then(async response => {
                            contentContainer.html(`<div class="alert alert-success" role="alert">Silme işlemi başarıyla tamamlandı.</div>`)
                            if(response.ok) {
                                console.log(true)
                            } else {
                                console.log(false)
                            }
                        })
                        .catch(error => {
                            contentContainer.html(`<div class="alert alert-danger" role="alert">Silme işlemi başarısız oldu.</div>`)
                            console.log(error)
                        })
                    return 0
                }

                const datatableContainerHTML = $(`<table />`, { id: "datatableContainer" })
                contentContainer.html(datatableContainerHTML)

                datatableContainerHTML.DataTable({
                    serverSide: true,
                    ajax: "/table/" + tableSchemaId,
                    columns: tableSchema.map(x => {
                        x.title = x.title === "null" ? "" : x.title
                        x.render = function(data, type, row, meta) {
                            return type === "display"
                                ? x.template
                                    ? Mustache.render(x.template || "", row)
                                    : data
                                : ""
                        }
                        return x
                    })
                })
            } else {
                contentTitle.text("Dashboard")
                contentContainer.html("")
            }
        })
    }
    window.addEventListener("hashchange", onhashchangeFunc)
    if(window.location.hash) onhashchangeFunc()
})()