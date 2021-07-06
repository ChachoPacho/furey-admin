function sendDeleteRequest(table, id) {
  event.preventDefault()
  $.ajax({
    url: '/tables/' + table + '/' + id,
    type: 'DELETE',
    data: id,
    success: function () {
      $('#' + id).remove();
    }
  });
}

for (const key of ['tableForm', 'appendForm', 'deleteForm']) {
  const currentForm = $("#" + key);
  currentForm.bind("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: $(this).attr("method"),
      url: $(this).attr("action"),
      data: $(this).serialize(),
      success: function (data) {
        if (currentForm.attr('origen') === 'settings') {
          fillAsideMenu();
        } else if (currentForm.attr('origen') === 'utilities') {
          ''
        } else {
          fillTBodyTable('');
          fillFormTable();
        }
        $('#' + key)[0].reset();
      },
      error: function (data) {
        window.location.href = data.responseText;
      }
    });
  });
};

function getElements(table, data) {
  return $.ajax({
    type: 'POST',
    url: '/tables/' + table,
    data: data,
    success: function (data) {
      return data
    }
  });
}

function getElement(table, id) {
  return $.ajax({
    type: 'POST',
    url: '/tables/' + table + '/' + id,
    data: '',
    success: function (data) {
      return data
    }
  });
}


function getData(data) {
  return $.ajax({
    type: 'POST',
    url: '/admin',
    data,
    success: function (data) {
      return data
    }
  });
}