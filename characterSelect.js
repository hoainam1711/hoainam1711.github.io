const characters = [
    { name: "Bird1", color: "yellow", image: "assets/bird.gif" },
    { name: "Bird2", color: "blue", image: "assets/bird2.png" },
    { name: "Bird3", color: "red", image: "assets/bird3.png" },
];

function showCharacterSelection() {
    const menu = document.createElement("div");
    menu.id = "characterMenu";
    menu.style.position = "absolute";
    menu.style.top = "50%";
    menu.style.left = "50%";
    menu.style.transform = "translate(-50%, -50%)";
    menu.style.background = "white";
    menu.style.padding = "20px";
    menu.style.textAlign = "center";
    menu.style.borderRadius = "10px";
    menu.innerHTML = "<h2>Chọn nhân vật</h2>";

    characters.forEach((char) => {
        const btn = document.createElement("button");
        btn.innerText = char.name;
        btn.style.margin = "10px";
        btn.onclick = () => {
            localStorage.setItem("selectedCharacter", JSON.stringify(char));
            document.body.removeChild(menu);
            startGame();
        };
        menu.appendChild(btn);
    });

    document.body.appendChild(menu);
}

showCharacterSelection();