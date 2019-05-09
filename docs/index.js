(function() {
  var indexMeta = {
    url: "./json/index.json"
  };
  var columnMeta = {
    url: "./column-defines.json"
  };

  function loadMeta(meta) {
    return new Promise(function(resolve) {
      var request = new XMLHttpRequest();
      request.open("GET", meta.url);
      request.responseType = "json";
      request.onload = function() {
        if (request.status === 200) {
          meta.json = request.response;
          resolve();
        }
      };
      request.send();
    });
  }

  var getIndex = loadMeta(indexMeta);
  var getColDefs = loadMeta(columnMeta);

  Promise.all([getIndex, getColDefs]).then(function() {
    indexMeta.json.sort().reverse();
    initPage();
  });

  function initPage() {
    console.log("init table.");
    var gridOptions = {
      columnDefs: columnMeta.json
    };
    var eGridDiv = document.querySelector("#myGrid");
    new agGrid.Grid(eGridDiv, gridOptions);

    fetch(toDataURL(indexMeta.json[0]))
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        gridOptions.api.setRowData(data);
      });
  }

  function toDataURL(name) {
    return "./json/" + name + ".json";
  }
})();
