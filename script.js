document.getElementById("upload").onclick = function () {
  var jsonFiles = document.getElementById("selectJsonFile").files;
  console.log(jsonFiles);
  if (jsonFiles.length <= 0) {
    return false;
  }

  var fr = new FileReader();
  fr.onload = function (e) {
    console.log(e);

    var result = JSON.parse(e.target.result);
    const formattedData = JSON.stringify(result, null, 2);
    axios
      .post("http://localhost:3000/posts/", result)
      .then((response) => {
        this.fetchData();
        const addedUser = response.data;
        console.log(`POST: user is added`, addedUser);
      })
      .catch((error) => console.log(error));
    console.log(formattedData);
  };
  fr.readAsText(jsonFiles.item(0));
};

const fetchData = () => {
  let tblBody = document.getElementsByTagName("tbody");
  axios
    .get("http://localhost:3000/posts/")
    .then((response) => {
      const carsData = response.data;
      let noContentSectio = document.getElementById("no-content");
      let tabelContentSection = document.getElementById("content-table");
      if (!carsData.length) {
       
        noContentSectio.style.display = "flex";
   
        tabelContentSection.style.display = "none";
      } else {
        noContentSectio.style.display = "none";
        // cells creation
        var k;
        for (var i = 0; i < carsData.length; i++) {
          // table row creation
          k += "<tr>";
          k += "<td>" + carsData[i].id + "</td>";
          k += "<td>" + carsData[i].model_year + "</td>";
          k += "<td>" + carsData[i].make + "</td>";
          k += "<td>" + carsData[i].model + "</td>";
          k += "<td>" + carsData[i].rejection_percentage + " %" + "</td>";
          k += "<td>" + carsData[i].reason_1 + "</td>";
          k += "<td>" + carsData[i].reason_2 + "</td>";
          k += "<td>" + carsData[i].reason_3 + "</td>";
          k += "</tr>";
        }
        console.log(carsData[0]);
        if (k.length) {
          document.getElementById("table-tbody").innerHTML = k;
        }
      }
    })
    .catch((error) => console.error(error));
};

fetchData();

function doSearch() {
  // Declare variables
  var input, filter, table, tr, i, j, column_length, count_td;

  column_length = document.getElementById("content-table").rows[0].cells.length;

  input = document.getElementById("searchData");
  filter = input.value.toUpperCase();
  table = document.getElementById("content-table");
  tr = table.getElementsByTagName("tr");
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
    if (count_td > 0) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}
