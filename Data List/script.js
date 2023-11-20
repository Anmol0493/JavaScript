const dataList = document.getElementById("dataList");
const addSurnameBtn = document.getElementById("addSurnameBtn");
const addPersonBtn = document.getElementById("addPersonBtn");

let data = [
  {
    surname: "Patel",
    person: ["Axar", "Sardar"]
  },
  {
    surname: "Kumar",
    person: ["Akshay", "Vijay"]
  }
];

// Display surname and name
function updateDataList() {
  let personHTML = "";
  for (let i = 0; i < data.length; i++) {
    let surname = data[i].surname;
    let persons = data[i].person;

    personHTML += "<h2>" + surname + "</h2>";
    personHTML += persons.join("<br>") + "<br>";
  }
  dataList.innerHTML = personHTML;
}

// Add surname btn
function addSurname() {
  const newSurname = prompt("Enter new surname:");
  if (newSurname) {
    const matchNewSurname = data.find((item) => item.surname === newSurname);
    if (matchNewSurname) {
      alert("Surname already exists.");
    } else {
      data.push({
        surname: newSurname,
        person: []
      });
      updateDataList();
    }
  }
}

// Add person btn
function addPerson() {
  const surname = prompt("Enter surname:");
  if (surname) {
    const matchSurname = data.find((item) => item.surname === surname);
    if (matchSurname) {
      const newPerson = prompt("Enter new person:");
      if (newPerson) {
        const personExists = matchSurname.person.includes(newPerson);
        if (personExists) {
          alert("Person already exists.");
        } else {
          matchSurname.person.push(newPerson);
          updateDataList();
        }
      }
    } else {
      alert("Surname not found.");
    }
  }
}

// Event listeners
addSurnameBtn.addEventListener("click", addSurname);
addPersonBtn.addEventListener("click", addPerson);
updateDataList();