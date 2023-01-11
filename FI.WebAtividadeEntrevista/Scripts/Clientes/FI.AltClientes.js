let quantidadeBen = 0;

$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Cpf').val(obj.Cpf);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
    }

    quantidadeBen = $('#BenTableBody tr').length;

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

        // Limpando Input
        $('#CpfBeneficiario').val("");
        $('#NomeBeneficiario').val("");
    });

    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        
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
                "Cpf": $(this).find("#Cpf").val(),
                "Beneficiarios": coletarBeneficiario()
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
    const idx = quantidadeBen++;

    const htmlRegistro = `
        <tr id="ben-${idx}">
            <th id="ben-cpf-${idx}">${beneficiario.Cpf}</th>
            <th id="ben-nome-${idx}">${beneficiario.Nome}</th>
            <th>
                <button type="button" onclick="$('#ben-${idx}').remove();" class="btn btn-sm btn-info">Excluir</button>
            </th>
        </tr>
    `;

    $('#BenTableBody').append(htmlRegistro);
}

function coletarBeneficiario() {
    const beneficiarios = [];

    for (var i = 0; i < quantidadeBen; i++) {
        const id = '#ben-' + i;
        const registro = $(id);
        if (registro.length > 0) {
            beneficiarios.push({
                Cpf: $('#ben-cpf-' + i)[0].firstChild.data,
                Nome: $('#ben-nome-' + i)[0].firstChild.data,
                IdCliente: obj.Id
            });
        }
    }

    return beneficiarios;
}