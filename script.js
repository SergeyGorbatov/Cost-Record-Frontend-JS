let allCosts = [];
const URL = "http://localhost:8000/";
const fetchHeaders = {
  "Content-Type": "application/json;charset=utf-8",
  "Access-Control-Allow-Origin": "*",
};

window.onload = async () => {
  try {
    const response = await fetch(`${URL}costs`);

    const result = await response.json();
    allCosts = result;
    render();
  } catch (error) {
    console.error("Failed to load data");
  }
};

const render = () => {
  const content = document.getElementById("content-page");
  if (!content) {
    return;
  }

  while (content.firstChild) {
    content.firstChild.remove();
  }

  const sumContainer = document.createElement("div");
  sumContainer.innerText = `Итого: ${sum()}`;
  sumContainer.className = "sum-container";
  content.append(sumContainer);

  allCosts.forEach((cost, index) => {
    const { text, date, number, _id } = cost;
    const container = document.createElement("div");
    container.id = `cost-${_id}`;
    container.className = "cost-container";

    const costText = document.createElement("p");
    costText.innerText = `${index + 1}) ${text}`;
    costText.className = "cost-text";
    costText.id = `cost-text-${_id}`;
    container.append(costText);

    content.append(container);

    const miniBlock = document.createElement("div");
    miniBlock.className = "mini-block";
    container.append(miniBlock);

    const costDate = document.createElement("p");
    costDate.innerText = date;
    costDate.className = "cost-date";
    costDate.id = `cost-date-${_id}`;
    miniBlock.append(costDate);

    const costNumber = document.createElement("p");
    costNumber.innerText = `${number} р.`;
    costNumber.className = "cost-number";
    costNumber.id = `cost-number-${_id}`;
    miniBlock.append(costNumber);

    const buttonImgEdit = document.createElement("button");
    buttonImgEdit.id = `button-img-edit-${_id}`;
    const imageEdit = document.createElement("img");
    imageEdit.className = "img-button";
    imageEdit.src = "svg/pen.svg";
    imageEdit.alt = "Edit";
    miniBlock.append(buttonImgEdit);
    buttonImgEdit.append(imageEdit);

    const buttonImgDelete = document.createElement("button");
    buttonImgDelete.id = `button-img-delete-${_id}`;
    const imageDelete = document.createElement("img");
    imageDelete.className = "img-button";
    imageDelete.src = "svg/trash-alt.svg";
    imageDelete.alt = "Delete";
    miniBlock.append(buttonImgDelete);
    buttonImgDelete.append(imageDelete);

    buttonImgDelete.onclick = () => {
      deleteCost(_id);
    };

    buttonImgEdit.onclick = () => {
      editCost(cost);
    };
  });
};

const sum = () => {
  let result = 0;
  allCosts.forEach((cost) => {
    const { number } = cost;
    result += number;
  });
  return result;
};

const addCost = async () => {
  try {
    const inputWhereSpent = document.getElementById("where-spent");
    const inputHowMuchSpent = document.getElementById("how-much-spent");
    if (!inputWhereSpent || !inputHowMuchSpent) {
      return;
    }

    const response = await fetch(`${URL}costs`, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify({
        text: inputWhereSpent.value,
        number: inputHowMuchSpent.value,
      }),
    });
    const result = await response.json();
    allCosts.push(result);
    inputWhereSpent.value = "";
    inputHowMuchSpent.value = "";
    render();
  } catch (error) {
    console.error("Failed to add a cost");
  }
};

const editCost = (cost) => {
  try {
    const { text, number, _id } = cost;
    const inputEditText = document.createElement("input");
    const inputEditNumber = document.createElement("input");
    inputEditText.id = `input-edit-text-${_id}`;
    inputEditText.type = "text";
    inputEditText.value = text;
    inputEditNumber.id = `input-edit-number-${_id}`;
    inputEditNumber.type = "number";
    inputEditNumber.value = number;

    const buttonImgDone = document.createElement("button");
    buttonImgDone.id = `button-img-done-${_id}`;
    const imageDone = document.createElement("img");
    imageDone.className = "img-button";
    imageDone.src = "svg/check.svg";
    imageDone.alt = "Save";
    buttonImgDone.append(imageDone);

    const buttonImgCancel = document.createElement("button");
    buttonImgCancel.id = `button-img-cancel-${_id}`;
    const imageCancel = document.createElement("img");
    imageCancel.className = "img-button";
    imageCancel.src = "svg/times.svg";
    imageCancel.alt = "Cancel";
    buttonImgCancel.append(imageCancel);

    const container = document.getElementById(`cost-${_id}`);
    if (!container) {
      return;
    }

    const containerReplace = document.createElement("div");
    containerReplace.className = "container-replace";
    containerReplace.append(
      inputEditText,
      inputEditNumber,
      buttonImgDone,
      buttonImgCancel
    );
    container.replaceWith(containerReplace);

    buttonImgDone.onclick = () => doneCost(_id);
    buttonImgCancel.onclick = () => cancelCost(_id);
  } catch (error) {
    console.error("Failed to edit Cost");
  }
};

const doneCost = async (_id) => {
  try {
    const inputEditText = document.getElementById(`input-edit-text-${_id}`);
    const inputEditNumber = document.getElementById(`input-edit-number-${_id}`);

    if (!inputEditText || !inputEditNumber) {
      return;
    }
    const response = await fetch(`${URL}costs/${_id}`, {
      method: "PATCH",
      headers: fetchHeaders,
      body: JSON.stringify({
        text: inputEditText.value,
        number: inputEditNumber.value,
      }),
    });
    const data = await response.json();

    allCosts.forEach((cost) => {
      if (cost._id === data._id) {
        cost.text = data.text;
        cost.number = data.number;
      }
    });

    render();
  } catch (error) {
    console.error("Failed to save changes");
  }
};

const cancelCost = (_id) => {
  try {
    const inputEditText = document.getElementById(`input-edit-ext-${_id}`);
    const inputEditNumber = document.getElementById(`input-edit-number-${_id}`);
    const buttonImgDone = document.getElementById(`button-img-done-${_id}`);
    const buttonImgCancel = document.getElementById(`button-img-cancel-${_id}`);
    const buttonImgDelete = document.getElementById(`button-img-delete-${_id}`);
    const buttonImgEdit = document.getElementById(`button-img-edit-${_id}`);
    const costText = document.getElementById(`cost-text-${_id}`);
    const costNumber = document.getElementById(`cost-number-${_id}`);
    inputEditText.replaceWith(costText);
    inputEditNumber.replaceWith(costNumber);
    buttonImgDone.replaceWith(buttonImgEdit);
    buttonImgCancel.replaceWith(buttonImgDelete);
    render();
  } catch (error) {
    console.error("Failed to cancel cost editing");
  }
};

const deleteCost = async (_id) => {
  try {
    allCosts = allCosts.filter((element) => element._id !== _id);
    await fetch(`${URL}costs/${_id}`, {
      method: "DELETE",
      headers: fetchHeaders,
    });
    render();
  } catch (error) {
    console.error("Failed to cost task");
  }
};
