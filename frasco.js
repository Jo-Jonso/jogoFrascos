//Definindo a classe frasco
class Frasco {
    //Conteúdo dos frascos (esferas)
    conteudo = [];
}
//Definindo classe jogo
class Jogo {
    //Número de frascos dentro do jogo
    constructor() {
        this.num_frascos = 3;
        this.num_esferas = 3;
        this.movimentos = 0;
        this.dificuldade = 0;
        this.escolhoDificuldade = true;
        this.FPS = 1000/60;
        this.timer = 0;
        this.emJogo = false;
    }
    //Função que adiciona frascos dentro de uma matriz
    adicionarFrascos() {
        let frascos = [];
        for(let i = 0;i<this.num_frascos;i++) {
            frascos[i] = new Frasco();
        }
        return frascos;
    }
    //Adicionando as esferas dentro dos frascos
    adicionarEsferas(frasco_atual,cor_esfera) {
        for(let i = 0;i<this.num_esferas;i++) {
            frasco_atual.push(cor_esfera);
        }
    } 
    esferasAleatorias(frasco1,frasco2) {
        let esferas = ["🟡","🟡","🟡","🟤","🟤","🟤"];
        
        //Uso do algoritmo Fisher-Yates (fonte: en-wikipedia)
        for(let i = esferas.length-1;i>0;i--) {
            let j = Math.floor(Math.random() * (i+1));

            let temp = esferas[j];
            esferas[j] = esferas[i];
            esferas[i] = temp;
        }
        //Alternando entre os frascos para distribuir as esferas
        for(let i = 0;i<esferas.length;i++) {
            if (i%2 == 0) {
                frasco2.push(esferas[i]);
            }else {
                frasco1.push(esferas[i]);
            }

        }
    }
    esferasAleatoriasDificil(frasco1,frasco2,frasco3) {
        let esferas = ["🟡","🟡","🟡","🟤","🟤","🟤","🔴","🔴","🔴"];
        
        //Uso do algoritmo Fisher-Yates (fonte: en-wikipedia)
        for(let i = esferas.length-1;i>0;i--) {
            let j = Math.floor(Math.random() * (i+1));

            let temp = esferas[j];
            esferas[j] = esferas[i];
            esferas[i] = temp;
        }
        //Alternando entre os frascos para distribuir as esferas
        for(let i = 0;i<esferas.length;i++) {
            if (i%3 === 0) {
                frasco1.push(esferas[i]);
            }else if (i%3 === 1) {
                frasco2.push(esferas[i]);
            }else {
                frasco3.push(esferas[i]);
            }

        }
    }
    compararfrascos(frasco,padrao) {
        if (frasco.join("") == padrao)
            return true;
        else 
            return false;
    }
    escolhendoDificuldade(escolherDificuldade) {
        switch(escolherDificuldade) {
            case 1:
                this.num_frascos = 3;
                this.frascos = this.adicionarFrascos();

                this.adicionarEsferas(this.frascos[0].conteudo,"🟡");
                this.adicionarEsferas(this.frascos[2].conteudo,"🟤");
                this.dificuldade = escolherDificuldade;
                this.escolhoDificuldade = false;
                this.timer = 60;
                this.atualizarContador();
                break;
            case 2:
                this.num_frascos = 3;
                this.frascos = this.adicionarFrascos();

                this.esferasAleatorias(this.frascos[0].conteudo,this.frascos[2].conteudo);
                this.dificuldade = escolherDificuldade;
                this.escolhoDificuldade = false;
                this.timer = 45;
                this.atualizarContador();
                break;  
            case 3:
                this.num_frascos = 4;
                this.menorMovimento = 0;
                this.maiorMovimento = 3;
                this.frascos = this.adicionarFrascos();

                this.esferasAleatoriasDificil(this.frascos[0].conteudo,this.frascos[2].conteudo,this.frascos[3].conteudo);
                this.dificuldade = escolherDificuldade;
                this.escolhoDificuldade = false;
                this.timer = 30;
                this.atualizarContador();
                break;
        }
        this.emJogo = true;
    }
    verificarVitoria() {
        switch(this.dificuldade) {
            case 1:
                if (this.compararfrascos(this.frascos[0].conteudo,"🟤🟤🟤") && this.compararfrascos(this.frascos[2].conteudo,"🟡🟡🟡")) {
                    return true;
                }
                break;
            case 2:
                if (this.compararfrascos(this.frascos[0].conteudo,"🟤🟤🟤") && this.compararfrascos(this.frascos[2].conteudo,"🟡🟡🟡")) {
                    return true;
                }
                break;
            case 3:
                if (this.compararfrascos(this.frascos[0].conteudo,"🟤🟤🟤") && this.compararfrascos(this.frascos[2].conteudo,"🟡🟡🟡") && this.compararfrascos(this.frascos[3].conteudo,"🔴🔴🔴")) {
                    return true;
                }
                break;
        }
        return false;
    }

