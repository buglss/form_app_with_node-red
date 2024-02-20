(async function() {
    const { tableSchemaId, tableSchema } = await getTableSchema()

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