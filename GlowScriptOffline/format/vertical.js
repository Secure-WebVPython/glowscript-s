const init = () => {
    const glows = document.getElementById('glows');
    if (glows == null) { return; }

    // make glows be the last child
    // because it is naughty and has more annoying formatting
    glows.parentElement.appendChild(glows);
}


init();