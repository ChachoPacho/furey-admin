const changeModaltoUpdate = async (table, id) => {
    $('#tableModalLabel').html('Modificar Entrada');
    $('#tableFormBTN').html('Actualizar').addClass('btn-warning').removeClass('btn-success');
    $('#tableForm').attr('action', '/tables/' + table + '/' + id);

    const element = await getElements({
        search: ['id', id]
    });
    const {
        __ALL
    } = (await getData({
        'table': true,
        'tableid': table
    })).table

    for (const index in __ALL) $('#' + index + 'FormInput').val(element[index]);
}

const changeModaltoCreate = async table => {
    $('#tableModalLabel').html('Crear Entrada');
    $('#tableFormBTN').html('Crear').removeClass('btn-warning').addClass('btn-success');
    $('#tableForm').attr('action', '/tables/' + table)[0].reset();
}

const tr_animate = () => {
    $('tbody tr').click(e => {
        $('.selected_tr').removeClass('selected_tr').prev().removeClass('brother_selected_tr');
        $(e.currentTarget).addClass('selected_tr').prev().addClass('brother_selected_tr');
    })
};

const th_animate = () => {
    $('.fieldName').dblclick(e => {
        $(e.currentTarget).attr('readonly', false)
    })
};

const prevDelete = () => ($("td > input[type=checkbox]:checked").length == 0) ? $('#deleteChecked').hide() : $('#deleteChecked').show();

const check_animate = () => {
    const allCheckBox = $("td > input[type=checkbox]");

    $("#checkALL").on("click", function () {
        allCheckBox.prop("checked", this.checked)
        prevDelete();
    });

    allCheckBox.on("click", function () {
        $("#checkALL").prop("checked", (allCheckBox.length == $("td > input[type=checkbox]:checked").length));
        prevDelete();
    });

    prevDelete();
}

const table_animate = () => {
    th_animate();
    tr_animate();
    check_animate();
}