    verificarDerrota() {
        return this.timer <= 0;

    }
}
class Interface extends Jogo {
    esferaMao = null; //Esfera que está na mão do jogador
    esferaPosta = null; //Esfera colocada no frasco
    frascoOrigem = null; //Frasco de origem onde é capturada a esfera
    frascoAlvo = null; //Frasco alvo onde posso colocar a esfera

    desenharFrascos() { //Desenhando frascos na tela do jogador
        const frascosContainer = document.querySelector(".frascos-container");

        if (frascosContainer.children != 0) {
            frascosContainer.innerHTML = "";
        }

        for(let i = 0;i<this.frascos.length;i++) {
            let frascoUI = document.createElement("div");
            frascoUI.className = "frasco-container";
            frascoUI.setAttribute("indice-frasco",i);

            frascosContainer.appendChild(frascoUI);
        }
    }
    desenharEsferas() { //Desenhando esferas na tela do jogador
        let frascoUI = document.querySelectorAll(".frasco-container");
        let frascosJogo = this.frascos;

        for(let i = 0;i<frascosJogo.length;i++) {
            let esferas = frascosJogo[i].conteudo;
            for (let j = 0; j < esferas.length; j++) {
                if (esferas[j] == "🟡") {
                    let esferaDiv = document.createElement("div");
                    esferaDiv.className = "esfera amarela";

                    frascoUI[i].appendChild(esferaDiv);

                }else if (esferas[j] == "🟤") {
                    let esferaDiv = document.createElement("div");
                    esferaDiv.className = "esfera marrom";

                    frascoUI[i].appendChild(esferaDiv);

                }else if (esferas[j] == "🔴") {
                    let esferaDiv = document.createElement("div");
                    esferaDiv.className = "esfera vermelho";

                    frascoUI[i].appendChild(esferaDiv);
                }
            }
        }
    }
    pegarEsferas(indiceFrasco) {
        let frasco = this.frascos[indiceFrasco];

        const frascosUI = document.querySelectorAll(".frasco-container");
        if (frasco.conteudo.length > 0 && this.esferaMao == null) {

            //Achar a esfera e mudar a classe para esfera-sumindo
            frascosUI.forEach(frascoUI => {
                if (frascoUI.getAttribute("indice-frasco") == indiceFrasco) {
                    if (frascoUI.firstElementChild != null) {
                        frascoUI.firstElementChild.classList.add("esfera-sumindo");
                    }
                }
            });
            
            //Colocando a esfera na minha mão
            this.esferaMao = frasco.conteudo.shift();
            this.frascoOrigem = indiceFrasco;

            //Atualizando a tela com delay para dar tempo de adicionar a classe esfera sumindo
            setTimeout(() => {
            this.atualizarTela();
            }, 500);

        }
    }
    colocarEsferas(indiceFrasco) {
        let frasco = this.frascos[indiceFrasco];

        if (frasco.conteudo.length < 3 && this.esferaMao != null) {
            this.esferaPosta = this.esferaMao;
            frasco.conteudo.unshift(this.esferaPosta);
            this.frascoOrigem = null;
            this.frascoAlvo = null;
            this.esferaMao = null;
            this.esferaPosta = null;

            this.atualizarTela();
        }
    }

    atualizarTela() {
        // Limpar os frascos
        const frascos = document.querySelectorAll(".frasco-container")
        frascos.forEach(esfera => {
            esfera.innerHTML = "";
        });

        // Redesenhar as esferas
        this.desenharEsferas();
    }

