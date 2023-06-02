const headerFields = ['Request number', 'Success count', 'Failure count', 'Time [ms]']
const historyRecords = [];
let tableRef;
let loaderRef;

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

async function createOrder(number = 0) {
    const response = await fetch( window.location.origin + '/api', {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        number
      }),
    });
    return response.json();
}

function createTableCell (text) {
    const cell = document.createElement('td');
    cell.appendChild(document.createTextNode(text));
    return cell;
}

function createTableRow (cellTexts) {
    const row = document.createElement('tr');
    for (const text of cellTexts) {
        row.appendChild(createTableCell(text));
    }
    return row;
}

function createTableHeader ( headerFields ) {
    const header = document.createElement('thead');
    header.appendChild(createTableRow(headerFields));
    return header;
}




function createTableBody (historyRecords) {
    const tbody = document.createElement('tbody');
  
    for (const row of historyRecords) {
        console.log('Row:', row)
        tbody.appendChild(createTableRow(row)); 
    }

    return tbody;
}

function createTableFooter (historyRecords) {
    const tfoot = document.createElement('tfoot');

    const sums = [0, 0, 0];
    for (const [requestNumber, successNumber, failNumber, time] of historyRecords) {
        sums[0] += successNumber;
        sums[1] += failNumber;
        sums[2] += time;
    }

    const avgs = sums.map( sum => Math.floor( sum/ historyRecords.length));
    
    tfoot.appendChild(createTableRow(['Sum',...sums]))
    tfoot.appendChild(createTableRow(['Avg',...avgs]))

    return tfoot;
}

function rerenderTable () {
    removeAllChildNodes(tableRef)
    tableRef.appendChild(createTableHeader(headerFields))
    if (historyRecords.length) {
        tableRef.appendChild(createTableBody(historyRecords))
        tableRef.appendChild(createTableFooter(historyRecords))
    }
}  

async function makeRequest () {
    loaderRef.style.display = 'inline-block';
    const startTime = new Date();
    try {
        const data = await createOrder(100);
        const endTime = new Date();
        historyRecords.push([historyRecords.length + 1, data.succes, data.fail, endTime.getTime() - startTime.getTime()])
    } catch (error) {
        const endTime = new Date();
        historyRecords.push([historyRecords.length + 1, 0, 10000, endTime.getTime() - startTime.getTime()])
        
    }
    rerenderTable()
    loaderRef.style.display = 'none';
}


function initialize () {
    tableRef = document.getElementById('orders');
    loaderRef = document.getElementById('loader');
    rerenderTable()
}