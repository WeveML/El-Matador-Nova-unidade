$('#slide-car').flickity({
    // options
    cellAlign: 'center',
    contain: true,
    watchCSS: true,
    freeScroll: true,
    initialIndex: 2,
    prevNextButtons: false,
    pageDots: false
});
var atual = 1;

function r_atual() {
    return parseInt(atual);
}

$('.atualiza').click(function(e) {
    atualiza();
});

async function atualiza() {
    switch (r_atual()) {
        case 1:
            if (await valida_etapa()) {
                desativa($(".parte[data='1']"));
                ativa($(".parte[data='2']"));
                $('.subtitulo').html('Envie o seu palpite e resgate a sua recompensa:');
                atual++;
            } else {
                alert("Email ou CPF já cadastrados.");
            }
            break;
        case 2:
            if (await valida_etapa()) {
                desativa($(".estrutura[data='1']"));
                ativa($(".estrutura[data='2']"));
                atual++;
            } else {
                $('#local').addClass('erro');
                $('.erro-local').addClass('active');
                $(".tremer").removeClass("tremendo");
                $('.tremer').width();
                $(".tremer").addClass("tremendo");
            }
            break;
        case 3:
            desativa($(".estrutura[data='2']"));
            ativa($(".estrutura[data='3']"));
            atual++;

        default:
            atual++;
            break;
    }
}

async function valida_etapa() {
    switch (r_atual()) {
        case 1:
            if ($("#email").valid()) {
                if ($("#cpf").valid()) {
                    if (await verificar_registro()) {
                        return false
                    } else
                        return true;
                }
            }
            break;
        case 2:
            if ($("#local").val().toLowerCase() == "pampulha") {
                return true;
            }
            break;
        default:
            break;
    }
    return false;
}

function ativa(elemento) {
    elemento.addClass('active');
}

function desativa(elemento) {
    elemento.removeClass('active');
}

$(document).ready(function() {
    $('input').keyup(function() {
        regra_botao();
        $(this).next('label').width();
        $(this).next('label').css('display', 'none');
    });
    $('#local').keyup(function() {
        regra_botao();
        $(this).removeClass('erro');
        $('.erro-local').removeClass('active');
    });

    div_premio = $('#premio_fim');
    div_codigo = $('#codigo_fim');
    div_img = $('#img_fim');
    div_conteudo = $('.conteudo');
    h1_cor = $('.h1_cor');
    $('#cpf').mask('000.000.000-00', { reverse: true });
});

function regra_botao() {
    switch (r_atual()) {
        case 1:
            if ($("#email").valid() && $("#cpf").valid()) {
                $(".parte[data='1'] button").attr('disabled', false);
            }
            break;
        case 2:
            if ($("#local").val()) {
                $(".parte[data='2'] button").attr('disabled', false);
            }
            break;
        default:
            break;
    }
}








jQuery.extend(jQuery.validator.messages, {
    required: "Você precisa preencher este campo.",
    email: "Entre com um email válido.",
    minlength: "Entre com um número válido"

});


$("#form-contato").validate({
    rules: {
        email: {
            required: true,
            email: true,
        },
        cpf: {
            required: true,
            minlength: 14,
        },
    },
    messages: {
        cpf: {
            minlength: "Entre com um CPF válido."
        },
    }
});
$("#form-contato").validate();
$('.cartinha').click(function(e) {
    console.log('ui');
    var email = $("#email").val();
    var cpf = $("#cpf").val();
    $.ajax({
        type: "POST",
        url: "/nova-unidade/app/api.php",
        data: {
            'tipo': 'envio',
            'email': email,
            'cpf': cpf,
        },
        dataType: "json",
        success: function(response) {
            fim(response);
            atualiza();
        }
    });
});

function fim(response) {
    gerado = response.gerado;
    voucher = response.voucher;
    estilo(gerado);


    div_codigo.html(voucher);
}

function estilo(gerado) {
    //div_img;
    // ATUALIZA GERAL:
    var texto;
    var img;
    var cor_bg;
    var cor_parabens;
    var cor_textos;
    console.log(gerado);
    div_conteudo.addClass('win');
    if (gerado == 'taco') {
        texto = 'Taco';
        img = 'taco.png';
        cor_bg = 'bgc-vermelho';
        cor_parabens = 'c-amarelo';
        cor_textos = 'c-branco';
    } else if (gerado == 'shot') {
        texto = 'Shot de tequila';
        img = 'shot.png';
        cor_bg = 'bgc-amarelo';
        cor_parabens = 'c-vermelho';
        cor_textos = 'c-preto';
    } else if (gerado == 'burrito') {
        texto = 'Burrito de Frango';
        img = 'burrito.png';
        cor_bg = 'bgc-vermelho';
        cor_parabens = 'c-amarelo';
        cor_textos = 'c-branco';
    } else if (gerado == 'nacho') {
        texto = 'nacho';
        img = 'nacho.png';
        cor_bg = 'bgc-amarelo';
        cor_parabens = 'c-vermelho';
        cor_textos = 'c-preto';
    }
    div_premio.html(texto);
    div_conteudo.addClass(cor_bg);
    div_img.attr('src', './assets/img/' + img);
    h1_cor.addClass(cor_parabens);

    $('.textos_cor').addClass(cor_textos);
    $('.close-modal.desk').attr('src', './assets/img/icon/close-custom.svg');
    $('.txt-apoio').css('display', 'none');

}

$('.close-modal').click(function(e) {
    $('#popup').removeClass('active');
    $('#fundo').removeClass('active');
});
$('.open-modal').click(function(e) {
    $('#popup').addClass('active');
    $('#fundo').addClass('active');
});


$('.fechar-menu').click(function(e) {
    $('.menu-aberto').removeClass('active');
});

$('.abrir-menu').click(function(e) {
    $('.menu-aberto').addClass('active');
});

async function post_verificar_registro() {
    var email = $("#email").val();
    var cpf = $("#cpf").val();
    return $.ajax({
        type: "POST",
        url: "/nova-unidade/app/api.php",
        data: {
            'tipo': 'verificar_registro',
            'email': email,
            'cpf': cpf,
        },
        dataType: "json",
    });
}

async function verificar_registro() {
    var resul = await post_verificar_registro();
    console.log(resul);
    if (resul.existe == "true")
        return true;
    else
        return false;
}