    atualizarContador() {
        const timer = document.querySelector(".timer__text");

        let minutes = Math.trunc(this.timer/60);
        let seconds;
        
        if (minutes != 0) {
            seconds = Math.abs(minutes*60-this.timer);
        }else {
            seconds = this.timer;
        }

        if (seconds < 10) {
            seconds = "0" + seconds.toString();
        }

        timer.textContent = minutes + ":" + seconds; 
    }
    abrirModal(modalSelecionado) {
        let modal = document.querySelector(modalSelecionado);
        
        modal.style.display = "flex";
    }
    fecharModal(modalSelecionado) {
        let modal = document.querySelector(modalSelecionado);

        modal.style.display = "none";
    }

    eventoColocarEsfera() {
        const frascos = document.querySelectorAll(".frasco-container");

        frascos.forEach(frasco => {
            frasco.addEventListener("click", () => {
                if (UI.emJogo == true) {
                    if (UI.frascoOrigem == null) {
                        UI.pegarEsferas(frasco.getAttribute("indice-frasco"));
                    }else {
                        UI.colocarEsferas(frasco.getAttribute("indice-frasco"))
                    }
                }
            })
        });
    }

}


//Iniciando o objeto de interface do jogo
const UI = new Interface();

//Abrir o modal de bem vindo ao entrar no jogo
window.addEventListener("load",() => {
    UI.abrirModal("#introModal");

    const botaoFacil = document.getElementById("easyMode");
    const botaoMedio = document.getElementById("normalMode");
    const botaoDificil = document.getElementById("hardMode");
    
    const botaoJogar = document.querySelectorAll(".play__button");

    if (botaoFacil) {
        botaoFacil.addEventListener("click",() => {
            UI.fecharModal("#introModal");

            UI.escolhendoDificuldade(1);
            UI.desenharFrascos();
            UI.desenharEsferas();
            UI.atualizarTela();

            UI.eventoColocarEsfera();

            timerInterval = setInterval(() => {
                UI.timer--; 
                UI.atualizarContador();
            }, 1000);

            myInterval = setInterval(gameloop,UI.FPS);
        })
    }
    if (botaoMedio) {
            botaoMedio.addEventListener("click",() => {
            UI.fecharModal("#introModal");

            UI.escolhendoDificuldade(2);
            UI.desenharFrascos();
            UI.desenharEsferas();
            UI.atualizarTela();
            
            UI.eventoColocarEsfera();

            timerInterval = setInterval(() => {
                UI.timer--; 
                UI.atualizarContador();
            }, 1000);

            myInterval = setInterval(gameloop,UI.FPS);
        })

    }
    if (botaoDificil) {
        
        botaoDificil.addEventListener("click",() => {
            UI.fecharModal("#introModal");
            UI.escolhendoDificuldade(3);
            UI.desenharFrascos();
            UI.desenharEsferas();
            UI.atualizarTela();

            UI.eventoColocarEsfera();

            timerInterval = setInterval(() => {
                UI.timer--; 
                UI.atualizarContador();
            }, 1000);

            myInterval = setInterval(gameloop,UI.FPS);
        })
    }

    if (botaoJogar.length > 0) {
        botaoJogar[0].addEventListener("click",() => {
            UI.fecharModal("#winModal");
            UI.abrirModal("#introModal");

        })
        botaoJogar[1].addEventListener("click",() => {
            UI.fecharModal("#loseModal");
            UI.abrirModal("#introModal")
        })
    }
})

//Gameloop do jogo
let myInterval, timerInterval;

let gameloop = () => {
    if (UI.verificarVitoria() == true && UI.emJogo == true) {
        UI.abrirModal("#winModal");
        clearInterval(myInterval);
        clearInterval(timerInterval);
        UI.emJogo = false;
    };

    if (UI.verificarDerrota() == true && UI.emJogo == true) {
        UI.abrirModal("#loseModal");
        clearInterval(myInterval);
        clearInterval(timerInterval);
        UI.emJogo = false;
    }
}

myInterval = setInterval(gameloop,UI.FPS);