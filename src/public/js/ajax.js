const deleteElements = () => {
  const checkeds = $("td > input[type=checkbox]:checked").parents('tr');
  let ids = [];
  checkeds.each(function () { ids.push($(this).attr('id')) });
  return $.ajax({
    type: 'DELETE',
    url: window.location,
    data: {
      ids
    },
    success: () => {
      checkeds.remove()
    }
  });
}

const __afterFill = () => {
  $(".fureyForm").bind("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: $(this).attr("method"),
      url: $(this).attr("action"),
      data: $(this).serialize(),
      success: () => {
        if ($(this).attr('origen') === 'settings') {
          fillAsideMenu();
        } else if ($(this).attr('origen') === 'utilities') {
          fillUtilitiesTable();
        } else {
          fillTBodyTable('');
          fillFormTable();
        }
        $(this)[0].reset();
      },
      error: data => {
        window.location.href = data.responseText;
      }
    });
  });
}

const getElements = (data) => {
  return $.ajax({
    type: 'POST',
    url: window.location,
    data,
    success: e => {
      return e
    }
  });
}

const getData = data => {
  return $.ajax({
    type: 'POST',
    url: '/admin',
    data,
    success: e => {
      return e
    }
  });
}