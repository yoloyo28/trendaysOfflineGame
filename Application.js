javascript: (
  function () {
    let points = 0;
    let scrollSpeed = 0;

    let isMoving = false;
    let isRotating = false;
    let canShootBullets = true;
    let canShootFavorites = true;

    let playerX = 800;
    let playerY = 100;
    let playerRotation = 180;

    /* Player Creation */
    let playerContainer = document.createElement("div");
    playerContainer.style.position = "fixed";
    playerContainer.style.top = playerY + "px";
    playerContainer.style.left = playerX + "px";
    playerContainer.style.fontSize = "54px";
    playerContainer.style.transform = `rotate(${playerRotation}deg)`;
    playerContainer.className = "text-greensea";

    let playerImg = document.createElement("i");
    playerImg.className = "icon-trendays-logo";

    playerContainer.appendChild(playerImg);

    /* Play Zone Initialization */
    let feedContainer = document.getElementById("tds-feed-container");
    feedContainer.appendChild(playerContainer);
    feedContainer.style.paddingTop = "800px";
    feedContainer.removeAttribute("class");

    let pointsLabel = document.createElement("div");
    pointsLabel.style.position = "fixed";
    pointsLabel.style.width = "-webkit-fill-available";
    pointsLabel.style.fontSize = "30px";
    pointsLabel.style.textAlign = "center";
    pointsLabel.style.zIndex = "1000";
    pointsLabel.className = "text-red";
    pointsLabel.innerHTML = `${points} points`;
    document.body.appendChild(pointsLabel);

    /* Scroll Time Filter */
    document.body.style.overflow = "hidden";
    let selectSpeedTxt = document.createElement("div");
    selectSpeedTxt.innerText = "^ Select Your Speed ^";
    selectSpeedTxt.style.position = "absolute";
    selectSpeedTxt.style.width = "-webkit-fill-available";
    selectSpeedTxt.style.top = "40%";
    selectSpeedTxt.style.zIndex = "1000";
    selectSpeedTxt.style.textAlign = "center";
    selectSpeedTxt.style.fontSize = "64px";

    let thenStartTxt = document.createElement("span");
    thenStartTxt.innerHTML = "&or; Then Start &or;";
    thenStartTxt.style.fontSize = "18px";

    let buttonStart = document.createElement("button");
    buttonStart.className = "myBtn";
    buttonStart.innerText = "START";
    buttonStart.style.fontSize = "32px";
    buttonStart.onclick = startGame;

    selectSpeedTxt.appendChild(document.createElement("br"));
    selectSpeedTxt.appendChild(thenStartTxt);
    selectSpeedTxt.appendChild(document.createElement("br"));
    selectSpeedTxt.appendChild(buttonStart);

    if (true) document.body.appendChild(selectSpeedTxt);

    document.getElementsByClassName("filterTrigger")[0].click();
    let filters = document.getElementsByClassName("rc-slider-mark-text");
    let filterParent = filters[0].parentElement;

    while (filters.length > 0) {
      filters[0].remove();
    }

    let selectedSpeed = 5;
    const scrollSpeeds = ["Not Moving", "Insanely Slow", "Really Slow", "Slow", "Fastly Slow", "Medium", "Slowly Fast", "Fast", "Really Fast", "Insanely Fast", "Instant Death"];
    const actualScrollSpeeds = [999999, 100, 45, 30, 15, 11, 2, 4, 6, 8, 10];
    let sliderDots = document.getElementsByClassName("rc-slider-dot");
    for (let i = 0; i < scrollSpeeds.length; i++) {
      let newFilter = document.createElement("span");
      newFilter.className = "rc-slider-mark-text";
      sliderDots[i].className = "rc-slider-dot";
      newFilter.style = `width: 9%; margin-left: -4.5%; left: ${i * 10}%; font-weight: bold`;
      newFilter.onclick = () => setSpeedActive(i);
      sliderDots[i].onclick = () => setSpeedActive(i);

      if (i == selectedSpeed) {
        sliderDots[i].className += " rc-slider-dot-active";
        newFilter.className += " rc-slider-mark-text-active";
        document.getElementsByClassName("rc-slider-handle")[0].style.left = (i * 10) + "%";
      }

      let value = document.createElement("div");
      value.innerHTML = scrollSpeeds[i];
      newFilter.appendChild(value);

      filterParent.appendChild(newFilter);
    }

    function setSpeedActive(index) {
      let speedLabels = document.getElementsByClassName("rc-slider-mark-text");

      for (let i = 0; i < speedLabels.length; i++) {
        speedLabels[i].className = "rc-slider-mark-text";
      }

      speedLabels[index].className = "rc-slider-mark-text rc-slider-mark-text-active";

      selectedSpeed = index;
    }

    function startGame() {
      selectSpeedTxt.remove();
      pageScroll(actualScrollSpeeds[selectedSpeed]);
    };


    function calculateMoveDirection(rotationDirection) {
      let isGoingLeft = rotationDirection > 180 && rotationDirection < 360;
      let isGoingUp = rotationDirection > 270 || rotationDirection < 90;

      let rotation = rotationDirection;
      let valueX = 0;
      let valueY = 0;

      if (isGoingLeft) {
        rotation = rotationDirection - 180;
      }

      valueX = Math.abs((Math.abs((rotation / 90) - 1)) - 1);
      valueY = Math.abs((rotation / 90) - 1);

      if (isGoingLeft) {
        valueX = -valueX;
      }
      if (isGoingUp) {
        valueY = -valueY;
      }

      return { valueX, valueY };
    };

    /* Input Manager */
    let horizontalMovingId = null;
    let verticalMovingId = null;

    document.body.addEventListener("keydown", function onEvent(event) {
      if (!isRotating) {
        if (event.code == "KeyA") {
          horizontalMovingId = setInterval(frame, 5);
          function frame() {
            isRotating = true;
            --playerRotation;
            if (playerRotation <= 0) {
              playerRotation += 360;
            }
            playerContainer.style.transform = `rotate(${playerRotation}deg)`;
          }
        } else if (event.code == "KeyD") {
          horizontalMovingId = setInterval(frame, 5);
          function frame() {
            isRotating = true;
            ++playerRotation;
            if (playerRotation >= 360) {
              playerRotation -= 360;
            }
            playerContainer.style.transform = `rotate(${playerRotation}deg)`;
          }
        }
      }
      if (!isMoving) {
        if (event.code == "KeyW") {
          verticalMovingId = setInterval(frame, 5);
          function frame() {
            isMoving = true;

            let values = calculateMoveDirection(playerRotation);

            playerX += values.valueX * 2;
            playerContainer.style.left = playerX + 'px';

            if (values.valueY > 0 || playerY > 0) {
              playerY += values.valueY * 2;
              playerContainer.style.top = playerY + 'px';
            }
          }
        }
        if (event.code == "KeyS") {
          verticalMovingId = setInterval(frame, 5);
          function frame() {
            isMoving = true;

            let values = calculateMoveDirection(playerRotation);

            playerX -= values.valueX * 2;
            playerContainer.style.left = playerX + 'px';

            if (values.valueY < 0 || playerY > 0) {
              playerY -= values.valueY * 2;
              playerContainer.style.top = playerY + 'px';
            }
          }
        }
      }

      if (event.code == "Space") {
        if (canShootBullets) {
          canShootBullets = false;

          createBullet(false);

          setTimeout(shootTimeout, 20);
          function shootTimeout() {
            canShootBullets = true;
          }
        }
      }

      if (event.code == "KeyL") {
        if (canShootFavorites) {
          canShootFavorites = false;

          createBullet(true);

          setTimeout(shootTimeout, 20);
          function shootTimeout() {
            canShootFavorites = true;
          }
        }
      }

      event.preventDefault();
    });

    document.body.addEventListener("keyup", function onEvent(event) {
      if (event.code == "KeyA" || event.code == "KeyD") {
        clearInterval(horizontalMovingId);
        /*isMoving = false;*/
        isRotating = false;
      }
      if (event.code == "KeyW" || event.code == "KeyS") {
        clearInterval(verticalMovingId);
        isMoving = false;
      }
    });

    /* Auto Scroll */
    let autoScrollId;

    function pageScroll(speed) {
      let scrollStep = 1;
      let scrollTimeout = speed;

      if (speed <= 10) {
        scrollStep = speed;
        scrollTimeout = 10;
      }

      window.scrollBy(0, scrollStep);
      autoScrollId = setTimeout(() => pageScroll(speed), scrollTimeout);
    }

    /* Collision Check */
    function checkOverlap(firstElement) {
      let posts = feedContainer.getElementsByClassName("grid-item-3");

      let overlap = false;
      for (let i = 0; i < posts.length; i++) {
        if (posts[i].style.visibility == "hidden") {
          console.log("HEY");
          continue;
        }

        let rect1 = firstElement.getBoundingClientRect();
        let rect2 = posts[i].getBoundingClientRect();
        overlap = !(rect1.right < rect2.left ||
          rect1.left > rect2.right ||
          rect1.bottom < rect2.top ||
          rect1.top > rect2.bottom);

        if (overlap) {
          return posts[i];
          break;
        }
      }

      return overlap;
    }

    /* Death Check */
    let deathCheckId;
    function checkDeath() {
      if (checkOverlap(playerContainer)) {
        clearTimeout(deathCheckId);
        clearTimeout(autoScrollId);
        clearTimeout(horizontalMovingId);
        clearTimeout(verticalMovingId);
        alert(`You Died. You finished with ${points} points!`);
      } else {
        deathCheckId = setTimeout(checkDeath, 500);
      }
    }
    checkDeath();


    /* Bullet Creation */
    function createBullet(isFavoriteMissile) {
      let bulletContainer = document.createElement("div");
      bulletContainer.style.position = "fixed";
      bulletContainer.style.top = (playerY + 50) + "px";
      bulletContainer.style.left = (playerX - 18) + "px";
      bulletContainer.style.transform = `rotate(${playerRotation + 90}deg)`;
      bulletContainer.className = "text-greensea";

      if (isFavoriteMissile) {
        bulletContainer.style.fontSize = "18px";
        let bulletImg = document.createElement("span");
        bulletImg.innerText = "FAVORITE";
        bulletContainer.appendChild(bulletImg);
      } else {
        bulletContainer.style.fontSize = "24px";
        let bulletImg = document.createElement("i");
        bulletImg.className = "icon-trendays";
        bulletContainer.appendChild(bulletImg);
      }

      feedContainer.appendChild(bulletContainer);

      const bulletRotation = playerRotation;

      let bulletMovingId = setInterval(bulletTrajectory, 10);
      function bulletTrajectory() {
        let bulletX = parseInt(bulletContainer.style.left, 10);
        let bulletY = parseInt(bulletContainer.style.top, 10);

        let values = calculateMoveDirection(bulletRotation);

        bulletX += values.valueX * 5;
        bulletContainer.style.left = bulletX + 'px';

        bulletY += values.valueY * 5;
        bulletContainer.style.top = bulletY + 'px';

        let collision = checkOverlap(bulletContainer);

        if (collision) {
          clearInterval(bulletMovingId);
          bulletContainer.remove();

          if (isFavoriteMissile) {
            document.getElementsByName(`postVote-${collision.id}`)[0].click();
          } else {
            if (collision.style.opacity == "") collision.style.opacity = "1";

            let newOpacity = parseFloat(collision.style.opacity) - 0.25;

            collision.style.opacity = newOpacity.toString();

            if (newOpacity <= 0) {
              points += 10;
              collision.style.visibility = "hidden";
              pointsLabel.innerHTML = `${points} points`;
            }
          }
        }

        if (bulletY > 800 || bulletY < 0 || bulletX > 1500 || bulletX < 0) {
          clearInterval(bulletMovingId);
          bulletContainer.remove();
        }
      }
    }
  }
)();