function attachEventListeners(listItem) {
    const itemName = listItem.getAttribute("itemName");
    const itemQuantity = parseInt(listItem.getAttribute("itemQuantity"));
    const currEditBtn = listItem.querySelector(".edit");
    const currDeleteBtn = listItem.querySelector(".delete");

    currEditBtn.addEventListener("click", () => {
        const editItemBox = document.getElementById("edit-item-box");
        toggleBox("edit");
        editItemBox.querySelector("#editItemName").value = itemName;
        editItemBox.querySelector("#editItemQuantity").value = itemQuantity;
    });

    currDeleteBtn.addEventListener("click", () => {
        removeGroceryListItem({
            itemName: itemName,
            itemQuantity: itemQuantity,
        });
    });
}

function renderGroceryList() {
    let list = localStorage.getItem("list");
    if (list === null) {
        list = [];
    } else {
        list = JSON.parse(list);
    }
    const groceryList = document.querySelector(".grocery-list");
    groceryList.innerHTML = ``;
    list.forEach((listItem) => {
        const currListItem = document.createElement("li");
        currListItem.classList.add("grocery-list-item");
        currListItem.setAttribute("itemName", listItem.itemName);
        currListItem.setAttribute("itemQuantity", listItem.itemQuantity);
        currListItem.innerHTML = `
          <p class ="name">${listItem.itemName}</p>
          <p class= "quantity">${listItem.itemQuantity}</p>
          <button class ="edit">Edit</button>
          <button class ="delete">Delete</button>
        `;
        attachEventListeners(currListItem);
        groceryList.appendChild(currListItem);
    });
}
renderGroceryList();

function toggleBox(value) {
    const addTitle = document.getElementById("add-title");
    const editTitle = document.getElementById("edit-title");
    const addItemBox = document.getElementById("add-item-box");
    const editItemBox = document.getElementById("edit-item-box");
    if (value === "add") {
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
        for(var key in list[indexOfFoundItem]){
          list[indexOfFoundItem][key] = item[key];
        }
        localStorage.setItem("list", JSON.stringify(list));
        renderGroceryList();
    } else {
        return false;
    }
    return true;
}

const addItemForm = document.querySelector("#add-item-box form");
const editItemForm = document.querySelector("#edit-item-box form");

addItemForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const item = Object.fromEntries(data.entries());
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
    editItemForm.querySelector("#editItemName").value = "";
    editItemForm.querySelector("#editItemQuantity").value = "";
    item.itemName = item.itemName.toUpperCase();
    item.itemQuantity = parseInt(item.itemQuantity);
    if (!updateGroceryListItem(item)) {
        alert("The Item Does Not Exist");
    }
});
