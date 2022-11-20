document.getElementById("upload").onclick = function () {
  var jsonFiles = document.getElementById("selectJsonFile").files;
  if (jsonFiles.length <= 0) {
    return false;
  }

  var fr = new FileReader();
  fr.onload = function (e) {
    var result = JSON.parse(e.target.result);
    const loadingSpinner = document.getElementById('loading-circle');
    loadingSpinner.style.display = 'flex';
    
    axios
    .post("https://demo-bluugo-car-inspection-be.herokuapp.com/posts/", result)
      .then((response) => {
        loadingSpinner.style.display = 'none';
         location.reload();
      })
      .catch((error) => console.log(error));
  };
  fr.readAsText(jsonFiles.item(0));
};

const fetchData = () => {
  let tblBody = document.getElementsByTagName("tbody");
  const loadingSpinner = document.getElementById('loading-circle');
  loadingSpinner.style.display = 'flex';
  axios
  .get("https://demo-bluugo-car-inspection-be.herokuapp.com/posts/")
    .then((response) => {
      const carsData = response.data;
      console.log(carsData.length)
      loadingSpinner.style.display = 'none';
      console.log(carsData.length);
      let noContentSectio = document.getElementById("no-content");
      let tabelContentSection = document.getElementById("content-table");
      if (!carsData.length) {
        noContentSectio.style.display = "flex";

        tabelContentSection.style.display = "none";
      } else {
        noContentSectio.style.display = "none";
        // cells creation

        var tableBody = function () {
          var rows = "";
          for (var i = 0; i < carsData.length; i++) {
            // table row creation
            rows += "<tr>";
            rows += "<td>" + carsData[i].id + "</td>";
            rows += "<td>" + carsData[i].model_year + "</td>";
            rows += "<td>" + carsData[i].make + "</td>";
            rows += "<td>" + carsData[i].model + "</td>";
            rows += "<td>" + carsData[i].rejection_percentage + " %" + "</td>";
            rows += "<td>" + carsData[i].reason_1 + "</td>";
            rows += "<td>" + carsData[i].reason_2 + "</td>";
            rows += "<td>" + carsData[i].reason_3 + "</td>";
            rows += "</tr>";
          }
          return rows;
        };

        document.getElementById("table-tbody").innerHTML = tableBody();
      }
    })
    .catch((error) => console.error(error));
};

fetchData();

// First filter way, can search in first and second column only in parallel and with max 50 available filtered data amount

function doSearch() {
  var input,
    filter,
    table,
    tr,
    i,
    filteredAmount = 0;
  input = document.getElementById("searchData");
  filter = input.value.toUpperCase();
  // split the entered search input based on space to filter the value value1 search for Make cell, Value 2 = search for Model cell
  filter = filter.split(/(?<=^\S+)\s/);
  table = document.getElementById("content-table");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    td2 = tr[i].getElementsByTagName("td")[3];
    if (td && td2) {
      txtValue = td.textContent || td.innerText;
      txtValue2 = td2.textContent || td2.innerText;
      if (txtValue.toUpperCase().indexOf(filter[0]) > -1) {
        if (filter[1]) {
          if (
            txtValue2.toUpperCase().indexOf(filter[1]) > -1 &&
            filteredAmount < 50
          ) {
            filteredAmount++;
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        } else if (!filter[1] && filteredAmount < 50) {
          filteredAmount++;
          tr[i].style.display = "";
        }
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// Second filter way, can search in any columns, with 50 max data amount

function doSearch1() {
  // Declare variables
  var input, filter, table, tr, i, j, column_length, count_td;

  column_length = document.getElementById("content-table").rows[0].cells.length;

  input = document.getElementById("searchData");
  filter = input.value.toUpperCase();
  table = document.getElementById("content-table");
  tr = table.getElementsByTagName("tr");
  let r = 0;
  for (i = 1; i < tr.length; i++) {
    // except first(heading) row
    count_td = 0;
    for (j = 1; j < column_length - 1; j++) {
      // except first column
      td = tr[i].getElementsByTagName("td")[j];
      /* ADD columns here that you want you to filter to be used on */
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          count_td++;
        }
      }
    }
    if (count_td > 0 && (r < 50 || filter === "")) {
      r++;
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}
