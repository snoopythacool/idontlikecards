function getUser() {
  return fetch('/api/auth/')
  .then((response) => {
      if (!response.ok) {
        return false
      } else {
        return response.json();
      }
  })
}

function getUsername(userId) {
  return fetch('/api/profile/' + (userId))
  .then((response) => {
      if (!response.ok) {
        return false
      } else {
        return response.json();
      }
  })
}

function isReviewable(duration) {
  return Date.now() <= Date.parse(duration)
}

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {
    // Get the container element
    const container = document.querySelector(".container");

    const display = document.getElementById("display");
    const displayImage = document.getElementById("displayImage");
    const typeSpan = document.getElementById("type");
    const artistSpan = document.getElementById("artist");
    const nameSpan = document.getElementById("name");
    const releaseDateSpan = document.getElementById("releaseDate");

    const insertSpan = document.getElementById("insert");
    const reviewInsert = document.getElementById("reviewInsert");
    const deleteSpan = document.getElementById("deleteSpan");
    const deleteAnchor = document.getElementById("delete");
    const uploadAnchor = document.getElementById("upload");

    const reviewSpan = document.getElementById("reviews");
    const noreviewSpan = document.getElementById("noreviews");
    const userSpan = document.getElementById("user");
    const reviewBox = document.getElementById("reviewBox");
    const nextReviewerButton = document.getElementById("nextUserButton");

    const aboutSpan = document.getElementById("about");
    const typeDescriptionSpan = document.getElementById("typeDescription");
    const nextTypeButton = document.getElementById("nextTypeButton");

    const releaseTypes = [
      "Essentials: 음악에 큰 영향을 준 역사적 명반",
      "Eerie: 기괴한게 땡길때 듣는 음악",
      "Trendy: 지금의 트렌드를 반영하는 음악",
      "Hipster: 방안에서 가만히 감상하기 좋은 음악",
      "Chill: 소소한 활동을 하면서 즐길 수 있는 음악",
      "Elysium: 활기찬 기운을 얻을 수 있는 음악",
      "Rockstar: 마치 기타를 들고 있는 것 같은 음악",
      "Bling: 힙합... 그냥 힙합 음악"
    ]
    const releaseColors = [
      "#D9D9D9",
      "#98D147",
      "#D52831",
      "#C99065",
      "#AA945B",
      "#D194C2",
      "#998A8C",
      "#70C299"
    ]
    let currentType = 0

    let reviews = []
    let currentReview = -1
    let uploadType = "create"
    let currentCard = ""

    function createCard(id, reviewable) {
      var card = document.createElement("div");
      card.className = "card";
      card.id = id

      var image = document.createElement("img");
      image.className = "cardimage"
      image.id = id
      image.src = "images/" + (id) + ".png"
      card.appendChild(image);

      if(reviewable) {
        card.classList.add("reviewable")
      }

      // When UI is clicked
      card.addEventListener("click", cardOnClick);
      container.appendChild(card);
    }

    function displayCards() {
      fetch('/api/searchall/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        response.forEach(element => {
          createCard(element.albumId, isReviewable(element.duration))
        });
      });
    }
    function searchAndDisplayCards(searchString) {
      fetch('/api/search/' + searchString)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        response.forEach(element => {
          createCard(element.albumId, isReviewable(element.duration))
        });
      });
    }
    displayCards()

    function cardOnClick() {
      // change current card id
      if (currentCard != this.id) {
        currentCard = this.id
        currentReview = 0
        loadCard()
      } else {
        currentCard = -1
        unloadCard()
      }
    }
    function loadCard() {
      // change display based on id
      fetch('/api/albums/' + currentCard)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        display.style.display = "grid"
        aboutSpan.style.display = "none"
        typeSpan.textContent = response.release_type
        artistSpan.textContent = response.artist
        nameSpan.textContent = response.name
        releaseDateSpan.textContent = response.release_date
        displayImage.src = "/images/" + (currentCard) + ".png"
        reviewInsert.innerHTML = ""
        let uploaded = false
        getUser().then((userinfo) => {
          if (!userinfo) {
            // User is not logged in
            uploadType = "none"
            insertSpan.style.display = "none"
          } else if(isReviewable(response.duration)) {
            fetch('/api/review/' + (currentCard))
            .then((response) => {
              uploaded = response.ok
              if (uploaded) {
                // Review period didn't end || Review is posted
                uploadType = "update"
                insertSpan.style.display = "inline"
                deleteSpan.style.display = "inline"
                uploadAnchor.textContent = "업데이트"
              } else {
                // Review period didn't end || Review is not posted
                uploadType = "create"
                insertSpan.style.display = "inline"
                uploadAnchor.textContent = "올리기"
              }
              return response.json()
            })
            .then((response) => {
              if (uploaded) {
                reviewInsert.innerHTML = response.review
              }
            })
          } else {
            fetch('/api/review/' + (currentCard))
            .then((response) => {
              uploaded = response.ok
              if (uploaded) {
                // Review period ended || Review is posted
                uploadType = "none"
                insertSpan.style.display = "inline"
                insertSpan.contentEditable = false
                uploadAnchor.style.display = "none"
              } else {
                // Review period ended || Review is not posted
                uploadType = "none"
                insertSpan.style.display = "none"
              }
              return response.json()
            }).then((response) => {
              if (uploaded) {
                reviewInsert.textContent = response.review
              }
            })
          }
        })
      });

      // change and load reviews
      fetch('/api/reviews/' + currentCard)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        reviews = response
        reviewSpan.style.display = "inline"
        if (reviews.length == 0) {
          reviewSpan.style.display = "none"
        } else {
          noreviewSpan.style.display = "none"
        }
      })
      .then(
        loadReviews
      );
    }
    function unloadCard() {
      display.style.display = "none"
      aboutSpan.style.display = "inline"
    }

    function remove() {
      fetch('/api/reviews/' + (currentCard), {
        method: 'DELETE'
      })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/"
        }
      })
    }
    function upload() {
      fetch('/api/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          albumId: currentCard, 
          review: reviewInsert.innerHTML
        })
      })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/"
        }
      })
    }
    function update() {
      fetch('/api/reviews/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          albumId: currentCard, 
          review: reviewInsert.innerHTML
        })
      })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/"
        }
      })
    }
    uploadAnchor.addEventListener("click", () => {
      if(uploadType == "create") {
        upload()
      } else if(uploadType == "update") {
        update()
      }
    })
    deleteAnchor.addEventListener("click", () => {
      remove()
    })

    function loadReviews() {
      if (reviews.length > 0) {
        loadReview(reviews[currentReview])
      }
    }
    function loadReview(review) {
      reviewBox.innerHTML = review.review
      getUsername(review.userId).then(
        (response) => {
          userSpan.textContent = response.username
        }
      )
    }
    function nextReviewer() {
      currentReview += 1
      if (currentReview == reviews.length) {
        currentReview = 0
      }
      loadReviews()
    }
    nextReviewerButton.addEventListener("click", nextReviewer)

    function loadTypeDescription() {
      typeDescriptionSpan.textContent = releaseTypes[currentType]
      typeDescriptionSpan.style.color = releaseColors[currentType]
      typeDescriptionSpan.style.backgroundColor = "#000000"
    }
    function nextType() {
      currentType += 1
      if (currentType == releaseTypes.length) {
        currentType = 0
      }
      loadTypeDescription()
    }
    nextTypeButton.addEventListener("click", nextType)
    loadTypeDescription()

});

