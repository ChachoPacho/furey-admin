//GLOBAL
const fillAsideMenu = async () => {
    let tables = "";

    for (const key of Object.keys((await getData({
            "table": true,
        })).table)) {
        tables += "<a class='collapse-item text-capitalize' href='/tables/" + key + "'>" + key + "</a>"
    }

    $('#AsideMenu').html(tables);
}


//TABLES
const fillTBodyTable = async data => {
    const table = $("#dataTable").attr("tableid");
    let elements = await getElements(data);
    const search = $('#webSearch').val() || $('#mobileSearch').val();
    elements = (search) ? filterSearch(elements, search) : elements;
    const {
        __ALL,
        __SHOW
    } = (await getData({
        "table": true,
        "tableid": table
    })).table;

    const order = (data) ? (data.orderby[1] === "desc") ? 'asc' : 'desc' : 'desc';

    let tableHeader = `<th class="text-center" style="width:40px"><input type="checkbox" id="checkALL"></th>`;
    let tableFooter = `<th class="text-center" style="width:40px"></th>`;
    let tableContEnd = '';

    for (const element of elements) {
        tableContEnd += `
            <tr id="` + element['id'] + `">
                <td class="text-center" style="width:40px">
                    <input type="checkbox">
                </td>
            `

        for (const index of __SHOW) {
            tableContEnd += "<td>" + element[index] + "</td>";
        }

        tableContEnd += `</tr>`;
    }

    for (const index of __SHOW) {
        tableHeader += `
            <th>
                <div class="d-flex">
                    <div class="dropdown">
                        <div class="dropdown-toggle text-capitalize" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            ${__ALL[index]}
                        </div>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <form class="d-flex fureyForm" action="/admin/object/${table}" method="PUT">
                                <input type="hidden" name="objtype" value="col">
                                <input type="hidden" name="origin" value="${index}">
                                <input class="mt-0 mx-2 p-1 text-capitalize" type="text" name="field" value="${__ALL[index]}">
                                <button type="submit" class="btn btn-warning me-2 p-1">
                                    <span class="text">Actualizar</span>
                                </button>
                            </form>
                        </div>
                    </div>
                    <div class="ms-auto" type="button" id="menu-${index}"
                        onclick="orderBy('${index}','${order}')">
                        <i class="fas fa-arrows-alt-v"></i>
                    </div>
                </div>
            </th>
            `;
        tableFooter += `
            <th class="text-capitalize">
                <div>${__ALL[index]}</div>
            </th>
            `;
    }

    $('#dataTable thead tr').html(tableHeader);
    $('#dataTable tfoot tr').html(tableFooter);
    $('#dataTable tbody').html(tableContEnd);
    table_animate();
}

const fillFormTable = async () => {
    const {
        __ALL
    } = (await getData({
        "table": true,
        "tableid": $("#dataTable").attr("tableid")
    })).table;

    let table = '';
    let checkBoxCol = '';
    let select = ""

    for (const index in __ALL) {
        checkBoxCol += `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" name="col[]" value="${index}" id="deleteCheckItem${index}">
            <label class="form-check-label text-capitalize" for="deleteCheckItem${index}">${__ALL[index]}</label>
        </div>`;
        table += `
        <div class="form-group">
            <label for="${index}FormInput" class="text-capitalize">${__ALL[index]}</label>
            <input type="text" name="${index}" class="form-control" id="${index}FormInput">
        </div>`;
        select += `<option value="${index}">${__ALL[index]}</option>`;
    }

    $('#tableForm').html(table);
    $('#selectAppendForm').html("<option value='check' selected>CHECK</option>" + select);
    $('#selectCreateForm').html(select);
    $('#deleteCheckBoxCol').html(checkBoxCol);
    __afterFill();
}

//UTILITIES
const fillUtilitiesTable = async () => {
    const elementsNames = await getData({
        "table": true
    });

    let tables = '';
    for (const name of Object.keys(elementsNames.table)) {
        let table = '';
        const {
            __ALL,
            __SHOW
        } = (await getData({
            "table": true,
            "tableid": name
        })).table;

        const qElements = Object.keys(__ALL).length;
        for (const element in __ALL) {
            let pos = (__SHOW.indexOf(element) !== -1) ? __SHOW.indexOf(element) + 1 : 0;
            table += `
            <div class="border-left-dark">
                <div class="card-body py-2 px-3 text-capitalize">
                    <div class="row">
                        <div class="col-6">${__ALL[element]}</div>
                        <div class="col-6 d-flex">
                            <input class="w-50 mx-auto" type="number" value="${pos}" name="pos[]" min="0" max="${qElements}">
                        </div>
                    </div>
                </div>
            </div>
            `;
        }

        tables += `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary text-capitalize">Tabla ${name}</h6>
                </div>
                <div class="card-body pt-0">
                    <div class="row py-2">
                        <div class="col-6 text-center text-gray-900"><strong>Campo</strong></div>
                        <div class="col-6 text-center text-gray-900"><strong>Posición</strong></div>
                    </div>
                    <form action="/admin/object/${name}" origen="utilities" method="PUT" id="utilForm-${name}" class="fureyForm">
                        <input type="hidden" name="objtype" value="util">
                        <input type="hidden" name="tableid" value="${name}">
                        ${table}
                        <div class="d-flex w-100 justify-content-end">
                            <a class="btn btn-success btn-icon-split w-50 mx-3 mb-1 mt-3 d-flex" onclick="$('#utilForm-${name}').submit()">
                                <span class="icon text-white-50 me-auto">
                                    <i class="fas fa-check"></i>
                                </span>
                                <span class="text me-auto">GUARDAR</span>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
    }
    $('#utilitiesTable').html(tables);
    __afterFill();
}