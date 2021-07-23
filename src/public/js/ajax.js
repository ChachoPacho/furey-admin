const getChecked = (all=false) => {
  let id = [];
  const checkeds = $("td > input[type=checkbox]:checked").parents('tr');
  checkeds.each(function () { id.push($(this).attr('id')) });
  return (all) ? {id: id, items: checkeds} : id ;
}

const setChecked = (ids) => {
  for (const id of ids) {
    $('#' + id).find("input[type=checkbox]").attr("checked", 'true');
  }
}

const deleteElements = () => {
  const {id, items} = getChecked(true);
  $.ajax({
    type: 'DELETE',
    url: window.location,
    data: { id: id },
    success: () => items.remove()
  })
  return false
}

const getElements = data => {
  return $.ajax({
    type: 'POST',
    url: window.location,
    data,
    success: e => e 
  })
}

const getData = data => {
  return $.ajax({
    type: 'POST',
    url: '/admin',
    data,
    success: e => e 
  })
}

const setData = data => {
  $.ajax({
    type: 'PUT',
    url: window.location,
    data,
    success: e => e
  })
  return false
}

const __afterFill = () => {
  $(".fureyForm").off()
  $(".fureyForm").submit(function (e) {
    const id = getChecked();
    e.preventDefault();
    let data = false;
    if ($(this).attr('id') == 'modifyCheckedForm' || $(this).attr('id') == 'modifyCheckedFormFUN') {
      data = $(this).serialize() + "&id%5B%5D=" + id.join('&id%5B%5D=');
    }
    $.ajax({
      type: $(this).attr("method"),
      url: $(this).attr("action"),
      data: (data) ? data : $(this).serialize(),
      success: async (res) => {
        if (res == "REDIRECT") $("a.nav-link[href='/']")[0].click();
        if ($(this).attr('origen') === 'settings') fillAsideMenu(); 
        else if ($(this).attr('origen') === 'utilities') fillUtilitiesTable();
        else {
            await fillTBodyTable();
            fillFormTable();
            setChecked(id);
        }
      },
    });
    this.reset()
    return false
  });
}
