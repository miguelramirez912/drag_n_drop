const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// const cancelBtns = document.querySelectorAll('.cancel-btn');

// console.log(saveItemBtns);
// console.log(cancelBtns);


// List Item
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.querySelector('#backlog-list');
const progressList = document.querySelector('#progress-list');
const completeList = document.querySelector('#complete-list');
const onHoldList = document.querySelector('#on-hold-list');

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];

let listArrays = [];
let updateOnLoad = false;

// Drag functionality
let draggedItem;
let currentColumn;

// Get arrays from local storage if available, set default values if not
function getSavedColumns() {
    if (localStorage.getItem('backlogItems')) {
        backlogListArray = JSON.parse(localStorage.backlogItems);
        progressListArray = JSON.parse(localStorage.progressItems);
        completeListArray = JSON.parse(localStorage.completeItems);
        onHoldListArray = JSON.parse(localStorage.onHoldItems);
    } else {
        backlogListArray = ['Liberar el Curso', 'Sentarse y relajarse'];
        progressListArray = ['Trabajar en Proyectos', 'Escuchar Musica'];
        completeListArray = ['Ser cool', 'Terminando cosas'];
        onHoldListArray = ['No ser cool'];
    }
};

// Set arrays to local storage
function updateSavedColumns() {
    listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
    const keyNames = ['backlog', 'progress', 'complete', 'onHold'];
    keyNames.forEach((key, index) => {
        localStorage.setItem(`${key}Items`, JSON.stringify(listArrays[index]));
    })
};
//Update Item - Delete if necesesary, update array value
function updateItem(column, index) {
    const selectedArray = listArrays[column];
    console.log(selectedArray);
    const selectedColumnEl = listColumns[column].children;
    if (!selectedColumnEl[index].textContent) {
        delete selectedArray[index];
    }else {
        selectedArray[index] = selectedColumnEl[index].textContent;
    }
    console.log(selectedArray);
    selectedColumnEl[index].setAttribute('contentEditable', 'false');
    updateDOM();
};
// Edit Item until it gets clicked
function editItem(column, index) {
    console.log("editItem lanzado");
    const selectedColumnEl = listColumns[column].children;
    const currentItem = selectedColumnEl[index];
    currentItem.setAttribute('contentEditable', 'true');
}

function deleteItem(column, index) {
    console.log("deleteItem lanzado");
    event.stopPropagation();
    console.log("Deteniendo propagacion");
    console.log(`Elemento ubicado en la columna: ${column}, indice: ${index}`);
    const selectedArray = listArrays[column];
    console.log(selectedArray);
    console.log(selectedArray[index]);
    // delete selectedArray[index];
    //window.confirm(`Esta seguro de eliminar la tarea: ${selectedArray[index]}`);
    if (window.confirm(`Esta seguro de eliminar la tarea: ${selectedArray[index]}`)) {
        selectedArray.splice(index, 1);
        updateDOM();
    } 
}
// Create DOM element for each list item
function createItemEl(columnEl, column, item, index) {
    // Create list item
    const listEl = document.createElement('li');
    listEl.textContent = item;
    listEl.classList.add('drag-item');
    listEl.draggable = true;
    listEl.setAttribute('ondragstart', 'drag(event)');
    // listEl.contentEditable = true;
    listEl.setAttribute('onclick', `editItem(${column}, ${index})`)
    listEl.setAttribute('onfocusout', `updateItem(${column}, ${index})`);
    const deleteButton = document.createElement('i');
    //<i class="fa-solid fa-trash"></i>
    deleteButton.classList.add("fa-solid");
    deleteButton.classList.add("fa-trash");
    deleteButton.setAttribute('onclick', `deleteItem(${column}, ${index})`);
    listEl.addEventListener('mouseover', () => {
        listEl.appendChild(deleteButton);
    });
    listEl.addEventListener('mouseout', () => {
        if(deleteButton){
            deleteButton.remove();
        }
    })
    columnEl.appendChild(listEl);

};
//Filter empty items from arrays
function filterArray(array) {
    const filteredArray = array.filter(item => item !== null);
    return filteredArray;
}

// Update Columns in DOM - Reset HTML, filter arrays, update localStorage
function updateDOM() {
    // Get localStorage
    if (!updateOnLoad) {
        getSavedColumns()
    }
    // Update backlog Column
    backlogList.textContent = '';
    backlogListArray.forEach((backlogItem, index) => {
        createItemEl(backlogList, 0, backlogItem, index)
    });
    backlogListArray = filterArray(backlogListArray);
    // Update progress Column
    progressList.textContent = '';
    progressListArray.forEach((progressItem, index) => {
        createItemEl(progressList, 1, progressItem, index)
    });
    progressListArray = filterArray(progressListArray);
    // Update complete Column
    completeList.textContent = '';
    completeListArray.forEach((completeItem, index) => {
        createItemEl(completeList, 2, completeItem, index)
    });
    completeListArray = filterArray(completeListArray);
    // Update onHold Column
    onHoldList.textContent = '';
    onHoldListArray.forEach((onHoldItem, index) => {
        createItemEl(onHoldList, 3, onHoldItem, index)
    });
    onHoldListArray = filterArray(onHoldListArray);
    // Run getSavedColumns only once
    updateOnLoad = true;
    // Update Local Storage
    updateSavedColumns();
};
// Add inputBox text content to column
function addToColumn(column) {
    const textItem = addItems[column].textContent;
    const selectedArray = listArrays[column];
    selectedArray.push(textItem);
    addItems[column].textContent = '';
    updateDOM();
}
// Show Input Box
function showInputBox(column) {
    addBtns[column].style.visibility = 'hidden';
    saveItemBtns[column].style.display = 'flex';
    addItemContainers[column].style.display = 'flex';
    // cancelBtns[column].style.display = 'flex';
    
};
// Hide Input Box
function hideInputBox(column) {
    console.log(event.target.textContent);
    addBtns[column].style.visibility = 'visible';
    saveItemBtns[column].style.display = 'none';
    addItemContainers[column].style.display = 'none';
    // cancelBtns[column].style.display = 'none';

    addToColumn(column);
};
// Rebuild Arrays
function rebuildArrays() {
    console.log(backlogList.children);
    console.log(progressList.children);
    backlogListArray = [];
    for (let i = 0; i < backlogList.children.length; i++){
        backlogListArray.push(backlogList.children[i].textContent)
    };
    progressListArray = [];
    for (let i = 0; i < progressList.children.length; i++){
        progressListArray.push(progressList.children[i].textContent)
    };
    completeListArray = [];
    for (let i = 0; i < completeList.children.length; i++){
        completeListArray.push(completeList.children[i].textContent)
    };
    onHoldListArray = [];
    for (let i = 0; i < onHoldList.children.length; i++){
        onHoldListArray.push(onHoldList.children[i].textContent)
    };
    updateDOM();
}

// When it starts dragging
function drag(e) {
    draggedItem = e.target;
    console.log(draggedItem);
}

// Column allows for item to drop
function allowDrop(e) {
    e.preventDefault();
}

// When item enters column area
function dragEnter(column){
    currentColumn = column;
    listColumns[currentColumn].classList.add('over');
}
//Dropping item in column
function drop(e) {
    e.preventDefault()
    // Add item to column
    const parent = listColumns[currentColumn];
    parent.appendChild(draggedItem);
    // Remove background-color/padding
    listColumns.forEach(column => {
        column.classList.remove('over');
    });
    rebuildArrays();
}


updateDOM();