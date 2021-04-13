// write your code here
const url = 'http://localhost:3000/ramens'
document.addEventListener("DOMContentLoaded", () => {
  fetchRamenPhotosAndRender()
  
  fetchAndRenderFirstRamen()
  
  const editRamenForm = document.querySelector("form#ramen-rating")
  editRamenForm.addEventListener("submit", updateRamen)
  
  const deleteBtn = document.querySelector("button.delete-button")
  deleteBtn.addEventListener("click", deleteRamen)

  const createRamenForm = document.querySelector("form#new-ramen")
  createRamenForm.addEventListener("submit", createRamen)

})

const fetchRamenPhotosAndRender = () => {
  fetch(url)
  .then(resp => resp.json())
  .then(ramensArr => ramensArr.forEach(ramen => {
    renderRamenPhotoInMenu(ramen)
  }))
}

const renderRamenPhotoInMenu = (ramenObj) => {
  const ramenImg = document.createElement("img")
  ramenImg.src = `${ramenObj.image}`
  ramenImg.dataset.id = ramenObj.id
  
  const ramenMenu = document.querySelector("div#ramen-menu")
  ramenMenu.append(ramenImg)
  ramenMenu.addEventListener("click", fetchAndRenderClickedRamen)
}

const fetchAndRenderClickedRamen = event => {
  if (event.target.tagName === "IMG") {
    fetch(url + `/${event.target.dataset.id}`)
    .then(resp => resp.json())
    .then(renderRamenDetails)
  }  
}

const fetchAndRenderFirstRamen = () => {
  fetch(url)
  .then(resp => resp.json())
  .then(ramensArr => renderRamenDetails(ramensArr[0]))
}

const renderRamenDetails = ramenObj => {
  const ramenDetailDiv = document.querySelector("div#ramen-detail")
  
  const ramenImg = ramenDetailDiv.querySelector("img.detail-image")
  ramenImg.src = ramenObj.image
  ramenImg.alt = ramenObj.name

  const ramenName = ramenDetailDiv.querySelector("h2.name")
  ramenName.textContent = ramenObj.name

  const restaurant = ramenDetailDiv.querySelector("h3.restaurant")
  restaurant.textContent = ramenObj.restaurant

  const editRamenForm = document.querySelector("form#ramen-rating")
  editRamenForm.dataset.id = ramenObj.id
  editRamenForm.rating.value = ramenObj.rating
  editRamenForm.comment.value = ramenObj.comment

  const deleteBtn = document.querySelector("button.delete-button")
  deleteBtn.dataset.id = ramenObj.id
}

const updateRamen = event => {
  event.preventDefault()
  const updatedData = {
    rating: event.target.rating.value,
    comment: event.target.comment.value
  }

  fetch(url + `/${event.target.dataset.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(updatedData)
  })   
}

const deleteRamen = event => {
  const ramenMenu = document.querySelector("div#ramen-menu")
  const img = ramenMenu.querySelector(`[data-id="${event.target.dataset.id}"]`)
  img.remove()
  fetch(url + `/${event.target.dataset.id}`, {
    method: 'DELETE'
  })
  fetchAndRenderFirstRamen()
}

const createRamen = event => {
  event.preventDefault()
  newRamenData = {
    name: event.target.name.value,
    restaurant: event.target.restaurant.value,
    image: event.target.image.value,
    rating: event.target.rating.value,
    comment: event.target['new-comment'].value
  }

  createRamenPostRequest(newRamenData)
  event.target.reset()
}

const createRamenPostRequest = newRamenData => {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept": 'application/json'
    },
    body: JSON.stringify(newRamenData)
  })
  .then(resp => resp.json())
  .then(newRamenObj => {
    renderRamenDetails(newRamenObj)
    renderRamenPhotoInMenu(newRamenObj)
  })
}




