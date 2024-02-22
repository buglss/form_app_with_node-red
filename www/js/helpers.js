(function() {
    globalThis.getFormSchema = async () => {
        const queryString = window.location.search
        const parameters = new URLSearchParams(queryString)
        const formSchemaId = parameters.get("formSchemaId")

        const formSchemaRes = await fetch("/form-schema/" + formSchemaId)
        const formSchema = await formSchemaRes.json()

        return { formSchemaId, formSchema }
    }

    globalThis.getFormData = async () => {
        const queryString = window.location.search
        const parameters = new URLSearchParams(queryString)
        const formSchemaId = parameters.get("formSchemaId")
        const formDataId = parameters.get("formDataId")
        const remove = parameters.get("remove")

        const formSchemaRes = await fetch("/form-schema/" + formSchemaId)
        const formSchema = await formSchemaRes.json()

        const formDataRes = await fetch("/form/" + formSchemaId + "/" + formDataId)
        const formData = await formDataRes.json()

        return { formSchemaId, formSchema, formDataId, formData, remove }
    }

    globalThis.getTableSchema = async () => {
        const queryString = window.location.search
        const parameters = new URLSearchParams(queryString)
        const tableSchemaId = parameters.get("tableSchemaId")
        const remove = parameters.get("remove")

        const tableSchemaRes = await fetch("/table-schema/" + tableSchemaId)
        const tableSchema = await tableSchemaRes.json()

        return { tableSchemaId, tableSchema, remove }
    }
})()