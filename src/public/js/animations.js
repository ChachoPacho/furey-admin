var TABLE = $('#dataTable').attr('tableid');

const modifyElements = async () => {
    const {__ALL} = (await getData({
        'table': true,
        'tableid': TABLE
    })).table
    let table = "";
    const elementsChecked = $("td > input[type=checkbox]:checked");

    if (elementsChecked.length > 1) {
        $('#modifyContentONE').hide();
        $('#modifyContentALL').show();
        $('#modifyModalDialog').addClass('modal-xl');
        for (const index in __ALL) {
            table += `
            <div class="form-group d-flex">
                <p class="text-capitalize my-auto">${__ALL[index]}:</p>
                <input type="text" name="${index}" class="form-control ms-auto w-75">
            </div>`;
        }
        $('#modifyCheckedForm').html('<input type="hidden" name="target" value="col">' + table);
    } else {
        $('#modifyContentONE').show();
        $('#modifyContentALL').hide();
        $('#modifyModalDialog').removeClass('modal-xl');
        let id = elementsChecked.parents('tr').attr('id');
        const element = await getElements({
            search: ["id", id]
        });

        for (const index in __ALL) {
            table += `
            <div class="form-group d-flex">
                <p class="text-capitalize my-auto">${__ALL[index]}:</p>
                <input type="text" name="${index}" class="form-control ms-auto w-75" value="${element[index]}">
            </div>`;
        }
        $('#modifyForm').html(`<input type="hidden" name="target" value="col"><input type="hidden" name="id[]" value="${id}">` + table);
    }
    
    __afterFill();
}

const tr_animate = () => {
    $('tbody tr').click(e => {
        $('.selected_tr').removeClass('selected_tr').prev().removeClass('brother_selected_tr');
        $(e.currentTarget).addClass('selected_tr').prev().addClass('brother_selected_tr');
    })
};

const td_animate = () => {
    $('tbody > tr > td:not(:first-child):not([related])').dblclick(e => {
        let elem = $(e.currentTarget);
        if (!elem.children().length) elem.html(`<input type="text" value="${elem.html()}">`).children()[0].focus() ;
    }).on("focusout keydown", async e => {
        if (!(e.type === "keydown" && e.keyCode !== 13)) {
            const data = (await getData({'table': true, 'tableid': TABLE })).table;

            let elem = $(e.currentTarget);
            let newValue = elem.children()[0].value;
            let id = [elem.html(newValue).parents('tr').attr('id')];
            let col = data.__SHOW[elem.index() - 1];
    
            await setData({ id: id, [col]: newValue });
            fillRelateds(data, elem, id);
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