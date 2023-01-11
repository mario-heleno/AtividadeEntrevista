let quantidadeBen = 0;

$(document).ready(function () {
    $('.cpfInput').mask('999.999.999-99');

    let cpfFormatado = formatarCpfCompleto(obj.Cpf);

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Cpf').val(cpfFormatado);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
    }

    if (obj.Beneficiarios.length > 0) {
        obj.Beneficiarios.forEach(function (bn) {
            IncluirBeneficiario(bn);
        });
    }

    // quantidadeBen = $('#BenTableBody tr').length;

    $('#BtBeneficiarios').click(function () {
        $('#ModalBeneficiarios').modal('show');
    });

    $('#BtIncluirBeneficiario').click(function () {
        const cpf = $('#CpfBeneficiario').val();
        const nome = $('#NomeBeneficiario').val();

        const beneficiario = {
            Cpf: cpf,
            Nome: nome
        };

        IncluirBeneficiario(beneficiario);
    });

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        const beneficiariosInvalidos = [];
        const beneficiarios = coletarBeneficiarios();

        beneficiarios.forEach(function (bn) {
            if (!validarCPF(bn.Cpf)) {
                beneficiariosInvalidos.push(`Beneficiario ${bn.Nome} possui CPF inválido, por favor revisar antes de prosseguir`);
            }
        });

        if (beneficiariosInvalidos.length > 0) {
            ModalDialog("Erro", beneficiariosInvalidos.join('.<br>'));
            return;
        };

        let cpfFormatado = formatarCpfNumerico($(this).find("#Cpf").val());
        
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "Cpf": cpfFormatado,
                "Beneficiarios": beneficiarios
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();                                
                window.location.href = urlRetorno;
            }
        });
    })
    
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function IncluirBeneficiario(beneficiario) {

    // Verifica se os campos estão preenchidos
    if (!beneficiario.Cpf || !beneficiario.Nome) {
            ModalDialog("Erro", 'CPF e Nome devem ser preenchidos');
            return;
    }

    // Verifica se CPF já existe na lista
    const beneficiarios = coletarBeneficiarios();

    const cpfExistente = beneficiarios.some(function (bn) {
        return formatarCpfNumerico(beneficiario.Cpf) === bn.Cpf;
    });

    if (cpfExistente) {
        ModalDialog("Erro", 'CPF já existente na lista');
        return;
    }

    // Inclusão
    const idx = quantidadeBen++;

    const cpf = formatarCpfCompleto(beneficiario.Cpf);
    const nome = beneficiario.Nome;

    const htmlRegistro = `
        <tr id="ben-${idx}">
            <th id="ben-cpf-${idx}">${cpf}</th>
            <th id="ben-nome-${idx}">${beneficiario.Nome}</th>
            <th>
                <button type="button" id="ben-alt-${idx}" class="btn btn-sm btn-info">Alterar</button>
                <button type="button" onclick="$('#ben-${idx}').remove();" class="btn btn-sm btn-info">Excluir</button>
            </th>
        </tr>
    `;

    $('#BenTableBody').append(htmlRegistro);

    // Colocando Função no botão
    const idBotao = `#ben-alt-${idx}`;
    $(idBotao).click(function () {
        editarBeneficiario(cpf, nome, idx);
    });

    // Limpando Input
    $('#CpfBeneficiario').val("");
    $('#NomeBeneficiario').val("");
}

function coletarBeneficiarios() {
    const beneficiarios = [];

    for (var i = 0; i < quantidadeBen; i++) {
        const id = '#ben-' + i;
        const registro = $(id);
        if (registro.length > 0) {
            beneficiarios.push({
                Cpf: formatarCpfNumerico($('#ben-cpf-' + i)[0].firstChild.data),
                Nome: $('#ben-nome-' + i)[0].firstChild.data,
                IdCliente: obj.Id
            });
        }
    }

    return beneficiarios;
}

function editarBeneficiario(cpf, nome, idx) {
    const idThCpf = `#ben-cpf-${idx}`;
    const idThNome = `#ben-nome-${idx}`;
    const idBotao = `#ben-alt-${idx}`

    // Coloca os valores nas inputs de edição
    $('#CpfBeneficiarioAlteracao').val(cpf);
    $('#NomeBeneficiarioAlteracao').val(nome);

    // Limpa e colocar o botão para atualizar os valores
    $('#BtAlteracaoBeneficiario').prop("onclick", null).off("click");
    $('#BtAlteracaoBeneficiario').click(function () {
        const cpf = $('#CpfBeneficiarioAlteracao').val();
        const nome = $('#NomeBeneficiarioAlteracao').val();

        // Atribuição do valor
        $(idThCpf).html(cpf);
        $(idThNome).html(nome);

        // Limpar função do botão de edição e configurar uma nova
        $(idBotao).prop("onclick", null).off("click");
        $(idBotao).click(function () {
            editarBeneficiario(cpf, nome, idx);
        });

        // Fechando o formulario
        cancelarEdicao();
    });

    // Libera vizualização do formulario de edição
    $('#formInclusao').css('display', 'none');
    $('#formAlteracao').css('display', 'block');
}

function cancelarEdicao() {
    // Limpar os valores dos inputs
    $('#CpfBeneficiarioAlteracao').val('');
    $('#NomeBeneficiarioAlteracao').val('');

    // Resetando função do click
    $('#BtAlteracaoBeneficiario').prop("onclick", null).off("click");

    // Resetar a vizualização
    $('#formInclusao').css('display', 'block');
    $('#formAlteracao').css('display', 'none');
}