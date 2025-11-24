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
        document.getElementById("endereco").value = data.logradouro || "";
        document.getElementById("bairro")?.value = data.bairro || "";
        document.getElementById("cidade")?.value = data.localidade || "";
        document.getElementById("estado")?.value = data.uf || "";

    } catch (err) {
        console.error("Erro ao buscar CEP:", err);
    }
});
