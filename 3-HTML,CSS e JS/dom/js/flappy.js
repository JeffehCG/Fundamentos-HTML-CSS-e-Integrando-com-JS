// Criando elemento-------------------------------------------------------------------------------------
function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}


//Criando Barreira - função construtura (objeto) -------------------------------------------------------
function Barreira(reversa = false){ //reverse - identifica se é a barreira de cima, ou de baixo
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda) //se for reversa, primeiro aplica corpo
    this.elemento.appendChild(reversa ? borda : corpo) //se for reversa, segundo aplica borda

    this.setAltura = altura => corpo.style.height = `${altura}px` //função para alterar tamanho do corpo do elemento
}

//Testando o construtor Barreira
// const b = new Barreira(true)
// b.setAltura(200)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)


//Criando ParDeBarreiras - função construtora(objeto)--------------------------------------------------
function ParDeBarreiras(altura, abertura, posicao){
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)//deve ser chamado this.superior.elemento, por que superior é um objeto. e elemento é o atributo dele
    this.elemento.appendChild(this.inferior.elemento)

    //função para sortear tamanho da abertura entre as duas barreiras
    this.sortearAbertura = () =>{
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    // PosicaoX é referente a posicao da largura (horizontal)
    //Identificar em que pocição o par de barreira esta
    this.getPosicaoX = () => parseInt(this.elemento.style.left.split('px')[0]) //split vai pegar o tamanho (100px) e transformar em um array ('100' , 'px')
    //Mudando a pocisão da barreira
    this.setPosicaoX = posicao => this.elemento.style.left = `${posicao}px`
    //Identificando a largura do objeto
    this.getLargura = () => this.elemento.clientWidth

    //Sorteando a abertura e colocando o objeto no lugar passado por parametro 'x"
    this.sortearAbertura()
    this.setPosicaoX(posicao)
}

//Testando o construtor ParDeBarreiras
// const b = new ParDeBarreiras(600, 200, 400)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)


//Função construtura Barreiras----------------------------------------------------------------------------
function Barreiras(altura, largura, abertura, espaco, notificarPonto){ //notificarPonto é uma função recursiva
    this.pares = [ //array
        new ParDeBarreiras(altura,abertura,largura), //pocisao recebe largura do jogo, para a barreira começar fora da tela do jogo
        new ParDeBarreiras(altura,abertura,largura + espaco), //espaço = espalo entre as duas barreiras
        new ParDeBarreiras(altura,abertura,largura + espaco * 2),
        new ParDeBarreiras(altura,abertura,largura + espaco *3)
    ]

    const deslocamento = 3 //de quanto em quantos pixels sera deslocado as barreiras em direção ao passaro
    //movimentando barreiras
    this.animar = () => {
        this.pares.forEach(par => {
            par.setPosicaoX(par.getPosicaoX() - deslocamento)

            //quando o elemento sai da tela, retornar para o final
            if(par.getPosicaoX()< -par.getLargura()){ //quando a posicao for menor que a largura do par de barreiras
            par.setPosicaoX(par.getPosicaoX() + espaco * this.pares.length) //calcula quantas barreiras tem, e coloca no final delas
            par.sortearAbertura() //sorteando nova abertura para a barreira que voltou para o final
            }

            //identificando quando a barreira passou a metade , para marcar ponto
            const meio = largura / 2
            const cruzouOMeio = par.getPosicaoX()+deslocamento >= meio //se a posição da barreira + deslocamento for igual maior ao meio
                && par.getPosicaoX() <meio                             //e a posição for menor que o meio
            if(cruzouOMeio) notificarPonto()                          // Executa a funçaõ notificarPonto
        })
    }
}

//Criando Contrutor Pasarro-----------------------------------------------------------------------------------
function Passaro(alturaJogo){//alturaJogo - altura maxima que o passaro pode chegar
    let voando = false
    
    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    //PosicaoY é referente a posicao da altura(vertical)
    this.getPosicaoY = () => parseInt(this.elemento.style.bottom.split('px')[0]) //Identificar a posição que o passaro esta
    this.setPosicaoY = posicaoY => this.elemento.style.bottom = `${posicaoY}px`

    window.onkeydown = e => voando = true //onkeydown = quando a tecla estiver precionada ativa esse evento
    window.onkeyup = e => voando = false //onkeyup = quando o usuario soltar a tecla

    //Movimentando passaro
    this.animar = () => {
        const novoY = this.getPosicaoY() + (voando ? 8 : -5) //se voando for true soma mais oito na posicao atual, se não subtrai 5
        const alturaMaxima = alturaJogo - this.elemento.clientHeight //Altura maxima que o passaro pode voar ClientHeight - altura do passaro

        if(novoY <= 0) { //se a nova posicao for zero, mantenha zero para não ultrapassar o chão
            this.setPosicaoY(0)
        }else if (novoY >= alturaMaxima){//se a nova posição for maior que a altura maxima, manter a altura maxima, para não ultrapassar o teto
            this.setPosicaoY(alturaMaxima)
        }else{ // não violando nenhuma condição, aplica o novo valor de y
            this.setPosicaoY(novoY)
        }
    }
    this.setPosicaoY(alturaJogo/2)
}



//Criando construtor Progresso (objeto que ira exibir a pontuação)-----------------------------------------------
function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos =>{
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}


//Testando Construtor Barreiras e Passaro e Progresso
// const barreiras = new Barreiras(700,1200,200,400)
// const passaro = new Passaro(700)
// const areaDoJogo = document.querySelector('[wm-flappy]')

// areaDoJogo.appendChild(passaro.elemento)
// areaDoJogo.appendChild(new Progresso().elemento)
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
// setInterval(() => {
//     barreiras.animar()
//     passaro.animar()
// }, 20);


//Funções para identificar a colizão entre elementos (Quando o passaro bate no cano)------------------------------

//Calculando as dimensões dos elementos, para vereficar sobreposição
function estaoSobrepostos(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect() //Pegando o retangulo associado ao elementoA
    const b = elementoB.getBoundingClientRect() //Pegando o retangulo associado ao elementoA

    //se baseando sempre pelo lado esquerdo nesse jogo
    //Calculando a colisao no sentido horizontal
    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    //Calculando a colisao no sentido vertical
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizontal && vertical //se as condições acima forem verdadeiras retona esses valores
}

//Testando a colisão entre o passaro e as barreiras
function colidiu(passaro, barreiras){
    let colidiu = false
    barreiras.pares.forEach(parDeBarreiras => { 
        if(!colidiu){
            const superior = parDeBarreiras.superior.elemento //superior barreira
            const inferior = parDeBarreiras.inferior.elemento //inferior barreira
            colidiu = estaoSobrepostos(passaro.elemento,superior) //verificando colisão
                || estaoSobrepostos(passaro.elemento,inferior) //Verificando colisão //Se algumas das condiçoes colidiram, colidir sera true
        }
    })
    return colidiu
}

//Função que representara o jogo----------------------------------------------------------------------------------
function FlappyBird(){
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')

    const altura = areaDoJogo.clientHeight //Calculando a altura do elemento (no caso a tela do jogo)
    const largura = areaDoJogo.clientWidth //Calculando a largura do elemento (no caso a tela do jogo)

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura,largura,200,400,
        ()=>progresso.atualizarPontos(++pontos))//Função recurciva, quando passar do meio marcar um ponto
    const passaro = new Passaro(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        // loop do jogo
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()

            if(colidiu(passaro,barreiras)){ //Se o passaro colidir, o temporizador ira parar
                clearInterval(temporizador)
            }
        }, 20)
    }
}

new FlappyBird().start() //Iniciando jogo

