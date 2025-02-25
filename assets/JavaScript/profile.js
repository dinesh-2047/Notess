function uploadImage() {
    document.getElementById("upload").click();
}

document.getElementById("upload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("profilePic").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function editProfile() {
    let newName = prompt("Enter new name:", document.getElementById("username").innerText);
    let newBio = prompt("Enter new bio:", document.getElementById("bio").innerText);

    if (newName) document.getElementById("username").innerText = newName;
    if (newBio) document.getElementById("bio").innerText = newBio;
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
window.onload = function() {
    document.body.style.opacity = 1;
};