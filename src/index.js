// Attaching event listeners to the edit and delete buttons of each grocery list item
function attachEventListeners(groceryListItem) {
    const itemName = groceryListItem.getAttribute("itemName");
    const itemQuantity = parseInt(groceryListItem.getAttribute("itemQuantity"));
    const editBtn = groceryListItem.querySelector(".edit");
    const deleteBtn = groceryListItem.querySelector(".delete");

    editBtn.addEventListener("click", () => {
        const editItemBox = document.getElementById("edit-item-box");
        toggleBox("edit");
        editItemBox.querySelector("#editItemName").value = itemName; // Populating the edit form with details of selected grocery list item
        editItemBox.querySelector("#editItemQuantity").value = itemQuantity;
    });

    deleteBtn.addEventListener("click", () => {
        removeGroceryListItem({
            itemName: itemName,
            itemQuantity: itemQuantity,
        });
    });
}

// Function to render the grocery list from the local storage onto the DOM
function renderGroceryList() {
    let list = localStorage.getItem("list");
    if (list === null) {
        list = [];
    } else {
        list = JSON.parse(list);
    }
    const groceryList = document.querySelector(".grocery-list");
    groceryList.innerHTML = ``;
    list.forEach(({ itemName, itemQuantity }) => {
        const groceryListItem = document.createElement("li");
        groceryListItem.classList.add("grocery-list-item");
        groceryListItem.setAttribute("itemName", itemName);
        groceryListItem.setAttribute("itemQuantity", itemQuantity);
        groceryListItem.innerHTML = `
          <p class ="name">${itemName}</p>
          <p class= "quantity">x${itemQuantity}</p>
          <button class ="edit">Edit</button>
          <button class ="delete">Delete</button>
        `;
        attachEventListeners(groceryListItem);
        groceryList.appendChild(groceryListItem);
    });
}
renderGroceryList();

// Function for switching between add and edit forms
function toggleBox(item) {
    const addTitle = document.getElementById("add-title");
    const editTitle = document.getElementById("edit-title");
    const addItemBox = document.getElementById("add-item-box");
    const editItemBox = document.getElementById("edit-item-box");
    if (item === "add") {
        editItemBox.querySelector("#editItemName").value = "";
        editItemBox.querySelector("#editItemQuantity").value = "";
        addTitle.classList.add("active");
        editTitle.classList.remove("active");
        editItemBox.classList.add("hidden");
        addItemBox.classList.remove("hidden");
    } else {
        addItemBox.querySelector("#addItemName").value = "";
        addItemBox.querySelector("#addItemQuantity").value = "";
        addTitle.classList.remove("active");
        editTitle.classList.add("active");
        editItemBox.classList.remove("hidden");
        addItemBox.classList.add("hidden");
    }
}

// Function to add a grocery list item to the grocery list
function addGroceryListItem(item) {
    let list = localStorage.getItem("list");
    if (list === null) {
        list = [];
    } else {
        list = JSON.parse(list);
    }
    const foundItem = list.find((listItem) => {
        return listItem.itemName === item.itemName;
    });
    if (foundItem) {
        updateGroceryListItem(item);
    } else {
        list = [...list, item];
        localStorage.setItem("list", JSON.stringify(list));
        renderGroceryList();
    }
}

// Function to remove a grocery list item from the grocery list
function removeGroceryListItem(item) {
    let list = localStorage.getItem("list");
    if (list === null) {
        list = [];
    } else {
        list = JSON.parse(list);
    }
    list = list.filter((listItem) => {
        return listItem.itemName !== item.itemName;
    });
    localStorage.setItem("list", JSON.stringify(list));
    renderGroceryList();
}

// Function to update a grocery list item already present in the grocery list
function updateGroceryListItem(item) {
    let list = localStorage.getItem("list");
    if (list === null) {
        list = [];
    } else {
        list = JSON.parse(list);
    }
    const foundItem = list.find((listItem) => {
        return listItem.itemName === item.itemName;
    });
    if (foundItem) {
        const indexOfFoundItem = list.indexOf(foundItem);
        for (var key in list[indexOfFoundItem]) {
            list[indexOfFoundItem][key] = item[key];
        }
        localStorage.setItem("list", JSON.stringify(list));
        renderGroceryList();
    } else {
        return false;
    }
    return true;
}
// Attaching event listeners to the add and edit forms
const addItemForm = document.querySelector("#add-item-box form");
const editItemForm = document.querySelector("#edit-item-box form");

addItemForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const item = Object.fromEntries(data.entries());
    if (item.itemName == "" || item.itemQuantity == "") {
        alert("Please Fill All The Fields");
        location.reload();
        return;
    }
    item.itemName = item.itemName.toUpperCase();
    item.itemQuantity = parseInt(item.itemQuantity);
    addItemForm.querySelector("#addItemName").value = "";
    addItemForm.querySelector("#addItemQuantity").value = "";
    addGroceryListItem(item);
});

editItemForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const item = Object.fromEntries(data.entries());
    if (item.itemName == "" || item.itemQuantity == "") {
        alert("Please Fill All The Fields");
        location.reload();
        return;
    }
    item.itemName = item.itemName.toUpperCase();
    item.itemQuantity = parseInt(item.itemQuantity);
    editItemForm.querySelector("#editItemName").value = "";
    editItemForm.querySelector("#editItemQuantity").value = "";
    if (!updateGroceryListItem(item)) {
        alert("The Item Does Not Exist");
    }
});

// Attaching event listeners for switching between add and edit forms
const addTitle = document.querySelector("#add-title");
const editTitle = document.querySelector("#edit-title");

addTitle.addEventListener("click", () => {
    toggleBox("add");
});
editTitle.addEventListener("click", () => {
    toggleBox("edit");
});
