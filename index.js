//let noteArray = [["header","text"],["","text"],["header",""]]
let noteArray = []
let table = document.getElementsByTagName('table')[0]
let selectedTr
let modalAdd = document.querySelector(".modalAdd")
let modalEdit = document.querySelector(".modalEdit")
let currentEdit

function removeNote(i)
{
    /*for (let i = 0; i < noteArray.length; i++)
    {
        if (noteArray[i][0] == he && noteArray[i][1] == bo)
        {
            noteArray.splice(i, 1);
            return;
        }
    }*/

    noteArray.splice(i, 1);
}

$('table').on('click', 'button[type="button"]', function(e){
    let r = confirm("Подтвердить удаление?");
    if (r)
    {
        let cl = $(this).closest('tr').attr('class');
        removeNote(parseInt(cl.charAt(3)));
        $(this).closest('tr').remove();
        generateTable(noteArray);
    }
 })

function generateTable(data)
{
    let c=0;
    table.innerHTML = "";
    data.forEach(element => {
        let row = document.createElement('tr');
        row.className = "row" + c++;
        let cell = document.createElement('td');
        let d1 = document.createElement('div');
        d1.className = "el1";

        if (element[0].length != 0)
        {
            d1.insertAdjacentHTML('beforeend', '<strong>'+ element[0] + '</strong>');
        }
        if (element[1].length != 0)
        {
            d1.insertAdjacentHTML('beforeend', '<p>'+ element[1] + '</p>');
        }

        cell.appendChild(d1);
        cell.insertAdjacentHTML('beforeend', '<div class="el2"><button type="button" class="removeButton"><i class="fa fa-trash"></i></button></div>');

        row.appendChild(cell);
        table.appendChild(row);
    });
}

function doSearch()
{
    let query = document.getElementById('searchInput').value.toUpperCase();

    if (query.length != 0)
    {
        let searchResult = [];

        for (let i = 0; i < noteArray.length; i++)
        {
            if (noteArray[i][0].toUpperCase().includes(query) || noteArray[i][1].toUpperCase().includes(query))
            {
                searchResult.push(noteArray[i]);
            }
        }

        generateTable(searchResult);
    }
}

function highlight(tr)
{
    if (selectedTr)
    {
      selectedTr.classList.remove('highlight');
    }
    selectedTr = tr;
    selectedTr.classList.add('highlight');
}

table.onclick = function(event)
{
    let tr = event.target.closest('tr');
  
    if (!tr) return;
  
    if (!document.contains(tr)) return;
  
    highlight(tr);

    currentEdit = parseInt(tr.className.charAt(3));

    let text1 = noteArray[currentEdit][0];
    let text2 = noteArray[currentEdit][1];

    let field1 = document.getElementById('editArea1');
    let field2 = document.getElementById('editArea2');

    field1.value = text1;
    field2.value = text2;

    modalEdit.style.display = "block";
}

function checkInput(field1, field2, text1, text2)
{
    field1.classList.remove('error');
    field2.classList.remove('error');

    if (text1 == "" && text2 == "")
    {
        field1.classList.add('error');
        field2.classList.add('error');
        return false;
    }
    else if (text1.length > 30)
    {
        field1.classList.add('error');
        return false;
    }
    else if (text1.length > 0 && !text1.replace(/\s/g, '').length)
    {
        field1.classList.add('error');
        return false;
    }
    else if (text2.length > 0 && !text2.replace(/\s/g, '').length)
    {
        field2.classList.add('error');
        return false;
    }
    else
    {
        field1.classList.remove('error');
        field2.classList.remove('error');
        return true;
    }
}

function showModalAdd()
{
    //document.getElementById('addArea1').classList.remove('error');
    //document.getElementById('addArea2').classList.remove('error');
    modalAdd.style.display = "block";
}

function closeModalAdd()
{
    modalAdd.style.display = "none";
}

function confirmModalAdd()
{
    let field1 = document.getElementById('addArea1');
    let field2 = document.getElementById('addArea2');
    let text1 = field1.value.replace(/\r?\n/g, '<br/>');
    let text2 = field2.value.replace(/\r?\n/g, '<br/>');

    if (checkInput(field1, field2, text1, text2))
    {
        field1.classList.remove('error');
        field2.classList.remove('error');
        field1.value = "";
        field2.value = "";
        noteArray.unshift([text1,text2]);
        generateTable(noteArray);
        modalAdd.style.display = "none";
    }
}

function closeModalEdit()
{
    modalEdit.style.display = "none";
}

function confirmModalEdit()
{
    let field1 = document.getElementById('editArea1');
    let field2 = document.getElementById('editArea2');
    let text1 = field1.value.replace(/\r?\n/g, '<br/>');
    let text2 = field2.value.replace(/\r?\n/g, '<br/>');

    if (checkInput(field1, field2, text1, text2))
    {
        field1.classList.remove('error');
        field2.classList.remove('error');
        noteArray[currentEdit] = [text1,text2];
        generateTable(noteArray);
        modalEdit.style.display = "none";
        currentEdit = null;
    }
}

//----------------------------------------------------------------------------------------------------------------------------------------------------

window.onbeforeunload = closingCode;

function closingCode()
{
   localStorage.setItem('userNotes', JSON.stringify(noteArray));
   //localStorage.removeItem('userNotes');
   return null;
}

if (localStorage.getItem("userNotes") != null)
{
    noteArray = JSON.parse(localStorage.getItem('userNotes'));
}

if (noteArray.length == 0)
{
    noteArray.push(["Первая заметка", "Это твоя первая заметка! Нажми, чтобы отредактировать, или создай новую."]);
}

generateTable(noteArray);