(async function() {
    const { tableSchemaId, tableSchema, remove } = await getTableSchema()

    if(remove) {
        fetch("/table/" + tableSchemaId, {
            method: 'DELETE'
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
        return 0
    }

    $(function() {
        $('#datatableContainer').DataTable({
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
    })
})()