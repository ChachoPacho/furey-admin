const getChecked = () => {
  let id = [];
  const checkeds = $("td > input[type=checkbox]:checked").parents('tr');
  checkeds.each(function () { id.push($(this).attr('id')) });
  return id
}

const deleteElements = () => {
  $.ajax({
    type: 'DELETE',
    url: window.location,
    data: { id: getChecked() },
    success: e => e
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
    e.preventDefault();
    let data = false;
    if ($(this).attr('id') == 'createForm' || $(this).attr('id') == 'modifyCheckedForm') {
      data = $(this).serialize() + "&id%5B%5D=" + getChecked().join('&id%5B%5D=');
    }
    $.ajax({
      type: $(this).attr("method"),
      url: $(this).attr("action"),
      data: (data) ? data : $(this).serialize(),
      success: (res) => {
        if (res == "REDIRECT") $("a.nav-link[href='/']")[0].click();
        if ($(this).attr('origen') === 'settings') fillAsideMenu(); 
        else if ($(this).attr('origen') === 'utilities') fillUtilitiesTable();
        else {
          fillTBodyTable('');
          fillFormTable();
        }
        $(this)[0].reset();
      },
    });
    return false
  });
}
