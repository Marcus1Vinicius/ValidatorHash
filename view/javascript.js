console.log("O arquivo javascript.js foi carregado pelo navegador!");

const form = document.getElementById('validadorForm'); 

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const arquivoInput = document.getElementById('arquivoInput');
    const hashInput = document.getElementById('hashInput');

    const arquivoFisico = arquivoInput.files[0];
    const hashTexto = hashInput.value.trim();

    const formData = new FormData();
    formData.append('file', arquivoFisico); // 'file' coincide com o upload.single('file') do Node
    formData.append('hashPolicia', hashTexto); // 'hashPolicia' coincide com o req.body.hashPolicia do Node

    try {
        const response = await fetch(process.env.DB_ENDERECO_API, {
            method: 'POST',
            body: formData // Enviando o pacote completo (arquivo + texto)
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(`Sucesso! ${resultado.message}`);
        } else {
            alert(`ATENÇÃO: ${resultado.message}`);
        }

    } catch (error) {
        console.error('Erro na comunicação com o servidor:', error);
    }
});