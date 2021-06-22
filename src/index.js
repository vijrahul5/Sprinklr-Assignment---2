// I have tried to use the MVC architecture as learned from the course shared.
const model = {
    // Model : Stores all list data and provides methods for access
    list: [],
    getListStorage: function () {
        let currList = localStorage.getItem("list");
        if (currList === null) {
            currList = [];
        } else {
            currList = JSON.parse(currList);
        }
        this.list = currList;
        return this.list;
    },
    setListStorage: function (newList) {
        this.list = newList;
        localStorage.setItem("list", JSON.stringify(newList));
        return "";
    },
};

const controller = {
    // Controller : Includes all methods that connect and interact with the Model and the View
    init: function () {
        const list = model.getListStorage();
        view.init();
        view.renderGroceryList(list);
    },
    addGroceryListItem: function (item) {
        // Adds a Grocery List Item to the Grocery List
        let list = model.list;
        const foundItem = this.checkSameName(item);
        if (foundItem) {
            item.itemQuantity += foundItem.itemQuantity;
            item.itemId = foundItem.itemId;
            this.updateGroceryListItem(item);
            return "Quantity Incremented Successfully !";
        } else {
            item.itemId = Date.now().toString();
            list = [...list, item];
            model.setListStorage(list);
            view.renderGroceryList(list);
            return "Item Added Successfully !";
        }
    },
    updateGroceryListItem: function (item) {
        // Updates a Grocery List Item present in the Grocery List
        let list = model.list;
        const foundItem = this.checkSameId(item);
        if (foundItem) {
            for (let key in foundItem) {
                foundItem[key] = item[key];
            }
            newFoundItem = this.checkSameNameDiffId(foundItem);
            if (newFoundItem) {
                return "Cannot Have Two Items With Same Name !";
            }
            const indexOfFoundItem = list.indexOf(foundItem);
            list[indexOfFoundItem] = item;
            model.setListStorage(list);
            view.renderGroceryList(list);
        } else {
            return "The Item Does Not Exist In The List !";
        }
        return "Successfully Updated !";
    },
    removeGroceryListItem: function (item) {
        // Removes a Grocery List Item present in the Grocery List
        let list = model.list;
        list = list.filter((listItem) => {
            return listItem.itemName !== item.itemName;
        });
        model.setListStorage(list);
        view.renderGroceryList(list);
        return "Item Successfully Removed !";
    },
    checkSameName: function (item) {
        // Checks if there is an grocery list item with the same name already present
        let list = model.list;
        const foundItem = list.find((listItem) => {
            return listItem.itemName === item.itemName;
        });
        return foundItem;
    },
    checkSameId: function (item) {
        // Checks if there is an grocery list item with the same id already present
        let list = model.list;
        const foundItem = list.find((listItem) => {
            return listItem.itemId === item.itemId;
        });
        return foundItem;
    },
    checkSameNameDiffId: function (item) {
        // Checks if there is an grocery list item with the same name but different id already present
        let list = model.list;
        console.log(list, item);
        const foundItem = list.find((listItem) => {
            return (
                listItem.itemName === item.itemName &&
                listItem.itemId !== item.itemId
            );
        });
        return foundItem;
    },
};

const view = {
    init: function () {
        this.groceryList = document.querySelector(".grocery-list");
        this.form = document.querySelector(".form-holder>form");
        this.formTitle = document.querySelector(".form-section-title >p");
        this.formSubmitBtn = document.querySelector(".form-holder #inputItem");
        this.cancelEditBtn = document.querySelector(".form-holder .cancelBtn");
        this.currentForm = "add";
        this.attachELToForm();
    },
    createGroceryListItem: function ({ itemName, itemQuantity, itemId }) {
        // Creates a grocery list item ready to be rendered
        const groceryListItem = document.createElement("li");
        groceryListItem.classList.add("grocery-list-item");
        groceryListItem.setAttribute("itemName", itemName);
        groceryListItem.setAttribute("itemQuantity", itemQuantity);
        groceryListItem.setAttribute("itemId", itemId);
        groceryListItem.innerHTML = `
        <p class ="name">${itemName}</p>
        <p class= "quantity">x${itemQuantity}</p>
        <button class ="edit">Edit</button>
        <button class ="delete">Delete</button>
        `;
        return groceryListItem;
    },
    renderGroceryList: function (list) {
        // Renders the Grocery List
        this.groceryList.innerHTML = ``;
        list.forEach((listItem) => {
            const groceryListItem = this.createGroceryListItem(listItem);
            this.attachELToGroceryListItem(groceryListItem);
            this.groceryList.appendChild(groceryListItem);
        });
    },
    attachELToGroceryListItem: function (groceryListItem) {
        // Attaches event listeners to the edit and delete buttons of each grocery list item
        const itemName = groceryListItem.getAttribute("itemName");
        const itemQuantity = parseInt(
            groceryListItem.getAttribute("itemQuantity"),
            10
        );
        const itemId = groceryListItem.getAttribute("itemId");
        const editBtn = groceryListItem.querySelector(".edit");
        const deleteBtn = groceryListItem.querySelector(".delete");

        editBtn.addEventListener("click", () => {
            this.toggleForm("edit");
            this.form.querySelector("#inputItemName").value = itemName;
            this.form.querySelector("#inputItemQuantity").value = itemQuantity;
            this.form.setAttribute("itemId", itemId);
        });

        deleteBtn.addEventListener("click", () => {
            let message = controller.removeGroceryListItem({
                itemName,
                itemQuantity,
                itemId,
            });
            alert(message);
        });
    },
    toggleForm: function (data) {
        // Toggles between the edit and add item states
        this.form.querySelector("#inputItemName").value = "";
        this.form.querySelector("#inputItemQuantity").value = "";
        if (data == "add") {
            this.currentForm = "add";
            this.formTitle.textContent = "Add Item";
            this.form.setAttribute("itemId", "");
            this.cancelEditBtn.classList.add("hidden");
            this.formSubmitBtn.value = "Add";
        } else {
            this.currentForm = "edit";
            this.formTitle.textContent = "Edit Item";
            this.cancelEditBtn.classList.remove("hidden");
            this.formSubmitBtn.value = "Save";
        }
    },
    attachELToForm: function () {
        // Attaches event listeners to the save/add/cancel buttons on the form
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            const data = new FormData(event.target);
            const item = Object.fromEntries(data.entries());
            if (item.itemName === "" || item.itemQuantity === "") {
                alert("Please Fill All The Fields");
                location.reload();
                return;
            }
            item.itemName = item.itemName.toUpperCase();
            item.itemQuantity = parseInt(item.itemQuantity, 10);
            this.form.querySelector("#inputItemName").value = "";
            this.form.querySelector("#inputItemQuantity").value = "";
            if (view.currentForm == "add") {
                let message = controller.addGroceryListItem(item);
                alert(message);
            } else {
                item.itemId = this.form.getAttribute("itemId");
                let message = controller.updateGroceryListItem(item);
                alert(message);
                this.toggleForm("add");
            }
        });
        this.cancelEditBtn.addEventListener("click", () => {
            this.toggleForm("add");
        });
    },
};

controller.init(); // Initialising our app using the controller
