// color alpha

function setColor(color) {
    const alpha = color.nextElementSibling
    alpha.style.accentColor = color.value.toString()
    alpha.nextElementSibling.value = color.value.toString()+alpha.nextElementSibling.value.slice(-2).padStart(2, '0')
}
function setOpacity(alpha) {
    alpha.parentElement.style.opacity = alpha.value/255
    alpha.nextElementSibling.value = alpha.nextElementSibling.value.slice(0, -2)+parseInt(alpha.value).toString(16).padStart(2, '0')
}
function colorAlphaChange(display) {
    const colorAlphaElement = display.parentElement
    const color = colorAlphaElement.querySelector("input[type='color']")
    const alpha = colorAlphaElement.querySelector("input[type='range']")
}

document.querySelectorAll(".color-alpha").forEach((colorAlphaElement)=>{
    const color = colorAlphaElement.querySelector("input[type='color']")
    const alpha = colorAlphaElement.querySelector("input[type='range']")
    const display = colorAlphaElement.querySelector("input[type='hidden']")
    setColor(color); setOpacity(alpha);
    colorAlpha(colorAlphaElement)
    color.addEventListener("input", (event) => {setColor(color)})
    alpha.addEventListener("input", (event) => {setOpacity(alpha)})
    display.addEventListener("changed", (event) => {colorAlphaChange(display)})
})

function colorAlpha(element) {
    const color = element.querySelector("input[type='color']")
    const alpha = element.querySelector("input[type='range']")
}

// details grow and shrink
const containerElement = document.querySelector("#editor-container")
if (containerElement) {
    document.querySelectorAll("details").forEach((detailsElement)=>{
        detailsElement.addEventListener("click", (event)=>{
            containerElement.style.width = containerElement.clientWidth.toString()+"px"
            containerElement.style.height = containerElement.clientHeight.toString()+"px"
            containerElement.offsetHeight
            containerElement.style.width = "calc-size(auto, size)"
            containerElement.style.height = "calc-size(auto, size)"
        })
    })
}