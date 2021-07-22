var TABLE = $('#dataTable').attr('tableid');

const modifyElements = async () => {
    const {__ALL} = (await getData({
        'table': true,
        'tableid': TABLE
    })).table
    let table = "";
    let tableALL = '<input type="hidden" name="target" value="col">';
    const elementsChecked = $("td > input[type=checkbox]:checked");
    let i = 0;

    if (elementsChecked.length > 1) {
        $('#modifyClose').hide();
        $('#modifyContentALL').show();
    } else {
        $('#modifyClose').show();
        $('#modifyContentALL').hide();
    }

    for (const elementChecked of elementsChecked.parents('tr')) {

        let id = $(elementChecked).attr('id');
        const element = await getElements({
            search: ["id", id]
        });

        table += `
        <form action="/tables/${TABLE}" method="PUT" id="modifyForm-${i}" class="fureyForm border-bottom-info mb-3">
            <input type="hidden" name="target" value="col">
            <input type="hidden" name="id" value="${id}">
        `

        for (const index in __ALL) {
            if (elementsChecked.length > 1 && i == 0) {
                tableALL += `
                <div class="form-group d-flex">
                    <p class="text-capitalize my-auto">${__ALL[index]}:</p>
                    <input type="text" name="${index}" class="form-control ms-auto w-75">
                </div>`;
            }
            table += `
            <div class="form-group d-flex">
                <p class="text-capitalize my-auto">${__ALL[index]}:</p>
                <input type="text" name="${index}" class="form-control ms-auto w-75" value="${element[index]}">
            </div>`;
        }
        table += `
            <div class="w-100 d-flex">
                <button type="button" class="btn btn-warning ms-auto mb-2" onclick="$('#modifyForm-${i}').submit()">Modificar</button>
            </div>
        </form>
        `
        i++;
    }
    $('#modifyCheckedForm').html(tableALL);
    $('#modifyFormsContent').html(table);
    __afterFill();
}

const tr_animate = () => {
    $('tbody tr').click(e => {
        $('.selected_tr').removeClass('selected_tr').prev().removeClass('brother_selected_tr');
        $(e.currentTarget).addClass('selected_tr').prev().addClass('brother_selected_tr');
    })
};

const td_animate = () => {
    $('tbody > tr > td:not(:first-child)').dblclick(e => {
        let elem = $(e.currentTarget);
        if (!elem.children().length) elem.html(`<input type="text" value="${elem.html()}">`).children()[0].focus() ;
    }).on("focusout keydown", async e => {
        if (!(e.type === "keydown" && e.keyCode !== 13)) {
            let elem = $(e.currentTarget);
            let newValue = elem.children()[0].value;
            let id = [elem.html(newValue).parents('tr').attr('id')];
            let col = (await getData({'table': true, 'tableid': TABLE })).table.__SHOW[elem.index() - 1];
    
            console.log({ id: {[id]: newValue}, col: [col]})
            setData({ id: {[id]: newValue}, col: [col]});
        }
    })
}

const checkAlmostOne_animate = () => {
    if ($("td > input[type=checkbox]:checked").length == 0)  {
        $('.btnBlock').addClass('disabled');
        $('.contApply').hide();
        $('.contDeny').show();
    } else {
        $('.btnBlock').removeClass('disabled');
        $('.contApply').show();
        $('.contDeny').hide();
    };
};

const check_animate = () => {
    const allCheckBox = $("td > input[type=checkbox]");

    $("#checkALL").on("click", function () {
        allCheckBox.prop("checked", this.checked)
        checkAlmostOne_animate();
    });

    allCheckBox.on("click", function () {
        $("#checkALL").prop("checked", (allCheckBox.length == $("td > input[type=checkbox]:checked").length));
        checkAlmostOne_animate();
    });

    checkAlmostOne_animate();
}

const check_del_animate = () => {
    const allCheckBox = $("#deleteCheckBoxCol input[type=checkbox]");

    $("#deleteCheckItemFull").on("click", function () {
        allCheckBox.prop("checked", this.checked)
    });

    allCheckBox.on("click", function () {
        $("#deleteCheckItemFull").prop("checked", (allCheckBox.length == $("#deleteCheckBoxCol input[type=checkbox]:checked").length));
    });
}

const table_animate = () => {
    td_animate();
    tr_animate();
    check_animate();
    check_del_animate();
}