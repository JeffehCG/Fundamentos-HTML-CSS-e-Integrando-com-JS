const color = {
    p: '#388e3c',
    div: '#1565c0',
    span: '#e53935',
    section: '#f67809',
    ul: '#5e35b1',
    ol: '#fbc02d',
    header: '#d81b60',
    nav: '#64dd17',
    main: '#00acc1',
    footer: '#304ffe',
    form: '#9f6581',
    body: '#25b6da',
    padrao: '#616161',
    get(tag){
        return this [tag] ? this[tag] : this.padrao // se existir a tag no objeto pega a cor referente, se não pega a padrão
    }
}

document.querySelectorAll('.tag').forEach(elemento => {
    const tagName = elemento.tagName.toLowerCase() // toLowerCase - pega o nome da tag ( se é p , div etc )

    elemento.style.borderColor = color.get(tagName)

    if(!elemento.classList.contains('nolabel')){ // se no elemento náo tiver nenhuma classe 'nolabel' executar codigo abaixo
        const label = document.createElement('label') //criando um elemento (tag) no javascript
        label.style.backgroundColor = color.get(tagName)
        label.innerHTML = tagName
        elemento.insertBefore(label, elemento.childNodes[0])
    }
})