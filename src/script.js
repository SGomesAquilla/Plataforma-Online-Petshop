// CPF Format
document.getElementById("cpf").addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "");
    if (v.length > 3) v = v.replace(/(\d{3})(\d)/, "$1.$2");
    if (v.length > 6) v = v.replace(/(\d{3})(\d)/, "$1.$2");
    if (v.length > 9) v = v.replace(/(\d{3})(\d{2})$/, "$1-$2");
    this.value = v;
});

// Automatic filling by CEP
const cepInput = document.getElementById("cep");

cepInput.addEventListener("input", function () {
    // CEP mask: 00000-000
    let v = this.value.replace(/\D/g, "");
    if (v.length > 5) v = v.replace(/(\d{5})(\d)/, "$1-$2");
    this.value = v;
});

cepInput.addEventListener("blur", async function () {
    const cep = this.value.replace(/\D/g, "");

    if (cep.length !== 8) return; // invalid CEP

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert("CEP não encontrado!");
            return;
        }

        // Fill fields automatically
        const endereco = document.getElementById("endereco");
        if (endereco) endereco.value = data.logradouro || "";

        const bairro = document.getElementById("bairro");
        if (bairro) bairro.value = data.bairro || "";

        const cidade = document.getElementById("cidade");
        if (cidade) cidade.value = data.localidade || "";

        const estado = document.getElementById("estado");
        if (estado) estado.value = data.uf || "";

    } catch (err) {
        console.error("Erro ao buscar CEP:", err);
    }
});

// Format Telefone
const telInput = document.getElementById("telefone");

telInput.addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "");

    // Celular: (00) 00000-0000
    if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } 
    // Fixo: (00) 0000-0000
    else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    }
    // (00) 0000
    else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    }
    // (00
    else {
        v = v.replace(/^(\d{0,2})/, "($1");
    }

    this.value = v;
});

// Format Hora
const horaInput = document.getElementById("horaAgendamento");

horaInput.addEventListener("input", function () {
    let v = this.value.replace(/\D/g, ""); // remove tudo que não é número

    // Adiciona os dois pontos automaticamente
    if (v.length >= 3) {
        v = v.replace(/(\d{2})(\d{0,2})/, "$1:$2");
    }

    // Atualiza o valor
    this.value = v;

    // Validação automática de horário
    const [hStr, mStr] = this.value.split(":");

    if (hStr && parseInt(hStr) > 23) {
        this.value = "23" + (mStr ? ":" + mStr : "");
    }

    if (mStr && parseInt(mStr) > 59) {
        this.value = hStr + ":59";
    }
});
// ------------------------------------------------------------------------------------------------
// Array para armazenar itens do carrinho
let carrinho = [];

// Função para adicionar item
function adicionarAoCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarCarrinho();
}

// Atualizar modal do carrinho
function atualizarCarrinho() {
    const lista = document.getElementById("carrinhoItens");
    const totalEl = document.getElementById("carrinhoTotal");

    lista.innerHTML = ""; // Limpa lista
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        li.innerHTML = `
            ${item.nome}
            <span>R$ ${item.preco.toFixed(2)}</span>
            <button class="btn btn-sm btn-danger ms-2" onclick="removerItem(${index})">Remover</button>
        `;
        lista.appendChild(li);
    });

    totalEl.textContent = total.toFixed(2);
}

// Remover item do carrinho
function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

// Exemplo de finalizar compra
function finalizarCompra() {
    if(carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    alert(`Compra finalizada! Total: R$ ${document.getElementById("carrinhoTotal").textContent}`);
    carrinho = [];
    atualizarCarrinho();
    const modal = bootstrap.Modal.getInstance(document.getElementById('carrinhoModal'));
    modal.hide();
}
//-----------------------------------------------------------------------------
// Seleciona todos os botões de agendamento
document.querySelectorAll(".agendar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const servico = btn.dataset.servico; // pega o serviço do data-servico
        const selectServico = document.getElementById("servico");
        if (selectServico) {
            selectServico.value = servico; // seleciona automaticamente
        }
    });
});

