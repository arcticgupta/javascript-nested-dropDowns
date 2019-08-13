//JavaScript code here. 
//Start by calling the data.json file. 
//Save the data in a variable and perform manipulations to get the desired result.
let object = {};

        function readTextFile(file, callback) {
            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", file, true);
            rawFile.onreadystatechange = function () {
                if (rawFile.readyState === 4 && rawFile.status === 200) {
                    callback(rawFile.responseText);
                }
            };
            rawFile.send(null);
        }

        function onAdd(id) {
            readTextFile("data.json", function (text) {
                object = JSON.parse(text);
                var wrapperDiv = document.getElementById("wrapperForData");//parent
                var dropdownDiv = document.createElement("div");//child
                var selectList = document.createElement("select");
                addSelect(wrapperDiv, dropdownDiv, selectList, id);
                var addButton = document.createElement("button");
                var deleteButton = document.createElement("button");
                addButtons(addButton, deleteButton, dropdownDiv, id);

                var defaultOption = document.createElement("option");
                defaultOption.className = "option";
                defaultOption.value = 0;
                defaultOption.innerHTML = "Select";
                defaultOption.style.display = "none";
                selectList.appendChild(defaultOption);

                for (var i = 0; i < object.myList.length; i++) {
                    var option = document.createElement("option");
                    option.className = "option";
                    option.value = object.myList[i].value;
                    option.innerHTML = object.myList[i].label;
                    selectList.appendChild(option);
                    hideAllIfSelectedBefore();
                    if (i === id - 1) option.setAttribute('disabled',"true");
                }
                setDefaultSelection(selectList);
            });
        }

        function setDefaultSelection(currentSelectList){
            let i = 0;
            for (i=0; i < currentSelectList.length; i++) {
                if(currentSelectList.options[i].disabled==false) break;
            }
            currentSelectList.selectedIndex=i;
        }

        function checkIfAllSelected() {
            var selectList = document.querySelectorAll(".selectDropdownClass");
            if (selectList.length === 9) return true;
            else return false;
        }

        function hideAllIfSelectedBefore() {
            var allOptions = document.querySelectorAll(".option");
            for (var i = 0; i < allOptions.length; i++) {
                if (allOptions[i].selected === true) {
                    for (var j = 0; j < allOptions.length; j++) {
                        if (allOptions[j].innerHTML === allOptions[i].innerHTML) allOptions[j].setAttribute('disabled',"true");
                    }
                }
            }
        }

        function onAddClick(id) {
            var index = document.getElementById(id.charAt(0) + "selectDropdown").selectedIndex;
            if (checkIfAllSelected()) window.alert("All options already selected");
            else onAdd(index);
        }

        function onDeleteClick(id) {
            var dropdownDiv = document.getElementById(id.charAt(0) + "dropdownDiv");
            var selectDropdown= document.getElementById(id.charAt(0) + "selectDropdown");
            var selectedIndex= selectDropdown.selectedIndex;
            var selectedOption= selectDropdown.options[selectedIndex];
            if (selectedOption.innerHTML === "Select") dropdownDiv.remove();
            else {
                var allOptions = document.querySelectorAll(".option");
                for (var i = 0; i < allOptions.length; i++) {
                    if (allOptions[i].innerHTML === selectedOption.innerHTML) allOptions[i].removeAttribute('disabled');
                }
                dropdownDiv.remove();
            }
        }

        function addSelect(wrapperDiv, dropdownDiv, selectList, id) {
            if(document.getElementById(id + "dropdownDiv")) return 
            else{
                wrapperDiv.appendChild(dropdownDiv);
                dropdownDiv.id = id + "dropdownDiv";
                dropdownDiv.appendChild(selectList);
                selectList.id = id + "selectDropdown";
                selectList.className = "selectDropdownClass";
            }
        }

        function addButtons(addButton, deleteButton, dropdownDiv, id) {
            if(!document.getElementById(id + "addButton"))
                addButton.id = id + "addButton";
            addButton.innerText = "ADD";
            addButton.className = "addButton";
            addButton.setAttribute('onclick', 'onAddClick(this.id)');
            dropdownDiv.appendChild(addButton);
            deleteButton.id = id + "deleteButton";
            deleteButton.innerText = "DELETE";
            deleteButton.className = "deleteButton";
            deleteButton.setAttribute('onclick', 'onDeleteClick(this.id)');
            dropdownDiv.appendChild(deleteButton);
        }

        function onSaveClick(){
            var allDropdowns = document.querySelectorAll(".selectDropdownClass");
            var saveDiv = document.getElementById("saveData");
            saveDiv.innerHTML= "";
            var list = document.createElement('ul');
            var resultObject={};
            saveDiv.appendChild(list);
            for (var i = 0; i < allDropdowns.length; i++) {
                var selectedIndex= allDropdowns[i].selectedIndex;
                var selectedOption= allDropdowns[i].options[selectedIndex];
                var listElement= document.createElement('li');
                listElement.innerText="Label:"+selectedOption.innerHTML+", "+"Value: "+selectedOption.value;
                resultObject[i]={value:selectedOption.value,label:selectedOption.innerHTML};
                list.appendChild(listElement);
            }
            sendJson(JSON.stringify(resultObject))
        }

        function sendJson(jsonFile){
            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("POST", "dummyUrl", true);
            rawFile.send(jsonFile);
        }