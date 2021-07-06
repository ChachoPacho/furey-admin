//GLOBAL
async function fillAsideMenu() {
    const elementsNames = await getData({
        "table": true,
    });
    let tables = "";

    for (const key of Object.keys(elementsNames.table)) {
        tables += "<a class='collapse-item text-capitalize' href='/tables/" + key + "'>" + key + "</a>"
    }

    $('#AsideMenu').html(tables);
}


//TABLES
async function fillTBodyTable(data) {
    const table = $("#tableForm").attr("tableid");
    const elements = await getElements(table, data);
    const elementsNames = await getData({
        "table": true,
        "tableid": table
    });

    let tableHeader = '';
    let tableFooter = '';
    let tableContEnd = '';

    for (const element of elements) {
        tableContEnd += `<tr id="` + element['id'] + `">`

        for (const index of elementsNames.table.__SHOW) {
            tableContEnd += "<td>" + element[index] + "</td>";
        }

        tableContEnd += `
            <td style="width: 100px">
                <div class="d-flex justify-content-around">
                    <a href="" onclick="changeModaltoUpdate('` + table + `','` + element['id'] + `')" class="btn btn-warning btn-circle btn-sm" data-toggle="modal" data-target="#tableModal" type="button">
                        <i class="fas fa-flag"></i>
                    </a>
                    <a href="" onclick="sendDeleteRequest('` + table + `','` + element['id'] + `')" class="btn btn-danger btn-circle btn-sm">
                        <i class="fas fa-trash"></i>
                    </a>
                </div>
            </td>
        </tr>`;
    }

    for (const index of elementsNames.table.__SHOW) {
        tableHeader += `
        <th class="text-capitalize">
            <div class="d-flex">
                <div>${index}</div>
                <div class="ms-auto" type="button" id="menu-${index}"
                    onclick="orderBy('${index}','asc')">
                    <i class="fas fa-arrows-alt-v"></i>
                </div>
            </div>
        </th>
        `;
        tableFooter += `
        <th class="text-capitalize">
            <div>${index}</div>
        </th>
        `;
    }

    tableHeader += `<th class="text-center" style="width: 100px !important">ADMIN</th>`;
    tableFooter += `<th class="text-center" style="width: 100px !important">ADMIN</th>`;

    $('#dataTable thead tr').html(tableHeader);
    $('#dataTable tfoot tr').html(tableFooter);
    $('#dataTable tbody').html(tableContEnd);
}

async function fillFormTable() {
    const elementsNames = await getData({
        "table": true,
        "tableid": $("#tableForm").attr("tableid")
    });

    let table = '';
    let checkBoxCol = '';
    let select = "<option value='admin' selected>ADMIN</option>"


    for (const index in elementsNames.table) {
        if (index === "__SHOW") { continue };
        table += `
        <div class="form-group">
            <label for="${index}" class="text-capitalize">${index}</label>
            <input type="text" name="${index}" class="form-control" id="${index}FormInput">
        </div>`;
        select += `<option value="${index}">${index}</option>`;
        checkBoxCol += `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" name="col[]" value="${index}" id="deleteCheckItem${index}">
            <label class="form-check-label text-capitalize" for="deleteCheckItem${index}">${index}</label>
        </div>`;
    }

    $('#tableForm').html(table);
    $('#selectAppendForm').html(select);
    $('#deleteCheckBoxCol').html(checkBoxCol);
}

async function changeModaltoUpdate(table, id) {
    $('#tableModalLabel').html('Modificar Entrada');
    const btn = $('#tableFormBTN');
    btn.html('Actualizar');
    btn.addClass('btn-warning');
    btn.removeClass('btn-success');
    $('#tableForm').attr('action', '/tables/' + table + '/' + id);

    const element = await getElement(table, id);
    const elementNames = await getData({
        'table': true,
        'tableid': table
    })

    for (const index in elementNames.table) {
        $('#' + index + 'FormInput').val(element[index]);
    }
}

async function changeModaltoCreate(table) {
    $('#tableModalLabel').html('Crear Entrada');
    const btn = $('#tableFormBTN');
    btn.html('Crear');
    btn.removeClass('btn-warning');
    btn.addClass('btn-success');

    const modalForm = $('#tableForm');
    modalForm.attr('action', '/tables/' + table);

    modalForm[0].reset();
}

function orderBy(namespace, type) {
    $('#menu-' + namespace).attr('onclick', "orderBy('" + namespace + "', '" + ((type === "desc") ? "asc" : "desc") + "')")
    fillTBodyTable({
        orderby: [namespace, type]
    })
};


//UTILITIES
async function fillUtilitiesTable() {
    const elementsNames = await getData({"table": true,});

    let tables = '';
    let table
    for (const name of Object.keys(elementsNames.table)) {
        table = '';
        const elements = await getData({
            "table": true,
            "tableid": name
        });

        const qElements = Object.keys(elements.table).length;

        for (const element in elements.table) {
            table += `
            <div class="border-left-dark">
                <div class="card-body py-2 px-3 text-capitalize">
                    <div class="row">
                        <div class="col-6">${element}</div>
                        <div class="col-6 d-flex">
                            <input class="w-50 mx-auto" type="number" value="0" name="pos-${element}" min="0" max="${qElements}">
                        </div>
                    </div>
                </div>
            </div>
            `;
        }

        tables += `
        <div class="col-12 col-md-4">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary text-capitalize">Tabla ${name}</h6>
                </div>
                <div class="card-body pt-0">
                    <div class="row py-2">
                        <div class="col-6 text-center text-gray-900"><strong>Campo</strong></div>
                        <div class="col-6 text-center text-gray-900"><strong>Posición</strong></div>
                    </div>
                    <form action="/admin/object/${name}" origen="utilities" method="PUT" id="tableForm">
                        ${table}
                    </form>
                </div>
            </div>
        </div>
        `;
    }
    $('#utilitiesTable').html(tables);
}